package com.auditor.model;

import java.time.Instant;

public class CapturedEvent {
    private String eventName;
    private Instant timestamp;
    private String rawPayload;
    private String pageUrl;
    private String matchedActionName;
    private int count = 1;
    private String trackingMethod;

    public CapturedEvent() {
    }

    public CapturedEvent(String eventName, Instant timestamp, String rawPayload, String pageUrl, String matchedActionName) {
        this.eventName = eventName;
        this.timestamp = timestamp;
        this.rawPayload = rawPayload;
        this.pageUrl = pageUrl;
        this.matchedActionName = matchedActionName;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getRawPayload() {
        return rawPayload;
    }

    public void setRawPayload(String rawPayload) {
        this.rawPayload = rawPayload;
    }

    public String getPageUrl() {
        return pageUrl;
    }

    public void setPageUrl(String pageUrl) {
        this.pageUrl = pageUrl;
    }

    public String getMatchedActionName() {
        return matchedActionName;
    }

    public void setMatchedActionName(String matchedActionName) {
        this.matchedActionName = matchedActionName;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public String getTrackingMethod() {
        return trackingMethod;
    }

    public void setTrackingMethod(String trackingMethod) {
        this.trackingMethod = trackingMethod;
    }
}
