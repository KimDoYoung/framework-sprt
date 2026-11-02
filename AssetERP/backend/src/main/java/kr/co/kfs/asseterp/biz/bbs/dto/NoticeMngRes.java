package kr.co.kfs.asseterp.biz.bbs.dto;

/**
 * 공지사항 등록 화면(Z02 Bbs02_Tab_NoticeManager) 그리드 한 줄 = 편집창 입력값 (AS-IS Bbs02_NoticeModel).
 * 날짜는 YYYY-MM-DD. notice는 본문 HTML
 */
public record NoticeMngRes(Long noticeId, Long companyId, boolean topYn, String fromDate, String toDate, String openYn, String noticeNo,
                           String noticeType, String noticeTypeName, String noticeDetailCode, String noticeDetailName,
                           String noticeDetailFullName, String title, Long commentCnt, String note, String notice,
                           Long userId, String userName, boolean commentYn, boolean topNoticeYn, String topNoticeCloseDate) {
}
