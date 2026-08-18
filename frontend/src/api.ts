export interface ActionAttempt {
  actionName?: string;
  matched?: boolean;
  selectorUsed?: string | null;
}

export type TrackingMethod = 'DATALAYER_GTM' | 'AUTOCAPTURE' | 'CUSTOM_SDK';

export interface CapturedEvent {
  eventName?: string;
  timestamp?: string;
  rawPayload?: string;
  pageUrl?: string;
  matchedActionName?: string | null;
  count?: number;
  trackingMethod?: TrackingMethod;
}

export interface PageVisitResult {
  url?: string;
  actionsAttempted?: ActionAttempt[];
  capturedEvents?: CapturedEvent[];
  dataLayerPresent?: boolean;
}

export interface TrackingPlanCoverage {
  expectedCount?: number;
  observedCount?: number;
  matchedEventNames?: string[];
  missingEventNames?: string[];
}

export interface ComparisonEntry {
  pageUrl?: string;
  eventName?: string;
}

export interface HistoricalComparison {
  comparedAgainstFileName?: string;
  comparedAgainstFinishedAt?: string;
  newEvents?: ComparisonEntry[];
  disappearedEvents?: ComparisonEntry[];
}

export interface DiscoveryRunResult {
  runId?: string;
  targetUrl?: string;
  startedAt?: string;
  finishedAt?: string;
  pagesVisited?: PageVisitResult[];
  allCapturedAmplitudeEvents?: CapturedEvent[];
  trackingPlanCoverage?: TrackingPlanCoverage | null;
  historicalComparison?: HistoricalComparison | null;
  effectiveMaxDepth?: number;
  effectiveMaxPages?: number;
  exhaustive?: boolean;
}

export interface DiscoveryRunRequest {
  targetUrl: string;
  maxDepth?: number;
  maxPages?: number;
  expectedEventNames?: string[];
  exhaustive?: boolean;
  manualLogin?: boolean;
}

export interface SavedReportSummary {
  fileName?: string;
  targetUrl?: string;
  startedAt?: string;
  finishedAt?: string;
  pagesVisited?: number;
  totalEvents?: number;
}

export type ScanStatus = 'RUNNING' | 'COMPLETED' | 'FAILED' | 'AWAITING_LOGIN' | 'EXPIRED';

export interface ScanProgress {
  runId?: string;
  status?: ScanStatus;
  pagesVisited?: number;
  totalEvents?: number;
  currentUrl?: string | null;
  errorMessage?: string | null;
  result?: DiscoveryRunResult | null;
}

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080';

