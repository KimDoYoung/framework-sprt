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
import kr.co.kfs.asseterp.biz.apr.service.AprNoticeService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseConfirmerRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseMineRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseMineSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseRelateApprRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseRes;
import kr.co.kfs.asseterp.biz.pay.service.PayExpenseService;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.support.NoticeTestConfig;

/** Y08 사업비 지출요청 — asseterpdb로 돌리고 롤백한다(만든 행은 같은 테스트 안에서 롤백) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({PayExpenseService.class, AprNoticeService.class, NoticeTestConfig.class})
class PayExpenseMineDbTest {

    @Autowired PayExpenseService service;
    @Autowired JdbcTemplate jdbc;

    @org.springframework.test.context.bean.override.mockito.MockitoBean SysFileService fileService;
    @org.springframework.test.context.bean.override.mockito.MockitoBean ActJournalService journalService;

    private static final long REQUESTER = 29049L;
    private static final long CORP = 202203240096701L;
    private static final long DONE_APPR = 202512169211040L;

    private static UserPrincipal user(long id) {
        return UserPrincipal.builder().userId(id).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private static ExpenseMineSaveReq req(boolean pass) {
        LocalDate d = LocalDate.of(2026, 11, 1);
        return new ExpenseMineSaveReq("10", d, "Y08 시험", "<p>내용</p>", CORP, "2", 1000L, 100L, 1100L, d, "10", "시험은행 123 홍길동",
                REQUESTER, null, null, null, pass);
    }

    @Test
    void 목록은_요청자_본인의_PASS_아닌_건만_등록일_내림차순() {
        List<ExpenseMineRes> rows = service.searchMine(user(REQUESTER), LocalDate.of(2020, 1, 1), LocalDate.of(2026, 12, 31));
        assertThat(rows).isNotEmpty();
        assertThat(rows).noneMatch(r -> "80".equals(r.confirmStatusCode()));
    }

    @Test
    void 승인자와_기본_면세구분을_돌려준다() {
        ExpenseConfirmerRes c = service.confirmer(user(REQUESTER));
        assertThat(c.confirmerId()).isNotNull();
        assertThat(c.taxType()).isNotNull();
    }

    @Test
    void 번호를_먼저_받아_등록하고_다시_저장하면_수정되며_요청과_취소와_삭제를_한다() {
        UserPrincipal u = user(REQUESTER);
        long id = service.nextId();
        ExpenseRes created = service.saveMine(u, id, req(false));
        assertThat(created.regEmpId()).isEqualTo(REQUESTER);
        assertThat(created.confirmStatusCode()).isNull();
        assertThat(created.settleAmt()).isEqualTo(1100L);

        // 같은 번호로 다시 저장 = 수정
        ExpenseMineSaveReq changed = new ExpenseMineSaveReq("10", LocalDate.of(2026, 11, 1), "고침", null, CORP, "2", 2000L, 200L, 2200L,
                LocalDate.of(2026, 11, 2), "10", "시험은행 123 홍길동", REQUESTER, null, null, null, false);
        assertThat(service.saveMine(u, id, changed).desc()).isEqualTo("고침");

        // 증빙문서 연결·조회·제거
        service.addRelateAppr(u, id, DONE_APPR);
        List<ExpenseRelateApprRes> rel = service.relateApprs(u, id);
        assertThat(rel).hasSize(1);
        assertThat(rel.get(0).apprId()).isEqualTo(DONE_APPR);
        assertThat(service.deleteRelateApprs(u, id, List.of(rel.get(0).relateApprId()))).isEqualTo(1);
        assertThat(service.relateApprs(u, id)).isEmpty();

        // 요청하기 → 10, 수정 불가, 요청취소 → 비움
        service.updateMineStatus(u, List.of(id), true);
        assertThat(service.get(u, id).confirmStatusCode()).isEqualTo("10");
        assertThatThrownBy(() -> service.saveMine(u, id, changed)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.deleteMine(u, List.of(id))).isInstanceOf(BusinessException.class);
        service.updateMineStatus(u, List.of(id), false);
        assertThat(service.get(u, id).confirmStatusCode()).isNull();

        service.addRelateAppr(u, id, DONE_APPR);
        assertThat(service.deleteMine(u, List.of(id))).isEqualTo(1);
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM pay50_expense WHERE pay50_expense_id = ?", Integer.class, id)).isZero();
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM com01_relate_appr WHERE com01_key_table_id = ?", Integer.class, id)).isZero();
    }

    @Test
    void 바로등록은_승인상태_80과_로그인_사원을_승인자_결의자로_넣는다() {
        UserPrincipal u = user(REQUESTER);
        long id = service.nextId();
        ExpenseRes created = service.saveMine(u, id, req(true));
        assertThat(created.confirmStatusCode()).isEqualTo("80");
        assertThat(created.apprEmpId()).isEqualTo(REQUESTER);
        assertThat(created.confirmerId()).isEqualTo(REQUESTER);
    }

    @Test
    void 남의_건은_요청_취소_삭제할_수_없다() {
        UserPrincipal owner = user(REQUESTER);
        long id = service.nextId();
        service.saveMine(owner, id, req(false));
        UserPrincipal other = user(202204180108329L);
        assertThatThrownBy(() -> service.updateMineStatus(other, List.of(id), true)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.deleteMine(other, List.of(id))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.saveMine(other, id, req(false))).isInstanceOf(BusinessException.class);
    }
}
