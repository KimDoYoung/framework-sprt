package com.asseterp.oms.common.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

import java.util.List;

/**
 * 로깅 설정 (asseterp.log.*). 파일 보관 정책(info/error/audit/async)은 logback-spring.xml이 직접 읽는다.
 *
 * @param traceHeader 요청 추적 ID를 내려주는 응답 헤더명
 * @param requestLog  요청 종료 로그 설정
 */
@ConfigurationProperties(prefix = "asseterp.log")
public record LogProperties(
        @DefaultValue("X-Trace-Id") String traceHeader,
        @DefaultValue RequestLog requestLog
) {
    /**
     * @param enabled      요청 종료 로그(method uri status elapsedMs) 기록 여부
     * @param excludePaths 기록하지 않는 경로 패턴 (정적 리소스 등)
     */
    public record RequestLog(
            @DefaultValue("true") boolean enabled,
            @DefaultValue List<String> excludePaths
    ) {
    }
}
