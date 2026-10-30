package kr.co.kfs.asseterp.common.notice;

import java.util.List;

/**
 * 알림 발송 3종 (AS-IS server/utils/talk/SendTalkAPI · utils/sms/SendSMSAPI · utils/mail/SendMailMaster).
 * 구현은 asseterp.notice.mode로 고른다: disabled(안 보냄) / sim(tools/notice-simulator). 예외를 던지지 않는다.
 */
public interface NoticeSender {

    /** 앱알림 — POST {talkUrl}, 헤더 x-api-key, JSON {email,title,body,fromEmail:"erp@k-fs.co.kr"} */
    NoticeResult sendTalk(String email, String title, String body);

    /** SMS — DirectSend {title:"[Asset-ERP 알림]",message,sender,username,receiver[{name,mobile,note1}],key,type:"java"}, 번호는 하이픈 없이 */
    NoticeResult sendSms(List<String> mobiles, String message);

    /** 메일 — 보내는 사람 "Asset-ERP <주소>", text/html; charset=utf-8 */
    NoticeResult sendMail(String toEmail, String subject, String htmlBody);
}
