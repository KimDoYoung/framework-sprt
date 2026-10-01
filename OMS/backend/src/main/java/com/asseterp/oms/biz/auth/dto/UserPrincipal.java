package com.asseterp.oms.biz.auth.dto;

import com.asseterp.oms.biz.user.dto.LoginAccount;
import lombok.Builder;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.util.Collection;
import java.util.List;

@Getter
@Builder
public class UserPrincipal implements UserDetails {

    /** 세션용 사용자 ID (사원: emp01_person_id, 회사관리자: -sys02_user_id) - LoginAccount.sessionUserId() */
    private final Long userId;
    /** 전 회사에서 유일한 이름 {회사코드}:{로그인ID} - 감사 로그, WebSocket 사용자 라우팅 */
    private final String username;
    /** 화면에 입력한 로그인 ID (사번 또는 sys02_login_id) */
    private final String loginId;
    private final String password;
    private final String name;
    private final Long companyId;
    /** 로그인한 회사 코드 (sys01_loc_nm). admin 테넌트에서 회사를 선택했다면 선택한 회사 */
    private final String companyCode;
    private final String companyName;
    /** 로그인한 호스트의 테넌트 코드 (서브도메인). 다른 서브도메인에서 이 토큰을 쓰지 못하게 검사한다 */
    private final String tenant;
    private final String deptId;
    private final List<String> roles;
    private final String jti;
    /** Access Token 만료 시각 (토큰에서 복원한 경우에만 값이 있음) */
    private final Instant accessTokenExpiresAt;

    public static UserPrincipal from(LoginAccount account, String tenant, List<String> roles, String jti, String deptId) {
        return UserPrincipal.builder()
                .userId(account.sessionUserId())
                .username(account.qualifiedUsername())
                .loginId(account.loginId())
                .name(account.name())
                .companyId(account.companyId())
                .companyCode(account.companyCode())
                .companyName(account.companyName())
                .tenant(tenant)
                .deptId(deptId)
                .roles(roles)
                .jti(jti)
                .build();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(SimpleGrantedAuthority::new)
                .toList();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
