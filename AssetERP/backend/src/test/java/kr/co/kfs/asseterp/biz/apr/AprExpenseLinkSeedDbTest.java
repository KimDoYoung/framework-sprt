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
import kr.co.kfs.asseterp.biz.apr.service.link.BookDepnLinkSeedProvider;
import kr.co.kfs.asseterp.biz.apr.service.link.ErpFeeChargeLinkSeedProvider;
import kr.co.kfs.asseterp.biz.apr.service.link.ExpenseLinkSeedProvider;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.mapper.PayExpenseMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V27 A63 지출결의서 · A64 자금집행결의서 · A65 비품관리대장 · A69 Asset-ERP 사용료청구 결재창 제목·본문과 문서 ID 기록을 asseterpdb에서 돌리고 롤백한다(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprLinkSeedService.class, ExpenseLinkSeedProvider.class, BookDepnLinkSeedProvider.class, ErpFeeChargeLinkSeedProvider.class})
class AprExpenseLinkSeedDbTest {

    /** 계좌이체(10) · 자금집행 있음 */
    private static final long EXP_A = 202609039861593L;
    private static final long EXP_B = 202609019856496L;
    /** 기타계좌(90) */
    private static final long EXP_C = 202609149872013L;
    private static final long APPR = 202609229873969L;
    private static final long CHARGE = 202605119702192L;

    @Autowired AprLinkSeedService seedService;
    @Autowired PayExpenseMapper payMapper;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user() {
        return UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private Long classTreeId() {
        return jdbc.queryForObject("select apr01_class_tree_id from apr01_appr where apr01_appr_id = ?", Long.class, APPR);
    }

    @Test
    void 지출결의서_한_건은_승인자_줄과_계좌번호를_넣는다() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A63", EXP_A, Map.of("ids", String.valueOf(EXP_A)));
        assertThat(res.title()).startsWith("지출결의서(").endsWith(")");
        assertThat(res.titleReadOnly()).isFalse();
        assertThat(res.saveVisible()).isFalse();
        assertThat(res.content()).contains("지 출 결 의 서").contains("- 발 생 자 :").contains("- 승 인 자 :").contains("4. 계좌번호").contains("5. 세부내역").contains("합 계");
        assertThat(res.effectDate().toString()).isEqualTo(jdbc.queryForObject("select pay50_occ_date::text from pay50_expense where pay50_expense_id = ?", String.class, EXP_A));
    }

    @Test
    void 지출결의서_기타계좌_한_건은_세부내역이_4번() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A63", EXP_C, Map.of("ids", String.valueOf(EXP_C)));
        assertThat(res.content()).contains("4. 세부내역").doesNotContain("4. 계좌번호");
    }

    @Test
    void 지출결의서_여러_건은_마지막_행_적요_외_N건_제목과_표() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A63", EXP_A, Map.of("ids", EXP_B + "," + EXP_A));
        String lastDesc = jdbc.queryForObject("select pay50_desc from pay50_expense where pay50_expense_id = ?", String.class, EXP_A);
        assertThat(res.title()).isEqualTo("지출결의서(" + lastDesc + " 외 1)");
        assertThat(res.content()).contains("1. 발생부서 :").contains("2. 계정과목 :").contains("No.").contains("4. 계좌번호");
        // 행 수: 머리 10 + 줄 2 + 합계 1 + (빈줄 + 계좌번호 제목 + 계좌 줄 2)
        assertThat(res.content().split("<tr>", -1).length - 1).isEqualTo(10 + 2 + 1 + 4);
    }

    @Test
    void 지출결의서_ID가_없거나_남의_회사면_열_수_없다() {
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A63", null, Map.of()));
        assertThrows(BusinessException.class, () -> seedService.seed(user(), 1L, "A63", null, Map.of("ids", "-1")));
        UserPrincipal other = UserPrincipal.builder().userId(1L).companyId(1L).name("x").roles(List.of("ROLE_USER")).build();
        assertThrows(BusinessException.class, () -> seedService.seed(other, 1L, "A63", null, Map.of("ids", String.valueOf(EXP_A))));
    }

    @Test
    void 자금집행결의서는_자금집행일_제목과_출금계좌_합계_표() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A64", null, Map.of("ids", String.valueOf(EXP_A)));
        String settle = jdbc.queryForObject("select pay50_settle_date::text from pay50_expense where pay50_expense_id = ?", String.class, EXP_A);
        assertThat(res.title()).isEqualTo("자금집행결의서-" + settle);
        assertThat(res.titleReadOnly()).isFalse();
        assertThat(res.content()).contains("자금집행결의서").contains("1. 지급일자 : " + settle).contains("2. 지급총액 : ₩").contains("출금계좌(").contains("전 체 합 계");
        // 지출결의서 상신문서가 연관문서 자동등록
        assertThat(res.relateApprs()).extracting("targetApprId").contains(jdbc.queryForObject("select pay50_expense_appr_id from pay50_expense where pay50_expense_id = ?", Long.class, EXP_A));
    }

    @Test
    void 비품관리대장은_기준일자_구분별_합계() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A65", null, Map.of("stdDate", "2025-06-30"));
        assertThat(res.title()).isEqualTo("비품대장_2025-06-30");
        assertThat(res.content()).contains("2025년 06월 30일 기준 비품내역입니다.").contains("합   계").contains("비품관리대장");
        assertThrows(BusinessException.class, () -> seedService.seed(user(), classTreeId(), "A65", null, Map.of("stdDate", "1900-01-01")));
        assertThrows(BusinessException.class, () -> seedService.seed(user(), classTreeId(), "A65", null, Map.of()));
    }

    @Test
    void ERP_사용료청구는_청구_행으로_제목_수신_시행일자_본문() {
        AprLinkSeedRes res = seedService.seed(user(), classTreeId(), "A69", CHARGE, Map.of());
        assertThat(res.title()).contains(" Asset ERP ").endsWith(" 청구서");
        assertThat(res.receiveName()).isNotBlank();
        assertThat(res.effectDate().toString()).isEqualTo("2026-06-16");
        assertThat(res.titleReadOnly()).isFalse();
        assertThat(res.content()).contains("다음과 같이 Asset ERP 사용료를 청구합니다.").contains("1. 사용기간 :").contains("AssetERP사용료").contains("3. 입금기한 :");
        assertThrows(BusinessException.class, () -> seedService.seed(user(), classTreeId(), "A69", null, Map.of()));
    }

    @Test
    void 결재_ID_기록은_로그인_회사_행만이고_첨부는_한_번만_연결() {
        assertThat(payMapper.updateExpenseApprId(28000L, EXP_A, 7L)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select pay50_expense_appr_id from pay50_expense where pay50_expense_id = ?", Long.class, EXP_A)).isEqualTo(7L);
        assertThat(payMapper.updateExpenseApprId(1L, EXP_A, 8L)).isZero();
        assertThat(payMapper.updateSettleApprId(28000L, EXP_A, 9L)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select pay50_settle_appr_id from pay50_expense where pay50_expense_id = ?", Long.class, EXP_A)).isEqualTo(9L);
        assertThat(payMapper.updateSettleApprId(1L, EXP_A, 10L)).isZero();

        List<Long> files = payMapper.selectExpenseFileIds(EXP_A);
        for (Long fileId : files) {
            assertThat(payMapper.countApprRelateFile(fileId, 7L)).isZero();
            payMapper.insertApprRelateFile(payMapper.selectNextId(), fileId, 7L);
            assertThat(payMapper.countApprRelateFile(fileId, 7L)).isEqualTo(1);
        }
    }
}
