package kr.co.kfs.asseterp.common.notice;

/** 알림 한 건의 발송 결과 — 발송 실패는 업무를 막지 않으므로 예외 대신 돌려준다 (AS-IS도 예외를 삼켰다) */
public record NoticeResult(boolean ok, String message) {
    public static NoticeResult success() {
        return new NoticeResult(true, null);
    }

    public static NoticeResult fail(String message) {
        return new NoticeResult(false, message);
    }
}
