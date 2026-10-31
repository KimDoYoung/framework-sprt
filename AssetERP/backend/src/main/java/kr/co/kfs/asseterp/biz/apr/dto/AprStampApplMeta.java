package kr.co.kfs.asseterp.biz.apr.dto;

/** 날인신청 탭 오른쪽 칸 (apr16_stamp_doc.selectProvideCoByApprId — 제공처·제공목적·비고) */
public record AprStampApplMeta(String provideCo, String purpose, String note) {
}
