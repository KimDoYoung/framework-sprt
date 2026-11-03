package kr.co.kfs.asseterp.biz.icam.dto;

import java.time.LocalDate;

/** 미사용ID 기록관리 한 줄 (AS-IS Icam55_IcamUserModel — icam55_icam_user.selectByProcStateCode, EE32) */
public record IcamStopAuthRes(Long icamUserId, String companyName, String userId, String userName, String email, LocalDate procDate,
                              String stopMonthPeriod, String state, LocalDate delDate, LocalDate unstopDate, String mngEmpName, String note) {
}
