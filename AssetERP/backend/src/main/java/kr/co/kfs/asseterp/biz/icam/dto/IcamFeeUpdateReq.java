package kr.co.kfs.asseterp.biz.icam.dto;

import java.math.BigDecimal;

/** AS-IS icam.Icam10_Fee.updateFee — 발생보수(fee)만 바꾼다 (Icam10_Lookup_FundFee) */
public record IcamFeeUpdateReq(BigDecimal fee) {
}
