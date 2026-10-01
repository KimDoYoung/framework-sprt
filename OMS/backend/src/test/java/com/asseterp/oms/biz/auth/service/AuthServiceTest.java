package com.asseterp.oms.biz.auth.service;

import com.asseterp.oms.biz.audit.dto.AuditEventType;
import com.asseterp.oms.biz.audit.dto.AuditResult;
import com.asseterp.oms.biz.audit.service.AuditLogService;
import com.asseterp.oms.biz.auth.dto.LoginReq;
import com.asseterp.oms.biz.auth.dto.SessionTerminateReason;
import com.asseterp.oms.biz.auth.dto.SessionTerminatedEvent;
import com.asseterp.oms.biz.auth.mapper.LoginHistoryMapper;
import com.asseterp.oms.biz.company.dto.CompanyRes;
import com.asseterp.oms.biz.company.mapper.CompanyMapper;
import com.asseterp.oms.biz.user.dto.LoginAccount;
import com.asseterp.oms.biz.user.mapper.AccountMapper;
import com.asseterp.oms.common.config.properties.AuthProperties;
import com.asseterp.oms.common.config.properties.JwtProperties;
import com.asseterp.oms.common.config.properties.TenantProperties;
import com.asseterp.oms.common.error.BusinessException;
import com.asseterp.oms.common.error.ErrorCode;
import com.asseterp.oms.common.jwt.JwtTokenProvider;
import com.asseterp.oms.common.jwt.RedisTokenService;
import com.asseterp.oms.common.jwt.RedisTokenService.RotationResult;
import com.asseterp.oms.common.jwt.RedisTokenService.RotationStatus;
import com.asseterp.oms.common.tenant.Tenant;
import com.asseterp.oms.support.TestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    private static final Long PERSON_ID = 2L;
    private static final CompanyRes KFS = new CompanyRes(28000L, "kfstest", "한국펀드서비스(주)", "true");
    private static final CompanyRes ADMIN = new CompanyRes(0L, "admin", "ADMIN", "true");
    private static final Tenant KFS_TENANT = new Tenant("kfstest.localhost", "kfstest", KFS, false);
    private static final Tenant ADMIN_TENANT = new Tenant("admin.localhost", "admin", ADMIN, true);

    private final AccountMapper accountMapper = mock(AccountMapper.class);
    private final CompanyMapper companyMapper = mock(CompanyMapper.class);
    private final LoginHistoryService loginHistoryService = mock(LoginHistoryService.class);
    private final RedisTokenService redisTokenService = mock(RedisTokenService.class);
    private final LoginLockService loginLockService = mock(LoginLockService.class);
    private final AuditLogService auditLogService = mock(AuditLogService.class);
    private final ApplicationEventPublisher eventPublisher = mock(ApplicationEventPublisher.class);
    private final AuthProperties authProperties = TestProperties.bind("asseterp.auth", AuthProperties.class);
    private final TenantProperties tenantProperties = TestProperties.bind("asseterp.tenant", TenantProperties.class);
    private final JwtTokenProvider tokenProvider = new JwtTokenProvider(
            TestProperties.bind("jwt", JwtProperties.class), authProperties);

    private AuthService authService;

    @BeforeEach
    void setUp() {
        @SuppressWarnings("deprecation")
        NoOpPasswordEncoder encoder = (NoOpPasswordEncoder) NoOpPasswordEncoder.getInstance();
        authService = new AuthService(accountMapper, companyMapper, loginHistoryService, encoder, tokenProvider,
                redisTokenService, authProperties, tenantProperties, loginLockService, auditLogService, eventPublisher);
    }

    private static LoginAccount employee(String lockYn, String transCode, String password, int passwordAgeDays) {
        return new LoginAccount(LoginAccount.EMPLOYEE, PERSON_ID, 28000L, "kfstest", "한국펀드서비스(주)", "user1",
                "일반 사용자", password, passwordAgeDays, lockYn, transCode);
    }

    private static LoginAccount employee(String lockYn) {
        return employee(lockYn, "100", "1111", 10);
    }

    private static LoginAccount manager(String companyCode) {
        return new LoginAccount(LoginAccount.MANAGER, 7L, 28000L, companyCode, "회사", "admin", "관리자",
                "1111", 0, null, null);
    }

    private BusinessException loginFails(Tenant tenant, LoginReq req) {
        return catchBusiness(() -> authService.login(req, tenant, "127.0.0.1", "JUnit"));
    }

    private static BusinessException catchBusiness(Runnable action) {
        try {
            action.run();
        } catch (BusinessException e) {
            return e;
        }
        throw new AssertionError("BusinessException이 발생하지 않았습니다");
    }

    private void givenEmployee(LoginAccount account) {
        when(accountMapper.findEmployee("kfstest", "user1")).thenReturn(Optional.of(account));
    }

    @Test
    void 잠긴_사원은_비밀번호가_맞아도_거부되고_실패횟수도_늘지_않는다() {
        givenEmployee(employee(LoginAccount.LOCKED));

        BusinessException e = loginFails(KFS_TENANT, new LoginReq("user1", "1111", null));

        assertThat(e.getErrorCode()).isEqualTo(ErrorCode.ACCOUNT_LOCKED);
        verify(loginLockService, never()).recordFailure(any());
        verify(redisTokenService, never()).startSession(any(), any(), any(), any());
        verify(loginHistoryService).record(any(), eq(LoginHistoryMapper.STATUS_LOCKED), any(), any());
        verify(auditLogService).record(eq(AuditEventType.LOGIN_LOCKED_ATTEMPT), eq(AuditResult.FAIL), eq("kfstest:user1"), any(), any());
    }

    @Test
    void 퇴사자는_퇴사_안내로_거부한다() {
        givenEmployee(employee(null, LoginAccount.TRANS_RETIRED, "1111", 10));

        assertThat(loginFails(KFS_TENANT, new LoginReq("user1", "1111", null)).getErrorCode())
                .isEqualTo(ErrorCode.RETIRED_EMPLOYEE);
    }

    @Test
    void 최대_횟수_전_실패는_남은_횟수를_안내한다() {
        givenEmployee(employee(null));
        when(loginLockService.recordFailure(PERSON_ID)).thenReturn(new LoginLockService.FailureResult(1, 5, false));

        BusinessException e = loginFails(KFS_TENANT, new LoginReq("user1", "wrong", null));

        assertThat(e.getErrorCode()).isEqualTo(ErrorCode.LOGIN_FAILED);
        assertThat(e.getMessage()).contains("1/5회");
        verify(loginHistoryService).record(any(), eq(LoginHistoryMapper.STATUS_WRONG_PASSWORD), any(), any());
    }

    @Test
    void 최대_횟수에_도달하면_계정_잠금으로_응답한다() {
        givenEmployee(employee("false"));
        when(loginLockService.recordFailure(PERSON_ID)).thenReturn(new LoginLockService.FailureResult(5, 5, true));

        assertThat(loginFails(KFS_TENANT, new LoginReq("user1", "wrong", null)).getErrorCode())
                .isEqualTo(ErrorCode.ACCOUNT_LOCKED);
        verify(auditLogService).record(eq(AuditEventType.ACCOUNT_LOCKED), eq(AuditResult.FAIL), eq("kfstest:user1"), any(), any());
        verify(eventPublisher).publishEvent(new SessionTerminatedEvent(PERSON_ID, null, SessionTerminateReason.ACCOUNT_LOCKED));
    }

    @Test
    void 회사관리자는_비밀번호가_틀려도_잠그지_않는다() {
        when(accountMapper.findManager("kfstest", "admin")).thenReturn(Optional.of(manager("kfstest")));

        assertThat(loginFails(KFS_TENANT, new LoginReq("admin", "wrong", null)).getErrorCode())
                .isEqualTo(ErrorCode.LOGIN_FAILED);
        verify(loginLockService, never()).recordFailure(any());
    }

    @Test
    void 비밀번호가_없거나_만료된_사원은_변경_안내로_거부한다() {
        givenEmployee(employee(null, "100", null, 0));
        assertThat(loginFails(KFS_TENANT, new LoginReq("user1", "1111", null)).getErrorCode())
                .isEqualTo(ErrorCode.PASSWORD_CHANGE_REQUIRED);

        givenEmployee(employee(null, "100", "1111", 90));
        assertThat(loginFails(KFS_TENANT, new LoginReq("user1", "1111", null)).getErrorCode())
                .isEqualTo(ErrorCode.PASSWORD_CHANGE_REQUIRED);
        verify(loginHistoryService).record(any(), eq(LoginHistoryMapper.STATUS_PASSWORD_EXPIRED), any(), any());
    }

    @Test
    void 로그인_성공_시_실패횟수를_초기화하고_세션을_등록한다() {
        givenEmployee(employee(null));

        var res = authService.login(new LoginReq("user1", "1111", null), KFS_TENANT, "127.0.0.1", "JUnit").loginRes();

        assertThat(res.username()).isEqualTo("kfstest:user1");
        assertThat(res.tenant()).isEqualTo("kfstest");
        assertThat(res.roles()).containsExactly("ROLE_USER");
        verify(loginLockService).resetFailures(PERSON_ID);
        verify(redisTokenService).startSession(eq(PERSON_ID), anyString(), anyString(), any());
        verify(loginHistoryService).record(any(), eq(LoginHistoryMapper.STATUS_EMPLOYEE_OK), any(), any());
        verify(auditLogService).record(eq(AuditEventType.LOGIN_SUCCESS), eq(AuditResult.SUCCESS), eq("kfstest:user1"), any(), any());
    }

    @Test
    void 일반_회사_서브도메인에서는_요청의_회사코드를_무시한다() {
        givenEmployee(employee(null));

        authService.login(new LoginReq("user1", "1111", "tdmtest"), KFS_TENANT, "127.0.0.1", "JUnit");

        verify(accountMapper).findEmployee("kfstest", "user1");
        verify(companyMapper, never()).findByCompanyCode(any());
    }

    @Test
    void admin_테넌트는_선택한_회사로_로그인하고_토큰은_admin_호스트에_묶인다() {
        when(companyMapper.findByCompanyCode("kfstest")).thenReturn(Optional.of(KFS));
        givenEmployee(employee(null));

        var res = authService.login(new LoginReq("user1", "1111", "kfstest"), ADMIN_TENANT, "127.0.0.1", "JUnit").loginRes();

        assertThat(res.companyCode()).isEqualTo("kfstest");
        assertThat(res.tenant()).isEqualTo("admin");
    }

    @Test
    void admin_테넌트_관리자는_SYSADMIN_권한을_받고_세션ID는_음수다() {
        when(accountMapper.findManager("admin", "admin")).thenReturn(Optional.of(manager("admin")));

        var res = authService.login(new LoginReq("admin", "1111", null), ADMIN_TENANT, "127.0.0.1", "JUnit").loginRes();

        assertThat(res.userId()).isEqualTo(-7L);
        assertThat(res.roles()).containsExactly("ROLE_ADMIN", "ROLE_SYSADMIN");
    }

    @Test
    void 로그인_성공_시_새_jti를_제외한_이전_세션_종료_이벤트를_발행한다() {
        givenEmployee(employee(null));

        String jti = authService.login(new LoginReq("user1", "1111", null), KFS_TENANT, "127.0.0.1", "JUnit")
                .loginRes().jti();

        ArgumentCaptor<SessionTerminatedEvent> captor = ArgumentCaptor.forClass(SessionTerminatedEvent.class);
        verify(eventPublisher).publishEvent(captor.capture());
        assertThat(captor.getValue()).isEqualTo(new SessionTerminatedEvent(PERSON_ID, jti, SessionTerminateReason.MULTI_LOGIN));
    }

    @Test
    void 다른_서브도메인에서_발급된_Refresh_Token은_거부한다() {
        String refreshToken = tokenProvider.generateRefreshToken(PERSON_ID, "tdmtest", "jti-1", "rid-1");

        assertThat(catchBusiness(() -> authService.refresh(refreshToken, KFS_TENANT)).getErrorCode())
                .isEqualTo(ErrorCode.TENANT_MISMATCH);
        verify(redisTokenService, never()).rotateRefreshToken(any(), any(), any(), any(), any());
    }

    @Test
    void 이미_교체된_Refresh_Token이_오면_재사용으로_거부한다() {
        String refreshToken = tokenProvider.generateRefreshToken(PERSON_ID, "kfstest", "jti-1", "old-rid");
        when(redisTokenService.rotateRefreshToken(eq(PERSON_ID), eq("jti-1"), eq("old-rid"), anyString(), any()))
                .thenReturn(new RotationResult(RotationStatus.REUSED, null));

        assertThat(catchBusiness(() -> authService.refresh(refreshToken, KFS_TENANT)).getErrorCode())
                .isEqualTo(ErrorCode.REFRESH_TOKEN_REUSED);
        verify(auditLogService).record(eq(AuditEventType.TOKEN_REUSED), eq(AuditResult.FAIL), any(), any(), any());
        verify(eventPublisher).publishEvent(new SessionTerminatedEvent(PERSON_ID, null, SessionTerminateReason.TOKEN_REUSED));
    }

    @Test
    void 만료된_Refresh_Token으로_갱신하면_해당_사용자로_거부를_기록한다() {
        JwtProperties props = TestProperties.bind("jwt", JwtProperties.class);
        JwtTokenProvider expiredProvider = new JwtTokenProvider(new JwtProperties(props.secret(), props.issuer(),
                props.accessTokenExpiration(), -1000, props.cookie()), authProperties);
        String expiredRefreshToken = expiredProvider.generateRefreshToken(PERSON_ID, "kfstest", "jti-1", "rid-1");
        when(accountMapper.findEmployeeById(PERSON_ID)).thenReturn(Optional.of(employee(null)));

        assertThatThrownBy(() -> authService.refresh(expiredRefreshToken, KFS_TENANT))
                .isInstanceOfSatisfying(BusinessException.class,
                        e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.REFRESH_EXPIRED));
        verify(auditLogService).record(eq(AuditEventType.REFRESH_REJECTED), eq(AuditResult.FAIL), eq("kfstest:user1"), any(),
                startsWith("REFRESH_EXPIRED"));
    }

    @Test
    void 세션이_없으면_갱신_거부를_기록한다() {
        String refreshToken = tokenProvider.generateRefreshToken(PERSON_ID, "kfstest", "jti-1", "rid-1");
        when(redisTokenService.rotateRefreshToken(eq(PERSON_ID), eq("jti-1"), eq("rid-1"), anyString(), any()))
                .thenReturn(new RotationResult(RotationStatus.NOT_FOUND, null));
        when(accountMapper.findEmployeeById(PERSON_ID)).thenReturn(Optional.of(employee(null)));

        assertThat(catchBusiness(() -> authService.refresh(refreshToken, KFS_TENANT)).getErrorCode())
                .isEqualTo(ErrorCode.SESSION_NOT_FOUND);
        verify(auditLogService).record(eq(AuditEventType.REFRESH_REJECTED), eq(AuditResult.FAIL), eq("kfstest:user1"), any(),
                startsWith("SESSION_NOT_FOUND"));
    }

    @Test
    void 정상_갱신_시_교체된_rid로_새_Refresh_Token을_발급한다() {
        String refreshToken = tokenProvider.generateRefreshToken(PERSON_ID, "kfstest", "jti-1", "rid-1");
        when(redisTokenService.rotateRefreshToken(eq(PERSON_ID), eq("jti-1"), eq("rid-1"), anyString(), any()))
                .thenReturn(new RotationResult(RotationStatus.ROTATED, "rid-2"));
        when(accountMapper.findEmployeeById(PERSON_ID)).thenReturn(Optional.of(employee(null)));

        String newRefreshToken = authService.refresh(refreshToken, KFS_TENANT).refreshToken();

        var claims = tokenProvider.parseClaims(newRefreshToken, JwtTokenProvider.TokenType.REFRESH);
        assertThat(claims.get(JwtTokenProvider.CLAIM_REFRESH_ID, String.class)).isEqualTo("rid-2");
        assertThat(claims.get(JwtTokenProvider.CLAIM_TENANT, String.class)).isEqualTo("kfstest");
    }
}
