package kr.co.kfs.asseterp.biz.flt.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.flt.dto.BookMonthEvalReq;
import kr.co.kfs.asseterp.biz.flt.dto.BookMonthRes;
import kr.co.kfs.asseterp.biz.flt.dto.BookMonthSaveReq;
import kr.co.kfs.asseterp.biz.flt.dto.BookMonthTargetRes;
import kr.co.kfs.asseterp.biz.flt.mapper.FltBookMonthMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * 월말 평가금액 (AS-IS server/flt/Flt12_BookMonth.java selectByBookDate L26 / checkBookMonth L31 / update L41 / insertBookAmt L75) —
 * 로그인 사용자(회사·사원) 본인의 월말 보유만 다룬다
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FltBookMonthService {

    private final FltBookMonthMapper mapper;

    /** AS-IS selectByBookDate — 검색어는 `%검색어%`(클라이언트가 붙이던 것) */
    public List<BookMonthRes> search(UserPrincipal user, Long accountId, String startDate, String closeDate, String searchText, boolean myAccountYn) {
        return mapper.selectBookMonths(user.getCompanyId(), user.getUserId(), accountId, startDate, closeDate, like(searchText), myAccountYn);
    }

    /** AS-IS checkBookMonth — 평가금액이 비어 있으면 실패 메시지 */
    public void check(UserPrincipal user, String startDate, String closeDate, boolean myAccountYn) {
        if (mapper.countEmptyBookAmt(user.getCompanyId(), user.getUserId(), startDate, closeDate, myAccountYn) > 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "월말 평가금액을 입력한 후 저장해주세요");
        }
    }

    /**
     * AS-IS update — 평가금액(bookAmt)만 바뀐다. flt12 행이 아직 없으면(행번호가 ID 자리에 들어온 행) 새 ID로 INSERT,
     * 있으면 UPDATE하고 flt11_book의 보유금액도 같은 값으로 고친다 → selectById로 다시 읽어 요청 순서대로
     */
    @Transactional
    public List<BookMonthRes> update(UserPrincipal user, List<BookMonthSaveReq> rows) {
        List<BookMonthRes> saved = new ArrayList<>();
        for (BookMonthSaveReq req : rows) {
            boolean exists = req.bookMonthId() != null && mapper.countBookMonth(req.bookMonthId(), user.getCompanyId(), user.getUserId()) > 0;
            Long id = exists ? req.bookMonthId() : mapper.selectNextId();
            mapper.updateBookAmt(user.getCompanyId(), user.getUserId(), req.accountId(), req.itemType(), req.itemName(), req.itemCode(),
                    req.bookDate(), req.bookAmt(), Boolean.TRUE.equals(req.stkPriceYn()) ? "true" : "false");
            if (exists) {
                mapper.updateBookMonth(id, user.getCompanyId(), user.getUserId(), req.bookAmt());
            } else {
                mapper.insertBookMonth(id, user.getCompanyId(), user.getUserId(), req.accountId(), req.itemName(), req.itemType(),
                        req.bookDate(), req.bookAmt(), req.itemCode());
            }
            saved.add(mapper.selectBookMonthById(id));
        }
        return saved;
    }

    /** AS-IS insertBookAmt — 평가금액이 비어 있는 월말 보유에 취득금액(type 1) 또는 상장주식 종가 평가금액(type 2)을 넣는다 → 처리한 건수 */
    @Transactional
    public int evaluate(UserPrincipal user, BookMonthEvalReq req) {
        List<BookMonthTargetRes> targets = mapper.selectInsertBookAmtTarget(user.getCompanyId(), user.getUserId(), req.accountId(),
                req.startDate(), req.closeDate(), like(req.searchText()), req.type());
        for (BookMonthTargetRes t : targets) {
            mapper.updateBookAmt(user.getCompanyId(), user.getUserId(), t.accountId(), t.itemType(), t.itemName(), t.itemCode(),
                    t.bookDate(), t.bookAmt(), t.stkPriceYn());
            if (mapper.countBookMonth(t.bookMonthId(), user.getCompanyId(), user.getUserId()) > 0) {
                mapper.updateBookMonth(t.bookMonthId(), user.getCompanyId(), user.getUserId(), t.bookAmt());
            } else {
                mapper.insertBookMonth(t.bookMonthId(), user.getCompanyId(), user.getUserId(), t.accountId(), t.itemName(), t.itemType(),
                        t.bookDate(), t.bookAmt(), t.itemCode());
            }
        }
        return targets.size();
    }

    private static String like(String text) {
        return "%" + (text == null ? "" : text) + "%";
    }
}
