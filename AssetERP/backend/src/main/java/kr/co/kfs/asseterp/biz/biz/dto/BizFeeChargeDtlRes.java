package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/**
 * biz21_fee_charge_dtl — 최저보수 청구의 펀드·일자별 발생보수 상세 (EE33 엑셀·PDF 생성이 읽는다).
 * 집계 SQL(selectByGroupFundName)은 fundName·occFee만 채운다.
 */
public record BizFeeChargeDtlRes(
        Long feeChargeDtlId,
        String fundCode,
        String fundName,
        LocalDate occDate,
        Long totalNetAsset,
        Long occFee,
        String feeTypeName,
        Long targetAccountCnt,
        Long changeAccountCnt,
        Double feeRate
) {
}
