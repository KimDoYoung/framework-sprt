package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizFeeChargeCalc;
import kr.co.kfs.asseterp.biz.biz.dto.BizFeeChargeDtlRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizFeeChargeRes;
import kr.co.kfs.asseterp.biz.biz.mapper.BizFeeChargeMapper;
import kr.co.kfs.asseterp.biz.biz.mapper.BizRelateApprMapper;
import kr.co.kfs.asseterp.biz.sys.dto.FileRes;
import kr.co.kfs.asseterp.biz.sys.mapper.SysFileMapper;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * 최저보수 청구 엑셀 (EE33, AS-IS Biz21_Excel.getExcel L46-303 · getTotalExcel L308-493 · ExcelDownload.getBiz22List L1551-1830).
 * <ul>
 *   <li>{@link #createFeeExcel} — 자료생성 뒤 운용사(계약사) 행마다 `{운용사}_{연도}년도_{분기}분기_사무관리보수.xls`. 운영구분이 '1'인 행만 파일을 만들고,
 *       청구보수 ID에 붙어 있던 기존 파일은 구분 없이 모두 지운다(AS-IS 그대로 — 뒤이은 PDF가 다시 붙인다).</li>
 *   <li>{@link #createTotalFeeExcel} — 통합상신(A20) 문서에 붙이는 분기별 통합 엑셀.</li>
 *   <li>{@link #calcExcel} — 계산상세 창의 [엑셀다운로드] `최저보수청구 구간계산정보.xls`.</li>
 * </ul>
 * AS-IS 와 같이 단계마다 바로 저장한다(전체를 한 트랜잭션으로 묶지 않는다). 행 하나가 실패해도 로그만 남기고 다음 행으로 간다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BizFeeChargeExcelService {

    private static final DateTimeFormatter YMD = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final BizFeeChargeMapper mapper;
    private final BizRelateApprMapper relateApprMapper;
    private final SysFileMapper sysFileMapper;
    private final SysFileService sysFileService;

    // ── 자료생성 뒤 운용사별 엑셀 ──

    /**
     * @param contCorpId 있으면 그 계약사의 행만(AS-IS selectByChargeDate 의 :contCorpId 조건), 확정된 행은 제외(:fixYn = 'false')
     * @return 만든 파일 수
     */
    public int createFeeExcel(UserPrincipal user, LocalDate chargeDate, String quarterStr, Long contCorpId) {
        int made = 0;
        for (BizFeeChargeRes model : targets(user.getCompanyId(), chargeDate, contCorpId)) {
            try {
                deleteFiles(model.realFeeChargeId());
                if (!"1".equals(model.manageType())) {
                    continue;
                }
                File temp = Files.createTempFile("feecharge-excel-", ".xls").toFile();
                try {
                    writeFeeWorkbook(temp, model);
                    String fileNm = model.corpNm() + "_" + chargeDate.getYear() + "년도_" + quarterStr + "분기_사무관리보수.xls";
                    String locName = relateApprMapper.selectLocName(user.getCompanyId());
                    sysFileService.registerRdFile(temp, model.realFeeChargeId(), locName, fileNm, "xls");
                    made++;
                } finally {
                    Files.deleteIfExists(temp.toPath()); // registerRdFile 이 옮겼으면 이미 없다
                }
            } catch (Exception e) {
                log.error("최저보수 청구 엑셀 생성 실패 feeChargeId={}", model.realFeeChargeId(), e);
            }
        }
        return made;
    }

    /** AS-IS selectByChargeDate(searchText '%', contCorpId, fixYn 'false') 중 청구보수가 있는 행 */
    public List<BizFeeChargeRes> targets(Long companyId, LocalDate chargeDate, Long contCorpId) {
        List<BizFeeChargeRes> out = new ArrayList<>();
        for (BizFeeChargeRes r : mapper.selectByChargeDate(companyId, chargeDate, "%")) {
            if (r.realFeeChargeId() == null) {
                continue;
            }
            if (contCorpId != null && !contCorpId.equals(r.contCorpId())) {
                continue;
            }
            if (r.fixYn() != null && !"false".equals(r.fixYn())) {
                continue;
            }
            out.add(r);
        }
        return out;
    }

    /** 청구보수 ID 에 붙은 기존 파일을 지운다(실제 파일 + sys10_file 행). 다른 상신 문서에서 연결해 온 것은 건드리지 않는다 */
    void deleteFiles(Long feeChargeId) {
        for (FileRes f : sysFileMapper.selectByParentId(feeChargeId)) {
            if (feeChargeId.equals(f.parentId())) {
                sysFileService.delete(f.fileId());
            }
        }
    }

    private void writeFeeWorkbook(File temp, BizFeeChargeRes model) throws IOException {
        try (HSSFWorkbook wb = new HSSFWorkbook(); FileOutputStream out = new FileOutputStream(temp)) {
            HSSFSheet sheet = wb.createSheet("Sheet1");
            HSSFCellStyle header = headerStyle(wb);
            HSSFCellStyle body = bodyStyle(wb);
            HSSFCellStyle numBody = numStyle(wb);

            List<String> fundCodes = mapper.selectDtlFundCodes(model.realFeeChargeId());
            int f = fundCodes.size();

            // 머리줄: 펀드마다 5칸 + 끝 3칸(공백, 스타일 없음)
            List<Object[]> headers = new ArrayList<>();
            for (int i = 0; i < f; i++) {
                headers.add(new Object[]{"No.", 2000});
                headers.add(new Object[]{"발생일자", 3000});
                headers.add(new Object[]{"펀드코드", 3000});
                headers.add(new Object[]{"보수계산전\r\n순자산총액", 5000});
                headers.add(new Object[]{"발생액", 3000});
            }
            headers.add(new Object[]{" ", 2000});
            headers.add(new Object[]{" ", 6000});
            headers.add(new Object[]{" ", 6000});
            HSSFRow headerRow = sheet.createRow(0);
            headerRow.setHeight((short) 600);
            for (int i = 0; i < headers.size(); i++) {
                sheet.setColumnWidth(i, (Integer) headers.get(i)[1]);
                HSSFCell c = headerRow.createCell(i);
                c.setCellValue((String) headers.get(i)[0]);
                if (headers.size() - 3 > i) {
                    c.setCellStyle(header);
                }
            }

            // 펀드별 일자 내역 + 합계
            for (int e = 0; e < f; e++) {
                List<BizFeeChargeDtlRes> dtl = mapper.selectDtlByFundCode(model.realFeeChargeId(), fundCodes.get(e));
                long occFee = 0;
                for (int i = 0; i < dtl.size(); i++) {
                    BizFeeChargeDtlRes d = dtl.get(i);
                    occFee += nz(d.occFee());
                    HSSFRow row = row(sheet, i + 1);
                    text(row, e * 5, String.valueOf(i + 1), body);
                    text(row, e * 5 + 1, d.occDate() == null ? "" : d.occDate().format(YMD), body);
                    text(row, e * 5 + 2, d.fundCode(), body);
                    num(row, e * 5 + 3, nz(d.totalNetAsset()), numBody);
                    num(row, e * 5 + 4, nz(d.occFee()), numBody);
                }
                HSSFRow sum = row(sheet, dtl.size() + 1);
                for (int c = 0; c < 4; c++) {
                    text(sum, e * 5 + c, "", body);
                }
                num(sum, e * 5 + 4, occFee, numBody);
            }

            // 오른쪽 요약: 발생기간 / 총보수금액(A) / 펀드발생금액(B) / 청구금액(A-B)
            String period = (model.occStartDate() == null ? "" : model.occStartDate().format(YMD)) + " ~ "
                    + (model.occCloseDate() == null ? "" : model.occCloseDate().format(YMD));
            text(row(sheet, 1), f * 5 + 1, "발생기간", body);
            text(row(sheet, 2), f * 5 + 1, "총보수금액(A)", body);
            text(row(sheet, 3), f * 5 + 1, "펀드발생금액(B)", body);
            text(row(sheet, 4), f * 5 + 1, "청구금액(A-B)", body);
            text(row(sheet, 1), f * 5 + 2, period, body);
            num(row(sheet, 2), f * 5 + 2, nz(model.chargeFee()) + nz(model.occFee()), numBody);
            num(row(sheet, 3), f * 5 + 2, nz(model.occFee()), numBody);
            num(row(sheet, 4), f * 5 + 2, nz(model.chargeFee()), numBody);
            wb.write(out);
        }
    }

    // ── 통합상신(A20) 통합 엑셀 ──

    /**
     * 연초부터 분기 {@code quarterStr} 까지 분기별 운용사 청구를 한 장에 모아 상신 문서(apprId)에 `{연도}년도_{분기}분기_사무관리보수.xls` 로 붙인다.
     * @return 올린 파일 ID
     */
    public Long createTotalFeeExcel(UserPrincipal user, Long apprId, LocalDate chargeDate, String quarterStr) throws IOException {
        int quarter = parseQuarter(quarterStr);
        File temp = Files.createTempFile("feecharge-total-", ".xls").toFile();
        try (HSSFWorkbook wb = new HSSFWorkbook(); FileOutputStream out = new FileOutputStream(temp)) {
            HSSFSheet sheet = wb.createSheet("Sheet1");
            HSSFCellStyle header = headerStyle(wb);
            HSSFCellStyle body = bodyStyle(wb);
            HSSFCellStyle numBody = numStyle(wb);

            HSSFRow headerRow = sheet.createRow(0);
            headerRow.setHeight((short) 600);
            for (int i = 0; i < quarter; i++) {
                String[] names = {"운용사", "사무관리보수\r\n(" + (quarter - i) + "분기)", "청구액", "비고"};
                int[] sizes = {10000, 5000, 5000, 10000};
                for (int k = 0; k < 4; k++) {
                    sheet.setColumnWidth(i * 4 + k, sizes[k]);
                    HSSFCell c = headerRow.createCell(i * 4 + k);
                    c.setCellValue(names[k]);
                    c.setCellStyle(header);
                }
            }

            for (int e = 0; e < quarter; e++) {
                LocalDate quarterEnd = quarterEnd(chargeDate.getYear(), quarter - e);
                List<BizFeeChargeRes> list = mapper.selectByChargeDate(user.getCompanyId(), quarterEnd, "%");
                long totalOccFee = 0;
                long totalRealChargeFee = 0;
                for (int i = 0; i < list.size(); i++) {
                    BizFeeChargeRes m = list.get(i);
                    totalOccFee += nz(m.occFee());
                    totalRealChargeFee += nz(m.realChargeFee());
                    HSSFRow row = row(sheet, i + 1);
                    text(row, e * 4, m.corpNm(), body);
                    num(row, e * 4 + 1, nz(m.occFee()), numBody);
                    num(row, e * 4 + 2, nz(m.realChargeFee()), numBody);
                    text(row, e * 4 + 3, m.note(), body);
                }
                HSSFRow sum = row(sheet, list.size() + 1);
                text(sum, e * 4, " ", body);
                num(sum, e * 4 + 1, totalOccFee, numBody);
                num(sum, e * 4 + 2, totalRealChargeFee, numBody);
                text(sum, e * 4 + 3, " ", body);
            }
            wb.write(out);
        }
        try {
            String locName = relateApprMapper.selectLocName(user.getCompanyId());
            String fileNm = chargeDate.getYear() + "년도_" + quarterStr + "분기_사무관리보수.xls";
            return sysFileService.registerRdFile(temp, apprId, locName, fileNm, "xls");
        } finally {
            Files.deleteIfExists(temp.toPath());
        }
    }

    // ── 계산상세 [엑셀다운로드] ──

    /** 구간 계산 상세(biz22) 전체를 두 줄 머리(운용·자문·병행 묶음) + 합계 행으로 담은 xls */
    public byte[] calcExcel(UserPrincipal user, Long contCorpId, LocalDate chargeDate) throws IOException {
        List<BizFeeChargeCalc> list = mapper.selectCalcs(user.getCompanyId(), contCorpId, chargeDate);
        try (HSSFWorkbook wb = new HSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            HSSFSheet sheet = wb.createSheet("sheet1");
            HSSFCellStyle header = wb.createCellStyle();
            header.setVerticalAlignment(VerticalAlignment.CENTER);
            header.setAlignment(HorizontalAlignment.CENTER);
            thinBorder(header);
            header.setFillForegroundColor(HSSFColor.HSSFColorPredefined.LIGHT_YELLOW.getIndex());
            header.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            header.setWrapText(true);
            HSSFCellStyle body = bodyStyle(wb);
            HSSFCellStyle numBody = numStyle(wb);
            HSSFFont bold = wb.createFont();
            bold.setBold(true);
            HSSFCellStyle sumBody = wb.createCellStyle();
            sumBody.setVerticalAlignment(VerticalAlignment.CENTER);
            sumBody.setAlignment(HorizontalAlignment.CENTER);
            thinBorder(sumBody);
            sumBody.setBorderTop(BorderStyle.MEDIUM);
            sumBody.setFont(bold);
            sumBody.setWrapText(true);
            // AS-IS 는 합계 숫자 칸 서식에 "#,##0"·오른쪽 정렬을 주려다 일반 숫자 칸 스타일에 두 번 넣었다 — 합계 숫자 칸은 서식·정렬이 없다
            HSSFCellStyle sumNum = wb.createCellStyle();
            sumNum.setVerticalAlignment(VerticalAlignment.CENTER);
            thinBorder(sumNum);
            sumNum.setBorderTop(BorderStyle.MEDIUM);
            sumNum.setFont(bold);
            sumNum.setWrapText(true);

            sheet.addMergedRegion(new CellRangeAddress(0, 1, 0, 0));
            sheet.addMergedRegion(new CellRangeAddress(0, 1, 1, 1));
            sheet.addMergedRegion(new CellRangeAddress(0, 1, 2, 2));
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 3, 7));
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 8, 12));
            sheet.addMergedRegion(new CellRangeAddress(0, 1, 13, 13));
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 14, 17));

            String[] head1 = {"구간시작일", "구간종료일", "구간일수", "운용보수", " ", " ", " ", " ", "자문보수", " ", " ", " ", " ",
                    "병행적용\r\n여부", "병행보수", " ", " ", " "};
            int[] size1 = {4000, 4000, 4000, 20000, 4000, 4000, 4000, 4000, 20000, 4000, 4000, 4000, 4000, 4000, 16000, 4000, 4000, 4000};
            String[] head2 = {" ", " ", " ", "청구기간\r\n최저보수", "계산구간\r\n최저보수", "계산구간\r\n발생보수", "계산구간\r\n병행보수", "청구보수",
                    "청구기간\r\n최저보수", "계산구간\r\n최저보수", "계산구간\r\n발생보수", "계산구간\r\n병행보수", "청구보수", " ",
                    "청구기간\r\n병행보수", "계산구간\r\n병행보수", "계산구간\r\n발생보수", "계산구간\r\n청구보수"};
            HSSFRow r0 = sheet.createRow(0);
            for (int i = 0; i < head1.length; i++) {
                sheet.setColumnWidth(i, size1[i]);
                HSSFCell c = r0.createCell(i);
                c.setCellValue(head1[i]);
                c.setCellStyle(header);
            }
            HSSFRow r1 = sheet.createRow(1);
            for (int i = 0; i < head2.length; i++) {
                sheet.setColumnWidth(i, 4000);
                HSSFCell c = r1.createCell(i);
                c.setCellValue(head2[i]);
                c.setCellStyle(header);
            }

            long[] sum = new long[12]; // termDays, manage×4, adv×4, with×3 (합계 행에 쓰는 순서)
            for (int i = 0; i < list.size(); i++) {
                BizFeeChargeCalc d = list.get(i);
                sum[0] += nz(d.termDays);
                sum[1] += nz(d.manageTermMinFee);
                sum[2] += nz(d.manageTermOccFee);
                sum[3] += nz(d.manageTermWithFee);
                sum[4] += nz(d.manageTermChargeFee);
                sum[5] += nz(d.advTermMinFee);
                sum[6] += nz(d.advTermOccFee);
                sum[7] += nz(d.advTermWithFee);
                sum[8] += nz(d.advTermChargeFee);
                sum[9] += nz(d.withTermWithFee);
                sum[10] += nz(d.withTermOccFee);
                sum[11] += nz(d.withTermChargeFee);
                HSSFRow row = sheet.createRow(i + 2);
                text(row, 0, d.termStartDate == null ? "" : d.termStartDate.format(YMD), body);
                text(row, 1, d.termStartDate == null || d.termCloseDate == null ? "" : d.termCloseDate.format(YMD), body); // AS-IS 는 종료일 칸도 시작일이 있는지로 가린다
                long[] nums = {nz(d.termDays), nz(d.manageMinFee), nz(d.manageTermMinFee), nz(d.manageTermOccFee), nz(d.manageTermWithFee),
                        nz(d.manageTermChargeFee), nz(d.advMinFee), nz(d.advTermMinFee), nz(d.advTermOccFee), nz(d.advTermWithFee),
                        nz(d.advTermChargeFee)};
                for (int k = 0; k < nums.length; k++) {
                    num(row, 2 + k, nums[k], numBody);
                }
                text(row, 13, "true".equals(d.withYn) ? "Y" : "N", body);
                num(row, 14, nz(d.withFee), numBody);
                num(row, 15, nz(d.withTermWithFee), numBody);
                num(row, 16, nz(d.withTermOccFee), numBody);
                num(row, 17, nz(d.withTermChargeFee), numBody);
            }

            HSSFRow total = sheet.createRow(list.size() + 2);
            String[] texts = new String[18];
            texts[0] = "합계";
            texts[1] = texts[3] = texts[8] = texts[13] = texts[14] = "";
            long[] vals = new long[18];
            vals[2] = sum[0];
            vals[4] = sum[1]; vals[5] = sum[2]; vals[6] = sum[3]; vals[7] = sum[4];
            vals[9] = sum[5]; vals[10] = sum[6]; vals[11] = sum[7]; vals[12] = sum[8];
            vals[15] = sum[9]; vals[16] = sum[10]; vals[17] = sum[11];
            for (int c = 0; c < 18; c++) {
                if (c == 0 || c == 1 || c == 3 || c == 8 || c == 13 || c == 14) {
                    text(total, c, texts[c], sumBody);
                } else {
                    num(total, c, vals[c], sumNum);
                }
            }
            wb.write(out);
            return out.toByteArray();
        }
    }

    // ── 공통 ──

    static int parseQuarter(String quarterStr) {
        try {
            int q = Integer.parseInt(quarterStr);
            if (q >= 1 && q <= 4) {
                return q;
            }
        } catch (NumberFormatException ignored) {
            // 아래에서 처리
        }
        throw new BusinessException(ErrorCode.INVALID_INPUT, "분기를 확인해주세요.");
    }

    /** AS-IS getChargeDate(year, quarter) — 분기 말일 */
    static LocalDate quarterEnd(int year, int quarter) {
        return switch (quarter) {
            case 1 -> LocalDate.of(year, 3, 31);
            case 2 -> LocalDate.of(year, 6, 30);
            case 3 -> LocalDate.of(year, 9, 30);
            default -> LocalDate.of(year, 12, 31);
        };
    }

    private static long nz(Long v) {
        return v == null ? 0 : v;
    }

    private static HSSFRow row(HSSFSheet sheet, int index) {
        HSSFRow r = sheet.getRow(index);
        return r != null ? r : sheet.createRow(index);
    }

    private static void text(HSSFRow row, int col, String value, HSSFCellStyle style) {
        HSSFCell c = row.createCell(col);
        c.setCellValue(value);
        c.setCellStyle(style);
    }

    private static void num(HSSFRow row, int col, long value, HSSFCellStyle style) {
        HSSFCell c = row.createCell(col);
        c.setCellValue((double) value);
        c.setCellStyle(style);
    }

    private static void thinBorder(HSSFCellStyle s) {
        s.setBorderBottom(BorderStyle.THIN);
        s.setBorderLeft(BorderStyle.THIN);
        s.setBorderRight(BorderStyle.THIN);
        s.setBorderTop(BorderStyle.THIN);
    }

    /** 제목 스타일: 가운데, 아래 굵은 선, 연노랑 바탕 */
    private static HSSFCellStyle headerStyle(HSSFWorkbook wb) {
        HSSFCellStyle s = wb.createCellStyle();
        s.setVerticalAlignment(VerticalAlignment.CENTER);
        s.setBorderBottom(BorderStyle.MEDIUM);
        s.setBorderLeft(BorderStyle.THIN);
        s.setBorderRight(BorderStyle.THIN);
        s.setBorderTop(BorderStyle.THIN);
        s.setWrapText(true);
        s.setFillForegroundColor(HSSFColor.HSSFColorPredefined.LIGHT_YELLOW.getIndex());
        s.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        s.setAlignment(HorizontalAlignment.CENTER);
        return s;
    }

    private static HSSFCellStyle bodyStyle(HSSFWorkbook wb) {
        HSSFCellStyle s = wb.createCellStyle();
        s.setVerticalAlignment(VerticalAlignment.CENTER);
        thinBorder(s);
        s.setWrapText(true);
        s.setAlignment(HorizontalAlignment.CENTER);
        return s;
    }

    private static HSSFCellStyle numStyle(HSSFWorkbook wb) {
        HSSFCellStyle s = wb.createCellStyle();
        thinBorder(s);
        s.setDataFormat(wb.createDataFormat().getFormat("#,##0"));
        s.setAlignment(HorizontalAlignment.RIGHT);
        return s;
    }
}
