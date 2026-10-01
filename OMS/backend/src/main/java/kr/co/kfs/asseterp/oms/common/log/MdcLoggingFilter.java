package kr.co.kfs.asseterp.oms.common.log;

import kr.co.kfs.asseterp.oms.common.config.properties.LogProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HexFormat;
import java.util.concurrent.ThreadLocalRandom;

/**
 * 요청 추적 필터. Spring Security 필터 체인보다 먼저 실행된다.
 * <ul>
 *   <li>요청마다 추적 ID(16자리 hex)와 클라이언트 IP를 MDC에 넣어 모든 로그 줄에 출력되게 한다.</li>
 *   <li>추적 ID를 응답 헤더(asseterp.log.trace-header)로 내려 화면의 오류 메시지와 로그를 연결한다.</li>
 *   <li>요청 종료 시 method uri status elapsedMs를 기록한다 (asseterp.log.request-log).</li>
 * </ul>
 * 사용자 ID는 인증 이후에 알 수 있으므로 JwtAuthenticationFilter가 MDC에 넣는다. MDC 정리는 이 필터가 담당한다.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@RequiredArgsConstructor
public class MdcLoggingFilter extends OncePerRequestFilter {

    private static final Logger accessLog = LoggerFactory.getLogger("kr.co.kfs.asseterp.oms.access");
    private static final AntPathMatcher PATH_MATCHER = new AntPathMatcher();

    private final LogProperties logProperties;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        long startNanos = System.nanoTime();
        String traceId = newTraceId();
        try {
            MDC.put(MdcKeys.TRACE_ID, traceId);
            // 프록시 뒤에 배치할 때는 server.forward-headers-strategy로 원래 IP를 복원한다 (X-Forwarded-For 직접 신뢰 금지)
            MDC.put(MdcKeys.CLIENT_IP, request.getRemoteAddr());
            response.setHeader(logProperties.traceHeader(), traceId);

            filterChain.doFilter(request, response);
        } finally {
            if (shouldLogRequest(request)) {
                long elapsedMs = (System.nanoTime() - startNanos) / 1_000_000;
                accessLog.info("{} {} {} {}ms", request.getMethod(), request.getRequestURI(), response.getStatus(), elapsedMs);
            }
            // 스레드 재사용 시 이전 요청의 값이 남지 않도록 정리
            MDC.clear();
        }
    }

    public static String newTraceId() {
        return HexFormat.of().toHexDigits(ThreadLocalRandom.current().nextLong());
    }

    private boolean shouldLogRequest(HttpServletRequest request) {
        LogProperties.RequestLog requestLog = logProperties.requestLog();
        if (!requestLog.enabled()) {
            return false;
        }
        String path = request.getRequestURI().substring(request.getContextPath().length());
        return requestLog.excludePaths().stream().noneMatch(pattern -> PATH_MATCHER.match(pattern, path));
    }
}
