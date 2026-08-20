import { useState } from 'react';
import {
  DiscoveryRunResult, TrackingMethod,
  buildUniqueEventsSummary, downloadResultAsCsv, downloadResultAsJson,
} from '../api';
import { LockIcon } from './icons';

interface ResultsViewProps {
  result: DiscoveryRunResult;
  onRerun?: (targetUrl: string) => void;
}

const METHOD_ORDER: TrackingMethod[] = ['DATALAYER_GTM', 'AUTOCAPTURE', 'CUSTOM_SDK'];

const METHOD_LABELS: Record<TrackingMethod, string> = {
  DATALAYER_GTM: 'DataLayer / GTM',
  AUTOCAPTURE: 'Autocapture',
  CUSTOM_SDK: 'SDK direct',
};

// CSS class suffixes, not raw colors - keeps the mockup's Autocapture=orange /
// DataLayer-GTM=black / SDK-direct=grey mapping in one place.
const METHOD_COLOR_CLASS: Record<TrackingMethod, string> = {
  DATALAYER_GTM: 'method-color-gtm',
  AUTOCAPTURE: 'method-color-autocapture',
  CUSTOM_SDK: 'method-color-sdk',
};

type EventFilter = 'ALL' | TrackingMethod | 'NEW';

type ReportSection = 'verdict' | 'overview' | 'breakdown' | 'pages' | 'events';

