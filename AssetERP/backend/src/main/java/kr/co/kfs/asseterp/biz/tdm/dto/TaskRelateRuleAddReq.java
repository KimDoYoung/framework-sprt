package kr.co.kfs.asseterp.biz.tdm.dto;

/** 책무에 규정 연결 추가 한 줄 (AS-IS Tdm11_TaskRelateRule.update의 새 행). relateType '1' 법규 / '2' 내규 */
public record TaskRelateRuleAddReq(Long taskId, String relateType, String ruleCode) {
}
