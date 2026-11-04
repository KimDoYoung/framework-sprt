package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.emp.dto.TransInfoRes;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/** SED01 ExcelDownload empList — 머리글 16열·값 변환(임원/✓/날짜/빈칸)이 AS-IS getEmpList와 같은지 */
class EmpTransInfoExcelWriterTest {

    @Test
    void 머리글과_값이_원본과_같다() throws Exception {
        TransInfoRes full = new TransInfoRes(1L, 2L, null, "100", "채용", "10", "정규직", "300", "과장", "250", "팀장", 3L, "전산1팀", "IT본부-전산1팀",
                "true", LocalDateTime.of(2027, 1, 31, 0, 0), "123", "홍길동", null, null, null, null, null,
                LocalDate.of(2020, 3, 2), "2026-05-01", "a@b.c", null, "1234", "010-1111-2222", null, "true",
                LocalDateTime.of(1990, 7, 8, 0, 0), "남");
        TransInfoRes empty = new TransInfoRes(4L, 5L, null, "100", null, null, null, null, null, null, null, null, null, null,
                "false", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "false", null, null);

        byte[] bytes = EmpTransInfoExcelWriter.write(List.of(full, empty));

        try (XSSFWorkbook wb = new XSSFWorkbook(new ByteArrayInputStream(bytes))) {
            Sheet s = wb.getSheet("sheet1");
            assertThat(s).isNotNull();
            assertThat(s.getRow(0).getLastCellNum()).isEqualTo((short) 16);
            assertThat(s.getRow(0).getCell(0).getStringCellValue()).isEqualTo("본부(부서)");
            assertThat(s.getRow(0).getCell(6).getStringCellValue()).isEqualTo("사원구분");
            assertThat(s.getRow(0).getCell(15).getStringCellValue()).isEqualTo("성별");
            assertThat(s.getColumnWidth(0)).isEqualTo(7000);
            assertThat(s.getColumnWidth(15)).isEqualTo(2000);

            assertThat(cells(s, 1)).containsExactly("IT본부-전산1팀", "홍길동", "123", "임원", "과장", "팀장", "정규직", "✓",
                    "2020-03-02", "2026-05-01", "2027-01-31", "1234", "010-1111-2222", "a@b.c", "1990-07-08", "남");
            assertThat(cells(s, 2)).containsOnly("");
            assertThat(s.getLastRowNum()).isEqualTo(2);
        }
    }

    private static List<String> cells(Sheet s, int row) {
        return java.util.stream.IntStream.range(0, 16).mapToObj(i -> s.getRow(row).getCell(i).getStringCellValue()).toList();
    }
}
