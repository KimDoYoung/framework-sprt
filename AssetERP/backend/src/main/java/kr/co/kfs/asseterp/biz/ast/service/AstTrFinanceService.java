package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.act.service.ActJournalService;
import kr.co.kfs.asseterp.biz.ast.dto.TrFinanceRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrFinanceSaveReq;
import kr.co.kfs.asseterp.biz.ast.dto.TrFinanceSearchCond;
import kr.co.kfs.asseterp.biz.ast.mapper.AstTrFinanceMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DataFormat;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS server/ast/Ast06_Tr.java (selectByPayCode L43 · selectById L32 · updateFinance L358) — 청약처리 Ast06_Tab_TrIPO (W05).
 * 삭제는 U04의 {@link AstTrService#delete}를 같이 쓴다(금융 상세가 있으면 금융자산 원장을 되돌린다)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstTrFinanceService {

    private final AstTrFinanceMapper mapper;
    private final ActJournalService journalService;
    private final EmpTransInfoService transInfoService;

    /**
     * ast06_tr.selectByPayCode. 거래유형·거래처·계좌·종목 0은 조건 없음, 자산구분 비면 %, 국내외 비면 1, 검색어 비면 %, 결제구분은 %.
     * 조직은 LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0
     */
    public List<TrFinanceRes> search(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String windowClassName,
                                     String assetType, String abroType, Long accountId, Long classTreeId, Long trCodeId, String searchText) {
        Long orgId = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        return mapper.selectByPayCode(new TrFinanceSearchCond(user.getCompanyId(), user.getUserId(), orgId, startDate, closeDate, "%",
                blank(assetType) ? "%" : assetType, blank(abroType) ? "1" : abroType,
                accountId, null, zeroToNull(classTreeId), zeroToNull(trCodeId), windowClassName, blank(searchText) ? "%" : searchText));
    }

    /** ast06_tr.selectById */
    public TrFinanceRes get(UserPrincipal user, Long trId) {
        TrFinanceRes row = mapper.selectById(user.getCompanyId(), trId);
        if (row == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return row;
    }

    /**
     * Ast06_Tr.updateFinance — 필수 검사(AS-IS Ast06_Lookup_TrIPO.preUpdate) → 회계마감 검사 → ast06_tr → ast08_tr_finance → 금융자산 보유원장.
     * 저장한 거래ID를 돌려준다
     */
    @Transactional
    public Long save(UserPrincipal user, TrFinanceSaveReq r) {
        if (r.astClassTreeId() == null) throw invalid("종목(자산구분)은 필수선택 항목입니다.");
        if (r.corpId() == null) throw invalid("거래처 계좌는 필수선택 항목입니다.");
        if (!r.settleMngYn() && r.depositId() == null) throw invalid("미수/미지급 거래가 아닌 경우 예금계좌는 필수선택 항목입니다.");
        if ("3503".equals(r.trCode()) || "3500".equals(r.trCode()) || "3511".equals(r.trCode())) {
            if (r.listDate() == null) throw invalid("상장일자는 필수입력 항목입니다");
            if (!"00".equals(r.lockUpPeriodCode()) && r.lockUpDate() == null) {
                throw invalid("보유의무확약이 미확약이 아닌경우 매도제한일은 필수입력 항목입니다.");
            }
        }
        journalService.checkClose(user.getCompanyId(), r.date());

        Long trId = r.trId();
        if (trId == null) {
            trId = mapper.selectNextId();
            mapper.insertTr(trId, user.getCompanyId(), user.getUserId(), r);
        } else if (mapper.updateTr(user.getCompanyId(), r) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        Long financeId = mapper.selectFinanceId(trId);
        if (financeId == null) {
            mapper.insertFinance(mapper.selectNextId(), trId, r);
        } else {
            mapper.updateFinance(financeId, r);
        }
        String msg = mapper.createFinanceBook("P", trId);
        if (!"Y".equals(msg)) throw new BusinessException(ErrorCode.INVALID_INPUT, msg);
        return trId;
    }

    /**
     * 엑셀다운로드 (AS-IS ExcelDownload.getAst06IpoList L2079-2318, actionCode ast06IpoList): 화면 조회와 같은 조건(Ast06_Tab_TrIPO, 고유자산, 국내)의
     * 14열. AS-IS는 .xls(HSSF)였고 TOBE는 .xlsx — 열 순서·열 폭·머리글 색(연노랑)·수량/금액 서식은 그대로
     */
    public byte[] downloadIpoExcel(UserPrincipal user, LocalDate startDate, LocalDate closeDate, Long accountId,
                                   Long classTreeId, Long trCodeId, String searchText) {
        List<TrFinanceRes> list = search(user, startDate, closeDate, "Ast06_Tab_TrIPO", "1", "1", accountId, classTreeId, trCodeId, searchText);
        String[] heads = {"일자", "거래유형", "거래처", "종목유형", "종목", "거래수량", "거래단가", "거래금액", "수수료", "결제금액", "확약기간", "예금계좌", "적요", "등록자"};
        int[] widths = {3000, 7000, 9000, 4000, 8000, 4000, 4000, 4000, 3000, 4000, 4000, 6000, 9000, 2000};
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("sheet1");
            CellStyle head = wb.createCellStyle();
            head.setVerticalAlignment(VerticalAlignment.CENTER);
            head.setAlignment(HorizontalAlignment.CENTER);
            head.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
            head.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            head.setWrapText(true);
            border(head);
            CellStyle body = wb.createCellStyle();
            body.setVerticalAlignment(VerticalAlignment.CENTER);
            body.setWrapText(true);
            border(body);
            DataFormat df = wb.createDataFormat();
            CellStyle num = wb.createCellStyle();
            num.setDataFormat(df.getFormat("#,##0"));
            num.setAlignment(HorizontalAlignment.RIGHT);
            border(num);
            CellStyle dbl = wb.createCellStyle();
            dbl.setDataFormat(df.getFormat("###,###,##0.#0"));
            dbl.setAlignment(HorizontalAlignment.RIGHT);
            border(dbl);
            Row headRow = sheet.createRow(0);
            for (int i = 0; i < heads.length; i++) {
                sheet.setColumnWidth(i, widths[i]);
                headRow.createCell(i).setCellValue(heads[i]);
                headRow.getCell(i).setCellStyle(head);
            }
            int r = 1;
            for (TrFinanceRes t : list) {
                Row row = sheet.createRow(r++);
                Object[] cols = {t.date() == null ? null : t.date().toString(), t.trName(), t.corpAccountName(), t.astClassName(), t.classTreeName(),
                        zero(t.qty()), zero(t.price()), zero(t.trAmt()), zero(t.fee()), zero(t.amt()),
                        nz(t.lockUpPeriodName()), nz(t.depositName()), t.note(), t.personName()};
                for (int i = 0; i < cols.length; i++) {
                    var cell = row.createCell(i);
                    if (i == 5 || i == 7 || i == 8 || i == 9) {
                        cell.setCellValue(((Number) cols[i]).doubleValue());
                        cell.setCellStyle(num);
                    } else if (i == 6) {
                        cell.setCellValue(((Number) cols[i]).doubleValue());
                        cell.setCellStyle(dbl);
                    } else {
                        if (cols[i] != null) cell.setCellValue(cols[i].toString());
                        cell.setCellStyle(body);
                    }
                }
            }
            wb.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 파일을 만들 수 없습니다.");
        }
    }

    private static void border(CellStyle st) {
        st.setBorderBottom(BorderStyle.THIN);
        st.setBorderLeft(BorderStyle.THIN);
        st.setBorderRight(BorderStyle.THIN);
        st.setBorderTop(BorderStyle.THIN);
    }

    private static Number zero(Number n) {
        return n == null ? 0 : n;
    }

    private static String nz(String s) {
        return s == null ? "" : s;
    }

    private static boolean blank(String s) {
        return s == null || s.isEmpty();
    }

    private static Long zeroToNull(Long v) {
        return v == null || v == 0L ? null : v;
    }

    private static BusinessException invalid(String msg) {
        return new BusinessException(ErrorCode.INVALID_INPUT, msg);
    }
}
