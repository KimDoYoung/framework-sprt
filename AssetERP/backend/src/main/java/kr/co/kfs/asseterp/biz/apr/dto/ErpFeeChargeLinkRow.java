package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** A69 Asset-ERP 사용료청구 본문이 쓰는 청구 행 (AS-IS Biz55_ErpFeeChargeModel 중 ErpFeeChargeHtmlData·insertLinkApprovals가 읽는 속성, V27) */
public record ErpFeeChargeLinkRow(Long erpFeeChargeId, Long erpContCorpId, String corpName, LocalDate chargeDate, LocalDate startDate, LocalDate closeDate,
                                  Long erpFee, Long dataFee, Long addSmsFee, Long addServerFee, Long addUserFee, Long etcAmt, String etcDesc,
                                  Long totalAmt, Long totalVat, Long chargeAmt, Long smsCount, Long serverUsage, Long userCount,
                                  Boolean addFeeSmsYn, Boolean addFeeServerYn, Boolean addFeeUserYn, String depositDueDay) {
}
