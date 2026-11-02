package kr.co.kfs.asseterp.biz.bbs.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

/** 공지 확인 문자 발송 (AS-IS sms.Sms03_GroupSend.sendNoticeMessage) — 수신자는 사원 ID, 번호는 서버가 읽는다 */
public record NoticeSendMessageReq(@NotBlank String message, List<Long> personIds) {
}
