package kr.co.kfs.asseterp.biz.bbs.dto;

import java.time.LocalDate;

/** 나에게 온 알림 공지 한 줄 (AS-IS Bbs02_NoticeModel 일부 — Frm01_Lookup_NoticeList, EE55). title2 = 구분 색 글씨 + 제목(HTML) */
public record BbsNoticeTargetRes(Long noticeId, String noticeNo, String title, String title2, String notice, Boolean commentYn,
                                 LocalDate fromDate) {
}
