package kr.co.kfs.asseterp.biz.apr.dto;

/** A69 본문의 기준값 (AS-IS biz52_erp_fee.selectByStartDate, Biz52_ErpFeeModel 중 읽는 속성, V27) */
public record ErpFeeLinkRow(Long smsBaseCount, Long smsAddPrice, Long serverBaseUsage, Long serverAddUnit, Long serverAddPrice,
                            Long userBaseCount, Long userAddPrice, String userCountStdStr) {
}
