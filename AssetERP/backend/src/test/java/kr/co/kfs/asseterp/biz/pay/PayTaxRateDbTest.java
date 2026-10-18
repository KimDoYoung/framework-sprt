package kr.co.kfs.asseterp.biz.pay;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayOtherSetupRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayOtherSetupSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxCalcRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxCalcSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxDeductLimitRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxDeductLimitSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxDeductRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxDeductSaveReq;
import kr.co.kfs.asseterp.biz.pay.service.PayOtherSetupService;
import kr.co.kfs.asseterp.biz.pay.service.PayTaxCalcService;
import kr.co.kfs.asseterp.biz.pay.service.PayTaxDeductService;
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

/** E22 3단계(과세표준 구간별 기본세율·근로소득 세액공제·기타설정)의 쓰기를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({PayTaxCalcService.class, PayTaxDeductService.class, PayOtherSetupService.class})
class PayTaxRateDbTest {

    private static final LocalDate DATE = LocalDate.of(2099, 1, 1);

    @Autowired PayTaxCalcService taxCalcs;
    @Autowired PayTaxDeductService taxDeducts;
    @Autowired PayOtherSetupService otherSetups;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal sysAdmin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private final UserPrincipal other = UserPrincipal.builder().userId(2L).companyId(1L).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 기본세율_적용일_생성_저장_삭제() {
        int dates = jdbc.queryForObject("select count(distinct pay26_start_date) from pay26_tax_calc_table", Integer.class);
        assertThat(taxCalcs.searchDates()).hasSize(dates);

        taxCalcs.createDate(sysAdmin, DATE);
        List<PayTaxCalcRes> copied = taxCalcs.search(DATE);
        assertThat(copied).isNotEmpty();
        assertThat(taxCalcs.searchDates()).hasSize(dates + 1);
        assertThat(taxCalcs.searchDates().get(0).startDate()).isEqualTo(DATE);

        PayTaxCalcRes created = taxCalcs.save(sysAdmin, List.of(new PayTaxCalcSaveReq(-1L, DATE, 9_999_999_999L, 99_999_999_999L, 100L, 1.5, "시험"))).get(0);
        assertThat(created.taxCalcTableId()).isPositive();
        PayTaxCalcRes updated = taxCalcs.save(sysAdmin, List.of(new PayTaxCalcSaveReq(created.taxCalcTableId(), DATE, 9_999_999_999L, 99_999_999_999L, 200L, 3.25, null))).get(0);
        assertThat(updated.basicTax()).isEqualTo(200L);
        assertThat(updated.rate()).isEqualTo(3.25);
        assertThat(updated.note()).isNull();
        assertThatThrownBy(() -> taxCalcs.save(sysAdmin, List.of(new PayTaxCalcSaveReq(-1L, DATE, null, 1L, null, null, null)))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> taxCalcs.save(other, List.of(new PayTaxCalcSaveReq(-1L, DATE, 1L, 2L, null, null, null)))).isInstanceOf(BusinessException.class);
        assertThat(taxCalcs.delete(sysAdmin, List.of(created.taxCalcTableId()))).isEqualTo(1);
        assertThat(taxCalcs.deleteDate(sysAdmin, DATE)).isEqualTo(copied.size());
        assertThat(taxCalcs.searchDates()).hasSize(dates);
    }

    @Test
    void 세액공제_세액공제한도_적용일_생성_저장_삭제() {
        int dates = jdbc.queryForObject("select count(distinct pay27_start_date) from pay27_tax_deduct_table", Integer.class);
        assertThat(taxDeducts.searchDates()).hasSize(dates);

        taxDeducts.createDate(sysAdmin, DATE);
        List<PayTaxDeductRes> copied = taxDeducts.search(DATE);
        List<PayTaxDeductLimitRes> copiedLimits = taxDeducts.searchLimits(DATE);
        assertThat(copied).isNotEmpty();
        assertThat(taxDeducts.searchDates().get(0).startDate()).isEqualTo(DATE);

        PayTaxDeductRes created = taxDeducts.save(sysAdmin, List.of(new PayTaxDeductSaveReq(-1L, DATE, 9_999_999_999L, 99_999_999_999L, 100L, 1.5, "시험"))).get(0);
        assertThat(created.taxDeductTableId()).isPositive();
        PayTaxDeductRes updated = taxDeducts.save(sysAdmin, List.of(new PayTaxDeductSaveReq(created.taxDeductTableId(), DATE, 9_999_999_999L, 99_999_999_999L, 200L, 2.5, null))).get(0);
        assertThat(updated.deductAmt()).isEqualTo(200L);
        assertThat(updated.rate()).isEqualTo(2.5);
        assertThatThrownBy(() -> taxDeducts.save(sysAdmin, List.of(new PayTaxDeductSaveReq(-1L, DATE, 1L, null, null, null, null)))).isInstanceOf(BusinessException.class);
        assertThat(taxDeducts.delete(sysAdmin, List.of(created.taxDeductTableId()))).isEqualTo(1);

        PayTaxDeductLimitRes limit = taxDeducts.saveLimits(sysAdmin, List.of(new PayTaxDeductLimitSaveReq(-1L, DATE, 9_999_999_999L, 99_999_999_999L, 10L, 20L, 1.5, "시험"))).get(0);
        assertThat(limit.taxDeductLimitId()).isPositive();
        PayTaxDeductLimitRes limitUpdated = taxDeducts.saveLimits(sysAdmin, List.of(new PayTaxDeductLimitSaveReq(limit.taxDeductLimitId(), DATE, 9_999_999_999L, 99_999_999_999L, 11L, 22L, 2.5, null))).get(0);
        assertThat(limitUpdated.minLimit()).isEqualTo(11L);
        assertThat(limitUpdated.maxLimit()).isEqualTo(22L);
        assertThatThrownBy(() -> taxDeducts.saveLimits(other, List.of(new PayTaxDeductLimitSaveReq(-1L, DATE, 1L, 2L, null, null, null, null)))).isInstanceOf(BusinessException.class);
        assertThat(taxDeducts.deleteLimits(sysAdmin, List.of(limit.taxDeductLimitId()))).isEqualTo(1);

        // 적용일 삭제는 세액공제와 한도를 같이 지운다
        assertThat(taxDeducts.deleteDate(sysAdmin, DATE)).isEqualTo(copied.size() + copiedLimits.size());
        assertThat(taxDeducts.searchDates()).hasSize(dates);
    }

    @Test
    void 기타설정_적용일_생성_저장_삭제() {
        int dates = jdbc.queryForObject("select count(distinct pay29_start_date) from pay29_other_setup", Integer.class);
        assertThat(otherSetups.searchDates()).hasSize(dates);

        otherSetups.createDate(sysAdmin, DATE);
        List<PayOtherSetupRes> copied = otherSetups.search(DATE);
        assertThat(copied).isNotEmpty();
        assertThat(otherSetups.searchDates().get(0).startDate()).isEqualTo(DATE);

        PayOtherSetupRes row = copied.get(0);
        PayOtherSetupRes updated = otherSetups.save(sysAdmin, List.of(new PayOtherSetupSaveReq(row.otherSetupId(), DATE, 6L, 7L, 1L, 2L, 3L, 4L, 5L, "시험"))).get(0);
        assertThat(updated.hiMaxDiv()).isEqualTo(6L);
        assertThat(updated.stdTaxDeduct()).isEqualTo(5L);
        assertThat(updated.note()).isEqualTo("시험");
        assertThatThrownBy(() -> otherSetups.save(other, List.of(new PayOtherSetupSaveReq(-1L, DATE, null, null, null, null, null, null, null, null)))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> otherSetups.createDate(other, DATE)).isInstanceOf(BusinessException.class);

        PayOtherSetupRes added = otherSetups.save(sysAdmin, List.of(new PayOtherSetupSaveReq(-1L, DATE, 9L, null, null, null, null, null, null, null))).get(0);
        assertThat(added.otherSetupId()).isPositive();
        assertThat(otherSetups.delete(sysAdmin, List.of(added.otherSetupId()))).isEqualTo(1);
        assertThat(otherSetups.deleteDate(sysAdmin, DATE)).isEqualTo(copied.size());
        assertThat(otherSetups.searchDates()).hasSize(dates);
    }
}
