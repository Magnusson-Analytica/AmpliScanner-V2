package com.auditor.service;

import com.auditor.config.AuditorProperties;
import com.auditor.model.CapturedEvent;
import com.auditor.model.ComparisonEntry;
import com.auditor.model.DiscoveryRunResult;
import com.auditor.model.HistoricalComparison;
import com.auditor.model.SavedReportSummary;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Stream;

/**
 * Writes every completed scan to disk as its own timestamped JSON file, so
 * runs are kept as a durable history rather than only living in memory
 * until the next server restart.
 */
@Service
public class ReportPersistenceService {
    private static final Logger log = LoggerFactory.getLogger(ReportPersistenceService.class);
    private static final DateTimeFormatter TIMESTAMP_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss");
    private static final Pattern SAFE_FILE_NAME = Pattern.compile("^[a-zA-Z0-9._-]+\\.json$");

    private final AuditorProperties properties;
    private final ObjectMapper objectMapper;

    public ReportPersistenceService(AuditorProperties properties, ObjectMapper objectMapper) {
        this.properties = properties;
        this.objectMapper = objectMapper;
    }

    public void saveToDisk(DiscoveryRunResult result) {
        if (!properties.getReports().isSaveToDisk()) {
            return;
        }
        try {
            Path directory = Path.of(properties.getReports().getDirectory());
            Files.createDirectories(directory);

            Instant savedAt = result.getFinishedAt() != null ? result.getFinishedAt() : Instant.now();
            String timestamp = TIMESTAMP_FORMAT.format(savedAt.atZone(ZoneId.systemDefault()));
            String fileName = sanitizeHost(result.getTargetUrl()) + "_" + timestamp + ".json";

            Path filePath = directory.resolve(fileName);
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(filePath.toFile(), result);
            log.info("Saved scan report to {}", filePath.toAbsolutePath());
        } catch (IOException e) {
            log.warn("Failed to save report for run {} to disk: {}", result.getRunId(), e.getMessage());
        }
    }

    public List<SavedReportSummary> listSavedReports() {
        Path directory = Path.of(properties.getReports().getDirectory());
        if (!Files.isDirectory(directory)) {
            return List.of();
        }

        List<SavedReportSummary> summaries = new ArrayList<>();
        try (Stream<Path> files = Files.list(directory)) {
            for (Path file : files.filter(p -> p.toString().endsWith(".json")).toList()) {
                try {
                    DiscoveryRunResult result = objectMapper.readValue(file.toFile(), DiscoveryRunResult.class);
                    summaries.add(new SavedReportSummary(
                            file.getFileName().toString(),
                            result.getTargetUrl(),
                            result.getStartedAt(),
                            result.getFinishedAt(),
                            result.getPagesVisited() != null ? result.getPagesVisited().size() : 0,
                            result.getAllCapturedAmplitudeEvents() != null ? result.getAllCapturedAmplitudeEvents().size() : 0,
                            result.isManualLogin(),
                            result.isExhaustive()));
                } catch (IOException e) {
                    log.warn("Skipping unreadable saved report {}: {}", file.getFileName(), e.getMessage());
                }
            }
        } catch (IOException e) {
            log.warn("Failed to list saved reports: {}", e.getMessage());
            return List.of();
        }

        summaries.sort(Comparator.comparing(SavedReportSummary::getFinishedAt,
                Comparator.nullsLast(Comparator.reverseOrder())));
        return summaries;
    }

    public Optional<DiscoveryRunResult> loadReport(String fileName) {
        if (fileName == null || !SAFE_FILE_NAME.matcher(fileName).matches()) {
            return Optional.empty();
        }
        Path directory = Path.of(properties.getReports().getDirectory()).toAbsolutePath().normalize();
        Path filePath = directory.resolve(fileName).normalize();
        if (!filePath.startsWith(directory) || !Files.isRegularFile(filePath)) {
            return Optional.empty();
        }
        try {
            return Optional.of(objectMapper.readValue(filePath.toFile(), DiscoveryRunResult.class));
        } catch (IOException e) {
            log.warn("Failed to load saved report {}: {}", fileName, e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * Diffs the given result against the most recently saved report for the same domain
     * (by host), keyed on (page_url, event_name) pairs. Returns null if no prior report
     * for this domain exists yet - there's nothing to compare against on a first scan.
     */
    public HistoricalComparison computeHistoricalComparison(DiscoveryRunResult current) {
        String currentHost = extractHost(current.getTargetUrl());
        if (currentHost == null) {
            return null;
        }

        Optional<SavedReportSummary> mostRecent = listSavedReports().stream()
                .filter(summary -> currentHost.equalsIgnoreCase(extractHost(summary.getTargetUrl())))
                .findFirst(); // listSavedReports() is already sorted newest-first
        if (mostRecent.isEmpty()) {
            return null;
        }

        Optional<DiscoveryRunResult> previous = loadReport(mostRecent.get().getFileName());
        if (previous.isEmpty()) {
            return null;
        }

        Map<String, CapturedEvent> currentByKey = indexByPageAndEvent(current.getAllCapturedAmplitudeEvents());
        Map<String, CapturedEvent> previousByKey = indexByPageAndEvent(previous.get().getAllCapturedAmplitudeEvents());

        List<ComparisonEntry> newEvents = new ArrayList<>();
        for (Map.Entry<String, CapturedEvent> entry : currentByKey.entrySet()) {
            if (!previousByKey.containsKey(entry.getKey())) {
                newEvents.add(toComparisonEntry(entry.getValue()));
            }
        }

        List<ComparisonEntry> disappearedEvents = new ArrayList<>();
        for (Map.Entry<String, CapturedEvent> entry : previousByKey.entrySet()) {
            if (!currentByKey.containsKey(entry.getKey())) {
                disappearedEvents.add(toComparisonEntry(entry.getValue()));
            }
        }

        HistoricalComparison comparison = new HistoricalComparison();
        comparison.setComparedAgainstFileName(mostRecent.get().getFileName());
        comparison.setComparedAgainstFinishedAt(previous.get().getFinishedAt());
        comparison.setNewEvents(newEvents);
        comparison.setDisappearedEvents(disappearedEvents);
        return comparison;
    }

    private Map<String, CapturedEvent> indexByPageAndEvent(List<CapturedEvent> events) {
        Map<String, CapturedEvent> byKey = new LinkedHashMap<>();
        if (events == null) {
            return byKey;
        }
        for (CapturedEvent event : events) {
            String key = (event.getPageUrl() == null ? "" : event.getPageUrl())
                    + '|' + (event.getEventName() == null ? "" : event.getEventName());
            byKey.putIfAbsent(key, event);
        }
        return byKey;
    }

    private ComparisonEntry toComparisonEntry(CapturedEvent event) {
        return new ComparisonEntry(event.getPageUrl(), event.getEventName());
    }

    private String extractHost(String url) {
        try {
            return new URL(url).getHost();
        } catch (Exception e) {
            return null;
        }
    }

    private String sanitizeHost(String targetUrl) {
        String host = "unknown-host";
        try {
            host = new URL(targetUrl).getHost();
        } catch (MalformedURLException ignored) {
        }
        return host.replaceAll("[^a-zA-Z0-9.-]", "_");
    }
}
