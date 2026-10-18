import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { DcrClassTreeLookup } from '../types/dcr';

/** dcr(문서분류) 조회창 API (E13-3) */
export const dcrApi = {
  /** AS-IS dcr.Dcr01_ClassTree.selectByText(typeCode T, useYn true): 문서분류 조회창. relateTable 'TDM47'+점검항목 ID면 그 점검항목에 연결 안 된 것만 */
  searchLookup: async (searchText: string, relateTable?: string, relateId?: number): Promise<DcrClassTreeLookup[]> => {
    const res = await apiClient.get<ApiResponse<DcrClassTreeLookup[]>>('v1/dcr/class-trees/lookup', { params: { searchText, relateTable, relateId } });
    return res.data.data ?? [];
  },
};
