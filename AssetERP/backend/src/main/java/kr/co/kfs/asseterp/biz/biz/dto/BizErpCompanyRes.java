package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** biz51_erp_cont_corp.selectErpCompany — 계약사 조회창(Biz55_Lookup_ErpCompany) 한 행. 청구가 아직 없는 계약사만 */
public record BizErpCompanyRes(
        Long erpContCorpId,
        Long companyId,
        String corpName,
        LocalDate contEndDate,
        LocalDate erpEndDate,
        String serviceTypeName,
        String chargeCalcMonthType) {
}
