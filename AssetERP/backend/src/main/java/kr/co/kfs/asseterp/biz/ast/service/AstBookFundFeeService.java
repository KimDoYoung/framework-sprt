package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeeCorpRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeeFundRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeeParam;
import kr.co.kfs.asseterp.biz.ast.mapper.AstBookFundFeeMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/ast/Ast30_BookFundFee.java (selectByCompanyId L36, selectByCorpId L48) — 로그인 회사 고정 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstBookFundFeeService {

    private final AstBookFundFeeMapper mapper;

    public List<BookFundFeeCorpRes> searchCorps(UserPrincipal user, LocalDate holdDate, String searchText) {
        return mapper.selectByCompanyId(param(user, holdDate, null, searchText));
    }

    public List<BookFundFeeFundRes> searchFunds(UserPrincipal user, LocalDate holdDate, Long corpId, String searchText) {
        if (corpId == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        return mapper.selectByCorpId(param(user, holdDate, corpId, searchText));
    }

    private static BookFundFeeParam param(UserPrincipal user, LocalDate holdDate, Long corpId, String searchText) {
        if (holdDate == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        return new BookFundFeeParam(user.getCompanyId(), holdDate, corpId, searchText == null ? "" : searchText);
    }
}
