package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalDate;
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
import kr.co.kfs.asseterp.biz.apr.service.link.FundPriceModiLinkSeedProvider;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V20 A75~A77 기준가 정정 보고 결재창 제목·본문을 asseterpdb에서 돌리고 롤백한다(03 원칙 2). 시험 행은 트랜잭션 안에서만 만든다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprLinkSeedService.class, FundPriceModiLinkSeedProvider.class})
class AprFundPriceModiLinkSeedDbTest {

    /** 보고서구분 2(변경 발생 보고서) 실데이터 한 건 */
    private static final long EXISTING = 202609039862035L;
    private static final long TEST_1 = 990000000000001L;
    private static final long TEST_2 = 990000000000002L;
    private static final long APPR = 202609229873969L;

    @Autowired AprLinkSeedService seedService;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private Long classTreeId() {
        return jdbc.queryForObject("select apr01_class_tree_id from apr01_appr where apr01_appr_id = ?", Long.class, APPR);
    }

    private void insert(long id, String type, String corp, String fund, String modi, String file) {
        jdbc.update("insert into biz60_fund_price_modi (biz60_fund_price_modi_id, biz60_company_id, biz60_modi_date, biz60_report_type, biz60_am_corp_nm, biz60_fund_nm,"
                + " biz60_price_std_date, biz60_fund_close_yn, biz60_bef_price, biz60_aft_price, biz60_ksd_notice_yn, biz60_kofia_notice_yn, biz60_cmps_amt, biz60_modi_reason)"
                + " values (?, 28000, ?::date, ?, ?, ?, ?::date, 'false', 1000.5, 1234.567, 'true', 'false', 2500000, '사유')", id, modi, type, corp, fund, modi);
        if (file != null) {
            jdbc.update("insert into sys10_file (sys10_file_id, sys10_parent_id, sys10_file_nm, sys10_reg_date, sys10_server_path) values (?, ?, ?, now(), '/test')", id, id, file);
        }
    }

    @Test
    void 변경_발생_보고서_제목과_본문을_만든다() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A76", EXISTING);
        String corp = jdbc.queryForObject("select biz60_am_corp_nm from biz60_fund_price_modi where biz60_fund_price_modi_id = ?", String.class, EXISTING);
        LocalDate modi = jdbc.queryForObject("select biz60_modi_date from biz60_fund_price_modi where biz60_fund_price_modi_id = ?", LocalDate.class, EXISTING);
        assertThat(res.title()).isEqualTo(corp + " 기준가 정정의 건");
        assertThat(res.titleReadOnly()).isTrue();
        assertThat(res.saveVisible()).isFalse();
        assertThat(res.effectDate()).isEqualTo(modi);
        assertThat(res.content()).contains("기준가격 변경 발생 보고서").doesNotContain("재발 방지 대책").contains("기준가 변경 공시 유무")
                .contains("&nbsp;2026.09.02&nbsp;").contains("231,221").endsWith("</tbody></table>");
    }

    @Test
    void 오류_발생_보고서는_재발_방지_대책과_배상금액이_있다() {
        insert(TEST_1, "1", "시험운용사", "시험펀드", "2026-09-10", "a.pdf");
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A75", TEST_1);
        assertThat(res.title()).isEqualTo("시험운용사 기준가 정정의 건");
        assertThat(res.content()).contains("기준가격 오류 발생 보고서").contains("재발 방지 대책").contains("배상금액").contains("2,500,000")
                .contains("1,000.5").contains("1,234.57").contains("234.07").contains("a.pdf").contains("N").contains("Y");
    }

    @Test
    void 첨부가_없으면_없음() {
        insert(TEST_1, "1", "시험운용사", "시험펀드", "2026-09-10", null);
        assertThat(seedService.seed(user(), classTreeId(), "A75", TEST_1).content()).contains("없음");
    }

    @Test
    void 월보고는_제목을_고칠_수_있고_행마다_한_줄() {
        insert(TEST_1, "1", "A운용", "A펀드", "2026-09-10", null);
        insert(TEST_2, "2", "B운용", "B펀드", "2026-09-20", null);
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A77", null, Map.of("ids", TEST_1 + "," + TEST_2));
        assertThat(res.title()).isEqualTo("2026년 09월 기준가 정정 내역 보고");
        assertThat(res.titleReadOnly()).isFalse();
        assertThat(res.saveVisible()).isFalse();
        assertThat(res.content()).contains("2026년 09월 기준가 정정 내역을 다음과 같이 보고합니다.").contains("1. 기준가 변경 내역 총 2건")
                .contains("A운용").contains("B펀드").contains("&nbsp;2026.09.20&nbsp;");
    }

    @Test
    void 없는_행은_열_수_없다() {
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A75", -1L));
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A75", null));
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A77", null, Map.of()));
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A77", null, Map.of("ids", "-1")));
    }
}
