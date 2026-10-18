import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { FormMapping } from '../types/com';

/** com(공통) 화면 API (E17~) */
export const comApi = {
  /** AS-IS com.Com10_FormMapping.selectById: 없으면 null(화면이 새 양식으로 연다) */
  getFormMapping: async (formMappingId: number): Promise<FormMapping | null> => {
    const res = await apiClient.get<ApiResponse<FormMapping | null>>(`v1/com/form-mappings/${formMappingId}`);
    return res.data.data ?? null;
  },

  /** AS-IS com.Com10_FormMapping.modelUpdate: 번호가 없으면 새로 만들고 linkId가 있으면 그 Link에 연결 → 양식 번호 */
  updateFormMapping: async (req: { formMappingId?: number | null; linkId?: number | null; content: string }): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/com/form-mappings', req);
    return res.data.data;
  },
};
