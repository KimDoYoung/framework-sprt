package kr.co.kfs.asseterp.biz.tdm.dto;

/**
 * 책무구조도 제출 한 행 (AS-IS Tdm36_RoleReportModel 중 Tdm36_Tab_RoleReport 그리드·저장에 쓰는 속성, N14). 날짜는 yyyy-MM-dd.
 * updDateStr = 등록(변경)일시 yyyy-MM-dd HH24:MI:SS
 */
public record RoleReportRes(Long roleReportId, Long companyId, String boardOpenDate, String allcStdDate, String reportDate,
                            String boardOpenLoc, Long membTotCnt, Long membAttendCnt, String boardOpenAgenda, String membYesName,
                            String updName, String updDateStr, Long apprId, String apprStatusCode, String apprStatusName) {
}
