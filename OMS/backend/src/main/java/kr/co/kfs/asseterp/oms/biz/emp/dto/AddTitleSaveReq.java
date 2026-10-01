package kr.co.kfs.asseterp.oms.biz.emp.dto;

import java.time.LocalDate;

/** 겸직 등록·수정 (AS-IS Emp04_Edit_AddTitle) */
public record AddTitleSaveReq(LocalDate startDate, LocalDate closeDate, Long orgCodeId, String titleCd, String posCd,
                              boolean orgHeadYn, String transReason) {
}
