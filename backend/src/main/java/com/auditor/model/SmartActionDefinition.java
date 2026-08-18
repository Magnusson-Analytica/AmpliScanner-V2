package com.auditor.model;

import java.util.List;

public class SmartActionDefinition {

    public enum Type {
        CLICK,
        SCROLL,
        HOVER
    }

    private String name;
    private Type type;
    private List<String> textMatches;
    private List<String> selectors;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public List<String> getTextMatches() {
        return textMatches;
    }

    public void setTextMatches(List<String> textMatches) {
        this.textMatches = textMatches;
    }

    public List<String> getSelectors() {
        return selectors;
    }

    public void setSelectors(List<String> selectors) {
        this.selectors = selectors;
    }
}
