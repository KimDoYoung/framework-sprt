package kr.co.kfs.asseterp.common.batch;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.co.kfs.asseterp.common.config.properties.BatchProperties;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import kr.co.kfs.asseterp.common.error.ErrorResponseWriter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.util.matcher.IpAddressMatcher;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.List;

/**
 * 배치 API(/api/v1/batch/**) 인증: 서버 간 API key + 호출 IP 제한.
 * AS-IS BatchMain 서블릿은 인증이 없었다(외부 cron이 URL만 호출). TOBE는 둘 중 하나라도 맞지 않으면 거절한다.
 * 설정이 비어 있으면(키 없음·허용 IP 없음·enabled=false) 모두 거절한다 — 기본 거절.
 * 호출 IP는 request.getRemoteAddr()만 쓴다(X-Forwarded-For는 위조할 수 있다 — docs/log-설계.md).
 */
@Slf4j
@Component
public class BatchApiKeyFilter extends OncePerRequestFilter {

    private static final String ROLE_BATCH = "ROLE_BATCH";

    private final BatchProperties properties;
    private final ErrorResponseWriter errorResponseWriter;
    private final List<IpAddressMatcher> ipMatchers;

    public BatchApiKeyFilter(BatchProperties properties, ErrorResponseWriter errorResponseWriter) {
        this.properties = properties;
        this.errorResponseWriter = errorResponseWriter;
        this.ipMatchers = properties.allowedIps().stream()
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(IpAddressMatcher::new)
                .toList();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String ip = request.getRemoteAddr();

        if (!properties.enabled() || isBlank(properties.apiKey()) || ipMatchers.isEmpty()) {
            log.warn("배치 API 거절(비활성 또는 설정 없음): ip={}, uri={}", ip, request.getRequestURI());
            errorResponseWriter.write(response, ErrorCode.ACCESS_DENIED, "배치 API를 사용할 수 없습니다.");
            return;
        }
        if (!ipAllowed(ip)) {
            log.warn("배치 API 거절(허용되지 않은 IP): ip={}, uri={}", ip, request.getRequestURI());
            errorResponseWriter.write(response, ErrorCode.ACCESS_DENIED, "배치 API를 호출할 수 없는 주소입니다.");
            return;
        }
        if (!keyMatches(request.getHeader(properties.apiKeyHeader()))) {
            log.warn("배치 API 거절(API key 불일치): ip={}, uri={}", ip, request.getRequestURI());
            errorResponseWriter.write(response, ErrorCode.ACCESS_DENIED, "배치 API 키가 올바르지 않습니다.");
            return;
        }

        SecurityContextHolder.getContext().setAuthentication(
                UsernamePasswordAuthenticationToken.authenticated("batch", null, List.of(new SimpleGrantedAuthority(ROLE_BATCH))));
        try {
            chain.doFilter(request, response);
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    private boolean ipAllowed(String ip) {
        if (isBlank(ip)) {
            return false;
        }
        for (IpAddressMatcher matcher : ipMatchers) {
            try {
                if (matcher.matches(ip)) {
                    return true;
                }
            } catch (IllegalArgumentException e) {
                // 형식이 다른 주소(예: IPv6 요청에 IPv4 규칙)는 일치하지 않는 것으로 본다
            }
        }
        return false;
    }

    /** 타이밍 공격을 피하려고 고정 시간 비교를 쓴다 */
    private boolean keyMatches(String given) {
        if (isBlank(given)) {
            return false;
        }
        return MessageDigest.isEqual(
                given.getBytes(StandardCharsets.UTF_8),
                properties.apiKey().getBytes(StandardCharsets.UTF_8));
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }
}
