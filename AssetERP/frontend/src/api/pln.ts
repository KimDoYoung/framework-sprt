import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { PlnResrch, PlnResrchSaveReq } from '../types/pln';

/** EE90 AS-IS Pln03_Lookup_ResrchDetail (server/pln/Pln03_Resrch) — 리서치 일정등록 창 */
export const plnResrchApi = {
  /** AS-IS pln.Pln03_Resrch.selectDetailInit — 새 건 초기값(새 번호·등록자·조사기간·승인자) */
  init: async (): Promise<PlnResrch> => {
    const res = await apiClient.get<ApiResponse<PlnResrch>>('v1/pln/resrches/init');
    return res.data.data as PlnResrch;
  },

  /** AS-IS pln.Pln03_Resrch.selectById */
  get: async (resrchId: number): Promise<PlnResrch> => {
    const res = await apiClient.get<ApiResponse<PlnResrch>>(`v1/pln/resrches/${resrchId}`);
    return res.data.data as PlnResrch;
  },

  /** AS-IS pln.Pln03_Resrch.update — 없으면 INSERT, 있으면 UPDATE */
  save: async (req: PlnResrchSaveReq): Promise<void> => {
    await apiClient.put('v1/pln/resrches', req);
  },

  /** AS-IS pln.Pln03_Resrch.closeUpdate — close=true 승인요청, false 요청취소 */
  close: async (resrchId: number, close: boolean): Promise<void> => {
    await apiClient.post(`v1/pln/resrches/${resrchId}/close`, null, { params: { close } });
  },

  /** AS-IS pln.Pln03_Resrch.apprUpdate — 확인자 승인 */
  confirm: async (resrchId: number): Promise<void> => {
    await apiClient.post(`v1/pln/resrches/${resrchId}/confirm`);
  },
};
