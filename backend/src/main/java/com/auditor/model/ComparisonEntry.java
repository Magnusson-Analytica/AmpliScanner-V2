package com.auditor.model;

public class ComparisonEntry {
    private String pageUrl;
    private String eventName;

    public ComparisonEntry() {
    }

    public ComparisonEntry(String pageUrl, String eventName) {
        this.pageUrl = pageUrl;
        this.eventName = eventName;
    }

    public String getPageUrl() {
        return pageUrl;
    }

    public void setPageUrl(String pageUrl) {
        this.pageUrl = pageUrl;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }
}
