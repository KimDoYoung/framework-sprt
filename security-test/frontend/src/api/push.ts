import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { PresenceItem, WsLevel } from '../types/ws';

export interface NoticeReq {
  title: string;
  message: string;
  level?: WsLevel;
}

export interface NotificationReq extends NoticeReq {
  /** 받는 사용자 로그인 아이디 */
  username: string;
  link?: string;
  refId?: string;
}

/** WebSocket push (관리자 전용) - 응답 data는 발송한 메시지 ID */
export const pushApi = {
  notice: async (req: NoticeReq): Promise<ApiResponse<string>> => {
    const res = await apiClient.post<ApiResponse<string>>('/push/notice', req);
    return res.data;
  },

  notification: async (req: NotificationReq): Promise<ApiResponse<string>> => {
    const res = await apiClient.post<ApiResponse<string>>('/push/notification', req);
    return res.data;
  },

  presence: async (): Promise<ApiResponse<PresenceItem[]>> => {
    const res = await apiClient.get<ApiResponse<PresenceItem[]>>('/push/presence');
    return res.data;
  }
};
