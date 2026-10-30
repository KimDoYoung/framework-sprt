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
  cfCode: string;
  cfName: string;
  trCode: string;
  trName?: string | null;
  startYm?: string | null;
  closeYm?: string | null;
  cycle?: number | null;
  dateCode?: string | null;
  dateName?: string | null;
  holidaySettleCode?: string | null;
  holidaySettleName?: string | null;
  amt?: number | null;
  note?: string | null;
  round?: number | null;
  icamYn?: string | null;
  contAmt?: number | null;
  tax?: number | null;
  corpId?: number | null;
  corpName?: string | null;
}

export interface AstCfInfoSaveReq {
  cfInfoId?: number | null;
  astClassTreeId: number;
  cfCode: string;
  cfName: string;
  trCode: string;
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



/** 예금원장 한 행 (Act02_Tab_DepositIoList buildGrid — AS-IS Ast09_BookModel 중 이 화면·RD 출력이 쓰는 속성) */
export interface AstBook {
  bookId: number;
  companyId: number;
  holdDate: string;
  astClassTreeId: number;
  astClassTreeName: string | null;
  curCode: string | null;
  preDayAmt: number | null;
  holdQty: number | null;
  astMClassCode: string | null;
  astSClassCode: string | null;
  astSClassName: string | null;
  astSClassSeq: number | null;
  keepAccountSeq: number | null;
}

/** 통화별 합계 한 행 (Act02_Tab_DepositIoList buildSumGrid) */
export interface AstBookSum {
  bookId: number;
  curCode: string | null;
  preDayAmt: number | null;
  holdQty: number | null;
}

/** 연관문서(고유자산) — 상신 문서 ID·상태 (AS-IS Ast80_RelateApprModel) */
export interface AstRelateAppr {
  relateApprId: number;
  apprId: number | null;
  statusCode: string | null;
  statusName: string | null;
}

/** 예금잔고 기간조회 한 행 (Ast09_Tab_DepositBookPeriod buildGrid — 전일 대비 증감액 포함) */
export interface AstBookPeriod {
  bookId: number;
  holdDate: string;
  astSClassName: string | null;
  keepCorpAccountName: string | null;
  curCode: string | null;
  forBookAmt: number | null;
  forDiffAmt: number | null;
  bookAmt: number | null;
  diffAmt: number | null;
  keepAccountId: number | null;
  astClassTreeId: number | null;
}

/** 계좌선택 조회창 한 행 (Ast01_Lookup_CorpAccount) */
export interface AstCorpAccount {
  classTreeId: number;
  itemSClassName: string | null;
  corpId: number | null;
  corpName: string | null;
  classTreeName: string | null;
  corpAccountName: string | null;
  /** 지출처의 대표계좌 "은행 계좌번호 예금주" (U03 — 지급요청계좌에 채운다) */
  corpPayAccountInfo: string | null;
}

/** AS-IS ast.Ast05_TrCode.selectByWindowClassName (Ast05_Lookup_TrCodeWindow, U04) — 화면별 거래유형 */
export interface AstTrCodeByWindow {
  trCodeId: number;
  companyId: number;
  trCode: string;
  trName: string | null;
  rcvPayCode: string | null;
  rcvPayName: string | null;
  astClassTreeId: number | null;
  note: string | null;
}

/** AS-IS ast.Ast06_Tr.selectTaxTr (Ast06_Tab_TrTax, U04) — 그리드 한 행 + 편집창이 받는 세금·4대보험 상세 */
export interface AstTr {
  trId: number;
  date: string;
  trCode: string;
  trName: string | null;
  note: string | null;
  amt: number | null;
  settleMngYn: boolean | null;
  depositId: number | null;
  depositName: string | null;
  apprId: number | null;
  apprStatusCode: string | null;
  apprStatusName: string | null;
  personId: number | null;
  personName: string | null;
  journalId: number | null;
  astClassTreeId: number | null;
  trTaxId: number | null;
  incomeTax: number | null;
  localTax: number | null;
  etcTax: number | null;
  prePayVat: number | null;
  preRcvVat: number | null;
  tr4InsureId: number | null;
  npWithholding: number | null;
  npCompany: number | null;
  npEtc: number | null;
  npEtcNote: string | null;
  hiWithholding: number | null;
  hiCompany: number | null;
  hiEtc: number | null;
  hiEtcNote: string | null;
  eiWithholding: number | null;
  eiCompany: number | null;
  eiEtc: number | null;
  eiEtcNote: string | null;
  ohCompany: number | null;
  ohEtc: number | null;
  ohEtcNote: string | null;
  npSettleAmt: number | null;
  hiSettleAmt: number | null;
  eiSettleAmt: number | null;
  ohSettleAmt: number | null;
}

/** AS-IS ast.Ast06_Tr.updateTax 요청 — trId가 없으면 새 거래 */
export interface AstTrTaxSaveReq {
  trId: number | null;
  date: string;
  trCode: string;
  amt: number | null;
  settleMngYn: boolean;
  note: string | null;
  depositId: number | null;
  incomeTax: number | null;
  localTax: number | null;
  etcTax: number | null;
  prePayVat: number | null;
  preRcvVat: number | null;
}

/** AS-IS ast.Ast06_Tr.update4Insure 요청 — settleAmt는 네 보험 납부금액의 합 */
export interface AstTr4InsureSaveReq {
  trId: number | null;
  /** 거래유형(화면별)이 정한 자산분류 — 새 거래에만 쓴다 */
  astClassTreeId: number | null;
  date: string;
  trCode: string;
  settleMngYn: boolean;
  note: string | null;
  depositId: number | null;
  npWithholding: number | null;
  npCompany: number | null;
  npEtc: number | null;
  npEtcNote: string | null;
  hiWithholding: number | null;
  hiCompany: number | null;
  hiEtc: number | null;
  hiEtcNote: string | null;
  eiWithholding: number | null;
  eiCompany: number | null;
  eiEtc: number | null;
  eiEtcNote: string | null;
  ohCompany: number | null;
  ohEtc: number | null;
  ohEtcNote: string | null;
  settleAmt: number;
}

/** AS-IS ast.Ast20_TrTax.selectGenLedgerTax */
export interface AstTrTaxLedger {
  incomeTax: number | null;
  localTax: number | null;
  etcTax: number | null;
  prePayVat: number | null;
  preRcvVat: number | null;
}

/** AS-IS ast.Ast21_Tr4Insure.selectGenLedgerInsure */
export interface AstTr4InsureLedger {
  npWithholding: number | null;
  hiWithholding: number | null;
  eiWithholding: number | null;
}


// ── U11 미수/미지급 결제 (Pay50_Tab_ExpenseSettle) ──

/** AS-IS ast.Ast06_Tr.selectByAccrued — 미수/미지급 결제 위 그리드 한 행. trCode가 9100이면 trId는 지출결의서 ID */
export interface SettleAccrued {
  trId: number;
  companyId: number | null;
  date: string | null;
  trCode: string | null;
  amt: number | null;
  corpId: number | null;
  corpName: string | null;
  rcvPayCode: string | null;
  accruedAmt: number | null;
  note: string | null;
}

/** AS-IS ast.Ast07_Settle.selectByHistoryPaging — 실수령/지급 History 한 행 */
export interface SettleHistory {
  settleId: number;
  settleDate: string | null;
  trName: string | null;
  orgTrName: string | null;
  corpName: string | null;
  note: string | null;
  settleAmt: number | null;
  journalId: number | null;
  expenseId: number | null;
  trId: number | null;
  trCode: string | null;
  personId: number | null;
}

/** 결제등록 창이 쓰는 지출결의서 정보 (AS-IS Pay50_ExpenseModel 중 일부) */
export interface SettleExpense {
  expenseId: number;
  companyId: number;
  desc: string | null;
  settleAmt: number | null;
  unSettleAmt: number | null;
  depositId: number | null;
  depositName: string | null;
}

/** AS-IS ast.Ast07_Settle.update 의 새 결제 */
export interface SettleSaveReq {
  expenseId: number | null;
  trId: number | null;
  settleDate: string;
  note: string | null;
  depositId: number | null;
  trCode: string;
  amt: number;
  settleAmt: number;
}
