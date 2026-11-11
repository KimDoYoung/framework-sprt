package kr.co.kfs.asseterp.biz.sms.dto;

import java.util.List;

/** AS-IS sms.Sms03_GroupSend.sendMessageList — 목록의 사원(행마다)에게 같은 글을 보낸다. smsNoticeCode: 통합알림 코드(댓글 T03 · 책무 T05, 원본 98d5afdd6) */
public record SmsSendListReq(List<Long> personIds, String message, String smsNoticeCode) {
}
