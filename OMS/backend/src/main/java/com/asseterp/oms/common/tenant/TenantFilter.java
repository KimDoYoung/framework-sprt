package com.asseterp.oms.common.tenant;

import com.asseterp.oms.common.error.ErrorCode;
import com.asseterp.oms.common.error.ErrorResponseWriter;
import com.asseterp.oms.common.log.MdcKeys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * 요청마다 접속 회사(Tenant)를 판별해 request 속성과 MDC에 넣는다. Security 필터 체인에서 JWT 인증보다 먼저 실행된다.
 * <ul>
 *   <li>정적 리소스는 그대로 통과시켜 로그인 화면이 "유효하지 않은 고객정보"를 안내할 수 있게 한다.</li>
 *   <li>/api/public/tenant는 무효한 회사라도 판별 결과를 내려주어야 하므로 통과시킨다.</li>
 *   <li>그 밖의 /api/** 는 무효한 회사면 TENANT_NOT_FOUND로 막는다.</li>
 * </ul>
 */
@Component
@RequiredArgsConstructor
public class TenantFilter extends OncePerRequestFilter {

    private static final String TENANT_ATTRIBUTE = Tenant.class.getName();
    private static final String TENANT_INFO_PATH = "/api/public/tenant";

    private final TenantResolver tenantResolver;
    private final ErrorResponseWriter errorResponseWriter;

    public static Tenant current(HttpServletRequest request) {
        return (Tenant) request.getAttribute(TENANT_ATTRIBUTE);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        Tenant tenant = tenantResolver.resolve(request);
        request.setAttribute(TENANT_ATTRIBUTE, tenant);
        MDC.put(MdcKeys.TENANT, tenant.code());

        String path = request.getRequestURI().substring(request.getContextPath().length());
        if (!tenant.isValid() && path.startsWith("/api/") && !path.equals(TENANT_INFO_PATH)) {
            errorResponseWriter.write(response, ErrorCode.TENANT_NOT_FOUND,
                    ErrorCode.TENANT_NOT_FOUND.getMessage() + " (" + tenant.host() + ")");
            return;
        }
        filterChain.doFilter(request, response);
    }
}
