package kr.co.kfs.asseterp.biz.bbs.dto;

import java.time.LocalDate;

/** 기타신청서 확인 그리드(AS-IS Bbs11_ApplicationModel) — 신청일·신청자·신청구분·신청상태·완료일·비고 + 우측 편집기 내용 */
public record ApplicationMngRes(Long applicationId, Long companyId, LocalDate appDate, Long appEmpId, String appEmpName,
                                String appType, String appTypeName, String appStatus, String appStatusName,
                                LocalDate closeDate, String note, String content) {
}
