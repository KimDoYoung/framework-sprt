import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { RptDaily, RptDailyConfirm, RptDailySaveReq, RptMonth, RptMonthSaveReq, RptWeek, RptWeekBizClass, RptWeekCode, RptWeekDays, RptWeekPrint, RptWeekSaveReq, RptWeekState, RptFssSubmit, RptFssSubmitSaveReq, RptWriteGuide } from '../types/rpt';

/** rpt(보고서) API (E19 금감원 업무보고서) */
export const rptApi = {
  /** AS-IS rpt.Rpt10_FssSubmit.selectBySearchText — 서버가 "%검색어%"로 감싼다 */
  searchFssSubmits: async (searchText: string): Promise<RptFssSubmit[]> => {
    const res = await apiClient.get<ApiResponse<RptFssSubmit[]>>('v1/rpt/fss-submits', { params: { searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS rpt.Rpt10_FssSubmit.selectByReportCode (T17 작성요령 창) — 작성요령·변경이력, 없는 코드면 빈 글자 */
  getWriteGuide: async (reportCode: string): Promise<RptWriteGuide> => {
    const res = await apiClient.get<ApiResponse<RptWriteGuide>>('v1/rpt/fss-submits/write-guide', { params: { reportCode } });
    return res.data.data;
  },

  /** AS-IS rpt.Rpt10_FssSubmit.modelUpdate → 저장된 행 (submitId 없으면 등록) */
  saveFssSubmit: async (req: RptFssSubmitSaveReq): Promise<RptFssSubmit> => {
    const res = await apiClient.put<ApiResponse<RptFssSubmit>>('v1/rpt/fss-submits', req);
    return res.data.data;
  },

  /** AS-IS rpt.Rpt10_FssSubmit.delete → 지운 건수 */
  deleteFssSubmits: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/rpt/fss-submits', { data: ids });
    return res.data.data ?? 0;
  },
};

/** 일일업무 입력 (Z08, AS-IS Rpt01_Daily) */
export const rptDailyApi = {
  /** AS-IS rpt.Rpt01_Daily.selectByText — 내 일일업무 */
  search: async (startDate: string, closeDate: string, searchText: string): Promise<RptDaily[]> => {
    const res = await apiClient.get<ApiResponse<RptDaily[]>>('v1/rpt/dailies', { params: { startDate, closeDate, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS rpt.Rpt01_Daily.modelUpdate → 저장한 행 */
  save: async (req: RptDailySaveReq): Promise<RptDaily> => {
    const res = await apiClient.put<ApiResponse<RptDaily>>('v1/rpt/dailies', req);
    return res.data.data;
  },

  /** AS-IS rpt.Rpt01_Daily.delete → 지운 건수 */
  delete: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/rpt/dailies', { data: ids });
    return res.data.data ?? 0;
  },

  /** Z09 AS-IS rpt.Rpt01_Daily.selectByConfirmText — 내 조직(하위 포함) 사원의 일일업무, unconfirmedOnly = 미확인건만 */
  searchConfirm: async (startDate: string, closeDate: string, unconfirmedOnly: boolean, searchText: string): Promise<RptDailyConfirm[]> => {
    const res = await apiClient.get<ApiResponse<RptDailyConfirm[]>>('v1/rpt/dailies/confirm', { params: { startDate, closeDate, unconfirmedOnly, searchText } });
    return res.data.data ?? [];
  },

  /** Z09 AS-IS rpt.Rpt01_Daily.confirmModelUpdate — 확인자 비고 → 저장한 행 */
  saveConfirmNote: async (dailyId: number, confirmNote: string | null): Promise<RptDailyConfirm> => {
    const res = await apiClient.put<ApiResponse<RptDailyConfirm>>(`v1/rpt/dailies/${dailyId}/confirm-note`, { confirmNote });
    return res.data.data;
  },

  /** Z09 AS-IS rpt.Rpt01_Daily.confirmUpdate — 확인(true)·확인취소(false) → 바꾼 건수 */
  confirm: async (dailyIds: number[], confirmYn: boolean): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/rpt/dailies/confirm', { dailyIds, confirmYn });
    return res.data.data ?? 0;
  },

  /** Z09 AS-IS sys.Sys99_Print.insertRdDaily → 출력 그룹 ID (RD rdGroupId) */
  rdPrint: async (startDate: string, closeDate: string, unconfirmedOnly: boolean, searchText: string): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>('v1/rpt/dailies/confirm/rd-print', { startDate, closeDate, unconfirmedOnly, searchText });
    return res.data.data ?? '';
  },
};

/** 월간회의자료 (Z10, AS-IS Rpt02_Month) */
export const rptMonthApi = {
  /** AS-IS rpt.Rpt02_Month.selectByText — yyyyMm = 'yyyy.MM' 또는 'yyyy.%'(전체 월), orgCodeId 없으면 전체 본부 */
  search: async (yyyyMm: string, orgCodeId: number | null, searchText: string): Promise<RptMonth[]> => {
    const res = await apiClient.get<ApiResponse<RptMonth[]>>('v1/rpt/months', { params: { yyyyMm, orgCodeId: orgCodeId ?? undefined, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS rpt.Rpt02_Month.modelUpdate → 저장한 행 */
  save: async (req: RptMonthSaveReq): Promise<RptMonth> => {
    const res = await apiClient.put<ApiResponse<RptMonth>>('v1/rpt/months', req);
    return res.data.data;
  },

  /** AS-IS rpt.Rpt02_Month.delete → 지운 건수 */
  delete: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/rpt/months', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS sys.Sys99_Print.insertRdMonth → 출력 그룹 ID (RD rdGroupId) */
  rdPrint: async (yyyyMm: string, orgCodeId: number | null, searchText: string): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>('v1/rpt/months/rd-print', { yyyyMm, orgCodeId, searchText });
    return res.data.data ?? '';
  },
};

/** 주간업무보고 (Z11, AS-IS Rpt03_Week·Rpt05_WeekBizClass) */
export const rptWeekApi = {
  /** AS-IS rpt.Rpt03_Week.selectByStartDate — 내 주간업무. suggestion = 건의사항(업무구분 999)만 */
  search: async (startDate: string, closeDate: string, suggestion = false): Promise<RptWeek[]> => {
    const res = await apiClient.get<ApiResponse<RptWeek[]>>('v1/rpt/weeks', { params: { startDate, closeDate, suggestion } });
    return res.data.data ?? [];
  },

  /** AS-IS fixCheck·confirmCheck·confirmRetrieve — 제출·확인 상태 */
  getState: async (startDate: string, closeDate: string): Promise<RptWeekState> => {
    const res = await apiClient.get<ApiResponse<RptWeekState>>('v1/rpt/weeks/state', { params: { startDate, closeDate } });
    return res.data.data;
  },

  /** AS-IS rpt.Rpt03_Week.getWeekDays */
  getWeekDays: async (toDay: string): Promise<RptWeekDays> => {
    const res = await apiClient.get<ApiResponse<RptWeekDays>>('v1/rpt/weeks/week-days', { params: { toDay } });
    return res.data.data;
  },

  /** AS-IS sys.Sys00_Common.selectWeekListByMonth — code = "시작일|종료일" */
  getWeekList: async (year: string, month: string): Promise<RptWeekCode[]> => {
    const res = await apiClient.get<ApiResponse<RptWeekCode[]>>('v1/rpt/weeks/week-list', { params: { year, month } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys00_Common.selectWeekBizClass — 내가 사용으로 정한 업무구분 */
  getBizTypes: async (): Promise<RptWeekCode[]> => {
    const res = await apiClient.get<ApiResponse<RptWeekCode[]>>('v1/rpt/weeks/biz-types');
    return res.data.data ?? [];
  },

  /** AS-IS rpt.Rpt03_Week.getBeforeWeek — 직전 보고 1건(없으면 null) */
  getBeforeWeek: async (startDate: string): Promise<RptWeek | null> => {
    const res = await apiClient.get<ApiResponse<RptWeek | null>>('v1/rpt/weeks/before', { params: { startDate } });
    return res.data.data ?? null;
  },

  /** AS-IS rpt.Rpt03_Week.insertBeforeWeek */
  copyBeforeWeek: async (startDate: string, closeDate: string, beforeStartDate: string): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/rpt/weeks/copy-before', { startDate, closeDate, beforeStartDate });
    return res.data.data ?? 0;
  },

  /** AS-IS rpt.Rpt03_Week.modelUpsert → 저장한 행 */
  save: async (req: RptWeekSaveReq): Promise<RptWeek> => {
    const res = await apiClient.put<ApiResponse<RptWeek>>('v1/rpt/weeks', req);
    return res.data.data;
  },

  /** AS-IS rpt.Rpt03_Week.update (건의사항 그리드) → 저장한 행들(요청과 같은 순서) */
  saveRequests: async (items: RptWeekSaveReq[]): Promise<RptWeek[]> => {
    const res = await apiClient.put<ApiResponse<RptWeek[]>>('v1/rpt/weeks/requests', { items });
    return res.data.data ?? [];
  },

  /** AS-IS rpt.Rpt03_Week.inUpdateData — ▲▼ 뒤 순번 */
  saveSeq: async (items: { weekId: number; seq: number }[]): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/rpt/weeks/seq', { items });
    return res.data.data ?? 0;
  },

  /** AS-IS rpt.Rpt03_Week.updateFixYn — 제출(true)·제출취소(false) */
  fix: async (startDate: string, closeDate: string, fixYn: boolean): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/rpt/weeks/fix', { startDate, closeDate, fixYn });
    return res.data.data ?? 0;
  },

  /** AS-IS rpt.Rpt03_Week.boldUpdate */
  bold: async (weekId: number, bold: boolean): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>(`v1/rpt/weeks/${weekId}/bold`, { bold });
    return res.data.data ?? 0;
  },

  /** AS-IS rpt.Rpt03_Week.delete → 지운 건수 */
  delete: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/rpt/weeks', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS rpt.Rpt03_Week.getLastWeek + sys.Sys99_Print.insertRdWeekWrite → 출력 그룹 ID·지난주 기간 */
  rdPrint: async (startDate: string): Promise<RptWeekPrint> => {
    const res = await apiClient.post<ApiResponse<RptWeekPrint>>('v1/rpt/weeks/rd-print', { startDate });
    return res.data.data;
  },

  /** AS-IS rpt.Rpt05_WeekBizClass.selectByPersonId */
  getBizClasses: async (): Promise<RptWeekBizClass[]> => {
    const res = await apiClient.get<ApiResponse<RptWeekBizClass[]>>('v1/rpt/weeks/biz-classes');
    return res.data.data ?? [];
  },

  /** AS-IS rpt.Rpt05_WeekBizClass.upsert */
  saveBizClasses: async (items: { weekBizType: string; unUseYn: boolean }[]): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/rpt/weeks/biz-classes', { items });
    return res.data.data ?? 0;
  },
};
