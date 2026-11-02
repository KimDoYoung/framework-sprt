package kr.co.kfs.asseterp.biz.bbs.dto;

/**
 * 게시판 분류 한 줄 (AS-IS Bbs30_ClassTreeModel). typeCd 'C' = 게시물 분류, 'T' = 세부항목.
 * parentTreeNm은 세부항목의 상위 분류명(분류 줄은 null), count는 그 세부항목의 게시물 수
 */
public record ClassTreeRes(Long classTreeId, Long companyId, String classTreeNm, Long parentTreeId, Long seq, String note, String typeCd,
                           boolean useYn, boolean publicYn, String parentTreeNm, Long count) {
}
