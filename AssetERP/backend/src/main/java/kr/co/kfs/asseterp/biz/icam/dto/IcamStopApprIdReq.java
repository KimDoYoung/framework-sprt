package kr.co.kfs.asseterp.biz.icam.dto;

import java.util.List;

/** 권한정지 신청서 상신ID 기록 (AS-IS Icam55_IcamUser.updateApprIds — 화면의 모든 행) */
public record IcamStopApprIdReq(List<Long> ids, Long apprId) {
}
