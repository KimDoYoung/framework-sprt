package com.asseterp.security.common.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

/**
 * 서브도메인 테넌트 설정 (asseterp.tenant.*)
 * AS-IS처럼 {sys01_loc_nm}.도메인 으로 접속하면 첫 라벨을 회사 코드로 사용한다.
 *
 * @param adminCode    KFS 관리자 테넌트 코드 (sys01_loc_nm). 로그인 화면에서 회사를 선택할 수 있다
 * @param adminAliases adminCode로 취급할 서브도메인 (AS-IS: admin, admindev, admindr, extadmin)
 * @param defaultCode  서브도메인이 없는 호스트(localhost, IP)로 접속했을 때 사용할 회사 코드
 */
@ConfigurationProperties(prefix = "asseterp.tenant")
public record TenantProperties(
        String adminCode,
        List<String> adminAliases,
        String defaultCode
) {
}
