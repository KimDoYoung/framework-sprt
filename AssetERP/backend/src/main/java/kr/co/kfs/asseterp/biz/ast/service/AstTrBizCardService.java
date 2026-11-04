package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.act.service.ActJournalService;
import kr.co.kfs.asseterp.biz.ast.dto.TrBizCardPromo;
import kr.co.kfs.asseterp.biz.ast.dto.TrBizCardRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrBizCardSaveReq;
import kr.co.kfs.asseterp.biz.ast.mapper.AstTrBizCardMapper;
import kr.co.kfs.asseterp.biz.ast.mapper.AstTrIntrinsicMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 법인카드 사용내역의 비품대장 등록 (AS-IS client/vi/ast/Ast06_Lookup_TrBizCard → server/ast/Ast06_Tr.java selectByCardApprovalNo L233 · updateDepn L574).
 * 회계마감 검사는 U04 {@link ActJournalService}, 비품원장 반영(ast09_book.createDepnBook)은 X03 {@link AstTrIntrinsicMapper}를 같이 쓴다
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstTrBizCardService {

    private final AstTrBizCardMapper mapper;
    private final AstTrIntrinsicMapper intrinsicMapper;
    private final ActJournalService journalService;

    /** retrieve() L195-212: 승인번호로 거래를 찾아 있으면 그 값, 없으면 새 거래의 기본값(일자 = 승인일, 적요 = 화면의 적요) */
    public TrBizCardRes open(UserPrincipal user, Long promoId, String note) {
        TrBizCardPromo promo = promo(user, promoId);
        TrBizCardRes tr = mapper.selectByCardApprovalNo(user.getCompanyId(), promo.approvalNo());
        if (tr != null) return tr;
        return new TrBizCardRes(null, promo.approvalDt(), null, null, null, null, null, null, note, promo.approvalNo());
    }

    /**
     * preUpdate() L243-276 → update() L278-302: 거래유형·종목 필수 → 회계마감 검사 → 거래 저장(없으면 새로, 있으면 바꾼 열만) → 비품원장 반영.
     * 비품원장 반영이 'Y'가 아니면 그 메시지로 실패(전부 되돌린다). 저장한 거래ID를 돌려준다
     */
    @Transactional
    public Long save(UserPrincipal user, TrBizCardSaveReq in) {
        if (in.trCode() == null || in.trCode().isEmpty()) throw invalid("거래유형은 필수선택 항목입니다");
        if (in.astClassTreeId() == null) throw invalid("종목(자산구분)은 필수선택 항목입니다");
        TrBizCardPromo promo = promo(user, in.promoId());
        TrBizCardRes tr = mapper.selectByCardApprovalNo(user.getCompanyId(), promo.approvalNo());
        journalService.checkClose(user.getCompanyId(), tr != null ? tr.date() : promo.approvalDt());

        Long trId;
        if (tr == null) {
            trId = mapper.selectNextId();
            long tax = promo.tax() == null ? 0L : promo.tax();
            long amt = promo.approvalAmount() == null ? 0L : promo.approvalAmount();
            mapper.insertTr(trId, user.getCompanyId(), user.getUserId(), promo.approvalDt(), amt, tax, amt - tax,
                    promo.approvalNo(), in.trCode(), in.corpId(), in.astClassTreeId(), in.note());
        } else {
            trId = tr.trId();
            mapper.updateTr(user.getCompanyId(), trId, in.trCode(), in.corpId(), in.astClassTreeId(), in.note());
        }
        String msg = intrinsicMapper.createDepnBook("P", trId);
        if (!"Y".equals(msg)) throw new BusinessException(ErrorCode.INVALID_INPUT, msg);
        return trId;
    }

    private TrBizCardPromo promo(UserPrincipal user, Long promoId) {
        TrBizCardPromo promo = promoId == null ? null : mapper.selectPromo(user.getCompanyId(), promoId);
        if (promo == null || promo.approvalNo() == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return promo;
    }

    private static BusinessException invalid(String msg) {
        return new BusinessException(ErrorCode.INVALID_INPUT, msg);
    }
}
