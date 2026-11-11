package kr.co.kfs.asseterp.biz.batch;

import kr.co.kfs.asseterp.biz.apr.service.AlertService;
import kr.co.kfs.asseterp.biz.batch.dto.BatchAlarmRecord;
import kr.co.kfs.asseterp.biz.batch.dto.BatchCompany;
import kr.co.kfs.asseterp.biz.batch.dto.BatchExpenseRequest;
import kr.co.kfs.asseterp.biz.batch.dto.BatchNoticeCompany;
import kr.co.kfs.asseterp.biz.batch.dto.BatchNoticePerson;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchCommonMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchNoticeMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchNoticeMapper.AltAppr;
import kr.co.kfs.asseterp.biz.batch.notice.BatchNoticeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * 알림 배치의 "누구에게 어떤 코드로" 규칙(AS-IS BatchMain). 원본 98d5afdd6(CH-0319)부터 무엇을 보낼지는 통합알림(AlertService) 몫이라
 * 여기서는 AlertService.alert에 넘긴 값만 본다(통합알림 규칙은 AlertServiceDbTest)
 */
class BatchNoticeServiceTest {

    private final BatchNoticeMapper mapper = mock(BatchNoticeMapper.class);
    private final BatchCommonMapper commonMapper = mock(BatchCommonMapper.class);
    private final AlertService alert = mock(AlertService.class);
    private BatchNoticeService service;

    @BeforeEach
    void setUp() {
        service = new BatchNoticeService(mapper, commonMapper, alert);
    }

    @Test
    void alarm은_회사마다_예정내역을_만들고_보낼_알람마다_T04로_알린다() {
        when(commonMapper.selectUseCompanies()).thenReturn(List.of(new BatchCompany(1L, "가"), new BatchCompany(2L, "나")));
        when(mapper.selectPendingAlarms("1")).thenReturn(List.of(new BatchAlarmRecord(77L, 1L, 10L, "회의 알림")));
        service.alarm();
        verify(mapper).insertAlarmTarget(1L);
        verify(mapper).insertAlarmTarget(2L);
        verify(alert).alert("T04", 10L, 1L, Map.of("content", "회의 알림", "alarmRecordId", 77L));
    }

    @Test
    void sendFlt10Report는_신청건이_있는_회사의_B01_수신자에게_건수를_알리고_대결자가_있으면_대결자에게() {
        when(mapper.selectNoticeCompanies()).thenReturn(List.of(new BatchNoticeCompany(1L, "loc1"), new BatchNoticeCompany(2L, "loc2")));
        when(mapper.countFlt10Pending(1L)).thenReturn(3);
        when(mapper.countFlt10Pending(2L)).thenReturn(0);
        when(mapper.selectSmsNoticeTargets(1L, "B01")).thenReturn(List.of(
                new BatchNoticePerson(10L, "010", "a@b", true), new BatchNoticePerson(11L, "011", "c@d", true)));
        when(mapper.selectTodayAltAppr(10L)).thenReturn(List.of());
        when(mapper.selectTodayAltAppr(11L)).thenReturn(List.of(new AltAppr(99L, "019", "z@z", true)));
        service.sendFlt10Report();
        verify(alert).alert("B01", 10L, 1L, Map.of("count", "3"));
        verify(alert).alert("B01", 99L, 1L, Map.of("count", "3"));
        verify(mapper, never()).selectSmsNoticeTargets(eq(2L), anyString());
    }

    @Test
    void sendExpenseRequest는_승인자에게_B02로_건수를_알린다_회사는_승인자의_회사() {
        when(mapper.selectNoticeCompanies()).thenReturn(List.of(new BatchNoticeCompany(1L, "loc1")));
        when(mapper.selectExpenseRequests(1L)).thenReturn(List.of(new BatchExpenseRequest(20L, 4L)));
        service.sendExpenseRequest();
        verify(alert).alert(eq("B02"), eq(20L), isNull(), eq(Map.of("count", "4")));
        verify(alert, never()).alert(eq("B01"), anyLong(), any(), any());
    }
}
