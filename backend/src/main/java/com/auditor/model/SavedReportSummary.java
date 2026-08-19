package com.auditor.model;

import java.time.Instant;

public class SavedReportSummary {
    private String fileName;
    private String targetUrl;
    private Instant startedAt;
    private Instant finishedAt;
    private int pagesVisited;
    private int totalEvents;
    private boolean manualLogin;
    private boolean exhaustive;

    public SavedReportSummary() {
    }

    public SavedReportSummary(String fileName, String targetUrl, Instant startedAt, Instant finishedAt,
                               int pagesVisited, int totalEvents, boolean manualLogin, boolean exhaustive) {
        this.fileName = fileName;
        this.targetUrl = targetUrl;
        this.startedAt = startedAt;
        this.finishedAt = finishedAt;
        this.pagesVisited = pagesVisited;
        this.totalEvents = totalEvents;
        this.manualLogin = manualLogin;
        this.exhaustive = exhaustive;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getTargetUrl() {
        return targetUrl;
    }

    public void setTargetUrl(String targetUrl) {
        this.targetUrl = targetUrl;
    }

    public Instant getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(Instant startedAt) {
        this.startedAt = startedAt;
    }

    public Instant getFinishedAt() {
        return finishedAt;
    }

    public void setFinishedAt(Instant finishedAt) {
        this.finishedAt = finishedAt;
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

    public boolean isManualLogin() {
        return manualLogin;
    }

    public void setManualLogin(boolean manualLogin) {
        this.manualLogin = manualLogin;
    }

    public boolean isExhaustive() {
        return exhaustive;
    }

    public void setExhaustive(boolean exhaustive) {
        this.exhaustive = exhaustive;
    }
}
