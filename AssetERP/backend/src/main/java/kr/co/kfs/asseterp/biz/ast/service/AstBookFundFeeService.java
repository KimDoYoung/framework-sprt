package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeeCorpRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeeFundRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeeMonthRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeeParam;
import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeeStateParam;
import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeeStatePrintReq;
import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeeStateRes;
import kr.co.kfs.asseterp.biz.ast.dto.PreHoldFeeRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeePeriodParam;
import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeePeriodRes;
import kr.co.kfs.asseterp.biz.ast.mapper.AstBookFundFeeMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

/** AS-IS server/ast/Ast30_BookFundFee.java (selectByCompanyId L36, selectByCorpId L48) — 로그인 회사 고정 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstBookFundFeeService {

    /** insertRdFundMngFeeState 요청의 windowClassName (클라이언트가 고정값으로 보냄) */
    private static final String FUND_MNG_FEE_STATE_WINDOW = "Ast30_Tab_FundMngFeeState";

    private final AstBookFundFeeMapper mapper;

    public List<BookFundFeeCorpRes> searchCorps(UserPrincipal user, LocalDate holdDate, String searchText) {
        return mapper.selectByCompanyId(param(user, holdDate, null, searchText));
    }

    /** AS-IS Ast30_BookFundFee.selectByStdDate (X32 Ast30_Tab_FundMngFee) — 기준일의 펀드별 전월 잔액·당월 발생/인출·당월 잔액 */
    public List<BookFundFeeMonthRes> searchByStdDate(UserPrincipal user, LocalDate stdDate, String searchText) {
        return mapper.selectByStdDate(param(user, stdDate, null, searchText));
    }

    /** #1401 출력용 열 제목 — AS-IS Sys99_Print.insertRdBookFundMngFee의 string01·02, long01~04 순서 */
    private static final String[] MONTH_FEE_EXCEL_HEADERS = {"펀드코드", "펀드명", "전월 잔액", "당월 발생액", "당월 인출액", "당월 잔액"};

    /**
     * #1401 [엑셀다운로드] — AS-IS Ast30_Tab_FundMngFee.downLoad() → Sys99_Print.insertRdBookFundMngFee(원본 2026-11-02, CH-0110·0152)
     * + RD 리포트 Ast30_Rd_FundMngFee(/rxlsopt). AS-IS는 selectByStdDate 결과를 sys99_print에 쌓아 RD가 xlsx로 만든다.
     * TOBE는 같은 조회 결과를 같은 열 순서로 xlsx에 쓴다(행 순서 = AS-IS long05 = ROW_NUMBER() OVER (ORDER BY 펀드코드)).
     */
    public byte[] downloadByStdDate(UserPrincipal user, LocalDate stdDate, String searchText) {
        List<BookFundFeeMonthRes> rows = searchByStdDate(user, stdDate, searchText);
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("펀드보수당월증감");
            Row header = sheet.createRow(0);
            for (int i = 0; i < MONTH_FEE_EXCEL_HEADERS.length; i++) {
                header.createCell(i).setCellValue(MONTH_FEE_EXCEL_HEADERS[i]);
            }
            int r = 1;
            for (BookFundFeeMonthRes m : rows) {
                Row row = sheet.createRow(r++);
                row.createCell(0).setCellValue(m.fundCode() == null ? "" : m.fundCode());
                row.createCell(1).setCellValue(m.fundName() == null ? "" : m.fundName());
                row.createCell(2).setCellValue(m.preFee() == null ? 0 : m.preFee());     // checkLongNull
                row.createCell(3).setCellValue(m.occFee() == null ? 0 : m.occFee());
                row.createCell(4).setCellValue(m.drawFee() == null ? 0 : m.drawFee());
                row.createCell(5).setCellValue(m.fee() == null ? 0 : m.fee());
            }
            wb.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, "엑셀 파일을 만들 수 없습니다.", e);
        }
    }

    /** AS-IS Ast30_BookFundFee.selectByHoldDatePaging (L42) — 기간의 일자·운용사별 합계 (페이지 행 + 전체 건수) */
    public PageRes<BookFundFeePeriodRes> searchPeriod(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String searchText, int offset, int limit) {
        if (startDate == null || closeDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        BookFundFeePeriodParam param = new BookFundFeePeriodParam(user.getCompanyId(), startDate, closeDate,
                searchText == null ? "" : searchText, Math.max(offset, 0), limit > 0 ? limit : 100);
        return new PageRes<>(mapper.selectByHoldDatePagingTotal(param), mapper.selectByHoldDatePaging(param));
    }

    /** AS-IS Ast30_BookFundFee.selectFundFeeBook (L54, X31) — 기간의 일자·펀드별 보수원장. 펀드코드가 비면 전체 */
    public List<BookFundFeeStateRes> searchFundFeeBook(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String fundCode, String searchText) {
        return mapper.selectFundFeeBook(statePrm(user, startDate, closeDate, fundCode, searchText));
    }

    /**
     * AS-IS sys.Sys99_Print.insertRdFundMngFeeState L2000 (Ast30_Tab_FundMngFeeState [출력/다운로드])
     * ① 내 출력 자료 정리(화면 클래스) ② 같은 조건 조회 결과를 sys99_print에 삽입 ③ 새 groupId 반환
     */
    @Transactional
    public String insertRdFundMngFeeState(UserPrincipal user, BookFundFeeStatePrintReq req) {
        BookFundFeeStateParam p = statePrm(user, req.startDate(), req.closeDate(), req.fundCode(), req.searchText());
        long groupId = mapper.selectNextId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), FUND_MNG_FEE_STATE_WINDOW);
        mapper.insertPrintFundMngFeeState(p, user.getUserId(), FUND_MNG_FEE_STATE_WINDOW, groupId);
        return String.valueOf(groupId);
    }

    private static BookFundFeeStateParam statePrm(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String fundCode, String searchText) {
        if (startDate == null || closeDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        return new BookFundFeeStateParam(user.getCompanyId(), startDate, closeDate,
                fundCode == null || fundCode.isBlank() ? null : fundCode, searchText == null ? "" : searchText);
    }

    public List<BookFundFeeFundRes> searchFunds(UserPrincipal user, LocalDate holdDate, Long corpId, String searchText) {
        if (corpId == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        return mapper.selectByCorpId(param(user, holdDate, corpId, searchText));
    }

    /** AS-IS Ast30_BookFundFee.selectByPreHoldDate (L30, X28 Ast30_Lookup_HoldFee) — 기준일 전날 보수원장. 운용사 없으면 전체 */
    public List<PreHoldFeeRes> searchPreHold(UserPrincipal user, LocalDate holdDate, Long corpId, String searchText) {
        return mapper.selectByPreHoldDate(param(user, holdDate, corpId, searchText));
    }

    private static BookFundFeeParam param(UserPrincipal user, LocalDate holdDate, Long corpId, String searchText) {
        if (holdDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        return new BookFundFeeParam(user.getCompanyId(), holdDate, corpId, searchText == null ? "" : searchText);
    }
}
