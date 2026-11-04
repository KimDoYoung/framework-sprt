package kr.co.kfs.asseterp.biz.bbs.dto;

import java.time.LocalDate;

/** 로그인 때 뜨는 공지 한 줄 (AS-IS Bbs02_NoticeModel 일부 — Bbs02_Lookup_NoticeAdmin, EE83). topYn = 상단고정(핀), noticeTypeName = 구분 HTML */
public record BbsNoticeCompanyRes(Long noticeId, String noticeNo, String title, String title2, String notice, Boolean commentYn,
                                  LocalDate fromDate, String topYn, String noticeTypeName) {
}
