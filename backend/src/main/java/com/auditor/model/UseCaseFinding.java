package com.auditor.model;

import java.util.List;

public class UseCaseFinding {
    private String id;
    private String title;
    private boolean triggered;
    private String severity;
    private String summary;
    private String consequence;
    private String nextStep;
    private List<EvidenceLine> evidence;

    public UseCaseFinding() {
    }

    public UseCaseFinding(String id, String title, boolean triggered, String severity, String summary,
                           String consequence, String nextStep, List<EvidenceLine> evidence) {
        this.id = id;
        this.title = title;
        this.triggered = triggered;
        this.severity = severity;
        this.summary = summary;
        this.consequence = consequence;
        this.nextStep = nextStep;
        this.evidence = evidence;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isTriggered() {
        return triggered;
    }

    public void setTriggered(boolean triggered) {
        this.triggered = triggered;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getConsequence() {
        return consequence;
    }

    public void setConsequence(String consequence) {
        this.consequence = consequence;
    }

    public String getNextStep() {
        return nextStep;
    }

    public void setNextStep(String nextStep) {
        this.nextStep = nextStep;
    }

    public List<EvidenceLine> getEvidence() {
        return evidence;
    }

    public void setEvidence(List<EvidenceLine> evidence) {
        this.evidence = evidence;
    }
}
