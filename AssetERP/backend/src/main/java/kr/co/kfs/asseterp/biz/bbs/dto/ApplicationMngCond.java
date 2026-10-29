package kr.co.kfs.asseterp.biz.bbs.dto;

import java.time.LocalDate;

/** AS-IS bbs11_application.selectByResultCheck 파라미터 */
public record ApplicationMngCond(Long companyId, LocalDate startDate, LocalDate closeDate, String appTypeCode, boolean resultCheck) {
}
