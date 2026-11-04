package kr.co.kfs.asseterp.biz.batch;

import kr.co.kfs.asseterp.biz.batch.action.Flt11InsertAction;
import kr.co.kfs.asseterp.biz.batch.action.Sch04InsertAction;
import kr.co.kfs.asseterp.biz.batch.action.Sch09InsertAction;
import kr.co.kfs.asseterp.biz.batch.dto.BatchCompany;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchCommonMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchFltMapper;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchSchMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InOrder;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

class BatchScheduleActionsTest {

    private final BatchCommonMapper common = mock(BatchCommonMapper.class);
    private final BatchSchMapper sch = mock(BatchSchMapper.class);
    private final BatchFltMapper flt = mock(BatchFltMapper.class);

    private static BatchReq stdDate(String stdDate) {
        return new BatchReq(null, null, null, stdDate, null, null, null, null, null);
    }

    @BeforeEach
    void companies() {
        when(common.selectUseCompanies()).thenReturn(List.of(new BatchCompany(100L, "가나다"), new BatchCompany(200L, "라마바")));
    }

    @Test
    void sch04는_stdDate가_없으면_직전_영업일로_회사마다_넣는다() {
        LocalDate prevBizDay = LocalDate.of(2026, 11, 3);
        when(common.selectBizDate(0L, LocalDate.now(), "-1")).thenReturn(prevBizDay);

        String msg = new Sch04InsertAction(common, sch).run(stdDate(""));

        assertThat(msg).isEqualTo("미처리 스케줄 Sch04에 Insert 작업완료.. commit");
        verify(sch).insertSch04List(100L, prevBizDay);
        verify(sch).insertSch04List(200L, prevBizDay);
    }

    @Test
    void sch04는_stdDate가_있으면_그_날짜를_쓰고_영업일_조회를_하지_않는다() {
        new Sch04InsertAction(common, sch).run(stdDate("2026-10-30"));

        verify(common, never()).selectBizDate(any(), any(), any());
        verify(sch).insertSch04List(100L, LocalDate.of(2026, 10, 30));
        verify(sch).insertSch04List(200L, LocalDate.of(2026, 10, 30));
    }

    @Test
    void sch04는_형식이_틀린_stdDate를_AS_IS처럼_null로_넘긴다() {
        new Sch04InsertAction(common, sch).run(stdDate("20261030"));

        verify(sch).insertSch04List(100L, null);
    }

    @Test
    void sch04는_한_회사에서_실패하면_예외를_던져_전체가_롤백되게_한다() {
        when(sch.insertSch04List(200L, LocalDate.of(2026, 10, 30))).thenThrow(new IllegalStateException("db error"));

        assertThatThrownBy(() -> new Sch04InsertAction(common, sch).run(stdDate("2026-10-30")))
                .isInstanceOf(IllegalStateException.class);
        verify(sch).insertSch04List(100L, LocalDate.of(2026, 10, 30));
    }

    @Test
    void sch09는_stdDate가_없으면_오늘로_회사마다_만든다() {
        String msg = new Sch09InsertAction(common, sch).run(stdDate(null));

        assertThat(msg).isEqualTo("업무일정(스케줄) 반복일정 Sch09에 Insert 작업완료.. commit");
        verify(sch).createSch09(100L, LocalDate.now());
        verify(sch).createSch09(200L, LocalDate.now());
        verifyNoInteractions(flt);
    }

    @Test
    void sch09는_결과가_Y여도_AS_IS처럼_오류_로그만_남기고_계속한다() {
        when(sch.createSch09(100L, LocalDate.of(2026, 11, 4))).thenReturn("Y");

        String msg = new Sch09InsertAction(common, sch).run(stdDate("2026-11-04"));

        assertThat(msg).contains("Sch09");
        verify(sch).createSch09(200L, LocalDate.of(2026, 11, 4));
    }

    @Test
    void flt11은_회사마다_정리한_뒤_이월한다() {
        String msg = new Flt11InsertAction(common, flt).run(stdDate(null));

        assertThat(msg).isEqualTo("자기매매 보유원장 이월 작업완료.. commit");
        InOrder order = inOrder(flt);
        order.verify(flt).deleteFlt11FromToday(100L);
        order.verify(flt).insertFlt11Carry(100L);
        order.verify(flt).deleteFlt11FromToday(200L);
        order.verify(flt).insertFlt11Carry(200L);
    }
}
