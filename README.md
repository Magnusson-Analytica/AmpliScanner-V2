# AmpliScanner

A full-stack tool that autonomously scans a website and reports every Amplitude
analytics event that actually fires, without requiring anyone to define test
steps by hand. Paste a URL, run a scan, and get back a report of which pages
were visited, which common UI interactions were found and attempted, and
exactly what Amplitude events (and via what tracking method) were observed on
each page.

## What it does

1. Launches a headless Chromium browser (Playwright) with a realistic
   desktop user-agent.
2. Crawls the target site breadth-first, starting from the given URL,
   following same-origin links up to a configurable depth and page count.
3. On every page it visits, it automatically tries a library of common UI
   interactions (the **Smart Action Library** — see below) — no manual step
   definitions needed. An optional **exhaustive mode** goes further and tries
   every clickable element on the page, not just recognized patterns.
4. It intercepts every network request going to Amplitude's ingestion
   endpoints, parses the event(s) out of the request body (both the current
   JSON API and the legacy form-encoded `amplitude-js` API), and records them.
5. It classifies each captured event by how it was likely sent — via a GTM/
   dataLayer wrapper, via Amplitude's own autocapture/plugins, or via a direct
   SDK call — and flags that server-side-sent events are architecturally
   invisible to a browser-based scanner.
6. It can optionally compare what fired during the scan against a list of
   event names from your Amplitude tracking plan, reporting which expected
   events were observed and which weren't.
7. Scans run asynchronously with live progress, and every completed scan is
   saved to disk automatically, browsable later from the **Reports** tab and
   automatically diffed against the previous scan of the same site.
8. The report is organized per page, and within each page, events are
   grouped by tracking method. Expanding an event shows its own relevant
   fields as a table (e.g. the clicked element's selector, or a page view's
   URL) rather than raw JSON — with CSV/JSON export for the whole report.
9. Sites that require a login can be scanned by checking **Manual login
   before scanning**, which pauses for you to authenticate by hand in a
   visible browser window before the automated scan continues.

## Tech stack

- **Backend**: Java 17, Spring Boot 3, Maven, Microsoft Playwright for Java.
- **Frontend**: React + TypeScript, Vite.
- **Communication**: REST/JSON between the two, CORS-enabled for local dev.

## Project structure

```
backend/
  src/main/java/com/auditor/
    AuditorApplication.java
    config/AuditorProperties.java        # typed config, bound from application.yml
    controller/AuditController.java      # REST endpoints
    model/                               # request/response DTOs
    service/AutoDiscoveryService.java    # the crawler + capture + classification engine
    service/AuditRunStorage.java         # in-memory run storage, keyed by runId
    service/ScanProgressStorage.java     # in-memory live progress per runId
    service/ReportPersistenceService.java # saves/lists/loads reports on disk
    service/PendingLoginSession.java     # signals a paused manual-login run's background thread
    service/PendingLoginSessionRegistry.java # tracks paused sessions by runId, for confirm-login
    service/ManualLoginExpiredException.java # thrown when a login isn't confirmed in time
  src/main/resources/
    application.yml                      # runtime config
    smart-actions.yml                    # the Smart Action Library, edit without recompiling
  reports/                               # every completed scan, saved automatically
frontend/
  src/
    components/Navbar.tsx                # Scan / Reports tabs
    components/ScanForm.tsx              # target URL + advanced options + manual-login toggle + scan buttons
    components/ResultsView.tsx           # per-page report, grouped by tracking method, exports
    components/ReportsHistory.tsx        # lists and re-opens saved reports
    api.ts                               # typed fetch wrapper
    App.tsx
```

## Running it

**Backend** (from `backend/`):
```
mvn spring-boot:run
```
Serves the API on `http://localhost:8080`.

**Frontend** (from `frontend/`):
```
npm install
npm run dev
```
Serves the UI on `http://localhost:5173`.

Open `http://localhost:5173`. The navbar has two tabs:

- **Scan** — enter a target URL, optionally expand "Advanced options" for
  `maxDepth`/`maxPages`/expected tracking-plan events, then click either
  **Run Full Tracking** (the Smart Action Library only) or **Run Exhaustive
  Scan** (see below — asks for confirmation first, since it's slower and
  riskier). The scan runs in the background; a live progress line shows pages
  visited and events captured so far.
- **Reports** — every completed scan, newest first. Click one to view it
  again exactly as it looked right after the scan finished.

## The Smart Action Library

