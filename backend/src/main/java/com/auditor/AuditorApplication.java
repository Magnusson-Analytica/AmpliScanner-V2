package com.auditor;

import com.auditor.config.AuditorProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(AuditorProperties.class)
public class AuditorApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuditorApplication.class, args);
    }
}
