/** 급여항목(pay20_item) — 지급/공제 항목관리·급여항목 조회창 */
export interface PayItem {
  itemId: number;
  itemType?: string;
  itemCd?: string;
  itemName?: string;
  nonTaxType?: string;
  seq?: number;
  useYn?: string;
  note?: string;
  itemTypeName?: string;
  nonTaxTypeName?: string;
}

/** 율관리(pay21_rate) */
export interface PayRate {
  rateId: number;
  rateCode?: string;
  startDate?: string;
  applyRate?: number;
  note?: string;
  rateName?: string;
}

/** 임금계산방법 기준 적용일 목록 한 행 */
export interface PayFormulaDate {
  formulaId: number;
  startDate: string;
}

/** 임금계산방법(pay04_formula) 한 행 */
export interface PayFormula {
  formulaId: number;
  companyId?: number;
  startDate?: string;
  itemCd?: string;
  itemName?: string;
  formulaForm?: string;
  note?: string;
}

/** 간이세액표·공제표·인적공제금액 탭의 적용일 목록 한 행 (적용일별 첫 행) */
export interface PayStartDate {
  id: number;
  startDate: string;
}

/** 근로소득 간이세액표(pay22, 천만원 이하) 한 행 */
export interface PaySimpleTax {
  simpleTaxTableId: number;
  startDate?: string;
  fromAmt?: number;
  toAmt?: number;
  deductCnt1?: number;
  deductCnt2?: number;
  deductCnt3?: number;
  deductCnt4?: number;
  deductCnt5?: number;
  deductCnt6?: number;
  deductCnt7?: number;
  deductCnt8?: number;
  deductCnt9?: number;
  deductCnt10?: number;
  deductCnt11?: number;
}

/** 근로소득 간이세액표(pay23, 천만원 초과) 한 행 */
export interface PaySimpleTaxOther {
  simpleTaxTableOtherId: number;
  startDate?: string;
  fromAmt?: number;
  toAmt?: number;
  rate1?: number;
  rate2?: number;
  addTax?: number;
  note?: string;
}

/** 근로소득 공제표(pay24) 한 행 — 공제표 구간(dataCode 2) */
export interface PayDeductTable {
  deductTableId: number;
  startDate?: string;
  dataCode?: string;
  limitAmt?: number;
  fromAmt?: number;
  toAmt?: number;
  deductAmt?: number;
  deductRate?: number;
  note?: string;
}

/** 인적공제금액(pay25) 한 행 */
export interface PayPersonDeduct {
  personDeductId: number;
  startDate?: string;
  personDeductCode?: string;
  personDeductName?: string;
  deductAmt?: number;
  note?: string;
}

/** 과세표준 구간별 기본세율(pay26) 한 행 */
export interface PayTaxCalc {
  taxCalcTableId: number;
  startDate?: string;
  fromAmt?: number;
  toAmt?: number;
  basicTax?: number;
  rate?: number;
  note?: string;
}

/** 근로소득 세액공제(pay27) 한 행 */
export interface PayTaxDeduct {
  taxDeductTableId: number;
  startDate?: string;
  fromAmt?: number;
  toAmt?: number;
  deductAmt?: number;
  rate?: number;
  note?: string;
}

/** 근로소득 세액공제 한도(pay28) 한 행 */
export interface PayTaxDeductLimit {
  taxDeductLimitId: number;
  startDate?: string;
  fromAmt?: number;
  toAmt?: number;
  minLimit?: number;
  maxLimit?: number;
  rate?: number;
  note?: string;
}

/** 급여공제 기타설정(pay29) 한 행 */
export interface PayOtherSetup {
  otherSetupId: number;
  startDate?: string;
  hiMaxDiv?: number;
  eiMaxDiv?: number;
  hiMinAmt?: number;
  hiMaxAmt?: number;
  npMinAmt?: number;
  npMaxAmt?: number;
  stdTaxDeduct?: number;
  note?: string;
}

