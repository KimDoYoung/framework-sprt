import { apiClient } from './client';
import { readBlobError } from './file';
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
  AstTrCodeTreeNode,
  AstHoldBook,
  AstForeignDeposit,
  AstTrFinance,
  AstTrFinanceSaveReq,
  AstDepositIntSaveReq,
  AstEval,
  AstEvalItem,
  AstPrice,
  AstPrc,
  InvestLimit,
  InvestLimitDate,
  OwnerCapital,
  AstTr4InsureLedger,
  AstTr4InsureSaveReq,
  AstTrTaxLedger,
  AstTrTaxSaveReq,
  AstItemTreeNode,
  AstManager,
  AstManagerSaveReq,
  AstRelateAppr,
  AstDepositDiff,
  AstBookReal,
  TrCode,
  TrCodeWindow,
  AstDepn,
  AstNonDeductTax,
  AstFinanceBook,
  AstFinanceOpr,
  AstFinanceOprTr,
  AstInvestAssetLimit,
  AstOwnerCapitalMax,
  AstFinanceGroup,
  AstOfficeAsset,
  AstDepnBook,
  AstDepnBookGroup,
  AstOfficeAssetGroup,
  AstCodeName,
  AstExpenseTr,
  AstOfficeTrRow,
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

  /** AS-IS ast.Ast09_Book.selectByHoldDate (W21 Ast09_Tab_DepositBook): astType 1 + depositDiffYn true, searchText는 글자만(서버가 %로 감싼다) */
  searchDepositDiffs: async (holdDate: string, searchText: string): Promise<AstDepositDiff[]> => {
    const res = await apiClient.get<ApiResponse<AstDepositDiff[]>>('v1/ast/books/deposits/diffs', { params: { holdDate, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast12_BookReal.selectByHoldDate (W21 Ast12_Lookup_RealDeposit): 예금 계좌 전부 + 그날의 실제잔고 */
  searchBookReals: async (holdDate: string, searchText: string): Promise<AstBookReal[]> => {
    const res = await apiClient.get<ApiResponse<AstBookReal[]>>('v1/ast/book-reals', { params: { holdDate, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast12_BookReal.update (W21): 고친 행 → 다시 읽은 행들(요청 순서) */
  saveBookReals: async (holdDate: string, rows: AstBookReal[]): Promise<AstBookReal[]> => {
    const body = rows.map(r => ({ bookRealId: r.bookRealId, astClassTreeId: r.astClassTreeId, curCode: r.curCode, realAmt: r.realAmt, realForAmt: r.realForAmt, note: r.note }));
    const res = await apiClient.put<ApiResponse<AstBookReal[]>>('v1/ast/book-reals', body, { params: { holdDate } });
    return res.data.data ?? [];
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

  // ── W05 청약처리 (Ast06_Tab_TrIPO) ──

  /** AS-IS ast.Ast06_Tr.selectByPayCode (W05): 기간·거래유형·계좌·종목·검색어의 금융상품 거래. 0·빈 값은 조건 없음 */
  searchTrFinances: async (params: { startDate: string; closeDate: string; windowClassName: string; assetType?: string; abroType?: string; accountId?: number | null; classTreeId?: number | null; trCodeId?: number | null; searchText?: string }): Promise<AstTrFinance[]> => {
    const res = await apiClient.get<ApiResponse<AstTrFinance[]>>('v1/ast/trs/finance', { params: { ...params, accountId: params.accountId ?? undefined, classTreeId: params.classTreeId ?? undefined, trCodeId: params.trCodeId ?? undefined } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast06_Tr.selectById (W05): 저장·분개생성 뒤 한 건 다시 읽기 */
  getTrFinance: async (trId: number): Promise<AstTrFinance> => {
    const res = await apiClient.get<ApiResponse<AstTrFinance>>(`v1/ast/trs/finance/${trId}`);
    return res.data.data;
  },

  /** AS-IS sys.Sys00_Common.selectForDeposit (W07): 외화 거래 편집창의 예금계좌 콤보 */
  getForeignDeposits: async (): Promise<AstForeignDeposit[]> => {
    const res = await apiClient.get<ApiResponse<AstForeignDeposit[]>>('v1/ast/trs/finance/foreign-deposits');
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast06_Tr.updateFinance (W05): 금융상품 거래 저장 → 저장한 거래 ID */
  saveTrFinance: async (req: AstTrFinanceSaveReq): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/ast/trs/finance', req);
    return res.data.data;
  },

  /** AS-IS ast.Ast06_Tr.updateDepositInt (W23): 예금/예치금 이자수령 저장 → 저장한 거래 ID */
  saveDepositInt: async (req: AstDepositIntSaveReq): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/ast/trs/finance/deposit-int', req);
    return res.data.data;
  },

  /** 엑셀다운로드 (AS-IS ExcelDownload ast06IpoList, W05) — 조회 조건 그대로, 브라우저 저장 */
  downloadIpoExcel: async (params: { startDate: string; closeDate: string; accountId?: number | null; classTreeId?: number | null; trCodeId?: number | null; searchText?: string }): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/ast/trs/finance/ipo-excel', { params: { ...params, accountId: params.accountId ?? undefined, classTreeId: params.classTreeId ?? undefined, trCodeId: params.trCodeId ?? undefined }, responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `공모주청약(${params.startDate} ~ ${params.closeDate}).xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      throw await readBlobError(err);
    }
  },

  /** 엑셀다운로드 (AS-IS ExcelDownload ast06FinanceList, W06) — 조회 조건 그대로, 브라우저 저장 */
  downloadFinanceExcel: async (params: { startDate: string; closeDate: string; accountId?: number | null; classTreeId?: number | null; trCodeId?: number | null; searchText?: string }): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/ast/trs/finance/finance-excel', { params: { ...params, accountId: params.accountId ?? undefined, classTreeId: params.classTreeId ?? undefined, trCodeId: params.trCodeId ?? undefined }, responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `금융상품거래처리(${params.startDate} ~ ${params.closeDate}).xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      throw await readBlobError(err);
    }
  },

  /** AS-IS ast.Ast09_Book.selectByHoldDate (Ast09_Lookup_Book, W06): 보유일 현재 금융자산 보유원장. abroType 1 국내·2 국외 */
  searchHolds: async (holdDate: string, abroType: string, searchText: string): Promise<AstHoldBook[]> => {
    const res = await apiClient.get<ApiResponse<AstHoldBook[]>>('v1/ast/books/holds', { params: { holdDate, abroType, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast01_ClassTree.selectByTrCode (Ast01_Lookup_Info, W05): 거래유형에 맞는 종목 트리 */
  searchClassTreeByTrCode: async (trCode: string | null, itemLClass: string | null, abroType: string | null, assetType: string): Promise<AstTrCodeTreeNode[]> => {
    const res = await apiClient.get<ApiResponse<AstTrCodeTreeNode[]>>('v1/ast/class-trees/by-tr-code', { params: { trCode: trCode ?? undefined, itemLClass: itemLClass ?? undefined, abroType: abroType ?? undefined, assetType } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast01_ClassTree.insertIpo (Ast06_Lookup_CreateIpoAstClass, W05): IPO 종목정보 생성 → 만든 종목 */
  createIpoClass: async (classTreeName: string): Promise<AstClassTree> => {
    const res = await apiClient.post<ApiResponse<AstClassTree>>('v1/ast/class-trees/ipo', { classTreeName });
    return res.data.data;
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

  // ==================== W03 자기자본/투자한도 (ast40·ast41) ====================

  /** AS-IS ast.Ast40_OwnerCapital.selectByDate — 기준연도(yyyy)의 자기자본 */
  searchOwnerCapitals: async (stdYear: string): Promise<OwnerCapital[]> => {
    const res = await apiClient.get<ApiResponse<OwnerCapital[]>>('v1/ast/owner-capitals', { params: { stdYear } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast40_OwnerCapital.update → 저장된 행(요청 순서) */
  saveOwnerCapitals: async (rows: OwnerCapital[]): Promise<OwnerCapital[]> => {
    const body = rows.map(({ ownerCapitalId, stdDate, amt, note }) => ({ ownerCapitalId, stdDate, amt, note }));
    const res = await apiClient.put<ApiResponse<OwnerCapital[]>>('v1/ast/owner-capitals', body);
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast40_OwnerCapital.delete → 지운 건수 */
  deleteOwnerCapitals: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/ast/owner-capitals', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS ast.Ast41_InvestLimit.selectByCompanyId — 기준 적용일 목록 */
  searchInvestLimitDates: async (): Promise<InvestLimitDate[]> => {
    const res = await apiClient.get<ApiResponse<InvestLimitDate[]>>('v1/ast/invest-limits/dates');
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast41_InvestLimit.selectByDate */
  searchInvestLimits: async (startDate: string): Promise<InvestLimit[]> => {
    const res = await apiClient.get<ApiResponse<InvestLimit[]>>('v1/ast/invest-limits', { params: { startDate } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast41_InvestLimit.insert — 적용일 생성(가장 최근 적용일을 복사) */
  createInvestLimitDate: async (startDate: string): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/ast/invest-limits', { startDate });
  },

  /** AS-IS ast.Ast41_InvestLimit.deleteByDate → 지운 건수 */
  deleteInvestLimitDate: async (startDate: string): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/ast/invest-limits/by-date', { params: { startDate } });
    return res.data.data ?? 0;
  },

  /** AS-IS ast.Ast41_InvestLimit.update → 저장된 행(요청 순서) */
  saveInvestLimits: async (rows: InvestLimit[]): Promise<InvestLimit[]> => {
    const body = rows.map(({ investLimitId, startDate, investAssetType, limitRate, stopLossRate, note }) =>
      ({ investLimitId, startDate, investAssetType, limitRate, stopLossRate, note }));
    const res = await apiClient.put<ApiResponse<InvestLimit[]>>('v1/ast/invest-limits', body);
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast41_InvestLimit.delete → 지운 건수 */
  deleteInvestLimits: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/ast/invest-limits', { data: ids });
    return res.data.data ?? 0;
  },

  // ── W09 평가처리 (Ast06_Tab_EvalFinance) ──

  /** 회사의 자산평가 주기(LoginUser.getCompanyModel().getAstEvalCycleCode()): 'W'면 평가일자, 아니면 평가년월 */
  getEvalCycle: async (): Promise<string | null> => {
    const res = await apiClient.get<ApiResponse<string | null>>('v1/ast/evals/cycle');
    return res.data.data ?? null;
  },

  /** AS-IS sys.Sys12_Calendar.selectBizDate2(0, stdDate, "-0", true) (W09): 시세입력 기준일 → 'yyyy-MM-dd' */
  getEvalPriceDate: async (stdDate: string): Promise<string> => {
    const res = await apiClient.get<ApiResponse<string>>('v1/ast/evals/price-date', { params: { stdDate } });
    return res.data.data;
  },

  /** AS-IS ast.Ast06_Tr.selectEvalList (W09): 평가 기준일의 보유 종목과 처리한 평가. evalType '1' 시가평가 / '2' 이자평가 */
  searchEvals: async (p: { closeDate: string; corpId?: number | null; accountId?: number | null; classTreeId?: number | null; searchText: string; evalType: string }): Promise<AstEval[]> => {
    const res = await apiClient.get<ApiResponse<AstEval[]>>('v1/ast/evals', {
      params: { ...p, corpId: p.corpId ?? undefined, accountId: p.accountId ?? undefined, classTreeId: p.classTreeId ?? undefined },
    });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast06_Tr.updateEval(procType P): 평가처리 → 처리한 줄 */
  processEvals: async (items: AstEvalItem[]): Promise<AstEval[]> => {
    const res = await apiClient.post<ApiResponse<AstEval[]>>('v1/ast/evals/process', { items });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast06_Tr.updateEval(procType C): 평가취소 */
  cancelEvals: async (items: AstEvalItem[]): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/ast/evals/cancel', { items });
  },

  /** AS-IS sys.Sys99_Print.insertRdEvalFinance → rdGroupId */
  rdEval: async (p: { closeDate: string; corpId?: number | null; accountId?: number | null; classTreeId?: number | null; searchText: string; evalType: string }): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/ast/evals/rd', p);
    return res.data.data;
  },

  /** AS-IS ast.Ast25_Price.selectHoldItem (W09 시세입력): 국내 보유 종목의 시세. itemType '%' 전체 */
  searchPriceHoldItems: async (holdDate: string, itemType: string, searchText: string): Promise<AstPrice[]> => {
    const res = await apiClient.get<ApiResponse<AstPrice[]>>('v1/ast/prices/hold-items', { params: { holdDate, itemType, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast25_Price.insert (W09 시세입력): 바뀐 단가 저장 */
  savePrices: async (rows: Pick<AstPrice, 'stdDate' | 'itemType' | 'itemCode' | 'itemName' | 'evalPrice'>[]): Promise<void> => {
    await apiClient.put<ApiResponse<void>>('v1/ast/prices', { rows });
  },

  // ── W10 시세관리 (Ast25_Tab_Price) ──

  /** AS-IS ast.Ast25_Price.selectByStdDatePaging (W10): 고객사 시세 + 공용 시세. itemType '%' 전체 */
  searchPrices: async (p: { startDate: string; closeDate: string; itemType: string; searchText: string; holdYn: boolean; limit: number; offset: number }): Promise<PageRes<AstPrc>> => {
    const res = await apiClient.get<ApiResponse<PageRes<AstPrc>>>('v1/ast/prices', { params: p });
    return res.data.data;
  },

  /** AS-IS ast.Ast25_Price.upsert (W10): 저장한 ID(요청 순서). 공용 시세(lockYn)는 고객사 시세로 새로 만든다 */
  upsertPrices: async (rows: AstPrc[]): Promise<number[]> => {
    const body = rows.map(({ priceId, stdDate, itemType, itemCode, itemName, evalPrice, note, lockYn }) => ({ priceId, stdDate, itemType, itemCode, itemName, evalPrice, note, lockYn }));
    const res = await apiClient.put<ApiResponse<number[]>>('v1/ast/prices/upsert', { rows: body });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast25_Price.delete (W10) → 지운 건수 */
  deletePrices: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/ast/prices', { data: ids });
    return res.data.data ?? 0;
  },

  // ── W11 감가상각처리 (Ast06_Tab_EvalDepn) ──

  /** AS-IS ast.Ast06_Tr.selectDepn (W11): depnDate = 상각년월의 말일 */
  searchDepns: async (depnDate: string): Promise<AstDepn[]> => {
    const res = await apiClient.get<ApiResponse<AstDepn[]>>('v1/ast/depns', { params: { depnDate } });
    return res.data.data ?? [];
  },

  /** AS-IS act.Act04_GenLedger.checkClose (W11): 마감된 날짜면 오류 */
  checkDepnClose: async (stdDate: string): Promise<void> => {
    await apiClient.get<ApiResponse<void>>('v1/ast/depns/check-close', { params: { stdDate } });
  },

  /** AS-IS ast.Ast06_Tr.updateDepnEval (W11): 선택한 줄의 상각비 계산·거래·비품원장·분개 */
  processDepns: async (items: Pick<AstDepn, 'trId' | 'astClassTreeId' | 'date' | 'purTrId' | 'purDate' | 'bookAmt' | 'nonDeductTax' | 'acmDepnCost' | 'depnCost' | 'depnType' | 'depnYear' | 'depnRate' | 'calcStartDate' | 'classTreeName'>[]): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/ast/depns/process', { items });
  },

  /** AS-IS ast.Ast06_Tr.updateDepnCost (W11): 처리한 감가상각비 고치기 */
  updateDepnCost: async (trId: number, depnCost: number | null): Promise<void> => {
    await apiClient.put<ApiResponse<void>>(`v1/ast/depns/${trId}/cost`, { depnCost });
  },

  /** AS-IS ast.Ast16_NonDeductTax.selectByPurTrId (W11) */
  searchNonDeductTaxes: async (purTrId: number): Promise<AstNonDeductTax[]> => {
    const res = await apiClient.get<ApiResponse<AstNonDeductTax[]>>('v1/ast/non-deduct-taxes', { params: { purTrId } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast16_NonDeductTax.update (W11): 요청과 같은 순서로 ID를 돌려준다 */
  saveNonDeductTaxes: async (rows: AstNonDeductTax[]): Promise<number[]> => {
    const res = await apiClient.put<ApiResponse<number[]>>('v1/ast/non-deduct-taxes', { rows });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast16_NonDeductTax.delete (W11) */
  deleteNonDeductTaxes: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/ast/non-deduct-taxes', { data: ids });
    return res.data.data ?? 0;
  },

  // ── W12 금융상품 보유내역 (Ast09_Tab_FinanceBook) ──

  /** AS-IS ast.Ast09_Book.selectByHoldDate (W12): astType 2 금융자산, 보관처/계좌/종목유형/종목명 검색 */
  searchFinanceBooks: async (holdDate: string, searchText: string, abroType?: string): Promise<AstFinanceBook[]> => {
    // abroType: W13 외화 '2'(통화가 KRW가 아닌 것). W12는 주지 않는다
    const res = await apiClient.get<ApiResponse<AstFinanceBook[]>>('v1/ast/books/finance', { params: { holdDate, searchText, abroType } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast09_Book.selectByHoldDatePeriod (W14): astType 2 금융자산 — 조회하면서 서버가 내 sys99_print 자료를 다시 쌓는다 */
  searchFinancePeriod: async (startDate: string, closeDate: string, searchText: string): Promise<AstFinanceBook[]> => {
    const res = await apiClient.get<ApiResponse<AstFinanceBook[]>>('v1/ast/books/finance/period', { params: { startDate, closeDate, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys99_Print.insertRdFinanceBookPeriod (W14): 엑셀 양식 자료를 쌓고 rdGroupId를 받는다 */
  rdFinanceBookPeriod: async (startDate: string, closeDate: string, searchText: string): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/ast/books/finance/period/rd', null, { params: { startDate, closeDate, searchText } });
    return res.data.data;
  },

  /** AS-IS ast.Ast09_Book.getHoldDate (W12): 상신 전 종목유형별 합계 — 비어 있으면 상신할 내용이 없다 */
  searchFinanceGroups: async (holdDate: string): Promise<AstFinanceGroup[]> => {
    const res = await apiClient.get<ApiResponse<AstFinanceGroup[]>>('v1/ast/books/finance/groups', { params: { holdDate } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys99_Print.insertRdFinanceBook (W12): 출력 자료를 쌓고 rdGroupId를 받는다 */
  rdFinanceBook: async (holdDate: string, searchText: string): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/ast/books/finance/rd', null, { params: { holdDate, searchText } });
    return res.data.data;
  },
  // ── W16 비품관리대장 (Ast13_Tab_OfficeAssets) ──

  /** AS-IS sys.Sys00_Common.selectOfficeAssets: 구분 콤보(대분류 5x + 소모품_비품) */
  searchOfficeAssetTypes: async (): Promise<AstCodeName[]> => {
    const res = await apiClient.get<ApiResponse<AstCodeName[]>>('v1/ast/book-depns/types');
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast13_BookDepn.selectOfficeAssets. itemLClassCode 비면 전체 */
  searchOfficeAssets: async (depnDate: string, itemLClassCode: string, retireYn: boolean, searchText: string): Promise<AstOfficeAsset[]> => {
    const res = await apiClient.get<ApiResponse<AstOfficeAsset[]>>('v1/ast/book-depns', { params: { depnDate, itemLClassCode, retireYn, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast13_BookDepn.selectOfficeAssetsGroup: 상신 전 구분별 합계 — 비어 있으면 상신할 내용이 없다 */
  searchOfficeAssetGroups: async (depnDate: string): Promise<AstOfficeAssetGroup[]> => {
    const res = await apiClient.get<ApiResponse<AstOfficeAssetGroup[]>>('v1/ast/book-depns/groups', { params: { depnDate } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast13_BookDepn.updateRetireDate: null이면 폐기일 삭제 */
  updateOfficeRetireDate: async (bookDepnId: number, retireDate: string | null): Promise<void> => {
    await apiClient.put<ApiResponse<void>>(`v1/ast/book-depns/${bookDepnId}/retire-date`, { retireDate });
  },

  /** AS-IS sys.Sys99_Print.insertRdOfficeAssets: 출력 자료를 쌓고 rdGroupId를 받는다 */
  rdOfficeAssets: async (depnDate: string, itemLClassCode: string, retireYn: boolean, searchText: string): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/ast/book-depns/rd', null, { params: { depnDate, itemLClassCode, retireYn, searchText } });
    return res.data.data;
  },

  /** AS-IS sys.Sys00_Common.selectWindowUseTrCode: 화면에 지정된 사용 중 거래유형 */
  searchWindowTrCodes: async (className: string): Promise<AstCodeName[]> => {
    const res = await apiClient.get<ApiResponse<AstCodeName[]>>('v1/ast/trs/window-codes', { params: { className } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast06_Tr.selectByExpenseId */
  searchTrsByExpense: async (expenseId: number): Promise<AstExpenseTr[]> => {
    const res = await apiClient.get<ApiResponse<AstExpenseTr[]>>('v1/ast/trs/by-expense', { params: { expenseId } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast06_Tr.updateDepn2: 새 줄은 취득 거래 + 비품원장, 잠긴 줄은 적요만 */
  saveOfficeAssetTrs: async (rows: AstOfficeTrRow[]): Promise<void> => {
    await apiClient.put<ApiResponse<void>>('v1/ast/trs/office-assets', { rows });
  },

  /** AS-IS ast.Ast06_Tr.checkDepnMulti: 거래일 이후 감가상각이 있으면 오류 */
  checkTrDepn: async (trIds: number[]): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/ast/trs/check-depn', { trIds });
  },

  /** AS-IS ast.Ast06_Tr.updateNote (Ast06_Lookup_ModifyNote) */
  updateTrNote: async (trId: number, note: string): Promise<void> => {
    await apiClient.put<ApiResponse<void>>(`v1/ast/trs/${trId}/note`, { note });
  },

  // ── W17 감가상각대장 (Ast13_Tab_DepnBook) ──

  /** AS-IS sys.Sys00_Common.selectDepnItemType: 구분 콤보(대분류 5x) */
  searchDepnItemTypes: async (): Promise<AstCodeName[]> => {
    const res = await apiClient.get<ApiResponse<AstCodeName[]>>('v1/ast/book-depns/depn-types');
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast13_BookDepn.selectByDepnDate2 */
  searchDepnBooks: async (depnDate: string, itemLClassCode: string, retireYn: boolean, searchText: string): Promise<AstDepnBook[]> => {
    const res = await apiClient.get<ApiResponse<AstDepnBook[]>>('v1/ast/book-depns/depn-books', { params: { depnDate, itemLClassCode, retireYn, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast13_BookDepn.getDepnDate2: 상신 전 구분별 합계 — 비어 있으면 상신할 내용이 없다 */
  searchDepnBookGroups: async (depnDate: string): Promise<AstDepnBookGroup[]> => {
    const res = await apiClient.get<ApiResponse<AstDepnBookGroup[]>>('v1/ast/book-depns/depn-books/groups', { params: { depnDate } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys99_Print.insertRdDepnBook: 출력 자료를 쌓고 rdGroupId를 받는다 */
  rdDepnBook: async (depnDate: string, itemLClassCode: string, retireYn: boolean, searchText: string): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/ast/book-depns/depn-books/rd', null, { params: { depnDate, itemLClassCode, retireYn, searchText } });
    return res.data.data;
  },

  // ── W15 금융상품 운용내역 (Ast09_Tab_FinanceBookOpr) ──

  /** AS-IS ast.Ast40_OwnerCapital.selectByMaxDate: 없으면 null */
  getOwnerCapitalMax: async (holdDate: string): Promise<AstOwnerCapitalMax | null> => {
    const res = await apiClient.get<ApiResponse<AstOwnerCapitalMax | null>>('v1/ast/finance-opr/owner-capital', { params: { holdDate } });
    return res.data.data ?? null;
  },

  /** AS-IS ast.Ast09_Book.selectInvestAssetLimit */
  searchInvestAssetLimits: async (holdDate: string): Promise<AstInvestAssetLimit[]> => {
    const res = await apiClient.get<ApiResponse<AstInvestAssetLimit[]>>('v1/ast/finance-opr/limits', { params: { holdDate } });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast09_Book.selectFinanceByHoldDate: periodType 0 = 미보유 제외, 1~4 = 미보유 포함 기간(1개월·3개월·1년·기간지정) */
  searchFinanceOpr: async (p: { holdDate: string; searchText: string; investAssetType: string; holdYn: boolean; periodType: string; startDate?: string; closeDate?: string }): Promise<AstFinanceOpr[]> => {
    const res = await apiClient.get<ApiResponse<AstFinanceOpr[]>>('v1/ast/finance-opr', { params: p });
    return res.data.data ?? [];
  },

  /** AS-IS ast.Ast06_Tr.selectByAstClassTreeId: trType 1 매수 / 2 매도 */
  searchFinanceOprTrs: async (stdDate: string, astClassTreeId: number, keepAccountId: number, trType: '1' | '2'): Promise<AstFinanceOprTr[]> => {
    const res = await apiClient.get<ApiResponse<AstFinanceOprTr[]>>('v1/ast/finance-opr/trs', { params: { stdDate, astClassTreeId, keepAccountId, trType } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys99_Print.insertRdFinanceBookOpr1: 투자한도 출력 자료 → 그룹ID */
  rdFinanceOprLimit: async (holdDate: string): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/ast/finance-opr/rd-limit', null, { params: { holdDate } });
    return res.data.data;
  },

  /** AS-IS sys.Sys99_Print.insertRdFinanceBookOpr2: 보유·매수·매도 출력 자료 → 그룹ID */
  rdFinanceOprBook: async (p: { holdDate: string; searchText: string; investAssetType: string; holdYn: boolean; periodType: string; startDate?: string; closeDate?: string }): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/ast/finance-opr/rd-book', null, { params: p });
    return res.data.data;
  },
};
