import { useEffect, useState } from 'react';
import { listSavedReports, getSavedReport, SavedReportSummary, DiscoveryRunResult } from '../api';
import ResultsView from './ResultsView';

interface ReportsHistoryProps {
  openFileName?: string | null;
  onOpened?: () => void;
  onRerun?: (targetUrl: string) => void;
}

export default function ReportsHistory({ openFileName, onOpened, onRerun }: ReportsHistoryProps) {
  const [reports, setReports] = useState<SavedReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<DiscoveryRunResult | null>(null);

  useEffect(() => {
    listSavedReports()
      .then(setReports)
      .catch(err => setError(err.message || 'Could not load report history'))
      .finally(() => setLoading(false));
  }, []);

  const openReport = async (fileName?: string) => {
    if (!fileName) return;
    setError(null);
    try {
      const result = await getSavedReport(fileName);
      setSelected(result);
    } catch (err: any) {
      setError(err.message || 'Could not load report');
    }
  };

  useEffect(() => {
    if (openFileName) {
      openReport(openFileName).finally(() => onOpened?.());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openFileName]);

  if (selected) {
    return (
      <div>
        <button type="button" className="back-to-reports" onClick={() => setSelected(null)}>
          &larr; Back to Reports
        </button>
        <ResultsView result={selected} onRerun={onRerun} />
      </div>
    );
  }

  return (
    <div>
      <header>
        <h1>Reports</h1>
        <p>Every completed scan is saved automatically. Click one to view it again.</p>
      </header>
      {error && <div className="error-banner">{error}</div>}
      {loading ? (
        <div className="loading">Loading report history...</div>
      ) : reports.length === 0 ? (
        <div className="reports-empty">No saved reports yet - run a scan to see it here.</div>
      ) : (
        <div className="reports-list">
          {reports.map((report, index) => (
            <button
              type="button"
              className="report-row"
              key={report.fileName ?? index}
              onClick={() => openReport(report.fileName)}
            >
              <div className="report-row-main">
                <span className="report-row-url">{report.targetUrl}</span>
                <span className="report-row-date">
                  {report.finishedAt ? new Date(report.finishedAt).toLocaleString() : 'unknown date'}
                </span>
              </div>
              <span className="report-row-meta">
                {report.pagesVisited ?? 0} page(s) &middot; {report.totalEvents ?? 0} event(s)
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
