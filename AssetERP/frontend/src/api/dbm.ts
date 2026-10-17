import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { DbColumn, DbSourceKind, DbTable, PdfTarget } from '../types/dbm';

/** dbm 화면 API (C07~) */
export const dbmApi = {
  // ── C07 PDF 생성 테스트 (Dbm10_Tab_MakePdf) ──

  /** AS-IS apr.Apr01_Appr.selectPdfMakeTarget: 결재완료·대외문서 중 제목 파일이 없는 문서 (로그인 회사) */
  searchPdfTargets: async (): Promise<PdfTarget[]> => {
    const res = await apiClient.get<ApiResponse<PdfTarget[]>>('v1/dbm/pdfs/targets');
    return res.data.data ?? [];
  },

  /** AS-IS utils.pdf.PDFCreate.createPDF7: 결재 ID(keyId)의 PDF 생성 — 서버 연동이 없으면 오류 */
  createPdf: async (apprId: string): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('v1/dbm/pdfs', { apprId });
  },

  // ── C08 Table Spec,(Model)Properties (Dbm01_Tab_TabComments) ──

  /** AS-IS dbm.Dbm01_TabComments.selectByTableName: 이름 일부(대소문자 무시)로 public 스키마의 테이블·뷰 */
  searchTables: async (searchText: string): Promise<DbTable[]> => {
    const res = await apiClient.get<ApiResponse<DbTable[]>>('v1/dbm/tables', { params: { searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS dbm.Dbm02_ColComments.selectByTableName: 컬럼 주석이 있는 컬럼 */
  searchColumns: async (tableName: string): Promise<DbColumn[]> => {
    const res = await apiClient.get<ApiResponse<DbColumn[]>>(`v1/dbm/tables/${encodeURIComponent(tableName)}/columns`);
    return res.data.data ?? [];
  },

  /** AS-IS dbm.Dbm01_TabComments.update — DB 프로시저(sp_DDLRun)가 없어 서버가 거절 */
  updateTableComments: async (rows: Pick<DbTable, 'tableName' | 'tableComments'>[]): Promise<void> => {
    await apiClient.put<ApiResponse<null>>('v1/dbm/tables/comments', rows);
  },

  /** AS-IS dbm.Dbm02_ColComments.update — DB 프로시저(sp_DDLRun)가 없어 서버가 거절 */
  updateColumnComments: async (rows: Pick<DbColumn, 'tableName' | 'columnName' | 'columnComment'>[]): Promise<void> => {
    await apiClient.put<ApiResponse<null>>('v1/dbm/tables/columns/comments', rows);
  },

  /** AS-IS dbm.Dbm03_TabColumns.selectByXML·Model·Properties·GridBuilder — DB 프로시저(sp_Java*)가 없어 서버가 거절 */
  generateSource: async (tableName: string, kind: DbSourceKind): Promise<string> => {
    const res = await apiClient.get<ApiResponse<string>>(`v1/dbm/tables/${encodeURIComponent(tableName)}/sources/${kind}`);
    return res.data.data ?? '';
  },
};
