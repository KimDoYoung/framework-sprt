import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { AccountCode, AccountCodeAdmin, AccountCodePrintSaveReq, AccountCodeSaveReq, AccountCodeTree, ActCodeOption, ActCompany, ActLink, CloseCheck, JournalMap, RealAccountMap, ReprAccount, TrMap } from '../types/act';
import { readBlobError } from './file';

/** act(관리회계) 화면 API (E25~) */
export const actApi = {
  /** AS-IS act.Act01_AccountCode.selectBySlipYn (Act01_Lookup_AccountCode): companyId가 없으면 로그인 회사, 다른 회사는 관리자 회사만 */
  searchAccountCodes: async (attributeCode: string, searchText: string, companyId?: number): Promise<AccountCode[]> => {
    const res = await apiClient.get<ApiResponse<AccountCode[]>>('v1/act/account-codes/lookup', { params: { companyId, attributeCode: attributeCode || undefined, searchText } });
    return res.data.data ?? [];
  },

  // ── E27 계정코드 관리 (Act01_Tab_AccountCode) ──

  /** AS-IS act.Act01_AccountCode.selectByCompanyId: 로그인 회사. useYn·attributeCode가 '%'이면 전체, 검색어는 서버가 "%검색어%" */
  searchAccountCodeList: async (searchText: string, useYn: string, attributeCode: string): Promise<AccountCodeAdmin[]> => {
    const res = await apiClient.get<ApiResponse<AccountCodeAdmin[]>>('v1/act/account-codes', { params: { searchText, useYn, attributeCode } });
    return res.data.data ?? [];
  },

  /** AS-IS act.Act01_AccountCode.modelUpdate: accountCodeId 없으면 등록 → 저장된 행 */
  saveAccountCode: async (req: AccountCodeSaveReq): Promise<AccountCodeAdmin> => {
    const res = await apiClient.put<ApiResponse<AccountCodeAdmin>>('v1/act/account-codes', req);
    return res.data.data;
  },

  /** AS-IS act.Act01_AccountCode.update (출력정보 및 사용여부 설정): 바뀐 행 → 저장된 행(요청 순서) */
  savePrintAccountCodes: async (rows: AccountCodePrintSaveReq[]): Promise<AccountCodeAdmin[]> => {
    const res = await apiClient.put<ApiResponse<AccountCodeAdmin[]>>('v1/act/account-codes/print', rows);
    return res.data.data ?? [];
  },

  /** AS-IS act.Act01_AccountCode.delete → 지운 건수 */
  deleteAccountCodes: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/act/account-codes', { data: ids });
    return res.data.data;
  },

  /** 엑셀다운로드 (AS-IS RD 리포트 → xlsx) — 조회 조건 그대로, 브라우저 저장 */
  downloadAccountCodesExcel: async (searchText: string, useYn: string, attributeCode: string, fileName: string): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/act/account-codes/excel', { params: { searchText, useYn, attributeCode }, responseType: 'blob' });
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
  },

  /** AS-IS act.Act01_AccountCode.selectTreeByCompanyId (계정과목복사 창): 기준 고객사의 사용 계정 트리(전위 순서) */
  searchAccountTree: async (companyId: number): Promise<AccountCodeTree[]> => {
    const res = await apiClient.get<ApiResponse<AccountCodeTree[]>>('v1/act/account-codes/tree', { params: { companyId } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys01_Company.selectByUseYn (계정과목복사 창, 관리자만) */
  searchCopyCompanies: async (): Promise<ActCompany[]> => {
    const res = await apiClient.get<ApiResponse<ActCompany[]>>('v1/act/account-codes/copy-companies');
    return res.data.data ?? [];
  },

  /** AS-IS act.Act01_AccountCode.insertAdminCopy (관리자만) → 처리한 고객사 수 */
  copyAdminAccountCodes: async (stdCompanyId: number, accountCode: string, companyIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/act/account-codes/copy-admin', { stdCompanyId, accountCode, companyIds });
    return res.data.data;
  },

  // ── E27 이익제공(수령) 연결정보 (Act01_Edit_AccountCode의 linkGrid) ──

  /** AS-IS act.Act14_Link.selectByAccountCode: 로그인 회사 */
  searchLinks: async (accountCode: string): Promise<ActLink[]> => {
    const res = await apiClient.get<ApiResponse<ActLink[]>>('v1/act/links', { params: { accountCode } });
    return res.data.data ?? [];
  },

  /** AS-IS act.Act14_Link.insert → 추가한 행 */
  createLink: async (accountCode: string, provideContentCode: string): Promise<ActLink> => {
    const res = await apiClient.post<ApiResponse<ActLink>>('v1/act/links', { accountCode, provideContentCode });
    return res.data.data;
  },

  /** AS-IS act.Act14_Link.updateList: 보이는 순서대로 조회순서를 1부터 다시 매긴다 */
  orderLinks: async (ids: number[]): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/act/links/order', ids);
    return res.data.data;
  },

  /** AS-IS act.Act14_Link.delete → 지운 건수 */
  deleteLinks: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/act/links', { data: ids });
    return res.data.data;
  },

  /** AS-IS sys.Sys09_Code.selectByKindCode(ProvideContentCode, 목적코드%) */
  searchProvideContents: async (purposeCode: string): Promise<ActCodeOption[]> => {
    const res = await apiClient.get<ApiResponse<ActCodeOption[]>>('v1/act/links/provide-contents', { params: { purposeCode } });
    return res.data.data ?? [];
  },

  // ── E28 대표계정관리 (Act10_Tab_ReprAccount) ──

  /** AS-IS act.Act10_ReprAccount.selectByCompanyId: 로그인 회사. attributeCode가 '%'이면 전체, 검색어는 서버가 "%검색어%"(코드||이름, 대소문자 무시) */
  searchReprAccounts: async (attributeCode: string, searchText: string): Promise<ReprAccount[]> => {
    const res = await apiClient.get<ApiResponse<ReprAccount[]>>('v1/act/repr-accounts', { params: { attributeCode, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS act.Act10_ReprAccount.update: 추가·변경 행 → 저장된 행(요청 순서) */
  updateReprAccounts: async (rows: ReprAccount[]): Promise<ReprAccount[]> => {
    const body = rows.map(({ reprAccountId, reprAccountCode, reprAccountName, attributeCode, tgtReprAccountCode, note }) =>
      ({ reprAccountId, reprAccountCode, reprAccountName, attributeCode, tgtReprAccountCode: tgtReprAccountCode || null, note: note || null }));
    const res = await apiClient.put<ApiResponse<ReprAccount[]>>('v1/act/repr-accounts', body);
    return res.data.data ?? [];
  },

  /** AS-IS act.Act10_ReprAccount.delete → 지운 건수 */
  deleteReprAccounts: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/act/repr-accounts', { data: ids });
    return res.data.data;
  },

  /** AS-IS act.Act10_ReprAccount.insertInitData (기초데이터생성, 관리자만) → 처리한 고객사 수 */
  initReprAccounts: async (companyIds: number[], reprAccountCodes: string[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/act/repr-accounts/init-data', { companyIds, reprAccountCodes });
    return res.data.data;
  },

  // ── E31 실계정맵핑 (Act13_Tab_RealAccountMap) ──

  /** AS-IS act.Act13_RealAccountMap.selectByCompanyId: 로그인 회사, 검색어는 서버가 "%검색어%"(없으면 전체) */
  searchRealAccountMaps: async (searchText: string): Promise<RealAccountMap[]> => {
    const res = await apiClient.get<ApiResponse<RealAccountMap[]>>('v1/act/real-account-maps', { params: { searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS act.Act13_RealAccountMap.update: 추가·변경 행 → 저장된 행(요청 순서) */
  updateRealAccountMaps: async (rows: RealAccountMap[]): Promise<RealAccountMap[]> => {
    const body = rows.map(({ realAccountMapId, reprAccountCode, accountMap, realAccountCode, note }) =>
      ({ realAccountMapId, reprAccountCode, accountMap: accountMap || null, realAccountCode: realAccountCode || null, note: note || null }));
    const res = await apiClient.put<ApiResponse<RealAccountMap[]>>('v1/act/real-account-maps', body);
    return res.data.data ?? [];
  },

  /** AS-IS act.Act13_RealAccountMap.delete → 지운 건수 */
  deleteRealAccountMaps: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/act/real-account-maps', { data: ids });
    return res.data.data;
  },

  /** AS-IS act.Act13_RealAccountMap.insertInitData (기초데이터생성, 관리자만) → 처리한 고객사 수 */
  initRealAccountMaps: async (companyIds: number[], items: { reprAccountCode: string; accountMap: string | null }[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/act/real-account-maps/init-data', { companyIds, items });
    return res.data.data;
  },

  // ── E32 마감검증 체크항목 (Act15_Tab_CloseCheck) ──

  /** AS-IS act.Act15_CloseCheck.selectByText: 활성 고객사 전부, 검색어는 서버가 "%검색어%" */
  searchCloseChecks: async (searchText: string): Promise<CloseCheck[]> => {
    const res = await apiClient.get<ApiResponse<CloseCheck[]>>('v1/act/close-checks', { params: { searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS act.Act15_CloseCheck.update: 바뀐 행 → 저장된 행(요청 순서). 관리자 회사만 */
  updateCloseChecks: async (rows: CloseCheck[]): Promise<CloseCheck[]> => {
    const body = rows.map(({ companyName: _name, ...rest }) => rest);
    const res = await apiClient.put<ApiResponse<CloseCheck[]>>('v1/act/close-checks', body);
    return res.data.data ?? [];
  },

  // ── E30 거래유형별 분개맵핑 (Act11_Tab_TrJournalMap·Act11_Grid_TrJournalMap) ──

  /** AS-IS act.Act11_TrMap.selectByCompanyId: 로그인 회사, 거래코드/명·분개그룹은 서버가 "%검색어%"(없으면 전체) */
  searchTrMaps: async (searchText: string, journalGroup: string): Promise<TrMap[]> => {
    const res = await apiClient.get<ApiResponse<TrMap[]>>('v1/act/tr-maps', { params: { searchText, journalGroup } });
    return res.data.data ?? [];
  },

  /** AS-IS act.Act11_TrMap.update: 추가·변경 행 → 저장된 행(요청 순서) */
  updateTrMaps: async (rows: TrMap[]): Promise<TrMap[]> => {
    const body = rows.map(({ trMapId, trCode, journalGroup, bookIoType, plReprAccountCode, useYn, note }) =>
      ({ trMapId, trCode, journalGroup: journalGroup || null, bookIoType: bookIoType || null, plReprAccountCode: plReprAccountCode || null, useYn, note: note || null }));
    const res = await apiClient.put<ApiResponse<TrMap[]>>('v1/act/tr-maps', body);
    return res.data.data ?? [];
  },

  /** AS-IS act.Act11_TrMap.delete → 지운 건수 */
  deleteTrMaps: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/act/tr-maps', { data: ids });
    return res.data.data;
  },

  /** AS-IS act.Act11_TrMap.insertInitData (기초데이터생성, 관리자만): 고른 (거래코드, 분개그룹)과 그 분개맵핑을 고객사로 복사 → 처리한 고객사 수 */
  initTrMaps: async (companyIds: number[], items: { trCode: string; journalGroup: string | null }[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/act/tr-maps/init-data', { companyIds, items });
    return res.data.data;
  },

  /** AS-IS act.Act12_JournalMap.selectByJournalGroup: 로그인 회사 */
  searchJournalMaps: async (journalGroup: string): Promise<JournalMap[]> => {
    const res = await apiClient.get<ApiResponse<JournalMap[]>>('v1/act/journal-maps', { params: { journalGroup } });
    return res.data.data ?? [];
  },

  /** AS-IS act.Act12_JournalMap.update → 저장된 행(요청 순서) */
  updateJournalMaps: async (rows: JournalMap[]): Promise<JournalMap[]> => {
    const body = rows.map(({ journalMapId, journalGroup, seq, reprAccountCode, drcrType, formula, forFormula, note, useYn }) =>
      ({ journalMapId, journalGroup, seq, reprAccountCode: reprAccountCode || null, drcrType: drcrType || null, formula: formula || null, forFormula: forFormula || null, note: note || null, useYn }));
    const res = await apiClient.put<ApiResponse<JournalMap[]>>('v1/act/journal-maps', body);
    return res.data.data ?? [];
  },

  /** AS-IS act.Act12_JournalMap.delete → 지운 건수 */
  deleteJournalMaps: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/act/journal-maps', { data: ids });
    return res.data.data;
  },
};