/** 근로시간 기준(pay34_work_time_config) — 근로시간기준관리 */
export interface PayWorkTime {
  workTimeConfigId: number;
  startDate?: string;
  dayWorkHours?: number;
  weekMaxAddHours?: number;
  ntStartTime?: string;
  ntEndTime?: string;
  otMultRate?: number;
  ntMultRate?: number;
  holiStdMultRate?: number;
  holiOverMultRate?: number;
}

/** 연봉계약 한 행 — AS-IS Pay01_AnnualModel (S13). 날짜는 yyyy-MM-dd */
export interface PayAnnual {
  annualId: number;
  companyId?: number;
  personId?: number | null;
  posName?: string;
  personNo?: string;
  personName?: string;
  startDate?: string | null;
  closeDate?: string | null;
  startTime?: string;
  closeTime?: string;
  monthOtHours?: number | null;
  annualPay?: number | null;
  retirePay?: number | null;
  yearPay?: number | null;
  etcAgreement?: string;
  basicPay?: number | null;
  mealPay?: number | null;
  carMt?: number | null;
  childcareAllowance?: number | null;
  overPay?: number | null;
  etc01Pay?: number | null;
  etc02Pay?: number | null;
  monthPay?: number | null;
  note?: string;
  apprId?: number | null;
  apprStatusCode?: string | null;
  apprStatusName?: string;
  birthDay?: string | null;
  hireDate?: string | null;
  companyName?: string;
  companyAddress?: string;
  companyAgent?: string;
  orgName?: string;
  personAddress?: string;
}

/** 계약서 Mapping 한 행 — AS-IS Pay06_ActMappingModel (S13) */
export interface PayActMapping {
  actMappingId: number;
  companyId?: number;
  title?: string;
  content?: string | null;
  linkCode?: string;
  linkName?: string;
  defaultYn?: boolean;
  note?: string;
  kindCode?: string | null;
  kindName?: string;
}

/** 급여(pay10_month) 한 행 — 급여관리(S16) 왼쪽 그리드·근로시간 팝업 */
export interface PayMonth {
  monthId: number;
  companyId?: number;
  payCd: string;
  date: string;
  personId: number;
  workDay: number;
  totalWorkTime: number;
  extendWorkTime: number;
  nightWorkTime: number;
  holidayWorkTime: number;
  note?: string | null;
  stdMonth?: string | null;
  personNo?: string;
  personNm?: string;
  posNm?: string;
  paySum?: number;
  taxDdcSum?: number;
  deductionSum?: number;
}

/** 지급구분/일자 조회창(Pay10_Lookup_GroupList) 한 행 */
export interface PayMonthGroup {
  payGroupNm: string;
  companyId?: number;
  date: string;
  payCd: string;
}

/** 서버 checkAppr 결과 — ok=false면 message가 막는 이유 */
export interface PayApprCheck {
  ok: boolean;
  message?: string | null;
}

/** 급여 생성 요청 — 대상 사원은 Emp01_Lookup_TransDate에서 고른 행 */
export interface PayMonthCreateReq {
  payCode: string;
  payDate: string;
  annualYn: boolean;
  stdMonth: string;
  targets: { personId: number; transCode: string; hireDate: string | null; transDate: string }[];
}

/** 급여 항목(pay11_month_item) 한 행 — 지급(itemType 1)·공제(2) 그리드 */
export interface PayMonthItem {
  monthItemId: number;
  monthId: number;
  itemType: string;
  itemCd: string;
  itemAmt?: number | null;
  itemTypeNm?: string;
  nonTaxTypeNm?: string;
  itemNm?: string;
}

/** 급여관리(항목별) 그리드 한 행 — pay11_month_item.selectByText (S17) */
export interface PayMonthItemText {
  monthItemId: number;
  monthId: number;
  personId: number;
  itemType: string;
  itemCd: string;
  itemAmt?: number | null;
  itemTypeName?: string;
  nonTaxTypeName?: string;
  itemName?: string;
  personNo?: string;
  personName?: string;
  posName?: string;
}

/** 급여항목조회 그리드 한 행 — pay11_month_item.selectByDate (S19) */
export interface PayMonthItemDate {
  monthItemId: number;
  payDate?: string | null;
  payName?: string;
  personNo?: string;
  personName?: string;
  posName?: string;
  itemTypeName?: string;
  itemName?: string;
  itemAmt?: number | null;
}

