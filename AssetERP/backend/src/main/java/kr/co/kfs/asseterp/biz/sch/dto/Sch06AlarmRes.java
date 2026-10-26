package kr.co.kfs.asseterp.biz.sch.dto;

/** 알람설정 (AS-IS Sch06_AlarmModel — sch06_alarm.selectByTargetId) */
public record Sch06AlarmRes(Long alarmId, Long companyId, String targetCode, Long targetId, String alarmType, String dayWeekCode, String dayWeekName,
                            Long num, String befAftCode, String befAftName, String amPmCode, String amPmName, String hourCode, String hourName,
                            String minuteCode, String minuteName, String holidayCode, String holidayName, Boolean useYn) {
}
