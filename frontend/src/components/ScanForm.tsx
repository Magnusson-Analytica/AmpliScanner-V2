import { useEffect, useState } from 'react';
import {
  runDiscoveryAndPoll, startScan, pollUntilSettled, confirmLogin,
  DiscoveryRunRequest, DiscoveryRunResult, ScanProgress,
} from '../api';

interface ScanFormProps {
  onResult: (result: DiscoveryRunResult | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (message: string | null) => void;
  onProgress: (progress: ScanProgress | null) => void;
  prefillUrl?: string | null;
  onPrefillConsumed?: () => void;
}

interface AwaitingLogin {
  runId: string;
  targetUrl: string;
}

export default function ScanForm({
  onResult, setLoading, setError, onProgress, prefillUrl, onPrefillConsumed,
}: ScanFormProps) {
  const [targetUrl, setTargetUrl] = useState('');
  const [maxDepth, setMaxDepth] = useState('');
  const [maxPages, setMaxPages] = useState('');
  const [expectedEvents, setExpectedEvents] = useState('');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [manualLogin, setManualLogin] = useState(false);
  const [awaitingLogin, setAwaitingLogin] = useState<AwaitingLogin | null>(null);

  useEffect(() => {
    if (prefillUrl) {
      setTargetUrl(prefillUrl);
      onPrefillConsumed?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillUrl]);

  const buildRequest = (exhaustive: boolean): DiscoveryRunRequest => {
    const request: DiscoveryRunRequest = { targetUrl };
    if (maxDepth.trim() !== '') {
      request.maxDepth = Number(maxDepth);
    }
    if (maxPages.trim() !== '') {
      request.maxPages = Number(maxPages);
    }
    const eventNames = expectedEvents
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    if (eventNames.length > 0) {
      request.expectedEventNames = eventNames;
    }
    if (exhaustive) {
      request.exhaustive = true;
    }
    if (manualLogin) {
      request.manualLogin = true;
    }
    return request;
  };

  const runScan = async (exhaustive: boolean) => {
    setError(null);
    setLoading(true);
    onProgress(null);
    onResult(null);
    setAwaitingLogin(null);
    try {
      const request = buildRequest(exhaustive);

      if (!request.manualLogin) {
        const result = await runDiscoveryAndPoll(request, progress => onProgress(progress));
        onResult(result);
        return;
      }

      const { runId } = await startScan(request);
      const settled = await pollUntilSettled(runId, progress => onProgress(progress));
      if (settled.status === 'AWAITING_LOGIN') {
        setAwaitingLogin({ runId, targetUrl });
        return;
      }
      if (settled.status === 'EXPIRED') {
        throw new Error(settled.errorMessage
          || 'The manual login window was not confirmed in time and was closed. Please start a new scan.');
      }
      if (settled.status === 'FAILED') {
        throw new Error(settled.errorMessage || 'Scan failed');
      }
      if (settled.result) {
        onResult(settled.result);
      }
    } catch (error: any) {
      setError(error.message || 'Scan failed');
    } finally {
      setLoading(false);
      onProgress(null);
    }
  };

  const handleConfirmLogin = async () => {
    if (!awaitingLogin) return;
    const { runId } = awaitingLogin;
    setAwaitingLogin(null);
    setError(null);
    setLoading(true);
    onProgress(null);
    try {
      await confirmLogin(runId);
      const settled = await pollUntilSettled(runId, progress => onProgress(progress));
      if (settled.status === 'FAILED') {
        throw new Error(settled.errorMessage || 'Scan failed');
      }
      if (settled.result) {
        onResult(settled.result);
      }
    } catch (error: any) {
      setError(error.message || 'Scan failed');
    } finally {
      setLoading(false);
      onProgress(null);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!targetUrl) return;
    runScan(false);
  };

  const handleFullTrackingClick = () => {
    if (!targetUrl) return;
    const confirmed = window.confirm(
      'Full Tracking clicks every clickable element on each page (not just known patterns), skipping ones ' +
        'that match a danger-word list (delete, buy, unsubscribe, etc). It is slower and carries more residual ' +
        'risk on a live/production site than Quick Scan. Continue?'
    );
    if (confirmed) {
      runScan(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="field-group">
        <label>Target URL</label>
        <input
          type="url"
          value={targetUrl}
          onChange={e => setTargetUrl(e.target.value)}
          placeholder="https://example.com"
          required
        />
      </div>

      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={manualLogin}
          onChange={e => setManualLogin(e.target.checked)}
        />
        Manual login before scanning
      </label>
      <p className="field-hint">
        Opens a visible browser window and pauses there for you to log in by hand before the automated
        scan starts. Requires the backend to run locally on a machine with a desktop display - it will not
        work on a headless server.
      </p>

      {awaitingLogin && (
        <div className="awaiting-login-banner">
          <h3>Waiting for you to log in</h3>
          <p>
            A browser window has opened at <strong>{awaitingLogin.targetUrl}</strong>. Log in there, then come
            back and press Continue. This session will be closed automatically if not confirmed in time.
          </p>
          <button type="button" onClick={handleConfirmLogin}>Continue scanning</button>
        </div>
      )}

      <button type="button" className="advanced-toggle" onClick={() => setAdvancedOpen(open => !open)}>
        {advancedOpen ? 'Hide advanced options' : 'Show advanced options'}
      </button>

      {advancedOpen && (
        <div className="advanced-options">
          <div className="field-group">
            <label>Max depth</label>
            <input
              type="number"
              min={0}
              value={maxDepth}
              onChange={e => setMaxDepth(e.target.value)}
              placeholder="default 2"
            />
          </div>
          <div className="field-group">
            <label>Max pages</label>
            <input
              type="number"
              min={1}
              value={maxPages}
              onChange={e => setMaxPages(e.target.value)}
              placeholder="default 10"
            />
          </div>
          <div className="field-group full-width">
            <label>Expected events from your tracking plan (one per line, optional)</label>
            <textarea
              rows={4}
              value={expectedEvents}
              onChange={e => setExpectedEvents(e.target.value)}
              placeholder={'Page Viewed\nButton Clicked\nForm Submitted'}
            />
          </div>
        </div>
      )}

      <div className="form-actions">
        <div className="scan-button-group">
          <button type="submit" disabled={!!awaitingLogin}>Run Quick Scan</button>
          <span
            className="info-icon"
            tabIndex={0}
            title="Tries a curated library of common UI patterns (cookie banners, sign-up, menus, search, scrolling, etc.) on each page. Fast, and safe to run on production sites."
          >
            ⓘ
          </span>
        </div>
        <div className="scan-button-group">
          <button type="button" className="secondary-action" onClick={handleFullTrackingClick} disabled={!!awaitingLogin}>
            Run Full Tracking
          </button>
          <span
            className="info-icon"
            tabIndex={0}
            title="Clicks every clickable element on each page, not just recognized patterns, to catch as many events as possible. Slower, and carries more residual risk on a live/production site."
          >
            ⓘ
          </span>
        </div>
      </div>
    </form>
  );
}
