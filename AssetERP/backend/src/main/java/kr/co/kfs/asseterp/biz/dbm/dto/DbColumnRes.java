package kr.co.kfs.asseterp.biz.dbm.dto;

/** AS-IS Dbm02_ColCommentsModel — dbm02_col_comments.selectByTableName (컬럼 주석이 있는 컬럼) */
public record DbColumnRes(Long columnId, String tableName, String columnName, String columnComment, String dataType, String nullAble, Integer columnLength) {
}
