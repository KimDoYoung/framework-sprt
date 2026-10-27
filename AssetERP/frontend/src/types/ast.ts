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

/** R08 자산분류 전체 트리 한 노드 (AS-IS Ast01_ClassTreeModel) */
export interface AstClassTree {
  classTreeId: number;
  companyId: number;
  parentTreeId: number;
  classTreeName: string;
  classTreeCode: string;
  seq: number;
  typeCode: string;
  note?: string | null;
  useYn: string;
  content?: string | null;
  isin?: string | null;
  itemLClassCode?: string | null;
  itemMClassCode?: string | null;
  itemSClassCode?: string | null;
  itemDClassCode?: string | null;
  accountType?: string | null;
  assetType?: string | null;
  trUnit?: string | null;
  issueDate?: string | null;
  matDate?: string | null;
  corpId?: number | null;
  curCode?: string | null;
  depnYear?: number | null;
  depnRate?: number | null;
  depnType?: string | null;
  evalType?: string | null;
  itemLClassName?: string | null;
  itemMClassName?: string | null;
  itemSClassName?: string | null;
  itemDClassName?: string | null;
  evalTypeName?: string | null;
  accountName?: string | null;
  assetName?: string | null;
  depnTypeName?: string | null;
  corpName?: string | null;
  curName?: string | null;
  classTreeFullName?: string | null;
  parentTreeFullName?: string | null;
  depth?: number | null;
}

/** R08 우측 종목 상세 한 행 (AS-IS Ast01_Grid_AstTypeManagement 그리드 열) */
export interface AstClassTreeItem {
  classTreeId: number;
  companyId: number;
  parentTreeId: number;
  seq: number;
  isin?: string | null;
  classTreeName: string;
  classTreeCode?: string | null;
  useYn: string;
  note?: string | null;
  itemClassName?: string | null;
}

/** R08 자산분류 등록/수정 요청 */
export interface AstClassTreeSaveReq {
  classTreeId?: number | null;
  parentTreeId?: number | null;
  classTreeName: string;
  classTreeCode?: string | null;
  seq?: number | null;
  typeCode?: string | null;
  isin?: string | null;
  note?: string | null;
  useYn?: string | null;
  assetType?: string | null;
}

/** R08 추가정보 설정 요청 (Ast01_Lookup_ItemClass) */
export interface AstItemClassUpdateReq {
  classTreeId: number;
  content?: string | null;
  itemLClassCode?: string | null;
  itemMClassCode?: string | null;
  itemSClassCode?: string | null;
  itemDClassCode?: string | null;
  accountType?: string | null;
  trUnit?: string | null;
  issueDate?: string | null;
  matDate?: string | null;
  corpId?: number | null;
  curCode?: string | null;
  depnYear?: number | null;
  depnRate?: number | null;
  depnType?: string | null;
  evalType?: string | null;
}

/** R08 담당자 정보 (Ast10_Lookup_Manager) */
export interface AstManager {
  managerId: number;
  companyId: number;
  linkId: number;
  managerType: string;
  managerName?: string | null;
  orgId?: number | null;
  orgName?: string | null;
  personId?: number | null;
  personName?: string | null;
  reprYn?: string | null;
  linkContent?: string | null;
}

export interface AstManagerSaveReq {
  managerId?: number | null;
  linkId: number;
  managerType: string;
  orgId?: number | null;
  personId?: number | null;
  reprYn?: string | null;
  linkContent?: string | null;
}

/** R09 종목 자산상세 항목 (Ast02_Grid_DetailManagement / Ast02_Lookup_Detail) */
export interface AstItemDetail {
  detailId: number;
  astClassTreeId?: number | null;
  seq: number;
  title: string;
  value?: string | null;
  note?: string | null;
  useYn: string;
  defaultYn?: string | null;
  tag?: string | null;
  companyId?: number | null;
}

export interface AstItemDetailSaveReq {
  detailId?: number | null;
  astClassTreeId?: number | null;
  seq: number;
  title: string;
  value?: string | null;
  note?: string | null;
  useYn?: string | null;
  defaultYn?: string | null;
  tag?: string | null;
}

/** R09 현금흐름표 기본구분 (Ast03_Lookup_CfInfo) */
export interface AstCfInfo {
  cfInfoId: number;
  astClassTreeId: number;
  cfCd: string;
  cfNm: string;
  trCd: string;
  trNm?: string | null;
  startYm?: string | null;
  closeYm?: string | null;
  cycle?: number | null;
  dateCd?: string | null;
  dateNm?: string | null;
  holidaySettleCd?: string | null;
  holidaySettleNm?: string | null;
  amt?: number | null;
  note?: string | null;
  round?: number | null;
  icamYn?: string | null;
  contAmt?: number | null;
  tax?: number | null;
  corpId?: number | null;
  corpNm?: string | null;
}

export interface AstCfInfoSaveReq {
  cfInfoId?: number | null;
  astClassTreeId: number;
  cfCd: string;
  cfNm: string;
  trCd: string;
  corpId?: number | null;
  icamYn?: string | null;
  note?: string | null;
}

/** R09 현금흐름표 상세 (Ast03_Lookup_CfInfo 우측 그리드) */
export interface AstCf {
  cfId: number;
  cfInfoId: number;
  seq: number;
  date: string;
  settleDate: string;
  settleAmt: number;
  note?: string | null;
  contAmt?: number | null;
  tax?: number | null;
}

export interface AstCfSaveReq {
  cfId?: number | null;
  cfInfoId: number;
  seq: number;
  date: string;
  settleDate: string;
  settleAmt: number;
  note?: string | null;
  contAmt?: number | null;
  tax?: number | null;
}

/** R09 현금흐름표 일괄생성 요청 (Ast03_Lookup_CfAutoCreate) */
export interface AstCfBatchCreateReq {
  cfInfoId: number;
  dateCode: string;
  holidaySettleCode: string;
  startYm: string;
  closeYm: string;
  amt?: number | null;
  contAmt?: number | null;
  tax?: number | null;
  cycle?: number | null;
  round?: number | null;
}


