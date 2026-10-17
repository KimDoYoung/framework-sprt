package kr.co.kfs.asseterp.biz.dbm.dto;

/** AS-IS Dbm01_TabCommentsModel — dbm01_tab_comments.selectByTableName (public 스키마의 테이블·뷰와 테이블 주석) */
public record DbTableRes(Long tableId, String tableName, String tableComments, String tableType, String tablespaceName) {
}
