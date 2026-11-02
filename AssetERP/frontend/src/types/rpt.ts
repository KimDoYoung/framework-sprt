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

/** 작성요령 및 변경이력 (T17, AS-IS selectByReportCode) */
export interface RptWriteGuide {
  writeGuide: string | null;
  reviseHistory: string | null;
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

/** Z08 AS-IS Rpt01_DailyModel — 일일업무 그리드 행 (rpt01_daily.selectByText) */
export interface RptDaily {
  dailyId: number;
  date?: string | null;
  content?: string | null;
  note?: string | null;
  personId?: number | null;
  confirmYn?: boolean | null;
  confirmYnName?: string | null;
  confirmName?: string | null;
}

/** Z08 저장 요청 — dailyId가 없으면 새 글 */
export interface RptDailySaveReq {
  dailyId?: number | null;
  date: string;
  content: string;
  note: string | null;
}
