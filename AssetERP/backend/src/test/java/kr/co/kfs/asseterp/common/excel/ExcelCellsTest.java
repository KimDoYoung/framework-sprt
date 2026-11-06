package kr.co.kfs.asseterp.common.excel;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.fail;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;

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

    private static MockMultipartFile xlsx(int dataRows) throws Exception {
        try (XSSFWorkbook book = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = book.createSheet();
            sheet.createRow(0).createCell(0).setCellValue("제목행");
            for (int i = 1; i <= dataRows; i++) {
                sheet.createRow(i).createCell(0).setCellValue("값" + i);
            }
            book.write(out);
            return new MockMultipartFile("file", "a.xlsx", "application/octet-stream", out.toByteArray());
        }
    }

    @Test
    void forEachRow는_제목행을_빼고_2번째_행부터_센다() throws Exception {
        List<Integer> seen = new ArrayList<>();
        int count = ExcelCells.forEachRow(xlsx(3), (book, r, i) -> seen.add(i));
        assertThat(count).isEqualTo(3);
        assertThat(seen).containsExactly(1, 2, 3);
        assertThat(ExcelCells.forEachRow(xlsx(0), (book, r, i) -> fail("부르면 안 됨"))).isZero();
    }

    @Test
    void forEachRow는_파일이_없거나_비면_거절한다() {
        assertThatThrownBy(() -> ExcelCells.forEachRow(null, (book, r, i) -> { }))
                .isInstanceOf(BusinessException.class).hasMessage("등록할 파일이 전달되지 않았습니다.");
        assertThatThrownBy(() -> ExcelCells.forEachRow(new MockMultipartFile("file", new byte[0]), (book, r, i) -> { }))
                .isInstanceOf(BusinessException.class).hasMessage("등록할 파일이 전달되지 않았습니다.");
    }

    @Test
    void forEachRow는_업무_예외는_그대로_그_밖의_예외는_업무_예외로_바꾼다() throws Exception {
        BusinessException mine = new BusinessException(ErrorCode.INVALID_INPUT, "내 문구");
        assertThatThrownBy(() -> ExcelCells.forEachRow(xlsx(1), (book, r, i) -> { throw mine; })).isSameAs(mine);
        assertThatThrownBy(() -> ExcelCells.forEachRow(xlsx(1), (book, r, i) -> { throw new IllegalStateException("깨짐"); }))
                .isInstanceOf(BusinessException.class).hasMessage("깨짐").hasCauseInstanceOf(IllegalStateException.class);
        assertThatThrownBy(() -> ExcelCells.forEachRow(xlsx(1), (book, r, i) -> { throw new IllegalStateException(); }))
                .isInstanceOf(BusinessException.class).hasMessage("엑셀 파일을 읽을 수 없습니다.");
        assertThatThrownBy(() -> ExcelCells.forEachRow(new MockMultipartFile("file", new byte[] {1, 2, 3}), (book, r, i) -> { }))
                .isInstanceOf(BusinessException.class);  // 엑셀이 아닌 파일
    }

    @Test
    void 없는_템플릿은_업무_예외() {
        assertThatThrownBy(() -> ExcelCells.template("excel/없는파일.xlsx")).isInstanceOf(BusinessException.class)
                .hasMessage("엑셀 템플릿을 읽을 수 없습니다.");
    }
}
