package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.apr.dto.AprLinkSeedRes;
import kr.co.kfs.asseterp.biz.apr.service.AprLinkSeedService;
import kr.co.kfs.asseterp.biz.apr.service.link.CardMgmtLinkSeedProvider;
import kr.co.kfs.asseterp.biz.apr.service.link.OprLinkSeedProvider;
import kr.co.kfs.asseterp.biz.apr.service.link.PromoBuyLinkSeedProvider;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bmt.service.BmtBuyService;
import kr.co.kfs.asseterp.biz.fnd.service.FndOprService;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V38 A04·A13·A26·A38 결재창 제목·본문·연관펀드와 상신 뒤 결재 ID 기록을 asseterpdb에서 돌리고 롤백한다(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprLinkSeedService.class, PromoBuyLinkSeedProvider.class, OprLinkSeedProvider.class, CardMgmtLinkSeedProvider.class, BmtBuyService.class, FndOprService.class})
class AprOprPromoLinkSeedDbTest {

    private static final long APPR = 202609229873969L;

    @Autowired AprLinkSeedService seedService;
    @Autowired BmtBuyService buyService;
    @Autowired FndOprService oprService;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private Long classTreeId() {
        return jdbc.queryForObject("select apr01_class_tree_id from apr01_appr where apr01_appr_id = ?", Long.class, APPR);
    }

    private Long oprIdWithFunds(String oprCode) {
        return jdbc.queryForObject("select max(fnd30_opr_id) from fnd30_opr where fnd30_company_id = 28000 and fnd30_opr_cd = ? "
                + "and exists (select 1 from fnd31_opr_fund where fnd31_opr_id = fnd30_opr_id)", Long.class, oprCode);
    }

    @Test
    void 판촉물_구매는_제목만_정한다() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A04", 1L);
        assertThat(res.title()).isEqualTo("판촉물 구매");
        assertThat(res.titleReadOnly()).isFalse();
        assertThat(res.saveVisible()).isFalse();
    }

    @Test
    void 공모주_청약은_시행일자가_청약일이고_연관펀드를_돌려준다() {
        Long oprId = oprIdWithFunds("01");
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A26", oprId);
        assertThat(res.title()).startsWith("[").endsWith("] 공모주 청약 및 납입 운용지시의 건");
        assertThat(res.content()).contains("공모주 청약 및 납입 운용지시를 드립니다.", "- 다 음 -", "1. 청약내역", "2. 납입내역", "펀드명<br>(펀드코드)", "합계");
        assertThat(res.effectDate()).isEqualTo(jdbc.queryForObject("select fnd30_subscription_date from fnd30_opr where fnd30_opr_id = ?", java.time.LocalDate.class, oprId));
        int fundRows = jdbc.queryForObject("select count(distinct fnd31_fund_id) from fnd31_opr_fund where fnd31_opr_id = ?", Integer.class, oprId);
        int related = (res.relateFunds() == null ? 0 : res.relateFunds().size()) + (res.relateAdvs() == null ? 0 : res.relateAdvs().size());
        assertThat(related).isEqualTo(fundRows);
    }

    @Test
    void 공모주_수요예측은_신청수량_표와_투자의견을_넣는다() {
        Long oprId = oprIdWithFunds("02");
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A38", oprId);
        assertThat(res.title()).endsWith(" 공모주 수요예측 참여의 건");
        assertThat(res.content()).contains("아래와 같이 수요예측에 참여하고자 합니다.", "- 아 래 -", "1. 종목명 : ", "2. 주요내용", "수요예측기간", "6) 투자의견 : 첨부와 같음");
        assertThat(res.effectDate()).isEqualTo(jdbc.queryForObject("select fnd30_demand_date from fnd30_opr where fnd30_opr_id = ?", java.time.LocalDate.class, oprId));
    }

    @Test
    void 법인카드_내역관리는_마감된_달의_카드별_계정과목별_표를_만든다() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A13", null, Map.of("dataYm", "2025.07", "closeDate", "2025-07-31"));
        assertThat(res.title()).isEqualTo("법인카드 사용내역서 (2025.07)");
        assertThat(res.effectDate()).hasToString("2025-07-31");
        assertThat(res.content()).contains("- 다&nbsp;&nbsp;&nbsp;&nbsp;음 -", "1) 카드별 사용내역", "2) 계정과목별 사용내역", "카드명(사원)", "계정과목명");
    }

    @Test
    void 법인카드_내역관리는_마감_안_된_달이면_막는다() {
        BusinessException e = assertThrows(BusinessException.class,
                () -> seedService.seed(user(), classTreeId(), "A13", null, Map.of("dataYm", "2025.06", "closeDate", "2025-06-30")));
        assertThat(e.getMessage()).contains("마감되지않은 법인카드내역이 포함되어있습니다");
    }

    @Test
    void 판촉물_구매에_결재문서_ID를_기록한다() {
        Long buyId = jdbc.queryForObject("select min(bmt01_buy_id) from bmt01_buy where bmt01_company_id = 28000", Long.class);
        buyService.updateApprId(user(), buyId, APPR);
        assertThat(jdbc.queryForObject("select bmt01_appr_id from bmt01_buy where bmt01_buy_id = ?", Long.class, buyId)).isEqualTo(APPR);
    }

    @Test
    void 공모주에_결재문서_ID를_기록하고_반려_문서는_폐기보관한다() {
        Long oprId = oprIdWithFunds("01");
        // 이전 반려 문서(lastApprId) = 시험 문서 APPR, 새 문서 = 다른 기존 문서. 롤백이라 실제 문서는 그대로다
        Long newAppr = jdbc.queryForObject("select min(apr01_appr_id) from apr01_appr where apr01_appr_id <> ? and apr01_company_id = 28000", Long.class, APPR);
        long last = APPR;
        oprService.updateApprId(user(), oprId, newAppr, last);
        assertThat(jdbc.queryForObject("select fnd30_appr_id from fnd30_opr where fnd30_opr_id = ?", Long.class, oprId)).isEqualTo(newAppr);
        assertThat(jdbc.queryForObject("select count(*) from apr01_appr where apr01_appr_id = ?", Integer.class, last)).isZero();
        assertThat(jdbc.queryForObject("select count(*) from apr99_appr_del where apr99_appr_id = ?", Integer.class, last)).isGreaterThanOrEqualTo(1);
    }
}
