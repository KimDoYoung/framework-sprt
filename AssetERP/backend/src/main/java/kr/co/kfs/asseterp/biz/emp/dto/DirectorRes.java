package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 임원정보 관리 그리드 행 (AS-IS Emp31_DirectorModel, emp31_director.selectByText). personId가 행 키 — directorId는 조회마다 매기는 순번 */
public record DirectorRes(
        Long directorId,
        Long personId,
        String personName,
        String chnName,
        String posName,
        String officerYn,
        String ctzNo,
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
