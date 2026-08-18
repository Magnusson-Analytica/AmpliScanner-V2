package com.auditor.model;

public class ActionAttempt {
    private String actionName;
    private boolean matched;
    private String selectorUsed;

    public ActionAttempt() {
    }

    public ActionAttempt(String actionName, boolean matched, String selectorUsed) {
        this.actionName = actionName;
        this.matched = matched;
        this.selectorUsed = selectorUsed;
    }

    public String getActionName() {
        return actionName;
    }

    public void setActionName(String actionName) {
        this.actionName = actionName;
    }

    public boolean isMatched() {
        return matched;
    }

    public void setMatched(boolean matched) {
        this.matched = matched;
    }

    public String getSelectorUsed() {
        return selectorUsed;
    }

    public void setSelectorUsed(String selectorUsed) {
        this.selectorUsed = selectorUsed;
    }
}
