package kr.co.kfs.asseterp.biz.flt.dto;

/** 의무보유기간 기준 (AS-IS flt01_company_std.selectByDate의 lockUpCode·lockUpDays·lockUpCalcStdCode) — 기준관리가 없으면 서버는 null */
public record LockupStdRes(String lockUpCode, Long lockUpDays, String lockUpCalcStdCode) {
}
