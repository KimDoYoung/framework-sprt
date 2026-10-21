import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { FltAccount, FltAccountClose, FltAccountStatus, FltDocClass, FltItemType } from '../types/flt';

/** flt(임직원매매) 화면 API (E08~) */
export const fltApi = {
  // ── E08 임직원매매 종목유형관리 (Flt05_Tab_ItemTypeAdmin) ──

  /** AS-IS flt.Flt05_ItemType.selectBySearchText: companyId가 없으면 로그인 회사, 다른 회사는 관리자 회사만 */
  searchItemTypes: async (searchText: string, companyId?: number): Promise<FltItemType[]> => {
    const res = await apiClient.get<ApiResponse<FltItemType[]>>('v1/flt/item-types', { params: { companyId, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt05_ItemType.update → 저장된 행(요청 순서) */
  updateItemTypes: async (rows: FltItemType[], companyId?: number): Promise<FltItemType[]> => {
    const body = rows.map(({ itemTypeId, itemTypeCode, itemTypeName, seq, startDate, targetYn, sellPreApprYn, lockUpCheckYn, stkPriceYn, listStkYn }) =>
      ({ itemTypeId, itemTypeCode, itemTypeName, seq, startDate, targetYn, sellPreApprYn, lockUpCheckYn, stkPriceYn, listStkYn }));
    const res = await apiClient.put<ApiResponse<FltItemType[]>>('v1/flt/item-types', body, { params: { companyId } });
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt05_ItemType.delete → 지운 건수 */
  deleteItemTypes: async (ids: number[], companyId?: number): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/flt/item-types', { data: ids, params: { companyId } });
    return res.data.data ?? 0;
  },

  /** AS-IS flt.Flt05_ItemType.insertInitData: 고른 종목유형을 고객사로 복사 (관리자) → 복사한 건수 */
  copyItemTypes: async (companyId: number, itemTypeIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/flt/item-types/copy', { companyId, itemTypeIds });
    return res.data.data ?? 0;
  },

  // ── I02 임직원매매 계좌신고 (Flt03_Tab_AccountReport · Flt06_TabPage_AccountClose) ──

  /** AS-IS flt.Flt03_Account.selectByPersonId (로그인 사용자 본인, 폐쇄 계좌 제외) */
  searchAccounts: async (): Promise<FltAccount[]> => {
    const res = await apiClient.get<ApiResponse<FltAccount[]>>('v1/flt/accounts');
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt03_Account.update → 저장된 행(요청 순서) */
  updateAccounts: async (rows: FltAccount[]): Promise<FltAccount[]> => {
    const body = rows.map(({ accountId, setupDate, regReason, familyRelateCode, mainAccountYn, accountName, accountNoDec, corpId, corpBranchName, itemType, note }) =>
      ({ accountId, setupDate, regReason, familyRelateCode, mainAccountYn, accountName, accountNoDec, corpId, corpBranchName, itemType, note }));
    const res = await apiClient.put<ApiResponse<FltAccount[]>>('v1/flt/accounts', body);
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt03_Account.delete (거래내역이 있으면 서버가 거절) → 지운 건수 */
  deleteAccounts: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/flt/accounts', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS flt.Flt03_Account.getItemTypeName: 종목유형 6자리("101000") → 이름 */
  getItemTypeName: async (itemType: string): Promise<string> => {
    const res = await apiClient.get<ApiResponse<string>>('v1/flt/accounts/item-type-name', { params: { itemType } });
    return res.data.data ?? '';
  },

  /** AS-IS flt.Flt02_Emp.selectByDate + flt.Flt04_Oath.selectByDate: 보고주기·서약서 안내 */
  getAccountStatus: async (): Promise<FltAccountStatus> => {
    const res = await apiClient.get<ApiResponse<FltAccountStatus>>('v1/flt/accounts/status');
    return res.data.data;
  },

  /** AS-IS dcr.Dcr30_Link.selectByLinkCode: 연결 기본 문서분류(B05 계좌신고·B06 계좌폐쇄), 없으면 null */
  getDocClass: async (linkCode: string): Promise<FltDocClass | null> => {
    const res = await apiClient.get<ApiResponse<FltDocClass | null>>('v1/flt/accounts/doc-class', { params: { linkCode } });
    return res.data.data ?? null;
  },

  /** AS-IS flt.Flt06_AccountClose.selectByPersonId */
  searchAccountCloses: async (): Promise<FltAccountClose[]> => {
    const res = await apiClient.get<ApiResponse<FltAccountClose[]>>('v1/flt/accounts/closes');
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt06_AccountClose.insert: 폐쇄일 + 고른 계좌 → 등록한 건수 */
  createAccountCloses: async (closeDate: string, accountIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/flt/accounts/closes', { closeDate, accountIds });
    return res.data.data ?? 0;
  },

  /** AS-IS flt.Flt06_AccountClose.delete (폐쇄취소) → 지운 건수 */
  deleteAccountCloses: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/flt/accounts/closes', { data: ids });
    return res.data.data ?? 0;
  },
};
