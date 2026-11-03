/** act(관리회계) 화면 타입 (E25~) — API 응답 record와 같은 필드 */

/** 계정코드 한 행 (act01_account_code.selectBySlipYn) */
export interface AccountCode {
  accountCodeId: number;
  companyId: number;
  attributeCode: string;
  attributeName: string;
  accountCode: string;
  accountName: string;
  accountName2: string;
}

/** 계정코드 관리 그리드 한 행 (act01_account_code.selectByCompanyId, E27). 여부 열은 DB 형태('true'/'false') 그대로 */
export interface AccountCodeAdmin {
  accountCodeId: number;
  companyId: number;
  accountCode: string;
  accountName: string;
  accountName2: string | null;
  accountEName: string | null;
  parentCode: string | null;
  parentName: string | null;
  attributeCode: string | null;
  attributeName: string | null;
  drcrType: string | null;
  drcrName: string | null;
  slipYn: string | null;
  printYn: string | null;
  useYn: string | null;
  fssYn: string | null;
  fssAccountName: string | null;
  fssSlipYn: string | null;
  printSeq: string | null;
  content: string | null;
}

/** 계정코드 편집창 저장 (act.Act01_AccountCode.modelUpdate) — accountCodeId가 없거나 0 이하면 새 계정 */
export type AccountCodeSaveReq = Omit<AccountCodeAdmin, 'companyId' | 'parentName' | 'attributeName' | 'drcrName' | 'accountCodeId'> & { accountCodeId?: number | null };

/** 출력정보 및 사용여부 설정 저장 한 행 */
export interface AccountCodePrintSaveReq {
  accountCodeId: number;
  accountName2: string | null;
  printYn: string | null;
  useYn: string | null;
}

/** 계정과목 트리 한 행 — 전위 순서 평평한 목록 (act01_account_code.selectTreeByCompanyId). parentId는 화면에서 parentCode로 찾아 채운다 */
export interface AccountCodeTree {
  accountCodeId: number;
  companyId: number;
  accountCode: string;
  accountName: string;
  accountName2: string | null;
  parentCode: string | null;
  slipYn: string | null;
  level: number;
  parentId: number;
}

/** 계정과목복사 창의 고객사 한 행 (sys01_company.selectByUseYn) */
export interface ActCompany {
  companyId: number;
  companyName: string;
  locationName: string | null;
}

/** 이익제공(수령) 연결정보 한 행 (act14_link.selectByAccountCode) */
export interface ActLink {
  linkId: number;
  companyId: number;
  accountCode: string;
  provideContentCode: string;
  seq: number | null;
  provideName: string | null;
}

/** 이익제공(수령) 내용 콤보 한 항목 */
export interface ActCodeOption {
  code: string;
  name: string;
}

/** 대표계정코드 한 행 (act10_repr_account.selectByCompanyId, E28) — 계정속성명·상대 대표계정명은 SQL 계산 열 */
export interface ReprAccount {
  reprAccountId: number;
  companyId: number;
  reprAccountCode: string;
  reprAccountName: string;
  attributeCode: string | null;
  attributeName: string | null;
  tgtReprAccountCode: string | null;
  tgtReprAccountName: string | null;
  note: string | null;
}

/** 실계정맵핑 한 행 (act13_real_account_map.selectByCompanyId, E31) — 대표계정명·실계정과목은 SQL 계산 열 */
export interface RealAccountMap {
  realAccountMapId: number;
  companyId: number;
  reprAccountCode: string | null;
  reprAccountName: string | null;
  accountMap: string | null;
  realAccountCode: string | null;
  realAccountName: string | null;
  note: string | null;
}

/** 마감검증 체크항목 한 행 (act15_close_check.selectByText, E32). 여부는 DB 형태('true'/'false') 그대로 — 행이 없는 고객사의 closeCheckId는 SQL이 준 임시 번호 */
export interface CloseCheck {
  closeCheckId: number;
  companyId: number;
  companyName: string;
  depositRealMatchYn: string;
  depositApprYn: string;
  depositLedgerMatchYn: string;
  financeEvalYn: string;
  financeLedgerMatchYn: string;
  fxEvalYn: string;
  depnYn: string;
  tangibleMatchYn: string;
  intangibleMatchYn: string;
  fundFeeMatchYn: string;
  fundFeeEvalYn: string;
  unfixYn: string;
  supplyMatchYn: string;
}

