package kr.co.kfs.asseterp.biz.flt.dto;

import java.time.LocalDate;

/** 임직원매매 기본설정 저장 한 줄 (AS-IS flt.Flt02_Emp.update → UpdateDataModel). empId가 0 이하면 새 행 */
public record EmpSettingSaveReq(Long empId, LocalDate startDate, Long yearInvestLimit, String checkCycle) {
}
