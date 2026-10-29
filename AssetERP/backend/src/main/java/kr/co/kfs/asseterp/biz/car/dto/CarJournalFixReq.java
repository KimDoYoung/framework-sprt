package kr.co.kfs.asseterp.biz.car.dto;

/** 해당 기준년월 운행일지 확정(fixYn=true)·확정취소(fixYn=false) — AS-IS Tab.confirmAll·cancelAll → Car04_Journal.update */
public record CarJournalFixReq(Long infoId, String stdMonth, Boolean fixYn) {
}
