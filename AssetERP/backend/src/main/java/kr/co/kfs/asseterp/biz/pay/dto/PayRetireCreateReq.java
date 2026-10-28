package kr.co.kfs.asseterp.biz.pay.dto;

/** Pay12_Lookup_RetireCreate [생성] — 체크 해제된 항목은 생성하지 않는다(f_calc_*_retire의 checkYn) */
public record PayRetireCreateReq(Long personId, boolean insureCheckYn, boolean taxCheckYn) {
}