/** 거래맵핑 한 행 (act11_tr_map.selectByCompanyId, E30). 여부는 DB 형태('true'/'false') 그대로 — 거래명·입출고구분명·손익대표계정명은 SQL 계산 열 */
export interface TrMap {
  trMapId: number;
  companyId: number;
  trCode: string | null;
  trName: string | null;
  journalGroup: string | null;
  bookIoType: string | null;
  bookIoTypeName: string | null;
  plReprAccountCode: string | null;
  plReprAccountName: string | null;
  useYn: string | null;
  note: string | null;
}

/** 분개맵핑 한 행 (act12_journal_map.selectByJournalGroup, E30) — 대표계정명·차대구분명은 SQL 계산 열 */
export interface JournalMap {
  journalMapId: number;
  companyId: number;
  journalGroup: string | null;
  seq: number | null;
  reprAccountCode: string | null;
  reprAccountName: string | null;
  drcrType: string | null;
  drcrTypeName: string | null;
  formula: string | null;
  forFormula: string | null;
  note: string | null;
  useYn: string | null;
}

/** 급여 전표 한 행(act03_journal_dtl) — 차변·대변 계정과 금액 (Pay10_Lookup_Journal) */
export interface JournalPayMonth {
  journalDtlId: number;
  drAccountCode?: string | null;
  drAccountName?: string | null;
  drAmt?: number | null;
  drAstName?: string | null;
  crAccountCode?: string | null;
  crAccountName?: string | null;
  crAmt?: number | null;
  crAstName?: string | null;
}

/** 계좌별 입금·출금 분개 한 행 (Act02_Tab_DepositIoList inGrid·outGrid — AS-IS Act03_JournalDtlModel) */
export interface JournalDtl {
  trName: string | null;
  corpName: string | null;
  note: string | null;
  drForAmt: number | null;
  crForAmt: number | null;
}

/** AS-IS act.Act03_JournalDtl.selectByJournalId (Ast06_Grid_Journal, U04) — 분개 그리드(차변/대변) 한 행 */
export interface JournalLine {
  journalDtlId: number;
  trName: string | null;
  drAccountCode: string | null;
  drAstAccountName: string | null;
  drAmt: number | null;
  drNote: string | null;
  crAccountCode: string | null;
  crAstAccountName: string | null;
  crAmt: number | null;
  /** 외화 전표(X07) 분개 그리드의 외화금액 */
  drForAmt: number | null;
  crForAmt: number | null;
  crNote: string | null;
}


/** AS-IS act.Act02_Journal.selectMonthBiz (Act02_Tab_CreateJournalBiz, U10) — 급여/카드 회계처리 위 그리드 한 행. rowKey는 전표가 없는 행의 행번호일 뿐이다 */
export interface JournalBiz {
  rowKey: number;
  journalId: number | null;
  retireId: number | null;
  companyId: number | null;
  note: string | null;
  trCode: string | null;
  trCount: number | null;
  journalAmt: number | null;
  bizCloseYn: string | null;
  journalYn: string | null;
  fixYnName: string | null;
  accountCloseYn: string | null;
  date: string | null;
  payMonthCode: string | null;
}

/** AS-IS act.Act03_JournalDtl.selectBizCard·selectChargeFee·selectErpChargeFee·selectByJournalId (Act02_Grid_CreateJournalBiz, U10) — 분개 한 행 */
export interface JournalBizLine {
  journalDtlId: number;
  journalId: number;
  date: string | null;
  journalNoStr: string | null;
  note: string | null;
  drAccountCode: string | null;
  drAstAccountName: string | null;
  drAmt: number | null;
  drNote: string | null;
  crAccountCode: string | null;
  crAstAccountName: string | null;
  crAmt: number | null;
  crNote: string | null;
}

/** createJournalBiz·deleteJournalBiz가 읽는 행 속성 */
export interface JournalBizRow {
  journalId: number | null;
  retireId: number | null;
  trCode: string | null;
  note: string | null;
  date: string | null;
  payMonthCode: string | null;
}

/** AS-IS act.Act06_JournalTmp.selectByJournalId (Act02_Lookup_ModiJournal, W05 2단계) — 전표변경 창의 분개 한 줄. reprAccountCode·accountMap·forAmt는 그리드에 안 보이지만 저장 때 그대로 되돌려 보낸다 */
export interface JournalTmp {
  journalTmpId: number;
  seq: number | null;
  drcrType: string | null;
  drcrTypeName: string | null;
  realAccountCode: string | null;
  realAccountName: string | null;
  reprAccountCode: string | null;
  accountMap: string | null;
  amt: number | null;
  forAmt: number | null;
  depositId: number | null;
  depositName: string | null;
  note: string | null;
}

