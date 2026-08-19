package com.auditor.model;

public class ScorecardVerdict {
    private String band;
    private String label;
    private String summary;
    private String confidenceNote;

    public ScorecardVerdict() {
    }

    public ScorecardVerdict(String band, String label, String summary, String confidenceNote) {
        this.band = band;
        this.label = label;
        this.summary = summary;
        this.confidenceNote = confidenceNote;
    }

    public String getBand() {
        return band;
    }

    public void setBand(String band) {
        this.band = band;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getConfidenceNote() {
        return confidenceNote;
    }

    public void setConfidenceNote(String confidenceNote) {
        this.confidenceNote = confidenceNote;
    }
}
