package com.auditor.service;

import com.auditor.model.DiscoveryRunRequest;
import com.microsoft.playwright.Page;

import java.time.Instant;
import java.util.concurrent.CompletableFuture;

/**
 * Tracks one paused manual-login run. Playwright's Java client is not thread-safe across
 * threads - a Page/Browser must only ever be touched by the thread that created it - so this
 * object never hands the Page out for another thread to drive. Its only job is to let the
 * confirm-login HTTP thread signal the single background thread that owns the Playwright
 * session (parked in AutoDiscoveryService.runManualLoginScan) that it's safe to resume.
 */
public class PendingLoginSession {
    private final Page page;
    private final DiscoveryRunRequest request;
    private final Instant createdAt;
    private final CompletableFuture<Void> loginConfirmed = new CompletableFuture<>();

    public PendingLoginSession(Page page, DiscoveryRunRequest request, Instant createdAt) {
        this.page = page;
        this.request = request;
        this.createdAt = createdAt;
    }

    public Page getPage() {
        return page;
    }

    public DiscoveryRunRequest getRequest() {
        return request;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void confirmLogin() {
        loginConfirmed.complete(null);
    }

    public CompletableFuture<Void> getLoginConfirmedSignal() {
        return loginConfirmed;
    }
}
