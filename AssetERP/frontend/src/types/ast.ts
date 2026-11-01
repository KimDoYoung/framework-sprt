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
  /** 원장 입출고 구분(act11_tr_map) — 2 출고·3 입/출고·5 원장변경·8 해당없음이면 보유자산에서 종목을 고른다(W06) */
  bookIoType?: string | null;
  /** 금융상품 관련 거래 여부 (X03) */
  financeYn?: boolean;
  /** 거래유형의 자산분류 이름 (X03) */
  astClassTreeName?: string | null;
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
  /** 거래유형 이름 (ast05_tr_nm, X04 그리드) */
  trName: string | null;
  /** 외화 화면(X09) — 통화·외화 거래금액 */
  curCode: string | null;
  forAmt: number | null;
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
  /** 외화 화면(X09) — 통화·외화 결제금액 */
  curCode: string | null;
  forSettleAmt: number | null;
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
  amt?: number | null;
  settleAmt: number;
  /** 외화 결제(X08): forAmt가 있으면 외화 결제 */
  forAmt?: number | null;
  forSettleAmt?: number | null;
  fxRate?: number | null;
}

/** 자기자본 한 행 (W03 Ast40_Tab_OwnerCapital) */
export interface OwnerCapital {
  ownerCapitalId: number;
  stdDate: string | null;
  amt: number | null;
  note: string | null;
}

/** 투자한도/StopLoss 적용일 (W03 Ast41_Lookup_InvestLimit 왼쪽 그리드) */
export interface InvestLimitDate {
  investLimitId: number;
  startDate: string;
}

/** 투자한도/StopLoss 한 행 (W03 Ast41_Lookup_InvestLimit 오른쪽 그리드) */
export interface InvestLimit {
  investLimitId: number;
  startDate: string;
  investAssetType: string | null;
  investAssetName: string | null;
  limitRate: number | null;
  stopLossRate: number | null;
  note: string | null;
}

/** AS-IS ast.Ast06_Tr.selectByPayCode·selectById (Ast06_Tab_TrIPO, W05) — 금융상품 거래 그리드 한 행 + 편집창 값 */
export interface AstTrFinance {
  trId: number;
  date: string;
  trCode: string;
  trName: string | null;
  corpId: number | null;
  corpName: string | null;
  corpAccountName: string | null;
  astClassTreeId: number | null;
  astClassName: string | null;
  classTreeName: string | null;
  classTreeFullName: string | null;
  curCode: string | null;
  trUnit: number | null;
  qty: number | null;
  price: number | null;
  trAmt: number | null;
  fee: number | null;
  amt: number | null;
  lockUpPeriodCode: string | null;
  lockUpPeriodName: string | null;
  lockUpDate: string | null;
  listDate: string | null;
  accountId: number | null;
  accountName: string | null;
  trFinanceId: number | null;
  settleMngYn: boolean;
  depositId: number | null;
  depositName: string | null;
  note: string | null;
  personId: number | null;
  personName: string | null;
  journalId: number | null;
  apprId: number | null;
  apprStatusCode: string | null;
  apprCnt: string | null;
  dcrClassTreeId: number | null;
  /** W06 금융상품 거래처리: 제세금 합·거래세·법인세·지방세·이자금액·경과이자금액·손익, 수령/지급·원장 입출고 구분 */
  taxSum: number | null;
  trTax: number | null;
  corpTax: number | null;
  localTax: number | null;
  intAmt: number | null;
  acrIntAmt: number | null;
  pl: number | null;
  rcvPayCode: string | null;
  bookIoType: string | null;
  /** W07 금융상품 거래처리(외화): 적용환율(ast06_fx_rate)·외화 거래금액(ast08_for_tr_amt) */
  fxRate: number | null;
  forTrAmt: number | null;
  /** W08 금융상품 계좌대체: 입고계좌·장부금액 */
  inAccountId: number | null;
  inAccountName: string | null;
  bookAmt: number | null;
}

/** AS-IS sys.Sys00_Common.selectForDeposit (CommonComboBoxField) — 외화 예금계좌 콤보 한 건 (W07) */
export interface AstForeignDeposit {
  codeId: number;
  code: string | null;
  name: string | null;
  corpId: number | null;
}

