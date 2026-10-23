package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDate;

/** AS-IS Sys99_Print.insertRdDcrPreConfirm 파라미터 — dcrTypeCode는 콤보 값('%'=전체), searchText는 서버가 %…%로 감싼다 */
public record IcsDcrPreconfirmPrintReq(LocalDate startDate, LocalDate closeDate, String dcrTypeCode, String searchText) {
}
