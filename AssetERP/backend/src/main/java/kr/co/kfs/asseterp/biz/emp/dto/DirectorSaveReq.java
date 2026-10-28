package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 임원정보 저장 행 (AS-IS emp.Emp31_Director.updateList) — 사원(personId)당 emp31_director 한 행 */
public record DirectorSaveReq(
        Long personId,
        LocalDate initAssignDate,
        LocalDate rcntAssingDate,
        LocalDate expireDate,
        Long assignCnt,
        String addTitle,
        String qualified,
        Long preferStock,
        Long commonStock,
        LocalDate endDate,
        String endReason,
        String note
) {
}
