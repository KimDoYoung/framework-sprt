package kr.co.kfs.asseterp.biz.dbm.dto;

/** AS-IS dbm.Dbm01_TabComments.update — 바뀐 테이블 주석 한 행 */
public record TableCommentSaveReq(String tableName, String tableComments) {
}
