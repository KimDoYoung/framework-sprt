package kr.co.kfs.asseterp.oms.common.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;
import java.util.List;

/**
 * CORS 설정 (asseterp.cors.*)
 */
@ConfigurationProperties(prefix = "asseterp.cors")
public record CorsProperties(
        List<String> allowedOrigins,
        List<String> allowedMethods,
        List<String> allowedHeaders,
        Duration maxAge
) {
}
