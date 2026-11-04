package kr.co.kfs.asseterp.biz.batch.dto;

/** 보낼 알람 이력 (AS-IS sch07_alarm_record.selectByAlarmType 중 쓰는 열) */
public record BatchAlarmRecord(Long alarmRecordId, Long companyId, Long personId, String alarmMessage) {
}
