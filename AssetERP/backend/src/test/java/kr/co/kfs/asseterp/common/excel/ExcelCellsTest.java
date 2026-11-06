package kr.co.kfs.asseterp.common.excel;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import kr.co.kfs.asseterp.common.error.BusinessException;

/** AS-IS ExcelUpload getXxxCellData 동작 (화면마다 복사돼 있던 본문을 모은 것) */
class ExcelCellsTest {

    private final XSSFWorkbook wb = new XSSFWorkbook();
    private final Row row = wb.createSheet().createRow(0);
    private int col;

    @AfterEach
    void close() throws Exception {
        wb.close();
    }

    private Cell num(double v) {
        Cell c = row.createCell(col++);
        c.setCellValue(v);
        return c;
    }

    private Cell str(String v) {
        Cell c = row.createCell(col++);
        c.setCellValue(v);
        return c;
    }

    @Test
    void 빈_칸은_모두_null() {
        assertThat(ExcelCells.string(null)).isNull();
        assertThat(ExcelCells.date(null)).isNull();
        assertThat(ExcelCells.longValue(null)).isNull();
        assertThat(ExcelCells.doubleValue(null)).isNull();
    }

    @Test
    void 글자_정수는_정수_글자_소수는_소수_글자_글자는_trim() {
        assertThat(ExcelCells.string(num(12.0))).isEqualTo("12");
        assertThat(ExcelCells.string(num(1.5))).isEqualTo("1.5");
        assertThat(ExcelCells.string(str("  abc "))).isEqualTo("abc");
    }

    @Test
    void 날짜_글자는_점과_하이픈을_빼고_yyyyMMdd_못_읽으면_null() {
        assertThat(ExcelCells.date(str("2026.11.06"))).isEqualTo(LocalDate.of(2026, 11, 6));
        assertThat(ExcelCells.date(str("2026-11-06"))).isEqualTo(LocalDate.of(2026, 11, 6));
        assertThat(ExcelCells.date(str("날짜아님"))).isNull();
        Cell d = row.createCell(col++);
        d.setCellValue(Date.from(LocalDate.of(2025, 1, 2).atStartOfDay(ZoneId.systemDefault()).toInstant()));
        assertThat(ExcelCells.date(d)).isEqualTo(LocalDate.of(2025, 1, 2));
    }

    @Test
    void 정수_숫자는_버림_글자는_쉼표를_빼고_정수만_수식은_계산값() {
        assertThat(ExcelCells.longValue(num(12.9))).isEqualTo(12L);
        assertThat(ExcelCells.longValue(str("1,234"))).isEqualTo(1234L);
        assertThat(ExcelCells.longValue(str("-5"))).isEqualTo(-5L);
        assertThat(ExcelCells.longValue(str("1.5"))).isNull();
        Cell f = row.createCell(col++);
        f.setCellFormula("2+3");
        wb.getCreationHelper().createFormulaEvaluator().evaluateFormulaCell(f);
        assertThat(ExcelCells.longValue(f)).isEqualTo(5L);
    }

    @Test
    void 실수_빈_글자는_null_못_읽는_글자는_예외() {
        assertThat(ExcelCells.doubleValue(num(1.25))).isEqualTo(1.25);
        assertThat(ExcelCells.doubleValue(str("2.5"))).isEqualTo(2.5);
        assertThat(ExcelCells.doubleValue(str(""))).isNull();
        assertThatThrownBy(() -> ExcelCells.doubleValue(str("abc"))).isInstanceOf(NumberFormatException.class);
    }

    @Test
    void 없는_템플릿은_업무_예외() {
        assertThatThrownBy(() -> ExcelCells.template("excel/없는파일.xlsx")).isInstanceOf(BusinessException.class)
                .hasMessage("엑셀 템플릿을 읽을 수 없습니다.");
    }
}
