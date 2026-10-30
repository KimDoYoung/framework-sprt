package kr.co.kfs.asseterp.biz.crd.dto;

/** crd.Crd02_Data.selectByAmt — 조건에 맞는 내역의 승인금액·부가세 합계 (내역이 없으면 둘 다 null) */
public record CrdDataAmountRes(Long totalApprovalAmount, Long totalSurtax) {
}
