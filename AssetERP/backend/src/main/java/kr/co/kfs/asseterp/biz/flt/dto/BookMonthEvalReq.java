package kr.co.kfs.asseterp.biz.flt.dto;

/** 평가처리 — type "1" 평가금액을 취득금액으로 / "2" 상장주식 평가금액 계산 (AS-IS Flt12_BookMonth.insertBookAmt) */
public record BookMonthEvalReq(
        Long accountId,
        String startDate,
        String closeDate,
        String searchText,
        String type) {
}
