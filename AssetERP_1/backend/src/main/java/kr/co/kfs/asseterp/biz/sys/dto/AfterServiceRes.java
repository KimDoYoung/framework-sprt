package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDate;

/**
 * 개선사항 및 오류 통보 한 행 (AS-IS Sys90_AfterServiceModel, sys90_after_service + 회사명·코드명·정리된 본문).
 * organizeHappenReason = 본문 HTML에서 태그·엔티티를 뺀 글자(그리드용), confirmYn = 'true'/'false'.
 */
public record AfterServiceRes(
        Long afterServiceId,
        Long companyId,
        String companyNm,
        LocalDate happenDate,
        String regEmpNm,
        String typeYn,
        String afterServiceNm,
        String happenReason,
        String organizeHappenReason,
        String happenRemedy,
        String stateCd,
        String afterStateNm,
        String worker,
        LocalDate dueDate,
        String remarks,
        String confirmYn
) {
}
