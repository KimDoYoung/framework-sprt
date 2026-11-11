package kr.co.kfs.asseterp.biz.ast;

import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeeMonthRes;
import kr.co.kfs.asseterp.biz.ast.service.AstBookFundFeeService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * #1401 펀드보수현황 [엑셀다운로드] (AS-IS Sys99_Print.insertRdBookFundMngFee + RD Ast30_Rd_FundMngFee, 원본 2026-11-02 CH-0110·0152).
 * 조회와 같은 행이 같은 순서·같은 열(펀드코드·펀드명·전월 잔액·당월 발생액·당월 인출액·당월 잔액)로 xlsx에 들어가는지 본다.
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(AstBookFundFeeService.class)
class AstBookFundFeeExcelDbTest {

    private static final LocalDate STD = LocalDate.of(2026, 4, 17);

    @Autowired AstBookFundFeeService service;

    private final UserPrincipal user = UserPrincipal.builder().userId(29049L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();

    @Test
    void 엑셀은_조회결과와_같은_행과_열이다() throws Exception {
        List<BookFundFeeMonthRes> rows = service.searchByStdDate(user, STD, "");
        assertThat(rows).isNotEmpty();

        byte[] xlsx = service.downloadByStdDate(user, STD, "");
        try (Workbook wb = new XSSFWorkbook(new ByteArrayInputStream(xlsx))) {
            Sheet sheet = wb.getSheetAt(0);
            Row header = sheet.getRow(0);
            assertThat(header.getCell(0).getStringCellValue()).isEqualTo("펀드코드");
            assertThat(header.getCell(5).getStringCellValue()).isEqualTo("당월 잔액");
            assertThat(sheet.getLastRowNum()).isEqualTo(rows.size());

            for (int i = 0; i < rows.size(); i++) {
                BookFundFeeMonthRes m = rows.get(i);
                Row row = sheet.getRow(i + 1);
                assertThat(row.getCell(0).getStringCellValue()).isEqualTo(m.fundCode());
                assertThat(row.getCell(1).getStringCellValue()).isEqualTo(m.fundName() == null ? "" : m.fundName());
                assertThat((long) row.getCell(5).getNumericCellValue()).isEqualTo(m.fee() == null ? 0L : m.fee());
            }
        }
    }

    @Test
    void 검색어가_있으면_엑셀도_걸러진다() throws Exception {
        String code = service.searchByStdDate(user, STD, "").get(0).fundCode();
        List<BookFundFeeMonthRes> rows = service.searchByStdDate(user, STD, code);

        byte[] xlsx = service.downloadByStdDate(user, STD, code);
        try (Workbook wb = new XSSFWorkbook(new ByteArrayInputStream(xlsx))) {
            assertThat(wb.getSheetAt(0).getLastRowNum()).isEqualTo(rows.size());
        }
    }
}
