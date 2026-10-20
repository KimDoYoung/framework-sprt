package kr.co.kfs.asseterp.biz.bbs.dto;

/** 공지사항 댓글 한 줄 (AS-IS Bbs07_CommentModel). deleteStr은 내 댓글이면 '✕' */
public record CommentRes(Long commentId, Long personId, String commentFullStr, String fileStr, String deleteStr, String comment) {
}
