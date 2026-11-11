package kr.co.kfs.asseterp.biz.pay;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.act.service.ActJournalService;
import kr.co.kfs.asseterp.biz.apr.dto.AprNoticeCall;
import kr.co.kfs.asseterp.biz.apr.service.AprNoticeService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseConfirmRes;
import kr.co.kfs.asseterp.biz.pay.service.PayExpenseService;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.support.NoticeTestConfig;

/** Y09 사업비 지출승인(부서장) — asseterpdb의 실제 지출요청으로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({PayExpenseService.class, AprNoticeService.class, NoticeTestConfig.class})
class PayExpenseConfirmDbTest {

    @Autowired PayExpenseService service;
    @Autowired AprNoticeService notice;
    @Autowired JdbcTemplate jdbc;

    @org.springframework.test.context.bean.override.mockito.MockitoBean SysFileService fileService;
    @org.springframework.test.context.bean.override.mockito.MockitoBean ActJournalService journalService;

    /** 승인자 29049, 승인(20) 처리된 지출요청 */
    private static final long APPROVER = 29049L;
    private static final long EXPENSE = 202504142262612L;

    private static UserPrincipal user(long id) {
        return UserPrincipal.builder().userId(id).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private String status(long id) {
        return jdbc.queryForObject("SELECT pay50_confirm_status_cd FROM pay50_expense WHERE pay50_expense_id = ?", String.class, id);
    }

    @Test
    void 조회는_승인자_본인_건만_PASS_제외하고_미승인만_거를_수_있다() {
        LocalDate from = LocalDate.of(2020, 1, 1);
        LocalDate to = LocalDate.of(2026, 12, 31);
        List<ExpenseConfirmRes> all = service.searchConfirms(user(APPROVER), from, to, false);
        assertThat(all).isNotEmpty();
        assertThat(all).noneMatch(r -> "80".equals(r.confirmStatusCode()));
        assertThat(all).allMatch(r -> r.confirmStatusCode() != null);
        assertThat(service.searchConfirms(user(APPROVER), from, to, true)).allMatch(r -> "10".equals(r.confirmStatusCode()));
    }

    @Test
    void 반려는_사유와_오늘_승인일자를_남기고_취소는_일자를_비운다() {
        service.updateConfirms(user(APPROVER), List.of(EXPENSE), "30", "시험 사유");
        assertThat(status(EXPENSE)).isEqualTo("30");
        assertThat(jdbc.queryForObject("SELECT pay50_confirm_reason FROM pay50_expense WHERE pay50_expense_id = ?", String.class, EXPENSE)).isEqualTo("시험 사유");
        assertThat(jdbc.queryForObject("SELECT pay50_confirm_date = CURRENT_DATE FROM pay50_expense WHERE pay50_expense_id = ?", Boolean.class, EXPENSE)).isTrue();

        service.updateConfirms(user(APPROVER), List.of(EXPENSE), "10", null);
        assertThat(status(EXPENSE)).isEqualTo("10");
        assertThat(jdbc.queryForObject("SELECT pay50_confirm_date FROM pay50_expense WHERE pay50_expense_id = ?", Object.class, EXPENSE)).isNull();
    }

    @Test
    void 승인상태가_틀리거나_다른_회사_건이면_거절한다() {
        assertThatThrownBy(() -> service.updateConfirms(user(APPROVER), List.of(EXPENSE), "99", null)).isInstanceOf(BusinessException.class);
        UserPrincipal other = UserPrincipal.builder().userId(APPROVER).companyId(1L).name("시험").roles(List.of("ROLE_USER")).build();
        assertThatThrownBy(() -> service.updateConfirms(other, List.of(EXPENSE), "20", null)).isInstanceOf(BusinessException.class);
    }

    @Test
    void 반려_알림은_요청자에게_건수_문구로_계획한다() {
        List<AprNoticeCall> calls = notice.planExpenseReject(28000L, APPROVER, "2");
        assertThat(calls).isNotEmpty();
        assertThat(calls).allMatch(c -> c.body().contains("사업비요청 2건이 반려되었습니다"));
        assertThat(calls).anyMatch(c -> "talk".equals(c.kind()) && "사업비 요청 반려".equals(c.title()));
    }

    @Test
    void 일괄_알림발송은_미발송_반려건을_요청자별로_묶고_발송_표시를_남긴다() {
        service.updateConfirms(user(APPROVER), List.of(EXPENSE), "30", "시험 사유");
        int n = service.sendConfirmRejectNotices(user(APPROVER));
        assertThat(n).isEqualTo(1);
        // 이미 보낸 건은 다시 보내지 않는다
        assertThat(service.sendConfirmRejectNotices(user(APPROVER))).isZero();
    }
}
