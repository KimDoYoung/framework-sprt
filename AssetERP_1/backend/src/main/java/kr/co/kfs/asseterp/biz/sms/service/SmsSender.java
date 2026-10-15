package kr.co.kfs.asseterp.biz.sms.service;

/**
 * 문자 발송 연동 지점. AS-IS는 server/utils/sms/SendSMSAPI(외부 SMS API 호출 + sms04_group_send_history 기록)를 직접 불렀다.
 * TOBE에는 아직 외부 SMS 연동이 없고, 사용자 지시(2026-10-15)로 **실제 문자는 보내지 않는다** — 기본 구현({@link DisabledSmsSender})은 발송을 거부한다.
 * 나중에 연동을 만들면 이 인터페이스를 구현한 빈을 두고 기본 구현은 지운다(발송 뒤 sms04 기록도 구현 쪽에서).
 */
public interface SmsSender {
    /** @param content 이미 "[Asset-ERP] " 머리말이 붙은 본문 */
    void send(Long companyId, Long groupSendId, String phone, String content, String targetName);
}
