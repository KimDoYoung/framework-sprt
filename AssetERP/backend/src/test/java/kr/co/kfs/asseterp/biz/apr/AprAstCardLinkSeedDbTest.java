package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;

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
import kr.co.kfs.asseterp.biz.apr.service.link.CardReportLinkSeedProvider;
import kr.co.kfs.asseterp.biz.apr.service.link.DepositIoLinkSeedProvider;
import kr.co.kfs.asseterp.biz.apr.service.link.TrTaxLinkSeedProvider;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.mapper.BizRelateApprMapper;
import kr.co.kfs.asseterp.biz.biz.service.BizCardExcelService;
import kr.co.kfs.asseterp.biz.biz.service.BizRelateApprService;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V33 A17 일일자금 · A35·A36 법인카드 현황·접대비 현황 · A66~A68 세금/4대보험 납부 결재창 제목·본문과 월 상신 기록을 asseterpdb에서 돌리고 롤백한다(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprLinkSeedService.class, CardReportLinkSeedProvider.class, DepositIoLinkSeedProvider.class, TrTaxLinkSeedProvider.class})
class AprAstCardLinkSeedDbTest {

    private static final long APPR = 202609229873969L;
    /** 4대보험 납부(5052) 거래 */
    private static final long TR_INSURE = 202507212358009L;
    /** 일일자금관리 출력 자료 묶음(회사 28000) */
    private static final long GROUP = 202610299890968L;

    @Autowired AprLinkSeedService seedService;
    @Autowired BizRelateApprMapper relateMapper;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private Long classTreeId() {
        return jdbc.queryForObject("select apr01_class_tree_id from apr01_appr where apr01_appr_id = ?", Long.class, APPR);
    }

    @Test
    void 법인카드_현황과_접대비_현황은_제목만_만든다() {
        AprLinkSeedRes a35 = seedService.seed(user(), classTreeId(), "A35", null, Map.of("yyyy", "2026", "mm", "03"));
        assertThat(a35.title()).isEqualTo("2026.03 법인카드 현황");
        assertThat(a35.titleReadOnly()).isFalse();
        assertThat(a35.saveVisible()).isFalse();
        AprLinkSeedRes a36 = seedService.seed(user(), classTreeId(), "A36", null, Map.of("yyyy", "2026"));
        assertThat(a36.title()).isEqualTo("2026년도 법인카드 접대비 현황");
        assertThat(a36.titleReadOnly()).isFalse();
        assertThrows(BusinessException.class, () -> seedService.seed(user(), classTreeId(), "A35", null, Map.of("yyyy", "2026")));
        assertThrows(BusinessException.class, () -> seedService.seed(user(), classTreeId(), "A36", null, Map.of()));
    }

    @Test
    void 원천세_부가세_납부는_제목만_만든다() {
        assertThat(seedService.seed(user(), classTreeId(), "A66", TR_INSURE).title()).isEqualTo("원천세 납부의 건");
        AprLinkSeedRes a67 = seedService.seed(user(), classTreeId(), "A67", TR_INSURE);
        assertThat(a67.title()).isEqualTo("부가세 납부의 건");
        assertThat(a67.titleReadOnly()).isFalse();
    }

    @Test
    void 사대보험_납부는_지출결의서와_고지내역_표를_만든다() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A68", TR_INSURE);
        assertThat(res.title()).isEqualTo("2025.07월분 사대보험 납부");
        assertThat(res.titleReadOnly()).isFalse();
        assertThat(res.content()).startsWith("<table border=2").contains("지 출 결 의 서").contains("1. 발생부서 : ").contains("고지 내역")
                .contains("국민연금").contains("국민건강").contains("고용보험").contains("산재보험").contains("합 계")
                .contains("3. 일 &nbsp;&nbsp;&nbsp;&nbsp; 금 : 오십일만오천사백육십이원 ( ₩ 515,462 )").contains("4. 지출일자 :&nbsp;2025-07-24")
                .endsWith("</tbody></table>");
        assertThrows(BusinessException.class, () -> seedService.seed(user(), classTreeId(), "A68", -1L));
        assertThrows(BusinessException.class, () -> seedService.seed(user(), classTreeId(), "A68", null));
    }

    @Test
    void 일일자금_본문은_출력_자료_묶음_줄_수만큼_만든다() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A17", GROUP, Map.of("stdDate", "2026-10-29"));
        assertThat(res.title()).isEqualTo("일일자금현황_2026-10-29");
        assertThat(res.titleReadOnly()).isFalse();
        assertThat(res.content()).startsWith("1. 2026년 10월 29일 일일자금현황<br><table").contains("예금구분").contains("2. 보고사항").endsWith("</tbody></table>");
        Integer rows = jdbc.queryForObject("select count(*) from (select 1 from sys99_print where sys99_group_id = ? and sys99_company_id = 28000 "
                + "group by sys99_string02, sys99_string03, sys99_string04, sys99_string01, sys99_double01, sys99_double02, sys99_string05, sys99_long10, sys99_long11) t",
                Integer.class, GROUP);
        // 줄마다 오른쪽 정렬 칸이 4개(기초·입금·출금·당일잔액)
        assertThat(res.content().split("text-align:right", -1).length - 1).isEqualTo(rows * 4);
        // 다른 회사는 이 묶음을 읽지 못한다(회사 조건 추가)
        UserPrincipal other = UserPrincipal.builder().userId(1L).companyId(-1L).name("시험").roles(List.of("ROLE_USER")).build();
        assertThat(seedService.seed(other, classTreeId(), "A17", GROUP, Map.of("stdDate", "2026-10-29")).content()).doesNotContain("text-align:right");
        assertThrows(BusinessException.class, () -> seedService.seed(user(), classTreeId(), "A17", null, Map.of("stdDate", "2026-10-29")));
        assertThrows(BusinessException.class, () -> seedService.seed(user(), classTreeId(), "A17", GROUP, Map.of()));
    }

    @Test
    void 월_상신_기록은_있으면_지우고_새로_넣는다() {
        BizRelateApprService service = new BizRelateApprService(relateMapper);
        long first = service.insertDataYm(user(), "2099.01", "A35", APPR);
        assertThat(jdbc.queryForObject("select count(*) from biz05_relate_appr where biz05_company_id = 28000 and biz05_std_ym = '2099.01' and biz05_link_cd = 'A35'", Integer.class)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select biz05_appr_id from biz05_relate_appr where biz05_relate_appr_id = ?", Long.class, first)).isEqualTo(APPR);
        long second = service.insertDataYm(user(), "2099.01", "A35", APPR);
        assertThat(second).isNotEqualTo(first);
        assertThat(jdbc.queryForObject("select count(*) from biz05_relate_appr where biz05_company_id = 28000 and biz05_std_ym = '2099.01' and biz05_link_cd = 'A35'", Integer.class)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select count(*) from biz05_relate_appr where biz05_relate_appr_id = ?", Integer.class, first)).isZero();
    }
}
