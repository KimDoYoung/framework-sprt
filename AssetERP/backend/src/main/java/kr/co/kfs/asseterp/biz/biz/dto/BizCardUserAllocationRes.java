package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDateTime;

/** 법인카드 실사용자 배분 한 행 (AS-IS Biz01_PromoModel — Biz01_Tab_CardUserAllocation 그리드). closeName은 마감이면 '마감', regEmpName은 공통카드에 실사용자가 없으면 '공통' */
public record BizCardUserAllocationRes(
        Long promoId,
        Boolean closeYn,
        String closeName,
        String htmlCardName,
        LocalDateTime approvalDt,
        String franchiseName,
        String sectorName,
        Long provideAmt,
        String regEmpName
) {
}
