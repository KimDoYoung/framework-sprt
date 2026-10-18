import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { AstDetail } from '../types/ast';

/** ast(자산) API (E21 자산상세 항목관리) */
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
};
