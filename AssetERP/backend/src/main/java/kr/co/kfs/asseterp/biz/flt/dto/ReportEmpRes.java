package kr.co.kfs.asseterp.biz.flt.dto;

/** 정기보고 점검에 쓰는 임직원 설정 (AS-IS flt02_emp.selectByDate 중 보고주기·보고시작일·입사일·계좌 없으면 보고 안 함) */
public record ReportEmpRes(String checkCycle, String rptStartDate, String hireDate, Boolean noAccountSkipYn) {
}
