import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { AttCommute, AttCommuteStatus, AttMyCommute, AttMyCommuteLast, AttCommuteTimeReq, AttOvertimeReq, AttOvertimeReqUpdateReq, AttWorkPolicy } from '../types/att';

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

  // ── T08 근태현황(관리자) · T09 근태현황 (Att02_Tab_CommuteStatus · Att02_Tab_PersonStatus) ──

  /** AS-IS att.Att02_Commute.getCommuteStatus — 근무일자 하루. 검색어 `%…%`는 서버 */
  searchCommuteStatus: async (p: { baseDate: string; searchText: string; personId?: number | null }): Promise<AttCommuteStatus[]> => {
    const res = await apiClient.get<ApiResponse<AttCommuteStatus[]>>('v1/att/commutes/status', { params: p });
    return res.data.data ?? [];
  },

  /** AS-IS att.Att02_Commute.getPersonStatus — 로그인 사원 본인의 기간 근태 */
  searchPersonStatus: async (p: { startDate: string; closeDate: string }): Promise<AttCommuteStatus[]> => {
    const res = await apiClient.get<ApiResponse<AttCommuteStatus[]>>('v1/att/commutes/person-status', { params: p });
    return res.data.data ?? [];
  },

  // ── EE50 로그인 사원 본인의 출퇴근 (Att02_Lookup_Commute · Att02_Edit_Reason · Att02_Edit_CheckOutTime) ──

  /** AS-IS att.Att02_Commute.getLastInfo (+ 회사 근태 설정 commutePopupYn·commuteLockYn) */
  getMyCommuteLast: async (): Promise<AttMyCommuteLast> => {
    const res = await apiClient.get<ApiResponse<AttMyCommuteLast>>('v1/att/commutes/me/last-info');
    return res.data.data as AttMyCommuteLast;
  },

  /** AS-IS att.Att02_Commute.selectByDate (baseDate 'yyyy-MM-dd') */
  searchMyCommute: async (baseDate: string): Promise<AttMyCommute[]> => {
    const res = await apiClient.get<ApiResponse<AttMyCommute[]>>('v1/att/commutes/me', { params: { baseDate } });
    return res.data.data ?? [];
  },

  /** AS-IS att.Att02_Commute.insert — on: 출근 true / 퇴근 false. 1 성공, -1 이미 처리됨, -2 출근 기록 없음 */
  checkMyCommute: async (on: boolean, baseDate: string): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/att/commutes/me/check', { on, baseDate });
    return res.data.data ?? 0;
  },

  /** AS-IS att.Att02_Commute.insertOffWork — 1 성공, -2 출근 기록 없음 */
  offWorkMyCommute: async (baseDate: string): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/att/commutes/me/off-work', { baseDate });
    return res.data.data ?? 0;
  },

  /** AS-IS att.Att02_Commute.updateReason — actionCode 'in' 지각 / 그 밖 퇴근 사유 */
  updateMyCommuteReason: async (commuteId: number, actionCode: string, reason: string): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>(`v1/att/commutes/me/${commuteId}/reason`, { actionCode, reason });
    return res.data.data ?? 0;
  },

  /** AS-IS att.Att02_Commute.updateCheckOutTime — checkOutTime 'yyyy-MM-dd', checkOutTimeStr 'HH:mm' */
  updateMyCheckOutTime: async (commuteId: number, checkOutTime: string, checkOutTimeStr: string): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>(`v1/att/commutes/me/${commuteId}/check-out-time`, { checkOutTime, checkOutTimeStr });
    return res.data.data ?? 0;
  },
};