`backend/src/main/resources/smart-actions.yml` defines every interaction the
crawler attempts on each page, in order. Each entry has a `type` (`CLICK`,
`HOVER`, or `SCROLL`), an ordered list of CSS `selectors` to try first, and a
fallback list of `textMatches` (case-insensitive substrings matched against
visible text of links/buttons on the page). Add, remove, or retune entries
here and just restart the backend — no code changes needed.

Current actions, attempted in this order on every page:

1. **`ACCEPT_COOKIES`** — OneTrust/Cookiebot/generic consent banners. Runs
   first, since an unaccepted banner otherwise blocks Amplitude entirely.
2. **`SIGN_UP`** — sign-up/register/get-started CTAs.
3. **`GO_HOME`** — the header logo or a "home" link.
4. **`OPEN_MENU`** — hamburger/mobile nav toggles.
5. **`SUBMIT_SEARCH`** — a visible search input or search button.
6. **`ADD_TO_CART`** — ecommerce "add to cart"/"add to bag" controls.
7. **`CLICK_PRIMARY_CTA`** — hero/primary buttons ("book a call", "contact
   us", "learn more", etc.).
8. **`OPEN_DROPDOWN`** — `aria-haspopup` elements and dropdown toggles.
9. **`SWITCH_TAB`** — `role=tab` / tab-strip controls.
10. **`PLAY_VIDEO`** — video-player play buttons (custom players, YouTube).
11. **`HOVER_NAV_MENU`** — hovers (never clicks) top-level nav items that look
    like they open a submenu.
12. **`SCROLL_TO_BOTTOM`** — scrolls in four increments (25/50/75/100%) to
    catch scroll-depth-triggered events, not just a single jump to the bottom.

If an action navigates away from the page being audited (common for sign-up/
login CTAs, which often redirect to a separate auth subdomain), the crawler
detects the drift and navigates back before trying the next action, so one
wayward click doesn't derail the rest of that page's audit or the link
discovery pass.

In the report, each matched action shows the selector that found it — but
only when it's a real, informative CSS pattern from the YAML config. Actions
that matched by visible text (an internal "nth clickable element" fallback)
show no selector, since that syntax isn't meaningful to a reader. Long
selectors are truncated in the badge with the full value available on hover.

## Exhaustive mode

**Run Exhaustive Scan** does everything Full Tracking does, plus: on every
page, it tries clicking every clickable element it finds (up to
`auditor.discovery.exhaustive-max-elements`, default 40), not just ones
matching a known pattern. Elements whose visible text matches a danger-word
list (`delete`, `buy`, `checkout`, `unsubscribe`, `logout`, etc. — configurable
via `auditor.discovery.exhaustive-exclude-keywords`) are skipped rather than
clicked. Each attempt is recorded in the report as `EXHAUSTIVE: <element
text>`, distinct from the named Smart Action Library entries.

This is slower and carries more residual risk on a live/production site than
Full Tracking (it can still click things the exclude-list doesn't anticipate),
so the UI asks for confirmation before starting.

## Link discovery

After running the action library on a page, the crawler collects every
same-origin `<a href>` on the page, and additionally hovers each top-level
navigation item first (never clicks, to avoid accidentally following a real
link) and re-scrapes — some mega-menus only render their submenu links once
the parent item is interacted with.

## Tracking method classification

Every captured event is tagged with one of:
- **`DATALAYER_GTM`** — the Amplitude library name contains "gtm" (the GTM
  wrapper build) or `window.dataLayer` is present and non-empty on the page.
- **`AUTOCAPTURE`** — event name matches Amplitude's own system/plugin naming
  convention (`$identify`, `$impression`, `[Amplitude] ...`, etc.) — generated
  automatically by SDK plugins, not by app code.
- **`CUSTOM_SDK`** — a custom event sent directly through the SDK, not GTM,
  not an autocapture system event.

The report is organized **page first, then by tracking method** within each
page — a site with many pages and heavy autocapture traffic (impressions,
guides, session events) stays readable instead of turning into one giant
cross-page list.

**Server-side tracking cannot be detected by this tool** — those events are
sent directly from the client's backend to Amplitude and never pass through
the browser, so they're architecturally invisible to a Playwright-based
scanner. The report says this explicitly rather than pretending to check.

## Event details

Expanding an event in the results view shows its fields as a table instead
of a raw JSON dump - top-level fields (`event_type`, `time` as a readable
date, `library`, `device_id`, etc.) first, then a labeled sub-table for each
nested object the payload actually carries (`event_properties`,
`user_properties`, `plan`, `ingestion_metadata`, ...). Because it just
reflects whatever fields that specific event sent, it adapts per event type
with no hardcoded per-event layout: a `[Amplitude] Element Clicked` event
surfaces its element selector/text/tag, a `[Amplitude] Page Viewed` event
surfaces its page URL/path/title, and so on. A **View raw JSON** link under
the table still shows the untouched payload for anything the table doesn't
surface.

## Action attribution

Each captured event's "triggered by X" label is only set when the event looks
like a genuine outcome of that action. System/autocapture-style events —
names starting with `$` or `[...]`, plus a short list of known generic names
(`session_start`, `session_end`, `viewed page`, `clicked link`, `clicked
button`, `page scrolled`) — are left unattributed even if they happened to
fire right after some action, since they're really passive/automatic traffic,
not a direct consequence of that specific click. This matters most when an
action causes a full page navigation: without this, every autocapture event
from the new page's load would misleadingly show up as "triggered by" the
action that merely happened to precede it.

## Tracking plan coverage

The scan form has an optional "Expected events from your tracking plan"
field (one event name per line). If filled in, the report includes a
coverage banner: how many of those names were actually observed during the
scan, and which ones weren't. This is a plain client-side text comparison —
there's no live connection to the Amplitude Management API baked into the
app (that would need per-user API/secret key credentials); paste the event
names in from wherever your tracking plan lives.

## Reports history

Every completed scan is automatically written to `backend/reports/` as its
own timestamped JSON file (e.g. `yogananda.org_20260812-105934.json`),
containing the full result. The **Reports** tab lists them (newest first,
with URL/date/page-count/event-count) and re-opens any of them in the same
results view used right after a scan — this history survives backend
restarts, unlike the in-memory run store used for the legacy export endpoint
(see "Export" below).

Controlled by `auditor.reports.save-to-disk` (default `true`) and
`auditor.reports.directory` (default `reports`, relative to where the
backend runs).

## Historical comparison

When a scan finishes, the backend looks for the most recent previously saved
report for the same host and diffs the two by `page URL + event name`. If a
prior report is found, the results view shows a banner with two lists:
**new** events (present now, absent from the previous scan) and
**disappeared** events (present before, not observed this time). This runs
automatically on every scan - no setup needed - and is skipped only when no
earlier report for that host exists yet (e.g. the very first scan of a
site). It's a page-and-event-name diff, not a payload-level diff - if an
event's own properties changed but its name and page didn't, that won't show
up as new or disappeared.

## Duplicate events

Amplitude SDKs retry failed sends, and autocapture can fire the same event
name many times on one page (e.g. one `$impression` per element in the
viewport). Identical events (same event name + page + triggering action) are
collapsed into one entry with a `count`, both in the UI and in CSV exports,
so the report isn't drowned in repeats.

## Async execution & progress

`POST /api/audit/discover` returns immediately (`202 Accepted`) with
`{ "runId": "..." }` rather than blocking until the crawl finishes — a scan
over several pages can take minutes. Poll `GET
/api/audit/discover/{runId}/status` to get the current status (`RUNNING`,
`COMPLETED`, or `FAILED`), pages visited and events captured so far, and once
`COMPLETED`, the full result embedded in the response. The frontend polls
this every 1.5s and shows the running totals as a live progress line.

## Manual login before scanning

Some sites only expose their tracked flows behind a login wall, and the
crawler has no credentials of its own. Checking **Manual login before
scanning** on the Scan form changes how that one run starts, without
affecting any other scan:

1. Instead of a headless browser, the backend launches a **visible** Chromium
   window and navigates it to the target URL, then stops there — no Smart
   Action Library, no crawling, no event capture yet. The scan's status is
   `AWAITING_LOGIN` and the UI shows a "Waiting for you to log in" panel with
   the target URL and a **Continue scanning** button.
2. Log in by hand in that browser window (it's running on the same machine
   as the backend, not in the cloud — see the requirement below).
3. Click **Continue scanning**. The backend resumes the *same* browser
   session — same cookies, same authenticated state — and runs the normal
   Smart Action Library + crawl + capture flow on it exactly as a regular
   scan would, saving/exporting the result the same way.

This is implemented as a separate code path layered on top of the existing
async status machine (`POST /api/audit/discover/{runId}/confirm-login` resumes
a session tracked by runId); a scan started without the checkbox behaves
exactly as before — synchronous-per-request, headless, no pause.

**Requirements and limitations:**
- The backend must run **locally on a machine with a graphical desktop**.
  Headless/no-display cloud servers cannot show you a browser window to log
  in with, so this feature only works when you're running
  `mvn spring-boot:run` yourself, not on a headless deployment.
- The paused session lives **in memory only**. If the backend restarts while
  a scan is `AWAITING_LOGIN`, that session (and the open browser) is lost;
  start the scan again.
- If login isn't confirmed within `auditor.discovery.manual-login-timeout-ms`
  (default 5 minutes), the browser is closed automatically and the status
  becomes `EXPIRED` — start a new scan rather than trying to confirm a timed
  out one.

## Export

The **Download JSON** / **Download CSV** buttons in the UI build the file
directly from the result already loaded in the browser — no server round
trip — so they work identically for a just-finished scan or a report reopened
from history. CSV columns: `page_url, event_name, matched_action_name,
tracking_method, timestamp, count, raw_payload_snippet`.

A legacy endpoint, `GET /api/audit/export/{runId}?format=json|csv`, still
exists on the backend and does the same thing server-side, but only works for
runs still held in the in-memory `AuditRunStorage` (i.e. not after a backend
restart) — nothing in the current UI calls it.

## REST API summary

| Method & path | Purpose |
|---|---|
| `POST /api/audit/discover` | Start a scan; returns `{ runId }` immediately |
| `POST /api/audit/discover/{runId}/confirm-login` | Resume a scan paused in `AWAITING_LOGIN` after you've logged in |
| `GET /api/audit/discover/{runId}/status` | Poll scan progress/result |
| `GET /api/audit/reports` | List saved reports (summary metadata) |
| `GET /api/audit/reports/{fileName}` | Load one saved report in full |
| `GET /api/audit/export/{runId}?format=json\|csv` | Legacy in-memory export (unused by the UI) |

## Configuration reference

`backend/src/main/resources/application.yml`:

| Key | Default | Meaning |
|---|---|---|
| `auditor.amplitude.host-patterns` | api.amplitude.com, api2.amplitude.com, `*.amplitude.com/2/httpapi` | Which request hosts count as "Amplitude" |
| `auditor.discovery.max-depth` | 2 | Default crawl depth if not specified per-request |
| `auditor.discovery.max-pages` | 10 | Default page cap if not specified per-request |
| `auditor.discovery.hard-max-depth` | 5 | Absolute ceiling on depth, regardless of what a request asks for |
| `auditor.discovery.hard-max-pages` | 50 | Absolute ceiling on page count, regardless of what a request asks for |
| `auditor.discovery.action-poll-timeout-ms` | 3000 | How long to wait for a matching Amplitude request after an action |
| `auditor.discovery.scroll-step-wait-ms` | 800 | Wait per scroll increment (25/50/75/100%) |
| `auditor.discovery.navigation-timeout-ms` | 15000 | Page navigation timeout |
| `auditor.discovery.polite-delay-ms` | 300 | Pause between page visits |
| `auditor.discovery.manual-login-timeout-ms` | 300000 | How long an `AWAITING_LOGIN` session waits before it's auto-closed and marked `EXPIRED` |
| `auditor.discovery.user-agent` | a real desktop Chrome UA | Sent instead of Playwright's default (which literally says "HeadlessChrome" and can trip bot-detection/WAFs) |
| `auditor.discovery.exhaustive-max-elements` | 40 | Cap on elements clicked per page in exhaustive mode |
| `auditor.discovery.exhaustive-exclude-keywords` | delete, buy, checkout, unsubscribe, logout, etc. | Text substrings that make exhaustive mode skip an element |
| `auditor.reports.save-to-disk` | true | Whether completed scans are written to disk |
| `auditor.reports.directory` | reports | Where saved report JSON files go |

Per-scan requests can override `maxDepth`/`maxPages`/`expectedEventNames`/
`exhaustive` without touching config (subject to the hard ceilings above).

## Known limitations

- Server-side tracking is invisible to this tool by design (see above).
- `robots.txt` is not fetched or enforced — the crawler is polite (small
  delay between pages, capped depth/pages) but doesn't check disallow rules.
- Historical comparison only diffs by page URL + event name (see above) -
  it won't flag a changed payload on an otherwise-unchanged event, and it
  only ever compares against the single most recent prior scan of the same
  host, not the full history.
- The Smart Action Library is heuristic — it recognizes common patterns, not
  every possible bespoke UI. Sites with unusual markup may show fewer
  matched actions than they actually have interactive elements. Exhaustive
  mode narrows this gap at the cost of speed and a residual safety risk.
- Only same-origin pages are crawled; content behind a login wall or on a
  different subdomain (e.g. an auth provider) is not followed automatically -
  use "Manual login before scanning" (see above) to authenticate by hand first.
- Manual login requires a local desktop backend and keeps its paused session
  in memory only (lost on restart); see the "Manual login before scanning"
  section for the full requirements.
