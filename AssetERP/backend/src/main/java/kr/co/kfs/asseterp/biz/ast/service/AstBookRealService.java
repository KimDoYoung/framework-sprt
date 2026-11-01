package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.ast.dto.BookRealRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookRealSaveReq;
import kr.co.kfs.asseterp.biz.ast.mapper.AstBookRealMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/** AS-IS Ast12_Lookup_RealDeposit → server/ast/Ast12_BookReal.java (selectByHoldDate L22 / update L27) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstBookRealService {

    private final AstBookRealMapper mapper;

    /** AS-IS selectByHoldDate(companyId, holdDate, searchText = %…%) */
    public List<BookRealRes> search(UserPrincipal user, LocalDate holdDate, String searchText) {
        return mapper.selectByHoldDate(user.getCompanyId(), holdDate, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /**
     * AS-IS update — 고친 행마다 실제수량(realQty)을 정한다: 통화 KRW면 원화 잔고(없으면 NULL), 그 밖은 외화 잔고.
     * UpdateDataModel처럼 ID가 이미 있으면 UPDATE, 없으면 그 ID로 INSERT. 저장한 날짜의 목록을 다시 읽어 요청한 행들을 순서대로 돌려준다
     */
    @Transactional
    public List<BookRealRes> save(UserPrincipal user, LocalDate holdDate, List<BookRealSaveReq> rows) {
        for (BookRealSaveReq req : rows) {
            if (req.bookRealId() == null || req.astClassTreeId() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "저장할 계좌 정보가 없습니다.");
            }
            Double realQty;
            if ("KRW".equals(req.curCode())) {
                realQty = req.realAmt() == null ? null : (double) req.realAmt();
            } else {
                realQty = req.realForAmt();
            }
            if (mapper.countById(user.getCompanyId(), req.bookRealId()) > 0) {
                mapper.update(user.getCompanyId(), holdDate, realQty, req);
            } else {
                mapper.insert(user.getCompanyId(), holdDate, realQty, req);
            }
        }
        List<BookRealRes> all = mapper.selectByHoldDate(user.getCompanyId(), holdDate, "%");
        List<BookRealRes> result = new ArrayList<>();
        for (BookRealSaveReq req : rows) {
            all.stream().filter(r -> req.astClassTreeId().equals(r.astClassTreeId())).findFirst().ifPresent(result::add);
        }
        return result;
    }
}
