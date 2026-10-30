package kr.co.kfs.asseterp.biz.biz.dto;

/** 세 보고서의 출력 그룹 ID (AS-IS rdGroupId1·2·3 — RD 리포트의 rdGroupId, rdGroupId2, rdGroupId3). 상신에는 1·2를 쓴다 */
public record BizCardReportPrintRes(String groupId1, String groupId2, String groupId3) {
}
