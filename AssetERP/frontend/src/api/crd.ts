import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { CrdExcelCode, CrdExcelCompany } from '../types/crd';

/** crd(법인카드) API (E24 법인카드 업로드 기초자료) */
export const crdApi = {
  /** AS-IS crd.Crd10_ExcelCompany.selectByCompanyId — 회사는 서버가 로그인 회사로 */
  searchExcelCompanies: async (): Promise<CrdExcelCompany[]> => {
    const res = await apiClient.get<ApiResponse<CrdExcelCompany[]>>('v1/crd/excel-companies');
    return res.data.data ?? [];
  },

  /** AS-IS crd.Crd10_ExcelCompany.update → 저장된 행(요청 순서) */
  saveExcelCompanies: async (rows: CrdExcelCompany[]): Promise<CrdExcelCompany[]> => {
    const body = rows.map(({ excelCompanyId, bankCode, note }) => ({ excelCompanyId, bankCode, note }));
    const res = await apiClient.put<ApiResponse<CrdExcelCompany[]>>('v1/crd/excel-companies', body);
    return res.data.data ?? [];
  },

  /** AS-IS crd.Crd10_ExcelCompany.delete → 지운 건수 */
  deleteExcelCompanies: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/crd/excel-companies', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS crd.Crd11_ExcelCode.selectByCompanyId — 카드사 코드 */
  searchExcelCodes: async (bankCode: string): Promise<CrdExcelCode[]> => {
    const res = await apiClient.get<ApiResponse<CrdExcelCode[]>>('v1/crd/excel-codes', { params: { bankCode } });
    return res.data.data ?? [];
  },

  /** AS-IS crd.Crd11_ExcelCode.update → 저장된 행(요청 순서) */
  saveExcelCodes: async (rows: CrdExcelCode[]): Promise<CrdExcelCode[]> => {
    const body = rows.map(({ excelCodeId, bankCode, bankExcelCode, seq, text }) => ({ excelCodeId, bankCode, bankExcelCode, seq, text }));
    const res = await apiClient.put<ApiResponse<CrdExcelCode[]>>('v1/crd/excel-codes', body);
    return res.data.data ?? [];
  },

  /** AS-IS crd.Crd11_ExcelCode.delete → 지운 건수 */
  deleteExcelCodes: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/crd/excel-codes', { data: ids });
    return res.data.data ?? 0;
  },
};
