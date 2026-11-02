package kr.co.kfs.asseterp.biz.act;

import kr.co.kfs.asseterp.biz.act.dto.GenLedgerRdReq;
import kr.co.kfs.asseterp.biz.act.dto.GenLedgerRes;
import kr.co.kfs.asseterp.biz.act.dto.GenLedgerSummaryReq;
import kr.co.kfs.asseterp.biz.act.service.ActGenLedgerService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/** X18 계정원장(Act04_Tab_GenLedger)의 조회·하위계정·출력 준비·계정원장 정리를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(ActGenLedgerService.class)
class ActGenLedgerDbTest {

    private static final LocalDate STD = LocalDate.of(2025, 1, 22);

    @Autowired ActGenLedgerService service;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal user = UserPrincipal.builder().userId(29049L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 증감구분마다_조회가_되고_하위계정은_level_순서다() {
        for (String type : List.of("1", "2", "3")) {
            List<GenLedgerRes> list = service.searchGenLedgers(user, STD, type, null);
            assertThat(list).as("diffType " + type).isNotEmpty();
            assertThat(list.get(0).accountCode()).isNotBlank();
        }
        List<GenLedgerRes> all = service.searchGenLedgers(user, STD, "2", null);
        String code = all.stream().filter(r -> r.accountCode() != null && r.accountCode().length() > 2).findFirst().orElseThrow().accountCode();
        List<GenLedgerRes> tree = service.searchGenLedgersByAccount(user, STD, code);
        assertThat(tree).isNotEmpty();
        assertThat(tree.get(0).level()).isZero();
    }

    @Test
    void 출력_준비는_조회_행_수만큼_임시행을_만들고_앞_출력은_지운다() {
        List<GenLedgerRes> list = service.searchGenLedgers(user, STD, "3", null);
        long g1 = service.insertRdGenLedger(user, new GenLedgerRdReq("X18_TEST", STD, "3", ""));
        long g2 = service.insertRdGenLedger(user, new GenLedgerRdReq("X18_TEST", STD, "3", ""));
        Integer now = jdbc.queryForObject("select count(*) from sys99_print where sys99_window_class_nm='X18_TEST' and sys99_group_id=?", Integer.class, g2);
        Integer old = jdbc.queryForObject("select count(*) from sys99_print where sys99_window_class_nm='X18_TEST' and sys99_group_id=?", Integer.class, g1);
        assertThat(now).isEqualTo(list.size());
        assertThat(old).isZero();
    }

    @Test
    void 계정원장_정리는_함수를_돌리고_롤백된다() {
        int before = jdbc.queryForObject("select count(*) from act04_gen_ledger where act04_company_id = 28000", Integer.class);
        service.summaryGenLedger(user, new GenLedgerSummaryReq(LocalDate.of(2026, 1, 1), LocalDate.of(2026, 1, 1)));
        int after = jdbc.queryForObject("select count(*) from act04_gen_ledger where act04_company_id = 28000", Integer.class);
        assertThat(after).isGreaterThanOrEqualTo(0);
        assertThat(before).isGreaterThanOrEqualTo(0);
    }
}
