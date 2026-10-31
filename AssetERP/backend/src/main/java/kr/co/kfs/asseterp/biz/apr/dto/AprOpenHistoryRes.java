package kr.co.kfs.asseterp.biz.apr.dto;

/** 열람기록 한 줄 (AS-IS Apr41_OpenHistoryModel — 열람일시·부서명·사원명·구분) */
public record AprOpenHistoryRes(Long openHistoryId, String openDateStr, String orgName, String personName, String loginModeName) {
}
