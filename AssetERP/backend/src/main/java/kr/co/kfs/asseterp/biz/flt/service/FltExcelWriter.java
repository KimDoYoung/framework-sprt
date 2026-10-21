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

    /** 시트 하나: 시트 이름, 첫 줄(제목), 값 */
    record SheetData(String name, List<String> headers, List<List<Object>> rows) {
    }

    /** 첫 줄은 제목, 다음 줄부터 값. 숫자(Number)는 숫자 칸, 그 밖은 글자 칸(null은 빈 칸) */
    static byte[] write(String sheetName, List<String> headers, List<List<Object>> rows) {
        return write(List.of(new SheetData(sheetName, headers, rows)));
    }

    /** 시트가 여럿인 엑셀(J08 책임자보고 — RD 리포트가 한 문서에 세 구간을 담던 것) */
    static byte[] write(List<SheetData> sheets) {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            for (SheetData data : sheets) {
                Sheet sheet = wb.createSheet(data.name());
                Row head = sheet.createRow(0);
                for (int i = 0; i < data.headers().size(); i++) {
                    head.createCell(i).setCellValue(data.headers().get(i));
                }
                int r = 1;
                for (List<Object> values : data.rows()) {
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
            }
            wb.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 파일을 만들 수 없습니다.");
        }
    }
}
