package kr.co.kfs.asseterp.support;

import java.io.ByteArrayOutputStream;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.mock.web.MockMultipartFile;

/** 업로드 시험용 엑셀 파일 — 첫 행은 제목, 데이터는 2번째 행부터. 숫자는 숫자 칸, null 은 빈 칸(칸 없음), 나머지는 글자 칸 */
public final class XlsxFiles {

    private XlsxFiles() {
    }

    public static MockMultipartFile xlsx(Object[]... rows) {
        try (XSSFWorkbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet();
            sheet.createRow(0).createCell(0).setCellValue("제목행");
            for (int r = 0; r < rows.length; r++) {
                Row row = sheet.createRow(r + 1);
                for (int c = 0; c < rows[r].length; c++) {
                    Object v = rows[r][c];
                    if (v instanceof Number n) {
                        row.createCell(c).setCellValue(n.doubleValue());
                    } else if (v != null) {
                        row.createCell(c).setCellValue(v.toString());
                    }
                }
            }
            wb.write(out);
            return new MockMultipartFile("excelUpload", "upload.xlsx", "application/octet-stream", out.toByteArray());
        } catch (java.io.IOException e) {
            throw new IllegalStateException(e);
        }
    }

    /** 칸 값 배열을 한 줄로 쓰기 위한 줄임 */
    public static Object[] row(Object... cells) {
        return cells;
    }
}
