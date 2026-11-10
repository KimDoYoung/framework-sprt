package kr.co.kfs.asseterp.biz.sms.service;

/**
 * 문자 발송 연동 지점. AS-IS는 server/utils/sms/SendSMSAPIFunction → SendSMSAPI(외부 SMS API 호출 + 성공하면 기록)를 직접 불렀다.
 * 구현은 {@link NoticeSmsSender} 하나다 — 실제 발송은 공통 알림 발송부(NoticeSender, asseterp.notice.mode)가 한다:
 * sim이면 알림 시뮬레이터(tools/notice-simulator)로 보내고, disabled면 보내지 않고 거절한다(2026-11-10 사용자 결정, 그 전에는 늘 거절).
 */
public interface SmsSender {
    /**
     * 한 사람에게 문자를 보내고, 성공하면 AS-IS처럼 기록을 남긴다(groupSendId가 있으면 sms04_group_send_history, 없으면 sms02_history).
     * 보내지 못하면 BusinessException.
     * @param content 이미 "[Asset-ERP] " 머리말이 붙은 본문
     */
    void send(Long companyId, Long groupSendId, String phone, String content, String targetName);

    /** AS-IS getSMSFlag(회사 위치) — 회사의 문자발신 서비스 신청 여부({위치}.SMSok = asseterp.notice.sms-companies) */
    boolean companyEnabled(Long companyId);

    /** AS-IS Sms02_History.sendMessage가 SMSok=false일 때 돌려준 상태(-1)의 화면 문구 */
    String NOT_SUBSCRIBED = "문자발신 서비스를 미신청한 고객사입니다. 관리자에게 문의하세요";
}
