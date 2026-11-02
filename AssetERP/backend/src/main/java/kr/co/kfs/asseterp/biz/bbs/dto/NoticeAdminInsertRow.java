package kr.co.kfs.asseterp.biz.bbs.dto;

/** bbs02_notice INSERT·UPDATE 파라미터 (KFS공지) */
public record NoticeAdminInsertRow(Long noticeId, Long companyId, Long userId, String userName, String title, String notice, String fromDate,
                                   String toDate, String openYn, String note, String noticeType, String noticeDetailCode, String noticeNo,
                                   boolean publicYn, boolean publicCompanyYn) {
}
