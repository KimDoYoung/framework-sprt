package kr.co.kfs.asseterp.biz.ast.service;

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

    private final AstBookMapper mapper;

    /** ast09_book.selectByHoldDate — searchText '%' */
    public List<BookRes> searchDeposits(UserPrincipal user, LocalDate holdDate) {
        return mapper.selectByHoldDate(user.getCompanyId(), holdDate, AST_TYPE_DEPOSIT, "%");
    }

    /** ast09_book.selectDepositCurGroupSum */
    public List<BookSumRes> searchDepositCurSums(UserPrincipal user, LocalDate holdDate) {
        return mapper.selectDepositCurGroupSum(user.getCompanyId(), holdDate);
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
