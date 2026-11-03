package kr.co.kfs.asseterp.biz.icam.dto;

import java.time.LocalDate;

/** ICAM 사용자ID 신청서 한 줄 (AS-IS Icam55_IcamUserModel — icam55_icam_user.selectBySearchText·selectById) */
public record IcamUserRes(Long icamUserId, LocalDate regDate, String regType, String companyName, String userName,
                          Boolean procAddYn, Boolean procModiYn, Boolean procdelYn,
                          String procAddYnStr, String procModiYnStr, String procdelYnStr, String procTypeName,
                          Long apprId, String apprStatusCode, String apprStatusName,
                          String regContent, Long regEmpId, String regEmpName,
                          String procStateCode, String procStateName, LocalDate procDate, String procEmpName, String procNote) {
}
