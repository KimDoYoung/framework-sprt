package kr.co.kfs.asseterp.biz.ast.service;
import kr.co.kfs.asseterp.biz.ast.dto.PreDepositBookRes;

import kr.co.kfs.asseterp.biz.ast.dto.BookFullRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookPeriodRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookRes;
import kr.co.kfs.asseterp.biz.ast.dto.DepositDiffRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookSumRes;
import kr.co.kfs.asseterp.biz.ast.dto.FinanceGroupRes;
import kr.co.kfs.asseterp.biz.ast.dto.HoldBookRes;
import kr.co.kfs.asseterp.biz.ast.mapper.AstBookMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/ast/Ast09_Book.java (selectByHoldDate L28 · selectDepositCurGroupSum L148 · createDepositBook L163) — 일일자금관리 U01 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstBookService {

    /** 자산구분 1 = 예금 */
    private static final String AST_TYPE_DEPOSIT = "1";
    private static final String FINANCE_WINDOW = "Ast09_Tab_FinanceBook";
    private static final String PERIOD_WINDOW = "Ast09_Tab_DepositBookPeriod";
    private static final String FINANCE_PERIOD_WINDOW = "Ast09_Tab_FinanceBookPeriod";

    private final AstBookMapper mapper;

    /** ast09_book.selectByHoldDate (astType 1, depositDiffYn true — W21 예금잔고대사), searchText = %…% */
    public List<DepositDiffRes> searchDepositDiffs(UserPrincipal user, LocalDate holdDate, String searchText) {
        return mapper.selectDepositDiff(user.getCompanyId(), holdDate, AST_TYPE_DEPOSIT, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** ast09_book.selectByHoldDate — searchText '%' */
    public List<BookRes> searchDeposits(UserPrincipal user, LocalDate holdDate) {
        return mapper.selectByHoldDate(user.getCompanyId(), holdDate, AST_TYPE_DEPOSIT, "%", null);
    }

    /**
     * ast09_book.selectByHoldDate (W06 Ast09_Lookup_Book) — 보유일 현재 금융자산(astType 2) 보유원장. abroType 1 국내(KRW)·2 국외, 검색어는 보관처·계좌·자산명 포함 검색
     */
    public List<HoldBookRes> searchHolds(UserPrincipal user, LocalDate holdDate, String abroType, String searchText) {
        return mapper.selectHoldList(user.getCompanyId(), holdDate, "2", abroType, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /**
     * ast09_book.selectByHoldDate (W12 Ast09_Tab_FinanceBook · W13 Ast09_Tab_FinanceForBook) — astType 2 금융자산, searchText는 "%…%".
     * abroType은 W13(외화)만 "2"(통화가 KRW가 아닌 것)를 준다. W12는 주지 않는다(null = 전체).
     */
    public List<BookFullRes> searchFinanceBooks(UserPrincipal user, LocalDate holdDate, String abroType, String searchText) {
        return mapper.selectFinanceBook(user.getCompanyId(), holdDate, "2", abroType, like(searchText));
    }

    /**
     * Sys99_Print.insertRdFinanceBook L664 — 내 지난 출력 자료를 지우고 현재 조건의 목록을 sys99_print에 쌓아 출력그룹ID를 돌려준다
     * (RD 뷰어 mrd Ast09_Rd_FinanceBook이 rdGroupId로 읽는다)
     */
    @Transactional
    public Long insertRdFinanceBook(UserPrincipal user, LocalDate holdDate, String searchText) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        long groupId = mapper.selectNextId();
        mapper.deletePrint(companyId, personId, FINANCE_WINDOW);
        for (BookFullRes b : mapper.selectFinanceBook(companyId, holdDate, "2", null, like(searchText))) {
            mapper.insertPrintFinance(mapper.selectNextId(), companyId, personId, FINANCE_WINDOW, groupId, b);
        }
        return groupId;
    }

    /** ast09_book.getHoldDate — [상신] 전에 상신할 내용이 있는지 보는 종목유형별 합계 */
    public List<FinanceGroupRes> searchFinanceGroups(UserPrincipal user, LocalDate holdDate) {
        return mapper.selectFinanceGroup(user.getCompanyId(), holdDate);
    }

    private static String like(String searchText) {
        return "%" + (searchText == null ? "" : searchText) + "%";
    }

    /** ast09_book.selectDepositCurGroupSum */
    public List<BookSumRes> searchDepositCurSums(UserPrincipal user, LocalDate holdDate) {
        return mapper.selectDepositCurGroupSum(user.getCompanyId(), holdDate);
    }

    /**
     * ast09_book.selectByHoldDatePeriod (Ast09_Tab_DepositBookPeriod, U02) — 조회하면서 sys99_print를 쓴다: ① 내 지난 자료를 지움 ② 시작일 전날부터 종료일까지 영업달력 일자마다
     * selectByHoldDate 결과를 한 그룹(groupId)으로 쌓음 ③ 그 그룹에서 전일 대비 증감액과 함께 시작일~종료일만 읽음
     */
    @Transactional
    public List<BookPeriodRes> searchDepositsPeriod(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String depositIdStr, String searchText) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        long groupId = mapper.selectNextId();

        mapper.deletePrint(companyId, personId, PERIOD_WINDOW);

        for (LocalDate day : mapper.selectCalendarDays(companyId, startDate.minusDays(1), closeDate)) {
            for (BookFullRes b : mapper.selectByHoldDateFull(companyId, day, AST_TYPE_DEPOSIT, searchText, depositIdStr)) {
                mapper.insertPrintPeriod(mapper.selectBatchId(), companyId, personId, PERIOD_WINDOW, groupId, b);
            }
        }
        return mapper.selectByHoldDatePeriod(groupId, startDate, closeDate);
    }

    /**
     * ast09_book.selectByHoldDatePeriod (Ast09_Tab_FinanceBookPeriod, W14, astType 2) — U02와 같은 순서로 sys99_print를 다시 쌓고
     * 시작일~종료일만 읽는다(depositIdStr 없음 = 전체, 정렬은 금융자산 selectByHoldDate 그대로)
     */
    @Transactional
    public List<BookFullRes> searchFinancePeriod(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String searchText) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        long groupId = mapper.selectNextId();

        mapper.deletePrint(companyId, personId, FINANCE_PERIOD_WINDOW);

        String like = like(searchText);
        for (LocalDate day : mapper.selectCalendarDays(companyId, startDate.minusDays(1), closeDate)) {
            for (BookFullRes b : mapper.selectFinanceBook(companyId, day, "2", null, like)) {
                mapper.insertPrintPeriod(mapper.selectBatchId(), companyId, personId, FINANCE_PERIOD_WINDOW, groupId, b);
            }
        }
        return mapper.selectFinancePeriod(groupId, startDate, closeDate);
    }

    /**
     * Sys99_Print.insertRdFinanceBookPeriod L3631 — 출력그룹ID를 먼저 받고 내 자료를 지운 뒤 조회(searchFinancePeriod, 자기 그룹을 다시 쌓는다)한 결과를
     * 엑셀 양식 열로 새 그룹에 쌓는다. 조회용 그룹의 자료도 남는다(AS-IS 그대로)
     */
    @Transactional
    public Long insertRdFinanceBookPeriod(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String searchText) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        long groupId = mapper.selectNextId();
        mapper.deletePrint(companyId, personId, FINANCE_PERIOD_WINDOW);
        for (BookFullRes b : searchFinancePeriod(user, startDate, closeDate, searchText)) {
            mapper.insertPrintFinancePeriodExcel(mapper.selectNextId(), companyId, personId, FINANCE_PERIOD_WINDOW, groupId, b);
        }
        return groupId;
    }

    /** ast09_book.createDepositBook — 'Y'가 아니면 돌려준 메시지로 실패 */
    @Transactional
    public void createDepositBook(UserPrincipal user, LocalDate stdDate) {
        String msg;
        try {
            msg = mapper.createDepositBook(user.getCompanyId(), stdDate);
        } catch (RuntimeException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "update fail : \n" + e.getMessage());
        }
        if (!"Y".equals(msg)) throw new BusinessException(ErrorCode.INVALID_INPUT, msg);
    }

    /** ast09_book.selectPreDepositByHoldDate (Ast09_Tab_PreDepositBook, X19) — 검색어는 "%…%" */
    public List<PreDepositBookRes> searchPreDeposits(UserPrincipal user, LocalDate holdDate, String searchText) {
        return mapper.selectPreDepositByHoldDate(user.getCompanyId(), holdDate, like(searchText), null, null);
    }
}
