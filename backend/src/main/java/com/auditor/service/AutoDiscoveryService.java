package com.auditor.service;

import com.auditor.config.AuditorProperties;
import com.auditor.model.ActionAttempt;
import com.auditor.model.CapturedEvent;
import com.auditor.model.DiscoveryRunRequest;
import com.auditor.model.DiscoveryRunResult;
import com.auditor.model.PageVisitResult;
import com.auditor.model.ScanProgress;
import com.auditor.model.ScanStatus;
import com.auditor.model.SmartActionDefinition;
import com.auditor.model.TrackingPlanCoverage;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.yaml.snakeyaml.Yaml;

import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Consumer;
import java.util.regex.Pattern;

@Service
public class AutoDiscoveryService {
    private static final Logger log = LoggerFactory.getLogger(AutoDiscoveryService.class);
    private static final String CLICKABLE_SELECTOR = "a, button, [role=button], input[type=submit], input[type=button]";

    private final List<Pattern> amplitudePatterns = new ArrayList<>();
    private final List<SmartActionDefinition> smartActions = new ArrayList<>();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final AuditorProperties properties;

    public AutoDiscoveryService(AuditorProperties properties) {
        this.properties = properties;
    }

    @PostConstruct
    public void init() {
        properties.getAmplitude().getHostPatterns().stream()
                .map(this::toPattern)
                .forEach(amplitudePatterns::add);
        smartActions.addAll(loadSmartActions());
        log.info("Loaded {} smart action definitions", smartActions.size());
    }

    public DiscoveryRunResult discover(DiscoveryRunRequest request, String runId, Consumer<ScanProgress> onProgress) {
        validateUrl(request.getTargetUrl());
        Instant startedAt = Instant.now();

        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(true));
            BrowserContext context = browser.newContext(new Browser.NewContextOptions()
                    .setUserAgent(properties.getDiscovery().getUserAgent()));
            Page page = context.newPage();

