package kr.co.kfs.asseterp.biz.icam.dto;

import java.time.LocalDate;

/** 미사용ID 권한정지 신청 한 줄 (AS-IS Icam55_IcamUserModel — icam55_icam_user.selectBySearchText, regType '2', EE31) */
public record IcamStopRes(Long icamUserId, LocalDate regDate, String companyName, String userId, String userName, String email, String note,
                          Long apprId, String apprStatusCode, String apprStatusName, String regEmpName,
                          String procStateName, LocalDate procDate, String procEmpName, String procNote) {
}
