import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { AttCommute, AttCommuteTimeReq, AttOvertimeReq, AttOvertimeReqUpdateReq, AttWorkPolicy } from '../types/att';

/** att(근태) 화면 API (T06~) */
export const attApi = {
  // ── T06 근태관리(관리자) (Att02_Tab_CommuteAdmin) ──

  /** AS-IS att.Att02_Commute.selectByTextAdmin — baseDate가 있으면 그날 하루, 없으면 startDate~closeDate */
  searchAdminCommutes: async (p: { searchText: string; personId?: number | null; baseDate?: string; startDate?: string; closeDate?: string }): Promise<AttCommute[]> => {
    const res = await apiClient.get<ApiResponse<AttCommute[]>>('v1/att/commutes/admin', { params: p });
    return res.data.data ?? [];
  },

  /** AS-IS att.Att02_Commute.adminCheck */
  adminCheck: async (commuteId: number): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>(`v1/att/commutes/${commuteId}/admin-check`);
    return res.data.data ?? 0;
  },

  /** AS-IS att.Att02_Commute.insertBatch (Att02_Lookup_InsertBatch) */
  insertBatchCommutes: async (req: { startDate: string; closeDate: string; personIds: number[] }): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/att/commutes/batch', req);
    return res.data.data ?? 0;
  },

  /** AS-IS att.Att04_CommuteHist.updateAuto (근로시간 일괄조정) */
  updateAutoCommutes: async (commuteIds: number[]): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/att/commutes/auto-adjust', { commuteIds });
    return res.data.data ?? 0;
  },

  /** AS-IS att.Att04_CommuteHist.insert (Att02_Edit_Commute, 개별수정) */
  updateCommuteTime: async (commuteId: number, req: AttCommuteTimeReq): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>(`v1/att/commutes/${commuteId}/time`, req);
    return res.data.data ?? 0;
  },

  /** AS-IS att.Att04_CommuteHist.insertList (Att02_Edit_CommuteBatch, 일괄수정) */
  updateCommuteTimes: async (commuteIds: number[], req: AttCommuteTimeReq): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/att/commutes/time', { commuteIds, ...req });
    return res.data.data ?? 0;
  },

  // ── Att01_Lookup_WorkPolicy 근태정책 ──

  /** AS-IS att.Att01_WorkPolicy.selectByCompanyId */
  searchWorkPolicies: async (): Promise<AttWorkPolicy[]> => {
    const res = await apiClient.get<ApiResponse<AttWorkPolicy[]>>('v1/att/work-policies');
    return res.data.data ?? [];
  },

  /** AS-IS att.Att01_WorkPolicy.getModel (사용 중인 정책들) */
  searchActiveWorkPolicies: async (): Promise<AttWorkPolicy[]> => {
    const res = await apiClient.get<ApiResponse<AttWorkPolicy[]>>('v1/att/work-policies/active');
    return res.data.data ?? [];
  },

  /** AS-IS att.Att01_WorkPolicy.update → 저장된 행(요청 순서). 새 행은 workPolicyId ≤ 0 */
  saveWorkPolicies: async (rows: AttWorkPolicy[]): Promise<AttWorkPolicy[]> => {
    const body = rows.map(r => ({ ...r, workPolicyId: r.workPolicyId > 0 ? r.workPolicyId : null }));
    const res = await apiClient.put<ApiResponse<AttWorkPolicy[]>>('v1/att/work-policies', body);
    return res.data.data ?? [];
  },

  /** AS-IS att.Att01_WorkPolicy.delete → 지운 건수 */
  deleteWorkPolicies: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/att/work-policies', { data: ids });
    return res.data.data ?? 0;
  },

  // ── T07 연장근무관리 (Att03_Tab_OvertimeReq) ──

  /** AS-IS att.Att03_OvertimeReq.getConfirmList — 조회기간은 원본 SQL이 쓰지 않아 보내지 않는다 */
  searchOvertimeReqs: async (): Promise<AttOvertimeReq[]> => {
    const res = await apiClient.get<ApiResponse<AttOvertimeReq[]>>('v1/att/overtime-reqs');
    return res.data.data ?? [];
  },

  /** AS-IS att.Att13_OvertimeReqHist.updateInfo (저장·확정·확정취소) → 처리 건수 */
  updateOvertimeReqs: async (req: AttOvertimeReqUpdateReq): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/att/overtime-reqs', req);
    return res.data.data ?? 0;
  },
};
