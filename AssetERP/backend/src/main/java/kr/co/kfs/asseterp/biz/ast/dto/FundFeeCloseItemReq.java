package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** 결산처리·결산취소 대상 한 행 — 그리드 행에서 AS-IS 서버가 읽던 값만 */
public record FundFeeCloseItemReq(
        Long corpId,
        Long astClassTreeId,
        LocalDate holdDate,
        String curCode,
        String trCode,
        Double forFee,
        Long fee,
        Double fxRate,
        String closeYnName,
        Long trId
) {
}
