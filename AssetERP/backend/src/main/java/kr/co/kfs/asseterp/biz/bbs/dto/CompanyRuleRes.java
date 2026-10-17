package kr.co.kfs.asseterp.biz.bbs.dto;

/** 회사규정 한 행 (AS-IS Bbs15_CompanyRuleModel 중 화면에 쓰는 속성). 날짜는 yyyy-MM-dd */
public record CompanyRuleRes(Long companyRuleId, Long companyId, String ruleType, String ruleTypeName, String companyRuleCode,
                             String title, String content, String note, Long seq, String revisionDate, Long revisionNo,
                             Boolean publicYn, String closeDate, String creName, String updName, String updDateStr, Long fileCnt) {
}
