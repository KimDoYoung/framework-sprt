/** 금감원 업무보고서 (AS-IS Rpt10_FssSubmitModel) */
export interface RptFssSubmit {
  submitId: number;
  reportCode: string | null;
  reportName?: string | null;
  submitCycleCode?: string | null;
  submitCycleName?: string | null;
  writeTarget?: string | null;
  writeGuide?: string | null;
  reviseHistory?: string | null;
}

/** submitId가 없거나 0 이하면 새 행 */
export interface RptFssSubmitSaveReq {
  submitId?: number | null;
  reportCode: string | null;
  reportName: string | null;
  submitCycleCode: string | null;
  writeTarget: string | null;
  writeGuide: string | null;
  reviseHistory: string | null;
}
