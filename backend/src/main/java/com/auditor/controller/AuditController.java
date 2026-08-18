package com.auditor.controller;

import com.auditor.model.CapturedEvent;
import com.auditor.model.DiscoveryRunRequest;
import com.auditor.model.DiscoveryRunResult;
import com.auditor.model.SavedReportSummary;
import com.auditor.model.ScanProgress;
import com.auditor.model.ScanStatus;
import com.auditor.service.AuditRunStorage;
import com.auditor.service.AutoDiscoveryService;
import com.auditor.service.ManualLoginExpiredException;
import com.auditor.service.PendingLoginSession;
import com.auditor.service.PendingLoginSessionRegistry;
import com.auditor.service.ReportPersistenceService;
import com.auditor.service.ScanProgressStorage;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = "http://localhost:5173")
public class AuditController {
    private static final Logger log = LoggerFactory.getLogger(AuditController.class);

    private final AutoDiscoveryService discoveryService;
    private final AuditRunStorage runStorage;
    private final ScanProgressStorage progressStorage;
    private final ReportPersistenceService reportPersistenceService;
    private final PendingLoginSessionRegistry pendingLoginSessionRegistry;
    private final ObjectMapper objectMapper;
    private final ExecutorService scanExecutor = Executors.newFixedThreadPool(2);
    // Manual-login runs block their thread for as long as the user takes to log in (up to
    // auditor.discovery.manual-login-timeout-ms) - kept off scanExecutor's small fixed pool so a
    // pending login can't starve capacity for ordinary headless scans.
    private final ExecutorService manualLoginExecutor = Executors.newCachedThreadPool();

