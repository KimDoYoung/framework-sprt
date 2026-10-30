package kr.co.kfs.asseterp.biz.crd.dto;

import java.time.LocalDate;

/** 법인카드 내역 한 행 (crd02_data) — 그리드 12열 + 편집 폼 26칸. confirmYn은 내역확정이면 'O', 아니면 '' */
public record CrdDataRes(
        Long dataId,
        Long companyId,
        String dataYm,
        String dataBankCode,
        String dataBankName,
        LocalDate approvalDt,
        String approvalTime,
        String partCode,
        String partName,
        String cardNo,
        String cardName,
        String franchiseName,
        String sectorName,
        String paymentMethod,
        Long monthlyPayments,
        Long approvalAmount,
        Long surtax,
        String approvalClassification,
        String approvalMethod,
        String approvalNo,
        String stateName,
        String taxTy,
        String merchantStatus,
        String merchantNo,
        String bizLicenseNo,
        String representativeName,
        String merchantAddr,
        String merchantPhone,
        String confirmYn
) {
}
