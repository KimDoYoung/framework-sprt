import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { ActRelateAppr, AccountCode, AccountCodeAdmin, AccountCodePrintSaveReq, AccountCodeSaveReq, AccountCodeTree, ActCodeOption, ActCompany, ActLink, CloseCheck, GenLedgerCloseReq, GenLedgerCloseProcessRes, JournalDtlList, JournalDtlRdReq, JournalSub, JournalSubRdReq, GenLedger, GenLedgerRdReq, JournalAccount, JournalRealAccount, GenLedgerCloseStatus, JournalBiz, JournalBizLine, JournalBizRow, JournalDtl, Journal, JournalEdit, JournalFix, JournalLine, JournalNewReq, JournalMap, JournalPayMonth, JournalSaveReq, RealAccountMap, ReprAccount, TrMap } from '../types/act';
import { AstBook } from '../types/ast';
import { readBlobError } from './file';

/** act(관리회계) 화면 API (E25~) */
export const actApi = {
  /** AS-IS act.Act03_JournalDtl.selectPayMonth — 급여 전표확인(payType = 월급여지급구분 코드) */
  searchPayMonthJournals: async (payDate: string, payType: string): Promise<JournalPayMonth[]> => {
    const res = await apiClient.get<ApiResponse<JournalPayMonth[]>>('v1/act/journal-dtls/pay-month', { params: { payDate, payType } });
    return res.data.data ?? [];
  },

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

  /** AS-IS act.Act13_RealAccountMap.getAccountName (U06): 대표계정·매핑에 연결된 실계정 이름, 없으면 빈 글자 */
  getRealAccountName: async (reprAccountCode: string, accountMap: string): Promise<string> => {
    const res = await apiClient.get<ApiResponse<string>>('v1/act/real-account-maps/account-name', { params: { reprAccountCode, accountMap } });
    return res.data.data ?? '';
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

  /** AS-IS act.Act03_JournalDtl.selectByAstId (Act02_Tab_DepositIoList, U01): 계좌의 입금(D)·출금(C) 분개 */
  searchJournalDtlsByAst: async (date: string, astId: number, drCrType: 'D' | 'C'): Promise<JournalDtl[]> => {
    const res = await apiClient.get<ApiResponse<JournalDtl[]>>('v1/act/journal-dtls/by-ast', { params: { date, astId, drCrType } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys99_Print.insertRdDepositIoList (U01) — 그리드 행을 보내 출력 자료를 만들고 그룹 ID(rdGroupId)를 받는다 */
  rdPrintDepositIo: async (rows: AstBook[]): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>('v1/act/deposit-ios/rd-print', { rows });
    return res.data.data;
  },

  /** AS-IS act.Act03_JournalDtl.selectByJournalId (Ast06_Grid_Journal, U04): 분개(차변/대변) */
  searchJournalLines: async (journalId: number): Promise<JournalLine[]> => {
    const res = await apiClient.get<ApiResponse<JournalLine[]>>('v1/act/journal-dtls/by-journal', { params: { journalId } });
    return res.data.data ?? [];
  },

  /** AS-IS act.Act02_Journal.createJournal (U04): 거래의 자동분개 생성(procType P, exceptYn true) */
  createJournal: async (trId: number, trCode: string): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/act/journals/create', { trId, trCode, procType: 'P', exceptYn: true });
  },

  /** AS-IS act.Act03_JournalDtl.selectByJournalId + act.Act06_JournalTmp.selectByJournalId (Act02_Lookup_ModiJournal, W05): 전표 머리 + 임시분개 줄 */
  getJournalEdit: async (journalId: number): Promise<JournalEdit> => {
    const res = await apiClient.get<ApiResponse<JournalEdit>>(`v1/act/journals/${journalId}/edit`);
    return res.data.data;
  },

  /** AS-IS act.Act02_Journal.updateAll (Act02_Lookup_ModiJournal, W05): 비고·거래처와 임시분개·분개장을 다시 쓴다 */
  saveJournal: async (journalId: number, req: JournalSaveReq): Promise<void> => {
    await apiClient.put<ApiResponse<void>>(`v1/act/journals/${journalId}`, req);
  },

  // ── X01 전표입력 (Act02_Tab_CreateJournal · Act02_Lookup_CreateJournal · Act02_Lookup_JournalList) ──

  /** AS-IS act.Act02_Journal.selectByDate: 국내(abroType 1)·국외(2, X07) 전표, 검색어는 거래처/적요(서버가 %…%) */
  searchJournals: async (startDate: string, closeDate: string, searchText: string, abroType: '1' | '2' = '1'): Promise<Journal[]> => {
    const res = await apiClient.get<ApiResponse<Journal[]>>('v1/act/journals', { params: { startDate, closeDate, abroType, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS act.Act02_Journal.selectById */
  getJournal: async (journalId: number): Promise<Journal> => {
    const res = await apiClient.get<ApiResponse<Journal>>(`v1/act/journals/${journalId}`);
    return res.data.data;
  },

  /** AS-IS act.Act02_Journal.updateAll (NEW): 새 전표 ID */
  createJournalNew: async (req: JournalNewReq): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/act/journals', req);
    return res.data.data;
  },

  /** AS-IS act.Act02_Journal.delete */
  deleteJournals: async (journalIds: number[]): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/act/journals/delete', { journalIds });
  },

  /** 템플릿 받기 (AS-IS downloadForm → ./excelTemplete/Template_분개장 업로드.xlsx) */
  downloadJournalTemplate: async (): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/act/journals/excel-template', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Template_분개장 업로드.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      throw await readBlobError(err);
    }
  },

  /** 엑셀업로드 1단계: act.Act08_JournalUpload.deleteByCompanyId + ExcelUpload?uploadType=journalUpload */
  uploadJournalExcel: async (file: File): Promise<void> => {
    const form = new FormData();
    form.append('excelUpload', file);
    await apiClient.post<ApiResponse<void>>('v1/act/journals/excel', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },

  /** 엑셀업로드 2단계: act.Act08_JournalUpload.journalWork */
  journalWork: async (): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/act/journals/excel/work');
  },

  // ── X02 전표승인처리 (Act02_Tab_JournalFix · Act02_Grid_JournalFix) ──

  /** AS-IS act.Act02_Journal.selectByDateAll: corpId·trCode·trOccType이 비면 서버가 '%' */
  searchJournalFixes: async (p: { startDate: string; closeDate: string; searchText: string; corpId: number | null; trCode: string | null; unFixYn: boolean; trOccType: string }): Promise<JournalFix[]> => {
    const res = await apiClient.get<ApiResponse<JournalFix[]>>('v1/act/journal-fixes', { params: { ...p, corpId: p.corpId ?? undefined, trCode: p.trCode ?? undefined } });
    return res.data.data ?? [];
  },

  /** AS-IS act.Act02_Journal.selectById (승인 정보 열 포함) */
  getJournalFix: async (journalId: number): Promise<JournalFix> => {
    const res = await apiClient.get<ApiResponse<JournalFix>>(`v1/act/journal-fixes/${journalId}`);
    return res.data.data;
  },

  /** AS-IS act.Act02_Journal.updateFixYn: procType P 승인 / C 승인취소 → 바뀐 전표 */
  confirmJournalFixes: async (procType: 'P' | 'C', journalIds: number[]): Promise<JournalFix[]> => {
    const res = await apiClient.post<ApiResponse<JournalFix[]>>('v1/act/journal-fixes/confirm', { procType, journalIds });
    return res.data.data ?? [];
  },

  // ── W05 2단계 ⓑ 연관문서 (Act80_Lookup_RelateAppr) ──

  /** AS-IS act.Act80_RelateAppr.selectByTrId·selectByJournalId: code = 'trId' | 'journalId' */
  searchRelateApprs: async (code: 'trId' | 'journalId', relateId: number): Promise<ActRelateAppr[]> => {
    const res = await apiClient.get<ApiResponse<ActRelateAppr[]>>('v1/act/relate-apprs', { params: { code, relateId } });
    return res.data.data ?? [];
  },

  /** AS-IS act.Act02_Journal.selectOneJournalIdByTrId: 거래에 걸린 전표 ID(첨부파일의 부모). 없으면 null */
  getJournalIdByTr: async (trId: number): Promise<number | null> => {
    const res = await apiClient.get<ApiResponse<number | null>>('v1/act/relate-apprs/journal-id', { params: { trId } });
    return res.data.data ?? null;
  },

  /** AS-IS act.Act80_RelateAppr.modelUpdate: 상신 문서를 거래 또는 전표에 연결 */
  addRelateAppr: async (req: { apprId: number; trId?: number | null; journalId?: number | null }): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/act/relate-apprs', req);
  },

  /** AS-IS act.Act80_RelateAppr.delete: 연결 제거 */
  deleteRelateApprs: async (relateApprIds: number[]): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/act/relate-apprs/delete', { relateApprIds });
  },

  /** AS-IS act.Act04_GenLedger.checkClose (U04): 마감이면 AS-IS 메시지로 실패 */
  checkLedgerClose: async (stdDate: string): Promise<void> => {
    await apiClient.get<ApiResponse<void>>('v1/act/gen-ledgers/close-check', { params: { stdDate } });
  },

  // ── U10 급여/카드 회계처리 (Act02_Tab_CreateJournalBiz) ──

  /** AS-IS act.Act02_Journal.selectMonthBiz: stdMonth = "yyyy.MM" */
  searchJournalBizs: async (stdMonth: string): Promise<JournalBiz[]> => {
    const res = await apiClient.get<ApiResponse<JournalBiz[]>>('v1/act/journal-bizs', { params: { stdMonth } });
    return res.data.data ?? [];
  },

  /** AS-IS act.Act03_JournalDtl.selectBizCard·selectChargeFee·selectErpChargeFee·selectByJournalId — 고른 행의 거래 코드로 서버가 가른다 */
  searchJournalBizLines: async (stdMonth: string, row: JournalBizRow): Promise<JournalBizLine[]> => {
    const res = await apiClient.get<ApiResponse<JournalBizLine[]>>('v1/act/journal-bizs/lines', {
      params: { stdMonth, trCode: row.trCode || undefined, note: row.note || undefined, date: row.date || undefined, journalId: row.journalId ?? undefined },
    });
    return res.data.data ?? [];
  },

  /** AS-IS act.Act02_Journal.createJournalBiz */
  createJournalBizs: async (stdMonth: string, rows: JournalBizRow[]): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/act/journal-bizs/create', { stdMonth, rows });
  },

  /** AS-IS act.Act02_Journal.deleteJournalBiz */
  deleteJournalBizs: async (stdMonth: string, rows: JournalBizRow[]): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/act/journal-bizs/delete', { stdMonth, rows });
  },

  // ── X14 회계마감 (Act04_Tab_Close) ──

  /** AS-IS act.Act04_GenLedger.selectCloseStatus: 로그인 회사, 연도의 월별 마감현황 */
  searchGenLedgerCloses: async (year: string): Promise<GenLedgerCloseStatus[]> => {
    const res = await apiClient.get<ApiResponse<GenLedgerCloseStatus[]>>('v1/act/gen-ledger-closes', { params: { year } });
    return res.data.data ?? [];
  },

  /** AS-IS act.Act04_GenLedger.insertClose: procType P 회계마감 · C 마감취소 · A 마감검증. 검증 실패도 200으로 status -1 + notes */
  processGenLedgerClose: async (req: GenLedgerCloseReq): Promise<GenLedgerCloseProcessRes> => {
    const res = await apiClient.post<ApiResponse<GenLedgerCloseProcessRes>>('v1/act/gen-ledger-closes/process', req);
    return res.data.data;
  },

  // ── X15 분개장 (Act02_Tab_Journal) ──

  /** AS-IS act.Act03_JournalDtl.selectByCompanyId: corpId 없으면 전체, 검색어는 서버가 "%…%", trCode 없으면 전체, abroType 0 전체 · 1 국내 · 2 국외 */
  searchJournalDtlList: async (params: { startDate: string; closeDate: string; corpId?: number | null; searchText?: string; trCode?: string | null; abroType?: string }): Promise<JournalDtlList[]> => {
    const res = await apiClient.get<ApiResponse<JournalDtlList[]>>('v1/act/journal-dtls', {
      params: { startDate: params.startDate, closeDate: params.closeDate, corpId: params.corpId ?? undefined, searchText: params.searchText || undefined, trCode: params.trCode ?? undefined, abroType: params.abroType ?? '0' },
    });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys99_Print.insertRdJournal: journalIds가 비면 조건 전체, 있으면 그 전표만 → 출력그룹ID */
  insertJournalDtlRd: async (req: JournalDtlRdReq): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/act/journal-dtls/rd', req);
    return res.data.data;
  },

  // ── X17 계정별원장 (Act02_Tab_JournalSub) ──

  /** AS-IS act.Act03_JournalDtl.selectByAccountCode: 계정과 하위 계정, 첫 줄은 전월이월. corpId·depositId 없으면 전체, 검색어는 서버가 "%…%" */
  searchJournalSubs: async (params: { startDate: string; closeDate: string; accountCode: string; trCode?: string | null; corpId?: number | null; depositId?: number | null; searchText?: string }): Promise<JournalSub[]> => {
    const res = await apiClient.get<ApiResponse<JournalSub[]>>('v1/act/journal-dtls/by-account', {
      params: { ...params, trCode: params.trCode ?? undefined, corpId: params.corpId ?? undefined, depositId: params.depositId ?? undefined, searchText: params.searchText || undefined },
    });
    return res.data.data ?? [];
  },

  /** AS-IS act.Act02_Journal.getAccountCode: 기간에 분개가 있는 계정 (엑셀다운로드 전 데이터 유무 판정) */
  searchJournalAccountCodes: async (startDate: string, closeDate: string): Promise<JournalAccount[]> => {
    const res = await apiClient.get<ApiResponse<JournalAccount[]>>('v1/act/journal-dtls/account-codes', { params: { startDate, closeDate } });
    return res.data.data ?? [];
  },

  /** AS-IS act.Act13_RealAccountMap.selectByAstClassTreeId: 관리계좌(종목분류)의 실계정, 없으면 null */
  getJournalRealAccount: async (classTreeId: number): Promise<JournalRealAccount | null> => {
    const res = await apiClient.get<ApiResponse<JournalRealAccount | null>>('v1/act/journal-dtls/real-account', { params: { classTreeId } });
    return res.data.data ?? null;
  },

  /** AS-IS sys.Sys99_Print.insertRdJournalSub → 출력그룹ID */
  insertJournalSubRd: async (req: JournalSubRdReq): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/act/journal-dtls/by-account/rd', req);
    return res.data.data;
  },

  /** 엑셀다운로드 (AS-IS ExcelDownload act02List, .xls → .xlsx) — accountCode 없으면 기간 중 모든 계정 */
  downloadJournalSubExcel: async (startDate: string, closeDate: string, accountCode?: string | null): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/act/journal-dtls/by-account/excel', { params: { startDate, closeDate, accountCode: accountCode ?? undefined }, responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `계정별원장(${startDate}~${closeDate}).xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      throw await readBlobError(err);
    }
  },

  // ── X18 계정원장 (Act04_Tab_GenLedger) ──

  /** AS-IS act.Act04_GenLedger.selectByStdDate1(월별 1·분기별 3) / selectByStdDate2(일별 2) — 검색어는 서버가 "%…%" */
  searchGenLedgers: async (stdDate: string, diffType: string, searchText?: string): Promise<GenLedger[]> => {
    const res = await apiClient.get<ApiResponse<GenLedger[]>>('v1/act/gen-ledgers', { params: { stdDate, diffType, searchText: searchText || undefined } });
    return res.data.data ?? [];
  },

  /** AS-IS act.Act04_GenLedger.selectByAccountCode — 계정과 하위 계정(전위 순서, level) */
  searchGenLedgersByAccount: async (stdDate: string, accountCode: string): Promise<GenLedger[]> => {
    const res = await apiClient.get<ApiResponse<GenLedger[]>>('v1/act/gen-ledgers/by-account', { params: { stdDate, accountCode } });
    return res.data.data ?? [];
  },

  /** AS-IS act.Act04_GenLedger.summaryGenLedger — 계정원장 정리(DB 함수) */
  summaryGenLedger: async (startDate: string, closeDate: string): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/act/gen-ledgers/summary', { startDate, closeDate });
  },

  /** AS-IS sys.Sys99_Print.insertRdGenLedger → 출력그룹ID */
  insertGenLedgerRd: async (req: GenLedgerRdReq): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/act/gen-ledgers/rd', req);
    return res.data.data;
  },
};
