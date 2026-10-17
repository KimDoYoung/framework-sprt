import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { IfiConfig } from '../types/ifi';

/** ifi 화면 API (D01~) */
export const ifiApi = {
  // ── D01 I/F 설정 (Ifi90_Tab_Config) ──

  /** AS-IS ifi.Ifi90_Config.selectByIfType: ifType '%'면 전체, searchText는 서버가 양쪽에 % */
  searchConfigs: async (ifType: string, searchText: string): Promise<IfiConfig[]> => {
    const res = await apiClient.get<ApiResponse<IfiConfig[]>>('v1/ifi/configs', { params: { ifType, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS ifi.Ifi90_Config.update: configId 0 이하면 신규 → 저장된 행 */
  updateConfig: async (row: IfiConfig): Promise<IfiConfig> => {
    const res = await apiClient.put<ApiResponse<IfiConfig>>('v1/ifi/configs', row);
    return res.data.data as IfiConfig;
  },

  /** AS-IS ifi.Ifi90_Config.delete: 사용중이면 오류 → 지운 건수 */
  deleteConfigs: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/ifi/configs', { data: ids });
    return res.data.data ?? 0;
  },
};