/** 급여명세서 목록 한 행 — pay10_month.selectByYearPersonId (S20·S21) */
export interface PayMonthPerson {
  monthId: number;
  date: string;
  payName?: string;
  deductionSum?: number | null;
  paySum?: number | null;
  incomeTaxSum?: number | null;
}

/** 급여 비고(pay09_relate_note) — noteType 1 전체 / 2 개별 */
export interface PayRelateNote {
  relateNoteId: number;
  companyId?: number;
  payDate: string;
  payCd: string;
  noteType: string;
  personId?: number | null;
  note?: string | null;
  noteTypeNm?: string;
  personNm?: string;
}

/** 급여대장 상신 상태(pay05_relate_appr + apr01_appr) — statusCode가 null이면 결재문서 없음, '40'은 반려 */
export interface PayRelateAppr {
  relateApprId: number;
  apprId?: number | null;
  statusCode?: string | null;
  statusName?: string | null;
}

/** 급여출금계좌(pay03_account) 한 행 */
export interface PayAccount {
  accountId: number;
  startDate?: string | null;
  astClassTreeId?: number | null;
  astClassTreeName?: string | null;
  bankCd?: string | null;
  bankName?: string | null;
  accountNo?: string | null;
  accountName?: string | null;
  note?: string | null;
}

/** 4대보험 연말정산 납부(pay32_insure_pay) 한 행 */
export interface PayInsurePay {
  insurePayId: number;
  companyId?: number;
  personId: number;
  year?: string;
  insureCd?: string;
  tgtAmt?: number | null;
  payCd?: string | null;
  payDiv?: number | null;
  date?: string | null;
  cnt?: number | null;
  amt?: number | null;
  remAmt?: number | null;
  personNo?: string;
  personNm?: string;
  insureNm?: string;
  payNm?: string;
}

// ── 퇴직정산 Pay10_Tab_Retire (S22) ──

/** 퇴직정산 급여 한 건 (pay10_month, pay_cd 03) */
export interface PayRetireMonth {
  monthId: number;
  companyId: number;
  payCd: string;
  date: string;
  personId: number;
  retireDate?: string | null;
}

/** 퇴직정산 4대보험 한 행 (pay12_retire_insure) — insureCode 2 건강 · 3 장기요양 · 4 고용. 추가한 행은 임시 음수 retireInsureId */
export interface PayRetireInsure {
  retireInsureId: number;
  monthId: number;
  insureCode: string;
  year?: string | null;
  applyTerm?: string | null;
  workMonthCnt?: number | null;
  payMonthCnt?: number | null;
  totalPay?: number | null;
  monthPay?: number | null;
  insureRate?: number | null;
  monthAmt?: number | null;
  fixAmt?: number | null;
  payAmt?: number | null;
  unpayAmt?: number | null;
  settleAmt?: number | null;
}

/** 퇴직정산 소득세 (pay13_retire_tax) — 당해년도 / 전년도(py) */
export interface PayRetireTax {
  retireTaxId: number;
  monthId: number;
  incomeDeduct?: number | null;
  incomeAmt?: number | null;
  taxBase?: number | null;
  calcTax?: number | null;
  decideTax?: number | null;
  preOfficePayTax?: number | null;
  curOfficePayTax?: number | null;
  settleTax?: number | null;
  pyIncomeDeduct?: number | null;
  pyIncomeAmt?: number | null;
  pyTaxBase?: number | null;
  pyCalcTax?: number | null;
  pyDecideTax?: number | null;
  pyPreOfficePayTax?: number | null;
  pyCurOfficePayTax?: number | null;
  pySettleTax?: number | null;
}

/** 퇴직정산 소득세 항목 (pay14_retire_tax_item) — itemType 1 총소득액 · 3 종합소득공제 · 4 세액공제 */
export interface PayRetireTaxItem {
  retireTaxItemId: number;
  monthId: number;
  itemType: string;
  itemName: string;
  itemAmt?: number | null;
  pyItemAmt?: number | null;
}

