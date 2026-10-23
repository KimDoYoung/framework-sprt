package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizLimitCompanyYearRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizLimitPersonDayRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizLimitPersonYearRes;
import kr.co.kfs.asseterp.biz.biz.mapper.BizLimitCheckMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

/**
 * AS-IS server/biz/Biz01_Promo.java (selectByPersonDay L116 / selectByPersonYear L131 / selectByCompanyYear L136) + ExcelDownload.getBiz01List L1278
 * (L07 Biz01_Tab_LimitCheckList 이익제공 한도초과현황). 로그인 회사 기준, 제공/수령 구분은 비면 전체('%')
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BizLimitCheckService {

    private final BizLimitCheckMapper mapper;

    /** 인별 1회 초과건 */
    public List<BizLimitPersonDayRes> searchPersonDay(UserPrincipal user, String yearText, String provideRcvType) {
        return mapper.selectByPersonDay(user.getCompanyId(), yearText, rcvType(provideRcvType));
    }

    /** 인별 연간 초과건 */
    public List<BizLimitPersonYearRes> searchPersonYear(UserPrincipal user, String yearText, String provideRcvType) {
        return mapper.selectByPersonYear(user.getCompanyId(), yearText, rcvType(provideRcvType));
    }

    /** 회사별 연간 초과건 */
    public List<BizLimitCompanyYearRes> searchCompanyYear(UserPrincipal user, String yearText, String provideRcvType) {
        return mapper.selectByCompanyYear(user.getCompanyId(), yearText, rcvType(provideRcvType));
    }

    /** 제공/수령 콤보 코드 — 안 골랐으면(null·"null"·빈 글자) 전체 '%' (ExcelDownload L1358) */
    private String rcvType(String code) {
        return code == null || code.isEmpty() || "null".equals(code) ? "%" : code;
    }

    /**
     * AS-IS ExcelDownload.getBiz01List L1278-1541 — 시트 3개("0_인별 1회 초과건"·"1_인별 연간 초과건"·"2_회사별 연간 초과건"), 제목 줄 + 데이터.
     * 제목은 회색 바탕·굵은 테두리, 내용은 가는 테두리, 금액 열은 #,##0 오른쪽 정렬
     */
    public byte[] downloadExcel(UserPrincipal user, String yearText, String provideRcvType) {
        List<BizLimitPersonDayRes> day = searchPersonDay(user, yearText, provideRcvType);
        List<BizLimitPersonYearRes> person = searchPersonYear(user, yearText, provideRcvType);
        List<BizLimitCompanyYearRes> company = searchCompanyYear(user, yearText, provideRcvType);
        try (HSSFWorkbook wb = new HSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            HSSFCellStyle header = wb.createCellStyle();
            header.setVerticalAlignment(VerticalAlignment.CENTER);
            header.setBorderBottom(BorderStyle.MEDIUM);
            header.setBorderLeft(BorderStyle.MEDIUM);
            header.setBorderRight(BorderStyle.MEDIUM);
            header.setBorderTop(BorderStyle.MEDIUM);
            header.setWrapText(true);
            header.setAlignment(HorizontalAlignment.CENTER);
            header.setFillForegroundColor(HSSFColor.HSSFColorPredefined.GREY_25_PERCENT.getIndex());
            header.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            HSSFCellStyle body = wb.createCellStyle();
            body.setVerticalAlignment(VerticalAlignment.CENTER);
            body.setBorderBottom(BorderStyle.THIN);
            body.setBorderLeft(BorderStyle.THIN);
            body.setBorderRight(BorderStyle.THIN);
            body.setBorderTop(BorderStyle.THIN);
            body.setWrapText(true);
            body.setAlignment(HorizontalAlignment.LEFT);
            HSSFDataFormat df = wb.createDataFormat();
            HSSFCellStyle num = wb.createCellStyle();
            num.setBorderBottom(BorderStyle.THIN);
            num.setBorderLeft(BorderStyle.THIN);
            num.setBorderRight(BorderStyle.THIN);
            num.setBorderTop(BorderStyle.THIN);
            num.setDataFormat(df.getFormat("#,##0"));
            num.setAlignment(HorizontalAlignment.RIGHT);

            HSSFSheet s0 = sheet(wb, "0_인별 1회 초과건", header,
                    new String[]{"제공/수령", "제공자", "제공일자", "제공목적", "제공내용", "거래상대방", "인당 경제적가치", "비고"},
                    new int[]{4500, 4500, 3000, 4500, 4500, 9000, 3600, 9000});
            int r = 1;
            for (BizLimitPersonDayRes a : day) {
                HSSFRow row = s0.createRow(r++);
                text(row, 0, a.provideRcvTypeName(), body);
                text(row, 1, a.regEmpName(), body);
                text(row, 2, a.provideDate() == null ? null : a.provideDate().toString(), body);
                text(row, 3, a.providePurName(), body);
                text(row, 4, a.provideContentName(), body);
                text(row, 5, a.targetEmpName(), body);
                number(row, 6, a.averagePrice(), num);
                text(row, 7, a.note(), body);
            }
            HSSFSheet s1 = sheet(wb, "1_인별 연간 초과건", header,
                    new String[]{"제공/수령", "제공(수령) 회사명", "제공(수령) 성명", "경제적가치"}, new int[]{4500, 7500, 4500, 3600});
            r = 1;
            for (BizLimitPersonYearRes a : person) {
                HSSFRow row = s1.createRow(r++);
                text(row, 0, a.provideRcvTypeName(), body);
                text(row, 1, a.targetCompanyName(), body);
                text(row, 2, a.targetEmpName(), body);
                number(row, 3, a.averagePrice(), num);
            }
            HSSFSheet s2 = sheet(wb, "2_회사별 연간 초과건", header,
                    new String[]{"제공/수령", "제공(수령) 회사명", "경제적가치"}, new int[]{4500, 7500, 3600});
            r = 1;
            for (BizLimitCompanyYearRes a : company) {
                HSSFRow row = s2.createRow(r++);
                text(row, 0, a.provideRcvTypeName(), body);
                text(row, 1, a.targetCompanyName(), body);
                number(row, 2, a.averagePrice(), num);
            }
            wb.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 파일을 만들 수 없습니다.");
        }
    }

    private HSSFSheet sheet(HSSFWorkbook wb, String name, HSSFCellStyle header, String[] titles, int[] widths) {
        HSSFSheet sheet = wb.createSheet(name);
        HSSFRow row = sheet.createRow(0);
        row.setHeight((short) 600);
        for (int i = 0; i < titles.length; i++) {
            sheet.setColumnWidth(i, widths[i]);
            Cell cell = row.createCell(i);
            cell.setCellValue(titles[i]);
            cell.setCellStyle(header);
        }
        return sheet;
    }

    private void text(HSSFRow row, int col, String value, HSSFCellStyle style) {
        Cell cell = row.createCell(col);
        cell.setCellValue(value == null ? "" : value);
        cell.setCellStyle(style);
    }

    private void number(HSSFRow row, int col, Long value, HSSFCellStyle style) {
        Cell cell = row.createCell(col);
        cell.setCellValue(value == null ? 0 : value);
        cell.setCellStyle(style);
    }
}
