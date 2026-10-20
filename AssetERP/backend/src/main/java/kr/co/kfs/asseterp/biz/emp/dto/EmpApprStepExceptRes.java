package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** AS-IS Emp30_ApprStepExceptModel — 결재선 예외 한 행 (G10). 논리 값은 'true'/'false' 문자열 */
public record EmpApprStepExceptRes(Long apprStepExceptId, LocalDate regDate, Long personId, String personName, String useYn, String note) {
}
