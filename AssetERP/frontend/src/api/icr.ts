import { apiClient } from './client';
import { ApiResponse, PageRes } from '../types/auth';
import { IcrClassTreeDeadline, IcrClassTreeDetail, IcrClassTreeLookup, IcrClassTreeNode } from '../types/icr';

/** icr(내규) 조회창 API (E13-3) */
export const icrApi = {
  /** AS-IS icr.Icr01_ClassTree.selectByCompanyId(typeCode IC): 사용 중인 분류를 전위 순서로(depth 포함) */
  searchClassTree: async (typeCode = 'IC'): Promise<IcrClassTreeNode[]> => {
    const res = await apiClient.get<ApiResponse<IcrClassTreeNode[]>>('v1/icr/class-trees', { params: { typeCode } });
    return res.data.data ?? [];
  },

  /** AS-IS icr.Icr01_ClassTree.selectByTypeCodePaging(typeCode IT): 내규 조회창 페이징. classTreeId가 있으면 그 분류와 모든 하위 */
  searchLookup: async (params: {
    classTreeId: number | null; lawSearch: string; statuteSearch: string; detailSearchYn: boolean; offset: number; limit: number;
    /** openUnConn: 'TDM46' + 점검항목 ID — 그 점검항목에 아직 연결 안 된 내규만 */
    relateTable?: string; relateId?: number;
  }): Promise<PageRes<IcrClassTreeLookup>> => {
    const res = await apiClient.get<ApiResponse<PageRes<IcrClassTreeLookup>>>('v1/icr/class-trees/lookup', { params });
    return res.data.data;
  },

  /** AS-IS icr.Icr01_ClassTree.selectByListIcrId (Icr01_Lookup_SelectMulti "deadline"): 고른 내규와 그 기한 */
  searchDeadlines: async (classTreeIds: number[]): Promise<IcrClassTreeDeadline[]> => {
    const res = await apiClient.get<ApiResponse<IcrClassTreeDeadline[]>>('v1/icr/class-trees/with-deadlines', { params: { classTreeIds: classTreeIds.join(',') } });
    return res.data.data ?? [];
  },

  /** AS-IS icr.Icr01_ClassTree.selectById: 내규상세 창의 값 */
  getDetail: async (classTreeId: number): Promise<IcrClassTreeDetail> => {
    const res = await apiClient.get<ApiResponse<IcrClassTreeDetail>>(`v1/icr/class-trees/${classTreeId}/detail`);
    return res.data.data;
  },
};
