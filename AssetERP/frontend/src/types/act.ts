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
