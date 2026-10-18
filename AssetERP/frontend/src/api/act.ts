import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { AccountCode } from '../types/act';

/** act(관리회계) 화면 API (E25~) */
export const actApi = {
  /** AS-IS act.Act01_AccountCode.selectBySlipYn (Act01_Lookup_AccountCode): companyId가 없으면 로그인 회사, 다른 회사는 관리자 회사만 */
  searchAccountCodes: async (attributeCode: string, searchText: string, companyId?: number): Promise<AccountCode[]> => {
    const res = await apiClient.get<ApiResponse<AccountCode[]>>('v1/act/account-codes/lookup', { params: { companyId, attributeCode: attributeCode || undefined, searchText } });
    return res.data.data ?? [];
  },
};
