package com.auditor.model;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public class DiscoveryRunRequest {
    @NotBlank
    private String targetUrl;
    private Integer maxDepth;
    private Integer maxPages;
    private List<String> expectedEventNames;
    private boolean exhaustive;
    private boolean manualLogin;

    public String getTargetUrl() {
        return targetUrl;
    }

    public void setTargetUrl(String targetUrl) {
        this.targetUrl = targetUrl;
    }

    public Integer getMaxDepth() {
        return maxDepth;
    }

    public void setMaxDepth(Integer maxDepth) {
        this.maxDepth = maxDepth;
    }

    public Integer getMaxPages() {
        return maxPages;
    }

    public void setMaxPages(Integer maxPages) {
        this.maxPages = maxPages;
    }

    public List<String> getExpectedEventNames() {
        return expectedEventNames;
    }

    public void setExpectedEventNames(List<String> expectedEventNames) {
        this.expectedEventNames = expectedEventNames;
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
}
