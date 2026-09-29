package com.asseterp.security.biz.user.service;

import com.asseterp.security.biz.audit.dto.AuditEventType;
import com.asseterp.security.biz.audit.dto.AuditResult;
import com.asseterp.security.biz.audit.service.AuditLogService;
import com.asseterp.security.biz.auth.service.LoginLockService;
import com.asseterp.security.biz.user.entity.AppUser;
import com.asseterp.security.biz.user.dto.UserItemRes;
import com.asseterp.security.biz.user.mapper.AppUserMapper;
import com.asseterp.security.common.error.BusinessException;
import com.asseterp.security.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final AppUserMapper appUserMapper;
    private final LoginLockService loginLockService;
    private final AuditLogService auditLogService;

    public List<UserItemRes> searchUsers() {
        return appUserMapper.findAll().stream()
                .map(u -> new UserItemRes(
                        u.getUserId(),
                        u.getUsername(),
                        u.getFullName(),
                        u.getRole(),
                        u.getLockYn(),
                        loginLockService.getFailureCount(u.getUserId())))
                .toList();
    }

    /**
     * @param operator 잠금을 해제하는 관리자 로그인 아이디 (감사 로그 행위자)
     */
    @Transactional
    public void updateUserUnlock(Long userId, String operator) {
        AppUser target = appUserMapper.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        loginLockService.unlock(userId);
        auditLogService.record(AuditEventType.ACCOUNT_UNLOCKED, AuditResult.SUCCESS, operator, target.getUsername(), null);
    }
}