/** AS-IS ast.Ast06_Tr.updateFinance 요청 — trId가 없으면 새 거래 */
export interface AstTrFinanceSaveReq {
  trId: number | null;
  date: string;
  trCode: string;
  astClassTreeId: number | null;
  corpId: number | null;
  depositId: number | null;
  settleMngYn: boolean;
  amt: number | null;
  fee: number | null;
  note: string | null;
  curCode: string | null;
  accountId: number | null;
  qty: number | null;
  price: number | null;
  trAmt: number | null;
  lockUpPeriodCode: string | null;
  lockUpDate: string | null;
  listDate: string | null;
  /** W06 금융상품 거래처리 편집창이면 true — 세금·이자도 저장한다 */
  detail?: boolean;
  trTax?: number | null;
  corpTax?: number | null;
  localTax?: number | null;
  intAmt?: number | null;
  acrIntAmt?: number | null;
  /** W07 금융상품 거래처리(외화) 편집창이면 true — 통화·적용환율·외화 거래금액도 저장한다 */
  foreign?: boolean;
  fxRate?: number | null;
  forTrAmt?: number | null;
  /** W08 금융상품 계좌대체 편집창이면 true — 입고계좌도 저장한다 */
  transfer?: boolean;
  inAccountId?: number | null;
}

/** W06 AS-IS ast.Ast09_Book.selectByHoldDate(astType 2) — 보유자산 조회창(Ast09_Lookup_Book) 한 행 */
export interface AstHoldBook {
  astClassTreeId: number;
  astClassTreeName: string | null;
  astClassName: string | null;
  corpId: number | null;
  corpName: string | null;
  keepAccountId: number | null;
  keepAccountName: string | null;
  holdQty: number | null;
  purAmt: number | null;
  bookAmt: number | null;
  acrIntAmt: number | null;
  lockUpDate: string | null;
  sellPossibleQty: number | null;
  astTrUnit: number | null;
  curCode: string | null;
  /** W07 외화 거래 편집창의 "외화 장부금액" */
  forBookAmt: number | null;
}

/** AS-IS ast.Ast01_ClassTree.selectByTrCode (Ast01_Lookup_Info, W05) — 종목선택 트리 한 노드(전위 순서 평평한 목록) */
export interface AstTrCodeTreeNode {
  classTreeId: number;
  parentTreeId: number;
  classTreeName: string;
  typeCode: string;
  depth: number;
  classTreeFullName: string | null;
  curCode: string | null;
  trUnit: number | null;
}

/** AS-IS ast.Ast06_Tr.selectEvalList (Ast06_Tab_EvalFinance, W09) — 금융상품 평가처리 한 줄. 아직 평가하지 않은 줄은 evalYnName이 빈칸 */
export interface AstEval {
  evalYnName: string | null;
  evalTypeName: string | null;
  date: string;
  corpAccountName: string | null;
  astClassName: string | null;
  classTreeName: string | null;
  qty: number | null;
  financeBookAmt: number | null;
  price: number | null;
  amt: number | null;
  pl: number | null;
  holdPeriod: string | null;
  note: string | null;
  personName: string | null;
  trId: number;
  astClassTreeId: number;
  trCode: string | null;
  trName: string | null;
  personId: number | null;
  companyId: number | null;
  corpId: number | null;
  corpName: string | null;
  curCode: string | null;
  forAmt: number | null;
  fxRate: number | null;
  preCloseDate: string | null;
  preEvalDate: string | null;
  evalType: string | null;
  journalId: number | null;
  classTreeFullName: string | null;
  trFinanceId: number | null;
  accountId: number;
  forBookAmt: number | null;
  trUnit: number | null;
}

/** 평가처리·취소 대상 한 줄 (AS-IS는 Ast06_TrModel 통째) */
export interface AstEvalItem {
  trId: number;
  astClassTreeId: number;
  date: string;
  trCode: string | null;
  evalType: string | null;
  amt: number | null;
  forAmt: number | null;
  curCode: string | null;
  note: string | null;
  trFinanceId: number | null;
  accountId: number;
  qty: number | null;
  trUnit: number | null;
  bookAmt: number | null;
  forBookAmt: number | null;
}

/** AS-IS ast.Ast25_Price.selectHoldItem (Ast25_Lookup_Price, W09) — 시세입력 한 줄 */
export interface AstPrice {
  priceId: number;
  companyId: number | null;
  stdDate: string;
  itemType: string;
  itemTypeName: string | null;
  itemCode: string | null;
  itemName: string | null;
  evalPrice: number | null;
}

