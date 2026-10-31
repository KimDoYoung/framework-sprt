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
import kr.co.kfs.asseterp.biz.apr.service.link.RetireLinkSeedProvider;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.service.PayRelateApprService;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V18 A05 퇴직정산서 결재창 제목·본문과 상신 행(Pay05_RelateAppr)을 asseterpdb에서 돌리고 롤백한다(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprLinkSeedService.class, RetireLinkSeedProvider.class, PayRelateApprService.class})
class AprRetireLinkSeedDbTest {

    /** 퇴직정산(03) 급여 — 상신 행·문서가 이미 있는 것 / 상신 행이 없는 것 */
    private static final long WITH_RELATE = 202308231570344L;
    private static final long NO_RELATE = 202308211569405L;
    private static final long APPR = 202609229873969L;

    @Autowired AprLinkSeedService seedService;
    @Autowired PayRelateApprService relateService;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private Long classTreeId() {
        return jdbc.queryForObject("select apr01_class_tree_id from apr01_appr where apr01_appr_id = ?", Long.class, APPR);
    }

    @Test
    void 퇴직정산서_제목과_본문을_만든다() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A05", WITH_RELATE);
        String name = jdbc.queryForObject("select f_emp_kor_nm(pay10_person_id) from pay10_month where pay10_month_id = ?", String.class, WITH_RELATE);
        assertThat(res.title()).startsWith("퇴직정산서_(").endsWith(")_" + name);
        assertThat(res.titleReadOnly()).isTrue();
        assertThat(res.saveVisible()).isFalse();
        assertThat(res.content()).startsWith("<table border=2").contains("퇴 직 정 산 서").contains(name).contains("지급금 계").contains("공제금 계").contains("차감지급액")
                .endsWith("</tbody></table>");
    }

    @Test
    void 지급_공제_합계가_항목_합과_같다() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A05", WITH_RELATE);
        Long pay = jdbc.queryForObject("select coalesce(sum(pay11_item_amt),0) from pay11_month_item where pay11_month_id = ? and pay11_item_type = '1'", Long.class, WITH_RELATE);
        Long ded = jdbc.queryForObject("select coalesce(sum(pay11_item_amt),0) from pay11_month_item where pay11_month_id = ? and pay11_item_type = '2'", Long.class, WITH_RELATE);
        String fmt = "&nbsp;%,d&nbsp;";
        assertThat(res.content()).contains("지급금 계").contains(String.format(fmt, pay)).contains(String.format(fmt, ded)).contains(String.format(fmt, pay - ded));
    }

    @Test
    void 없는_급여는_열_수_없다() {
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A05", -1L));
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A05", null));
    }

    @Test
    void 상신_행은_있으면_그대로_없으면_만든다() {
        Long exist = jdbc.queryForObject("select pay05_relate_appr_id from pay05_relate_appr where pay05_retire_id = ?", Long.class, WITH_RELATE);
        assertThat(relateService.createRetire(user(), WITH_RELATE)).isEqualTo(exist);

        Long created = relateService.createRetire(user(), NO_RELATE);
        assertThat(created).isNotNull();
        assertThat(jdbc.queryForObject("select count(*) from pay05_relate_appr where pay05_retire_id = ?", Integer.class, NO_RELATE)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select pay05_pay_cd from pay05_relate_appr where pay05_relate_appr_id = ?", String.class, created)).isEqualTo("03");
        assertThat(relateService.createRetire(user(), NO_RELATE)).isEqualTo(created);
        assertThrows(BusinessException.class, () -> relateService.createRetire(user(), -1L));
    }

    @Test
    void 문서_ID와_회사_출금계좌를_상신_행에_기록한다() {
        Long created = relateService.createRetire(user(), NO_RELATE);
        relateService.updateApprId(user(), created, APPR);
        assertThat(jdbc.queryForObject("select pay05_appr_id from pay05_relate_appr where pay05_relate_appr_id = ?", Long.class, created)).isEqualTo(APPR);
        assertThat(jdbc.queryForObject("select pay05_account_id from pay05_relate_appr where pay05_relate_appr_id = ?", Long.class, created)).isEqualTo(202205240177134L);
        assertThrows(BusinessException.class, () -> relateService.updateApprId(user(), -1L, APPR));
    }
}
