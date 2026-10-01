package kr.co.kfs.asseterp.oms.biz.emp.dto;

import java.time.LocalDate;

/** emp04_add_title INSERT/UPDATE 파라미터 */
public record AddTitleRow(Long addTitleId, Long personId, Long addPersonId, LocalDate startDate, LocalDate closeDate,
                          Long orgCodeId, String titleCd, String transReason) {
}
