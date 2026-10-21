package kr.co.kfs.asseterp.biz.flt.dto;

/** 화면 위 안내 두 줄: 보고주기(flt02_emp.checkCycle: 1 분기 / 2 월 / 없음) · 서약서 서명 상태(flt04_oath, 30이면 서명완료) */
public record AccountStatusRes(String checkCycle, String oathStatusCode, String oathStatusName) {
}
