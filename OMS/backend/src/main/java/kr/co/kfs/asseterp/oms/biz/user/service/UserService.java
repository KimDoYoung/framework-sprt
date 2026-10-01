package kr.co.kfs.asseterp.oms.biz.user.service;

import kr.co.kfs.asseterp.oms.biz.audit.dto.AuditEventType;
import kr.co.kfs.asseterp.oms.biz.audit.dto.AuditResult;
import kr.co.kfs.asseterp.oms.biz.audit.service.AuditLogService;
import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.auth.service.LoginLockService;
import kr.co.kfs.asseterp.oms.biz.user.dto.LoginAccount;
import kr.co.kfs.asseterp.oms.biz.user.dto.UserItemRes;
import kr.co.kfs.asseterp.oms.biz.user.mapper.AccountMapper;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import kr.co.kfs.asseterp.oms.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 사용자 관리: 관리자가 속한 회사의 사원(emp01_person)만 다룬다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final AccountMapper accountMapper;
    private final LoginLockService loginLockService;
    private final AuditLogService auditLogService;

    public List<UserItemRes> searchUsers(UserPrincipal operator) {
        return accountMapper.findEmployeesByCompany(operator.getCompanyId()).stream()
                .map(a -> new UserItemRes(
                        a.sessionUserId(),
                        a.loginId(),
                        a.name(),
                        String.join(",", a.roles("")),
                        a.lockYn(),
                        loginLockService.getFailureCount(a.sessionUserId())))
                .toList();
    }

    /**
     * @param userId   잠금 해제할 사원의 세션용 사용자 ID (= emp01_person_id)
     * @param operator 잠금을 해제하는 관리자 (감사 로그 행위자)
     */
    @Transactional
    public void updateUserUnlock(Long userId, UserPrincipal operator) {
        // 잠금은 사원에게만 있다 (회사관리자 음수 ID는 대상 아님). 다른 회사 사원은 해제할 수 없다
        Optional<LoginAccount> employee = LoginAccount.isEmployeeSessionId(userId)
                ? accountMapper.findEmployeeById(userId)
                : Optional.empty();
        LoginAccount target = employee
                .filter(a -> a.companyId().equals(operator.getCompanyId()))
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        loginLockService.unlock(userId);
        auditLogService.record(AuditEventType.ACCOUNT_UNLOCKED, AuditResult.SUCCESS, operator.getUsername(),
                target.qualifiedUsername(), null);
    }
}
