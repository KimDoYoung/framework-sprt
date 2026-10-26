package kr.co.kfs.asseterp.biz.est.dto;

import java.time.LocalDate;

/** 부동산PF 수수료 항목 한 행 (AS-IS est01_pf_fee_type.selectByCompanyId). feeName·feeDesc는 코드 EstPfFeeCode의 이름·설명 */
public record PfFeeTypeRes(Long pfFeeTypeId, String feeCode, String feeName, String feeDesc, Long seq,
                           LocalDate startDate, LocalDate closeDate, String note) {
}
