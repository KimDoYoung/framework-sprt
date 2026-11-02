package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** AS-IS sys.Sys99_Print.insertRdFundMngFeeState 파라미터 (Ast30_Tab_FundMngFeeState [출력/다운로드]) — fundCode는 비면 전체 */
public record BookFundFeeStatePrintReq(LocalDate startDate, LocalDate closeDate, String fundCode, String searchText) {
}
