package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** 선급금/선급비용 한 줄 (ast09_book.selectPreDepositByHoldDate, X19) */
public record PreDepositBookRes(Long bookId, LocalDate stdDate, String astSClassName, String astClassTreeName, String corpName,
                                Double holdQty, Long astClassTreeId) {
}
