import { useState } from 'react';
import AppSidebar, { Tab } from './components/AppSidebar';
import ScanForm from './components/ScanForm';
import ResultsView from './components/ResultsView';
import ReportsHistory from './components/ReportsHistory';
import { DiscoveryRunResult, ScanProgress } from './api';
import './styles.css';

function App() {
  const [tab, setTab] = useState<Tab>('scan');
  const [result, setResult] = useState<DiscoveryRunResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ScanProgress | null>(null);
  const [prefillUrl, setPrefillUrl] = useState<string | null>(null);
  const [pendingReportFile, setPendingReportFile] = useState<string | null>(null);

  const handleOpenReport = (fileName: string) => {
    setTab('reports');
    setPendingReportFile(fileName);
  };

  const handleRerun = (targetUrl: string) => {
    setPrefillUrl(targetUrl);
    setTab('scan');
  };

  return (
    <div className="app-shell">
      <AppSidebar activeTab={tab} onTabChange={setTab} onOpenReport={handleOpenReport} refreshKey={result} />
      <main>
        {tab === 'scan' ? (
          <>
            <header>
              <div className="eyebrow">Scan</div>
              <h1>Scan a site</h1>
              <p>Paste a URL, scan the site, and see every Amplitude event that fired.</p>
            </header>
            <ScanForm
              onResult={setResult}
              setLoading={setLoading}
              setError={setError}
              onProgress={setProgress}
              prefillUrl={prefillUrl}
              onPrefillConsumed={() => setPrefillUrl(null)}
            />
            {loading && (
              <div className="loading">
                <span className="loading-spinner" aria-hidden="true" />
                <span>
                  {progress
                    ? `Scanning... ${progress.pagesVisited ?? 0} page(s) visited, ${progress.totalEvents ?? 0} event(s) so far${progress.currentUrl ? ` — currently on ${progress.currentUrl}` : ''}`
                    : 'Starting scan...'}
                </span>
              </div>
            )}
            {error && <div className="error-banner">{error}</div>}
            {result && <ResultsView result={result} onRerun={handleRerun} />}
          </>
        ) : (
          <ReportsHistory
            openFileName={pendingReportFile}
            onOpened={() => setPendingReportFile(null)}
            onRerun={handleRerun}
          />
        )}
      </main>
    </div>
  );
}

export default App;
