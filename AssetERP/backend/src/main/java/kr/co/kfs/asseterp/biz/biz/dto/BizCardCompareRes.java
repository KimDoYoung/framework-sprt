package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDateTime;

/** 마감 때 카드내역 업로드 금액과 내역관리 금액이 다른 건 (AS-IS crd02_data.selectByCompareAmt — Crd02_Lookup_OtherList 그리드) */
public record BizCardCompareRes(
        String cardNo,
        LocalDateTime approvalDt,
        String franchiseName,
        String sectorName,
        Long approvalAmount,
        Long provideAmt
) {
}
