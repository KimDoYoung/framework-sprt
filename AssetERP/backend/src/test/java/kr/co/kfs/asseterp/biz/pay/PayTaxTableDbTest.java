package kr.co.kfs.asseterp.biz.pay;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayDeductTableRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayDeductTableSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayPersonDeductRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayPersonDeductSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PaySimpleTaxOtherRes;
import kr.co.kfs.asseterp.biz.pay.dto.PaySimpleTaxOtherSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PaySimpleTaxRes;
import kr.co.kfs.asseterp.biz.pay.service.PayDeductTableService;
import kr.co.kfs.asseterp.biz.pay.service.PayPersonDeductService;
import kr.co.kfs.asseterp.biz.pay.service.PaySimpleTaxService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockMultipartFile;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** E22 2단계(간이세액표·공제표·인적공제금액)의 쓰기를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({PaySimpleTaxService.class, PayDeductTableService.class, PayPersonDeductService.class})
class PayTaxTableDbTest {

    private static final LocalDate DATE = LocalDate.of(2099, 1, 1);

    @Autowired PaySimpleTaxService simpleTaxes;
    @Autowired PayDeductTableService deductTables;
    @Autowired PayPersonDeductService personDeducts;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal sysAdmin = UserPrincipal.builder().userId(-1L).companyId(0L).roles(List.of("ROLE_SYSADMIN")).build();
    private final UserPrincipal other = UserPrincipal.builder().userId(2L).companyId(1L).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 간이세액표_적용일_생성_저장_엑셀업로드_삭제() throws Exception {
        int dates = jdbc.queryForObject("select count(distinct pay23_start_date) from pay23_simple_tax_table_other", Integer.class);
        assertThat(simpleTaxes.searchDates()).hasSize(dates);

        simpleTaxes.createDate(sysAdmin, DATE);
        List<PaySimpleTaxOtherRes> other23 = simpleTaxes.searchOther(DATE);
        assertThat(other23).isNotEmpty();
        assertThat(simpleTaxes.searchDates()).hasSize(dates + 1);
        assertThat(simpleTaxes.searchDates().get(0).startDate()).isEqualTo(DATE);

        PaySimpleTaxOtherRes created = simpleTaxes.saveOther(sysAdmin,
                List.of(new PaySimpleTaxOtherSaveReq(-1L, DATE, 9_999_999L, 99_999_999L, 1.5, 2.5, 100L, "시험"))).get(0);
        assertThat(created.simpleTaxTableOtherId()).isPositive();
        PaySimpleTaxOtherRes updated = simpleTaxes.saveOther(sysAdmin,
                List.of(new PaySimpleTaxOtherSaveReq(created.simpleTaxTableOtherId(), DATE, 9_999_999L, 99_999_999L, 3.25, 2.5, 100L, null))).get(0);
        assertThat(updated.rate1()).isEqualTo(3.25);
        assertThat(updated.note()).isNull();
        assertThatThrownBy(() -> simpleTaxes.saveOther(sysAdmin, List.of(new PaySimpleTaxOtherSaveReq(-1L, DATE, null, 1L, null, null, null, null))))
                .isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> simpleTaxes.saveOther(other, List.of(new PaySimpleTaxOtherSaveReq(-1L, DATE, 1L, 2L, null, null, null, null))))
                .isInstanceOf(BusinessException.class);
        assertThat(simpleTaxes.deleteOther(sysAdmin, List.of(created.simpleTaxTableOtherId()))).isEqualTo(1);

        // 엑셀업로드: 머리글 없이 첫 행부터 (이상·미만·공제대상가족수 1~11)
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (XSSFWorkbook wb = new XSSFWorkbook()) {
            Sheet sheet = wb.createSheet();
            for (int r = 0; r < 3; r++) {
                Row row = sheet.createRow(r);
                row.createCell(0).setCellValue(1000 + r * 10);
                row.createCell(1).setCellValue("1,0" + (10 + r * 10));
                for (int c = 2; c <= 12; c++) row.createCell(c).setCellValue(c * 100);
            }
            wb.write(out);
        }
        MockMultipartFile file = new MockMultipartFile("excelUpload", "a.xlsx", "application/octet-stream", out.toByteArray());
        assertThat(simpleTaxes.uploadExcel(sysAdmin, DATE, file)).isEqualTo(3);
        List<PaySimpleTaxRes> rows = simpleTaxes.search(DATE, null);
        assertThat(rows).hasSize(3);
        assertThat(rows.get(0).fromAmt()).isEqualTo(1000L);
        assertThat(rows.get(0).toAmt()).isEqualTo(1010L);
        assertThat(rows.get(0).deductCnt11()).isEqualTo(1200L);
        assertThat(simpleTaxes.search(DATE, 1015L)).hasSize(1);
        assertThat(simpleTaxes.search(DATE, 1015L).get(0).fromAmt()).isEqualTo(1010L);
        assertThatThrownBy(() -> simpleTaxes.uploadExcel(other, DATE, file)).isInstanceOf(BusinessException.class);

