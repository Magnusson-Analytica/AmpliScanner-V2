package com.auditor.model;

import java.util.List;

public class EvidenceLine {
    private String text;
    private List<String> terms;

    public EvidenceLine() {
    }

    public EvidenceLine(String text, List<String> terms) {
        this.text = text;
        this.terms = terms;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public List<String> getTerms() {
        return terms;
    }

    public void setTerms(List<String> terms) {
        this.terms = terms;
    }
}
