package kr.co.kfs.asseterp.biz.emp.dto;

import java.util.List;

/** 승인신청 뒤 결재문서 ID 기록 (AS-IS Emp24_JointLeave.updateApprId — 고른 공동연차 목록 + apprId) */
public record JointLeaveApprIdReq(List<Long> ids, Long apprId) {
}
