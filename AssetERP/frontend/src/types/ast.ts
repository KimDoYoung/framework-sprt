/** 자산상세 항목 한 행 (AS-IS Ast02_DetailModel 중 Ast01_Tab_InfoManager 그리드 열). useYn은 DB 형태('true'/'false') 그대로 */
export interface AstDetail {
  detailId: number;
  seq?: number | null;
  title?: string | null;
  tag?: string | null;
  useYn?: string | null;
}

/** 거래코드 한 행 (AS-IS Ast05_TrCodeModel 중 Ast05_Tab_TrCodeAdmin 그리드 열). 여부는 DB 형태('true'/'false') 그대로 */
export interface TrCode {
  trCodeId: number;
  companyId?: number | null;
  trCode?: string | null;
  trName?: string | null;
  rcvPayCode?: string | null;
  rcvPayName?: string | null;
  trOccType?: string | null;
  trOccTypeName?: string | null;
  itemClassGroupCode?: string | null;
  financeYn?: string | null;
  lockYn?: string | null;
  useYn?: string | null;
  note?: string | null;
}

/** 화면별 사용 거래코드 (AS-IS Ast15_TrCodeWindowModel). 화면 행은 trCode가 없고, 거래코드 행(왼쪽·오른쪽 그리드)은 trCode·trName */
export interface TrCodeWindow {
  trCodeWindowId: number;
  companyId?: number | null;
  windowClassName?: string | null;
  menuFullName?: string | null;
  trCode?: string | null;
  trName?: string | null;
  note?: string | null;
}

/** 종목별 문서검색 왼쪽 트리 노드 (AS-IS Ast01_ClassTreeModel 중 Apr01_Tab_ItemDocument 트리 열). typeCode IT면 종목(이름 뒤에 표준코드) */
export interface AstItemTreeNode {
  classTreeId: number;
  parentTreeId: number;
  classTreeName?: string | null;
  typeCode?: string | null;
  depth?: number | null;
}
