/** 자산상세 항목 한 행 (AS-IS Ast02_DetailModel 중 Ast01_Tab_InfoManager 그리드 열). useYn은 DB 형태('true'/'false') 그대로 */
export interface AstDetail {
  detailId: number;
  seq?: number | null;
  title?: string | null;
  tag?: string | null;
  useYn?: string | null;
}
