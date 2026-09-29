package com.asseterp.security.biz.auth.dto;

import java.util.List;

public record LoginReq(
        String username,
        String password
) {
}