        // 업로드 전 비우기와 적용일 삭제(두 표 모두)
        assertThat(simpleTaxes.deleteTable(sysAdmin, DATE)).isEqualTo(3);
        simpleTaxes.uploadExcel(sysAdmin, DATE, file);
        assertThat(simpleTaxes.deleteDate(sysAdmin, DATE)).isEqualTo(other23.size());
        assertThat(simpleTaxes.search(DATE, null)).isEmpty();
        assertThat(simpleTaxes.searchOther(DATE)).isEmpty();
        assertThatThrownBy(() -> simpleTaxes.deleteDate(other, DATE)).isInstanceOf(BusinessException.class);
    }

    @Test
    void 공제표_적용일_생성_공제한도_저장_삭제() {
        int dates = jdbc.queryForObject("select count(distinct pay24_start_date) from pay24_deduct_table", Integer.class);
        assertThat(deductTables.searchDates()).hasSize(dates);

        deductTables.createDate(sysAdmin, DATE);
        assertThat(deductTables.searchDates()).hasSize(dates + 1);
        // 직전 적용일의 한도와 구간이 복사된다
        long limit = deductTables.searchLimit(DATE);
        int tableRows = deductTables.search(DATE).size();
        assertThat(limit).isGreaterThanOrEqualTo(0L);

        PayDeductTableRes created = deductTables.save(sysAdmin, List.of(new PayDeductTableSaveReq(-1L, DATE, 1L, 2L, 3L, 4.5, "시험"))).get(0);
        assertThat(created.dataCode()).isEqualTo("2");
        assertThat(deductTables.search(DATE)).hasSize(tableRows + 1);
        PayDeductTableRes updated = deductTables.save(sysAdmin, List.of(new PayDeductTableSaveReq(created.deductTableId(), DATE, 1L, 2L, 30L, 4.5, null))).get(0);
        assertThat(updated.deductAmt()).isEqualTo(30L);

        assertThat(deductTables.saveLimit(sysAdmin, DATE, 777L)).isEqualTo(1);
        assertThat(deductTables.searchLimit(DATE)).isEqualTo(777L);
        assertThatThrownBy(() -> deductTables.save(other, List.of(new PayDeductTableSaveReq(-1L, DATE, 1L, 2L, 3L, 4.5, null)))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> deductTables.saveLimit(other, DATE, 1L)).isInstanceOf(BusinessException.class);

        assertThat(deductTables.delete(sysAdmin, List.of(created.deductTableId()))).isEqualTo(1);
        assertThat(deductTables.deleteDate(sysAdmin, DATE)).isPositive();
        assertThat(deductTables.search(DATE)).isEmpty();
        assertThat(deductTables.searchLimit(DATE)).isZero();
    }

    @Test
    void 인적공제금액_적용일_생성_저장_삭제() {
        int dates = jdbc.queryForObject("select count(distinct pay25_start_date) from pay25_person_deduct", Integer.class);
        assertThat(personDeducts.searchDates()).hasSize(dates);

        personDeducts.createDate(sysAdmin, DATE);
        assertThat(personDeducts.searchDates()).hasSize(dates + 1);
        int rows = personDeducts.search(DATE).size();
        assertThat(rows).isPositive();
        assertThat(personDeducts.search(DATE).get(0).personDeductName()).isNotBlank();

        PayPersonDeductRes created = personDeducts.save(sysAdmin, List.of(new PayPersonDeductSaveReq(-1L, DATE, "2", 1_500_000L, "시험"))).get(0);
        assertThat(created.personDeductId()).isPositive();
        assertThat(created.personDeductName()).isNotBlank();
        PayPersonDeductRes updated = personDeducts.save(sysAdmin, List.of(new PayPersonDeductSaveReq(created.personDeductId(), DATE, "3", 2_000_000L, null))).get(0);
        assertThat(updated.personDeductCode()).isEqualTo("3");
        assertThat(updated.deductAmt()).isEqualTo(2_000_000L);

        assertThatThrownBy(() -> personDeducts.save(sysAdmin, List.of(new PayPersonDeductSaveReq(-1L, DATE, null, 1L, null)))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> personDeducts.save(other, List.of(new PayPersonDeductSaveReq(-1L, DATE, "1", 1L, null)))).isInstanceOf(BusinessException.class);

        assertThat(personDeducts.delete(sysAdmin, List.of(created.personDeductId()))).isEqualTo(1);
        assertThat(personDeducts.deleteDate(sysAdmin, DATE)).isEqualTo(rows);
        assertThat(personDeducts.search(DATE)).isEmpty();
    }
}
