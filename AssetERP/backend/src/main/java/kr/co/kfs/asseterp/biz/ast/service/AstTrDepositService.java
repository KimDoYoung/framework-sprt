package kr.co.kfs.asseterp.biz.ast.service;

import kr.co.kfs.asseterp.biz.act.service.ActJournalService;
import kr.co.kfs.asseterp.biz.ast.dto.TrDepositRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrDepositSaveReq;
import kr.co.kfs.asseterp.biz.ast.dto.TrDepositSearchCond;
import kr.co.kfs.asseterp.biz.ast.mapper.AstTrDepositMapper;
import kr.co.kfs.asseterp.biz.ast.mapper.AstTrIntrinsicMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** 계좌이체 Ast06_Tab_TrDeposit (X06) — AS-IS ast.Ast06_Tr.selectDepositTr · selectById · update. 삭제는 `POST /trs/delete`(U04) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AstTrDepositService {

    private final AstTrDepositMapper mapper;
    private final AstTrIntrinsicMapper intrinsicMapper;
    private final ActJournalService journalService;
    private final EmpTransInfoService transInfoService;

    /** ast06_tr.selectDepositTr — 조직은 LoginUser.getOrgCodeId(), 회사관리자(userId < 0)는 0. 계좌 0은 조건 없음 */
    public List<TrDepositRes> search(UserPrincipal user, LocalDate startDate, LocalDate closeDate, Long accountId) {
        Long orgId = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        return mapper.selectDepositTr(new TrDepositSearchCond(user.getCompanyId(), user.getUserId(), orgId, startDate, closeDate,
                accountId == null || accountId == 0 ? null : accountId));
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

    private BusinessException invalid(String msg) {
        return new BusinessException(ErrorCode.INVALID_INPUT, msg);
    }
}
