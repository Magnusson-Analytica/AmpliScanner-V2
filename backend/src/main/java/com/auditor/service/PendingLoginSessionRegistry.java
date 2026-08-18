package com.auditor.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Tracks manual-login sessions awaiting confirmation, keyed by runId. Only used to let the
 * confirm-login HTTP thread find the right session to signal (see {@link PendingLoginSession})
 * - it never hands out anything that touches Playwright directly. In-memory only: a backend
 * restart loses any session that hasn't been confirmed yet.
 */
@Service
public class PendingLoginSessionRegistry {
    private final Map<String, PendingLoginSession> sessions = new ConcurrentHashMap<>();

    public void put(String runId, PendingLoginSession session) {
        sessions.put(runId, session);
    }

    public Optional<PendingLoginSession> get(String runId) {
        return Optional.ofNullable(sessions.get(runId));
    }

    public Optional<PendingLoginSession> remove(String runId) {
        return Optional.ofNullable(sessions.remove(runId));
    }
}
