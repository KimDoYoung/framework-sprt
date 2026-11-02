package kr.co.kfs.asseterp.biz.bbs.dto;

/**
 * 게시물 한 줄 (AS-IS Bbs31_ContentModel). 목록(selectByClassTreeIdPaging)은 내용(content)을 싣지 않는다 — 상세 창이 selectById로 읽는다.
 * titleRole은 비공개 글이면 앞에 굵은 "(비공개) "가 붙은 HTML 제목, regDateStr은 'YY.MM.DD HH:mm:ss'
 */
public record ContentRes(Long contentId, Long classTreeId, Long personId, String title, String titleRole, String content, boolean hideYn,
                         String regDateStr, String personName) {
}
