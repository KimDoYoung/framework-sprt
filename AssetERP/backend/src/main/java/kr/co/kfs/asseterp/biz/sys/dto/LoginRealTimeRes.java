package kr.co.kfs.asseterp.biz.sys.dto;

/** 실시간 접속현황 한 행 (AS-IS Sys28_LoginRealTimeModel). loginTimeStr = 'YYYY-MM-DD HH24:MI:SS' */
public record LoginRealTimeRes(
        Long loginRealTimeId,
        String loginTimeStr,
        String ipAddress
) {
}
