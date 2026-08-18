package com.auditor.service;

import com.auditor.model.ScanProgress;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ScanProgressStorage {
    private final Map<String, ScanProgress> progress = new ConcurrentHashMap<>();

    public void update(ScanProgress snapshot) {
        if (snapshot != null && snapshot.getRunId() != null) {
            progress.put(snapshot.getRunId(), snapshot);
        }
    }

    public Optional<ScanProgress> get(String runId) {
        return Optional.ofNullable(progress.get(runId));
    }
}
