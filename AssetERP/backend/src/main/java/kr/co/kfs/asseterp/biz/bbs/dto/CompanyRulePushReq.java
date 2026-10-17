package kr.co.kfs.asseterp.biz.bbs.dto;

import java.util.List;

/** 내보내기 (AS-IS bbs.Bbs15_CompanyRule.pushData): 고른 회사규정을 companyId 고객사로 복사 */
public record CompanyRulePushReq(Long companyId, List<Long> companyRuleIds) {
}
