import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { readBlobError } from './file';
import { CrdCard, CrdCardManager, CrdCardUser, CrdData, CrdDataAmount, CrdDataCheck, CrdDataConfirm, CrdDataTarget, CrdExcelCode, CrdExcelCompany } from '../types/crd';

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

  /** AS-IS crd.Crd11_ExcelCode.selectByCompanyId — 카드사 코드. defaults면 회사 0의 기본 맵핑 */
  searchExcelCodes: async (bankCode: string, defaults = false): Promise<CrdExcelCode[]> => {
    const res = await apiClient.get<ApiResponse<CrdExcelCode[]>>('v1/crd/excel-codes', { params: { bankCode, defaults } });
    return res.data.data ?? [];
  },

  /** AS-IS crd.Crd11_ExcelCode.copyData — [커스텀 설정]: 기본 맵핑을 이 회사의 맵핑으로 복사 → 복사한 건수 */
  copyExcelCodes: async (bankCode: string, rows: CrdExcelCode[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/crd/excel-codes/copy', rows, { params: { bankCode } });
    return res.data.data ?? 0;
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

  // ===== 법인카드 내역 업로드 (U14 Crd02_Tab_DataUpload) =====

  /** AS-IS crd.Crd02_Data.selectByPaging — 은행·년월이 비면 서버가 "%" */
  searchData: async (p: { searchText: string; dataBankCode: string; dataYm: string; confirm: CrdDataConfirm; offset: number; limit: number }): Promise<{ total: number; rows: CrdData[] }> => {
    const res = await apiClient.get<ApiResponse<{ total: number; rows: CrdData[] }>>('v1/crd/data', { params: p });
    return res.data.data ?? { total: 0, rows: [] };
  },

  /** AS-IS crd.Crd02_Data.selectByAmt — 총 승인금액·총 부가세 */
  getDataAmount: async (p: { searchText: string; dataBankCode: string; dataYm: string; confirm: CrdDataConfirm }): Promise<CrdDataAmount> => {
    const res = await apiClient.get<ApiResponse<CrdDataAmount>>('v1/crd/data/amount', { params: p });
    return res.data.data ?? {};
  },

  /** AS-IS biz.Biz01_Promo.targetCheck — checkType 1 엑셀업로드 / 2 내역확정 / 3 등록 */
  dataTargetCheck: async (dataYm: string, checkType: string): Promise<CrdDataCheck> => {
    const res = await apiClient.get<ApiResponse<CrdDataCheck>>('v1/crd/data/target-check', { params: { dataYm, checkType } });
    return res.data.data as CrdDataCheck;
  },

  /** AS-IS biz.Biz01_Promo.targetListCheck — checkType 1 삭제 / 4 저장 */
  dataListCheck: async (checkType: string, ids: number[]): Promise<CrdDataCheck> => {
    const res = await apiClient.post<ApiResponse<CrdDataCheck>>('v1/crd/data/list-check', { ids }, { params: { checkType } });
    return res.data.data as CrdDataCheck;
  },

  /** AS-IS crd.Crd02_Data.update / copyUpdate — dataId가 0 이하면 새 내역 → 저장한 내역 */
  saveData: async (row: CrdData): Promise<CrdData> => {
    const res = await apiClient.put<ApiResponse<CrdData>>('v1/crd/data', row);
    return res.data.data as CrdData;
  },

  /** AS-IS crd.Crd02_Data.delete + deleteBiz → 지운 건수 */
  deleteData: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/crd/data', { data: ids });
    return res.data.data ?? 0;
  },

  /** 선택내역확정(ids)·전체내역확정(조회조건) 전의 확인 */
  dataConfirmCheck: async (target: CrdDataTarget): Promise<CrdDataCheck> => {
    const res = await apiClient.post<ApiResponse<CrdDataCheck>>('v1/crd/data/confirm-check', target);
    return res.data.data as CrdDataCheck;
  },

  /** AS-IS biz.Biz01_Promo.insertList → 확정한 건수 */
  confirmData: async (target: CrdDataTarget): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/crd/data/confirm', target);
    return res.data.data ?? 0;
  },

  /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=crdExcelUpload) → 등록한 내역 수 */
  uploadDataExcel: async (file: File, cardCode: string, dataYm: string): Promise<number> => {
    const form = new FormData();
    form.append('excelUpload', file);
    const res = await apiClient.post<ApiResponse<number>>('v1/crd/data/excel', form, { params: { cardCode, dataYm }, headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.data ?? 0;
  },
};
