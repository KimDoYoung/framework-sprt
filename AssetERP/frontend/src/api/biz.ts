import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import {
  BizAccountOption, BizDocClass, BizLimit, BizPerson, BizPromoAccountReq, BizPromoCard, BizPromoUpdateReq, BizProvideSetup, BizRelateAppr,
} from '../types/biz';

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

/** L02 AS-IS Biz01_Tab_Card·Biz01_Edit_Card·Biz01_Lookup_CardManagement (server/biz/Biz01_Promo) */
export const bizPromoApi = {
  /** AS-IS biz.Biz01_Promo.selectByCard — 날짜 'yyyy-MM-dd', 서버가 searchText를 %…%로 감싼다 */
  searchCards: async (startDate: string, closeDate: string, searchText: string): Promise<BizPromoCard[]> => {
    const res = await apiClient.get<ApiResponse<BizPromoCard[]>>('v1/biz/promos/cards', { params: { startDate, closeDate, searchText } });
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz01_Promo.closeCheck — 마감된 내역이 있으면 true (status -1) */
  hasClosed: async (promoIds: number[]): Promise<boolean> => {
    const res = await apiClient.post<ApiResponse<boolean>>('v1/biz/promos/close-check', promoIds);
    return res.data.data ?? false;
  },
  /** AS-IS biz.Biz01_Promo.modelUpdate */
  updatePromo: async (promoId: number, req: BizPromoUpdateReq): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>(`v1/biz/promos/${promoId}`, req);
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz01_Promo.noteUpdate — 마감된 내역은 비고만 */
  updateNote: async (promoId: number, note: string | null): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>(`v1/biz/promos/${promoId}/note`, { note });
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz01_Promo.updateAccount → 저장한 건수 */
  updateAccounts: async (req: BizPromoAccountReq): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/biz/promos/accounts', req);
    return res.data.data ?? 0;
  },
  /** AS-IS sys.Sys00_Common.selectByProvideContentCode */
  searchProvideAccounts: async (provideContentCode: string): Promise<BizAccountOption[]> => {
    const res = await apiClient.get<ApiResponse<BizAccountOption[]>>('v1/biz/promos/provide-accounts', { params: { provideContentCode } });
    return res.data.data ?? [];
  },
  /** AS-IS dcr.Dcr30_Link.selectByLinkCode — 지정된 문서분류가 없으면 null */
  getDocClass: async (linkCode: string): Promise<BizDocClass | null> => {
    const res = await apiClient.get<ApiResponse<BizDocClass | null>>('v1/biz/promos/doc-class', { params: { linkCode } });
    return res.data.data ?? null;
  },
  /** AS-IS sys.Sys99_Print.insertRdCard → 출력 그룹 ID (RD rdGroupId) */
  rdPrint: async (startDate: string, closeDate: string, searchText: string): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>('v1/biz/promos/rd-print', { startDate, closeDate, searchText });
    return res.data.data ?? '';
  },
};

/** L02 AS-IS Biz02_Grid_InternalList·ExternalList (server/biz/Biz02_Person) */
export const bizPersonApi = {
  /** AS-IS biz.Biz02_Person.selectByInternal */
  searchInternal: async (promoId: number): Promise<BizPerson[]> => {
    const res = await apiClient.get<ApiResponse<BizPerson[]>>('v1/biz/people/internal', { params: { promoId } });
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz02_Person.selectByExternal */
  searchExternal: async (promoId: number): Promise<BizPerson[]> => {
    const res = await apiClient.get<ApiResponse<BizPerson[]>>('v1/biz/people/external', { params: { promoId } });
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz02_Person.modelUpdate(직원 등록) → 추가한 건수 */
  addEmps: async (promoId: number, empIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/biz/people/internal', { promoId, empIds });
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz02_Person.insertEmpId — 로그인 사원이 없는 내역에 직원으로 넣는다 */
  autoRegister: async (promoIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/biz/people/auto-register', promoIds);
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz04_ProvideSetup.selectByProvideContentCode → 직원 자동등록 여부 */
  getEmpSet: async (provideContentCode: string): Promise<boolean> => {
    const res = await apiClient.get<ApiResponse<boolean>>('v1/biz/people/emp-set', { params: { provideContentCode } });
    return res.data.data ?? false;
  },
  /** AS-IS biz.Biz02_Person.delete → 지운 건수 */
  deletePeople: async (personIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/biz/people', { data: personIds });
    return res.data.data ?? 0;
  },
};

/** L02 AS-IS Biz05_Lookup_RelateAppr·Biz01_Tab_Card 상신 상태 (server/biz/Biz05_RelateAppr) */
export const bizRelateApprApi = {
  /** AS-IS biz.Biz05_RelateAppr.selectByPromoId */
  searchByPromo: async (promoId: number): Promise<BizRelateAppr[]> => {
    const res = await apiClient.get<ApiResponse<BizRelateAppr[]>>('v1/biz/relate-apprs', { params: { promoId } });
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz05_RelateAppr.selectByPersonId — 한 건이면 그 행, 아니면 null(미상신). dataYm 'yyyy.MM' */
  getByPerson: async (dataYm: string, linkCode: string): Promise<BizRelateAppr | null> => {
    const res = await apiClient.get<ApiResponse<BizRelateAppr | null>>('v1/biz/relate-apprs/by-person', { params: { dataYm, linkCode } });
    return res.data.data ?? null;
  },
  /** AS-IS biz.Biz05_RelateAppr.selectFileCount → 'n건' */
  getFileCount: async (promoId: number): Promise<string> => {
    const res = await apiClient.get<ApiResponse<string>>('v1/biz/relate-apprs/file-count', { params: { promoId } });
    return res.data.data ?? '0건';
  },
  /** AS-IS biz.Biz05_RelateAppr.delete → 지운 건수 */
  deleteRelateApprs: async (relateApprIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/biz/relate-apprs', { data: relateApprIds });
    return res.data.data ?? 0;
  },
};
