package com.auditor.model;

public class ScanProgress {
    private String runId;
    private ScanStatus status;
    private int pagesVisited;
    private int totalEvents;
    private String currentUrl;
    private String errorMessage;
    private DiscoveryRunResult result;

    public ScanProgress() {
    }

    public ScanProgress(String runId, ScanStatus status, int pagesVisited, int totalEvents,
                         String currentUrl, String errorMessage, DiscoveryRunResult result) {
        this.runId = runId;
        this.status = status;
        this.pagesVisited = pagesVisited;
        this.totalEvents = totalEvents;
        this.currentUrl = currentUrl;
        this.errorMessage = errorMessage;
        this.result = result;
    }

    public String getRunId() {
        return runId;
    }

    public void setRunId(String runId) {
        this.runId = runId;
    }

    public ScanStatus getStatus() {
        return status;
    }

    public void setStatus(ScanStatus status) {
        this.status = status;
    }

    public int getPagesVisited() {
        return pagesVisited;
    }

    public void setPagesVisited(int pagesVisited) {
        this.pagesVisited = pagesVisited;
    }

    public int getTotalEvents() {
        return totalEvents;
    }

    public void setTotalEvents(int totalEvents) {
        this.totalEvents = totalEvents;
    }

    public String getCurrentUrl() {
        return currentUrl;
    }

    public void setCurrentUrl(String currentUrl) {
        this.currentUrl = currentUrl;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public DiscoveryRunResult getResult() {
        return result;
    }

    public void setResult(DiscoveryRunResult result) {
        this.result = result;
    }
}
