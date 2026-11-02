package kr.co.kfs.asseterp.biz.bbs.dto;

/**
 * 게시판 분류 저장 한 줄 (AS-IS bbs.Bbs30_ClassTree.update 의 UpdateDataModel). classTreeId가 없거나 0 이하면 새 줄(INSERT)
 */
public record ClassTreeSaveReq(Long classTreeId, String classTreeNm, Long parentTreeId, Long seq, String typeCd, boolean useYn, boolean publicYn) {
}