/** AS-IS ast.Ast25_Price.selectByStdDatePaging (Ast25_Tab_Price, W10) — 시세관리 한 줄. lockYn은 공용 시세(회사 0) */
export interface AstPrc {
  priceId: number;
  companyId: number | null;
  stdDate: string | null;
  itemType: string | null;
  itemTypeName: string | null;
  itemCode: string | null;
  itemName: string | null;
  evalPrice: number | null;
  note: string | null;
  itemFullCode: string | null;
  lockYn: boolean;
}

/** 감가상각처리 한 줄 (W11 Ast06_Tab_EvalDepn, AS-IS Ast06_TrModel — ast06_tr.selectDepn) */
export interface AstDepn {
  trId: number;
  astClassTreeId: number | null;
  date: string;
  trCode: string;
  curCode: string;
  fxRate: number | null;
  amt: number | null;
  forAmt: number | null;
  personId: number | null;
  purTrId: number;
  companyId: number;
  purDate: string;
  bookAmt: number | null;
  acmDepnCost: number | null;
  depnCost: number | null;
  itemClassTypeName: string | null;
  classTreeName: string | null;
  depnYear: number | null;
  depnRate: number | null;
  depnType: string | null;
  depnTypeName: string | null;
  /** '미처리' | '처리완료' */
  statusName: string;
  journalId: number | null;
  nonDeductTax: number | null;
  calcStartDate: string | null;
}

/** 불공제세액(추가분) 한 줄 (W11 Ast16_Lookup_NonDeductTax) */
export interface AstNonDeductTax {
  nonDeductTaxId: number;
  purTrId: number;
  applyDate: string | null;
  applyNonDeductTax: number | null;
  note: string | null;
}

/** 금융상품 보유내역 한 행 (W12 Ast09_Tab_FinanceBook, AS-IS Ast09_BookModel — ast09_book.selectByHoldDate astType 2) */
export interface AstFinanceBook {
  bookId: number;
  holdDate: string;
  keepCorpAccountName: string | null;
  astClassName: string | null;
  astClassTreeName: string | null;
  accountTypeName: string | null;
  curCode: string | null;
  forPurAmt: number | null;
  forBookAmt: number | null;
  holdQty: number | null;
  purAmt: number | null;
  bookAmt: number | null;
  acrIntAmt: number | null;
  evalAmt: number | null;
  evalPl: number | null;
  oci: number | null;
  firstPurDate: string | null;
  firstPurAmt: number | null;
  lockUpPeriodName: string | null;
  lockUpDate: string | null;
  lockUpQty: number | null;
}

/** 종목유형별 합계 한 줄 (ast09_book.getHoldDate) — 상신 전 내용 확인 */
export interface AstFinanceGroup {
  bookId: number;
  astClassName: string | null;
  purAmt: number | null;
  bookAmt: number | null;
  evalAmt: number | null;
  evalPl: number | null;
}

// ── W15 금융상품 운용내역 (Ast09_Tab_FinanceBookOpr) ──

/** 기준일에 적용되는 최근 자기자본 (ast40_owner_capital.selectByMaxDate) */
export interface AstOwnerCapitalMax {
  stdDate: string;
  amt: number | null;
}

/** 투자한도 현황 한 행 (ast09_book.selectInvestAssetLimit) */
export interface AstInvestAssetLimit {
  bookId: number;
  investAssetTypeName: string | null;
  limitRate: number | null;
  limitAmt: number | null;
  evalAmt: number | null;
  purAmt: number | null;
  capitalRatio: number | null;
  ownerCapital: number | null;
  ownerCapitalStdYm: string | null;
}

/** 보유/평가 내역 한 행 (ast09_book.selectFinanceByHoldDate) */
export interface AstFinanceOpr {
  bookId: number;
  holdDate: string;
  astClassTreeId: number;
  keepAccountId: number;
  keepAccountName: string | null;
  astClassName: string | null;
  astClassTreeName: string | null;
  firstPurDate: string | null;
  holdQty: number | null;
  purAmt: number | null;
  bookAmt: number | null;
  purPrice: number | null;
  evalPrice: number | null;
  evalAmt: number | null;
  evalPl: number | null;
  purEvalPl: number | null;
  tyPlRate: number | null;
  purPlRate: number | null;
  stopLossNotice: string | null;
  sellPossibleDate: string | null;
  holdPeriod: string | null;
}

