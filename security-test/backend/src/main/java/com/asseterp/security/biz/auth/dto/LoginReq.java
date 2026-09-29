package com.asseterp.security.biz.auth.dto;

public record LoginReq(
        String username,
        String password
) {
}
