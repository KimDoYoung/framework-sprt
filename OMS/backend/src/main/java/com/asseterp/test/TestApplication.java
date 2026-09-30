package com.asseterp.test;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@SpringBootApplication
@RestController
public class TestApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(TestApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(TestApplication.class, args);
    }

    @GetMapping("/api/health")
    public Map<String, Object> healthCheck() {
        return Map.of(
            "status", "UP",
            "message", "AssetERP Backend Prototype Ready",
            "javaVersion", System.getProperty("java.version")
        );
    }
}