    public AuditController(AutoDiscoveryService discoveryService, AuditRunStorage runStorage,
                            ScanProgressStorage progressStorage, ReportPersistenceService reportPersistenceService,
                            PendingLoginSessionRegistry pendingLoginSessionRegistry, ObjectMapper objectMapper) {
        this.discoveryService = discoveryService;
        this.runStorage = runStorage;
        this.progressStorage = progressStorage;
        this.reportPersistenceService = reportPersistenceService;
        this.pendingLoginSessionRegistry = pendingLoginSessionRegistry;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/discover")
    public ResponseEntity<Map<String, String>> discover(@Valid @RequestBody DiscoveryRunRequest request) {
        String runId = UUID.randomUUID().toString();

        if (request.isManualLogin()) {
            progressStorage.update(new ScanProgress(runId, ScanStatus.RUNNING, 0, 0, request.getTargetUrl(), null, null));

            manualLoginExecutor.submit(() -> {
                try {
                    DiscoveryRunResult result = discoveryService.runManualLoginScan(request, runId, progressStorage::update,
                            session -> {
                                pendingLoginSessionRegistry.put(runId, session);
                                progressStorage.update(new ScanProgress(runId, ScanStatus.AWAITING_LOGIN, 0, 0,
                                        request.getTargetUrl(), null, null));
                            });
                    result.setHistoricalComparison(reportPersistenceService.computeHistoricalComparison(result));
                    runStorage.store(result);
                    reportPersistenceService.saveToDisk(result);
                    progressStorage.update(new ScanProgress(runId, ScanStatus.COMPLETED,
                            result.getPagesVisited().size(), result.getAllCapturedAmplitudeEvents().size(), null, null, result));
                } catch (ManualLoginExpiredException e) {
                    progressStorage.update(new ScanProgress(runId, ScanStatus.EXPIRED, 0, 0, null, e.getMessage(), null));
                } catch (Exception e) {
                    log.warn("Manual login scan {} failed: {}", runId, e.getMessage());
                    progressStorage.update(new ScanProgress(runId, ScanStatus.FAILED, 0, 0, null, e.getMessage(), null));
                } finally {
                    pendingLoginSessionRegistry.remove(runId);
                }
            });

            Map<String, String> body = new HashMap<>();
            body.put("runId", runId);
            return ResponseEntity.accepted().body(body);
        }

        progressStorage.update(new ScanProgress(runId, ScanStatus.RUNNING, 0, 0, request.getTargetUrl(), null, null));

        scanExecutor.submit(() -> {
            try {
                DiscoveryRunResult result = discoveryService.discover(request, runId, progressStorage::update);
                result.setHistoricalComparison(reportPersistenceService.computeHistoricalComparison(result));
                runStorage.store(result);
                reportPersistenceService.saveToDisk(result);
                progressStorage.update(new ScanProgress(runId, ScanStatus.COMPLETED,
                        result.getPagesVisited().size(), result.getAllCapturedAmplitudeEvents().size(), null, null, result));
            } catch (Exception e) {
                log.warn("Scan {} failed: {}", runId, e.getMessage());
                progressStorage.update(new ScanProgress(runId, ScanStatus.FAILED, 0, 0, null, e.getMessage(), null));
            }
        });

        Map<String, String> body = new HashMap<>();
        body.put("runId", runId);
        return ResponseEntity.accepted().body(body);
    }

    @PostMapping("/discover/{runId}/confirm-login")
    public ResponseEntity<Map<String, String>> confirmLogin(@PathVariable String runId) {
        // Only signals the session - the actual resume runs on the single background thread
        // that already owns this session's Playwright objects (see runManualLoginScan).
        Optional<PendingLoginSession> sessionOpt = pendingLoginSessionRegistry.get(runId);
        if (sessionOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        PendingLoginSession session = sessionOpt.get();
        session.confirmLogin();
        progressStorage.update(new ScanProgress(runId, ScanStatus.RUNNING, 0, 0, session.getRequest().getTargetUrl(), null, null));

        Map<String, String> body = new HashMap<>();
        body.put("runId", runId);
        return ResponseEntity.accepted().body(body);
    }

    @GetMapping("/discover/{runId}/status")
    public ResponseEntity<ScanProgress> getScanStatus(@PathVariable String runId) {
        return progressStorage.get(runId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/reports")
    public ResponseEntity<List<SavedReportSummary>> listSavedReports() {
        return ResponseEntity.ok(reportPersistenceService.listSavedReports());
    }

    @GetMapping("/reports/{fileName}")
    public ResponseEntity<DiscoveryRunResult> getSavedReport(@PathVariable String fileName) {
        return reportPersistenceService.loadReport(fileName)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/export/{runId}")
    public ResponseEntity<byte[]> exportReport(@PathVariable String runId, @RequestParam(defaultValue = "json") String format) {
        DiscoveryRunResult result = runStorage.get(runId)
                .orElseThrow(() -> new IllegalArgumentException("Run not found: " + runId));

        if ("csv".equalsIgnoreCase(format)) {
            String csv = buildCsv(result);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"audit-report-" + runId + ".csv\"")
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(csv.getBytes(StandardCharsets.UTF_8));
        }

        String body = toJson(result);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"audit-report-" + runId + ".json\"")
                .contentType(MediaType.APPLICATION_JSON)
                .body(body.getBytes(StandardCharsets.UTF_8));
    }

    private String toJson(DiscoveryRunResult result) {
        try {
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(result);
        } catch (Exception e) {
            throw new RuntimeException("Unable to serialize report", e);
        }
    }

    private String buildCsv(DiscoveryRunResult result) {
        StringBuilder builder = new StringBuilder();
        builder.append("page_url,event_name,matched_action_name,tracking_method,timestamp,count,raw_payload_snippet\n");
        for (CapturedEvent event : result.getAllCapturedAmplitudeEvents()) {
            String snippet = event.getRawPayload() != null ? event.getRawPayload() : "";
            if (snippet.length() > 120) {
                snippet = snippet.substring(0, 120) + "...";
            }
            snippet = snippet.replace("\n", " ").replace("\r", " ");

            builder.append(escapeCsv(event.getPageUrl()))
                    .append(',')
                    .append(escapeCsv(event.getEventName()))
                    .append(',')
                    .append(escapeCsv(event.getMatchedActionName()))
                    .append(',')
                    .append(escapeCsv(event.getTrackingMethod()))
                    .append(',')
                    .append(escapeCsv(event.getTimestamp() != null ? event.getTimestamp().toString() : ""))
                    .append(',')
                    .append(event.getCount())
                    .append(',')
                    .append(escapeCsv(snippet))
                    .append('\n');
        }
        return builder.toString();
    }

    private String escapeCsv(String value) {
        if (value == null) {
            return "";
        }
        String escaped = value.replace("\"", "\"\"");
        if (escaped.contains(",") || escaped.contains("\n") || escaped.contains("\r") || escaped.contains("\"")) {
            return "\"" + escaped + "\"";
        }
        return escaped;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));
        Map<String, Object> error = new HashMap<>();
        error.put("status", 400);
        error.put("message", "Validation failed");
        error.put("errors", fieldErrors);
        return error;
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleIllegalArgument(IllegalArgumentException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("status", 400);
        error.put("message", ex.getMessage());
        return error;
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, Object> handleException(Exception ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("status", 500);
        error.put("message", "Server error: " + ex.getMessage());
        return error;
    }
}
