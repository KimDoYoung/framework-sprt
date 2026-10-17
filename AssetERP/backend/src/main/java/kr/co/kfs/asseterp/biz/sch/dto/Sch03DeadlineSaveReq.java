package kr.co.kfs.asseterp.biz.sch.dto;

import java.time.LocalDate;

/**
 * 기한 저장 값 (AS-IS Sch03_Lookup_Cycle·Sch03_Lookup_Short.update → sch.Sch03_Deadline.insertModel).
 * deadlineId가 없거나 0 이하면 새로 등록한다. 회사는 서버가 로그인 회사로 채운다(클라이언트가 보내지 않음)
 */
public record Sch03DeadlineSaveReq(Long deadlineId, Long infoId, String scheduleCode, String cycleCode, String cycleCalcType,
                                   String periodCode, String yearCode, String yearTypeCode, String monthCode, String monthTypeCode,
                                   String dayCode, String dayTypeCode, String weekCode, String dayWeekCode, String holidayCode,
                                   Long num1, Long num2, Long num3, LocalDate fixDate, String note, LocalDate startDate, LocalDate closeDate) {
}
