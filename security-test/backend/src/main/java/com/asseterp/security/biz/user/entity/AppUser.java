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
    private OffsetDateTime createdAt;
}
