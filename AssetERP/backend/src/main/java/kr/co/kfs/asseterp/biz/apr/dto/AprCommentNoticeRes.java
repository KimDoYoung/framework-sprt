package kr.co.kfs.asseterp.biz.apr.dto;

import java.util.List;

/** 댓글 창 [알림발송]이 문자 발송 창에 넘기는 값 — 결재선 사원 목록과 문구 (AS-IS Apr42_Lookup_Comment L106-117) */
public record AprCommentNoticeRes(List<Long> personIds, String message) {
}
