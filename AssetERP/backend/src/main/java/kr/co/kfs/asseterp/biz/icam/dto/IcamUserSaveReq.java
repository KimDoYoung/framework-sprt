package kr.co.kfs.asseterp.biz.icam.dto;

import java.time.LocalDate;

/** 사용자ID 신청서 저장 한 줄 (AS-IS Icam55_IcamUser.update UpdateDataModel — icamUserId 없거나 0 이하는 새 행) */
public record IcamUserSaveReq(Long icamUserId, LocalDate regDate, String companyName, String userName,
                              Boolean procAddYn, Boolean procModiYn, Boolean procdelYn, String regContent) {
}
