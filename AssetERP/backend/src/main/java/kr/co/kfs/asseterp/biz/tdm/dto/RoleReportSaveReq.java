package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/**
 * 책무구조도 제출 저장 한 행 (AS-IS Tdm36_RoleReport.update, UpdateDataModel).
 * roleReportId가 없거나 ≤ 0이면 INSERT(등록한 행), 아니면 UPDATE
 */
public record RoleReportSaveReq(
        Long roleReportId,
        LocalDate boardOpenDate,
        LocalDate allcStdDate,
        LocalDate reportDate,
        String boardOpenLoc,
        Long membTotCnt,
        Long membAttendCnt,
        String boardOpenAgenda,
        String membYesName) {
}
