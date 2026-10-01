import { apiClient } from './client';
import { ApiResponse } from '../types/auth';

/** 접속 중 사원 (GET /api/push/online-users) */
export interface OnlineUser {
  /** 세션 사용자 ID (사원 = emp01_person_id) */
  userId: number;
  /** {회사코드}:{로그인ID} */
  username: string;
  companyNm: string;
  korNm: string;
  empNo: string;
  posNm: string | null;
  officeTelNo: string | null;
  mobileTelNo: string | null;
  /** 접속 세션(탭·기기) 수 */
  sessions: number;
}

export const pushApi = {
  /** 접속 중 사원 (SYSADMIN) */
  searchOnlineUsers: async (companyId?: number, searchText?: string): Promise<OnlineUser[]> => {
    const res = await apiClient.get<ApiResponse<OnlineUser[]>>('push/online-users', { params: { companyId, searchText } });
    return res.data.data ?? [];
  },

  /** 전체 공지 (모든 접속자) */
  sendNotice: async (title: string, message: string): Promise<void> => {
    await apiClient.post('push/notice', { title, message });
  },

  /** 개인 알림. username은 {회사코드}:{로그인ID} — KFS 관리자는 다른 회사 사용자에게도 보낸다 */
  sendNotification: async (username: string, title: string, message: string): Promise<void> => {
    const [companyCode, loginId] = username.split(':');
    await apiClient.post('push/notification', { username: loginId, companyCode, title, message });
  },

  /** 개별로그아웃 → 처리한 사용자 수 */
  forceLogout: async (userIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('push/force-logout', { userIds });
    return res.data.data ?? 0;
  },

  /** 전체로그아웃 (자신 제외) → 처리한 사용자 수 */
  forceLogoutAll: async (): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('push/force-logout-all');
    return res.data.data ?? 0;
  },
};
