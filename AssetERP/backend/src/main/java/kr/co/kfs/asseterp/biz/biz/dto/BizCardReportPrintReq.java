package kr.co.kfs.asseterp.biz.biz.dto;

/** [조회] 때 RD 자료 만들기 (AS-IS sys.Sys99_Print.insertCardReport·2·3) — year 'yyyy', month '01'~'12', cardRealUserType '관리자'|'실사용자'(실사용자 관리를 안 쓰는 회사는 서버가 '관리자'로 본다) */
public record BizCardReportPrintReq(String year, String month, String cardRealUserType) {
}
