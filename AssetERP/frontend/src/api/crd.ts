import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { readBlobError } from './file';
import { CrdCard, CrdCardManager, CrdCardUser, CrdExcelCode, CrdExcelCompany } from '../types/crd';

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
  // ── U13 법인카드 및 사용자등록 Crd01_Tab_Card ──
  /** AS-IS crd.Crd01_Card.selectByText — 검색어는 서버가 "%…%"로 감싼다. managerId 없으면 전체 사용자 */
  searchCards: async (p: { searchText: string; useYn: boolean; managerId?: number | null }): Promise<CrdCard[]> => {
    const res = await apiClient.get<ApiResponse<CrdCard[]>>('v1/crd/cards', { params: { searchText: p.searchText, useYn: p.useYn, managerId: p.managerId ?? undefined } });
    return res.data.data as CrdCard[];
  },

  /** AS-IS sys.Sys00_Common.selectCardManager — 카드사용자 콤보 */
  searchCardManagers: async (useYn: boolean): Promise<CrdCardManager[]> => {
    const res = await apiClient.get<ApiResponse<CrdCardManager[]>>('v1/crd/cards/managers', { params: { useYn } });
    return res.data.data as CrdCardManager[];
  },

  /** AS-IS crd.Crd01_Card.update (Crd01_Edit_Card [저장]) — 새 카드(임시 음수 ID)는 ID를 빼고 보낸다 → 저장한 카드 */
  saveCard: async (row: CrdCard): Promise<CrdCard> => {
    const res = await apiClient.put<ApiResponse<CrdCard>>('v1/crd/cards', row.cardId > 0 ? row : { ...row, cardId: null });
    return res.data.data as CrdCard;
  },

  /** AS-IS 사용내역 확인 + crd.Crd03_Trans.deleteByCardId + crd.Crd01_Card.delete */
  deleteCard: async (cardId: number): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/crd/cards/${cardId}`);
    return res.data.data as number;
  },

  /** AS-IS crd.Crd03_Trans.selectByCardId */
  searchCardUsers: async (cardId: number): Promise<CrdCardUser[]> => {
    const res = await apiClient.get<ApiResponse<CrdCardUser[]>>(`v1/crd/cards/${cardId}/users`);
    return res.data.data as CrdCardUser[];
  },

  /** AS-IS crd.Crd03_Trans.update → 저장된 행(요청 순서). 새 행(임시 음수 ID)은 ID를 빼고 보낸다 */
  saveCardUsers: async (cardId: number, rows: CrdCardUser[]): Promise<CrdCardUser[]> => {
    const body = rows.map(r => ({ transId: r.transId > 0 ? r.transId : null, personId: r.personId, frDt: r.frDt, toDt: r.toDt, useYn: r.useYn, publicYn: r.publicYn }));
    const res = await apiClient.put<ApiResponse<CrdCardUser[]>>(`v1/crd/cards/${cardId}/users`, body);
    return res.data.data as CrdCardUser[];
  },

  /** AS-IS crd.Crd03_Trans.delete */
  deleteCardUsers: async (cardId: number, ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/crd/cards/${cardId}/users`, { data: ids });
    return res.data.data as number;
  },

  /** 템플릿 받기 (AS-IS downloadForm → ./excelTemplete/Template_카드업로드.xlsx) */
  downloadCardTemplate: async (): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/crd/cards/template', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Template_카드업로드.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      throw await readBlobError(err);
    }
  },

  /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=cardUpload) → 등록한 건수 */
  uploadCardsExcel: async (file: File): Promise<number> => {
    const form = new FormData();
    form.append('excelUpload', file);
    const res = await apiClient.post<ApiResponse<number>>('v1/crd/cards/excel', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.data ?? 0;
  },
};
