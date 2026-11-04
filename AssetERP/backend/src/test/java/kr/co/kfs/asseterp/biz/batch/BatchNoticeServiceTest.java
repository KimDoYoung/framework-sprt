package kr.co.kfs.asseterp.biz.batch;

import kr.co.kfs.asseterp.biz.apr.dto.AprNoticeCall;
import kr.co.kfs.asseterp.biz.apr.mapper.AprNoticeMapper;
import kr.co.kfs.asseterp.biz.apr.service.AprNoticeService;
import kr.co.kfs.asseterp.biz.batch.dto.BatchAlarmRecord;
import kr.co.kfs.asseterp.biz.batch.dto.BatchCompany;
import kr.co.kfs.asseterp.biz.batch.dto.BatchExpenseRequest;
import kr.co.kfs.asseterp.biz.batch.dto.BatchNoticeCompany;
import kr.co.kfs.asseterp.biz.batch.dto.BatchNoticePerson;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchCommonMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchNoticeMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchNoticeMapper.AltAppr;
import kr.co.kfs.asseterp.biz.batch.notice.BatchNoticeService;
import kr.co.kfs.asseterp.common.config.properties.NoticeProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/** 알림 배치의 "누구에게 무엇을" 규칙(AS-IS 조건)을 확인한다. 실제 발송은 하지 않고 AprNoticeService.dispatchAfterCommit에 넘긴 목록을 본다 */
class BatchNoticeServiceTest {

    private final BatchNoticeMapper mapper = mock(BatchNoticeMapper.class);
    private final BatchCommonMapper commonMapper = mock(BatchCommonMapper.class);
    private final AprNoticeMapper aprMapper = mock(AprNoticeMapper.class);
    private final AprNoticeService dispatcher = mock(AprNoticeService.class);
    private BatchNoticeService service;

    /** 메일은 loc1·loc2, SMS는 loc1만 보낸다 */
    private static NoticeProperties props() {
        return new NoticeProperties("sim", null, null, null, null, null, null, null, null, null, null, null,
                List.of("loc1"), List.of("loc1", "loc2"));
    }

    @BeforeEach
    void setUp() {
        service = new BatchNoticeService(mapper, commonMapper, aprMapper, props(), dispatcher);
    }

    @SuppressWarnings("unchecked")
    private List<AprNoticeCall> dispatched() {
        ArgumentCaptor<List<AprNoticeCall>> c = ArgumentCaptor.forClass(List.class);
        verify(dispatcher).dispatchAfterCommit(c.capture());
        return c.getValue();
    }

    // ───────── alarm ─────────

    @Test
    void alarm은_회사마다_예정내역을_만들고_앱알림과_메일을_보내며_메일은_보낸_곳을_남긴다() {
        when(commonMapper.selectUseCompanies()).thenReturn(List.of(new BatchCompany(100L, "가"), new BatchCompany(200L, "나")));
        when(mapper.insertAlarmTarget(anyLong())).thenReturn(3);
        when(mapper.selectPendingAlarms("1")).thenReturn(List.of(new BatchAlarmRecord(7L, 100L, 11L, "[AssetERP알림] 회의")));
        when(mapper.selectCompanyLoc(100L)).thenReturn("loc1");
        when(mapper.selectPerson(11L)).thenReturn(new BatchNoticePerson(11L, "010-1111-2222", "a@x.com", true));

        service.alarm();

        verify(mapper).insertAlarmTarget(100L);
        verify(mapper).insertAlarmTarget(200L);
        verify(mapper).updateAlarmSendInfo(7L, "a@x.com");
        assertThat(dispatched()).containsExactly(
                new AprNoticeCall("talk", "a@x.com", "알림", "[AssetERP알림] 회의"),
                new AprNoticeCall("mail", "a@x.com", "[알림] Asset-ERP", "[AssetERP알림] 회의"));
    }

    @Test
    void alarm은_회사가_메일을_안_보내면_앱알림만_가고_보낸_곳은_남기지_않는다() {
        when(commonMapper.selectUseCompanies()).thenReturn(List.of());
        when(mapper.selectPendingAlarms("1")).thenReturn(List.of(new BatchAlarmRecord(7L, 100L, 11L, "msg")));
        when(mapper.selectCompanyLoc(100L)).thenReturn("loc9");
        when(mapper.selectPerson(11L)).thenReturn(new BatchNoticePerson(11L, null, "a@x.com", true));

        service.alarm();

        verify(mapper, never()).updateAlarmSendInfo(anyLong(), anyString());
        assertThat(dispatched()).containsExactly(new AprNoticeCall("talk", "a@x.com", "알림", "msg"));
    }

    @Test
    void alarm은_이메일이_없으면_아무것도_안_보낸다() {
        when(commonMapper.selectUseCompanies()).thenReturn(List.of());
        when(mapper.selectPendingAlarms("1")).thenReturn(List.of(new BatchAlarmRecord(7L, 100L, 11L, "msg")));
        when(mapper.selectCompanyLoc(100L)).thenReturn("loc1");
        when(mapper.selectPerson(11L)).thenReturn(new BatchNoticePerson(11L, "010", null, true));

        service.alarm();

        verify(mapper, never()).updateAlarmSendInfo(anyLong(), anyString());
        assertThat(dispatched()).isEmpty();
    }

    // ───────── sendFlt10Report ─────────

