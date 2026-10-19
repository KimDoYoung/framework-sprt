package kr.co.kfs.asseterp.biz.act.dto;

import java.util.List;

/** 계정과목복사 (AS-IS act.Act01_AccountCode.insertAdminCopy) — 기준 고객사의 계정과 그 상위 계정들을 고른 고객사들로 */
public record AccountCodeCopyReq(Long stdCompanyId, String accountCode, List<Long> companyIds) {
}
