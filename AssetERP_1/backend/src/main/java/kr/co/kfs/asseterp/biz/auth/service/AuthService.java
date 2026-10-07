package kr.co.kfs.asseterp.biz.auth.service;

import kr.co.kfs.asseterp.biz.audit.dto.AuditEventType;
import kr.co.kfs.asseterp.biz.audit.dto.AuditResult;
import kr.co.kfs.asseterp.biz.audit.service.AuditLogService;
import kr.co.kfs.asseterp.biz.auth.dto.AuthResult;
import kr.co.kfs.asseterp.biz.auth.dto.LoginReq;
import kr.co.kfs.asseterp.biz.auth.dto.LoginRes;
import kr.co.kfs.asseterp.biz.auth.dto.SessionTerminateReason;
import kr.co.kfs.asseterp.biz.auth.dto.SessionTerminatedEvent;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.auth.mapper.LoginHistoryMapper;
import kr.co.kfs.asseterp.biz.company.dto.CompanyRes;
import kr.co.kfs.asseterp.biz.company.mapper.CompanyMapper;
import kr.co.kfs.asseterp.biz.user.dto.LoginAccount;
import kr.co.kfs.asseterp.biz.user.mapper.AccountMapper;
import kr.co.kfs.asseterp.common.config.properties.AuthProperties;
import kr.co.kfs.asseterp.common.config.properties.TenantProperties;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import kr.co.kfs.asseterp.common.jwt.JwtTokenProvider;
import kr.co.kfs.asseterp.common.jwt.JwtTokenProvider.TokenType;
import kr.co.kfs.asseterp.common.jwt.RedisTokenService;
import kr.co.kfs.asseterp.common.tenant.Tenant;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final AccountMapper accountMapper;
    private final CompanyMapper companyMapper;
    private final LoginHistoryService loginHistoryService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final RedisTokenService redisTokenService;
    private final AuthProperties authProperties;
    private final TenantProperties tenantProperties;
    private final LoginLockService loginLockService;
    private final AuditLogService auditLogService;
    /** 세션 종료 이벤트 → push 도메인이 WebSocket으로 즉시 알림 (SessionTerminatedEvent) */
    private final ApplicationEventPublisher eventPublisher;

    /**
     * 로그인. AS-IS Sys02_User.getLoginInfo 흐름을 따른다.
     * <ol>
     *   <li>회사: 호스트(서브도메인)로 판정. admin 테넌트만 요청의 companyCode(선택한 회사)를 사용</li>
     *   <li>계정: 사원(emp01_person)을 먼저 찾고 퇴사자는 거부, 없거나 겸직이면 회사관리자(sys02_user)</li>
     *   <li>사원만 잠금(emp01_lock_yn) 적용. 실패 횟수는 Redis(LoginLockService)</li>
     *   <li>결과는 AS-IS 로그인 이력(sys26_login)과 보안 감사 로그(sys71)에 함께 기록</li>
     * </ol>
     *
     * @param tenant    요청 호스트로 판별한 테넌트 (TenantFilter가 유효성 확인 완료)
     * @param clientIp  로그인 이력용 클라이언트 IP
     * @param userAgent 로그인 이력용 브라우저 정보
     */
    public AuthResult login(LoginReq req, Tenant tenant, String clientIp, String userAgent) {
        String companyCode = resolveCompanyCode(req, tenant);
        String attempted = companyCode + ":" + req.username();
        log.info("로그인 시도: tenant={}, company={}, loginId={}", tenant.code(), companyCode, req.username());

        Optional<LoginAccount> employee = accountMapper.findEmployee(companyCode, req.username());
        if (employee.filter(a -> LoginAccount.TRANS_RETIRED.equals(a.transCode())).isPresent()) {
            auditLogService.record(AuditEventType.LOGIN_FAIL, AuditResult.FAIL, attempted, null, "퇴사자");
            throw new BusinessException(ErrorCode.RETIRED_EMPLOYEE);
        }
        // 발령 정보가 없거나 겸직(800)용 사원 레코드는 로그인 대상이 아님 (AS-IS emp00_trans_info.selectByLoginId)
        LoginAccount account = employee
                .filter(a -> a.transCode() != null && !LoginAccount.TRANS_ADD_TITLE.equals(a.transCode()))
                .or(() -> accountMapper.findManager(companyCode, req.username()))
                .orElseThrow(() -> {
                    log.warn("로그인 실패 (없는 아이디): {}", attempted);
                    auditLogService.record(AuditEventType.LOGIN_FAIL, AuditResult.FAIL, attempted, null, "없는 아이디");
                    return new BusinessException(ErrorCode.LOGIN_FAILED);
                });

        // 잠긴 계정은 비밀번호를 검사하지 않음 (잠긴 뒤의 무차별 대입 차단)
        if (account.isLocked()) {
            log.warn("잠긴 계정 로그인 시도: {}", attempted);
            loginHistoryService.record(account, LoginHistoryMapper.STATUS_LOCKED, clientIp, userAgent);
            auditLogService.record(AuditEventType.LOGIN_LOCKED_ATTEMPT, AuditResult.FAIL, attempted, null, null);
            throw new BusinessException(ErrorCode.ACCOUNT_LOCKED);
        }

        // 비밀번호 미설정/초기화 (AS-IS 99): 비교할 비밀번호가 없다
        if (account.password() == null) {
            loginHistoryService.record(account, LoginHistoryMapper.STATUS_PASSWORD_NOT_SET, clientIp, userAgent);
            auditLogService.record(AuditEventType.LOGIN_FAIL, AuditResult.FAIL, attempted, null, "비밀번호 미설정");
            throw new BusinessException(ErrorCode.PASSWORD_CHANGE_REQUIRED,
                    "비밀번호가 설정되지 않았거나 초기화되었습니다. 비밀번호를 등록한 뒤 로그인해주세요.");
        }

        // 요구사항 6: 평문 패스워드 비교 (DB에서 TO_DECRYPTS로 복호화한 값)
        if (!passwordEncoder.matches(req.password(), account.password())) {
            loginHistoryService.record(account, LoginHistoryMapper.STATUS_WRONG_PASSWORD, clientIp, userAgent);
            handlePasswordMismatch(account, attempted);
        }

        // 비밀번호 만료 (AS-IS 98). AS-IS는 비밀번호 확인 전에 알려주지만, 계정 상태 노출을 막기 위해 확인 후에 알린다
        if (account.isEmployee() && account.passwordAgeDays() != null
                && account.passwordAgeDays() >= authProperties.passwordExpireDays()) {
            loginHistoryService.record(account, LoginHistoryMapper.STATUS_PASSWORD_EXPIRED, clientIp, userAgent);
            auditLogService.record(AuditEventType.LOGIN_FAIL, AuditResult.FAIL, attempted, null, "비밀번호 만료");
            throw new BusinessException(ErrorCode.PASSWORD_CHANGE_REQUIRED,
                    "비밀번호가 만료되었습니다 (" + account.passwordAgeDays() + "일 경과). 비밀번호를 변경한 뒤 로그인해주세요.");
        }
        loginLockService.resetFailures(account.sessionUserId());

        // 고유 jti 생성 (요구사항 7, 8) - 새 jti로 Redis를 덮어써 기존 세션을 차단
        String jti = UUID.randomUUID().toString();
        String refreshId = UUID.randomUUID().toString();
        AuthResult result = issueTokens(account, tenant.code(), jti, refreshId);
        redisTokenService.startSession(account.sessionUserId(), jti, refreshId, sessionTtl());
        // 이전 세션(다른 jti)의 WebSocket에 즉시 알림 - 다음 요청을 기다리지 않고 차단
        publishSessionTerminated(account.sessionUserId(), jti, SessionTerminateReason.MULTI_LOGIN);

        loginHistoryService.record(account, account.isEmployee() ? LoginHistoryMapper.STATUS_EMPLOYEE_OK
                : LoginHistoryMapper.STATUS_MANAGER_OK, clientIp, userAgent);
        log.info("로그인 성공: userId={}, username={}, jti={}", account.sessionUserId(), attempted, jti);
        auditLogService.record(AuditEventType.LOGIN_SUCCESS, AuditResult.SUCCESS, attempted, null,
                "tenant=" + tenant.code() + ", jti=" + jti);
        return result;
    }

    /**
     * 로그인할 회사 코드. 일반 회사 서브도메인은 요청 값을 무시하고 호스트로 정한다 (AS-IS는 클라이언트가 보낸 값을 그대로 신뢰).
     */
    private String resolveCompanyCode(LoginReq req, Tenant tenant) {
        if (!tenant.admin() || !StringUtils.hasText(req.companyCode())) {
            return tenant.code();
        }
        return companyMapper.findByCompanyCode(req.companyCode())
                .filter(CompanyRes::isUsable)
                .map(CompanyRes::companyCode)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMPANY_NOT_FOUND));
    }

    /**
     * 비밀번호 불일치. 사원만 실패 횟수를 세어 잠그고, 회사관리자는 AS-IS처럼 잠금 없이 실패로만 응답한다.
     */
    private void handlePasswordMismatch(LoginAccount account, String attempted) {
        if (!account.isEmployee()) {
            auditLogService.record(AuditEventType.LOGIN_FAIL, AuditResult.FAIL, attempted, null, "비밀번호 불일치 (관리자)");
            throw new BusinessException(ErrorCode.LOGIN_FAILED);
        }
        LoginLockService.FailureResult failure = loginLockService.recordFailure(account.sessionUserId());
        if (failure.locked()) {
            auditLogService.record(AuditEventType.ACCOUNT_LOCKED, AuditResult.FAIL, attempted, null,
                    "로그인 " + failure.failureCount() + "회 연속 실패");
            // 다른 곳에 살아 있는 세션도 즉시 종료 (HTTP 요청은 다음 갱신 때 거부됨)
            publishSessionTerminated(account.sessionUserId(), null, SessionTerminateReason.ACCOUNT_LOCKED);
            throw new BusinessException(ErrorCode.ACCOUNT_LOCKED,
                    "로그인 " + failure.maxFailures() + "회 실패로 계정이 잠겼습니다. 관리자에게 잠금 해제를 요청하세요.");
        }
        auditLogService.record(AuditEventType.LOGIN_FAIL, AuditResult.FAIL, attempted, null,
                "비밀번호 불일치 (" + failure.failureCount() + "/" + failure.maxFailures() + ")");
        throw new BusinessException(ErrorCode.LOGIN_FAILED,
                ErrorCode.LOGIN_FAILED.getMessage() + " (실패 " + failure.failureCount() + "/" + failure.maxFailures()
                        + "회, " + failure.remaining() + "회 더 실패하면 계정이 잠깁니다.)");
    }

    /**
     * Refresh Token을 통한 토큰 재발급 (Silent Refresh + Sliding Session + Rotation).
     * Access Token과 함께 새 rid의 Refresh Token을 재발급하여, 활동이 이어지는 한 세션이 연장된다.
     * 이미 교체된 Refresh Token이 다시 오면 탈취로 판단하여 세션 전체를 폐기한다.
     */
    public AuthResult refresh(String refreshToken, Tenant tenant) {
        if (!StringUtils.hasText(refreshToken)) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }

        Claims claims;
        try {
            claims = tokenProvider.parseClaims(refreshToken, TokenType.REFRESH);
        } catch (ExpiredJwtException e) {
            // 서명이 검증된 만료 토큰이므로 Claims의 사용자로 만료를 기록한다 (쿠키 여유시간 jwt.cookie.max-age-margin 동안 도착)
            if (tokenProvider.isTokenType(e.getClaims(), TokenType.REFRESH)) {
                auditRefreshRejected(Long.parseLong(e.getClaims().getSubject()), ErrorCode.REFRESH_EXPIRED);
            }
            throw new BusinessException(ErrorCode.REFRESH_EXPIRED);
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("유효하지 않은 Refresh Token: {}", e.getMessage());
            throw new BusinessException(ErrorCode.INVALID_TOKEN);
        }

        Long userId = Long.parseLong(claims.getSubject());
        String jti = claims.getId();
        String refreshId = claims.get(JwtTokenProvider.CLAIM_REFRESH_ID, String.class);
        if (!StringUtils.hasText(refreshId)) {
            throw new BusinessException(ErrorCode.INVALID_TOKEN);
        }
        // 다른 서브도메인에서 발급된 토큰 (쿠키는 호스트별로 분리되므로 헤더 등으로 옮겨 온 경우)
        String tokenTenant = claims.get(JwtTokenProvider.CLAIM_TENANT, String.class);
        if (!tenant.code().equals(tokenTenant)) {
            log.warn("테넌트 불일치 Refresh 거부: userId={}, token={}, request={}", userId, tokenTenant, tenant.code());
            throw new BusinessException(ErrorCode.TENANT_MISMATCH);
        }

        // 멀티 로그인(jti) + 재사용(rid) 검사 후 새 rid로 교체 - Redis에서 원자적으로 처리
        RedisTokenService.RotationResult rotation = redisTokenService.rotateRefreshToken(
                userId, jti, refreshId, UUID.randomUUID().toString(), sessionTtl());
        switch (rotation.status()) {
            case MISMATCH -> {
                auditLogService.record(AuditEventType.MULTI_LOGIN_BLOCKED, AuditResult.FAIL, usernameOf(userId), null,
                        "Refresh 차단, jti=" + jti);
                throw new BusinessException(ErrorCode.MULTI_LOGIN_DETECTED);
            }
            case NOT_FOUND -> {
                auditRefreshRejected(userId, ErrorCode.SESSION_NOT_FOUND);
                throw new BusinessException(ErrorCode.SESSION_NOT_FOUND);
            }
            case REUSED -> {
                auditLogService.record(AuditEventType.TOKEN_REUSED, AuditResult.FAIL, usernameOf(userId), null,
                        "세션 폐기, jti=" + jti + ", rid=" + refreshId);
                publishSessionTerminated(userId, null, SessionTerminateReason.TOKEN_REUSED);
                throw new BusinessException(ErrorCode.REFRESH_TOKEN_REUSED);
            }
            case ROTATED, GRACE -> { }
        }

        LoginAccount account = findAccount(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SESSION_NOT_FOUND));
        // 세션 도중 계정이 잠긴 경우 갱신 거부
        if (account.isLocked()) {
            redisTokenService.removeSession(userId);
            publishSessionTerminated(userId, null, SessionTerminateReason.ACCOUNT_LOCKED);
            throw new BusinessException(ErrorCode.ACCOUNT_LOCKED);
        }

        AuthResult result = issueTokens(account, tokenTenant, jti, rotation.refreshId());

        log.info("토큰 갱신(Refresh) 성공: userId={}, username={}, jti={}", userId, account.qualifiedUsername(), jti);
        return result;
    }

    /**
     * 현재 세션 정보와 남은 수명 조회
     */
    public LoginRes getMe(UserPrincipal principal) {
        long accessRemain = Math.max(0,
                Duration.between(Instant.now(), principal.getAccessTokenExpiresAt()).toMillis());
        long refreshRemain = redisTokenService.getRemainingTtlMillis(principal.getUserId());
        return toLoginRes(principal, accessRemain, refreshRemain);
    }

    /**
     * 로그아웃: Refresh Token의 jti가 현재 활성 세션일 때만 Redis에서 제거한다.
     * (이미 다른 곳에서 새로 로그인된 경우, 이전 세션의 로그아웃이 새 세션을 끊지 않도록)
     */
    public void logout(String refreshToken) {
        if (!StringUtils.hasText(refreshToken)) {
            return;
        }
        try {
            Claims claims = tokenProvider.parseClaims(refreshToken, TokenType.REFRESH);
            Long userId = Long.parseLong(claims.getSubject());
            if (redisTokenService.checkJti(userId, claims.getId()) == RedisTokenService.JtiStatus.MATCH) {
                redisTokenService.removeSession(userId);
                log.info("로그아웃 완료: userId={}", userId);
                auditLogService.record(AuditEventType.LOGOUT, AuditResult.SUCCESS, usernameOf(userId), null, null);
                // 같은 세션을 쓰는 다른 탭도 로그인 화면으로
                publishSessionTerminated(userId, null, SessionTerminateReason.LOGOUT);
            }
        } catch (JwtException | IllegalArgumentException e) {
            // 만료/위조 토큰: 제거할 활성 세션이 없으므로 쿠키 삭제만 진행
            log.debug("로그아웃 시 Refresh Token 무시: {}", e.getMessage());
        }
    }

    /**
     * 관리자 강제 로그아웃 (AS-IS Sys86_Tab_Websocket): 세션을 지우고 그 사용자의 모든 화면에 종료를 알린다.
     * 이후 요청은 세션이 없어 401이 된다.
     */
    public void forceLogout(Long userId, String byUsername) {
        redisTokenService.removeSession(userId);
        log.info("강제 로그아웃: userId={}, by={}", userId, byUsername);
        auditLogService.record(AuditEventType.LOGOUT, AuditResult.SUCCESS, usernameOf(userId), "FORCED", "관리자 " + byUsername);
        publishSessionTerminated(userId, null, SessionTerminateReason.FORCED_LOGOUT);
    }

    /**
     * 만료되었거나 이미 끝난 세션으로 갱신을 시도한 경우 (세션 만료 후 사용자가 다시 요청한 시점)
     */
    private void auditRefreshRejected(Long userId, ErrorCode reason) {
        auditLogService.record(AuditEventType.REFRESH_REJECTED, AuditResult.FAIL, usernameOf(userId), null,
                reason.name() + ": " + reason.getMessage());
    }

    /**
     * 감사 로그용 사용자 이름 {회사코드}:{로그인ID} (Refresh Token에는 숫자 userId만 있음)
     */
    private String usernameOf(Long userId) {
        return findAccount(userId)
                .map(LoginAccount::qualifiedUsername)
                .orElse(String.valueOf(userId));
    }

    /**
     * 세션 userId(LoginAccount.sessionUserId)로 계정 조회: 양수는 사원, 음수는 회사관리자
     */
    private Optional<LoginAccount> findAccount(Long sessionUserId) {
        Long accountId = LoginAccount.toAccountId(sessionUserId);
        return LoginAccount.isEmployeeSessionId(sessionUserId)
                ? accountMapper.findEmployeeById(accountId)
                : accountMapper.findManagerById(accountId);
    }

    private void publishSessionTerminated(Long userId, String keepJti, SessionTerminateReason reason) {
        eventPublisher.publishEvent(new SessionTerminatedEvent(userId, keepJti, reason));
    }

    private Duration sessionTtl() {
        return Duration.ofMillis(tokenProvider.getRefreshTokenExpiration());
    }

    /**
     * 토큰 발급. Redis 세션 등록/연장은 호출한 쪽(login: startSession, refresh: rotateRefreshToken)에서 처리한다.
     */
    private AuthResult issueTokens(LoginAccount account, String tenant, String jti, String refreshId) {
        // 부서(발령 조직)는 아직 조회하지 않아 설정값(asseterp.auth.default-dept-id)을 사용
        UserPrincipal principal = UserPrincipal.from(account, tenant, account.roles(tenantProperties.adminCode()),
                jti, authProperties.defaultDeptId());
        String accessToken = tokenProvider.generateAccessToken(principal, jti);
        String refreshToken = tokenProvider.generateRefreshToken(account.sessionUserId(), tenant, jti, refreshId);

        LoginRes loginRes = toLoginRes(principal, tokenProvider.getAccessTokenExpiration(),
                tokenProvider.getRefreshTokenExpiration());
        return new AuthResult(loginRes, accessToken, refreshToken);
    }

    private LoginRes toLoginRes(UserPrincipal principal, long accessTokenExpiresIn, long refreshTokenExpiresIn) {
        return new LoginRes(
                principal.getUserId(),
                principal.getUsername(),
                principal.getLoginId(),
                principal.getName(),
                principal.getCompanyId(),
                principal.getCompanyCode(),
                principal.getCompanyName(),
                principal.getTenant(),
                principal.getDeptId(),
                principal.getRoles(),
                principal.getJti(),
                accessTokenExpiresIn,
                refreshTokenExpiresIn,
                tokenProvider.getAccessTokenExpiration(),
                tokenProvider.getRefreshTokenExpiration()
        );
    }
}
