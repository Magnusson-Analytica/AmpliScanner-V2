package com.auditor.service;

import com.auditor.model.DiscoveryRunResult;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuditRunStorage {
    private final Map<String, DiscoveryRunResult> runs = new ConcurrentHashMap<>();

    public void store(DiscoveryRunResult result) {
        if (result != null && result.getRunId() != null) {
            runs.put(result.getRunId(), result);
        }
    }

    public Optional<DiscoveryRunResult> get(String runId) {
        return Optional.ofNullable(runs.get(runId));
    }
}
