package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.apr.dto.AprLinkSeedRes;
import kr.co.kfs.asseterp.biz.apr.service.AprLinkSeedService;
import kr.co.kfs.asseterp.biz.apr.service.link.PayMonthLinkSeedProvider;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V25 A02 급여대장 결재창 제목·본문을 asseterpdb에서 돌리고 롤백한다(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprLinkSeedService.class, PayMonthLinkSeedProvider.class})
class AprPayMonthLinkSeedDbTest {

    private static final long APPR = 202609229873969L;

    @Autowired AprLinkSeedService seedService;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private Long classTreeId() {
        return jdbc.queryForObject("select apr01_class_tree_id from apr01_appr where apr01_appr_id = ?", Long.class, APPR);
    }

    /** 상신 행을 만든다(롤백) — 급여 구분 01, 지급일 2026-02-20 */
    private long relate() {
        Long id = jdbc.queryForObject("select f_create_seq()", Long.class);
        jdbc.update("insert into pay05_relate_appr (pay05_relate_appr_id, pay05_company_id, pay05_start_date, pay05_pay_cd) values (?, 28000, date '2026-02-20', '01')", id);
        return id;
    }

    @Test
    void 급여대장_제목과_본문을_만든다() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A02", relate());
        assertThat(res.title()).startsWith("급여대장 (2026-02-20 / ").endsWith(")");
        assertThat(res.titleReadOnly()).isTrue();
        assertThat(res.saveVisible()).isFalse();
        assertThat(res.content()).startsWith("<table border=2").contains("급 여 내 역").contains("지급액 합계").contains("공제액 합계").contains("차감지급액")
                .endsWith("</tbody></table>");
    }

    @Test
    void 지급액_합계가_항목_합과_같다() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A02", relate());
        Long pay = jdbc.queryForObject("select coalesce(sum(pay11_item_amt),0) from pay10_month inner join pay11_month_item on pay10_month_id = pay11_month_id"
                + " where pay10_company_id = 28000 and pay10_pay_cd = '01' and pay10_date = date '2026-02-20' and pay11_item_type = '1'", Long.class);
        String formatted = java.text.NumberFormat.getIntegerInstance(java.util.Locale.US).format(pay);
        assertThat(res.content()).contains("&nbsp;임 금 : - 원 ( ₩&nbsp;" + formatted + "&nbsp;)")
                .contains(">&nbsp;" + formatted + "&nbsp;</span>");
    }

    @Test
    void 없는_상신_행은_거절() {
        assertThrows(BusinessException.class, () -> seedService.seed(user(), classTreeId(), "A02", 1L));
    }
}
