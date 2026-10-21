package kr.co.kfs.asseterp.biz.flt.service;

import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

/**
 * 임직원매매 조회 화면의 엑셀 다운로드 — AS-IS는 RD 리포트 서버(Sys99_Print.insertRd* + RDUtil)에 맡겼다.
 * RD 서버가 없으므로 조회 결과를 그리드 열 순서로 xlsx에 쓴다(회사규정 BbsCompanyRuleService.download와 같은 방식).
 */
final class FltExcelWriter {

    private FltExcelWriter() {
    }

    /** 첫 줄은 제목, 다음 줄부터 값. 숫자(Number)는 숫자 칸, 그 밖은 글자 칸(null은 빈 칸) */
    static byte[] write(String sheetName, List<String> headers, List<List<Object>> rows) {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet(sheetName);
            Row head = sheet.createRow(0);
            for (int i = 0; i < headers.size(); i++) {
                head.createCell(i).setCellValue(headers.get(i));
            }
            int r = 1;
            for (List<Object> values : rows) {
                Row row = sheet.createRow(r++);
                for (int i = 0; i < values.size(); i++) {
                    Object v = values.get(i);
                    if (v instanceof Number n) {
                        row.createCell(i).setCellValue(n.doubleValue());
                    } else if (v != null) {
                        row.createCell(i).setCellValue(v.toString());
                    }
                }
            }
            wb.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 파일을 만들 수 없습니다.");
        }
    }
}
