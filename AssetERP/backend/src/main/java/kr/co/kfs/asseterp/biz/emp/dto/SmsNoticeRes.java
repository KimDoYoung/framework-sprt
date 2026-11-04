package kr.co.kfs.asseterp.biz.emp.dto;

/** 알림설정 한 행 (AS-IS Emp92_SmsNoticeModel): 항목(SmsNoticeCode)별 앱·문자·메일 수신 여부 */
public record SmsNoticeRes(
        Long smsNoticeId,
        String smsNoticeName,
        String smsNoticeCode,
        Boolean talkNoticeYn,
        Boolean smsNoticeYn,
        Boolean mailNoticeYn
) {
}
