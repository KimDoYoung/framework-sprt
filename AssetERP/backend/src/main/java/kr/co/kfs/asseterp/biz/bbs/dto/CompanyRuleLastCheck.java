package kr.co.kfs.asseterp.biz.bbs.dto;

/** bbs15_company_rule.countLastCheck: 같은 규정코드의 행 수와 책무연결 수 */
public record CompanyRuleLastCheck(Long allCnt, Long relateCnt) {
}
