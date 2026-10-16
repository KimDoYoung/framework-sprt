package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.auth.service.AuthService;
import kr.co.kfs.asseterp.biz.push.dto.NoticeReq;
import kr.co.kfs.asseterp.biz.push.dto.NotificationReq;
import kr.co.kfs.asseterp.biz.push.dto.PresenceItemRes;
import kr.co.kfs.asseterp.biz.push.service.PresenceService;
import kr.co.kfs.asseterp.biz.push.service.PushService;
import kr.co.kfs.asseterp.biz.sys.dto.WebsocketPersonRes;
import kr.co.kfs.asseterp.biz.sys.dto.WebsocketResultRes;
import kr.co.kfs.asseterp.biz.sys.service.SysWebsocketService;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * A24 로그아웃 알림 관리: 접속 중인 사용자(PresenceService)·알림(PushService)·강제 로그아웃(AuthService)은 가짜로 두고 실제 사용자에게는 아무것도 보내지 않는다.
 * 조회·대상 매핑 SQL만 asseterpdb에서 돌린다.
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(SysWebsocketService.class)
class WebsocketAdminDbTest {

    private static final long PERSON_ON = 29025L;   // kfstest 001 박동진
    private static final long PERSON_OFF = 29027L;  // kfstest 003 윤정수

    @Autowired SysWebsocketService service;
    @MockitoBean PresenceService presenceService;
    @MockitoBean PushService pushService;
    @MockitoBean AuthService authService;

    private final UserPrincipal sysAdmin = UserPrincipal.builder().userId(-1L).username("admin:admin").companyId(0L).roles(List.of("ROLE_ADMIN", "ROLE_SYSADMIN")).build();
    private final UserPrincipal customer = UserPrincipal.builder().userId(-2L).username("kfstest:admin").companyId(28000L).roles(List.of("ROLE_ADMIN")).build();

    private static PresenceItemRes presence(long userId) {
        return new PresenceItemRes("s" + userId, userId, "u" + userId, "이름" + userId, "i1", "127.0.0.1", Instant.now());
    }

    private void online(Long... ids) {
        when(presenceService.searchPresence()).thenReturn(java.util.Arrays.stream(ids).map(WebsocketAdminDbTest::presence).toList());
    }

    @Test
    void 접속_중인_사원만_보이고_회사관리자는_빠지며_고객사와_검색어로_거른다() {
        online(PERSON_ON, -5L);
        PageRes<WebsocketPersonRes> all = service.search(sysAdmin, null, "", 0, 100);
        assertThat(all.total()).isEqualTo(1);
        assertThat(all.rows()).singleElement().satisfies(r -> {
            assertThat(r.personId()).isEqualTo(PERSON_ON);
            assertThat(r.empNo()).isEqualTo("001");
            assertThat(r.korName()).isEqualTo("박동진");
            assertThat(r.companyName()).isNotBlank();
        });
        assertThat(service.search(sysAdmin, 28000L, "박동", 0, 100).total()).isEqualTo(1);
        assertThat(service.search(sysAdmin, 28000L, "없는이름zzz", 0, 100).total()).isZero();
        assertThat(service.search(sysAdmin, 99999L, "", 0, 100).total()).isZero();
    }

    @Test
    void 접속자가_없으면_빈_목록() {
        online();
        PageRes<WebsocketPersonRes> res = service.search(sysAdmin, null, "", 0, 100);
        assertThat(res.total()).isZero();
        assertThat(res.rows()).isEmpty();
    }

    @Test
    void 개별_알림은_접속_중인_사원에게만_보내고_오프라인_이름을_돌려준다() {
        online(PERSON_ON);
        WebsocketResultRes res = service.sendAlarm(sysAdmin, List.of(PERSON_ON, PERSON_OFF), "점검 안내");
        assertThat(res.processed()).isEqualTo(1);
        assertThat(res.offlineNames()).containsExactly("윤정수");
        ArgumentCaptor<NotificationReq> captor = ArgumentCaptor.forClass(NotificationReq.class);
        verify(pushService).createNotification(captor.capture(), eq(sysAdmin));
        assertThat(captor.getValue().username()).isEqualTo("001");
        assertThat(captor.getValue().companyCode()).isEqualTo("kfstest");
        assertThat(captor.getValue().message()).isEqualTo("점검 안내");
    }

    @Test
    void 전체_알림은_공지로_한_번() {
        online(PERSON_ON, -5L);
        WebsocketResultRes res = service.sendAlarmAll(sysAdmin, "전체 안내");
        assertThat(res.processed()).isEqualTo(2);
        verify(pushService).createNotice(any(NoticeReq.class), eq(sysAdmin));
    }

    @Test
    void 알림내용이_비었거나_대상이_없거나_sys_admin이_아니면_거절() {
        online(PERSON_ON);
        assertThatThrownBy(() -> service.sendAlarm(sysAdmin, List.of(PERSON_ON), " ")).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.sendAlarm(sysAdmin, List.of(), "x")).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.sendAlarmAll(sysAdmin, null)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.sendAlarm(customer, List.of(PERSON_ON), "x")).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.forceLogout(customer, List.of(PERSON_ON))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.forceLogoutAll(customer)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.search(customer, null, "", 0, 100)).isInstanceOf(BusinessException.class);
        verify(pushService, never()).createNotification(any(), any());
        verify(pushService, never()).createNotice(any(), any());
        verify(authService, never()).forceLogout(any(), anyString());
    }

    @Test
    void 개별_강제_로그아웃은_접속_중인_사원만_하고_오프라인_이름을_돌려준다() {
        online(PERSON_ON);
        WebsocketResultRes res = service.forceLogout(sysAdmin, List.of(PERSON_ON, PERSON_OFF));
        assertThat(res.processed()).isEqualTo(1);
        assertThat(res.offlineNames()).containsExactly("윤정수");
        verify(authService).forceLogout(PERSON_ON, "admin:admin");
        verify(authService, never()).forceLogout(eq(PERSON_OFF), anyString());
    }

    @Test
    void 전체_강제_로그아웃은_접속한_모두에게() {
        online(PERSON_ON, PERSON_OFF, -5L);
        WebsocketResultRes res = service.forceLogoutAll(sysAdmin);
        assertThat(res.processed()).isEqualTo(3);
        verify(authService).forceLogout(PERSON_ON, "admin:admin");
        verify(authService).forceLogout(PERSON_OFF, "admin:admin");
        verify(authService).forceLogout(-5L, "admin:admin");
    }
}