/** 종목별 매수·매도 거래 한 행 (ast06_tr.selectByAstClassTreeId) */
export interface AstFinanceOprTr {
  trId: number;
  date: string;
  qty: number | null;
  price: number | null;
  trAmt: number | null;
  amt: number | null;
  note: string | null;
  feeSum: number | null;
  purBookAmt: number | null;
  purPlRate: number | null;
  pl: number | null;
}

// ── W16 비품관리대장 (Ast13_Tab_OfficeAssets) ──

/** 비품관리대장 한 줄 (ast13_book_depn.selectOfficeAssets) */
export interface AstOfficeAsset {
  bookDepnId: number;
  itemType: string | null;
  purDate: string | null;
  itemName: string | null;
  note: string | null;
  purAmt: number | null;
  corpName: string | null;
  corpTel: string | null;
  retireDate: string | null;
  itemSClassCode: string | null;
  purTrId: number | null;
}

/** 구분별 취득금액 합계 (selectOfficeAssetsGroup) */
export interface AstOfficeAssetGroup {
  bookDepnId: number;
  itemType: string | null;
  purAmt: number | null;
}

/** 구분 콤보 / 화면 거래유형 콤보 한 칸 */
export interface AstCodeName {
  code: string;
  name: string;
}

/** 지출결의서에 딸린 비품 취득 거래 (ast06_tr.selectByExpenseId) — 등록창 그리드 한 줄. 새 줄은 trId가 음수 */
export interface AstExpenseTr {
  trId: number;
  trCode: string | null;
  trName: string | null;
  astClassTreeId: number | null;
  classTreeFullName: string | null;
  note: string | null;
  contAmt: number | null;
  lockYn: boolean;
}

/** 등록창 저장 한 줄 (ast.Ast06_Tr.updateDepn2) */
export interface AstOfficeTrRow {
  trId: number;
  lockYn: boolean;
  trCode: string | null;
  astClassTreeId: number | null;
  note: string | null;
  contAmt: number | null;
  date: string | null;
  tax: number | null;
  corpId: number | null;
  expenseId: number | null;
}

// ── W17 감가상각대장 (Ast13_Tab_DepnBook) ──

/** 감가상각대장 한 줄 (ast13_book_depn.selectByDepnDate2) */
export interface AstDepnBook {
  bookDepnId: number;
  accountTypeName: string | null;
  itemType: string | null;
  itemName: string | null;
  itemFullName: string | null;
  note: string | null;
  purDate: string | null;
  purAmt: number | null;
  nonDeductTax: number | null;
  monthDepnCost: number | null;
  depnCost: number | null;
  acmDepnCost: number | null;
  remDepnCost: number | null;
  retireDate: string | null;
  purTrId: number | null;
}

/** 구분별 합계 (getDepnDate2) */
export interface AstDepnBookGroup {
  bookDepnId: number;
  itemType: string | null;
  purAmt: number | null;
  depnCost: number | null;
  acmDepnCost: number | null;
  remDepnCost: number | null;
}

/** W21 Ast09_Tab_DepositBook 그리드 한 행 (AS-IS Ast09_BookModel, 예금잔고대사). 날짜는 'yyyy-MM-dd' */
export interface AstDepositDiff {
  bookId: number;
  holdDate: string;
  astSClassName: string | null;
  keepCorpAccountName: string | null;
  corpName: string | null;
  accountNo: string | null;
  curCode: string | null;
  preDayAmt: number | null;
  forBookAmt: number | null;
  holdQty: number | null;
  bookAmt: number | null;
  fxPl: number | null;
  realAmt: number | null;
  diffAmt: number | null;
  fxRate: number | null;
}

/** W21 Ast12_Lookup_RealDeposit 그리드 한 행 (AS-IS Ast12_BookRealModel) */
export interface AstBookReal {
  bookRealId: number;
  holdDate: string;
  astClassTreeId: number;
  itemSClassName: string | null;
  corpName: string | null;
  astClassTreeName: string | null;
  curCode: string | null;
  realAmt: number | null;
  realForAmt: number | null;
  rcntAmt: number | null;
  rcntForAmt: number | null;
  note: string | null;
}

/** AS-IS ast.Ast06_Tr.updateDepositInt (W23 예금/예치금 이자수령) — trId가 없으면 새 거래. 실수령액은 서버가 계산한다 */
export interface AstDepositIntSaveReq {
  trId: number | null;
  date: string;
  astClassTreeId: number | null;
  intAmt: number | null;
  corpTax: number | null;
  localTax: number | null;
  note: string | null;
}

