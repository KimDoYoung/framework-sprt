package kr.co.kfs.asseterp.biz.sys.dto;

/**
 * 로그인 내역 한 행 (AS-IS Sys26_LoginModel, sys26_login + 회사명·성명(사번/ID)·상태·접속경로명).
 * openDateString = 'YYYY-MM-DD HH24:MI:SS'. 일반 사원은 사원 테이블, 상태 '20'(관리자)은 sys02_user에서 읽는다.
 */
public record LoginHistoryRes(
        Long loginId,
        String openDateString,
        String companyNm,
        String personNm,
        String statusNm,
        String loginModeNm,
        String ipAddress,
        String os,
        String browser
) {
}
