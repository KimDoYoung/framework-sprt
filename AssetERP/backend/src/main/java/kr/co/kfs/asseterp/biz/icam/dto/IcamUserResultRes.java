package kr.co.kfs.asseterp.biz.icam.dto;

import java.time.LocalDate;

/** 사용자ID 처리결과 등록 한 줄 (AS-IS Icam55_IcamUserModel — icam55_icam_user.selectByDate, EE30) */
public record IcamUserResultRes(Long icamUserId, LocalDate regDate, String regTypeName, String companyName, String userName, String procTypeName,
                                Long apprId, String apprStatusCode, String regEmpName,
                                String procStateCode, String procStateName, LocalDate procDate, Long procEmpId, String procEmpName, String procNote) {
}
