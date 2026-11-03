package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** biz.Biz10_ContCorp.insertUpdate — 계약사(biz10) + 이력(biz11) + 보수정보(biz12)를 한 번에 저장. contCorpId·contHistoryId·feeInfoId 가 null 이면 새로 채번 */
public record BizContSaveReq(Long contCorpId, History history, Fee fee) {

    public record History(Long contHistoryId, LocalDate regDate, String contCorpNm, String contStatusCd, String corpStatusCd,
                          String trType, String contPeriodCd, LocalDate contDate, LocalDate startDate, LocalDate closeDate,
                          String baseFee, String manager, String managerTel, String note, Long personId, String address, String ceo) {
    }

    public record Fee(Long feeInfoId, String minFeeYn, Long manageMinFee, Long advMinFee, Long discrMinFee,
                      String feeChargeType, String withYn, Long withFee) {
    }
}
