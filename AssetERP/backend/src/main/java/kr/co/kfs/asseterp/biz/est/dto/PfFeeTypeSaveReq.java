package kr.co.kfs.asseterp.biz.est.dto;

import java.time.LocalDate;

/** 부동산PF 수수료 항목 저장 한 행 (AS-IS est.Est01_PfFeeType.update). pfFeeTypeId가 없거나 0 이하(임시 행)이면 새 행 */
public record PfFeeTypeSaveReq(Long pfFeeTypeId, String feeCode, Long seq, LocalDate startDate, LocalDate closeDate, String note) {
}
