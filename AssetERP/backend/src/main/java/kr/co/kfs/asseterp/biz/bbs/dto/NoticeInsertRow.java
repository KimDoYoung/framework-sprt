package kr.co.kfs.asseterp.biz.bbs.dto;

/** bbs02_notice INSERT·UPDATE 파라미터 (fromDate·toDate·topNoticeCloseDate는 YYYY-MM-DD) */
public record NoticeInsertRow(Long noticeId, Long companyId, Long userId, String userName, String title, String notice, String fromDate,
                              String toDate, String openYn, String note, String noticeType, String noticeDetailCode, String noticeNo,
                              boolean commentYn, boolean topNoticeYn, String topNoticeCloseDate) {
}
