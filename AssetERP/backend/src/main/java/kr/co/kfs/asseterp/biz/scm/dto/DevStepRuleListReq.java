package kr.co.kfs.asseterp.biz.scm.dto;

import java.util.List;

public record DevStepRuleListReq(List<Long> deleteIds, List<DevStepRuleSaveReq> rules) {
}
