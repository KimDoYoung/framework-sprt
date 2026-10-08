import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { OrgInfo, Others, PersonSaveReq, Trans, TransInfo, TransInfoCreateReq, TransPerson } from '../types/emp';

/** 날짜 칸은 'yyyy-MM-dd'로 맞춘다 (서버 LocalDateTime 'yyyy-MM-ddTHH:mm:ss' → 날짜 편집기) */
const day = (v?: string | null) => (v ? v.slice(0, 10) : v);
const toTrans = (t: Trans): Trans => ({ ...t, transDate: day(t.transDate), expiryDate: day(t.expiryDate) });

/** C01 사원정보 관리 (Emp00_Tab_TransInfo) */
export const empApi = {
  /** AS-IS emp.Emp00_TransInfo.selectByText: transCode 전체 000 / 재직 100 / 겸직 800 / 퇴직 900 */
  searchTransInfos: async (transDate: string | undefined, searchText: string, transCode: string): Promise<TransInfo[]> => {
    const res = await apiClient.get<ApiResponse<TransInfo[]>>('v1/emp/trans-infos', { params: { transDate, searchText, transCode } });
    return res.data.data ?? [];
  },

  /** AS-IS emp.Emp00_TransInfo.update (신규사원 등록) → 등록된 행 */
  createTransInfo: async (req: TransInfoCreateReq): Promise<TransInfo> => {
    const res = await apiClient.post<ApiResponse<TransInfo>>('v1/emp/trans-infos', req);
    return res.data.data;
  },

  /** AS-IS emp.Emp00_TransInfo.selectOneByPersonId(personId, '%') — Emp00_Current_TransInfoModel */
  getCurrentTransInfo: async (personId: number): Promise<TransInfo> => {
    const res = await apiClient.get<ApiResponse<TransInfo>>(`v1/emp/persons/${personId}/trans-info`);
    return res.data.data;
  },

  /** AS-IS emp.Emp01_Person.update */
  updatePerson: async (personId: number, req: PersonSaveReq): Promise<void> => {
    await apiClient.put(`v1/emp/persons/${personId}`, req);
  },

  /** 기타정보 탭: AS-IS selectByText 행의 empOthersModel (사람 1명) */
  getOthers: async (personId: number): Promise<Others> => {
    const res = await apiClient.get<ApiResponse<Others>>(`v1/emp/persons/${personId}/others`);
    return res.data.data;
  },

  /** AS-IS emp.Emp02_Others.updateOne (emp02_others.upsert) → 다시 읽은 값 */
  updateOthers: async (req: Others): Promise<Others> => {
    const res = await apiClient.put<ApiResponse<Others>>('v1/emp/others', req);
    return res.data.data;
  },

  /** AS-IS emp.Emp04_AddTitle.selectByPersonId → 건수 */
  countAddTitles: async (personId: number): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>(`v1/emp/persons/${personId}/add-titles/count`);
    return res.data.data ?? 0;
  },

  /** AS-IS emp.Emp01_Person.deleteTarget */
  deletePerson: async (personId: number): Promise<void> => {
    await apiClient.delete(`v1/emp/persons/${personId}`);
  },

  /** AS-IS emp.Emp03_Trans.selectByPersonId (deleteCheck도 이것으로) */
  searchTranses: async (personId: number): Promise<Trans[]> => {
    const res = await apiClient.get<ApiResponse<Trans[]>>(`v1/emp/persons/${personId}/trans`);
    return (res.data.data ?? []).map(toTrans);
  },

  /** AS-IS emp.Emp03_Trans.selectByText (사원찾기): 조직/직무/성명 '%검색어%' */
  searchTransPersons: async (searchText: string): Promise<TransPerson[]> => {
    const res = await apiClient.get<ApiResponse<TransPerson[]>>('v1/emp/trans', { params: { searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS emp.Emp03_Trans.update: 추가·변경 행 → 저장된 행(요청 순서) */
  updateTranses: async (rows: Trans[]): Promise<Trans[]> => {
    const body = rows.map(({ transId, personId, transDate, transCd, kindCd, orgCodeId, titleCd, posCd, duty, expiryDate, transReason }) =>
      ({ transId, personId, transDate, transCd, kindCd, orgCodeId, titleCd, posCd, duty, expiryDate: expiryDate || null, transReason }));
    const res = await apiClient.put<ApiResponse<Trans[]>>('v1/emp/trans', body);
    return (res.data.data ?? []).map(toTrans);
  },

  /** AS-IS emp.Emp03_Trans.delete → 지운 건수 */
  deleteTranses: async (transIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/emp/trans', { data: transIds });
    return res.data.data ?? 0;
  },
};

/** 조직 (Org00_Lookup_SelectSingle, Org00_OrgInfo) */
export const orgApi = {
  /** AS-IS org.Org00_OrgInfo.selectByKorName */
  searchOrgInfos: async (korName: string | undefined, baseDate: string): Promise<OrgInfo[]> => {
    const res = await apiClient.get<ApiResponse<OrgInfo[]>>('v1/org/org-infos', { params: { korName: korName || undefined, baseDate } });
    return res.data.data ?? [];
  },

  /** AS-IS org.Org00_OrgInfo.selectByOrgCodeId (없으면 null) */
  getOrgInfo: async (orgCodeId: number, baseDate: string): Promise<OrgInfo | null> => {
    const res = await apiClient.get<ApiResponse<OrgInfo | null>>(`v1/org/org-infos/${orgCodeId}`, { params: { baseDate } });
    return res.data.data ?? null;
  },
};
