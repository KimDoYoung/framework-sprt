package kr.co.kfs.asseterp.biz.pay;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayFormulaRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayFormulaSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayItemRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayItemSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayRateRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayRateSaveReq;
import kr.co.kfs.asseterp.biz.pay.service.PayFormulaService;
import kr.co.kfs.asseterp.biz.pay.service.PayItemService;
import kr.co.kfs.asseterp.biz.pay.service.PayRateService;
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

/** E22 1단계(급여항목·율관리·임금계산방법)의 쓰기를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({PayItemService.class, PayRateService.class, PayFormulaService.class})
class PayBasicDbTest {

    @Autowired PayItemService items;
    @Autowired PayRateService rates;
    @Autowired PayFormulaService formulas;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal sysAdmin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private final UserPrincipal other = UserPrincipal.builder().userId(2L).companyId(1L).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 급여항목_조회_등록_수정_삭제() {
        int all = jdbc.queryForObject("select count(*) from pay20_item", Integer.class);
        assertThat(items.search("%", "")).hasSize(all);
        assertThat(items.lookup("")).hasSize(all);

        PayItemRes created = items.save(sysAdmin, List.of(new PayItemSaveReq(-1L, "1", "ZZ9", "시험항목", "1", 99L, "true"))).get(0);
        assertThat(created.itemId()).isPositive();
        assertThat(created.itemTypeName()).isNotBlank();
        assertThat(items.search("1", "시험항목")).hasSize(1);

        PayItemRes updated = items.save(sysAdmin, List.of(new PayItemSaveReq(created.itemId(), "2", "ZZ9", "시험항목2", "2", 98L, "false"))).get(0);
        assertThat(updated.itemId()).isEqualTo(created.itemId());
        assertThat(updated.itemType()).isEqualTo("2");
        assertThat(updated.useYn()).isEqualTo("false");
        assertThat(items.search("1", "시험항목")).isEmpty();

        assertThatThrownBy(() -> items.save(sysAdmin, List.of(new PayItemSaveReq(-1L, null, "Z", "x", null, 1L, "true")))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> items.save(other, List.of(new PayItemSaveReq(-1L, "1", "Z", "x", null, 1L, "true")))).isInstanceOf(BusinessException.class);

        assertThat(items.delete(sysAdmin, List.of(created.itemId()))).isEqualTo(1);
        assertThat(items.delete(sysAdmin, List.of())).isZero();
    }

    @Test
    void 율관리_조회_등록_수정_삭제() {
        int all = jdbc.queryForObject("select count(*) from pay21_rate", Integer.class);
        assertThat(rates.search("%")).hasSize(all);

        PayRateRes created = rates.save(sysAdmin, List.of(new PayRateSaveReq(-1L, "10", LocalDate.of(2099, 1, 1), 1.5, "시험"))).get(0);
        assertThat(created.rateId()).isPositive();
        assertThat(created.applyRate()).isEqualTo(1.5);

        PayRateRes updated = rates.save(sysAdmin, List.of(new PayRateSaveReq(created.rateId(), "10", LocalDate.of(2099, 1, 1), 2.25, null))).get(0);
        assertThat(updated.rateId()).isEqualTo(created.rateId());
        assertThat(updated.applyRate()).isEqualTo(2.25);

        assertThatThrownBy(() -> rates.save(sysAdmin, List.of(new PayRateSaveReq(-1L, "10", null, 1.0, null)))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> rates.save(other, List.of(new PayRateSaveReq(-1L, "10", LocalDate.of(2099, 1, 1), 1.0, null)))).isInstanceOf(BusinessException.class);

        assertThat(rates.delete(sysAdmin, List.of(created.rateId()))).isEqualTo(1);
    }

    @Test
    void 임금계산방법_적용일_생성_저장_삭제_기초데이터생성() {
        int adminDates = formulas.searchDates(sysAdmin, null).size();
        LocalDate newDate = LocalDate.of(2099, 12, 31);

        // 적용일 생성: 가장 최근 적용일의 행을 복사(비고는 옮기지 않는다)
        formulas.createDate(sysAdmin, newDate);
        assertThat(formulas.searchDates(sysAdmin, null)).hasSize(adminDates + 1);
        List<PayFormulaRes> copied = formulas.searchByDate(sysAdmin, null, newDate);
        assertThat(copied).isNotEmpty();
        assertThat(copied).allSatisfy(r -> assertThat(r.note()).isNull());

        // 저장: 산출식·비고 수정, 행 추가(항목코드는 copied 중 하나가 아닌 새 항목)
        PayFormulaRes first = copied.get(0);
        PayFormulaRes edited = formulas.save(sysAdmin, List.of(new PayFormulaSaveReq(first.formulaId(), newDate, first.itemCd(), "시험산식", "시험비고"))).get(0);
        assertThat(edited.formulaForm()).isEqualTo("시험산식");
        assertThat(edited.note()).isEqualTo("시험비고");
        assertThat(edited.itemName()).isEqualTo(first.itemName());

        // 기초데이터생성: 고객사(1)에 관리자 회사 적용일의 행을 복사
        int source = formulas.basicDataCreate(sysAdmin, 1L, newDate);
        assertThat(source).isEqualTo(copied.size());
        assertThat(formulas.searchByDate(sysAdmin, 1L, newDate)).hasSize(copied.size());
        // 다시 만들면 기존 적용일을 지우고 다시 복사 — 건수가 불어나지 않는다
        formulas.basicDataCreate(sysAdmin, 1L, newDate);
        assertThat(formulas.searchByDate(sysAdmin, 1L, newDate)).hasSize(copied.size());

        assertThat(formulas.deleteDate(sysAdmin, newDate)).isEqualTo(copied.size());
        assertThat(formulas.searchByDate(sysAdmin, null, newDate)).isEmpty();

        assertThatThrownBy(() -> formulas.createDate(other, newDate)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> formulas.searchDates(other, 0L)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> formulas.basicDataCreate(sysAdmin, null, newDate)).isInstanceOf(BusinessException.class);
    }
}
