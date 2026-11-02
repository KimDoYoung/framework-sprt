package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

public record FundFeeCloseRdReq(LocalDate holdDate, Long corpId, String searchText) {
}
