package kr.co.kfs.asseterp.biz.act.service;

import kr.co.kfs.asseterp.biz.act.dto.JournalDtlRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalPayMonthRes;
import kr.co.kfs.asseterp.biz.act.mapper.ActJournalDtlMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/act/Act03_JournalDtl.java (selectPayMonth L45) — 급여 전표확인 (S18) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActJournalDtlService {

    private final ActJournalDtlMapper mapper;

    /** act03_journal_dtl.selectPayMonth */
    public List<JournalPayMonthRes> searchPayMonth(UserPrincipal user, LocalDate payDate, String payType) {
        return mapper.selectPayMonth(user.getCompanyId(), payDate, payType);
    }

    /** act03_journal_dtl.selectByAstId (Act02_Tab_DepositIoList, U01) — AS-IS는 companyId를 선택한 원장 행에서 가져오지만 로그인 회사와 같다 */
    public List<JournalDtlRes> searchByAstId(UserPrincipal user, LocalDate date, Long astId, String drCrType) {
        return mapper.selectByAstId(user.getCompanyId(), date, astId, drCrType);
    }
}
