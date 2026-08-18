package com.auditor.model;

import java.util.List;

public class TrackingPlanCoverage {
    private int expectedCount;
    private int observedCount;
    private List<String> matchedEventNames;
    private List<String> missingEventNames;

    public TrackingPlanCoverage() {
    }

    public TrackingPlanCoverage(int expectedCount, int observedCount, List<String> matchedEventNames, List<String> missingEventNames) {
        this.expectedCount = expectedCount;
        this.observedCount = observedCount;
        this.matchedEventNames = matchedEventNames;
        this.missingEventNames = missingEventNames;
    }

    public int getExpectedCount() {
        return expectedCount;
    }

    public void setExpectedCount(int expectedCount) {
        this.expectedCount = expectedCount;
    }

    public int getObservedCount() {
        return observedCount;
    }

    public void setObservedCount(int observedCount) {
        this.observedCount = observedCount;
    }

    public List<String> getMatchedEventNames() {
        return matchedEventNames;
    }

    public void setMatchedEventNames(List<String> matchedEventNames) {
        this.matchedEventNames = matchedEventNames;
    }

    public List<String> getMissingEventNames() {
        return missingEventNames;
    }

    public void setMissingEventNames(List<String> missingEventNames) {
        this.missingEventNames = missingEventNames;
    }
}
