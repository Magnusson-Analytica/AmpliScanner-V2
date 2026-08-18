package com.auditor.service;

/**
 * Thrown when a manual-login session was not confirmed within
 * auditor.discovery.manual-login-timeout-ms.
 */
public class ManualLoginExpiredException extends RuntimeException {
    public ManualLoginExpiredException(String message) {
        super(message);
    }
}
