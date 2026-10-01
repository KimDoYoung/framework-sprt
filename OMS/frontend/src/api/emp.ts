import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import {
  AddTitle, AddTitleSave, EmpTrans, OrgPerson, Page, Person, PersonSave, Trans, TransHistory, TransInfo, TransInfoCreate, UserInfo,
} from '../types/emp';

export const empApi = {
  /** 사원 검색 (성명+조직명+사번). transCode: 100 재직, 800 겸직, 900 퇴직, 000 전체 */
  searchTransInfos: async (params: { searchText?: string; transCode?: string; transDate?: string; orgCodeId?: number; isSeparateAddTitle?: boolean }): Promise<TransInfo[]> => {
    const res = await apiClient.get<ApiResponse<TransInfo[]>>('v1/emp/trans-infos', { params });
    return res.data.data ?? [];
  },

  /** 사원 Lookup: 기준일 현재 재직 사원 (성명·조직명·사번) */
  searchTrans: async (searchText?: string, transDate?: string): Promise<Trans[]> => {
    const res = await apiClient.get<ApiResponse<Trans[]>>('v1/emp/trans', { params: { searchText, transDate } });
    return res.data.data ?? [];
  },

  /** 사원 한 명의 현재 정보 (발령 변경 후 목록 행 갱신) */
  getTransInfo: async (personId: number): Promise<TransInfo | null> => {
    const res = await apiClient.get<ApiResponse<TransInfo | null>>(`v1/emp/trans-infos/${personId}`);
    return res.data.data;
  },

  /** 신규사원 등록 (사원 + 채용발령) */
  createTransInfo: async (body: TransInfoCreate): Promise<TransInfo | null> => {
    const res = await apiClient.post<ApiResponse<TransInfo | null>>('v1/emp/trans-infos', body);
    return res.data.data;
  },

  getPerson: async (personId: number): Promise<Person> => {
    const res = await apiClient.get<ApiResponse<Person>>(`v1/emp/persons/${personId}`);
    return res.data.data;
  },

  updatePerson: async (personId: number, body: PersonSave): Promise<Person> => {
    const res = await apiClient.put<ApiResponse<Person>>(`v1/emp/persons/${personId}`, body);
    return res.data.data;
  },

  deletePerson: async (personId: number): Promise<void> => {
    await apiClient.delete(`v1/emp/persons/${personId}`);
  },

  searchPersonTrans: async (personId: number): Promise<EmpTrans[]> => {
    const res = await apiClient.get<ApiResponse<EmpTrans[]>>(`v1/emp/trans/persons/${personId}`);
    return res.data.data ?? [];
  },

  /** 추가·변경된 발령 저장 → 사원의 발령 전체 (다시 조회) */
  updateTrans: async (rows: EmpTrans[]): Promise<EmpTrans[]> => {
    const body = rows.map(({ transId, personId, transDate, transCd, kindCd, orgCodeId, titleCd, posCd, transReason, orgHeadYn }) =>
      ({ transId, personId, transDate, transCd, kindCd, orgCodeId, titleCd, posCd, transReason, orgHeadYn }));
    const res = await apiClient.put<ApiResponse<EmpTrans[]>>('v1/emp/trans', body);
    return res.data.data ?? [];
  },

  deleteTrans: async (transId: number): Promise<void> => {
    await apiClient.delete(`v1/emp/trans/${transId}`);
  },

  searchAddTitles: async (personId: number): Promise<AddTitle[]> => {
    const res = await apiClient.get<ApiResponse<AddTitle[]>>(`v1/emp/persons/${personId}/add-titles`);
    return res.data.data ?? [];
  },

  createAddTitle: async (personId: number, body: AddTitleSave): Promise<AddTitle> => {
    const res = await apiClient.post<ApiResponse<AddTitle>>(`v1/emp/persons/${personId}/add-titles`, body);
    return res.data.data;
  },

  updateAddTitle: async (addTitleId: number, body: AddTitleSave): Promise<AddTitle> => {
    const res = await apiClient.put<ApiResponse<AddTitle>>(`v1/emp/persons/add-titles/${addTitleId}`, body);
    return res.data.data;
  },

  deleteAddTitle: async (addTitleId: number): Promise<void> => {
    await apiClient.delete(`v1/emp/persons/add-titles/${addTitleId}`);
  },

  /** 조직(하위 포함) 기준일 사원 */
  searchOrgPersons: async (orgCodeId: number, baseDate: string): Promise<OrgPerson[]> => {
    const res = await apiClient.get<ApiResponse<OrgPerson[]>>('v1/emp/trans-infos/by-org', { params: { orgCodeId, baseDate } });
    return res.data.data ?? [];
  },

  /** 기간 내 발령 변경 */
  searchTransHistory: async (startDate: string, closeDate: string, searchText?: string): Promise<TransHistory[]> => {
    const res = await apiClient.get<ApiResponse<TransHistory[]>>('v1/emp/trans/histories', { params: { startDate, closeDate, searchText } });
    return res.data.data ?? [];
  },

  /** 사용자정보 (전 고객사, KFS 관리자). page는 0부터 */
  searchUserInfos: async (params: { companyId?: number; searchText?: string; useOnly: boolean; excludeRetired: boolean; page: number; size: number }): Promise<Page<UserInfo>> => {
    const res = await apiClient.get<ApiResponse<Page<UserInfo>>>('v1/emp/persons/user-infos', { params });
    return res.data.data ?? { total: 0, rows: [] };
  },
};
