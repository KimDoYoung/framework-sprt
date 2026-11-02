package kr.co.kfs.asseterp.biz.bbs.dto;

/**
 * Bbs02_Tab_NoticeView 그리드 한 줄 (AS-IS Bbs02_NoticeModel). notice는 상세보기 창이 쓰는 본문 HTML,
 * title2는 창 머리글(구분 색 글씨 + 제목, HTML), noticeDetailFullName은 구분+구분상세(HTML)
 */
public record NoticePersonRes(Long noticeId, boolean topYn, String fromDate, String noticeNo, String noticeDetailFullName,
                              String title, String title2, String notice, boolean commentYn) {
}
