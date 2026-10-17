package kr.co.kfs.asseterp.biz.dbm.dto;

/** AS-IS dbm.Dbm02_ColComments.update — 바뀐 컬럼 주석 한 행 */
public record ColumnCommentSaveReq(String tableName, String columnName, String columnComment) {
}
