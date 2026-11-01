package kr.co.kfs.asseterp.biz.ast.dto;

/** 지출결의서에 딸린 비품 취득 거래 (ast06_tr.selectByExpenseId) — 비품대장 등록창 그리드. 읽어 온 줄은 모두 lockYn true */
public record ExpenseTrRes(Long trId, String trCode, String trName, Long astClassTreeId, String classTreeFullName, String note,
                           Long contAmt, boolean lockYn) {
}
