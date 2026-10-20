package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 결재선 예외 저장 한 행 (G10). apprStepExceptId가 없거나 0 이하면 새 행, 회사는 서버가 로그인 회사로 채운다 */
public record EmpApprStepExceptSaveReq(Long apprStepExceptId, LocalDate regDate, Long personId, String useYn, String note) {
}
