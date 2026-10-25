package kr.co.kfs.asseterp.biz.tdm.dto;

/**
 * 책무관리현황 > 매뉴얼 규정/양식 연결 목록 한 행 (AS-IS Tdm43_ManlModel 중 Tdm43_Tab_ManlItemList 그리드·관련조문·허용항목 수정·점검항목 보기가 쓰는 속성).
 * 연관 건수(icsCntStr…)는 목록 조회에서는 0건이면 빈 글자, 한 건을 다시 읽을 때(selectById)는 "0건"이다(AS-IS 그대로).
 * selectById는 jobName·unuseYn을 채우지 않는다(AS-IS 그대로 — 작업기록 제안).
 */
public record ManlListRes(Long manlId, Long manlOrgId, Long companyId, Long orgId, Long exctId, Long roleId, String roleName,
                          Long taskId, String taskName, Long taskRelateDetailId, String taskRelateDetailName,
                          Long taskRelateDutyId, String taskRelateDutyName, Long manlDutyId,
                          String manlCode, String checkItem, String checkItemAddCode, String checkCycleCode, String checkMonth, String checkHow,
                          String checkEvidDocName, String refBasis, String startDate, String ceoDutyCode, String ceoDutyName,
                          String exctDutyMap, String exctDutyName, String importLevelCode, String importLevelName, Boolean unuseYn,
                          String orgName, String jobName, String icsCntStr, String icrCntStr, String formFileCntStr, String dcrCntStr) {
}
