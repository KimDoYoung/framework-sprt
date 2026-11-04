package kr.co.kfs.asseterp.biz.emp.dto;

/** 캘린더 알림 차단 한 행 (AS-IS Emp90_NoticeModel): 알림항목(BizNoticeCode 이름)과 차단 여부 */
public record NoticeRes(Long noticeId, String noticeKeyword, Boolean noticeYn) {
}
