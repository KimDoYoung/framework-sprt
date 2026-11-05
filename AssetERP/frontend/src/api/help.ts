import { apiClient } from './client';
import { ApiResponse } from '../types/auth';

/** 온라인 도움말 (AS-IS MainFrame helpAnchor → user_manual.jsp, aman_opener.jsp) */
export interface HelpConfig {
  /** {manualBaseUrl}/{화면 클래스}.html */
  manualBaseUrl: string;
  amanEnabled: boolean;
}

export const helpApi = {
  getConfig: async (): Promise<HelpConfig> => {
    const res = await apiClient.get<ApiResponse<HelpConfig>>('v1/help/config');
    return res.data.data;
  },
  /** AS-IS aman_opener.jsp?aka= — 서명한 A-Man 주소. aka가 없으면 전체 매뉴얼 */
  getAmanUrl: async (aka?: string): Promise<string> => {
    const res = await apiClient.get<ApiResponse<string>>('v1/help/aman-url', { params: { aka } });
    return res.data.data;
  },
};
