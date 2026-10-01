package com.asseterp.oms.common.tenant;

import com.asseterp.oms.biz.company.mapper.CompanyMapper;
import com.asseterp.oms.common.config.properties.TenantProperties;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Locale;

/**
 * 요청 호스트의 첫 라벨로 회사를 판별한다.
 * AS-IS는 브라우저(GWT LoginPage)가 URL에서 회사 코드를 떼어 서버로 보냈지만, TOBE는 서버가 Host로 직접 판정한다.
 * <ul>
 *   <li>kfstest.localhost → kfstest, admindev.asseterp.co.kr → admin</li>
 *   <li>localhost, IP처럼 서브도메인이 없으면 asseterp.tenant.default-code</li>
 *   <li>프록시(Vite, nginx) 뒤에서는 server.forward-headers-strategy=framework로 X-Forwarded-Host가 반영된 값을 쓴다</li>
 * </ul>
 */
@Component
@RequiredArgsConstructor
public class TenantResolver {

    private final TenantProperties tenantProperties;
    private final CompanyMapper companyMapper;

    public Tenant resolve(HttpServletRequest request) {
        String host = request.getServerName().toLowerCase(Locale.ROOT);
        String code = normalize(extractCode(host));
        boolean admin = tenantProperties.adminCode().equals(code);
        return new Tenant(host, code, companyMapper.findByCompanyCode(code).orElse(null), admin);
    }

    private String extractCode(String host) {
        if (host.startsWith("www.")) {
            host = host.substring(4);
        }
        int dot = host.indexOf('.');
        // 점이 없거나(localhost) IPv4/IPv6 주소면 서브도메인이 없는 것으로 본다
        if (dot < 0 || host.chars().allMatch(c -> Character.isDigit(c) || c == '.') || host.contains(":")) {
            return tenantProperties.defaultCode();
        }
        String code = host.substring(0, dot);
        return StringUtils.hasText(code) ? code : tenantProperties.defaultCode();
    }

    private String normalize(String code) {
        return tenantProperties.adminAliases().contains(code) ? tenantProperties.adminCode() : code;
    }
}
