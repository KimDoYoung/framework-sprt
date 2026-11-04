package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 책무에 연결된 규정(법규/내규) 한 줄 (AS-IS tdm11_task_relate_rule.selectBySearchText — Tdm11_Lookup_TaskRelateRule 그리드) */
public record TaskRelateRuleRes(Long taskRelateRuleId, Long taskId, String relateType, String relateTypeName,
                                String ruleCode, String ruleName, LocalDate closeDate) {
}
