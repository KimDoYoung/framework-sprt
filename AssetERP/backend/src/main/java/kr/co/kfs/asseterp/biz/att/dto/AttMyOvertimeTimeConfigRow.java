package kr.co.kfs.asseterp.biz.att.dto;

/** pay34_work_time_config 한 행 (AS-IS Pay34_WorkTimeConfigModel 중 야간 시작·종료, 주 최대 추가근로시간) */
public record AttMyOvertimeTimeConfigRow(String ntStartTime, String ntEndTime, Long weekMaxAddHours) {
}
