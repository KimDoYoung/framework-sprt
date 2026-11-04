package kr.co.kfs.asseterp.biz.sms.dto;

/** 알림함 한 행 (AS-IS Sms10_AlarmHistoryModel). sendTimeStr = 'YYYY-MM-DD HH24:MI:SS', targetPersonName = 수신(발신)자 성명 */
public record SmsAlarmHistoryRes(
        Long alarmHistoryId,
        String sendTimeStr,
        String targetPersonName,
        String content,
        Boolean sendYn
) {
}
