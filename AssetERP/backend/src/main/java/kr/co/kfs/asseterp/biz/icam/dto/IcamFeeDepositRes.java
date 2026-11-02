package kr.co.kfs.asseterp.biz.icam.dto;

import java.time.LocalDate;

/** AS-IS Icam11_FeeDepositModel — 위 그리드(펀드별 현재 입금계좌)와 아래 그리드(적용시작일별 이력)가 같은 모델을 쓴다 */
public record IcamFeeDepositRes(Long feeDepositId, String icamCompanyCode, String icamCompanyName, String fundCode, String fundName,
                                String curCode, String consignmentName, Long depositId, String depositName, LocalDate startDate) {
}
