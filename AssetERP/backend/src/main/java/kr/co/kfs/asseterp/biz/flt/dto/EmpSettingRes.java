package kr.co.kfs.asseterp.biz.flt.dto;

import java.time.LocalDate;

/** 임직원매매 기본설정 한 줄 (AS-IS Flt02_EmpModel — flt02_emp.selectByPersonId): 적용시작일자·연간추가 투자한도·보고주기(FloorTrCheckCycle) */
public record EmpSettingRes(Long empId, LocalDate startDate, Long yearInvestLimit, String checkCycle, String checkCycleName) {
}
