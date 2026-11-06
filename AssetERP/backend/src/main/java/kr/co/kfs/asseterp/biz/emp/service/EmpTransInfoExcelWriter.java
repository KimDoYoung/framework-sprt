package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.emp.dto.TransInfoRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * AS-IS ExcelDownload.getEmpList L76-248 (actionCode=empList): 시트 "sheet1", 머리글 16열(이름·폭 그대로, 발령구분·최근발령일은 원본도 주석),
 * 모든 칸 얇은 테두리·세로 가운데·줄바꿈. .xls → .xlsx (W06 선례).
 */
final class EmpTransInfoExcelWriter {

    private static final String[] HEADERS = {"본부(부서)", "성명", "사번", "등기임원", "직위", "직책", "사원구분", "전문인력",
            "입사일", "퇴사일", "계약만료일", "내선번호", "휴대폰", "이메일", "생년월일", "성별"};
    private static final int[] WIDTHS = {7000, 3000, 3000, 3000, 3000, 4000, 3000, 3000, 4000, 4000, 4000, 6000, 6000, 6000, 3000, 2000};

    private EmpTransInfoExcelWriter() {
    }

    static byte[] write(List<TransInfoRes> list) {
        try (XSSFWorkbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("sheet1");
            CellStyle body = wb.createCellStyle();
            body.setVerticalAlignment(VerticalAlignment.CENTER);
            body.setBorderBottom(BorderStyle.THIN);
            body.setBorderLeft(BorderStyle.THIN);
            body.setBorderRight(BorderStyle.THIN);
            body.setBorderTop(BorderStyle.THIN);
            body.setWrapText(true);

            Row header = sheet.createRow(0);
            for (int i = 0; i < HEADERS.length; i++) {
                sheet.setColumnWidth(i, WIDTHS[i]);
                header.createCell(i).setCellValue(HEADERS[i]);
                header.getCell(i).setCellStyle(body);
            }
            int r = 1;
            for (TransInfoRes t : list) {
                String[] cols = {
                        t.parentFullNm(),
                        t.korNm(),
                        t.empNo(),
                        "true".equals(t.officerYn()) ? "임원" : "",
                        t.posNm(),
                        t.titleNm(),
                        t.kindNm(),
                        "true".equals(t.financeProYn()) ? "✓" : "",
                        date(t.hireDate()),
                        t.retireDate() == null ? "" : t.retireDate(),
                        date(t.expiryDate()),
                        t.officeDetail(),
                        t.mobileTelNo(),
                        t.emailAddr(),
                        date(t.birthday()),
                        t.genderNm()
                };
                Row row = sheet.createRow(r++);
                for (int c = 0; c < cols.length; c++) {
                    row.createCell(c).setCellValue(cols[c] == null ? "" : cols[c]);
                    row.getCell(c).setCellStyle(body);
                }
            }
            wb.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 파일을 만들 수 없습니다.", e);
        }
    }

    private static String date(LocalDate d) {
        return d == null ? "" : d.toString();
    }

    private static String date(LocalDateTime d) {
        return d == null ? "" : d.toLocalDate().toString();
    }
}
