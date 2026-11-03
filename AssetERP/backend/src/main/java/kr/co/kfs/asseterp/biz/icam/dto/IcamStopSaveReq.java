package kr.co.kfs.asseterp.biz.icam.dto;

import java.time.LocalDate;

/** 권한정지 신청 그리드 저장 한 줄 (AS-IS Icam55_IcamUser.update UpdateDataModel — icamUserId 0 이하는 새 행) */
public record IcamStopSaveReq(Long icamUserId, LocalDate regDate, String companyName, String userId, String userName, String email) {
}
