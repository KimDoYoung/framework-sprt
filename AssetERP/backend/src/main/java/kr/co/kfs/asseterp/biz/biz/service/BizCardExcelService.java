package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardExcelRow;
import kr.co.kfs.asseterp.biz.biz.mapper.BizPromoMapper;
import kr.co.kfs.asseterp.biz.biz.mapper.BizRelateApprMapper;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * A41 법인카드 사용내역 보고의 첨부 엑셀 (AS-IS Biz01_Excel.getCardExcel L248-469 — ExcelCreate.createCardExcel2).
 * 상신 문서에 `법인카드 사용내역보고(yyyy.MM).xls` 로 붙인다. 내역이 없어도 머리줄과 합계줄은 만든다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BizCardExcelService {

    private final BizPromoMapper promoMapper;
    private final BizRelateApprMapper relateApprMapper;
    private final SysFileService sysFileService;

    private static final DateTimeFormatter YMD = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter YM = DateTimeFormatter.ofPattern("yyyy.MM");

    /** @return 올린 파일 ID */
    public Long createCardExcel(UserPrincipal user, Long apprId, LocalDate startDate, LocalDate closeDate, String searchText) throws IOException {
        List<BizCardExcelRow> list = promoMapper.selectByCardExcel(user.getCompanyId(), user.getUserId(), startDate, closeDate,
                "%" + (searchText == null ? "" : searchText) + "%");

        File temp = Files.createTempFile("card-excel-", ".xls").toFile();
        try (HSSFWorkbook wb = new HSSFWorkbook(); FileOutputStream out = new FileOutputStream(temp)) {
            HSSFSheet sheet = wb.createSheet("Sheet1");
            HSSFFont bold = wb.createFont();
            bold.setBold(true);
            HSSFDataFormat df = wb.createDataFormat();

            HSSFCellStyle header = style(wb, BorderStyle.MEDIUM, BorderStyle.THIN, HorizontalAlignment.CENTER, true);
            header.setFillForegroundColor(HSSFColor.HSSFColorPredefined.LIGHT_YELLOW.getIndex());
            header.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            HSSFCellStyle body = style(wb, BorderStyle.THIN, BorderStyle.THIN, HorizontalAlignment.CENTER, true);
            HSSFCellStyle numBody = style(wb, BorderStyle.THIN, BorderStyle.THIN, HorizontalAlignment.RIGHT, false);
            numBody.setDataFormat(df.getFormat("#,##0"));
            HSSFCellStyle sum = style(wb, BorderStyle.THIN, BorderStyle.MEDIUM, HorizontalAlignment.CENTER, true);
            sum.setFont(bold);
            HSSFCellStyle sumNum = style(wb, BorderStyle.THIN, BorderStyle.MEDIUM, HorizontalAlignment.RIGHT, true);
            sumNum.setDataFormat(df.getFormat("#,##0"));
            sumNum.setFont(bold);

            String[] names = {"카드", "카드 사용자", "카드승인일", "가맹점명", "업종", "승인금액", "제공목적", "제공내역", "계정과목", "계정코드",
                    "인원", "인당 경제적가치", "직원", "거래상대방", "비고"};
            int[] sizes = {5000, 4000, 5000, 5000, 7000, 4000, 5000, 5000, 5000, 5000, 2000, 5000, 5000, 9000, 10000};
            HSSFRow headerRow = sheet.createRow(0);
            headerRow.setHeight((short) 600);
            for (int i = 0; i < names.length; i++) {
                sheet.setColumnWidth(i, sizes[i]);
                HSSFCell c = headerRow.createCell(i);
                c.setCellValue(names[i]);
                c.setCellStyle(header);
            }

            long total = 0;
            for (int i = 0; i < list.size(); i++) {
                BizCardExcelRow m = list.get(i);
                String[] cols = {
                        m.htmlCardName(), m.cardUserName(), m.approvalDt() == null ? null : m.approvalDt().format(YMD),
                        m.franchiseName(), m.sectorName(), String.valueOf(m.provideAmt()), m.providePurName(), m.provideContentName(),
                        m.accountName(), m.accountCode(),
                        (m.totalPeple() == null || m.totalPeple() == 0) ? "" : String.valueOf(m.totalPeple()),
                        String.valueOf(m.averagePrice()), m.regEmpName(), m.targetName(), m.note()};
                total += m.provideAmt() == null ? 0 : m.provideAmt();
                HSSFRow row = sheet.createRow(i + 1);
                for (int c = 0; c < cols.length; c++) {
                    HSSFCell cell = row.createCell(c);
                    if (c == 5) {
                        cell.setCellValue(m.provideAmt() == null ? 0 : m.provideAmt().doubleValue());
                        cell.setCellStyle(numBody);
                    } else {
                        cell.setCellValue(cols[c]);
                        cell.setCellStyle(body);
                    }
                }
            }

            HSSFRow sumRow = sheet.createRow(list.size() + 1);
            for (int c = 0; c < names.length; c++) {
                HSSFCell cell = sumRow.createCell(c);
                if (c == 5) {
                    cell.setCellValue((double) total);
                    cell.setCellStyle(sumNum);
                } else {
                    cell.setCellValue(c == 3 ? "합계" : " ");
                    cell.setCellStyle(sum);
                }
            }
            wb.write(out);
        }

        try {
            String locName = relateApprMapper.selectLocName(user.getCompanyId());
            String fileNm = "법인카드 사용내역보고(" + startDate.format(YM) + ").xls";
            return sysFileService.registerRdFile(temp, apprId, locName, fileNm, "xls");
        } finally {
            Files.deleteIfExists(temp.toPath()); // registerRdFile이 옮겼으면 이미 없다
        }
    }

    private static HSSFCellStyle style(HSSFWorkbook wb, BorderStyle bottom, BorderStyle top, HorizontalAlignment align, boolean wrap) {
        HSSFCellStyle s = wb.createCellStyle();
        s.setVerticalAlignment(VerticalAlignment.CENTER);
        s.setBorderBottom(bottom);
        s.setBorderTop(top);
        s.setBorderLeft(BorderStyle.THIN);
        s.setBorderRight(BorderStyle.THIN);
        s.setAlignment(align);
        s.setWrapText(wrap);
        return s;
    }
}
