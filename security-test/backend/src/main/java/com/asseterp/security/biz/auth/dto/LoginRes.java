package com.asseterp.security.biz.auth.dto;

import java.util.List;

public record LoginRes(
        Long userId,
        String username,
        String name,
        Integer companyId,
        String deptId,
        List<String> roles,
        String jti,
        String accessToken,
        long accessTokenExpiresIn,
        String refreshToken,
        long refreshTokenExpiresIn
) {
}
