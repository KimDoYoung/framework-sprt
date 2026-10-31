package kr.co.kfs.asseterp.biz.apr.dto;

/** 댓글 한 줄 (AS-IS Apr42_CommentModel — commentFullStr는 HTML 머리, fileStr은 "파일(n)", deleteStr은 내가 쓴 글이면 ✕) */
public record AprCommentRes(Long commentId, Long personId, String comment, String commentFullStr, String fileStr, String deleteStr) {
}
