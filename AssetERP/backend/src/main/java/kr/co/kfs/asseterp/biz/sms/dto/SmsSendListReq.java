package kr.co.kfs.asseterp.biz.sms.dto;

import java.util.List;

/** AS-IS sms.Sms03_GroupSend.sendMessageList — 목록의 사원(행마다)에게 같은 글을 보낸다 */
public record SmsSendListReq(List<Long> personIds, String message) {
}
