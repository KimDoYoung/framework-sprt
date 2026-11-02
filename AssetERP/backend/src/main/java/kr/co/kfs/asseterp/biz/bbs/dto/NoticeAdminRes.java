package kr.co.kfs.asseterp.biz.bbs.dto;

/** KFS공지등록(Z04 Bbs02_Tab_NoticeAdmin) 그리드 한 줄 = 편집창 입력값 (AS-IS Bbs02_NoticeModel). 날짜는 YYYY-MM-DD, notice는 본문 HTML */
public record NoticeAdminRes(Long noticeId, Long companyId, String fromDate, String toDate, String openYn, String noticeNo,
                             String noticeType, String noticeTypeName, String noticeDetailCode, String noticeDetailName,
                             String noticeDetailFullName, String title, String note, String notice, Long userId, String userName,
                             boolean publicYn, boolean publicCompanyYn) {
}
