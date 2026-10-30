import { apiClient } from './client';
import { ApiResponse, PageRes } from '../types/auth';
import { SettleAccrued, SettleExpense, SettleHistory, SettleSaveReq } from '../types/ast';
import {
  AstCf,
  AstCfBatchCreateReq,
  AstCfInfo,
  AstCfInfoSaveReq,
  AstCfSaveReq,
  AstClassTree,
  AstClassTreeItem,
  AstClassTreeSaveReq,
  AstDetail,
  AstItemClassUpdateReq,
  AstItemDetail,
  AstItemDetailSaveReq,
  AstBook,
  AstBookPeriod,
  AstBookSum,
  AstCorpAccount,
  AstTr,
  AstTrCodeByWindow,
  AstTr4InsureLedger,
  AstTr4InsureSaveReq,
  AstTrTaxLedger,
  AstTrTaxSaveReq,
  AstItemTreeNode,
  AstManager,
  AstManagerSaveReq,
  AstRelateAppr,
  TrCode,
  TrCodeWindow,
} from '../types/ast';

/** ast(자산) API (E21 자산상세 항목관리, E29 거래유형 등록) */
export const astApi = {
  /** AS-IS ast.Ast01_ClassTree.selectByCompanyId (Apr01_Tab_ItemDocument, F07): 종목별 문서검색 트리. assetType 1 고유자산·2 운용자산(펀드자산) */
  searchItemTree: async (assetType: string): Promise<AstItemTreeNode[]> => {
    const res = await apiClient.get<ApiResponse<AstItemTreeNode[]>>('v1/ast/class-trees/item-doc', { params: { assetType } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast02_Detail.selectByCompanyId0: 공통 회사(0) 전용 — 서버가 "%검색어%"로 감싼다 */
  searchDetails: async (searchText: string, useYn: boolean): Promise<AstDetail[]> => {
    const res = await apiClient.get<ApiResponse<AstDetail[]>>('v1/ast/details', { params: { searchText, useYn } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast02_Detail.update → 저장된 행(요청 순서) */
  saveDetails: async (rows: AstDetail[]): Promise<AstDetail[]> => {
    const body = rows.map(({ detailId, seq, title, tag, useYn }) => ({ detailId, seq, title, tag, useYn }));
    const res = await apiClient.put<ApiResponse<AstDetail[]>>('v1/ast/details', body);
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast02_Detail.delete → 지운 건수 */
  deleteDetails: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/ast/details', { data: ids });
    return res.data.data ?? 0;
  },

  // ── E29 거래유형 등록(관리자) (Ast05_Tab_TrCodeAdmin) ──

  /** AS-IS ast.Ast05_TrCode.selectByCompanyId: 로그인 회사, 서버가 "%검색어%"로 감싼다 */
  searchTrCodes: async (searchText: string, useYn: boolean): Promise<TrCode[]> => {
    const res = await apiClient.get<ApiResponse<TrCode[]>>('v1/ast/tr-codes', { params: { searchText, useYn } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast05_TrCode.selectBySearchText (Ast05_Lookup_TrCode): 로그인 회사, 사용 중인 코드만. rcvPayCode '%'는 전체, 서버가 검색어를 "%…%"로 감싼다 */
  lookupTrCodes: async (searchText: string, rcvPayCode: string, assetType: string, financeYn?: boolean | null): Promise<TrCode[]> => {
    const res = await apiClient.get<ApiResponse<TrCode[]>>('v1/ast/tr-codes/lookup', { params: { searchText, rcvPayCode, assetType, financeYn: financeYn ?? undefined } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast05_TrCode.update → 저장된 행(요청 순서) */
  updateTrCodes: async (rows: TrCode[]): Promise<TrCode[]> => {
    const body = rows.map(({ trCodeId, trCode, trName, rcvPayCode, trOccType, itemClassGroupCode, financeYn, lockYn, useYn, note }) =>
      ({ trCodeId, trCode, trName, rcvPayCode, trOccType, itemClassGroupCode, financeYn, lockYn, useYn, note }));
    const res = await apiClient.put<ApiResponse<TrCode[]>>('v1/ast/tr-codes', body);
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast05_TrCode.delete → 지운 건수 */
  deleteTrCodes: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/ast/tr-codes', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS ast.Ast05_TrCode.insertInitData (관리자만) → 처리한 고객사 수 */
  initTrCodes: async (companyIds: number[], trCodes: string[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/ast/tr-codes/init-data', { companyIds, trCodes });
    return res.data.data ?? 0;
  },

  // ── E29 화면별 거래유형 등록 (Ast15_Lookup_TrCodeWindow·Ast15_Page_TrCodeWindow) ──

  /** AS-IS ast.Ast15_TrCodeWindow.selectByAll: 그 운용사에 등록한 화면. companyId는 관리자 회사만 지정 */
  searchTrCodeWindows: async (companyId?: number | null): Promise<TrCodeWindow[]> => {
    const res = await apiClient.get<ApiResponse<TrCodeWindow[]>>('v1/ast/tr-code-windows', { params: { companyId: companyId ?? undefined } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast15_TrCodeWindow.selectByClassName: 그 화면에 지정된 거래코드 */
  searchAssignedTrCodes: async (className: string, companyId?: number | null): Promise<TrCodeWindow[]> => {
    const res = await apiClient.get<ApiResponse<TrCodeWindow[]>>('v1/ast/tr-code-windows/assigned', { params: { className, companyId: companyId ?? undefined } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast15_TrCodeWindow.getTrCode: 그 화면에 아직 지정되지 않은 거래코드 */
  searchUnassignedTrCodes: async (className: string, companyId?: number | null): Promise<TrCodeWindow[]> => {
    const res = await apiClient.get<ApiResponse<TrCodeWindow[]>>('v1/ast/tr-code-windows/unassigned', { params: { className, companyId: companyId ?? undefined } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast15_TrCodeWindow.modelUpdate: 화면 한 행 등록 */
  addTrCodeWindow: async (windowClassName: string, companyId?: number | null): Promise<TrCodeWindow> => {
    const res = await apiClient.post<ApiResponse<TrCodeWindow>>('v1/ast/tr-code-windows', { windowClassName, companyId: companyId ?? null });
    return res.data.data as TrCodeWindow;
  },

  /** AS-IS ast.Ast15_TrCodeWindow.insert: 그 화면의 거래코드 지정을 왼쪽 그리드 내용으로 바꾼다 → 넣은 건수 */
  saveTrCodeWindow: async (className: string, items: { trCode: string; note?: string | null }[], companyId?: number | null): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/ast/tr-code-windows', { companyId: companyId ?? null, className, items });
    return res.data.data ?? 0;
  },

  /** AS-IS ast.Ast15_TrCodeWindow.delete → 지운 건수 */
  deleteTrCodeWindows: async (ids: number[], companyId?: number | null): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/ast/tr-code-windows', { data: ids, params: { companyId: companyId ?? undefined } });
    return res.data.data ?? 0;
  },

  // ── R08 펀드자산 종목기본 (Ast01_Tab_ClassTreeManagement) ──

  /** 자산분류 전체 트리 조회 */
  searchClassTree: async (params?: { typeCode?: string; assetType?: string }): Promise<AstClassTree[]> => {
    const res = await apiClient.get<ApiResponse<AstClassTree[]>>('v1/ast/class-trees', { params });
    return res.data.data ?? [];
  },

  /** 우측 종목 상세 목록 */
  searchClassTreeItems: async (parentId: number, typeCode?: string, searchText?: string): Promise<AstClassTreeItem[]> => {
    const res = await apiClient.get<ApiResponse<AstClassTreeItem[]>>(`v1/ast/class-trees/${parentId}/items`, {
      params: { typeCode, searchText },
    });
    return res.data.data ?? [];
  },

  /** 분류 1건 (W01 추가정보·C/F 칸이 그리드 행으로 팝업을 열 때) */
  getClassTree: async (id: number): Promise<AstClassTree> => {
    const res = await apiClient.get<ApiResponse<AstClassTree>>(`v1/ast/class-trees/${id}`);
    return res.data.data;
  },

  /** 가져오기 (W01 Ast01_Tab_ClassTreeIntrinsic.pullData) — 대상 회사의 고유자산 분류를 내 회사로 복사. 회사관리자만 */
  pullClassTreeData: async (targetCompanyId: number): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/ast/class-trees/pull-data', null, { params: { targetCompanyId } });
  },

  /** 코드 채번 */
  createCode: async (parentId: number | null, typeCode: string): Promise<string> => {
    const res = await apiClient.get<ApiResponse<string>>('v1/ast/class-trees/create-code', {
      params: { parentId, typeCode },
    });
    return res.data.data ?? '';
  },

  /** 분류 등록 */
  createClassTree: async (req: AstClassTreeSaveReq): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/ast/class-trees', req);
    return res.data.data ?? 0;
  },

  /** 분류 수정 */
  updateClassTree: async (id: number, req: AstClassTreeSaveReq): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>(`v1/ast/class-trees/${id}`, req);
    return res.data.data ?? 0;
  },

  /** 우측 종목 그리드 일괄 저장 */
  saveClassTreeItems: async (parentId: number, items: AstClassTreeSaveReq[]): Promise<void> => {
    await apiClient.put<ApiResponse<void>>(`v1/ast/class-trees/${parentId}/items`, items);
  },

  /** 상위분류 변경 (이동) */
  moveClassTree: async (id: number, parentId: number): Promise<void> => {
    await apiClient.put<ApiResponse<void>>(`v1/ast/class-trees/${id}/move`, null, { params: { parentId } });
  },

  /** 추가정보 설정 (Ast01_Lookup_ItemClass) */
  updateItemClass: async (id: number, req: AstItemClassUpdateReq): Promise<void> => {
    await apiClient.put<ApiResponse<void>>(`v1/ast/class-trees/${id}/item-class`, req);
  },

  /** 분류/종목 삭제 */
  deleteClassTree: async (id: number): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`v1/ast/class-trees/${id}`);
  },

  /** 담당자 목록 조회 */
  searchManagers: async (linkId: number): Promise<AstManager[]> => {
    const res = await apiClient.get<ApiResponse<AstManager[]>>(`v1/ast/managers/${linkId}`);
    return res.data.data ?? [];
  },

  /** 담당자 일괄 저장 */
  saveManagers: async (linkId: number, managers: AstManagerSaveReq[]): Promise<void> => {
    await apiClient.put<ApiResponse<void>>(`v1/ast/managers/${linkId}`, managers);
  },

  /** 담당자 삭제 */
  deleteManagers: async (ids: number[]): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>('v1/ast/managers', { params: { ids } });
  },

  // ── R09 종목상세 / 현금흐름표 API ──

  /** 종목별 자산상세 항목 조회 (Ast02_Grid_DetailManagement) */
  getItemDetails: async (classTreeId: number): Promise<AstItemDetail[]> => {
    const res = await apiClient.get<ApiResponse<AstItemDetail[]>>('v1/ast/details/by-tree', { params: { classTreeId } });
    return res.data.data ?? [];
  },

  /** 기본 항목 템플릿 검색 (Ast02_Lookup_Detail) */
  searchItemDetailTemplates: async (searchText?: string): Promise<AstItemDetail[]> => {
    const res = await apiClient.get<ApiResponse<AstItemDetail[]>>('v1/ast/details/templates', { params: { searchText: searchText ?? '' } });
    return res.data.data ?? [];
  },

  /** 기본 항목 템플릿 저장 (Ast02_Lookup_Detail) */
  saveItemDetailTemplates: async (rows: AstDetail[]): Promise<AstDetail[]> => {
    const res = await apiClient.put<ApiResponse<AstDetail[]>>('v1/ast/details/templates', rows);
    return res.data.data ?? [];
  },

  /** 기본 항목 템플릿 삭제 (Ast02_Lookup_Detail) */
  deleteItemDetailTemplates: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/ast/details/templates', { data: ids });
    return res.data.data ?? 0;
  },

  /** 종목 자산상세 항목 일괄 저장 */
  saveItemDetails: async (rows: AstItemDetailSaveReq[]): Promise<AstItemDetail[]> => {
    const res = await apiClient.put<ApiResponse<AstItemDetail[]>>('v1/ast/details/items', rows);
    return res.data.data ?? [];
  },

  /** 종목 자산상세 항목 삭제 */
  deleteItemDetails: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/ast/details/items', { data: ids });
    return res.data.data ?? 0;
  },

  /** 현금흐름표 기본구분 목록 조회 (Ast03_Lookup_CfInfo) */
  getCfInfoList: async (astClassTreeId: number): Promise<AstCfInfo[]> => {
    const res = await apiClient.get<ApiResponse<AstCfInfo[]>>('v1/ast/cf-infos', { params: { astClassTreeId } });
    return res.data.data ?? [];
  },

  /** 현금흐름표 기본구분 일괄 저장 */
  saveCfInfoList: async (rows: AstCfInfoSaveReq[]): Promise<AstCfInfo[]> => {
    const res = await apiClient.put<ApiResponse<AstCfInfo[]>>('v1/ast/cf-infos', rows);
    return res.data.data ?? [];
  },

  /** 현금흐름표 기본구분 삭제 */
  deleteCfInfo: async (id: number): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/ast/cf-infos/${id}`);
    return res.data.data ?? 0;
  },

  /** 현금흐름표 상세 일정 목록 조회 */
  getCfList: async (cfInfoId: number): Promise<AstCf[]> => {
    const res = await apiClient.get<ApiResponse<AstCf[]>>('v1/ast/cfs', { params: { cfInfoId } });
    return res.data.data ?? [];
  },

  /** 현금흐름표 상세 일정 일괄 저장 */
  saveCfList: async (rows: AstCfSaveReq[]): Promise<AstCf[]> => {
    const res = await apiClient.put<ApiResponse<AstCf[]>>('v1/ast/cfs', rows);
    return res.data.data ?? [];
  },

  /** 현금흐름표 상세 일정 삭제 */
  deleteCf: async (id: number): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/ast/cfs/${id}`);
    return res.data.data ?? 0;
  },

  /** 현금흐름표 일괄생성 (Ast03_Lookup_CfAutoCreate) */
  batchCreateCf: async (req: AstCfBatchCreateReq): Promise<AstCf[]> => {
    const res = await apiClient.post<ApiResponse<AstCf[]>>('v1/ast/cf-infos/batch-create', req);
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast09_Book.selectByHoldDate (Act02_Tab_DepositIoList, U01): astType 1(예금) 기준일 현재 예금원장 */
  searchDeposits: async (holdDate: string): Promise<AstBook[]> => {
    const res = await apiClient.get<ApiResponse<AstBook[]>>('v1/ast/books/deposits', { params: { holdDate } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast09_Book.selectDepositCurGroupSum (U01): 통화별 합계 */
  searchDepositCurSums: async (holdDate: string): Promise<AstBookSum[]> => {
    const res = await apiClient.get<ApiResponse<AstBookSum[]>>('v1/ast/books/deposits/cur-sums', { params: { holdDate } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast09_Book.createDepositBook (U01): 기준일부터 오늘까지 예금잔고정리 — 실패는 오류 메시지로 던진다 */
  cleanDepositBook: async (stdDate: string): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('v1/ast/books/deposits/clean', { stdDate });
  },

  /** AS-IS ast.Ast80_RelateAppr.selectByCompanyId (U01): 일자·링크코드의 상신 문서. 한 건이 아니면 null(미상신) */
  getRelateAppr: async (date: string, linkCode: string): Promise<AstRelateAppr | null> => {
    const res = await apiClient.get<ApiResponse<AstRelateAppr | null>>('v1/ast/relate-apprs', { params: { date, linkCode } });
    return res.data.data ?? null;
  },

  /** AS-IS ast.Ast80_RelateAppr.insert (U01): 같은 일자·링크코드가 있으면 지우고 새로 만든다 → 새 relateApprId */
  createRelateAppr: async (date: string, linkCode: string): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/ast/relate-apprs', { date, linkCode });
    return res.data.data;
  },

  /** AS-IS ast.Ast80_RelateAppr.updateApprId (U01): 상신한 문서 ID 기록 */
  updateRelateApprId: async (relateApprId: number, apprId: number): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>(`v1/ast/relate-apprs/${relateApprId}/appr-id`, { apprId });
    return res.data.data;
  },

  /** AS-IS ast.Ast09_Book.selectByHoldDatePeriod (Ast09_Tab_DepositBookPeriod, U02): 기간 예금잔고(전일 대비 증감 포함). depositId 없으면 전체 — 서버가 내 sys99_print 자료를 다시 만든다 */
  searchDepositsPeriod: async (startDate: string, closeDate: string, depositId: number | null, searchText: string): Promise<AstBookPeriod[]> => {
    const res = await apiClient.get<ApiResponse<AstBookPeriod[]>>('v1/ast/books/deposits/period', { params: { startDate, closeDate, depositId: depositId ?? undefined, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast01_ClassTree.selectCorpAccount (Ast01_Lookup_CorpAccount, U02): 계좌선택 */
  searchCorpAccounts: async (stdDate: string, searchText: string, prePayOnly?: boolean, corpId?: number | null): Promise<AstCorpAccount[]> => {
    const res = await apiClient.get<ApiResponse<AstCorpAccount[]>>('v1/ast/corp-accounts', { params: { stdDate, searchText, prePayOnlyYn: prePayOnly || undefined, corpId: corpId ?? undefined } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast05_TrCode.selectByWindowClassName (Ast05_Lookup_TrCodeWindow, U04): 그 화면에 지정된 사용 중인 거래유형. rcvPayCode 비면 전체 */
  lookupTrCodesByWindow: async (windowClassName: string, searchText: string, rcvPayCode: string): Promise<AstTrCodeByWindow[]> => {
    const res = await apiClient.get<ApiResponse<AstTrCodeByWindow[]>>('v1/ast/tr-codes/by-window', { params: { windowClassName, searchText, rcvPayCode } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast06_Tr.selectTaxTr (Ast06_Tab_TrTax, U04): 기간·거래코드(없으면 전체)의 세금/4대보험 거래 */
  searchTaxTrs: async (startDate: string, closeDate: string, trCode: string | null): Promise<AstTr[]> => {
    const res = await apiClient.get<ApiResponse<AstTr[]>>('v1/ast/trs/tax', { params: { startDate, closeDate, trCode: trCode ?? undefined } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast06_Tr.selectById (U04): 저장·분개생성 뒤 한 건 다시 읽기 */
  getTr: async (trId: number): Promise<AstTr> => {
    const res = await apiClient.get<ApiResponse<AstTr>>(`v1/ast/trs/${trId}`);
    return res.data.data;
  },

  /** AS-IS ast.Ast06_Tr.updateTax (U04): 원천세·부가세 거래 저장 → 저장한 거래 ID */
  saveTaxTr: async (req: AstTrTaxSaveReq): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/ast/trs/tax', req);
    return res.data.data;
  },

  /** AS-IS ast.Ast06_Tr.update4Insure (U04): 4대보험 거래 저장 → 저장한 거래 ID */
  save4InsureTr: async (req: AstTr4InsureSaveReq): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/ast/trs/4insure', req);
    return res.data.data;
  },

  /** AS-IS ast.Ast06_Tr.delete (U04): 회계마감 검사 뒤 거래·분개·상세 삭제 */
  deleteTrs: async (trIds: number[]): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/ast/trs/delete', { trIds });
  },

  /** AS-IS ast.Ast06_Tr.updateApprId (U04): 상신한 문서 ID 기록 */
  updateTrApprId: async (trId: number, apprId: number): Promise<void> => {
    await apiClient.put<ApiResponse<void>>(`v1/ast/trs/${trId}/appr`, { apprId });
  },

  /** AS-IS ast.Ast20_TrTax.selectGenLedgerTax (U04): 총계정원장의 예수금·부가세 잔액 */
  getTaxGenLedger: async (date: string, trCode: string): Promise<AstTrTaxLedger | null> => {
    const res = await apiClient.get<ApiResponse<AstTrTaxLedger | null>>('v1/ast/tr-taxes/gen-ledger', { params: { date, trCode } });
    return res.data.data ?? null;
  },

  /** AS-IS ast.Ast21_Tr4Insure.selectGenLedgerInsure (U04): 총계정원장의 보험 예수금 잔액 */
  getInsureGenLedger: async (date: string): Promise<AstTr4InsureLedger | null> => {
    const res = await apiClient.get<ApiResponse<AstTr4InsureLedger | null>>('v1/ast/tr-4insures/gen-ledger', { params: { date } });
    return res.data.data ?? null;
  },

  // ── U11 미수/미지급 결제 (Pay50_Tab_ExpenseSettle) ──

  /** AS-IS ast.Ast06_Tr.selectByAccrued (고유자산·국내·지급): corpId가 없으면 전체 */
  searchSettleAccrueds: async (p: { corpId?: number | null; searchText: string; trCode: string }): Promise<SettleAccrued[]> => {
    const res = await apiClient.get<ApiResponse<SettleAccrued[]>>('v1/ast/settles/accrueds', { params: { corpId: p.corpId ?? undefined, searchText: p.searchText, trCode: p.trCode } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast07_Settle.selectByHistoryPaging — selectType 1·3 최근 20건 / 2 조회조건(쪽 나누기) */
  searchSettleHistories: async (p: { assetType: string; selectType: string; payCode: string; trCode: string; corpId: string; searchText: string; limit: number; offset: number }): Promise<PageRes<SettleHistory>> => {
    const res = await apiClient.get<ApiResponse<PageRes<SettleHistory>>>('v1/ast/settles/histories', { params: p });
    return res.data.data;
  },

  /** AS-IS pay.Pay50_Expense.selectById 중 결제등록 창이 쓰는 값 */
  getSettleExpense: async (expenseId: number): Promise<SettleExpense> => {
    const res = await apiClient.get<ApiResponse<SettleExpense>>('v1/ast/settles/expense-info', { params: { expenseId } });
    return res.data.data;
  },

  /** AS-IS ast.Ast07_Settle.update (새 결제) → 새 결제 ID */
  createSettle: async (req: SettleSaveReq): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/ast/settles', req);
    return res.data.data;
  },

  /** AS-IS ast.Ast07_Settle.updateMulti (일괄 결제등록) */
  createSettleMulti: async (settleDate: string, depositId: number, rows: SettleAccrued[]): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/ast/settles/multi', {
      settleDate, depositId, rows: rows.map(r => ({ trId: r.trId, trCode: r.trCode, rcvPayCode: r.rcvPayCode, accruedAmt: r.accruedAmt, note: r.note })),
    });
  },

  /** AS-IS ast.Ast07_Settle.delete (취소) */
  deleteSettles: async (settleIds: number[]): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/ast/settles/delete', { settleIds });
  },
};
