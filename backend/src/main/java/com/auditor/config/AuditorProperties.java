package com.auditor.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "auditor")
public class AuditorProperties {

    private final Amplitude amplitude = new Amplitude();
    private final Discovery discovery = new Discovery();
    private final Reports reports = new Reports();

    public Amplitude getAmplitude() {
        return amplitude;
    }

    public Discovery getDiscovery() {
        return discovery;
    }

    public Reports getReports() {
        return reports;
    }

    public static class Amplitude {
        private List<String> hostPatterns = List.of();

        public List<String> getHostPatterns() {
            return hostPatterns;
        }

        public void setHostPatterns(List<String> hostPatterns) {
            this.hostPatterns = hostPatterns;
        }
    }

    public static class Discovery {
        private int maxDepth = 2;
        private int maxPages = 10;
        private int hardMaxDepth = 5;
        private int hardMaxPages = 50;
        private int actionPollTimeoutMs = 3000;
        private int scrollStepWaitMs = 800;
        private int navigationTimeoutMs = 15000;
        private int politeDelayMs = 300;
        private int manualLoginTimeoutMs = 300000;
        private String userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                + "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";
        private int exhaustiveMaxElements = 40;
        private List<String> exhaustiveExcludeKeywords = List.of(
                "delete", "remove", "unsubscribe", "cancel", "buy", "purchase", "checkout", "pay",
                "logout", "log out", "sign out", "deactivate", "close account", "delete account",
                "uninstall", "refund", "confirm order", "place order");

        public int getMaxDepth() {
            return maxDepth;
        }

        public void setMaxDepth(int maxDepth) {
            this.maxDepth = maxDepth;
        }

        public int getMaxPages() {
            return maxPages;
        }

        public void setMaxPages(int maxPages) {
            this.maxPages = maxPages;
        }

        public int getHardMaxDepth() {
            return hardMaxDepth;
        }

        public void setHardMaxDepth(int hardMaxDepth) {
            this.hardMaxDepth = hardMaxDepth;
        }

        public int getHardMaxPages() {
            return hardMaxPages;
        }

        public void setHardMaxPages(int hardMaxPages) {
            this.hardMaxPages = hardMaxPages;
        }

        public int getActionPollTimeoutMs() {
            return actionPollTimeoutMs;
        }

        public void setActionPollTimeoutMs(int actionPollTimeoutMs) {
            this.actionPollTimeoutMs = actionPollTimeoutMs;
        }

        public int getScrollStepWaitMs() {
            return scrollStepWaitMs;
        }

        public void setScrollStepWaitMs(int scrollStepWaitMs) {
            this.scrollStepWaitMs = scrollStepWaitMs;
        }

        public int getNavigationTimeoutMs() {
            return navigationTimeoutMs;
        }

        public void setNavigationTimeoutMs(int navigationTimeoutMs) {
            this.navigationTimeoutMs = navigationTimeoutMs;
        }

        public int getPoliteDelayMs() {
            return politeDelayMs;
        }

        public void setPoliteDelayMs(int politeDelayMs) {
            this.politeDelayMs = politeDelayMs;
        }

        public int getManualLoginTimeoutMs() {
            return manualLoginTimeoutMs;
        }

        public void setManualLoginTimeoutMs(int manualLoginTimeoutMs) {
            this.manualLoginTimeoutMs = manualLoginTimeoutMs;
        }

        public String getUserAgent() {
            return userAgent;
        }

        public void setUserAgent(String userAgent) {
            this.userAgent = userAgent;
        }

        public int getExhaustiveMaxElements() {
            return exhaustiveMaxElements;
        }

        public void setExhaustiveMaxElements(int exhaustiveMaxElements) {
            this.exhaustiveMaxElements = exhaustiveMaxElements;
        }

        public List<String> getExhaustiveExcludeKeywords() {
            return exhaustiveExcludeKeywords;
        }

        public void setExhaustiveExcludeKeywords(List<String> exhaustiveExcludeKeywords) {
            this.exhaustiveExcludeKeywords = exhaustiveExcludeKeywords;
        }
    }

    public static class Reports {
        private boolean saveToDisk = true;
        private String directory = "reports";

        public boolean isSaveToDisk() {
            return saveToDisk;
        }

        public void setSaveToDisk(boolean saveToDisk) {
            this.saveToDisk = saveToDisk;
        }

        public String getDirectory() {
            return directory;
        }

        public void setDirectory(String directory) {
            this.directory = directory;
        }
    }
}
