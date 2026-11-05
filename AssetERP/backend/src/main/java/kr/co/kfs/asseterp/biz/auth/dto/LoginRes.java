package kr.co.kfs.asseterp.biz.auth.dto;

import java.util.List;

/**
 * 로그인/갱신/내 정보 응답. 토큰 값은 HttpOnly 쿠키로만 전달하고 본문에는 포함하지 않는다.
 * 만료 정보는 클라이언트 시계 오차의 영향을 받지 않도록 "남은 시간(ms)"으로 내려주고,
 * 화면 게이지 계산을 위해 설정된 전체 수명(ms)도 함께 내려준다.
 */
public record LoginRes(
        Long userId,
        String username,
        String loginId,
        String name,
        Long companyId,
        String companyCode,
        String companyName,
        String tenant,
        String deptId,
        List<String> roles,
        String jti,
        long accessTokenExpiresIn,
        long refreshTokenExpiresIn,
        long accessTokenLifetime,
        long refreshTokenLifetime,
        /** 로그인 응답에만: 비밀번호 만료까지 남은 날 (AS-IS 경과 80~89일 "N일 남았습니다. 지금 변경하시겠습니까?"). 경고가 없으면 null */
        Integer passwordWarnDays
) {
    public LoginRes withPasswordWarnDays(Integer days) {
        return new LoginRes(userId, username, loginId, name, companyId, companyCode, companyName, tenant, deptId, roles, jti,
                accessTokenExpiresIn, refreshTokenExpiresIn, accessTokenLifetime, refreshTokenLifetime, days);
    }
}
