package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDateTime;

/** 법인카드 내역관리 한 행 (AS-IS Biz01_PromoModel — Biz01_Tab_CardManagement 그리드·Biz01_Edit_Account 입력). closeName은 마감이면 '마감', depnBookYn은 비품대장에 올랐으면 '등록완료' */
public record BizCardManagementRes(
        Long promoId,
        Boolean closeYn,
        String closeName,
        String htmlCardName,
        String regEmpName,
        LocalDateTime approvalDt,
        String franchiseName,
        String sectorName,
        Long provideAmt,
        String providePurCode,
        String providePurName,
        String provideContentCode,
        String provideContentName,
        Long accountCodeId,
        String accountCode,
        String accountName,
        String taxType,
        String taxTypeName,
        String note,
        String depnBookYn,
        Long realPersonId,
        String realPersonName
) {
}
