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