export async function startScan(request: DiscoveryRunRequest): Promise<{ runId: string }> {
  const response = await fetch(`${API_BASE}/api/audit/discover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || 'Scan request failed');
  }
  return response.json();
}

export async function getScanStatus(runId: string): Promise<ScanProgress> {
  const response = await fetch(`${API_BASE}/api/audit/discover/${encodeURIComponent(runId)}/status`);
  if (!response.ok) {
    throw new Error('Could not fetch scan status');
  }
  return response.json();
}

export async function confirmLogin(runId: string): Promise<{ runId: string }> {
  const response = await fetch(`${API_BASE}/api/audit/discover/${encodeURIComponent(runId)}/confirm-login`, {
    method: 'POST',
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || 'Could not confirm login - the session may have expired');
  }
  return response.json();
}

// Polls until the scan reaches a state that either finishes it (COMPLETED/FAILED/EXPIRED)
// or needs external action before it can continue (AWAITING_LOGIN), then returns that
// progress snapshot for the caller to react to. Used by the manual-login flow, which - unlike
// runDiscoveryAndPoll - cannot just block until COMPLETED since a human has to intervene.
export async function pollUntilSettled(
  runId: string,
  onProgress?: (progress: ScanProgress) => void,
  pollIntervalMs = 1500
): Promise<ScanProgress> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const progress = await getScanStatus(runId);
    onProgress?.(progress);
    if (progress.status === 'COMPLETED' || progress.status === 'FAILED'
      || progress.status === 'AWAITING_LOGIN' || progress.status === 'EXPIRED') {
      return progress;
    }
    await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
  }
}

export async function runDiscoveryAndPoll(
  request: DiscoveryRunRequest,
  onProgress?: (progress: ScanProgress) => void,
  pollIntervalMs = 1500
): Promise<DiscoveryRunResult> {
  const { runId } = await startScan(request);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const progress = await getScanStatus(runId);
    onProgress?.(progress);

    if (progress.status === 'COMPLETED' && progress.result) {
      return progress.result;
    }
    if (progress.status === 'FAILED') {
      throw new Error(progress.errorMessage || 'Scan failed');
    }
    await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
  }
}

export async function listSavedReports(): Promise<SavedReportSummary[]> {
  const response = await fetch(`${API_BASE}/api/audit/reports`);
  if (!response.ok) {
    throw new Error('Could not fetch report history');
  }
  return response.json();
}

export async function getSavedReport(fileName: string): Promise<DiscoveryRunResult> {
  const response = await fetch(`${API_BASE}/api/audit/reports/${encodeURIComponent(fileName)}`);
  if (!response.ok) {
    throw new Error('Could not load saved report');
  }
  return response.json();
}

function triggerDownload(content: string, mimeType: string, fileName: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function reportFileBaseName(result: DiscoveryRunResult): string {
  let host = 'report';
  try {
    host = new URL(result.targetUrl ?? '').host || 'report';
  } catch {
    // keep default
  }
  const stamp = (result.finishedAt ?? new Date().toISOString()).replace(/[:.]/g, '-');
  return `${host}_${stamp}`;
}

function escapeCsvField(value?: string | null): string {
  if (value == null) return '';
  const escaped = value.replace(/"/g, '""');
  return /[,\n\r"]/.test(escaped) ? `"${escaped}"` : escaped;
}

export interface UniqueEventSummary {
  eventName: string;
  methods: TrackingMethod[];
  pageCount: number;
  pageUrls: string[];
  totalCount: number;
  samplePayload?: string;
}

const METHOD_ORDER: TrackingMethod[] = ['DATALAYER_GTM', 'AUTOCAPTURE', 'CUSTOM_SDK'];

// Collapses every captured event across every page into one entry per distinct event name,
// regardless of which page or tracking method it came from. Shared by the "All unique events"
// table in the results view and by the JSON/CSV exports, so both always agree with each other.
export function buildUniqueEventsSummary(result: DiscoveryRunResult): UniqueEventSummary[] {
  const byName = new Map<string, {
    methods: Set<TrackingMethod>;
    pageUrls: Set<string>;
    totalCount: number;
    samplePayload?: string;
  }>();
  for (const page of result.pagesVisited ?? []) {
    for (const event of page.capturedEvents ?? []) {
      const name = event.eventName ?? '(unnamed event)';
      let entry = byName.get(name);
      if (!entry) {
        entry = { methods: new Set(), pageUrls: new Set(), totalCount: 0, samplePayload: event.rawPayload };
        byName.set(name, entry);
      }
      entry.methods.add(event.trackingMethod ?? 'CUSTOM_SDK');
      if (page.url) entry.pageUrls.add(page.url);
      entry.totalCount += event.count ?? 1;
    }
  }
  return Array.from(byName.entries())
    .map(([eventName, entry]) => ({
      eventName,
      methods: METHOD_ORDER.filter(m => entry.methods.has(m)),
      pageCount: entry.pageUrls.size,
      pageUrls: Array.from(entry.pageUrls),
      totalCount: entry.totalCount,
      samplePayload: entry.samplePayload,
    }))
    .sort((a, b) => b.totalCount - a.totalCount);
}

function buildCsv(result: DiscoveryRunResult): string {
  const rows = ['event_name,tracking_method,pages,total_count'];
  for (const entry of buildUniqueEventsSummary(result)) {
    const columns = [entry.eventName, entry.methods.join(', '), String(entry.pageCount), String(entry.totalCount)];
    rows.push(columns.map(escapeCsvField).join(','));
  }
  return rows.join('\n');
}

export function downloadResultAsJson(result: DiscoveryRunResult): void {
  const summary = buildUniqueEventsSummary(result).map(entry => ({
    event_name: entry.eventName,
    tracking_method: entry.methods.join(', '),
    pages: entry.pageCount,
    total_count: entry.totalCount,
  }));
  triggerDownload(JSON.stringify(summary, null, 2), 'application/json', `${reportFileBaseName(result)}.json`);
}

export function downloadResultAsCsv(result: DiscoveryRunResult): void {
  triggerDownload(buildCsv(result), 'text/csv', `${reportFileBaseName(result)}.csv`);
}