    private void flt10Setup(String loc, BatchNoticePerson target) {
        when(mapper.selectNoticeCompanies()).thenReturn(List.of(new BatchNoticeCompany(100L, loc)));
        when(mapper.countFlt10Pending(100L)).thenReturn(2);
        when(mapper.selectSmsNoticeTargets(100L, "B01")).thenReturn(List.of(target));
        when(mapper.selectTodayAltAppr(any())).thenReturn(List.of());
    }

    @Test
    void sendFlt10Report는_앱알림_메일_SMS를_조건대로_만든다() {
        flt10Setup("loc1", new BatchNoticePerson(11L, "010-1111-2222", "a@x.com", true));

        service.sendFlt10Report();

        String url = "\r\n\r\n https://loc1.k-fs.co.kr:5151/";
        String msg = "[Asset-ERP] 임직원 매매 사전 승인신청 2건이 존재합니다." + url;
        assertThat(dispatched()).containsExactly(
                new AprNoticeCall("talk", "a@x.com", "임직원매매 사전신청건 확인", "임직원 매매 사전 승인신청 2건이 존재합니다."),
                new AprNoticeCall("mail", "a@x.com", "[알림] Asset-ERP 전자결재", msg),
                new AprNoticeCall("sms", "01011112222", "[Asset-ERP 알림]", msg));
    }

    @Test
    void sendFlt10Report는_신청건이_없는_회사는_건너뛴다() {
        when(mapper.selectNoticeCompanies()).thenReturn(List.of(new BatchNoticeCompany(100L, "loc1")));
        when(mapper.countFlt10Pending(100L)).thenReturn(0);

        service.sendFlt10Report();

        verify(mapper, never()).selectSmsNoticeTargets(anyLong(), anyString());
        assertThat(dispatched()).isEmpty();
    }

    @Test
    void sendFlt10Report는_오늘_대결자가_있으면_대결자_연락처로_보낸다() {
        flt10Setup("loc1", new BatchNoticePerson(11L, "010-1111-2222", "a@x.com", true));
        when(mapper.selectTodayAltAppr(11L)).thenReturn(List.of(new AltAppr(99L, "010-9999-0000", "alt@x.com", true)));

        service.sendFlt10Report();

        List<AprNoticeCall> calls = dispatched();
        assertThat(calls).extracting(AprNoticeCall::to).containsExactly("alt@x.com", "alt@x.com", "01099990000");
        verify(aprMapper).countTalkBlocked(99L, "B01");   // 수신 차단도 대결자 기준
    }

    @Test
    void sendFlt10Report는_수신_차단이면_그_종류는_보내지_않는다() {
        flt10Setup("loc1", new BatchNoticePerson(11L, "010-1111-2222", "a@x.com", true));
        when(aprMapper.countTalkBlocked(11L, "B01")).thenReturn(1);
        when(aprMapper.countSmsBlocked(11L, "B01")).thenReturn(1);

        service.sendFlt10Report();

        assertThat(dispatched()).extracting(AprNoticeCall::kind).containsExactly("mail");
    }

    @Test
    void sendFlt10Report의_메일은_이메일이_아니라_메일암호_유무를_본다() {
        flt10Setup("loc1", new BatchNoticePerson(11L, "010-1111-2222", "a@x.com", false));

        service.sendFlt10Report();

        // 암호가 없으면 이메일이 있어도 메일은 안 간다(앱알림·SMS는 간다) — AS-IS 그대로
        assertThat(dispatched()).extracting(AprNoticeCall::kind).containsExactly("talk", "sms");
    }

    @Test
    void sendFlt10Report는_회사가_SMS를_안_보내면_SMS만_빠진다() {
        flt10Setup("loc2", new BatchNoticePerson(11L, "010-1111-2222", "a@x.com", true));

        service.sendFlt10Report();

        assertThat(dispatched()).extracting(AprNoticeCall::kind).containsExactly("talk", "mail");
    }

    // ───────── sendExpenseRequest ─────────

    @Test
    void sendExpenseRequest는_승인자에게_건수를_알린다() {
        when(mapper.selectNoticeCompanies()).thenReturn(List.of(new BatchNoticeCompany(100L, "loc1")));
        when(mapper.selectExpenseRequests(100L)).thenReturn(List.of(new BatchExpenseRequest(55L, 3L)));
        when(mapper.selectPerson(55L)).thenReturn(new BatchNoticePerson(55L, "010-5555-6666", "c@x.com", true));

        service.sendExpenseRequest();

        String msg = "[Asset-ERP] 사업비지출 승인요청 3건이 존재합니다";
        assertThat(dispatched()).containsExactly(
                new AprNoticeCall("talk", "c@x.com", "사업비지출 승인요청건 확인", "사업비지출 승인요청 3건이 존재합니다"),
                new AprNoticeCall("mail", "c@x.com", "[알림] Asset-ERP 전자결재", msg),
                new AprNoticeCall("sms", "01055556666", "[Asset-ERP 알림]", msg));
        verify(aprMapper).countTalkBlocked(55L, "B02");
    }

    @Test
    void sendExpenseRequest는_승인자가_없으면_AS_IS처럼_NullPointerException() {
        when(mapper.selectNoticeCompanies()).thenReturn(List.of(new BatchNoticeCompany(100L, "loc1")));
        when(mapper.selectExpenseRequests(100L)).thenReturn(List.of(new BatchExpenseRequest(55L, 3L)));
        when(mapper.selectPerson(55L)).thenReturn(null);

        assertThatThrownBy(() -> service.sendExpenseRequest()).isInstanceOf(NullPointerException.class);
        verify(dispatcher, never()).dispatchAfterCommit(any());
    }
}
