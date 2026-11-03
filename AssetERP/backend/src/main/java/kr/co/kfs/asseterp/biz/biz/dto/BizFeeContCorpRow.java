package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** biz11_cont_history.selectContCorp — 자료생성 대상 계약사와 그 분기의 청구 계산 기간 (자료생성 내부용) */
public record BizFeeContCorpRow(Long contCorpId, Long companyId, LocalDate feeCalcStartDate, LocalDate feeCalcCloseDate, Long calcDays) {
}
