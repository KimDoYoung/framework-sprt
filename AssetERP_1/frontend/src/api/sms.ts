import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { GroupSend, GroupSendHistory, GroupSendTarget, SmsHistory, SmsHistoryMonth, SmsHistoryTotal, SmsHistoryYear } from '../types/sms';

/** 문자(sms) 화면 API (C05~) */
export const smsApi = {
  // ── C05 고객별 문자사용량 (Sms02_Tab_TotalCount) ──

  /** AS-IS sms.Sms02_History.selectByTotalCount: 고객별 누적 사용건수 (useYn = 사용고객만) */
  searchHistoryTotals: async (useYn: boolean): Promise<SmsHistoryTotal[]> => {
    const res = await apiClient.get<ApiResponse<SmsHistoryTotal[]>>('v1/sms/history-totals', { params: { useYn } });
    return res.data.data ?? [];
  },

  /** AS-IS sms.Sms02_History.selectByTotalCountYear: 서브도메인의 연도별 */
  searchHistoryYears: async (locName: string): Promise<SmsHistoryYear[]> => {
    const res = await apiClient.get<ApiResponse<SmsHistoryYear[]>>('v1/sms/history-totals/years', { params: { locName } });
    return res.data.data ?? [];
  },

  /** AS-IS sms.Sms02_History.selectByTotalCountMonth: 서브도메인·연도의 월별 */
  searchHistoryMonths: async (locName: string, year: string): Promise<SmsHistoryMonth[]> => {
    const res = await apiClient.get<ApiResponse<SmsHistoryMonth[]>>('v1/sms/history-totals/months', { params: { locName, year } });
    return res.data.data ?? [];
  },

  /** AS-IS sms.Sms02_History.selectByDate: 발신기록 최근 300건 (기간 'yyyy-MM-dd', 내용 LIKE) */
  searchHistories: async (companyId: number, startDate: string, closeDate: string, searchText: string): Promise<SmsHistory[]> => {
    const res = await apiClient.get<ApiResponse<SmsHistory[]>>('v1/sms/histories', { params: { companyId, startDate, closeDate, searchText } });
    return res.data.data ?? [];
  },

  // ── C06 고객별 문자발송 (Sms03_Tab_SendAdmin) ──

  /** AS-IS sms.Sms03_GroupSend.selectByCompanyId (로그인 회사) */
  searchGroupSends: async (): Promise<GroupSend[]> => {
    const res = await apiClient.get<ApiResponse<GroupSend[]>>('v1/sms/group-sends');
    return res.data.data ?? [];
  },

  /** AS-IS insertRow() L150-157의 새 행 기본값 (회사·생성자·생성일자) */
  newGroupSendRow: async (): Promise<GroupSend> => {
    const res = await apiClient.get<ApiResponse<GroupSend>>('v1/sms/group-sends/new-row');
    return res.data.data;
  },

  /** AS-IS sms.Sms03_GroupSend.update (제목·내용·비고) → 저장된 행. groupSendId ≤ 0이면 새 행 */
  updateGroupSend: async (row: { groupSendId: number | null; title: string | null; content: string | null; note: string | null }): Promise<GroupSend> => {
    const res = await apiClient.put<ApiResponse<GroupSend>>('v1/sms/group-sends', row);
    return res.data.data;
  },

  /** AS-IS sms.Sms03_GroupSend.delete → 지운 건수 */
  deleteGroupSends: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sms/group-sends', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS sms.Sms03_GroupSend.sendGroupMessage — 서버는 아직 실제로 보내지 않고 거절한다(SmsSender 기본 구현) */
  sendGroupMessage: async (groupSendId: number, targets: GroupSendTarget[]): Promise<void> => {
    const body = targets.map(({ personId, companyName, korName, mobileTelNo }) => ({ personId, companyName, korName, mobileTelNo }));
    await apiClient.post<ApiResponse<void>>(`v1/sms/group-sends/${groupSendId}/send`, body);
  },

  /** AS-IS sms.Sms04_GroupSendHistory.selectByText (전송기록) */
  searchGroupSendHistories: async (groupSendId: number, searchText: string): Promise<GroupSendHistory[]> => {
    const res = await apiClient.get<ApiResponse<GroupSendHistory[]>>(`v1/sms/group-sends/${groupSendId}/histories`, { params: { searchText } });
    return res.data.data ?? [];
  },
};
