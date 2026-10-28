package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** emp31_director INSERT/UPDATE 한 행 (directorId는 서비스가 정한다) */
public record DirectorRow(
        Long directorId,
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
