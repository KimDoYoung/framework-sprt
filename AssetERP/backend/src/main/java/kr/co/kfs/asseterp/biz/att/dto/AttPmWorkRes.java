package kr.co.kfs.asseterp.biz.att.dto;

import java.time.LocalDate;

/** AS-IS Att05_PmWorkModel (Att05_Lookup_PmWork 그리드: 근무일자·사유·상태 + 상신 아이콘이 쓰는 apprId·statusCode) */
public record AttPmWorkRes(Long pmWorkId, LocalDate workDate, String reason, Long apprId, String statusCode, String statusName,
                           String timeStr, Integer breakMinutes, String workTimeStr) {
}
