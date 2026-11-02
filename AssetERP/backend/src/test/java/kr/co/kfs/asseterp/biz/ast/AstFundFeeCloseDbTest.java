package kr.co.kfs.asseterp.biz.ast;

import kr.co.kfs.asseterp.biz.act.service.ActJournalService;
import kr.co.kfs.asseterp.biz.ast.dto.FundFeeCloseItemReq;
import kr.co.kfs.asseterp.biz.ast.dto.FundFeeCloseRes;
import kr.co.kfs.asseterp.biz.ast.dto.FundFeeFundRes;
import kr.co.kfs.asseterp.biz.ast.dto.FundFeeFundSaveReq;
import kr.co.kfs.asseterp.biz.ast.service.AstFundFeeCloseService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** X13 펀드보수 결산처리(Ast30_Tab_OfficeMngFeeClose)의 결산처리·결산취소·펀드보수 변경을 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AstFundFeeCloseService.class, ActJournalService.class})
class AstFundFeeCloseDbTest {

    private static final LocalDate HOLD = LocalDate.of(2026, 3, 31);
    private static final long CORP = 202208050325133L;

    @Autowired AstFundFeeCloseService service;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal user = UserPrincipal.builder().userId(29049L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();

    private List<FundFeeCloseRes> list() {
        return service.search(user, HOLD, CORP, null);
    }

    private FundFeeCloseItemReq item(FundFeeCloseRes r) {
        return new FundFeeCloseItemReq(r.corpId(), r.astClassTreeId(), r.holdDate(), r.curCode(), r.trCode(), r.forFee(), r.fee(), r.fxRate(), r.closeYnName(), r.trId());
    }

    private int count(String sql, Object... args) {
        return jdbc.queryForObject(sql, Integer.class, args);
    }

    @Test
    void 결산처리_뒤_결산취소로_원래대로_돌아온다() {
        List<FundFeeCloseRes> before = list();
        assertThat(before).isNotEmpty();
        FundFeeCloseRes target = before.get(0);
        assertThat(target.closeYnName()).isEmpty();
        int bookRows = count("select count(*) from ast30_book_fund_fee where ast30_company_id = 28000 and ast30_hold_date = ? and ast30_corp_id = ? and ast30_cur_cd = ? and ast30_ast_class_tree_id = ?",
                HOLD, CORP, target.curCode(), target.astClassTreeId());
        int allRows = count("select count(*) from ast30_book_fund_fee where ast30_company_id = 28000 and ast30_hold_date = ?", HOLD);
        int closeBefore = count("select count(*) from ast31_book_fund_fee_close");

        service.process(user, List.of(item(target)));

        // 결산 거래·결산원장이 이 운용사·통화·자산 행만큼만 생긴다(다른 운용사 원장은 건드리지 않는다)
        FundFeeCloseRes closed = list().stream().filter(r -> r.keyId() != null && target.astClassTreeId().equals(r.astClassTreeId()) && target.curCode().equals(r.curCode())).findFirst().orElseThrow();
        assertThat(closed.closeYnName()).isEqualTo("결산");
        assertThat(closed.trId()).isNotNull();
        assertThat(count("select count(*) from ast31_book_fund_fee_close")).isEqualTo(closeBefore + bookRows);
        assertThat(count("select count(*) from ast06_tr where ast06_tr_id = ? and ast06_tr_cd = ? and ast06_note = '펀드보수결산'", closed.trId(), target.trCode())).isEqualTo(1);
        assertThat(count("select count(*) from act02_journal where act02_tr_id = ?", closed.trId())).isPositive();
        assertThat(count("select count(*) from ast06_tr where ast06_org_tr_id = ?", closed.trId())).isPositive();   // 반제거래
        assertThat(count("select count(*) from ast30_book_fund_fee where ast30_company_id = 28000 and ast30_hold_date = ?", HOLD)).isEqualTo(allRows);

        // 이미 결산한 행을 또 처리하면 거절
        assertThatThrownBy(() -> service.process(user, List.of(item(closed)))).isInstanceOf(BusinessException.class).hasMessageContaining("결산처리가 완료된 내역");

        service.cancel(user, List.of(item(closed)));

        assertThat(count("select count(*) from ast31_book_fund_fee_close")).isEqualTo(closeBefore);
        assertThat(count("select count(*) from ast06_tr where ast06_tr_id = ?", closed.trId())).isZero();
        assertThat(count("select count(*) from ast06_tr where ast06_org_tr_id = ?", closed.trId())).isZero();
        assertThat(count("select count(*) from act02_journal where act02_tr_id = ?", closed.trId())).isZero();
        assertThat(count("select count(*) from ast30_book_fund_fee where ast30_company_id = 28000 and ast30_hold_date = ?", HOLD)).isEqualTo(allRows);
        assertThat(list().get(0).closeYnName()).isEmpty();
    }

    @Test
    void 결산취소는_결산_전_행이면_거절() {
        FundFeeCloseRes target = list().get(0);
        assertThatThrownBy(() -> service.cancel(user, List.of(item(target)))).isInstanceOf(BusinessException.class).hasMessageContaining("결산처리 전 내역");
    }

    @Test
    void 펀드보수_변경_저장은_KRW면_외화보수를_보수와_같게_한다() {
        List<FundFeeFundRes> funds = service.searchFunds(user, HOLD, CORP, "KRW", null);
        assertThat(funds).isNotEmpty();
        FundFeeFundRes f = funds.get(0);
        assertThat(service.saveFunds(user, new FundFeeFundSaveReq("KRW", List.of(new FundFeeFundSaveReq.Item(f.bookFundFeeId(), 12345L, 1.0, 1.0))))).isEqualTo(1);
        assertThat(jdbc.queryForObject("select ast30_for_fee from ast30_book_fund_fee where ast30_book_fund_fee_id = ?", Double.class, f.bookFundFeeId())).isEqualTo(12345.0);
        assertThat(jdbc.queryForObject("select ast30_fee from ast30_book_fund_fee where ast30_book_fund_fee_id = ?", Long.class, f.bookFundFeeId())).isEqualTo(12345L);
        assertThat(service.searchFunds(user, HOLD, CORP, "KRW", "%없는펀드%")).isEmpty();
        assertThatThrownBy(() -> service.saveFunds(user, new FundFeeFundSaveReq("KRW", List.of()))).isInstanceOf(BusinessException.class);
    }

    @Test
    void 미래일_결산일_또는_선택없음은_거절() {
        FundFeeCloseRes target = list().get(0);
        FundFeeCloseItemReq future = new FundFeeCloseItemReq(target.corpId(), target.astClassTreeId(), LocalDate.now().plusDays(1), target.curCode(), target.trCode(), 1.0, 1L, 1.0, "", null);
        assertThatThrownBy(() -> service.process(user, List.of(future))).hasMessageContaining("미래일");
        assertThatThrownBy(() -> service.process(user, List.of())).hasMessageContaining("처리대상");
        assertThatThrownBy(() -> service.reprocFundFee(user, LocalDate.now())).hasMessageContaining("재작업 대상일");
        assertThatThrownBy(() -> service.reprocFundFee(user, HOLD)).hasMessageContaining("연결산일");
    }
}
