package kr.co.kfs.asseterp.biz.act.service;

import kr.co.kfs.asseterp.biz.act.dto.JournalAccountRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalSubRes;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.function.Function;

/**
 * 계정별원장 엑셀 (AS-IS ExcelDownload.getAct02List L663-1262, actionCode=act02List) — 계정마다 시트 하나, 월이 바뀔 때 [월 계]·[누 계] 줄.
 * AS-IS는 .xls(HSSF)였고 TOBE는 .xlsx다. 시트 이름은 엑셀 규칙(31자, 특수문자 제외)에 맞춰 줄였다.
 */
final class ActJournalSubExcelWriter {

    private static final DateTimeFormatter YMD = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter YM = DateTimeFormatter.ofPattern("yyyyMM");
    private static final String[] HEADERS = {"분개일자", "분개번호", "거래유형", "적요", "거래처", "차변금액", "대변금액", "잔액", "관리계좌"};
    private static final int[] WIDTHS = {3000, 3000, 10000, 14000, 8000, 4000, 4000, 4000, 4000};

    private ActJournalSubExcelWriter() {
    }

    /** sheets: 계정마다 (계정코드·계정과목, 그 계정의 원장 줄) */
    static byte[] write(LocalDate startDate, LocalDate closeDate, List<JournalAccountRes> accounts,
                        Function<JournalAccountRes, List<JournalSubRes>> loader) throws IOException {
        try (XSSFWorkbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            CellStyle header = wb.createCellStyle();
            header.setVerticalAlignment(VerticalAlignment.CENTER);
            header.setAlignment(HorizontalAlignment.CENTER);
            header.setWrapText(true);
            border(header, BorderStyle.MEDIUM);
            header.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            header.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            CellStyle body = wb.createCellStyle();
            body.setVerticalAlignment(VerticalAlignment.CENTER);
            body.setAlignment(HorizontalAlignment.LEFT);
            body.setWrapText(true);
            border(body, BorderStyle.THIN);

            CellStyle num = wb.createCellStyle();
            num.setAlignment(HorizontalAlignment.RIGHT);
            num.setDataFormat(wb.createDataFormat().getFormat("#,##0"));
            border(num, BorderStyle.THIN);

            CellStyle big = wb.createCellStyle();
            Font font = wb.createFont();
            font.setFontHeightInPoints((short) 18);
            big.setFont(font);
            big.setVerticalAlignment(VerticalAlignment.CENTER);
            big.setAlignment(HorizontalAlignment.CENTER);
            big.setWrapText(true);

            CellStyle center = wb.createCellStyle();
            center.setVerticalAlignment(VerticalAlignment.CENTER);
            center.setAlignment(HorizontalAlignment.CENTER);
            center.setWrapText(true);

            CellStyle right = wb.createCellStyle();
            right.setVerticalAlignment(VerticalAlignment.CENTER);
            right.setAlignment(HorizontalAlignment.RIGHT);
            right.setWrapText(true);

            CellStyle sum = wb.createCellStyle();
            sum.setVerticalAlignment(VerticalAlignment.CENTER);
            sum.setAlignment(HorizontalAlignment.CENTER);
            sum.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            sum.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            CellStyle sumNum = wb.createCellStyle();
            sumNum.setVerticalAlignment(VerticalAlignment.CENTER);
            sumNum.setAlignment(HorizontalAlignment.RIGHT);
            sumNum.setDataFormat(wb.createDataFormat().getFormat("#,##0"));
            sumNum.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            sumNum.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            int num0 = 0;
            for (JournalAccountRes acc : accounts) {
                Sheet sheet = wb.createSheet(sheetName(num0, acc));
                String trName = acc.trName() == null ? "" : acc.trName().trim();

                Row r0 = sheet.createRow(0);
                r0.setHeight((short) 500);
                sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 8));
                Cell c0 = r0.createCell(0);
                c0.setCellValue("계   정   별   원   장");
                c0.setCellStyle(big);

                Row r1 = sheet.createRow(1);
                r1.setHeight((short) 500);
                sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 8));
                Cell c1 = r1.createCell(0);
                c1.setCellValue(startDate.format(YMD) + " ~ " + closeDate.format(YMD));
                c1.setCellStyle(center);

                Row r2 = sheet.createRow(2);
                sheet.addMergedRegion(new CellRangeAddress(2, 2, 0, 8));
                Cell c2 = r2.createCell(0);
                c2.setCellValue("계정과목 : [" + acc.trCode() + "] " + trName);
                c2.setCellStyle(right);

                Row hr = sheet.createRow(3);
                hr.setHeight((short) 600);
                for (int i = 0; i < HEADERS.length; i++) {
                    sheet.setColumnWidth(i, WIDTHS[i]);
                    Cell c = hr.createCell(i);
                    c.setCellValue(HEADERS[i]);
                    c.setCellStyle(header);
                }

                List<JournalSubRes> list = loader.apply(acc);
                long drMonth = 0, crMonth = 0, drSum = 0, crSum = 0;
                // 전월이월 줄의 차·대변(0)을 누계 시작값으로 (AS-IS 그대로)
                for (JournalSubRes m : list) {
                    if ("전월이월".equals(m.trName())) {
                        drSum += nz(m.drAmt());
                        crSum += nz(m.crAmt());
                    }
                }
                int e = 0;
                for (int i = 0; i < list.size(); i++) {
                    JournalSubRes d = list.get(i);
                    drMonth += nz(d.drAmt());
                    crMonth += nz(d.crAmt());
                    drSum += nz(d.drAmt());
                    crSum += nz(d.crAmt());

                    Row row = sheet.createRow(i + e + 4);
                    Object[] cols = {d.date().format(YMD), String.valueOf(d.journalNo()), d.trName(), d.note(), d.corpName(),
                            (double) nz(d.drAmt()), (double) nz(d.crAmt()), (double) nz(d.balAmt()), d.drAstName()};
                    for (int ci = 0; ci < cols.length; ci++) {
                        Cell c = row.createCell(ci);
                        if (ci >= 5 && ci <= 7) {
                            c.setCellValue((Double) cols[ci]);
                            c.setCellStyle(num);
                        } else {
                            c.setCellValue(cols[ci] == null ? "" : cols[ci].toString());
                            c.setCellStyle(body);
                        }
                    }

                    String ym1 = d.date().format(YM);
                    String ym2 = i + 1 < list.size() ? list.get(i + 1).date().format(YM) : null;
                    if (!"전월이월".equals(d.trName()) && !ym1.equals(ym2)) {
                        summaryRow(sheet.createRow(i + e + 5), "[   월     계   ]", drMonth, crMonth, sum, sumNum);
                        summaryRow(sheet.createRow(i + e + 6), "[   누     계   ]", drSum, crSum, sum, sumNum);
                        e += 2;
                        drMonth = 0;
                        crMonth = 0;
                    }
                }
                num0++;
            }
            wb.write(out);
            return out.toByteArray();
        }
    }

    private static void summaryRow(Row row, String label, long dr, long cr, CellStyle sum, CellStyle sumNum) {
        for (int f = 0; f < 9; f++) {
            Cell c = row.createCell(f);
            if (f == 1) {
                c.setCellValue(label);
                c.setCellStyle(sum);
            } else if (f == 5) {
                c.setCellValue(dr);
                c.setCellStyle(sumNum);
            } else if (f == 6) {
                c.setCellValue(cr);
                c.setCellStyle(sumNum);
            } else {
                c.setCellStyle(sum);
            }
        }
    }

    private static void border(CellStyle s, BorderStyle b) {
        s.setBorderTop(b);
        s.setBorderBottom(b);
        s.setBorderLeft(b);
        s.setBorderRight(b);
    }

    /** AS-IS: num + "_" + 계정과목 + " (" + 계정코드 + ")" — 엑셀은 31자·특수문자 제한이 있어 줄인다 */
    private static String sheetName(int num, JournalAccountRes acc) {
        String name = num + "_" + (acc.trName() == null ? "" : acc.trName().trim()) + " (" + acc.trCode() + ")";
        name = name.replaceAll("[\\\\/?*\\[\\]:]", "_");
        return name.length() > 31 ? name.substring(0, 31) : name;
    }

    private static long nz(Long v) {
        return v == null ? 0L : v;
    }
}
