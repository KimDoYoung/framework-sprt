import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import {
  FltAccount, FltAccountClose, FltAccountStatus, FltBuyLockup, FltDocClass, FltInvestLimit, FltItemType, FltItemTypeCode,
  FltTr, FltTrAccount, FltTrCheck, FltTrItem,
} from '../types/flt';

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

  // ── I03 임직원매매 매수 사전신고 (Flt10_Tab_BuyReport · Flt10_Lookup_Item · Flt10_Lookup_ExpectTr) ──

  /** AS-IS flt.Flt10_Tr.selectByAccountId (로그인 사용자 본인). regDate가 있으면 그날, 없으면 startDate~closeDate. 검색어는 서버가 %…%로 */
  searchTrs: async (params: { trType: string; accountId?: number | null; regDate?: string; startDate?: string; closeDate?: string; searchText?: string }): Promise<FltTr[]> => {
    const res = await apiClient.get<ApiResponse<FltTr[]>>('v1/flt/trs', { params });
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt02_Emp.selectByDate(기준일) + flt.Flt04_Oath.selectByDate(오늘): 안내·한도 설정. stdDate가 없으면 서버 오늘 */
  getTrCheck: async (stdDate?: string): Promise<FltTrCheck> => {
    const res = await apiClient.get<ApiResponse<FltTrCheck>>('v1/flt/trs/check', { params: { stdDate } });
    return res.data.data;
  },

  /** AS-IS flt.Flt10_Tr.selectInvestLimit */
  getInvestLimit: async (stdDate: string): Promise<FltInvestLimit[]> => {
    const res = await apiClient.get<ApiResponse<FltInvestLimit[]>>('v1/flt/trs/invest-limit', { params: { stdDate } });
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt10_Tr.selectItemName (종목 찾기) */
  searchTrItemNames: async (stdDate: string, searchText: string): Promise<FltTrItem[]> => {
    const res = await apiClient.get<ApiResponse<FltTrItem[]>>('v1/flt/trs/item-names', { params: { stdDate, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt01_CompanyStd.getExpectTrDate: 매매유효일, 기준관리가 없으면 null */
  getExpectTrDate: async (stdDate: string): Promise<string | null> => {
    const res = await apiClient.get<ApiResponse<string | null>>('v1/flt/trs/expect-date', { params: { stdDate } });
    return res.data.data ?? null;
  },

  /** AS-IS flt.Flt08_BuyLockup.checkLockup */
  checkBuyLockup: async (itemCode: string, stdDate: string): Promise<FltBuyLockup> => {
    const res = await apiClient.get<ApiResponse<FltBuyLockup>>('v1/flt/trs/buy-lockup', { params: { itemCode, stdDate } });
    return res.data.data;
  },

  /** AS-IS flt.Flt03_Account.selectByDate: 기준일의 내 계좌 */
  searchTrAccounts: async (setupDate: string): Promise<FltTrAccount[]> => {
    const res = await apiClient.get<ApiResponse<FltTrAccount[]>>('v1/flt/trs/accounts', { params: { setupDate } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys00_Common.selectByFltItemType: 종목유형 콤보 */
  searchItemTypeCodes: async (startDate: string): Promise<FltItemTypeCode[]> => {
    const res = await apiClient.get<ApiResponse<FltItemTypeCode[]>>('v1/flt/trs/item-types', { params: { startDate } });
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt10_Tr.update → 저장된 행(요청 순서). trId 0 이하는 신규 */
  updateTrs: async (rows: FltTr[]): Promise<FltTr[]> => {
    const body = rows.map(({ trId, trType, accountId, regDate, expectTrDate, itemType, itemName, itemCode, expectTrQty, expectTrAmt, trReason }) =>
      ({ trId, trType, accountId, regDate, expectTrDate, itemType, itemName, itemCode, expectTrQty, expectTrAmt, trReason }));
    const res = await apiClient.put<ApiResponse<FltTr[]>>('v1/flt/trs', body);
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt10_Tr.delete → 지운 건수 */
  deleteTrs: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/flt/trs', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS flt.Flt10_Tr.updateStatusCode: 승인신청("10") / 신청취소(null) → 바꾼 건수 */
  updateTrStatus: async (trIds: number[], statusCode: string | null): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/flt/trs/status', { trIds, statusCode });
    return res.data.data ?? 0;
  },

  /** AS-IS flt.Flt10_Tr.updateUnFill: 미체결 처리(true) / 취소(false) → 바꾼 건수 */
  updateTrUnfill: async (trIds: number[], unfill: boolean): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/flt/trs/unfill', { trIds, unfill });
    return res.data.data ?? 0;
  },
};
