import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { RptDaily, RptDailyConfirm, RptDailySaveReq, RptFssSubmit, RptFssSubmitSaveReq, RptWriteGuide } from '../types/rpt';

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
