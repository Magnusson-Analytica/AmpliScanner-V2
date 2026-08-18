package com.auditor.model;

import java.time.Instant;
import java.util.List;

/**
 * Diff between this run and the most recently saved run for the same domain,
 * keyed by (page_url, event_name) pairs - not just event name globally, since
 * the same event name firing on a different page is a meaningfully different fact.
 */
public class HistoricalComparison {
    private String comparedAgainstFileName;
    private Instant comparedAgainstFinishedAt;
    private List<ComparisonEntry> newEvents;
    private List<ComparisonEntry> disappearedEvents;

    public String getComparedAgainstFileName() {
        return comparedAgainstFileName;
    }

    public void setComparedAgainstFileName(String comparedAgainstFileName) {
        this.comparedAgainstFileName = comparedAgainstFileName;
    }

    public Instant getComparedAgainstFinishedAt() {
        return comparedAgainstFinishedAt;
    }

    public void setComparedAgainstFinishedAt(Instant comparedAgainstFinishedAt) {
        this.comparedAgainstFinishedAt = comparedAgainstFinishedAt;
    }

    public List<ComparisonEntry> getNewEvents() {
        return newEvents;
    }

    public void setNewEvents(List<ComparisonEntry> newEvents) {
        this.newEvents = newEvents;
    }

    public List<ComparisonEntry> getDisappearedEvents() {
        return disappearedEvents;
    }

    public void setDisappearedEvents(List<ComparisonEntry> disappearedEvents) {
        this.disappearedEvents = disappearedEvents;
    }
}
