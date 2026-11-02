import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { RemoteView } from '../types/kfs';

/** kfs(리모트뷰 사용기록) 화면 API (Z15) */
export const kfsApi = {
  /** AS-IS kfs.Kfs01_RemoteView.selectByText / selectByPersonName — 어느 쪽인지는 서버가 로그인 이름으로 정한다. 사원명은 서버가 %…%로 */
  searchRemoteViews: async (params: { personName: string; startDate: string; closeDate: string; checkBox: boolean }): Promise<RemoteView[]> => {
    const res = await apiClient.get<ApiResponse<RemoteView[]>>('v1/kfs/remote-views', { params });
    return res.data.data ?? [];
  },

  /** AS-IS kfs.Kfs01_RemoteView.update → 저장된 행(요청 순서) */
  saveRemoteViews: async (rows: RemoteView[]): Promise<RemoteView[]> => {
    const res = await apiClient.put<ApiResponse<RemoteView[]>>('v1/kfs/remote-views', rows.map(r => ({ remoteViewId: r.remoteViewId, reason: r.reason ?? null, managerYn: r.managerYn ?? false })));
    return res.data.data ?? [];
  },

  /** AS-IS kfs.Kfs01_RemoteView.delete */
  deleteRemoteViews: async (ids: number[]): Promise<void> => {
    await apiClient.delete('v1/kfs/remote-views', { data: ids });
  },

  /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=remoteViewUpload) → 등록 대상 건수 */
  uploadRemoteViewsExcel: async (file: File): Promise<number> => {
    const form = new FormData();
    form.append('excelUpload', file);
    const res = await apiClient.post<ApiResponse<number>>('v1/kfs/remote-views/excel', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.data ?? 0;
  },
};
