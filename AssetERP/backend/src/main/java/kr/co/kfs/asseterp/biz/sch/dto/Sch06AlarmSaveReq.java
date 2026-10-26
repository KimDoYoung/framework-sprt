package kr.co.kfs.asseterp.biz.sch.dto;

/** 알람설정 저장 (AS-IS Sch06_Alarm.update → UpdateDataModel): alarmId가 없거나 0 이하면 새 행 */
public record Sch06AlarmSaveReq(Long alarmId, String targetCode, Long targetId, String alarmType, String dayWeekCode, Long num, String befAftCode,
                                String amPmCode, String hourCode, String minuteCode, String holidayCode, Boolean useYn) {
}
