import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { AstDetail, TrCode, TrCodeWindow } from '../types/ast';

/** ast(자산) API (E21 자산상세 항목관리, E29 거래유형 등록) */
export const astApi = {
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
};
