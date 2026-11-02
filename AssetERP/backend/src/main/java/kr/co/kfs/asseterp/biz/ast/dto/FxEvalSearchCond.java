package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** AS-IS ast06_tr.selectFxEvalList 파라미터 (holdDate = closeDate, keepAccountId = accountId) */
public record FxEvalSearchCond(Long companyId, LocalDate holdDate, Long keepAccountId, Long corpId, String assetType) {
}
