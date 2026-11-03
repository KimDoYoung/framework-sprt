package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** biz51_erp_cont_corp.selectByContStatusCode·selectById — AssetERP 계약사 한 행 (Biz51_Tab_ErpContCorp, EE22) */
public record BizErpContCorpRes(
        Long erpContCorpId,
        String contCorpNm,
        String serviceType,
        LocalDate firstContDate,
        LocalDate contDate,
        LocalDate contEndDate,
        String contStatusCd,
        LocalDate erpStartDate,
        LocalDate erpEndDate,
        String managerNm,
        String managerTel,
        String managerEmail,
        String companyCeo,
        String companyAddr,
        String note,
        Long companyId,
        Long corpId,
        String erpProductCd,
        String erpProductNm,
        String corpNm,
        String contStatusNm,
        String serviceTypeNm,
        String locationNm,
        String erpFeeNm,
        String fileCountStr
) {
}