/** 전표변경 창을 열 때 값: 전표 머리 + 임시분개 줄 */
export interface JournalEdit {
  journalId: number;
  date: string;
  journalNo: number | null;
  corpId: number | null;
  corpName: string | null;
  trName: string | null;
  note: string | null;
  fixYn: boolean;
  curCode: string | null;
  lines: JournalTmp[];
}

/** AS-IS act.Act02_Journal.updateAll 요청 — 줄 순서가 곧 순번(10, 20, …) */
export interface JournalSaveReq {
  corpId: number | null;
  note: string | null;
  /** 외화 전표(X07)만 보낸다. 비면 통화를 바꾸지 않는다(새 전표는 KRW) */
  curCode?: string | null;
  lines: {
    drcrType: string | null;
    realAccountCode: string | null;
    reprAccountCode: string | null;
    accountMap: string | null;
    amt: number | null;
    forAmt: number | null;
    depositId: number | null;
    note: string | null;
  }[];
}

/** AS-IS act.Act80_RelateAppr.selectByTrId·selectByJournalId (Act80_Lookup_RelateAppr, W05 2단계 ⓑ) — 연관문서 한 행. lockYn = 거래·결제에서 오는 문서라 연결을 끊을 수 없음 */
export interface ActRelateAppr {
  relateApprId: number;
  apprId: number;
  journalId: number | null;
  trId: number | null;
  regDate: string | null;
  effectDate: string | null;
  title: string | null;
  statusName: string | null;
  regEmpName: string | null;
  lockYn: boolean;
}

/** AS-IS act.Act02_Journal.selectByDate·selectById (Act02_Tab_CreateJournal, X01) — 전표 한 행. journalNoStr = 전표번호 글자 */
export interface Journal {
  journalId: number;
  companyId: number;
  date: string;
  journalNo: number | null;
  journalNoStr: string | null;
  corpId: number | null;
  corpName: string | null;
  note: string | null;
  journalAmt: number | null;
  personName: string | null;
  dcrCountStr: string | null;
  fixYn: boolean;
  fixYnName: string | null;
  closeName: string | null;
  curCode: string | null;
}

/** AS-IS act.Act02_Journal.updateAll (NEW) 요청 */
export interface JournalNewReq extends JournalSaveReq {
  date: string;
}

/** AS-IS act.Act02_Journal.selectByDateAll·selectById (Act02_Tab_JournalFix, X02) — 전표승인처리 위 그리드 한 행 */
export interface JournalFix {
  journalId: number;
  companyId: number;
  date: string;
  journalNo: number | null;
  journalNoStr: string | null;
  corpId: number | null;
  corpName: string | null;
  trName: string | null;
  note: string | null;
  curCode: string | null;
  journalAmt: number | null;
  personName: string | null;
  dcrCountStr: string | null;
  fixYn: boolean;
  fixYnName: string | null;
  fixPersonName: string | null;
  fixDateStr: string | null;
}

/** 회계마감 월 목록 한 행 (act04_gen_ledger.selectCloseStatus, X14) */
export interface GenLedgerCloseStatus {
  genLedgerId: number;
  stdDate: string;
  monthName: string;
  closeName: string;
}

/** 회계마감 처리 요청 — procType P 회계마감 · C 마감취소 · A 마감검증 */
export interface GenLedgerCloseReq {
  closeDate: string;
  procType: 'P' | 'C' | 'A';
  depositUpdateYn: boolean;
  genLedgerUpdateYn: boolean;
}

/** 마감현황(checkGrid) 한 줄 */
export interface GenLedgerCloseNote {
  genLedgerId: number;
  note: string;
}

/** status 1 성공 · -1 실패(message). notes는 실패여도 마감현황에 채운다 */
export interface GenLedgerCloseProcessRes {
  status: number;
  message: string;
  notes: GenLedgerCloseNote[];
}

