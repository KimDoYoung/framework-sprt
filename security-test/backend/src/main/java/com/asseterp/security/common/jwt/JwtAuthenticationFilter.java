package com.asseterp.security.common.jwt;

import com.asseterp.security.biz.auth.dto.UserPrincipal;
import com.asseterp.security.common.error.BusinessException;
import com.asseterp.security.common.error.ErrorCode;
import com.asseterp.security.common.error.ErrorResponseWriter;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    /** 인증 실패 사유(ErrorCode)를 JwtAuthenticationEntryPoint로 전달하는 request 속성 */
    public static final String AUTH_ERROR_ATTRIBUTE = "AUTH_ERROR";

    private final JwtTokenProvider tokenProvider;
    private final RedisTokenService redisTokenService;
    private final AuthCookieManager cookieManager;
    private final ErrorResponseWriter errorResponseWriter;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String token = resolveToken(request);

        if (StringUtils.hasText(token)) {
            try {
                UserPrincipal principal = tokenProvider.toUserPrincipal(
                        tokenProvider.parseClaims(token, JwtTokenProvider.TokenType.ACCESS));

                // 요구사항 7: 멀티 로그인 검사 (Redis의 최신 jti와 일치 여부 확인)
                switch (redisTokenService.checkJti(principal.getUserId(), principal.getJti())) {
                    case MATCH -> {
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                    case MISMATCH -> request.setAttribute(AUTH_ERROR_ATTRIBUTE, ErrorCode.MULTI_LOGIN_DETECTED);
                    case NOT_FOUND -> request.setAttribute(AUTH_ERROR_ATTRIBUTE, ErrorCode.SESSION_NOT_FOUND);
                }
            } catch (ExpiredJwtException e) {
                request.setAttribute(AUTH_ERROR_ATTRIBUTE, ErrorCode.TOKEN_EXPIRED);
            } catch (JwtException | IllegalArgumentException e) {
                log.warn("유효하지 않은 JWT 토큰입니다: {}", e.getMessage());
                request.setAttribute(AUTH_ERROR_ATTRIBUTE, ErrorCode.INVALID_TOKEN);
            } catch (BusinessException e) {
                // Redis 장애 등: 인증 여부를 판단할 수 없으므로 요청을 중단하고 원인을 그대로 응답
                errorResponseWriter.write(response, e.getErrorCode(), e.getMessage());
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        // 1. 쿠키에서 추출 (우선순위 1)
        String cookieToken = cookieManager.resolveAccessToken(request);
        if (StringUtils.hasText(cookieToken)) {
            return cookieToken;
        }

        // 2. Authorization 헤더에서 추출 (우선순위 2)
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }

        return null;
    }
}
