package kr.co.kfs.asseterp.biz.bbs.dto;

/** 공지사항 댓글 한 줄 (AS-IS Bbs07_CommentModel). deleteStr은 내 댓글이면 '✕', deleteMasterStr은 항상 '✕'(관리자 댓글확인 창 Bbs07_Lookup_Comment) */
public record CommentRes(Long commentId, Long personId, String commentFullStr, String fileStr, String deleteStr, String deleteMasterStr, String comment) {
}