const REPORT_SECTIONS: { key: ReportSection; label: string }[] = [
  { key: 'verdict', label: 'Diagnosis' },
  { key: 'overview', label: 'Overview' },
  { key: 'breakdown', label: 'Breakdown' },
  { key: 'pages', label: 'Pages' },
  { key: 'events', label: 'Events' },
];

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function formatFieldValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '—';
  }
  if (key === 'time' && typeof value === 'number') {
    return `${new Date(value).toLocaleString()} (${value})`;
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

function KeyValueTable({ fields }: { fields: [string, unknown][] }) {
  if (fields.length === 0) return null;
  return (
    <table className="event-details-table">
      <tbody>
        {fields.map(([key, value]) => (
          <tr key={key}>
            <th>{key}</th>
            <td>{formatFieldValue(key, value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Renders whatever fields the event's own payload actually carries as a table, rather than a
// hardcoded per-event-type layout - a click autocapture event surfaces its element/selector
// properties, a page-view event surfaces its URL/path properties, etc., because that's simply
// what each event's own event_properties (or equivalent nested object) contains.
function EventDetails({ rawPayload }: { rawPayload?: string }) {
  const [showRaw, setShowRaw] = useState(false);

  let parsed: Record<string, unknown> | null = null;
  if (rawPayload) {
    try {
      const candidate = JSON.parse(rawPayload);
      if (isPlainObject(candidate)) {
        parsed = candidate;
      }
    } catch {
      parsed = null;
    }
  }

  if (!parsed) {
    return <pre>{rawPayload}</pre>;
  }

  const topLevelFields: [string, unknown][] = [];
  const nestedSections: [string, Record<string, unknown>][] = [];
  for (const [key, value] of Object.entries(parsed)) {
    if (isPlainObject(value)) {
      nestedSections.push([key, value]);
    } else {
      topLevelFields.push([key, value]);
    }
  }

  return (
    <div className="event-details">
      <KeyValueTable fields={topLevelFields} />
      {nestedSections.map(([sectionKey, sectionValue]) => (
        <div className="event-details-section" key={sectionKey}>
          <h5>{sectionKey}</h5>
          <KeyValueTable fields={Object.entries(sectionValue)} />
        </div>
      ))}
      <button type="button" className="raw-json-toggle" onClick={() => setShowRaw(show => !show)}>
        {showRaw ? 'Hide raw JSON' : 'View raw JSON'}
      </button>
      {showRaw && <pre>{rawPayload}</pre>}
    </div>
  );
}

interface MethodTotals {
  count: number;
  names: Set<string>;
}

function emptyMethodTotals(): Record<TrackingMethod, MethodTotals> {
  return {
    DATALAYER_GTM: { count: 0, names: new Set() },
    AUTOCAPTURE: { count: 0, names: new Set() },
    CUSTOM_SDK: { count: 0, names: new Set() },
  };
}

function addEventsToTotals(totals: Record<TrackingMethod, MethodTotals>, events: { eventName?: string; count?: number; trackingMethod?: TrackingMethod }[]): void {
  for (const event of events) {
    const method = event.trackingMethod ?? 'CUSTOM_SDK';
    totals[method].count += event.count ?? 1;
    totals[method].names.add(event.eventName ?? '(unnamed event)');
  }
}

function formatDuration(startIso?: string, endIso?: string): string | null {
  if (!startIso || !endIso) return null;
  const ms = new Date(endIso).getTime() - new Date(startIso).getTime();
  if (!Number.isFinite(ms) || ms < 0) return null;
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

function shortenPath(url: string): string {
  try {
    const u = new URL(url);
    return (u.pathname || '/') + (u.search || '');
  } catch {
    return url;
  }
}

export default function ResultsView({ result, onRerun }: ResultsViewProps) {
  const [expandedEventName, setExpandedEventName] = useState<string | null>(null);
  const [filter, setFilter] = useState<EventFilter>('ALL');
  const [section, setSection] = useState<ReportSection>('verdict');
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState<'flat' | 'page'>('flat');

  const pages = result.pagesVisited ?? [];
  const uniqueEvents = buildUniqueEventsSummary(result);
  const totalFires = uniqueEvents.reduce((sum, e) => sum + e.totalCount, 0);
  const collapsed = totalFires - uniqueEvents.length;
  const newEventNames = new Set((result.historicalComparison?.newEvents ?? []).map(e => e.eventName ?? ''));

  const methodTotals = emptyMethodTotals();
  for (const page of pages) addEventsToTotals(methodTotals, page.capturedEvents ?? []);

  const perPageTotals = pages.map(page => {
    const totals = emptyMethodTotals();
    addEventsToTotals(totals, page.capturedEvents ?? []);
    return totals;
  });
  const perPageFires = perPageTotals.map(t => METHOD_ORDER.reduce((sum, m) => sum + t[m].count, 0));
  const maxPageFires = Math.max(1, ...perPageFires);

  const actionNames: string[] = [];
  const matchedActionNames = new Set<string>();
  let actionsMatched = 0;
  let actionsTotal = 0;
  for (const page of pages) {
    for (const action of page.actionsAttempted ?? []) {
      if (!action.actionName) continue;
      if (!actionNames.includes(action.actionName)) actionNames.push(action.actionName);
      actionsTotal += 1;
      if (action.matched) {
        actionsMatched += 1;
        matchedActionNames.add(action.actionName);
      }
    }
  }

  const scanTypeLabel = result.exhaustive !== undefined ? (result.exhaustive ? 'Full Tracking' : 'Quick Scan') : null;

  const headerParts = [
    result.finishedAt ? new Date(result.finishedAt).toLocaleString() : null,
    formatDuration(result.startedAt, result.finishedAt),
  ].filter(Boolean);

  const pagesAllowedText = result.effectiveMaxPages !== undefined
    ? `of ${result.effectiveMaxPages} allowed${result.effectiveMaxDepth !== undefined ? ` · depth ${result.effectiveMaxDepth}` : ''}`
    : null;

  const coverage = result.trackingPlanCoverage;
  const coveragePct = coverage && coverage.expectedCount ? Math.round(((coverage.observedCount ?? 0) / coverage.expectedCount) * 100) : 0;

  const searchTerm = searchQuery.trim().toLowerCase();

  const matchesFilter = (eventName: string, methods: TrackingMethod[]): boolean => {
    if (filter === 'NEW') {
      if (!newEventNames.has(eventName)) return false;
    } else if (filter !== 'ALL' && !methods.includes(filter)) {
      return false;
    }
    if (searchTerm && !eventName.toLowerCase().includes(searchTerm)) return false;
    return true;
  };

  const filteredEvents = uniqueEvents.filter(e => matchesFilter(e.eventName, e.methods));

  const pageGroups = pages.map(page => {
    const totalOnPage = page.capturedEvents?.length ?? 0;
    const visibleEvents = (page.capturedEvents ?? []).filter(ev =>
      matchesFilter(ev.eventName ?? '(unnamed event)', [ev.trackingMethod ?? 'CUSTOM_SDK']));
    return { page, totalOnPage, visibleEvents };
  });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <div className="dashboard-header-meta">
            <span className="badge success">COMPLETED</span>
            {scanTypeLabel && <span className="badge scan-type">{scanTypeLabel}</span>}
            {result.manualLogin && (
              <span className="badge behind-login" title="This scan ran against an authenticated session (manual login before scanning)">
                <LockIcon /> Behind login
              </span>
            )}
            {headerParts.length > 0 && <span className="caption">{headerParts.join(' · ')}</span>}
          </div>
          <h1 className="dashboard-title">{result.targetUrl}</h1>
        </div>
        <div className="report-actions">
          <button type="button" className="outline-action" onClick={() => downloadResultAsJson(result)}>JSON</button>
          <button type="button" className="outline-action" onClick={() => downloadResultAsCsv(result)}>CSV</button>
          {onRerun && result.targetUrl && (
            <button type="button" className="primary-action" onClick={() => onRerun(result.targetUrl!)}>
              Re-run scan
            </button>
          )}
        </div>
      </div>

      <nav className="section-nav">
        {REPORT_SECTIONS.map(sec => (
          <button
            type="button"
            key={sec.key}
            className={`segmented-item ${section === sec.key ? 'active' : ''}`}
            onClick={() => setSection(sec.key)}
          >
            {sec.label}
          </button>
        ))}
      </nav>

      <section style={{ display: section === 'overview' ? 'block' : 'none' }}>
      <div className="stat-tiles">
        <div className="stat-tile">
          <span className="caption stat-tile-label">Pages crawled</span>
          <span className="tabular stat-tile-value">{pages.length}</span>
          {pagesAllowedText && <span className="caption stat-tile-sub">{pagesAllowedText}</span>}
        </div>
        <div className="stat-tile">
          <span className="caption stat-tile-label">Unique events</span>
          <span className="tabular stat-tile-value">{uniqueEvents.length}</span>
          {(result.historicalComparison?.newEvents?.length ?? 0) > 0 && (
            <span className="caption stat-tile-sub positive">+{result.historicalComparison!.newEvents!.length} since last scan</span>
          )}
        </div>
        <div className="stat-tile">
          <span className="caption stat-tile-label">Total fires</span>
          <span className="tabular stat-tile-value">{totalFires}</span>
          {collapsed > 0 && <span className="caption stat-tile-sub">{collapsed} repeat fires collapsed</span>}
        </div>
        <div className="stat-tile dark">
          <span className="caption stat-tile-label">Actions matched</span>
          <div className="tabular stat-tile-value">
            {actionsMatched}<span className="stat-tile-value-of">/{actionsTotal}</span>
          </div>
          {actionNames.length > 0 && (
            <div className="stat-tile-segments">
              {actionNames.map(name => (
                <span key={name} className={`stat-segment ${matchedActionNames.has(name) ? 'on' : ''}`} />
              ))}
            </div>
          )}
        </div>
      </div>
      </section>

      <section style={{ display: section === 'verdict' ? 'block' : 'none' }}>
      {result.scorecard && result.scorecard.length > 0 && (
        <div className="panel">
          <div className="panel-header">
            <h3>Diagnostic scorecard</h3>
          </div>

          {result.scorecardVerdict && (
            <div className={`scorecard-verdict verdict-${(result.scorecardVerdict.band ?? 'ready').toLowerCase().replace(/_/g, '-')}`}>
              <span className="scorecard-verdict-label">{result.scorecardVerdict.label}</span>
              <span className="body-sm scorecard-verdict-summary">{result.scorecardVerdict.summary}</span>
              {result.scorecardVerdict.confidenceNote && (
                <span className="caption scorecard-confidence-note">{result.scorecardVerdict.confidenceNote}</span>
              )}
            </div>
          )}

          <div className="scorecard-list">
            {result.scorecard.map(finding => finding.triggered ? (
              <div
                className={`scorecard-row flagged severity-${(finding.severity ?? 'low').toLowerCase()}`}
                key={finding.id}
              >
                <div className="scorecard-row-header">
                  <span className="badge fail">Found</span>
                  {finding.severity && (
                    <span className={`severity-badge severity-${finding.severity.toLowerCase()}`}>
                      {finding.severity}
                    </span>
                  )}
                  <span className="label">{finding.title}</span>
                </div>
                {finding.summary && <p className="body-sm scorecard-summary">{finding.summary}</p>}
                {finding.consequence && (
                  <p className="caption scorecard-callout">
                    <strong>Why it matters: </strong>{finding.consequence}
                  </p>
                )}
                {finding.nextStep && (
                  <p className="caption scorecard-callout">
                    <strong>Next step: </strong>{finding.nextStep}
                  </p>
                )}
                <div className="scorecard-evidence">
                  {(finding.evidence ?? []).map((line, i) => (
                    <div className="scorecard-evidence-line" key={i}>
                      <span className="caption scorecard-evidence-text">{line.text}</span>
                      {line.terms && line.terms.length > 0 && (
                        <div className="scorecard-terms">
                          {line.terms.map((term, j) => (
                            <code key={j}>{term}</code>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="scorecard-row-clear" key={finding.id}>
                <span className="badge success">Clear</span>
                <span className="label">{finding.title}</span>
                {finding.summary && <span className="caption scorecard-clear-summary">{finding.summary}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
      </section>

      <section style={{ display: section === 'breakdown' ? 'block' : 'none' }}>
      <div className="dashboard-row">
        <div className="panel">
          <div className="panel-header">
            <h3>How events are being sent</h3>
            <span className="caption panel-meta">{totalFires} fires</span>
          </div>
          <div className="method-stacked-bar">
            {METHOD_ORDER.filter(m => methodTotals[m].count > 0).map(m => (
              <div
                key={m}
                className={`method-stacked-segment ${METHOD_COLOR_CLASS[m]}`}
                style={{ width: `${(methodTotals[m].count / Math.max(1, totalFires)) * 100}%` }}
              >
                {METHOD_LABELS[m]} · {methodTotals[m].count}
              </div>
            ))}
          </div>
          <div className="method-breakdown-list">
            {METHOD_ORDER.filter(m => methodTotals[m].count > 0).map(m => (
              <div className="method-breakdown-row" key={m}>
                <span className={`method-dot ${METHOD_COLOR_CLASS[m]}`} />
                <span className="label method-breakdown-name">{METHOD_LABELS[m]}</span>
                <span className="caption method-breakdown-count-names">{methodTotals[m].names.size} distinct names</span>
                <span className="tabular label method-breakdown-total">{methodTotals[m].count}</span>
              </div>
            ))}
          </div>
        </div>

        {coverage && (
          <div className="panel coverage-panel">
            <h3>Tracking plan coverage</h3>
            <div className="coverage-body">
              <div
                className="coverage-donut"
                style={{ background: `conic-gradient(var(--brand-ember) 0 ${coveragePct}%, var(--surface-paper-2) ${coveragePct}% 100%)` }}
              >
                <div className="coverage-donut-inner">
                  <span className="tabular coverage-donut-value">{coverage.observedCount ?? 0}/{coverage.expectedCount ?? 0}</span>
                  <span className="caption">observed</span>
                </div>
              </div>
              {(coverage.missingEventNames?.length ?? 0) > 0 && (
                <div className="coverage-missing">
                  <span className="label">Missing</span>
                  {coverage.missingEventNames!.map(name => (
                    <span className="body-sm coverage-missing-item" key={name}>{name}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      </section>

      <section style={{ display: section === 'pages' ? 'block' : 'none' }}>
      <div className="panel">
        <div className="panel-header">
          <h3>Events per page</h3>
          <span className="caption panel-meta">bar length = fires captured</span>
        </div>
        <div className="page-bar-list">
          {pages.map((page, i) => {
            const totals = perPageTotals[i];
            const pageTotal = perPageFires[i];
            return (
              <div className="page-bar-row" key={page.url ?? i}>
                <span className="body-sm page-bar-url">{page.url}</span>
                {pageTotal === 0 ? (
                  <span className="caption">no events captured</span>
                ) : (
                  <div className="page-bar-track">
                    {METHOD_ORDER.filter(m => totals[m].count > 0).map(m => (
                      <div
                        key={m}
                        className={`page-bar-segment ${METHOD_COLOR_CLASS[m]}`}
                        style={{ width: `${(totals[m].count / maxPageFires) * 100}%` }}
                      />
                    ))}
                  </div>
                )}
                <span className={`tabular label page-bar-total ${pageTotal === 0 ? 'zero' : ''}`}>{pageTotal}</span>
              </div>
            );
          })}
        </div>
      </div>
      </section>

      <section style={{ display: section === 'events' ? 'block' : 'none' }}>
      <div className="panel events-panel">
        <div className="panel-header">
          <h3>All events <span className="caption panel-count">{uniqueEvents.length}</span></h3>
          <div className="events-controls">
            <input
              type="text"
              className="events-search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search events"
            />
            <div className="group-toggle">
              <button
                type="button"
                className={`segmented-item ${groupBy === 'flat' ? 'active' : ''}`}
                onClick={() => setGroupBy('flat')}
              >
                Flat list
              </button>
              <button
                type="button"
                className={`segmented-item ${groupBy === 'page' ? 'active' : ''}`}
                onClick={() => setGroupBy('page')}
              >
                By page
              </button>
            </div>
            <div className="filter-pills">
              <button type="button" className={`pill ${filter === 'ALL' ? 'active' : ''}`} onClick={() => setFilter('ALL')}>All</button>
              {METHOD_ORDER.filter(m => methodTotals[m].count > 0).map(m => (
                <button
                  type="button"
                  key={m}
                  className={`pill ${filter === m ? 'active' : ''}`}
                  onClick={() => setFilter(m)}
                >
                  {METHOD_LABELS[m]}
                </button>
              ))}
              {newEventNames.size > 0 && (
                <button type="button" className={`pill ${filter === 'NEW' ? 'active' : ''}`} onClick={() => setFilter('NEW')}>
                  New only · {newEventNames.size}
                </button>
              )}
            </div>
          </div>
        </div>

        {groupBy === 'flat' ? (
          <div className="events-table">
            <div className="events-table-head">
              <span className="caption">Event</span><span className="caption">Method</span><span className="caption">Pages</span><span className="caption">Fires</span>
            </div>
            {filteredEvents.length === 0 ? (
              <p className="caption no-events-note">No events match this filter.</p>
            ) : (
              filteredEvents.map(e => {
                const isOpen = expandedEventName === e.eventName;
                const isNew = newEventNames.has(e.eventName);
                return (
                  <div className="events-table-row-wrap" key={e.eventName}>
                    <button
                      type="button"
                      className="events-table-row"
                      onClick={() => setExpandedEventName(isOpen ? null : e.eventName)}
                    >
                      <span className="events-table-name">
                        {e.eventName}
                        {isNew && <span className="badge success small">NEW</span>}
                      </span>
                      <span className="events-table-method">
                        {e.methods[0] && <span className={`method-dot ${METHOD_COLOR_CLASS[e.methods[0]]}`} />}
                        {e.methods.map(m => METHOD_LABELS[m]).join(', ')}
                      </span>
                      <span className="tabular events-table-pages">{e.pageCount}</span>
                      <span className="tabular events-table-fires">{e.totalCount}</span>
                    </button>
                    {isOpen && (
                      <div className="events-table-detail">
                        <EventDetails rawPayload={e.samplePayload} />
                        <div className="events-table-where">
                          <div className="caption">Where it fired</div>
                          <div className="action-badges">
                            {e.pageUrls.slice(0, 6).map(url => (
                              <span key={url} className="badge" title={url}>{shortenPath(url)}</span>
                            ))}
                            {e.pageUrls.length > 6 && (
                              <span className="badge">+{e.pageUrls.length - 6} more</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="page-groups">
            {pageGroups.map(({ page, totalOnPage, visibleEvents }, i) => (
              <div className="page-group" key={page.url ?? i}>
                <div className="page-group-header">
                  <span className="label" style={{ color: totalOnPage === 0 ? 'var(--semantic-negative)' : 'var(--fg-1)' }}>
                    {page.url}
                  </span>
                  <span className="caption">
                    {totalOnPage === 0 ? 'no events' : `${visibleEvents.length} of ${totalOnPage} shown`}
                  </span>
                </div>
                {totalOnPage === 0 && (
                  <p className="caption page-group-empty">No Amplitude events captured on this page.</p>
                )}
                {visibleEvents.map((ev, j) => {
                  const key = `${page.url ?? i}-${ev.eventName ?? j}-${j}`;
                  const isOpen = expandedEventName === key;
                  const method = ev.trackingMethod ?? 'CUSTOM_SDK';
                  return (
                    <div className="events-table-row-wrap" key={key}>
                      <button
                        type="button"
                        className="events-table-row page-group-row"
                        onClick={() => setExpandedEventName(isOpen ? null : key)}
                      >
                        <span className="events-table-name">{ev.eventName ?? '(unnamed event)'}</span>
                        <span className="events-table-method">
                          <span className={`method-dot ${METHOD_COLOR_CLASS[method]}`} />
                          {METHOD_LABELS[method]}
                        </span>
                        <span className="tabular events-table-fires">{ev.count ?? 1}</span>
                      </button>
                      {isOpen && (
                        <div className="events-table-detail">
                          <EventDetails rawPayload={ev.rawPayload} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
      </section>
    </div>
  );
}
