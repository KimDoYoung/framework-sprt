import { apiClient } from './client';
import { ApiResponse, PageRes } from '../types/auth';
import { readBlobError } from './file';
import {
  MktFavorite, MktHistory, MktHistorySave, MktItemType, MktManager, MktRelateFund, MktShare, MktTargetCompany, MktTargetCompanySave, MktTargetItem,
} from '../types/mkt';

/** Z05 업무활동등록 (AS-IS Mkt01_Tab_TargetCompany → server/mkt/Mkt01_TargetCompany) */
export const mktTargetCompanyApi = {
  /** AS-IS sys.Sys09_Code.selectByCode(CrmItemTypeCode) — 맨 위 `%` 전체보기 */
  searchItemTypes: async (): Promise<MktItemType[]> => {
    const res = await apiClient.get<ApiResponse<MktItemType[]>>('v1/mkt/target-companies/item-types');
    return res.data.data ?? [];
  },
  /** AS-IS erpProductCode == "A1" — 아래 업무활동내역 칸을 두는 회사인가 */
  historyEnabled: async (): Promise<boolean> => {
    const res = await apiClient.get<ApiResponse<boolean>>('v1/mkt/target-companies/history-enabled');
    return res.data.data ?? false;
  },
  /** AS-IS getSeq */
  nextId: async (): Promise<number> => (await apiClient.get<ApiResponse<number>>('v1/mkt/target-companies/next-id')).data.data,
  /** AS-IS mkt.Mkt01_TargetCompany.selectByCompanyIdPaging — searchText는 글자 그대로(서버가 `%…%`로 감싼다), offset = (쪽-1)*limit */
  search: async (p: { itemTypeCode: string; unUseYn: boolean; searchText: string; offset: number; limit: number }): Promise<PageRes<MktTargetCompany>> => {
    const res = await apiClient.get<ApiResponse<PageRes<MktTargetCompany>>>('v1/mkt/target-companies/list', { params: p });
    return res.data.data ?? { total: 0, rows: [] };
  },
  /** Z06 AS-IS mkt.Mkt01_TargetCompany.selectTargetCompanyPaging (Mkt01_Lookup_TargetCompany2) — 구분 코드(`%` 전체), 미사용 제외 */
  searchLookup: async (p: { itemTypeCode: string; searchText: string; offset: number; limit: number }): Promise<PageRes<MktTargetItem>> => {
    const res = await apiClient.get<ApiResponse<PageRes<MktTargetItem>>>('v1/mkt/target-companies/lookup', { params: p });
    return res.data.data ?? { total: 0, rows: [] };
  },
  /** AS-IS mkt.Mkt01_TargetCompany.selectById */
  get: async (id: number): Promise<MktTargetCompany> => (await apiClient.get<ApiResponse<MktTargetCompany>>(`v1/mkt/target-companies/${id}`)).data.data,
  /** AS-IS mkt.Mkt01_TargetCompany.updateOne */
  save: async (req: MktTargetCompanySave): Promise<MktTargetCompany> => (await apiClient.put<ApiResponse<MktTargetCompany>>('v1/mkt/target-companies', req)).data.data,
  /** AS-IS mkt.Mkt03_History.checkByTargetCompanyId — 업무활동내역이 있는 활동처 수 */
  checkHistories: async (ids: number[]): Promise<number> => (await apiClient.post<ApiResponse<number>>('v1/mkt/target-companies/check-histories', ids)).data.data,
  /** AS-IS mkt.Mkt01_TargetCompany.delete → 지운 건수 */
  remove: async (ids: number[]): Promise<number> => (await apiClient.delete<ApiResponse<number>>('v1/mkt/target-companies', { data: ids })).data.data,
  /** AS-IS mkt.Mkt01_TargetCompany.selectFavoritePaging */
  searchFavorites: async (p: { searchText: string; offset: number; limit: number }): Promise<PageRes<MktFavorite>> => {
    const res = await apiClient.get<ApiResponse<PageRes<MktFavorite>>>('v1/mkt/target-companies/favorites', { params: p });
    return res.data.data ?? { total: 0, rows: [] };
  },
  /** AS-IS sys.Sys99_Print.insertRdTargetCompany → rdGroupId */
  rdDownload: async (): Promise<string> => (await apiClient.post<ApiResponse<string>>('v1/mkt/target-companies/rd-download')).data.data,
  /** AS-IS ./excelTemplete/Template_업무활동등록.xlsx */
  downloadTemplate: async (): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/mkt/target-companies/template', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Template_업무활동등록.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      throw await readBlobError(err);
    }
  },
  /** AS-IS ExcelUpload?uploadType=targetCompanyUpload&itemTypeCode= */
  uploadExcel: async (itemTypeCode: string, file: File): Promise<void> => {
    const form = new FormData();
    form.append('excelUpload', file);
    await apiClient.post<ApiResponse<void>>('v1/mkt/target-companies/excel', form, { params: { itemTypeCode }, headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

/** Z05 활동처 담당자 (AS-IS server/mkt/Mkt02_Manager) */
export const mktManagerApi = {
  search: async (targetCompanyId: number): Promise<MktManager[]> =>
    (await apiClient.get<ApiResponse<MktManager[]>>('v1/mkt/managers', { params: { targetCompanyId } })).data.data ?? [],
  /** AS-IS mkt.Mkt02_Manager.update — managerId 0 이하는 새 담당자 */
  save: async (rows: MktManager[]): Promise<MktManager[]> => (await apiClient.put<ApiResponse<MktManager[]>>('v1/mkt/managers', rows)).data.data ?? [],
  remove: async (ids: number[]): Promise<number> => (await apiClient.delete<ApiResponse<number>>('v1/mkt/managers', { data: ids })).data.data,
  /** AS-IS mkt.Mkt02_Manager.updateTargetCompanyId */
  move: async (targetCompanyId: number, managerIds: number[]): Promise<number> =>
    (await apiClient.put<ApiResponse<number>>('v1/mkt/managers/move', { targetCompanyId, managerIds })).data.data,
};

/** Z05 즐겨찾기 (AS-IS server/mkt/Mkt06_Favorite) */
export const mktFavoriteApi = {
  /** AS-IS mkt.Mkt06_Favorite.modelUpdate 반복 */
  add: async (items: { targetCompanyId: number; managerId: number }[]): Promise<number> =>
    (await apiClient.post<ApiResponse<number>>('v1/mkt/favorites', items)).data.data,
  /** AS-IS mkt.Mkt06_Favorite.deleteList */
  remove: async (favoriteIds: number[]): Promise<number> => (await apiClient.delete<ApiResponse<number>>('v1/mkt/favorites', { data: favoriteIds })).data.data,
};

/** Z05 공유지정 (AS-IS server/mkt/Mkt05_Share) */
export const mktShareApi = {
  search: async (parentId: number): Promise<MktShare[]> =>
    (await apiClient.get<ApiResponse<MktShare[]>>('v1/mkt/shares', { params: { parentId } })).data.data ?? [],
  /** AS-IS mkt.Mkt05_Share.delete + update → 공유 요약(없으면 null) */
  save: async (parentId: number, rows: MktShare[], deleteIds: number[]): Promise<string | null> =>
    (await apiClient.put<ApiResponse<string | null>>('v1/mkt/shares', { parentId, rows, deleteIds })).data.data ?? null,
  /** AS-IS mkt.Mkt05_Share.insertDefaultShare */
  insertDefault: async (targetCompanyId: number, historyId: number): Promise<string | null> =>
    (await apiClient.post<ApiResponse<string | null>>('v1/mkt/shares/default', null, { params: { targetCompanyId, historyId } })).data.data ?? null,
  /** AS-IS mkt.Mkt05_Share.deleteDefaultShare */
  deleteDefault: async (historyId: number): Promise<void> => {
    await apiClient.delete('v1/mkt/shares/default', { params: { historyId } });
  },
};

/** Z05 업무활동내역 (AS-IS server/mkt/Mkt03_History·Mkt04_RelateFund) */
export const mktHistoryApi = {
  nextId: async (): Promise<number> => (await apiClient.get<ApiResponse<number>>('v1/mkt/histories/next-id')).data.data,
  /** AS-IS mkt.Mkt03_History.selectByTargetCompanyId */
  search: async (p: { itemType: string; targetCompanyId?: number | null; startDate: string; closeDate: string; allContactYn: boolean; searchText: string }): Promise<MktHistory[]> =>
    (await apiClient.get<ApiResponse<MktHistory[]>>('v1/mkt/histories', { params: p })).data.data ?? [],
  /** Z06 AS-IS mkt.Mkt03_History.selectByTargetCompanyId(isManager=true) — 활동처를 안 고르면 전체(allContactYn) */
  searchManage: async (p: { targetCompanyId?: number | null; startDate: string; closeDate: string; searchText: string }): Promise<MktHistory[]> =>
    (await apiClient.get<ApiResponse<MktHistory[]>>('v1/mkt/histories/manage', { params: p })).data.data ?? [],
  get: async (id: number): Promise<MktHistory> => (await apiClient.get<ApiResponse<MktHistory>>(`v1/mkt/histories/${id}`)).data.data,
  /** AS-IS mkt.Mkt03_History.updateOne + mkt.Mkt04_RelateFund.updateByList */
  save: async (req: MktHistorySave): Promise<MktHistory> => (await apiClient.put<ApiResponse<MktHistory>>('v1/mkt/histories', req)).data.data,
  remove: async (ids: number[]): Promise<number> => (await apiClient.delete<ApiResponse<number>>('v1/mkt/histories', { data: ids })).data.data,
  /** AS-IS mkt.Mkt04_RelateFund.selectByHistoryId */
  searchRelateFunds: async (historyId: number): Promise<MktRelateFund[]> =>
    (await apiClient.get<ApiResponse<MktRelateFund[]>>(`v1/mkt/histories/${historyId}/relate-funds`)).data.data ?? [],
  /** AS-IS mkt.Mkt04_RelateFund.delete */
  removeRelateFunds: async (historyId: number, ids: number[]): Promise<number> =>
    (await apiClient.delete<ApiResponse<number>>(`v1/mkt/histories/${historyId}/relate-funds`, { data: ids })).data.data,
};