/** 9. 기납부세액 그리드 행 — retireTaxId 1 종(전)근무지 · 2 주(현)근무지 */
export interface PayRetireTaxOffice {
  retireTaxId: number;
  titleName: string;
  officePayTax?: number | null;
  pyOfficePayTax?: number | null;
}

export interface PayRetireTaxDetail {
  tax: PayRetireTax | null;
  incomes: PayRetireTaxItem[];
  deducts: PayRetireTaxItem[];
  credits: PayRetireTaxItem[];
  offices: PayRetireTaxOffice[];
}

/** pay15_retire_leave 한 행 */
export interface PayRetireLeaveRow {
  retireLeaveId: number;
  monthId: number;
  calcStdType: string;
  yearCnt?: number | null;
  yearCntStr?: string | null;
  periodDateStr?: string | null;
  leaveDays?: number | null;
}

/** 연차수당 탭 — 계산값 + 입사일기준(entry)/회계일기준(fiscal) */
export interface PayRetireLeave {
  remainLeaveDays?: number | null;
  addLeaveDays?: number | null;
  totalRemainLeaveDays?: number | null;
  dailyAmt?: number | null;
  retireLeaveAmt?: number | null;
  entry: PayRetireLeaveRow[];
  fiscal: PayRetireLeaveRow[];
}

/** 잔여휴가 팝업 [계산] 결과 */
export interface PayRetireLeaveCalc {
  remainLeaveDays?: number | null;
  addLeaveDays?: number | null;
  totalRemainLeaveDays?: number | null;
  entry: PayRetireLeaveRow[];
  fiscal: PayRetireLeaveRow[];
}

/** 소득세 탭 [근로소득공제표] 창 — 공제한도(dataCode 1) + 공제표(dataCode 2) */
export interface PayRetireDeduct {
  limitAmt: number;
  rows: PayDeductTable[];
}

/** 소득세 탭 [산출기준] 창 — 세액공제 + 세액공제 한도 */
export interface PayRetireTaxDeduct {
  deducts: PayTaxDeduct[];
  limits: PayTaxDeductLimit[];
}

/** 갑근세원천징수확인서 발급 한 행 (S23, GET /api/v1/pay/tax-withholdings) — AS-IS Pay40_IncomeTaxWithholdingModel */
export interface PayTaxWithholding {
  incomeTaxWithholdingId: number;
  personId?: number | null;
  personName?: string | null;
  regDate?: string | null;
  stdYear?: string | null;
  purUseCode?: string | null;
  purUseName?: string | null;
  submitTo?: string | null;
  cnt?: number | null;
  issueNo?: number | null;
  apprId?: number | null;
  statusCode?: string | null;
  statusName?: string | null;
}

/** 원천징수영수증 파일 한 건 (S24, GET /api/v1/pay/tax-receipts/mine) — AS-IS Pay08_TaxWithholdingModel */
export interface PayTaxReceipt {
  taxWithholdingId: number;
  personId?: number | null;
  personName?: string | null;
  regDate?: string | null;
  note?: string | null;
  fileId: number;
  fileName?: string | null;
  fileExt?: string | null;
}

/** 4대보험 신고 한 행 (S26, GET /api/v1/pay/insure-applies) — AS-IS Pay31_InsureApplyModel. 날짜는 yyyy-MM-dd */
export interface PayInsureApply {
  insureApplyId: number;
  companyId?: number;
  personId?: number | null;
  insureCode?: string | null;
  insureApplyCode?: string | null;
  applyDate?: string | null;
  initDate?: string | null;
  applyMonth?: string | null;
  applyMonthPay?: number | null;
  preYearWorkMonthCnt?: number | null;
  preYearPay1?: number | null;
  preYearPay2?: number | null;
  preYearPay3?: number | null;
  termInfo?: string | null;
  payCode?: string | null;
  payDiv?: number | null;
  note?: string | null;
  npsInitPayYn?: boolean | null;
  personNo?: string | null;
  personName?: string | null;
  insureName?: string | null;
  insureApplyName?: string | null;
  payName?: string | null;
  insureYearPay?: number | null;
}

