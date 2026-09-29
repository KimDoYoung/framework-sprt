package com.asseterp.security.biz.user.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppUser {
    private Long userId;
    private Integer companyId;
    private String username;
    private String password;
    private String fullName;
    private String role;
    /** 잠금여부 (Y/N) - 로그인 실패 횟수 초과 시 Y, 관리자 해제 시 N */
    private String lockYn;
    private OffsetDateTime createdAt;

    public static final String LOCKED = "Y";
    public static final String UNLOCKED = "N";

    public boolean isLocked() {
        return LOCKED.equals(lockYn);
    }
}
