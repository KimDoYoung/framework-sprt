package kr.co.kfs.asseterp.biz.act.service;

import kr.co.kfs.asseterp.biz.act.mapper.ActJournalMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/** AS-IS server/act/Act02_Journal.java (createJournal L73) · Act04_GenLedger.java (checkClose L168 → checkLedgerClose L177) — U04 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActJournalService {

    private final ActJournalMapper mapper;

    /** act02_journal.createJournal — 'Y'가 아니면 돌려준 메시지로 실패, DB 예외는 `update fail : ` 머리말 */
    @Transactional
    public void createJournal(UserPrincipal user, Long trId, String trCode, String procType, boolean exceptYn) {
        String msg;
        try {
            msg = mapper.createJournal(procType, user.getCompanyId(), user.getUserId(), trCode, trId, exceptYn);
        } catch (RuntimeException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "update fail : \n" + e.getMessage());
        }
        if (!"Y".equals(msg)) throw new BusinessException(ErrorCode.INVALID_INPUT, msg);
    }

    /** act04_gen_ledger.checkLedgerClose — 마감이 있으면 AS-IS 메시지로 실패 */
    public void checkClose(Long companyId, LocalDate stdDate) {
        if (mapper.countCloseAfter(companyId, stdDate) > 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "처리일 이후의  회계마감 내역이 존재합니다.");
        }
        if (mapper.countCloseOn(companyId, stdDate) > 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "이미 회계마감이 완료되었습니다.");
        }
    }
}
