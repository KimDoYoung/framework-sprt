package kr.co.kfs.asseterp.biz.car.dto;

/** 출력/다운로드 자료 만들기 — month가 null이면 연 전체('%') */
public record CarJournalRdReq(Long infoId, String year, String month) {
}