            DiscoveryRunResult result = crawlAndBuildResult(request, runId, onProgress, page, startedAt, request.getTargetUrl());
            browser.close();
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Discovery run failed", e);
        }
    }

    /**
     * Runs an entire manual-login scan on the calling thread, start to finish: launches a
     * non-headless browser, navigates to the target URL, hands a {@link PendingLoginSession} to
     * onAwaitingLogin (so the caller can register it and flip the run's status), then BLOCKS this
     * thread until that session is confirmed or the configured timeout elapses. Only once
     * confirmed does it run the normal Smart Action Library + crawl + capture flow and return.
     * <p>
     * Everything Playwright-related happens on this one thread for the run's entire lifetime -
     * Playwright's Java client is not thread-safe across threads, so the confirm-login HTTP
     * request must never touch the Page/Browser itself; it only calls
     * {@link PendingLoginSession#confirmLogin()} to wake this thread up.
     *
     * @throws ManualLoginExpiredException if not confirmed within auditor.discovery.manual-login-timeout-ms
     */
    public DiscoveryRunResult runManualLoginScan(DiscoveryRunRequest request, String runId, Consumer<ScanProgress> onProgress,
                                                  Consumer<PendingLoginSession> onAwaitingLogin) {
        validateUrl(request.getTargetUrl());

        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(false));
            BrowserContext context = browser.newContext(new Browser.NewContextOptions()
                    .setUserAgent(properties.getDiscovery().getUserAgent()));
            Page page = context.newPage();
            page.navigate(request.getTargetUrl(),
                    new Page.NavigateOptions().setTimeout(properties.getDiscovery().getNavigationTimeoutMs()));

            PendingLoginSession session = new PendingLoginSession(page, request, Instant.now());
            onAwaitingLogin.accept(session);

            try {
                session.getLoginConfirmedSignal().get(properties.getDiscovery().getManualLoginTimeoutMs(), TimeUnit.MILLISECONDS);
            } catch (TimeoutException e) {
                browser.close();
                throw new ManualLoginExpiredException("Manual login was not confirmed within "
                        + properties.getDiscovery().getManualLoginTimeoutMs() + "ms; the session was closed");
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                browser.close();
                throw new RuntimeException("Interrupted while waiting for manual login confirmation", e);
            } catch (ExecutionException e) {
                browser.close();
                throw new RuntimeException("Manual login confirmation failed", e);
            }

            // Start crawling from wherever the page actually is now (post-login), not the
            // pre-login URL - the user may have been redirected elsewhere during login, and
            // forcing a navigate back to the original URL can undo the authenticated state
            // they just established (e.g. re-visiting a login/callback URL a second time).
            // Read the URL via evaluate() rather than page.url() - after this thread has been
            // idle (blocked purely in Java, no Playwright calls) for however long the user took
            // to log in, page.url() can return a client-side-cached pre-navigation value;
            // evaluate() forces a live round-trip into the page's own JS context instead.
            String resumeUrl = String.valueOf(page.evaluate("() => window.location.href"));
            DiscoveryRunResult result = crawlAndBuildResult(request, runId, onProgress, page, Instant.now(), resumeUrl);
            browser.close();
            return result;
        } catch (ManualLoginExpiredException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Discovery run failed after manual login", e);
        }
    }

    private DiscoveryRunResult crawlAndBuildResult(DiscoveryRunRequest request, String runId, Consumer<ScanProgress> onProgress,
                                                    Page page, Instant startedAt, String startUrl) {
        int requestedMaxDepth = request.getMaxDepth() != null ? request.getMaxDepth() : properties.getDiscovery().getMaxDepth();
        int requestedMaxPages = request.getMaxPages() != null ? request.getMaxPages() : properties.getDiscovery().getMaxPages();
        int effectiveMaxDepth = Math.max(0, Math.min(requestedMaxDepth, properties.getDiscovery().getHardMaxDepth()));
        int effectiveMaxPages = Math.max(1, Math.min(requestedMaxPages, properties.getDiscovery().getHardMaxPages()));

        String originHost;
        try {
            originHost = new URL(startUrl).getHost();
        } catch (MalformedURLException e) {
            throw new IllegalArgumentException("Invalid URL: " + startUrl, e);
        }

        List<CapturedEvent> capturedEvents = new CopyOnWriteArrayList<>();
        List<PageVisitResult> pagesVisited = new ArrayList<>();
        AtomicReference<String> currentPageUrl = new AtomicReference<>();

        page.onRequest(requestEvent -> {
                try {
                    String url = requestEvent.url();
                    if (matchesAmplitudeHost(url)) {
                        String postData = requestEvent.postData();
                        if (postData != null && !postData.isBlank()) {
                            capturedEvents.addAll(parseAmplitudePayload(postData, currentPageUrl.get()));
                        }
                    }
                } catch (Exception e) {
                    log.warn("Failed to parse intercepted request {}", requestEvent.url(), e);
                }
            });

            Deque<QueueItem> queue = new ArrayDeque<>();
            Set<String> visited = new HashSet<>();
            queue.add(new QueueItem(startUrl, 0));

            while (!queue.isEmpty() && pagesVisited.size() < effectiveMaxPages) {
                QueueItem item = queue.poll();
                String normalized = normalize(item.url);
                if (visited.contains(normalized)) {
                    continue;
                }
                visited.add(normalized);

                try {
                    page.navigate(item.url, new Page.NavigateOptions().setTimeout(properties.getDiscovery().getNavigationTimeoutMs()));
                } catch (Exception e) {
                    log.warn("Failed to navigate to {}: {}", item.url, e.getMessage());
                    continue;
                }

                currentPageUrl.set(item.url);
                boolean dataLayerPresent = detectDataLayer(page);
                int pageEventsStart = capturedEvents.size();
                String normalizedPageUrl = normalize(item.url);
                List<ActionAttempt> attempts = new ArrayList<>();
                for (SmartActionDefinition action : smartActions) {
                    attempts.add(attemptAction(page, action, capturedEvents));

                    // Some actions (sign up, login, external CTAs) legitimately navigate
                    // away - often to a different subdomain entirely (e.g. an auth provider).
                    // Restore the original page before the next action, so later actions and
                    // the link-collection pass don't operate on the wrong page.
                    if (!normalize(page.url()).equals(normalizedPageUrl)) {
                        try {
                            page.navigate(item.url, new Page.NavigateOptions().setTimeout(properties.getDiscovery().getNavigationTimeoutMs()));
                        } catch (Exception e) {
                            log.warn("Failed to restore page after action drift on {}: {}", item.url, e.getMessage());
                        }
                    }
                }

                if (request.isExhaustive()) {
                    attempts.addAll(runExhaustiveSweep(page, capturedEvents, item.url, normalizedPageUrl));
                }

                List<CapturedEvent> pageEvents = dedupeEvents(capturedEvents.subList(pageEventsStart, capturedEvents.size()));
                pagesVisited.add(new PageVisitResult(item.url, attempts, pageEvents, dataLayerPresent));

                if (onProgress != null) {
                    int eventsSoFar = pagesVisited.stream().mapToInt(p -> p.getCapturedEvents().size()).sum();
                    onProgress.accept(new ScanProgress(runId, ScanStatus.RUNNING, pagesVisited.size(), eventsSoFar, item.url, null, null));
                }

                if (item.depth < effectiveMaxDepth) {
                    for (String link : collectSameOriginLinks(page, originHost)) {
                        String normalizedLink = normalize(link);
                        if (!visited.contains(normalizedLink)) {
                            queue.add(new QueueItem(link, item.depth + 1));
                        }
                    }
                }

                sleepQuietly(properties.getDiscovery().getPoliteDelayMs());
            }

        DiscoveryRunResult result = new DiscoveryRunResult();
        result.setRunId(runId);
        result.setTargetUrl(request.getTargetUrl());
        result.setStartedAt(startedAt);
        result.setFinishedAt(Instant.now());
        result.setPagesVisited(pagesVisited);
        List<CapturedEvent> allEvents = new ArrayList<>();
        for (PageVisitResult pageVisit : pagesVisited) {
            allEvents.addAll(pageVisit.getCapturedEvents());
        }
        result.setAllCapturedAmplitudeEvents(allEvents);
        result.setTrackingPlanCoverage(computeTrackingPlanCoverage(request.getExpectedEventNames(), capturedEvents));
        result.setEffectiveMaxDepth(effectiveMaxDepth);
        result.setEffectiveMaxPages(effectiveMaxPages);
        result.setExhaustive(request.isExhaustive());
        return result;
    }

    private TrackingPlanCoverage computeTrackingPlanCoverage(List<String> expectedEventNames, List<CapturedEvent> capturedEvents) {
        if (expectedEventNames == null || expectedEventNames.isEmpty()) {
            return null;
        }

        Set<String> observedNames = new HashSet<>();
        for (CapturedEvent event : capturedEvents) {
            if (event.getEventName() != null) {
                observedNames.add(event.getEventName());
            }
        }

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();
        for (String expected : expectedEventNames) {
            if (expected == null || expected.isBlank()) {
                continue;
            }
            if (observedNames.contains(expected)) {
                matched.add(expected);
            } else {
                missing.add(expected);
            }
        }

        return new TrackingPlanCoverage(matched.size() + missing.size(), matched.size(), matched, missing);
    }

    private static final int[] SCROLL_STEP_PERCENTAGES = {25, 50, 75, 100};

    private ActionAttempt attemptAction(Page page, SmartActionDefinition action, List<CapturedEvent> capturedEvents) {
        if (action.getType() == SmartActionDefinition.Type.SCROLL) {
            int before = capturedEvents.size();
            int scrollStepWaitMs = properties.getDiscovery().getScrollStepWaitMs();
            for (int pct : SCROLL_STEP_PERCENTAGES) {
                double fraction = pct / 100.0;
                runWithEventWait(page, scrollStepWaitMs,
                        () -> page.evaluate("window.scrollTo(0, document.body.scrollHeight * " + fraction + ")"));
            }
            tagNewEvents(capturedEvents, before, action.getName());
            return new ActionAttempt(action.getName(), true, null);
        }

        Optional<String> selector = resolveSelector(page, action);
        if (selector.isEmpty()) {
            return new ActionAttempt(action.getName(), false, null);
        }

        String selectorUsed = selector.get();
        int before = capturedEvents.size();
        int pollTimeoutMs = properties.getDiscovery().getActionPollTimeoutMs();

        if (action.getType() == SmartActionDefinition.Type.HOVER) {
            runWithEventWait(page, pollTimeoutMs, () -> page.hover(selectorUsed, new Page.HoverOptions().setTimeout(2000)));
        } else {
            runWithEventWait(page, pollTimeoutMs, () -> page.click(selectorUsed, new Page.ClickOptions().setTimeout(2000)));
        }

        tagNewEvents(capturedEvents, before, action.getName());
        return new ActionAttempt(action.getName(), true, selectorUsed);
    }

    private void runWithEventWait(Page page, int timeoutMs, Runnable actionRunnable) {
        try {
            page.waitForRequest(
                    req -> matchesAmplitudeHost(req.url()),
                    new Page.WaitForRequestOptions().setTimeout(timeoutMs),
                    actionRunnable::run);
        } catch (Exception e) {
            // Either the action itself failed, or it succeeded but no Amplitude request
            // followed within the poll window - both are expected/tolerable outcomes here.
        }
    }

    private List<ActionAttempt> runExhaustiveSweep(Page page, List<CapturedEvent> capturedEvents,
                                                    String originalUrl, String normalizedPageUrl) {
        List<ActionAttempt> attempts = new ArrayList<>();
        List<String> excludeKeywords = properties.getDiscovery().getExhaustiveExcludeKeywords();

        try {
            Locator clickable = page.locator(CLICKABLE_SELECTOR);
            int count = Math.min(clickable.count(), properties.getDiscovery().getExhaustiveMaxElements());
            List<String> texts = clickable.allTextContents();

            for (int i = 0; i < count; i++) {
                final int idx = i;
                String rawText = i < texts.size() && texts.get(i) != null ? texts.get(i).trim() : "";
                String label = "EXHAUSTIVE: " + (rawText.isEmpty() ? "(element " + idx + ")" : truncate(rawText, 40));

                if (isDangerousText(rawText, excludeKeywords)) {
                    attempts.add(new ActionAttempt(label + " [skipped, matched exclude list]", false, null));
                    continue;
                }

                String selectorUsed = CLICKABLE_SELECTOR + " >> nth=" + idx;
                int before = capturedEvents.size();
                runWithEventWait(page, properties.getDiscovery().getActionPollTimeoutMs(),
                        () -> clickable.nth(idx).click(new Locator.ClickOptions().setTimeout(1500)));
                tagNewEvents(capturedEvents, before, label);
                attempts.add(new ActionAttempt(label, true, selectorUsed));

                if (!normalize(page.url()).equals(normalizedPageUrl)) {
                    try {
                        page.navigate(originalUrl, new Page.NavigateOptions().setTimeout(properties.getDiscovery().getNavigationTimeoutMs()));
                    } catch (Exception e) {
                        log.warn("Failed to restore page after exhaustive click drift on {}: {}", originalUrl, e.getMessage());
                        break;
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Exhaustive sweep failed on {}: {}", originalUrl, e.getMessage());
        }

        return attempts;
    }

    private boolean isDangerousText(String text, List<String> excludeKeywords) {
        if (text == null || text.isBlank() || excludeKeywords == null) {
            return false;
        }
        String lower = text.toLowerCase();
        return excludeKeywords.stream().anyMatch(lower::contains);
    }

    private String truncate(String text, int maxLength) {
        return text.length() <= maxLength ? text : text.substring(0, maxLength) + "...";
    }

    private List<CapturedEvent> dedupeEvents(List<CapturedEvent> events) {
        Map<String, CapturedEvent> merged = new LinkedHashMap<>();
        for (CapturedEvent event : events) {
            String key = (event.getEventName() == null ? "" : event.getEventName()) + '|'
                    + (event.getPageUrl() == null ? "" : event.getPageUrl()) + '|'
                    + (event.getMatchedActionName() == null ? "" : event.getMatchedActionName());
            CapturedEvent existing = merged.get(key);
            if (existing == null) {
                event.setCount(1);
                merged.put(key, event);
            } else {
                existing.setCount(existing.getCount() + 1);
            }
        }
        return new ArrayList<>(merged.values());
    }

    private void tagNewEvents(List<CapturedEvent> capturedEvents, int fromIndexInclusive, String actionName) {
        for (int i = fromIndexInclusive; i < capturedEvents.size(); i++) {
            CapturedEvent event = capturedEvents.get(i);
            if (event.getMatchedActionName() == null && !isSystemEventName(event.getEventName())) {
                event.setMatchedActionName(actionName);
            }
        }
    }

    private Optional<String> resolveSelector(Page page, SmartActionDefinition action) {
        for (String sel : action.getSelectors() != null ? action.getSelectors() : List.<String>of()) {
            try {
                Locator loc = page.locator(sel).first();
                if (loc.count() > 0 && loc.isVisible()) {
                    return Optional.of(sel);
                }
            } catch (Exception ignored) {
            }
        }

        List<String> textMatches = action.getTextMatches() != null ? action.getTextMatches() : List.of();
        if (textMatches.isEmpty()) {
            return Optional.empty();
        }

        try {
            Locator loc = page.locator(CLICKABLE_SELECTOR);
            int count = Math.min(loc.count(), 200);
            if (count == 0) {
                return Optional.empty();
            }
            List<String> texts = loc.allTextContents();
            for (int i = 0; i < texts.size() && i < count; i++) {
                String text = texts.get(i) == null ? "" : texts.get(i).trim().toLowerCase();
                if (text.isEmpty()) {
                    continue;
                }
                for (String phrase : textMatches) {
                    if (text.contains(phrase.toLowerCase())) {
                        String nthSelector = CLICKABLE_SELECTOR + " >> nth=" + i;
                        if (loc.nth(i).isVisible()) {
                            return Optional.of(nthSelector);
                        }
                    }
                }
            }
        } catch (Exception ignored) {
        }
        return Optional.empty();
    }

    private static final String NAV_TOP_LEVEL_SELECTOR =
            "header nav a, header nav button, nav > ul > li > a, nav > ul > li > button, "
                    + "[role=navigation] a, [role=navigation] button, "
                    + "[class*=nav-main] > li > a, [class*=nav-main] li a, ul[class*=nav] > li > a, header [class*=menu] a";

    private List<String> collectSameOriginLinks(Page page, String originHost) {
        Set<String> allLinks = new LinkedHashSet<>(scrapeCurrentLinks(page, originHost));

        // Mega-menus often only render their submenu links once the top-level nav item
        // is hovered/opened, so a single scrape right after page load misses them entirely.
        // Hovering (never clicking) each top-level nav item and re-scraping catches those
        // without risking navigating into a real link.
        try {
            Locator navItems = page.locator(NAV_TOP_LEVEL_SELECTOR);
            int count = Math.min(navItems.count(), 15);
            for (int i = 0; i < count; i++) {
                try {
                    navItems.nth(i).hover(new Locator.HoverOptions().setTimeout(1000));
                    page.waitForTimeout(200);
                    allLinks.addAll(scrapeCurrentLinks(page, originHost));
                } catch (Exception ignored) {
                }
            }
        } catch (Exception ignored) {
        }

        return new ArrayList<>(allLinks);
    }

    @SuppressWarnings("unchecked")
    private List<String> scrapeCurrentLinks(Page page, String originHost) {
        try {
            Object hrefs = page.evaluate("Array.from(document.querySelectorAll('a[href]')).map(a => a.href)");
            List<String> result = new ArrayList<>();
            for (Object href : (List<Object>) hrefs) {
                try {
                    URL url = new URL(String.valueOf(href));
                    if (!url.getProtocol().startsWith("http")) {
                        continue;
                    }
                    if (url.getHost().equalsIgnoreCase(originHost)) {
                        result.add(url.toString());
                    }
                } catch (MalformedURLException ignored) {
                }
            }
            return result;
        } catch (Exception e) {
            return List.of();
        }
    }

    private boolean detectDataLayer(Page page) {
        try {
            Object result = page.evaluate("Array.isArray(window.dataLayer) && window.dataLayer.length > 0");
            return Boolean.TRUE.equals(result);
        } catch (Exception e) {
            return false;
        }
    }

    private String normalize(String url) {
        try {
            URL u = new URL(url);
            String path = u.getPath().isEmpty() ? "/" : u.getPath();
            return u.getProtocol() + "://" + u.getHost() + path;
        } catch (MalformedURLException e) {
            return url;
        }
    }

    private void sleepQuietly(int millis) {
        if (millis <= 0) {
            return;
        }
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private void validateUrl(String targetUrl) {
        try {
            new URL(targetUrl);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid URL: " + targetUrl, e);
        }
    }

    private boolean matchesAmplitudeHost(String urlString) {
        try {
            URL url = new URL(urlString);
            String hostAndPath = url.getHost() + url.getPath();
            return amplitudePatterns.stream().anyMatch(pattern -> pattern.matcher(hostAndPath).matches());
        } catch (MalformedURLException e) {
            return false;
        }
    }

    private Pattern toPattern(String raw) {
        if (raw.startsWith("/") && raw.endsWith("/")) {
            return Pattern.compile(raw.substring(1, raw.length() - 1));
        }
        String escaped = raw.replace(".", "\\.").replace("*", ".*");
        return Pattern.compile("^" + escaped + ".*", Pattern.CASE_INSENSITIVE);
    }

    private List<CapturedEvent> parseAmplitudePayload(String postData, String pageUrl) throws JsonProcessingException {
        String jsonCandidate = postData.trim();

        if (!jsonCandidate.startsWith("{") && !jsonCandidate.startsWith("[")) {
            // Legacy Amplitude HTTP API v1 (the older "amplitude-js" SDK): a form-encoded
            // body where the "e" parameter holds a URL-encoded JSON array of events,
            // rather than a JSON request body like the newer Browser SDK (v2 httpapi) sends.
            String eParam = extractFormParam(jsonCandidate, "e");
            if (eParam == null) {
                return List.of();
            }
            jsonCandidate = java.net.URLDecoder.decode(eParam, java.nio.charset.StandardCharsets.UTF_8);
        }

        JsonNode root = objectMapper.readTree(jsonCandidate);
        List<CapturedEvent> results = new ArrayList<>();

        if (root.isArray()) {
            for (JsonNode child : root) {
                results.add(buildEvent(child, pageUrl));
            }
            return results;
        }

        if (root.has("event_type")) {
            results.add(buildEvent(root, pageUrl));
        }

        if (root.has("events") && root.get("events").isArray()) {
            for (JsonNode child : root.get("events")) {
                results.add(buildEvent(child, pageUrl));
            }
        }

        if (results.isEmpty() && root.has("event")) {
            results.add(buildEvent(root.get("event"), pageUrl));
        }

        return results;
    }

    private String extractFormParam(String body, String key) {
        for (String pair : body.split("&")) {
            int idx = pair.indexOf('=');
            if (idx > 0 && pair.substring(0, idx).equals(key)) {
                return pair.substring(idx + 1);
            }
        }
        return null;
    }

    private static final Pattern AUTOCAPTURE_EVENT_NAME = Pattern.compile("^(\\$.+|\\[.+\\].*)$");
    private static final Set<String> KNOWN_SYSTEM_EVENT_NAMES = Set.of(
            "session_start", "session_end", "viewed page", "clicked link", "clicked button", "page scrolled");

    private boolean isSystemEventName(String eventName) {
        if (eventName == null) {
            return false;
        }
        return AUTOCAPTURE_EVENT_NAME.matcher(eventName).matches()
                || KNOWN_SYSTEM_EVENT_NAMES.contains(eventName.toLowerCase());
    }

    private CapturedEvent buildEvent(JsonNode node, String pageUrl) {
        String eventName = null;
        if (node.has("event_type")) {
            eventName = node.get("event_type").asText();
        } else if (node.has("eventName")) {
            eventName = node.get("eventName").asText();
        }
        String raw = node.toString();
        CapturedEvent event = new CapturedEvent(eventName, Instant.now(), raw, pageUrl, null);
        event.setTrackingMethod(classifyTrackingMethod(node, eventName));
        return event;
    }

    private String classifyTrackingMethod(JsonNode node, String eventName) {
        String libraryName = null;
        if (node.has("library")) {
            JsonNode library = node.get("library");
            if (library.isObject() && library.has("name")) {
                libraryName = library.get("name").asText();
            } else if (library.isTextual()) {
                libraryName = library.asText();
            }
        }
        if (libraryName != null && libraryName.toLowerCase().contains("gtm")) {
            return "DATALAYER_GTM";
        }
        if (eventName != null && AUTOCAPTURE_EVENT_NAME.matcher(eventName).matches()) {
            return "AUTOCAPTURE";
        }
        return "CUSTOM_SDK";
    }

    private List<SmartActionDefinition> loadSmartActions() {
        try (InputStream in = getClass().getClassLoader().getResourceAsStream("smart-actions.yml")) {
            if (in == null) {
                log.warn("smart-actions.yml not found on classpath; no smart actions will be attempted");
                return List.of();
            }
            Map<String, Object> root = new Yaml().load(in);
            Object actionsObj = root.get("actions");
            List<SmartActionDefinition> definitions = new ArrayList<>();
            if (actionsObj instanceof List<?> actionsList) {
                for (Object entry : actionsList) {
                    if (entry instanceof Map<?, ?> map) {
                        SmartActionDefinition def = new SmartActionDefinition();
                        def.setName(String.valueOf(map.get("name")));
                        Object typeVal = map.get("type");
                        def.setType(typeVal != null
                                ? SmartActionDefinition.Type.valueOf(String.valueOf(typeVal))
                                : SmartActionDefinition.Type.CLICK);
                        def.setSelectors(castStringList(map.get("selectors")));
                        def.setTextMatches(castStringList(map.get("textMatches")));
                        definitions.add(def);
                    }
                }
            }
            return definitions;
        } catch (Exception e) {
            log.error("Failed to load smart-actions.yml", e);
            return List.of();
        }
    }

    private static List<String> castStringList(Object value) {
        List<String> result = new ArrayList<>();
        if (value instanceof List<?> list) {
            for (Object o : list) {
                result.add(String.valueOf(o));
            }
        }
        return result;
    }

    private static final class QueueItem {
        final String url;
        final int depth;

        QueueItem(String url, int depth) {
            this.url = url;
            this.depth = depth;
        }
    }
}
