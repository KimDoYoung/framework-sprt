package kr.co.kfs.asseterp.biz.bbs.dto;

/**
 * 신청·신청취소 결과. notice: 1 = 알림 발송 완료, 0 = 알림 수신자 없음(생략), -1 = 문자 발송 실패(AS-IS는 안내 없이 넘어감)
 */
public record ApplicationStatusRes(ApplicationMineRes row, int notice) {
}
