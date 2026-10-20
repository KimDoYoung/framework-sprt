package kr.co.kfs.asseterp.biz.bbs.dto;

/** Bbs02_Tab_NoticeViewLaw 그리드 한 줄 (AS-IS Bbs02_NoticeModel). notice는 상세보기 창이 쓰는 본문 HTML */
public record NoticeRes(Long noticeId, String fromDate, String noticeTypeName, String noticeNo, String noticeDetailName,
                        String title, String publicYnName, String notice, boolean commentYn) {
}
