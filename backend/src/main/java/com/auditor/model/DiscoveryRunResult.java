package com.auditor.model;

import java.time.Instant;
import java.util.List;

public class DiscoveryRunResult {
    private String runId;
    private String targetUrl;
    private Instant startedAt;
    private Instant finishedAt;
    private List<PageVisitResult> pagesVisited;
    private List<CapturedEvent> allCapturedAmplitudeEvents;
    private TrackingPlanCoverage trackingPlanCoverage;
    private HistoricalComparison historicalComparison;
    private int effectiveMaxDepth;
    private int effectiveMaxPages;
    private boolean exhaustive;
    private boolean manualLogin;
    private List<UseCaseFinding> scorecard;
    private ScorecardVerdict scorecardVerdict;

    public String getRunId() {
        return runId;
    }

    public void setRunId(String runId) {
        this.runId = runId;
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

    public List<PageVisitResult> getPagesVisited() {
        return pagesVisited;
    }

    public void setPagesVisited(List<PageVisitResult> pagesVisited) {
        this.pagesVisited = pagesVisited;
    }

    public List<CapturedEvent> getAllCapturedAmplitudeEvents() {
        return allCapturedAmplitudeEvents;
    }

    public void setAllCapturedAmplitudeEvents(List<CapturedEvent> allCapturedAmplitudeEvents) {
        this.allCapturedAmplitudeEvents = allCapturedAmplitudeEvents;
    }

    public TrackingPlanCoverage getTrackingPlanCoverage() {
        return trackingPlanCoverage;
    }

    public void setTrackingPlanCoverage(TrackingPlanCoverage trackingPlanCoverage) {
        this.trackingPlanCoverage = trackingPlanCoverage;
    }

    public HistoricalComparison getHistoricalComparison() {
        return historicalComparison;
    }

    public void setHistoricalComparison(HistoricalComparison historicalComparison) {
        this.historicalComparison = historicalComparison;
    }

    public int getEffectiveMaxDepth() {
        return effectiveMaxDepth;
    }

    public void setEffectiveMaxDepth(int effectiveMaxDepth) {
        this.effectiveMaxDepth = effectiveMaxDepth;
    }

    public int getEffectiveMaxPages() {
        return effectiveMaxPages;
    }

    public void setEffectiveMaxPages(int effectiveMaxPages) {
        this.effectiveMaxPages = effectiveMaxPages;
    }

    public boolean isExhaustive() {
        return exhaustive;
    }

    public void setExhaustive(boolean exhaustive) {
        this.exhaustive = exhaustive;
    }

    public boolean isManualLogin() {
        return manualLogin;
    }

    public void setManualLogin(boolean manualLogin) {
        this.manualLogin = manualLogin;
    }

    public List<UseCaseFinding> getScorecard() {
        return scorecard;
    }

    public void setScorecard(List<UseCaseFinding> scorecard) {
        this.scorecard = scorecard;
    }

    public ScorecardVerdict getScorecardVerdict() {
        return scorecardVerdict;
    }

    public void setScorecardVerdict(ScorecardVerdict scorecardVerdict) {
        this.scorecardVerdict = scorecardVerdict;
    }
}
