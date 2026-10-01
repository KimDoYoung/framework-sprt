package kr.co.kfs.asseterp.oms.biz.sys.dto;

/**
 * 로그인내역 (AS-IS Sys26_LoginModel, sys26_login)
 *
 * @param openDate  접속일시 (yyyy-MM-dd HH:mm:ss)
 * @param personNm  성명(사번 또는 로그인ID)
 * @param statusNm  상태구분 (LoginStatusCode)
 * @param loginModeNm 접속경로 (LoginModeCode)
 */
public record LoginHistoryRes(Long loginId, String openDate, String companyNm, String personNm, String statusNm,
                              String loginModeNm, String ipAddress, String os, String browser) {
}
