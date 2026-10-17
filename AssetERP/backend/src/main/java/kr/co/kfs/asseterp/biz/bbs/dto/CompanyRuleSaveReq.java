package kr.co.kfs.asseterp.biz.bbs.dto;

/**
 * 회사규정 저장 (AS-IS Bbs15_Edit_CompanyRuleManager.update). 등록(복사)는 companyId·seq를 복사 대상 값으로 보낸다.
 * 등록은 창을 열 때 받은 새 ID(companyRuleId, GET next-id — AS-IS DBUtil.setSeq)로 첨부파일을 먼저 올릴 수 있다
 */
public record CompanyRuleSaveReq(Long companyRuleId, Long companyId, String ruleType, String companyRuleCode, String title, String content,
                                 String note, Long seq, String revisionDate, Long revisionNo, Boolean publicYn, String closeDate) {
}
