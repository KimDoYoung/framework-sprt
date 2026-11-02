package kr.co.kfs.asseterp.biz.icam.dto;

import java.time.LocalDate;

/** AS-IS sys.Sys99_Print.insertRdFundMngFee 파라미터 (Icam10_Tab_FundMngFee [출력/다운로드]) — fundCode는 비면 전체 */
public record IcamFeePrintReq(String feeType, LocalDate startDate, LocalDate closeDate, String fundCode, String searchText) {
}