/** 분개장 한 줄 (act03_journal_dtl.selectByCompanyId, X15). 출력 체크는 화면 전용이라 없다 */
export interface JournalDtlList {
  journalId: number;
  journalDtlId: number;
  seq: number | null;
  journalDateNo: string | null;
  date: string;
  journalNo: number | null;
  trName: string | null;
  corpName: string | null;
  note: string | null;
  curCode: string | null;
  closeName: string | null;
  drAccountCode: string | null;
  drAccountName: string | null;
  drAmt: number | null;
  drForAmt: number | null;
  crAccountCode: string | null;
  crAccountName: string | null;
  crAmt: number | null;
  crForAmt: number | null;
}

/** 분개장 출력 준비 요청 — journalIds가 비면 조회 조건 전체 */
export interface JournalDtlRdReq {
  windowClassName: string;
  startDate: string;
  closeDate: string;
  corpId: number | null;
  searchText: string;
  trCode: string | null;
  abroType: string;
  journalIds: number[];
}

/** 계정별원장 한 줄 (act03_journal_dtl.selectByAccountCode, X17) — 첫 줄은 전월이월(journalId 0) */
export interface JournalSub {
  journalDtlId: number;
  date: string;
  journalNo: number | null;
  journalNoStr: string | null;
  journalId: number;
  trCode: string | null;
  trName: string | null;
  corpName: string | null;
  note: string | null;
  accountCode: string | null;
  accountName: string | null;
  drAmt: number | null;
  crAmt: number | null;
  drAstName: string | null;
  drNote: string | null;
  balAmt: number | null;
}

/** 기간 중 분개가 있는 계정 (act02_journal.getAccountCode) */
export interface JournalAccount {
  trCode: string;
  trName: string | null;
}

/** 관리계좌에 맞는 실계정 (act13_real_account_map.selectByAstClassTreeId) */
export interface JournalRealAccount {
  accountCode: string | null;
  accountName: string | null;
  realAccountName: string | null;
}

/** 계정별원장 출력 준비 요청 */
export interface JournalSubRdReq {
  windowClassName: string;
  startDate: string;
  closeDate: string;
  accountCode: string;
  trCode: string | null;
  corpId: number | null;
  depositId: number | null;
  searchText: string;
}

/** 계정원장 한 줄 (act04_gen_ledger.selectByStdDate1·2 / selectByAccountCode, X18). level·parentCode는 하위계정 트리에만 있다 */
export interface GenLedger {
  genLedgerId: number;
  accountCode: string | null;
  accountName: string | null;
  accountName2: string | null;
  drTodayBalAmt: number | null;
  drTodayDiffAmt: number | null;
  drPredayBalAmt: number | null;
  crTodayBalAmt: number | null;
  crTodayDiffAmt: number | null;
  crPredayBalAmt: number | null;
  todayBalAmt: number | null;
  slipYn: string | null;
  level: number | null;
  parentCode: string | null;
}

/** 계정원장 출력 준비 요청 */
export interface GenLedgerRdReq {
  windowClassName: string;
  stdDate: string;
  diffType: string;
  searchText: string;
}

/** 재무제표 한 줄 (act04_gen_ledger.selectBSPL — 과목/당기금액/전기금액, X20 손익계산서·X21 재무상태표) */
export interface GenLedgerReport {
  genLedgerId: number;
  accountName2: string;
  curBalAmt: number | null;
  preBalAmt: number | null;
}

/** 재무제표 출력 준비 요청 (reportType 1 재무상태표 / 2 손익계산서) */
export interface GenLedgerReportRdReq {
  windowClassName: string;
  stdDate: string;
  compareDate: string;
  exceptZeroYn: boolean;
  reportType: string;
}

/** 금감원보고용 재무제표 출력 준비 요청 (X22 — stdDate는 기준년월의 말일, code GA023 재무상태표 / GA025 손익계산서) */
export interface GenLedgerFssRdReq {
  windowClassName: string;
  stdDate: string;
  code: string;
}

/** 자산별 분개 이력 한 줄 (act02_journal.selectByAstClassTreeId, Act02_Grid_History, X19) */
export interface JournalHistory {
  journalId: number;
  date: string;
  astClassTreeName: string | null;
  trName: string | null;
  journalAmt: number | null;
  note: string | null;
}

/** 결산회기관리 한 행 (act09_account_num.selectByRetrieve, EE10). 날짜는 'YYYY-MM-DD' */
export interface AccountNum {
  accountNumId: number;
  num: number | null;
  startDate: string | null;
  closeDate: string | null;
  note: string | null;
}
