package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** [자료일괄생성]/[계약사별자료생성] — contCorpId 가 없으면 전체 계약사 */
public record BizFeeChargeBatchReq(LocalDate chargeDate, Long contCorpId) {
}
