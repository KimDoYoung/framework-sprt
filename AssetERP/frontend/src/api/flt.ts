import { FileInfo } from '@/types/sys';
import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { readBlobError } from './file';
import {
  FltViolate, FltAccount, FltAccountAdmin,FltAccountClose, FltAccountStatus, FltBook, FltBookList, FltBuyLockup, FltLockupStd, FltDocClass, FltInvestLimit, FltItemType, FltItemTypeCode,
  FltAcntTransfer, FltBookMonth, FltEmpLimit, FltRealTr, FltRelateAppr, FltReportCheck, FltRightsExercise, FltTr, FltTrAccount, FltTrCheck, FltTrItem, FltTrList, FltEmpAppr, FltEmpApprDoc, FltEmpInfo, FltEmpInfoSetting, FltTrStatus,
  FltPreApprove, FltPreApproveSetting, FltCeoAccount, FltCeoReportPerson, FltCeoTr, FltCeoAppr,
  FltCompanyStd, FltCompanyStdLockup, FltBuyLockupItem, FltExceptPerson,
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

  /** AS-IS flt.Flt03_Account.selectByDate (J01 계좌신고현황, 회사 전체. closeAccountYn=폐쇄계좌 포함) */
  searchAccountsByDate: async (setupDate: string, closeAccountYn: boolean): Promise<FltAccountAdmin[]> => {
    const res = await apiClient.get<ApiResponse<FltAccountAdmin[]>>('v1/flt/accounts/status-by-date', { params: { setupDate, closeAccountYn } });
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

  // ── I04 임직원매매 매도 사전신고 (Flt10_Tab_SellReport · Flt11_Lookup_BookList) ──

  /** AS-IS flt.Flt11_Book.selectByText2: 기준일 보유내역(사전신고 반영). 검색어는 서버가 %…%로 */
  searchBooksExpect: async (accountId: number | null, stdDate: string, searchText: string): Promise<FltBook[]> => {
    const res = await apiClient.get<ApiResponse<FltBook[]>>('v1/flt/books/expect', { params: { accountId, stdDate, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt01_CompanyStd.selectByDate: 의무보유기간 기준, 기준관리가 없으면 null */
  getLockupStd: async (stdDate: string): Promise<FltLockupStd | null> => {
    const res = await apiClient.get<ApiResponse<FltLockupStd | null>>('v1/flt/books/lockup-std', { params: { stdDate } });
    return res.data.data ?? null;
  },

  // ── I05 임직원매매 정기보고 (Flt10_Tab_RealTransaction · Flt03_Lookup_Account · Flt05_Lookup_ItemTypeConfirm) ──

  /** AS-IS flt.Flt10_Tr.selectByPeriod (로그인 사용자 본인). 검색어는 서버가 %…%로 */
  searchRealTrs: async (params: { accountId?: number | null; startDate: string; closeDate: string; searchText?: string; myAccountYn: boolean; preTrYn: boolean }): Promise<FltRealTr[]> => {
    const res = await apiClient.get<ApiResponse<FltRealTr[]>>('v1/flt/real-trs', { params });
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt10_Tr.update → 저장된 행(요청 순서). trId 0 이하는 신규 */
  updateRealTrs: async (rows: FltRealTr[]): Promise<FltRealTr[]> => {
    const body = rows.map(({ trId, trType, accountId, trDate, trItemType, trItemName, trItemCode, trQty, trAmt, trNote }) =>
      ({ trId, trType, accountId, trDate, trItemType, trItemName, trItemCode, trQty, trAmt, trNote }));
    const res = await apiClient.put<ApiResponse<FltRealTr[]>>('v1/flt/real-trs', body);
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt10_Tr.delete (GridDeleteData) → 지운 건수 */
  deleteRealTrs: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/flt/real-trs', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS flt.Flt10_Tr.deleteUpdate: 사전신고가 있는 행은 실거래 열만 비운다 → 처리한 건수 */
  clearRealTrs: async (ids: number[]): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/flt/real-trs/clear', ids);
    return res.data.data ?? 0;
  },

  /** AS-IS flt.Flt10_Tr.deleteApprList: 상신문서 폐기 */
  discardApprs: async (apprIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/flt/real-trs/apprs', { data: apprIds });
    return res.data.data ?? 0;
  },

  /** AS-IS flt.Flt10_Tr.getBizDate: 기준일(말일)의 영업일 */
  getBizDate: async (baseDate: string): Promise<string> => {
    const res = await apiClient.get<ApiResponse<string>>('v1/flt/real-trs/biz-date', { params: { baseDate } });
    return res.data.data;
  },

  /** AS-IS flt.Flt02_Emp.selectInvestLimit: 투자한도 설정이 없으면 null */
  getEmpLimit: async (stdDate: string): Promise<FltEmpLimit | null> => {
    const res = await apiClient.get<ApiResponse<FltEmpLimit | null>>('v1/flt/real-trs/emp-limit', { params: { stdDate } });
    return res.data.data ?? null;
  },

  /** AS-IS flt.Flt14_RelateAppr.selectByStdDate */
  searchRelateApprs: async (stdDate: string): Promise<FltRelateAppr[]> => {
    const res = await apiClient.get<ApiResponse<FltRelateAppr[]>>('v1/flt/real-trs/relate-apprs', { params: { stdDate } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys12_Calendar.selectByDay: 영업일 여부, 일자 정보가 없으면 null */
  getWorkingDay: async (stdDate: string): Promise<boolean | null> => {
    const res = await apiClient.get<ApiResponse<boolean | null>>('v1/flt/real-trs/working-day', { params: { stdDate } });
    return res.data.data ?? null;
  },

  /** AS-IS flt.Flt10_Tr.insertFloorTrBook: 원장생성 (실패하면 서버 메시지로 오류) */
  insertFloorTrBook: async (startDate: string): Promise<void> => {
    await apiClient.post<ApiResponse<number>>('v1/flt/real-trs/book', null, { params: { startDate } });
  },

  /** AS-IS flt.Flt10_Tr.checkPreAppr → checkNextAppr */
  checkReport: async (stdDate: string): Promise<FltReportCheck> => {
    const res = await apiClient.get<ApiResponse<FltReportCheck>>('v1/flt/real-trs/report-check', { params: { stdDate } });
    return res.data.data;
  },

  /** 템플릿 받기 (AS-IS downloadForm → ./excelTemplete/Template_임직원자기매매.xlsx) */
  downloadRealTrTemplate: async (): Promise<void> => {
    const res = await apiClient.get<Blob>('v1/flt/real-trs/template', { responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Template_임직원자기매매.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  },

  /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=fltUpload) → 등록한 건수 */
  uploadRealTrsExcel: async (file: File): Promise<number> => {
    const form = new FormData();
    form.append('excelUpload', file);
    const res = await apiClient.post<ApiResponse<number>>('v1/flt/real-trs/excel', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.data ?? 0;
  },

  /** AS-IS flt.Flt12_BookMonth.selectByBookDate. 검색어는 서버가 %…%로 */
  searchBookMonths: async (params: { accountId?: number | null; startDate: string; closeDate: string; searchText?: string; myAccountYn: boolean }): Promise<FltBookMonth[]> => {
    const res = await apiClient.get<ApiResponse<FltBookMonth[]>>('v1/flt/book-months', { params });
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt12_BookMonth.checkBookMonth: 평가금액이 비어 있으면 서버 메시지로 오류 */
  checkBookMonth: async (startDate: string, closeDate: string, myAccountYn: boolean): Promise<void> => {
    await apiClient.get<ApiResponse<number>>('v1/flt/book-months/check', { params: { startDate, closeDate, myAccountYn } });
  },

  /** AS-IS flt.Flt12_BookMonth.update → 저장된 행(요청 순서) */
  updateBookMonths: async (rows: FltBookMonth[]): Promise<FltBookMonth[]> => {
    const body = rows.map(({ bookMonthId, accountId, bookDate, itemType, itemName, itemCode, bookAmt, stkPriceYn }) =>
      ({ bookMonthId, accountId, bookDate, itemType, itemName, itemCode, bookAmt, stkPriceYn }));
    const res = await apiClient.put<ApiResponse<FltBookMonth[]>>('v1/flt/book-months', body);
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt12_BookMonth.insertBookAmt: type "1" 평가금액을 취득금액으로 / "2" 상장주식 평가처리 → 처리한 건수 */
  evaluateBookMonths: async (req: { accountId: number | null; startDate: string; closeDate: string; searchText: string; type: '1' | '2' }): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/flt/book-months/evaluate', req);
    return res.data.data ?? 0;
  },

  // ── I06 임직원매매 계좌대체 (Flt10_Tab_AcntTransfer · Flt10_Lookup_AcntTransfer) ──

  /** AS-IS flt.Flt11_Book.selectByText: 기준일 보유잔고(expectYn=false). 검색어는 서버가 %…%로 */
  searchBooks: async (accountId: number | null, stdDate: string, searchText: string): Promise<FltBook[]> => {
    const res = await apiClient.get<ApiResponse<FltBook[]>>('v1/flt/books', { params: { accountId, stdDate, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt10_Tr.selectByTrType (로그인 사용자 본인, 계좌대체). 검색어는 서버가 %…%로 */
  searchAcntTransfers: async (params: { accountId?: number | null; startDate: string; closeDate: string; searchText?: string }): Promise<FltAcntTransfer[]> => {
    const res = await apiClient.get<ApiResponse<FltAcntTransfer[]>>('v1/flt/acnt-transfers', { params });
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt10_Tr.update → 저장된 행(요청 순서). trId 0 이하는 신규 */
  updateAcntTransfers: async (rows: FltAcntTransfer[]): Promise<FltAcntTransfer[]> => {
    const body = rows.map(({ trId, regDate, trItemType, trItemName, trItemCode, trQty, trAmt, outAccountId, accountId }) =>
      ({ trId, regDate, trItemType, trItemName, trItemCode, trQty, trAmt, outAccountId, accountId }));
    const res = await apiClient.put<ApiResponse<FltAcntTransfer[]>>('v1/flt/acnt-transfers', body);
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt10_Tr.delete2 → 지운 건수(행마다 그 종목의 원장을 다시 만든다) */
  deleteAcntTransfers: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/flt/acnt-transfers', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS flt.Flt10_Tr.insertFloorTrBook (createBook, 종목 한정) — 실패하면 서버 메시지로 예외 */
  createAcntTransferBook: async (row: { trItemType: string | null; trItemName: string | null; trItemCode: string | null; regDate: string }): Promise<void> => {
    await apiClient.post<ApiResponse<number>>('v1/flt/acnt-transfers/book', row);
  },

  /** AS-IS flt.Flt10_Tr.selectByTrType (로그인 사용자 본인, 권리행사/기타입출고 FloorTrCode0002). trType '%'=전체, 검색어는 서버가 %…%로 */
  searchRightsExercises: async (params: { trType?: string; accountId?: number | null; startDate: string; closeDate: string; searchText?: string }): Promise<FltRightsExercise[]> => {
    const res = await apiClient.get<ApiResponse<FltRightsExercise[]>>('v1/flt/rights-exercises', { params });
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt10_Tr.update → 저장된 행(요청 순서). trId 0 이하는 신규 */
  updateRightsExercises: async (rows: FltRightsExercise[]): Promise<FltRightsExercise[]> => {
    const body = rows.map(({ trId, trType, regDate, accountId, trItemType, trItemName, trItemCode, trQty, trAmt, trNote }) =>
      ({ trId, trType, regDate, accountId, trItemType, trItemName, trItemCode, trQty, trAmt, trNote }));
    const res = await apiClient.put<ApiResponse<FltRightsExercise[]>>('v1/flt/rights-exercises', body);
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt10_Tr.delete2 → 지운 건수(행마다 그 종목의 원장을 다시 만든다) */
  deleteRightsExercises: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/flt/rights-exercises', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS flt.Flt10_Tr.insertFloorTrBook (createBook, 종목 한정) — 실패하면 서버 메시지로 예외 */
  createRightsExerciseBook: async (row: { trItemType: string | null; trItemName: string | null; trItemCode: string | null; regDate: string }): Promise<void> => {
    await apiClient.post<ApiResponse<number>>('v1/flt/rights-exercises/book', row);
  },

  // ── I08 매매내역조회 (Flt10_Tab_TrList) · I09 보유내역조회 (Flt11_Tab_BookList) ──

  /** AS-IS flt.Flt10_Tr.selectByTrList (로그인 사용자 본인). trType·ioType '%'=전체, 검색어는 서버가 %…%로 */
  searchTrList: async (params: { startDate: string; closeDate: string; preTrYn: boolean; trType: string; ioType: string; searchText: string }): Promise<FltTrList[]> => {
    const res = await apiClient.get<ApiResponse<FltTrList[]>>('v1/flt/trs/list', { params });
    return res.data.data ?? [];
  },

  /** 엑셀다운로드 (AS-IS Sys99_Print.insertRdTrList + RD 리포트 → xlsx) — 조회 조건 그대로, 브라우저 저장 */
  downloadTrListExcel: async (params: { startDate: string; closeDate: string; preTrYn: boolean; trType: string; ioType: string; searchText: string }, fileName: string): Promise<void> => {
    await downloadBlob('v1/flt/trs/list/excel', params, fileName);
  },

  // ── J03 준감인 매매내역조회 (Flt10_Tab_TrListAdmin) ──

  /** AS-IS flt.Flt10_Tr.selectByTrList (준감인). personId null = 회사 전체 사원, trType·ioType '%'=전체 */
  searchTrListAdmin: async (params: { personId: number | null; startDate: string; closeDate: string; preTrYn: boolean; trType: string; ioType: string; searchText: string }): Promise<FltTrList[]> => {
    const res = await apiClient.get<ApiResponse<FltTrList[]>>('v1/flt/trs/admin/list', { params: { ...params, personId: params.personId ?? undefined } });
    return res.data.data ?? [];
  },

  /** 엑셀다운로드 (AS-IS Sys99_Print.insertRdTrListAdmin + RD 리포트 → xlsx). report=true가 [엑셀다운로드(금감원양식)] */
  downloadTrListAdminExcel: async (params: { personId: number | null; startDate: string; closeDate: string; report: boolean; preTrYn: boolean; trType: string; ioType: string; searchText: string }, fileName: string): Promise<void> => {
    await downloadBlob('v1/flt/trs/admin/list/excel', { ...params, personId: params.personId ?? undefined }, fileName);
  },

  /** AS-IS flt.Flt11_Book.selectByBookList (로그인 사용자 본인). 검색어는 서버가 %…%로 */
  searchBookList: async (baseDate: string, searchText: string): Promise<FltBookList[]> => {
    const res = await apiClient.get<ApiResponse<FltBookList[]>>('v1/flt/books/list', { params: { baseDate, searchText } });
    return res.data.data ?? [];
  },

  /** 엑셀다운로드 (AS-IS Sys99_Print.insertRdBookList + RD 리포트 → xlsx) */
  downloadBookListExcel: async (baseDate: string, searchText: string, fileName: string): Promise<void> => {
    await downloadBlob('v1/flt/books/list/excel', { baseDate, searchText }, fileName);
  },

  // ── J04 준감인 보유내역조회 (Flt11_Tab_BookListAdmin) ──

  /** AS-IS flt.Flt11_Book.selectByBookList (준감인). personId null = 회사 전체 사원, 검색어는 서버가 %…%로 */
  searchBookListAdmin: async (personId: number | null, baseDate: string, searchText: string): Promise<FltBookList[]> => {
    const res = await apiClient.get<ApiResponse<FltBookList[]>>('v1/flt/books/admin/list', { params: { personId: personId ?? undefined, baseDate, searchText } });
    return res.data.data ?? [];
  },

  /** 엑셀다운로드 (AS-IS Sys99_Print.insertRdBookListAdmin + RD 리포트 → xlsx) */
  downloadBookListAdminExcel: async (personId: number | null, baseDate: string, searchText: string, fileName: string): Promise<void> => {
    await downloadBlob('v1/flt/books/admin/list/excel', { personId: personId ?? undefined, baseDate, searchText }, fileName);
  },

  // ── J06 정기보고현황 (Flt10_Tab_EmpAppr · Flt10_Grid_EmpAppr) ──

  /** AS-IS flt.Flt10_Tr.selectEmpAppr. stdDate = 기준년월의 말일, unApprYn=true면 미보고건만, 검색어는 서버가 %…%로 */
  searchEmpApprs: async (stdDate: string, unApprYn: boolean, searchText: string): Promise<FltEmpAppr[]> => {
    const res = await apiClient.get<ApiResponse<FltEmpAppr[]>>('v1/flt/trs/emp-apprs', { params: { stdDate, unApprYn, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt10_Tr.selectByApprId — 사원의 기간 내 정기보고 상신문서 */
  searchEmpApprDocs: async (personId: number, startDate: string, closeDate: string): Promise<FltEmpApprDoc[]> => {
    const res = await apiClient.get<ApiResponse<FltEmpApprDoc[]>>('v1/flt/trs/emp-apprs/docs', { params: { personId, startDate, closeDate } });
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt10_Tr.deleteAppr — 상신문서 삭제(폐기 보관 포함) */
  deleteEmpAppr: async (apprId: number): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`v1/flt/trs/emp-apprs/docs/${apprId}`);
  },

  // ── J07 임직원매매현황 (Flt02_Tab_EmpInfo · Flt15_Lookup_Note · Flt03_Lookup_AccountView · Flt07_Lookup_FamilyConsent) ──

  /** AS-IS flt.Flt02_Emp.selectByCompanyId — 기준일 시점 재직 사원별 현황, 검색어는 서버가 %…%로 */
  searchEmpInfos: async (stdDate: string, searchText: string): Promise<FltEmpInfo[]> => {
    const res = await apiClient.get<ApiResponse<FltEmpInfo[]>>('v1/flt/emps/info', { params: { stdDate, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt01_CompanyStd.selectByDate (setGridHidden) — 연간투자한도 열을 숨길지 */
  getEmpInfoSetting: async (stdDate: string): Promise<FltEmpInfoSetting> => {
    const res = await apiClient.get<ApiResponse<FltEmpInfoSetting>>('v1/flt/emps/info/setting', { params: { stdDate } });
    return res.data.data;
  },

  /** 엑셀다운로드 (AS-IS Sys99_Print.insertRdEmpInfo + RD 리포트 → xlsx) */
  downloadEmpInfoExcel: async (stdDate: string, searchText: string, fileName: string): Promise<void> => {
    await downloadBlob('v1/flt/emps/info/excel', { stdDate, searchText }, fileName);
  },

  /** AS-IS flt.Flt15_TrStatus.selectByPersonId — 없으면 서버가 빈 메모 행을 만든다 */
  getEmpNote: async (personId: number, stdDate: string): Promise<FltTrStatus> => {
    const res = await apiClient.get<ApiResponse<FltTrStatus>>('v1/flt/tr-statuses', { params: { personId, stdDate } });
    return res.data.data;
  },

  /** AS-IS flt.Flt15_TrStatus.update */
  updateEmpNote: async (trStatusId: number, note: string | null): Promise<FltTrStatus> => {
    const res = await apiClient.put<ApiResponse<FltTrStatus>>('v1/flt/tr-statuses', { trStatusId, note });
    return res.data.data;
  },

  /** AS-IS flt.Flt03_Account.selectByDate(companyId, personId, setupDate, closeAccountYn) — 사원 한 명의 계좌 */
  searchPersonAccounts: async (personId: number, setupDate: string, closeAccountYn: boolean): Promise<FltAccountAdmin[]> => {
    const res = await apiClient.get<ApiResponse<FltAccountAdmin[]>>('v1/flt/accounts/status-by-date', { params: { personId, setupDate, closeAccountYn } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys10_File.selectByFamilyConsentId — 사원의 가족금융거래정보 이용동의서 첨부파일 */
  searchFamilyConsentFiles: async (personId: number): Promise<FileInfo[]> => {
    const res = await apiClient.get<ApiResponse<FileInfo[]>>('v1/sys/files/family-consent', { params: { personId } });
    return res.data.data ?? [];
  },

  // ── I10 위반내역조회 (Flt10_Tab_ViolateUser · Flt10_Tab_Violate) ──

  /** AS-IS flt.Flt10_Tr.selectViolate. personId 생략(null) = 회사 전체 사원 */
  searchViolate: async (stdDate: string, personId: number | null): Promise<FltViolate[]> => {
    const res = await apiClient.get<ApiResponse<FltViolate[]>>('v1/flt/trs/violate', { params: { stdDate, personId: personId ?? undefined } });
    return res.data.data ?? [];
  },

  /** 엑셀다운로드 (AS-IS Sys99_Print.insertRdViolate + RD 리포트 Flt10_Rd_Violate → xlsx) */
  downloadViolateExcel: async (stdDate: string, personId: number | null, fileName: string): Promise<void> => {
    await downloadBlob('v1/flt/trs/violate/excel', { stdDate, personId: personId ?? undefined }, fileName);
  },

  // ── J02 사전승인 (Flt10_Tab_PreApprove · Flt10_Lookup_RejectReasonWrite) ──

  /** AS-IS flt.Flt10_Tr.selectByCompanyId. trType '10I' 매수 / '20O' 매도, apprYn `%`(전체)·'true'(승인)·'false'(미승인), personId null = 전체 */
  searchPreApproves: async (params: { trType: string; personId: number | null; apprYn: string; startDate: string; closeDate: string; searchText: string; noLimitYn: boolean }): Promise<FltPreApprove[]> => {
    const res = await apiClient.get<ApiResponse<FltPreApprove[]>>('v1/flt/trs/approvals', { params: { ...params, personId: params.personId ?? undefined } });
    return res.data.data ?? [];
  },

  /** setInitData() — 투자한도 열 숨김·협의승인 회사 여부 */
  getPreApproveSetting: async (toDay: string): Promise<FltPreApproveSetting> => {
    const res = await apiClient.get<ApiResponse<FltPreApproveSetting>>('v1/flt/trs/approvals/setting', { params: { toDay } });
    return res.data.data;
  },

  /** AS-IS flt.Flt10_Tr.updateStatusCode — '20' 승인 / '30' 반려 / '10' 취소 */
  updatePreApproveStatus: async (trIds: number[], statusCode: string, rejectReason: string | null): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/flt/trs/approvals/status', { trIds, statusCode, rejectReason });
    return res.data.data ?? 0;
  },

  /** AS-IS flt.Flt10_Tr.updateAddConfirmer — addConfirmerId null = 선택안함 */
  updatePreApproveConfirmer: async (trIds: number[], addConfirmerId: number | null): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/flt/trs/approvals/add-confirmer', { trIds, addConfirmerId });
    return res.data.data ?? 0;
  },

  /** Flt10_Lookup_RejectReasonWrite.update() — 승인·반려 사유 수정 */
  updatePreApproveReason: async (trId: number, rejectReason: string | null): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>(`v1/flt/trs/approvals/${trId}/reason`, { rejectReason });
    return res.data.data ?? 0;
  },

  /** AS-IS flt.Flt10_Tr.sendMessage (일괄 알림발송) → 결과 메시지 */
  sendPreApproveMessage: async (): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>('v1/flt/trs/approvals/send-message');
    return res.data.data ?? '';
  },

  // ── J09 기준관리 (Flt01_Tab_CompanyStd · Flt01_Lookup_LockUpCheckType · Flt08_Lookup_LockupItem · Flt05_Lookup_ItemType) ──

  /** AS-IS flt.Flt01_CompanyStd.selectByCompanyId — 로그인 회사, 적용시작일 내림차순 */
  searchCompanyStds: async (): Promise<FltCompanyStd[]> => {
    const res = await apiClient.get<ApiResponse<FltCompanyStd[]>>('v1/flt/company-stds');
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt01_CompanyStd.update → 저장된 행(요청 순서) */
  updateCompanyStds: async (rows: FltCompanyStd[]): Promise<FltCompanyStd[]> => {
    const res = await apiClient.put<ApiResponse<FltCompanyStd[]>>('v1/flt/company-stds', rows);
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt01_CompanyStd.delete → 지운 건수 */
  deleteCompanyStds: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/flt/company-stds', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS flt.Flt01_CompanyStd.updateOne — 의무보유기간 위반 체크 방식 → 저장된 행 */
  updateCompanyStdLockup: async (companyStdId: number, req: FltCompanyStdLockup): Promise<FltCompanyStd> => {
    const res = await apiClient.put<ApiResponse<FltCompanyStd>>(`v1/flt/company-stds/${companyStdId}/lockup`, req);
    return res.data.data;
  },

  /** AS-IS flt.Flt08_BuyLockup.selectByText — lockupType `%`=전체, 검색어는 서버가 %…%로 */
  searchBuyLockups: async (lockupType: string, searchText: string): Promise<FltBuyLockupItem[]> => {
    const res = await apiClient.get<ApiResponse<FltBuyLockupItem[]>>('v1/flt/buy-lockups', { params: { lockupType, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt08_BuyLockup.update → 저장된 행(요청 순서) */
  updateBuyLockups: async (rows: FltBuyLockupItem[]): Promise<FltBuyLockupItem[]> => {
    const res = await apiClient.put<ApiResponse<FltBuyLockupItem[]>>('v1/flt/buy-lockups', rows);
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt08_BuyLockup.delete → 지운 건수 */
  deleteBuyLockups: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/flt/buy-lockups', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS flt.Flt16_ExceptPerson.selectByCompanyId — 로그인 회사 */
  searchExceptPersons: async (): Promise<FltExceptPerson[]> => {
    const res = await apiClient.get<ApiResponse<FltExceptPerson[]>>('v1/flt/except-persons');
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt16_ExceptPerson.update → 저장된 행(요청 순서). 같은 사원이 이미 있으면 서버가 "[이름] 사원은 이미 등록되어 있습니다" */
  updateExceptPersons: async (rows: FltExceptPerson[]): Promise<FltExceptPerson[]> => {
    const res = await apiClient.put<ApiResponse<FltExceptPerson[]>>('v1/flt/except-persons', rows);
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt16_ExceptPerson.delete → 지운 건수 */
  deleteExceptPersons: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/flt/except-persons', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS flt.Flt05_ItemType.selectUseCount —지우려는 종목유형 중 매매·보유내역에서 쓰는 것의 이름(`/` 구분), 없으면 null */
  checkItemTypeUse: async (ids: number[]): Promise<string | null> => {
    const res = await apiClient.post<ApiResponse<string | null>>('v1/flt/item-types/use-check', ids);
    return res.data.data ?? null;
  },

  // ── J08 책임자보고 (Flt10_Tab_CeoReport) — stdDate = 기준월 말일, startDate = 기준월 1일, transCode 000 전체 / 100 재직 / 900 퇴직 ──

  /** AS-IS flt.Flt03_Account.selectByStdDate — 임직원계좌신고내역 탭 */
  searchCeoAccounts: async (stdDate: string, startDate: string, transCode: string): Promise<FltCeoAccount[]> => {
    const res = await apiClient.get<ApiResponse<FltCeoAccount[]>>('v1/flt/ceo-reports/accounts', { params: { stdDate, startDate, transCode } });
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt10_Tr.selectByStdDate — 매월신고대상임직원 탭 */
  searchCeoReportPersons: async (stdDate: string, startDate: string, transCode: string): Promise<FltCeoReportPerson[]> => {
    const res = await apiClient.get<ApiResponse<FltCeoReportPerson[]>>('v1/flt/ceo-reports/report-persons', { params: { stdDate, startDate, transCode } });
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt10_Tr.selectByStdDate2 — 임직원매매명세 탭 */
  searchCeoTrs: async (stdDate: string, startDate: string, transCode: string): Promise<FltCeoTr[]> => {
    const res = await apiClient.get<ApiResponse<FltCeoTr[]>>('v1/flt/ceo-reports/trs', { params: { stdDate, startDate, transCode } });
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr01_Appr.selectByLinkCode(A72) — 기준월(startDate)의 상신 문서 */
  searchCeoApprs: async (startDate: string): Promise<FltCeoAppr[]> => {
    const res = await apiClient.get<ApiResponse<FltCeoAppr[]>>('v1/flt/ceo-reports/apprs', { params: { startDate } });
    return res.data.data ?? [];
  },

  /** 엑셀다운로드 (AS-IS Sys99_Print.insertRdCeoReport + RD 리포트 Flt10_Rd_CeoReport → 시트 3개 xlsx). fileName은 확장자 없이 */
  downloadCeoReportExcel: async (stdDate: string, startDate: string, transCode: string, fileName: string): Promise<void> => {
    await downloadBlob('v1/flt/ceo-reports/excel', { stdDate, startDate, transCode }, `${fileName}.xlsx`);
  },
};

/** 엑셀 응답(blob)을 브라우저로 저장한다. 서버 오류는 blob 안의 메시지를 읽어 던진다 */
async function downloadBlob(path: string, params: object, fileName: string): Promise<void> {
  try {
    const res = await apiClient.get<Blob>(path, { params, responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (err) {
    throw await readBlobError(err);
  }
}
