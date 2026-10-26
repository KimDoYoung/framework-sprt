package kr.co.kfs.asseterp.biz.fnd.dto;

/** 자산별 펀드 한 행 (P10, AS-IS Fnd10_BookModel 중 펀드코드·펀드명 — bookId는 원본이 만드는 row_number) */
public record BookRelateFndRes(Long bookId, String fundCode, String fundName) {
}
