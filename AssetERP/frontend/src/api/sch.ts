import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { Sch03Deadline, Sch03DeadlineSaveReq, Sch03DeadlineTemplate, Sch05RelateIcs } from '../types/sch';

/** sch(스케줄) 화면 API (E01-1~) */
export const schApi = {
  /** AS-IS sch.Sch03_Deadline.selectByClassTreeId: 법규(infoId)의 기한 */
  searchDeadlines: async (infoId: number): Promise<Sch03Deadline[]> => {
    const res = await apiClient.get<ApiResponse<Sch03Deadline[]>>('v1/sch/deadlines', { params: { infoId } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys00_Common.selectDeadLine: 기본 기한 콤보 */
  searchDeadlineTemplates: async (): Promise<Sch03DeadlineTemplate[]> => {
    const res = await apiClient.get<ApiResponse<Sch03DeadlineTemplate[]>>('v1/sch/deadlines/templates');
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch03_Deadline.selectDeadlineName: 법규의 기한 이름(여럿이면 "… 외 n건") */
  getDeadlineName: async (infoId: number): Promise<string> => {
    const res = await apiClient.get<ApiResponse<string>>('v1/sch/deadlines/name', { params: { infoId } });
    return res.data.data ?? '';
  },

  /** AS-IS sch.Sch03_Deadline.insertModel → 저장된 행. deadlineId가 없거나 0 이하면 새로 등록 */
  saveDeadline: async (req: Sch03DeadlineSaveReq): Promise<Sch03Deadline> => {
    const res = await apiClient.put<ApiResponse<Sch03Deadline>>('v1/sch/deadlines', req);
    return res.data.data;
  },

  /** AS-IS sch.Sch03_Deadline.updateModel: 기본 기한을 법규에 복사 → 새 행 */
  copyDeadline: async (deadlineId: number, infoId: number): Promise<Sch03Deadline> => {
    const res = await apiClient.post<ApiResponse<Sch03Deadline>>('v1/sch/deadlines/copy', { deadlineId, infoId });
    return res.data.data;
  },

  /** AS-IS sch.Sch03_Deadline.delete → 지운 건수 */
  deleteDeadlines: async (deadlineIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sch/deadlines', { data: deadlineIds });
    return res.data.data ?? 0;
  },

  /** AS-IS sch.Sch03_Deadline.selectById: 기한 한 건 */
  getDeadline: async (deadlineId: number): Promise<Sch03Deadline> => {
    const res = await apiClient.get<ApiResponse<Sch03Deadline>>(`v1/sch/deadlines/${deadlineId}`);
    return res.data.data;
  },

  // ── E04 연관 내부통제 (Sch05_Page_RelateIcs) ──

  /** AS-IS sch.Sch05_RelateIcs.selectByInfoId */
  searchRelateIcs: async (infoId: number): Promise<Sch05RelateIcs[]> => {
    const res = await apiClient.get<ApiResponse<Sch05RelateIcs[]>>('v1/sch/relate-ics', { params: { infoId } });
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch05_RelateIcs.modelUpdate: 고른 (법규, 기한) 쌍을 연결 → 넣은 행 */
  addRelateIcs: async (infoId: number, items: { icsClassTreeId: number; deadlineId: number }[]): Promise<Sch05RelateIcs[]> => {
    const res = await apiClient.post<ApiResponse<Sch05RelateIcs[]>>('v1/sch/relate-ics', items, { params: { infoId } });
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch05_RelateIcs.delete → 지운 건수 */
  deleteRelateIcs: async (relateIcsIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sch/relate-ics', { data: relateIcsIds });
    return res.data.data ?? 0;
  },
};
