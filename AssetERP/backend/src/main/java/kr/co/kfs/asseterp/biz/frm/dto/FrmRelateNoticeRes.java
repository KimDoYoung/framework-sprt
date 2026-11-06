package kr.co.kfs.asseterp.biz.frm.dto;

/**
 * MyPage 일정 박스 알림 한 행 (AS-IS Bbs02_NoticeModel — bbs02_notice.selectPersonNotice, buildGrid03 L271-274)
 * noticeType: 10010 공지사항 · 10020 메세지 · 10030 공모주일정 · 10040~10070 계약종료·임원만료·계약만료·업무공유 · 10080/10081 화환
 */
public record FrmRelateNoticeRes(
        Long rowId,
        Long noticeId,
        String noticeType,
        String noticeTypeName,
        String title,
        String notice,
        Long realNoticeId
) {
}
