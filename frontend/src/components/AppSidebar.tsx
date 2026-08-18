import { useEffect, useState } from 'react';
import { listSavedReports, SavedReportSummary } from '../api';
import logo from '../assets/magnusson-logo.webp';

export type Tab = 'scan' | 'reports';

interface AppSidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onOpenReport: (fileName: string) => void;
  refreshKey?: unknown;
}

function relativeDate(iso?: string): string {
  if (!iso) return 'unknown date';
  const date = new Date(iso);
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const dayDiff = Math.round((startOfDay(now) - startOfDay(date)) / 86400000);
  if (dayDiff <= 0) return 'today';
  if (dayDiff === 1) return 'yesterday';
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

function hostOf(url?: string): string {
  if (!url) return 'unknown host';
  try {
    return new URL(url).host || url;
  } catch {
    return url;
  }
}

export default function AppSidebar({ activeTab, onTabChange, onOpenReport, refreshKey }: AppSidebarProps) {
  const [recent, setRecent] = useState<SavedReportSummary[]>([]);

  useEffect(() => {
    listSavedReports()
      .then(reports => setRecent(reports.slice(0, 3)))
      .catch(() => setRecent([]));
  }, [refreshKey]);

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <img src={logo} alt="Magnusson Analytica" className="sidebar-brand-mark" />
        <span className="sidebar-brand-name">AmpliScanner</span>
      </div>

      <div className="sidebar-nav">
        <button
          type="button"
          className={`sidebar-nav-item ${activeTab === 'scan' ? 'active' : ''}`}
          onClick={() => onTabChange('scan')}
        >
          New scan
        </button>
        <button
          type="button"
          className={`sidebar-nav-item ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => onTabChange('reports')}
        >
          Reports
        </button>
      </div>

      {recent.length > 0 && (
        <div className="sidebar-recent">
          <div className="sidebar-recent-label">Recent</div>
          <div className="sidebar-recent-items">
            {recent.map((report, i) => (
              <button
                type="button"
                className="sidebar-recent-item"
                key={report.fileName ?? i}
                onClick={() => report.fileName && onOpenReport(report.fileName)}
              >
                <div className="sidebar-recent-host">{hostOf(report.targetUrl)}</div>
                <div className="sidebar-recent-meta">
                  {relativeDate(report.finishedAt)} &middot; {report.totalEvents ?? 0} events
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="sidebar-footer">
        Server-side events never reach the browser, so they are out of scope for every scan.
      </div>
    </nav>
  );
}
