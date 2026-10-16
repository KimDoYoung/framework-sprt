package kr.co.kfs.asseterp.biz.sys.dto;

/**
 * 로그인 Mac 주소 신청 한 행 (AS-IS Sys27_LoginManageModel, sys27_login_manage + 회사명·성명·접속구분명).
 * openDateString·confirmDateString = 'YYYY-MM-DD HH24:MI:SS', confirmYn = 'true'/'false'.
 */
public record LoginManageRes(
        Long loginManageId,
        Long companyId,
        Long personId,
        String companyNm,
        String personNm,
        String openDateString,
        String placeCd,
        String placeNm,
        String macAddress,
        String reason,
        String confirmYn,
        String confirmDateString
) {
}
