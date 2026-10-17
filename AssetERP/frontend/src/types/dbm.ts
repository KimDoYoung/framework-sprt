/** PDF 생성 테스트 (C07) — AS-IS Apr01_ApprModel (apr01_appr.selectPdfMakeTarget) */

/** GET /api/v1/dbm/pdfs/targets */
export interface PdfTarget {
  /** 결재 ID(AS-IS keyId) — 18자리가 아니라 문자열로 내려온다 */
  apprId: string;
  regDate: string;
  effectDate: string | null;
  classTreeNameAllPath: string;
  title: string;
  regEmpName: string;
  orgName: string;
}

/** Table Spec,(Model)Properties (C08) — AS-IS Dbm01_TabCommentsModel */

/** GET /api/v1/dbm/tables (dbm01_tab_comments.selectByTableName) */
export interface DbTable {
  tableId: number;
  tableName: string;
  tableComments: string | null;
  tableType: string;
  tablespaceName: string;
}

/** GET /api/v1/dbm/tables/{tableName}/columns (dbm02_col_comments.selectByTableName) — AS-IS Dbm02_ColCommentsModel */
export interface DbColumn {
  columnId: number;
  tableName: string;
  columnName: string;
  columnComment: string | null;
  dataType: string;
  nullAble: string;
  columnLength: number | null;
}

/** GET /api/v1/dbm/tables/{tableName}/sources/{kind} — AS-IS Dbm03_TabColumns.selectByXML·Model·Properties·GridBuilder */
export type DbSourceKind = 'xml' | 'model' | 'properties' | 'grid-builder';
