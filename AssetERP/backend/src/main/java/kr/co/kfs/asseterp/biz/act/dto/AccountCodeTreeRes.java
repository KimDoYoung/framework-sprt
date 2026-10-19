package kr.co.kfs.asseterp.biz.act.dto;

/** 계정과목 트리 한 행 — 전위 순서 평평한 목록 (AS-IS act01_account_code.selectTreeByCompanyId, level 0=최상위) */
public record AccountCodeTreeRes(Long accountCodeId, Long companyId, String accountCode, String accountName,
                                 String accountName2, String parentCode, String slipYn, Integer level) {
}
