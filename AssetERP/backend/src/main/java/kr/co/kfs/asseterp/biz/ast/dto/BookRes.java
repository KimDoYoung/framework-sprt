package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** 예금원장 한 행(Act02_Tab_DepositIoList) — Ast09_BookModel 중 이 화면과 RD 출력이 쓰는 속성 */
public record BookRes(Long bookId, Long companyId, LocalDate holdDate, Long astClassTreeId, String astClassTreeName,
                      String curCode, Double preDayAmt, Double holdQty,
                      String astMClassCode, String astSClassCode, String astSClassName, Long astSClassSeq, Long keepAccountSeq) {
}
