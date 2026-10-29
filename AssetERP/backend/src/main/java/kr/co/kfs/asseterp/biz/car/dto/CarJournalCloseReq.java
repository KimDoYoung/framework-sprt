package kr.co.kfs.asseterp.biz.car.dto;

/** 운행일지 마감(closeYn=true)·마감취소(false) — 그 차량·기준년월 전부 */
public record CarJournalCloseReq(Long infoId, String stdMonth, Boolean closeYn) {
}
