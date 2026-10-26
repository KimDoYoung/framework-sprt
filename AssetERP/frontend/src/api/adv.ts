import { apiClient } from './client';
import { ApiResponse, PageRes } from '../types/auth';
import { readBlobError } from './file';
import { AdvAccount, AdvBookExtr } from '../types/adv';

/** adv(일임·자문) 화면 API (Q01~) */
export const advApi = {
  /** AS-IS adv.Adv02_Account.selectByManageNamePaging (Q01) — searchText는 서버가 %…%로 */
  searchAccounts: async (params: { searchText: string; offset: number; limit: number }): Promise<PageRes<AdvAccount>> => {
    const res = await apiClient.get<ApiResponse<PageRes<AdvAccount>>>('v1/adv/accounts', { params });
    return res.data.data as PageRes<AdvAccount>;
  },

  /** AS-IS adv.Adv02_Account.update: 저장된 행을 돌려준다(새 행이면 서버가 매긴 id) */
  saveAccount: async (row: AdvAccount): Promise<AdvAccount> => {
    const res = await apiClient.put<ApiResponse<AdvAccount>>('v1/adv/accounts', row.accountId > 0 ? row : { ...row, accountId: null });
    return res.data.data as AdvAccount;
  },

  /** 템플릿 받기 (AS-IS downloadForm → ./excelTemplete/Template_일임계좌정보.xlsx) */
  downloadAccountTemplate: async (): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/adv/accounts/template', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Template_일임계좌정보.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      throw await readBlobError(err);
    }
  },

  /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=adv02Upload) → 등록한 건수 */
  uploadAccountsExcel: async (file: File): Promise<number> => {
    const form = new FormData();
    form.append('excelUpload', file);
    const res = await apiClient.post<ApiResponse<number>>('v1/adv/accounts/excel', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.data ?? 0;
  },

  // ── Q02 일임계좌 권한설정 (Adv05_Tab_OrgAuth) ──

  /** AS-IS adv.Adv02_Account.selectByOrgAuthPaging (Adv02_Lookup_SelectMulti) — 내 조직이 권한을 가진 계좌. searchText는 서버가 %…%로 */
  searchOrgAuthAccounts: async (params: { searchText: string; offset: number; limit: number }): Promise<PageRes<AdvAccount>> => {
    const res = await apiClient.get<ApiResponse<PageRes<AdvAccount>>>('v1/adv/org-auths/accounts', { params });
    return res.data.data as PageRes<AdvAccount>;
  },

  /** AS-IS adv.Adv05_OrgAuth.updateAuthYn: 계좌 × 조직 모두에 권한 부여(confirm 'true') 또는 삭제('false') → 처리 건수 */
  updateOrgAuths: async (body: { accountIds: number[]; orgCodeIds: number[]; confirm: 'true' | 'false' }): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/adv/org-auths', body);
    return res.data.data ?? 0;
  },

  // ── Q03 일임보유주식등록(타사무) (Adv11_Tab_BookExtr) ──

  /** AS-IS adv.Adv11_BookExtr.selectByStdDate: 로그인 회사의 그 기준일 보유종목, 검색어는 서버가 %…%로 */
  searchBookExtrs: async (params: { stdDate: string; searchText: string }): Promise<AdvBookExtr[]> => {
    const res = await apiClient.get<ApiResponse<AdvBookExtr[]>>('v1/adv/book-extrs', { params });
    return res.data.data ?? [];
  },

  /** AS-IS adv.Adv11_BookExtr.selectRecentStdDate: 그 날 이전 가장 최근 기준일(yyyy-MM-dd), 없으면 null */
  getBookExtrRecentStdDate: async (stdDate: string): Promise<string | null> => {
    const res = await apiClient.get<ApiResponse<string | null>>('v1/adv/book-extrs/recent-std-date', { params: { stdDate } });
    return res.data.data ?? null;
  },

  /** AS-IS adv.Adv11_BookExtr.update: 바뀐 행만. bookExtrId가 0 이하면 새 행 — 저장된 행을 요청 순서대로 돌려준다 */
  saveBookExtrs: async (rows: AdvBookExtr[]): Promise<AdvBookExtr[]> => {
    const body = rows.map(r => ({ bookExtrId: r.bookExtrId > 0 ? r.bookExtrId : null, stdDate: r.stdDate ?? null, manageCode: r.manageCode ?? null, manageName: r.manageName ?? null, itemCode: r.itemCode ?? null, itemName: r.itemName ?? null, itemType: r.itemType ?? null }));
    const res = await apiClient.put<ApiResponse<AdvBookExtr[]>>('v1/adv/book-extrs', body);
    return res.data.data ?? [];
  },

  /** AS-IS adv.Adv11_BookExtr.delete */
  deleteBookExtrs: async (ids: number[]): Promise<void> => {
    await apiClient.delete('v1/adv/book-extrs', { data: ids });
  },

  /** 템플릿 받기 (AS-IS downloadForm → ./excelTemplete/Template_일임보유주식등록(타사무).xlsx) */
  downloadBookExtrTemplate: async (): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/adv/book-extrs/template', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Template_일임보유주식등록(타사무).xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      throw await readBlobError(err);
    }
  },

  /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=bookAdvExtrUpload) → 등록한 건수 */
  uploadBookExtrsExcel: async (file: File): Promise<number> => {
    const form = new FormData();
    form.append('excelUpload', file);
    const res = await apiClient.post<ApiResponse<number>>('v1/adv/book-extrs/excel', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.data ?? 0;
  },
};
