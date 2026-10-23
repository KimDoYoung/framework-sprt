import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { BizLimit, BizProvideSetup } from '../types/biz';

/** L01 AS-IS Biz90_Tab_Limit (이익제공 기준관리) */
export const bizLimitApi = {
  /** AS-IS biz.Biz90_Limit.selectByCompanyId */
  searchLimits: async (): Promise<BizLimit[]> => {
    const res = await apiClient.get<ApiResponse<BizLimit[]>>('v1/biz/limits');
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz90_Limit.update → 저장된 행(요청 순서). 새 행(id ≤ 0)은 id를 빼고 보낸다 */
  saveLimits: async (rows: BizLimit[]): Promise<BizLimit[]> => {
    const body = rows.map(({ limitId, startDate, provideRcvType, saleRuleLimit1, saleRuleLimit2, companyLimit1, companyLimit2, companyLimit3 }) =>
      ({ limitId: limitId > 0 ? limitId : null, startDate, provideRcvType, saleRuleLimit1, saleRuleLimit2, companyLimit1, companyLimit2, companyLimit3 }));
    const res = await apiClient.put<ApiResponse<BizLimit[]>>('v1/biz/limits', body);
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz90_Limit.delete → 지운 건수 */
  deleteLimits: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/biz/limits', { data: ids });
    return res.data.data ?? 0;
  },
};

/** L01 AS-IS Biz04_Lookup_EmpSetup (직원 자동등록 설정) */
export const bizProvideSetupApi = {
  /** AS-IS biz.Biz04_ProvideSetup.selectByProvidePurCode — 서버가 목적 코드 뒤에 '%'를 붙인다 */
  searchProvideSetups: async (providePurCode: string): Promise<BizProvideSetup[]> => {
    const res = await apiClient.get<ApiResponse<BizProvideSetup[]>>('v1/biz/provide-setups', { params: { providePurCode } });
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz04_ProvideSetup.upsert (바뀐 행마다) → 저장한 건수 */
  saveProvideSetups: async (rows: BizProvideSetup[]): Promise<number> => {
    const body = rows.map(({ provideSetupId, provideContentCode, empSetYn }) => ({ provideSetupId, provideContentCode, empSetYn }));
    const res = await apiClient.put<ApiResponse<number>>('v1/biz/provide-setups', body);
    return res.data.data ?? 0;
  },
};
