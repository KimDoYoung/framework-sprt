package kr.co.kfs.asseterp.oms.biz.org.dto;

import java.time.LocalDate;

/** org01_code INSERT 파라미터 */
public record OrgCodeRow(Long orgCodeId, Long companyId, String orgCd, LocalDate openDate, LocalDate closeDate,
                         String openReason, String closeReason, String note) {
}
