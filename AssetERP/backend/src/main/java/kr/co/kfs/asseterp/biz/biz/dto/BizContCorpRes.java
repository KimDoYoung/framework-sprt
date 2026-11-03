package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/**
 * 계약사(Biz10_ContCorpModel) 한 건 — 가장 최근 이력(biz11)과 보수정보(biz12)를 펼친 모양.
 * biz10_cont_corp.selectByText·selectById, biz11_cont_history.selectByContCorpId(이력 목록)가 같이 쓴다.
 */
public record BizContCorpRes(
        Long contCorpId, Long companyId, Long contHistoryId, LocalDate regDate,
        String contCorpNm, String contStatusCd, String contStatusNm, String corpStatusCd, String corpStatusNm,
        String trType, String contPeriodCd, String contPeriodNm,
        LocalDate contDate, LocalDate startDate, LocalDate closeDate,
        String baseFee, String manager, String managerTel, String note,
        Long personId, String personNm, String address, String ceo,
        Long feeInfoId, String minFeeYn, Long manageMinFee, Long advMinFee, Long discrMinFee,
        String feeChargeType, String feeChargeTypeNm, String withYn, Long withFee,
        String minFeeStr, String withFeeStr) {
}