/** 자격취득·보수변동/착오정정 등록 창의 [생성] 요청 (AS-IS pay.Pay31_InsureApply.insert1) */
export interface PayInsureApplyCreateReq {
  personId: number;
  ch01: boolean;
  ch02: boolean;
  ch03: boolean;
  npsInitPayYn?: boolean;
  insureApplyCode: string;
  applyDate: string;
  initDate?: string | null;
  applyMonthPay: number;
  applyMonth?: string | null;
}

/** 급여공제 기본설정 (GET /api/v1/pay/basic-setup, AS-IS Pay30_BasicSetupModel — S28) */
export interface PayBasicSetup {
  basicSetupId: number;
  companyId: number;
  withHoldRate?: number | null;
  hiDivPayCode?: string | null;
  hiMaxDiv?: number | null;
  eiDivPayCode?: string | null;
  eiMaxDiv?: number | null;
}

export interface PayBasicSetupSaveReq {
  basicSetupId?: number | null;
  withHoldRate: number | null;
  hiDivPayCode: string | null;
  hiMaxDiv: number | null;
  eiDivPayCode: string | null;
  eiMaxDiv: number | null;
}

/** 지출결의서 한 행 (U03, AS-IS Pay50_ExpenseModel) — 목록과 아래 편집 폼이 같이 쓴다 */
export interface PayExpense {
  expenseId: number;
  companyId: number;
  expenseCode: string | null;
  expenseName: string | null;
  regEmpId: number | null;
  regDate: string | null;
  occDate: string | null;
  desc: string | null;
  content: string | null;
  corpId: number | null;
  corpName: string | null;
  taxType: string | null;
  taxTypeName: string | null;
  amt: number | null;
  tax: number | null;
  settleAmt: number | null;
  dueDate: string | null;
  payMethodCode: string | null;
  payMethodName: string | null;
  payAccountInfo: string | null;
  confirmerId: number | null;
  confirmStatusCode: string | null;
  confirmerOrgName: string | null;
  apprEmpId: number | null;
  apprEmpOrgName: string | null;
  rejectReason: string | null;
  rejectSmsYn: string | null;
  accountCode: string | null;
  accountName: string | null;
  note: string | null;
  depositId: number | null;
  depositName: string | null;
  astId: number | null;
  astName: string | null;
  floralId: number | null;
  journalId: number | null;
  expenseApprId: number | null;
  expenseApprTitle: string | null;
  expenseApprStatusCode: string | null;
  expenseApprStatusName: string | null;
  regEmpOrgName: string | null;
  expenseStatusName: string | null;
  fileCountStr: string | null;
  /** 요청자의 발생부서(상신 때 같은 부서끼리만 묶는다) */
  orgName: string | null;
}

/** 저장 요청 (AS-IS Pay50_Edit_Expense.update — 화면이 바꾸는 열) */
export type PayExpenseUpdateReq = Pick<PayExpense,
  'occDate' | 'desc' | 'corpId' | 'taxType' | 'amt' | 'tax' | 'settleAmt' | 'dueDate' | 'payMethodCode' | 'payAccountInfo' | 'accountCode' | 'note' | 'depositId' | 'astId'>;

/** 지출요청내역 한 행 (AS-IS selectExpenseRequest) */
export interface PayExpenseRequest {
  expenseId: number;
  companyId: number;
  expenseCode: string;
  expenseName: string | null;
  regEmpId: number | null;
  regEmpOrgName: string | null;
  regDate: string | null;
  occDate: string | null;
  desc: string | null;
  settleAmt: number | null;
  dueDate: string | null;
  corpId: number | null;
  corpName: string | null;
  floralId: number | null;
}

/** 지출요청 상세양식 (AS-IS Pay51_ExpenseFormModel) */
export interface PayExpenseForm {
  expenseFormId: number;
  formCode: string;
  formName: string;
  content: string | null;
}

/** 자주 쓰는 계정과목 (AS-IS Pay52_FavoriteAccountModel) */
export interface PayFavoriteAccount {
  favoriteAccountId: number;
  accountCodeId: number;
  seq: number | null;
  accountCode: string;
  accountName: string;
  attributeCode: string;
  attributeName: string | null;
}
