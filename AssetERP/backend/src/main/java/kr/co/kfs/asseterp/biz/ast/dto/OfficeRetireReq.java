package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** ast13_book_depn.updateRetireDate — 비우면 폐기일 삭제 */
public record OfficeRetireReq(LocalDate retireDate) {
}
