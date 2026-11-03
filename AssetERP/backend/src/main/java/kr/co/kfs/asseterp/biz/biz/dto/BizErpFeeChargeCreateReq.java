package kr.co.kfs.asseterp.biz.biz.dto;

import java.util.List;

/** [생성] (AS-IS biz.Biz55_ErpFeeCharge.updateErpCompany) — dataYm = 청구년월 'YYYY.MM'(또는 'YYYY-MM'), erpContCorpIds = 계약사 조회창에서 고른 계약사 */
public record BizErpFeeChargeCreateReq(String dataYm, List<Long> erpContCorpIds) {
}
