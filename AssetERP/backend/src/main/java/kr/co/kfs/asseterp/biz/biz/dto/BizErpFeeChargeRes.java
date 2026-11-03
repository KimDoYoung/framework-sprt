package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/**
 * biz55_erp_fee_charge.selectByStdDate — AssetERP 사용료청구 한 행 (Biz55_Tab_ErpFeeCharge, EE23).
 * 금액·수량은 Long. fixYn 은 'true'/'false' 글자(비어 있으면 'false'). 화면이 쓰지 않는 열(부가세 5개·청구일/입금기한 문구·추가요금 여부)은 가져오지 않는다
 */
public record BizErpFeeChargeRes(
        Long erpFeeChargeId,
        Long erpContCorpId,
        Long companyId,
        String corpNm,
        String erpProductCd,
        LocalDate chargeDate,
        LocalDate startDate,
        LocalDate closeDate,
        Long erpFee,
        Long dataFee,
        Long smsCount,
        Long addSmsFee,
        Long serverUsage,
        Long addServerFee,
        Long userCount,
        Long addUserFee,
        Long etcAmt,
        String etcDesc,
        Long totalAmt,
        Long totalVat,
        Long chargeAmt,
        Long apprId,
        String fixYn,
        Long trId,
        String apprStatusCd,
        String apprStatusNm,
        String apprTitle,
        String managerEmail,
        String mailYn) {
}
