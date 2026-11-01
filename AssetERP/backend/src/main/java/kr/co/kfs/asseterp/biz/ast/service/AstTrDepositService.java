package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.act.service.ActJournalService;
import kr.co.kfs.asseterp.biz.ast.dto.TrDepositRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrDepositSaveReq;
import kr.co.kfs.asseterp.biz.ast.dto.TrDepositSearchCond;
import kr.co.kfs.asseterp.biz.ast.mapper.AstTrDepositMapper;
import kr.co.kfs.asseterp.biz.ast.mapper.AstBookMapper;
import kr.co.kfs.asseterp.biz.ast.mapper.AstTrIntrinsicMapper;
import kr.co.kfs.asseterp.biz.ast.mapper.AstTrMapper;
import kr.co.kfs.asseterp.biz.ast.dto.TargetBookRes;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** 계좌이체 Ast06_Tab_TrDeposit (X06)·외화 Ast06_Tab_TrForDeposit (X10) — AS-IS ast.Ast06_Tr.selectDepositTr · selectById · update · updateDepositSellBookAmt. 삭제는 `POST /trs/delete`(U04) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstTrDepositService {

    private final AstTrDepositMapper mapper;
    private final AstTrIntrinsicMapper intrinsicMapper;
    private final AstTrMapper trMapper;
    private final AstBookMapper bookMapper;
    private final ActJournalService journalService;
    private final EmpTransInfoService transInfoService;

    /** ast06_tr.selectDepositTr — 조직은 LoginUser.getOrgCodeId(), 회사관리자(userId < 0)는 0. 계좌 0은 조건 없음 */
    public List<TrDepositRes> search(UserPrincipal user, LocalDate startDate, LocalDate closeDate, Long accountId, String abroType) {
        Long orgId = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        return mapper.selectDepositTr(new TrDepositSearchCond(user.getCompanyId(), user.getUserId(), orgId, startDate, closeDate,
                accountId == null || accountId == 0 ? null : accountId, abroType == null ? "1" : abroType));
    }

    /** ast06_tr.selectById */
    public TrDepositRes get(UserPrincipal user, Long trId) {
        TrDepositRes row = mapper.selectById(user.getCompanyId(), trId);
        if (row == null) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return row;
    }

    /**
     * Ast06_Lookup_TrDeposit.preUpdate → Ast06_Tr.update — 필수 검사 → 회계마감 검사 → (고칠 때) 전표가 있으면 승인 여부 검사 후 전표의 일자·적요·거래처 맞춤 → ast06_tr 저장.
     * 저장한 거래ID를 돌려준다. 분개 생성·예금원장 정리는 화면이 이어서 부른다
     */
    @Transactional
    public Long save(UserPrincipal user, TrDepositSaveReq r) {
        if (r.date() == null) throw invalid("일자는 필수입력 항목입니다");
        if (r.astClassTreeId() == null) throw invalid("출금계좌는 필수선택 항목입니다.");
        if (r.depositId() == null) throw invalid("입금계좌는 필수선택 항목입니다.");
        if (r.curCode() != null || r.fxRate() != null || r.forAmt() != null) return saveForeign(user, r);
        long amt = r.amt() == null ? 0 : r.amt();
        long bookAmt = r.fee() == null ? amt : amt + r.fee();   // preUpdate L318-323
        journalService.checkClose(user.getCompanyId(), r.date());
        String curCode = mapper.selectCurCode(r.astClassTreeId());
        if (curCode == null) curCode = "KRW";

        Long trId = r.trId();
        if (trId == null) {
            trId = mapper.selectNextId();
            mapper.insertTr(trId, user.getCompanyId(), user.getUserId(), curCode, bookAmt, r);
            return trId;
        }
        Long journalId = intrinsicMapper.selectJournalId(trId);
        if (journalId != null) {
            if (intrinsicMapper.selectJournalFixYn(trId)) throw invalid("전표가 승인완료 상태입니다. 승인 취소 후 저장하세요");
            intrinsicMapper.updateJournalTrInfo(journalId, r.date(), r.corpId(), r.note());
        }
        if (mapper.updateTr(user.getCompanyId(), curCode, bookAmt, r) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return trId;
    }

    /**
     * Ast06_Lookup_TrForDeposit.preUpdate → Ast06_Tr.update (X10) — 필수 검사(적용통화·적용환율·외화금액·원화금액 포함) → 회계마감 → 전표 맞춤 → ast06_tr 저장.
     * 장부금액은 건드리지 않는다(NEW는 비어 있다) — 분개 전에 화면이 {@link #updateSellBookAmt}를 부른다
     */
    private Long saveForeign(UserPrincipal user, TrDepositSaveReq r) {
        if (r.date() == null) throw invalid("일자는 필수입력 항목입니다");
        if (r.astClassTreeId() == null) throw invalid("출금계좌는 필수선택 항목입니다.");
        if (r.depositId() == null) throw invalid("입금계좌는 필수선택 항목입니다.");
        if (r.curCode() == null) throw invalid("적용통화는 필수선택 항목입니다");
        if (r.fxRate() == null || r.fxRate() == 0) throw invalid("적용환율은 필수입력 항목입니다");
        if (r.forAmt() == null || r.forAmt() == 0) throw invalid("외화금액은 필수입력 항목입니다");
        if (r.amt() == null || r.amt() == 0) throw invalid("원화금액은 필수입력 항목입니다");
        journalService.checkClose(user.getCompanyId(), r.date());

        Long trId = r.trId();
        if (trId == null) {
            trId = mapper.selectNextId();
            mapper.insertForTr(trId, user.getCompanyId(), user.getUserId(), new TrDepositSaveReq(trId, r.date(), r.astClassTreeId(), r.corpId(),
                    r.depositId(), r.amt(), r.fee(), r.note(), r.curCode(), r.fxRate(), r.forAmt()));
            return trId;
        }
        Long journalId = intrinsicMapper.selectJournalId(trId);
        if (journalId != null) {
            if (intrinsicMapper.selectJournalFixYn(trId)) throw invalid("전표가 승인완료 상태입니다. 승인 취소 후 저장하세요");
            intrinsicMapper.updateJournalTrInfo(journalId, r.date(), r.corpId(), r.note());
        }
        if (mapper.updateForTr(user.getCompanyId(), r) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        return trId;
    }

    /**
     * ast.Ast06_Tr.updateDepositSellBookAmt (X10, Ast06_Lookup_TrForDeposit.createJournal L396-) — 출금장부금액 UPDATE 뒤 분개를 만든다.
     * MODI(분개재생성)는 승인완료 전표면 실패, 아니면 분개를 지우고 예금원장을 정리한다. 출금 계좌가 KRW면 원화금액, 아니면 출금 계좌 보유잔고의 평균 장부단가 × 외화금액
     */
    @Transactional
    public void updateSellBookAmt(UserPrincipal user, Long trId, String actionName) {
        TrDepositRes tr = get(user, trId);
        String accCur = mapper.selectRawCurCode(tr.astClassTreeId());

        if ("MODI".equals(actionName)) {
            if (trMapper.countFixedJournalByTrId(trId) > 0) throw invalid("기존 평가분개 정리실패. 승인완료 전표입니다.");
            trMapper.deleteJournalTmpByTrId(trId);
            trMapper.deleteJournalDtlByTrId(trId);
            trMapper.deleteJournalByTrId(trId);
            String msg;
            try {
                msg = bookMapper.createDepositBook(user.getCompanyId(), tr.date());
            } catch (RuntimeException e) {
                throw invalid("update fail : \n" + e.getMessage());
            }
            if (!"Y".equals(msg)) throw invalid(msg);
        }

        long sellBookAmt;
        if ("KRW".equals(accCur)) {
            sellBookAmt = tr.amt() == null ? 0 : tr.amt();
        } else {
            TargetBookRes book = mapper.selectTargetBook(user.getCompanyId(), tr.date(), tr.astClassTreeId());
            if (book == null || book.bookAmt() == null || book.holdQty() == null || book.holdQty() == 0)
                throw invalid("출금계좌의 보유잔고를 찾을 수 없습니다.");
            double forAmt = tr.forAmt() == null ? 0 : tr.forAmt();
            sellBookAmt = (long) (book.bookAmt() / book.holdQty() * forAmt);
        }
        mapper.updateBookAmt(trId, sellBookAmt);
    }

    private BusinessException invalid(String msg) {
        return new BusinessException(ErrorCode.INVALID_INPUT, msg);
    }
}
