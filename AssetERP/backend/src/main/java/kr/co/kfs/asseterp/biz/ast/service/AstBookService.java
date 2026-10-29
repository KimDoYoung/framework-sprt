package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.ast.dto.BookFullRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookPeriodRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookSumRes;
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
    private static final String PERIOD_WINDOW = "Ast09_Tab_DepositBookPeriod";

    private final AstBookMapper mapper;

    /** ast09_book.selectByHoldDate — searchText '%' */
    public List<BookRes> searchDeposits(UserPrincipal user, LocalDate holdDate) {
        return mapper.selectByHoldDate(user.getCompanyId(), holdDate, AST_TYPE_DEPOSIT, "%", null);
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
}
