import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { AprApprStepGroup, AprStamp } from '../types/apr';

/** apr(전자결재) 조회창 API (E16) */
export const aprApi = {
  /** AS-IS apr.Apr10_Stamp.selectBySearchText2: 문서분류에서 쓸 수 있는 인감 (Apr10_Lookup_DocStamp) */
  searchDocStamps: async (classTreeId: number, searchText: string): Promise<AprStamp[]> => {
    const res = await apiClient.get<ApiResponse<AprStamp[]>>('v1/apr/stamps/doc', { params: { classTreeId, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr30_ApprStepGroup.selectByCompanyId (Apr30_Lookup_ApprStepGroup) */
  searchApprStepGroups: async (): Promise<AprApprStepGroup[]> => {
    const res = await apiClient.get<ApiResponse<AprApprStepGroup[]>>('v1/apr/appr-step-groups');
    return res.data.data ?? [];
  },
};
