package kr.co.kfs.asseterp.biz.crd.dto;

import java.time.LocalDate;

/** crd.Crd02_Data.update / copyUpdate (Crd02_Edit_DataUpload 저장·등록(복사)) — dataId가 없거나 0 이하면 새 내역. 회사는 로그인 값 */
public record CrdDataSaveReq(
        Long dataId,
        String dataYm,
        String dataBankCode,
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
        String merchantPhone
) {
}
