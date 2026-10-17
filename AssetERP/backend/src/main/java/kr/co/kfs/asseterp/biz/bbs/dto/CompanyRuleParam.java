package kr.co.kfs.asseterp.biz.bbs.dto;

/** 엑셀 업로드·내보내기·저장 SQL 파라미터 (AS-IS Bbs15_CompanyRuleModel) */
public record CompanyRuleParam(Long companyRuleId, Long companyId, String ruleType, String title, String content, String note, Long seq,
                               String revisionDate, Long revisionNo, Boolean publicYn, String companyRuleCode, String closeDate, String creName) {
}
