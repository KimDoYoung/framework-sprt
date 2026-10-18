package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 근로시간 기준 저장 한 행 — workTimeConfigId가 0 이하이거나 DB에 없으면 등록 */
public record PayWorkTimeSaveReq(Long workTimeConfigId, LocalDate startDate, Long dayWorkHours, Long weekMaxAddHours,
                                 String ntStartTime, String ntEndTime, Double otMultRate, Double ntMultRate,
                                 Double holiStdMultRate, Double holiOverMultRate) {
}
