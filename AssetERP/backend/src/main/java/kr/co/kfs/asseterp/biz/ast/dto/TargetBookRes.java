package kr.co.kfs.asseterp.biz.ast.dto;

/** AS-IS ast09_book.selectTargetBook — 외화 계좌이체(X10)가 쓰는 보유잔고(장부금액·보유수량)만 */
public record TargetBookRes(
        Long bookAmt,
        Double holdQty
) {
}