// ── X03 고유자산 거래처리 (Ast06_Tab_TrIntrinsic) ──
/** AS-IS ast.Ast06_Tr.selectByPayCode · selectById (고유자산 거래) */
export interface AstTrIntrinsic {
  trId: number;
  date: string;
  trCode: string | null;
  trName: string | null;
  corpId: number | null;
  corpName: string | null;
  astClassTreeId: number | null;
  classTreeName: string | null;
  classTreeFullName: string | null;
  itemLClassCode: string | null;
  itemMClassCode: string | null;
  itemSClassCode: string | null;
  curCode: string | null;
  contAmt: number | null;
  tax: number | null;
  amt: number | null;
  settleMngYn: boolean;
  depositId: number | null;
  depositName: string | null;
  note: string | null;
  personId: number | null;
  personName: string | null;
  journalId: number | null;
  apprId: number | null;
  apprCnt: string | null;
  dcrClassTreeId: number | null;
  rcvPayCode: string | null;
  financeYn: boolean;
  bookIoType: string | null;
  purTrId: number | null;
  bookAmt: number | null;
  unSettleAmt: number | null;
  /** 외화 거래(X08) — 적용환율·외화금액 */
  fxRate: number | null;
  forAmt: number | null;
}

export interface AstTrIntrinsicSaveReq {
  trId: number | null;
  date: string;
  trCode: string | null;
  corpId: number | null;
  astClassTreeId: number | null;
  contAmt: number | null;
  tax: number | null;
  amt: number | null;
  settleMngYn: boolean;
  depositId: number | null;
  note: string | null;
  curCode: string | null;
  purTrId: number | null;
  bookAmt: number | null;
  itemLClassCode: string | null;
  itemSClassCode: string | null;
  /** 원장 입출고 거래가 아니면 true — 서버가 장부금액 = 거래금액, 취득거래ID = 자기 자신으로 둔다 */
  selfPur: boolean;
  /** 외화 고유자산 거래처리(X08)면 true — 환율·외화금액을 저장하고 감가상각·비품원장은 건너뛴다 */
  foreign?: boolean;
  fxRate?: number | null;
  forAmt?: number | null;
}

/** AS-IS ast.Ast07_Settle.selectByTrId */
export interface AstSettleByTr {
  settleId: number;
  trId: number | null;
  settleDate: string;
  settleAmt: number | null;
  amt: number | null;
  depositId: number | null;
  depositName: string | null;
  note: string | null;
  trCode: string | null;
  journalId: number | null;
  /** 외화 결제(X08) */
  forSettleAmt: number | null;
  fxRate: number | null;
  forAmt: number | null;
}

/** AS-IS ast.Ast13_BookDepn.selectByDepnDate */
export interface AstBookDepn {
  purTrId: number;
  astClassTreeId: number | null;
  itemType: string | null;
  itemName: string | null;
  itemFullName: string | null;
  purDate: string | null;
  purAmt: number | null;
  depnDate: string | null;
  depnCost: number | null;
}

/** AS-IS ast.Ast06_Tr.selectDepositTr / selectById (X06 계좌이체, 거래유형 9005) — 그리드 한 행 */
export interface AstTrDeposit {
  trId: number;
  date: string;
  trCode: string | null;
  /** 거래유형 이름(f_cdnm trCode) — 연관문서 창 제목(X10) */
  trName: string | null;
  astClassTreeId: number | null;
  classTreeName: string | null;
  depositId: number | null;
  depositName: string | null;
  corpId: number | null;
  curCode: string | null;
  amt: number | null;
  fee: number | null;
  note: string | null;
  personId: number | null;
  personName: string | null;
  journalId: number | null;
  apprId: number | null;
  apprCnt: string | null;
  /** 외화 계좌이체(X10) */
  fxRate: number | null;
  forAmt: number | null;
}

/** AS-IS Ast06_Lookup_TrDeposit.preUpdate → ast.Ast06_Tr.update (X06 계좌이체) — trId가 없으면 새 거래 */
export interface AstTrDepositSaveReq {
  trId: number | null;
  date: string;
  astClassTreeId: number | null;
  corpId: number | null;
  depositId: number | null;
  amt: number | null;
  fee: number | null;
  note: string | null;
  /** 외화 계좌이체(X10) — curCode가 있으면 외화 저장(적용통화·적용환율·외화금액) */
  curCode?: string | null;
  fxRate?: number | null;
  forAmt?: number | null;
}
