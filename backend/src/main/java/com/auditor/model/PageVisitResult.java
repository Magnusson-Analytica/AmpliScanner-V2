package com.auditor.model;

import java.util.List;

public class PageVisitResult {
    private String url;
    private List<ActionAttempt> actionsAttempted;
    private List<CapturedEvent> capturedEvents;
    private boolean dataLayerPresent;

    public PageVisitResult() {
    }

    public PageVisitResult(String url, List<ActionAttempt> actionsAttempted, List<CapturedEvent> capturedEvents, boolean dataLayerPresent) {
        this.url = url;
        this.actionsAttempted = actionsAttempted;
        this.capturedEvents = capturedEvents;
        this.dataLayerPresent = dataLayerPresent;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public List<ActionAttempt> getActionsAttempted() {
        return actionsAttempted;
    }

    public void setActionsAttempted(List<ActionAttempt> actionsAttempted) {
        this.actionsAttempted = actionsAttempted;
    }

    public List<CapturedEvent> getCapturedEvents() {
        return capturedEvents;
    }

    public void setCapturedEvents(List<CapturedEvent> capturedEvents) {
        this.capturedEvents = capturedEvents;
    }

    public boolean isDataLayerPresent() {
        return dataLayerPresent;
    }

    public void setDataLayerPresent(boolean dataLayerPresent) {
        this.dataLayerPresent = dataLayerPresent;
    }
}
