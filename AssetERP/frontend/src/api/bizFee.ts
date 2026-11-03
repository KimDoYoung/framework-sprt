import { apiClient } from './client';
import { readBlobError } from './file';
import { ApiResponse } from '../types/auth';
import {
  BizFeeAccount, BizFeeAccountSaveReq, BizFeeCharge, BizFeeChargeAppr, BizFeeChargeCalc, BizFeeChargeDetail, BizFeeChargeSaveReq,
} from '../types/bizFee';

const BASE = 'v1/biz/fee-charges';
const ACCOUNT_BASE = 'v1/biz/fee-accounts';

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** EE21 Biz20_Tab_FeeCharge (최저보수 청구) — AS-IS server/biz Biz20_FeeCharge·Biz22_FeeChargeCalc */
export const bizFeeChargeApi = {
  /** AS-IS biz.Biz20_FeeCharge.selectByChargeDate — chargeDate 'yyyy-MM-dd' (분기 말일) */
  search: async (chargeDate: string, searchText: string): Promise<BizFeeCharge[]> => {
    const res = await apiClient.get<ApiResponse<BizFeeCharge[]>>(BASE, { params: { chargeDate, searchText } });
    return res.data.data ?? [];
  },
  /** AS-IS getSeq */
  nextId: async (): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>(`${BASE}/next-id`);
    return res.data.data as number;
  },
  /** AS-IS biz.Biz20_FeeCharge.updateCheck — 같은 운용사·청구일자의 다른 행 수(0이면 저장 가능) */
  sameCorpCount: async (feeChargeId: number, corpId: number, chargeDate: string): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>(`${BASE}/same-corp-count`, { params: { feeChargeId, corpId, chargeDate } });
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz22_FeeChargeCalc.selectByContCorpId */
  searchCalcs: async (contCorpId: number, chargeDate: string): Promise<BizFeeChargeCalc[]> => {
    const res = await apiClient.get<ApiResponse<BizFeeChargeCalc[]>>(`${BASE}/calcs`, { params: { contCorpId, chargeDate } });
    return res.data.data ?? [];
  },
  /** biz20_fee_charge.selectById */
  get: async (feeChargeId: number): Promise<BizFeeChargeDetail> => {
    const res = await apiClient.get<ApiResponse<BizFeeChargeDetail>>(`${BASE}/${feeChargeId}`);
    return res.data.data as BizFeeChargeDetail;
  },
  /** AS-IS biz.Biz20_FeeCharge.modelUpdate (등록·수정 같은 경로) */
  save: async (req: BizFeeChargeSaveReq): Promise<BizFeeChargeDetail> => {
    const res = await apiClient.post<ApiResponse<BizFeeChargeDetail>>(BASE, req);
    return res.data.data as BizFeeChargeDetail;
  },
  /** AS-IS biz.Biz20_FeeCharge.createFeeCharge → 처리한 계약사 수. contCorpId 가 없으면 전체 계약사 */
  batch: async (chargeDate: string, contCorpId: number | null): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>(`${BASE}/batch`, { chargeDate, contCorpId });
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz20_FeeCharge.deleteList → 지운 건수 */
  delete: async (feeChargeIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(BASE, { data: feeChargeIds });
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz20_FeeCharge.confirmUpdate */
  confirm: async (feeChargeIds: number[], fixYn: boolean): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>(`${BASE}/confirm`, { feeChargeIds, fixYn });
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz20_FeeCharge.apprCheck — 빈 목록이면 보수입금계좌 없음 */
  apprCheck: async (feeChargeId: number): Promise<BizFeeChargeAppr[]> => {
    const res = await apiClient.get<ApiResponse<BizFeeChargeAppr[]>>(`${BASE}/${feeChargeId}/appr-check`);
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz20_FeeCharge.updateApprId */
  updateApprId: async (feeChargeId: number, apprId: number): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>(`${BASE}/${feeChargeId}/appr-id`, null, { params: { apprId } });
    return res.data.data ?? 0;
  },
  /** AS-IS sys.Sys99_Print.insertRdFeeCharge → 그룹 ID(rdGroupId) */
  rdPrint: async (chargeDate: string, searchText: string): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>(`${BASE}/rd-print`, null, { params: { chargeDate, searchText } });
    return res.data.data ?? '';
  },

  // ── EE33 후처리 ──
  /** AS-IS utils.excel.ExcelCreate.createFeeExcel (makeExcel) — 자료생성 뒤 운용사별 엑셀. 만든 파일 수 */
  createExcel: async (chargeDate: string, quarter: string, contCorpId: number | null): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>(`${BASE}/files/excel`, { chargeDate, quarter, contCorpId });
    return res.data.data ?? 0;
  },
  /** AS-IS utils.pdf.PDFCreate.createFeePDF (makePDF) — 운용사별 PDF. 만든 파일 수 */
  createPdf: async (chargeDate: string, quarter: string, contCorpId: number | null): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>(`${BASE}/files/pdf`, { chargeDate, quarter, contCorpId });
    return res.data.data ?? 0;
  },
  /** AS-IS utils.excel.ExcelCreate.createTotalFeeExcel — 통합상신(A20) 문서(apprId)에 붙는 통합 엑셀. 올린 파일 ID */
  createTotalExcel: async (apprId: number, chargeDate: string, quarter: string): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>(`${BASE}/files/total-excel`, { apprId, chargeDate, quarter });
    return res.data.data as number;
  },
  /** AS-IS ExcelDownload?actionCode=biz22List — 계산상세 [엑셀다운로드] "최저보수청구 구간계산정보.xls" */
  downloadCalcExcel: async (contCorpId: number, chargeDate: string): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>(`${BASE}/calcs/excel`, { params: { contCorpId, chargeDate }, responseType: 'blob' });
      saveBlob(res.data, '최저보수청구 구간계산정보.xls');
    } catch (err) {
      throw await readBlobError(err);
    }
  },
  /** AS-IS FileDownload?fileType=feeCharge — [파일 일괄 다운로드] "Asset-ERP.zip" */
  downloadFilesZip: async (chargeDate: string): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>(`${BASE}/files/zip`, { params: { chargeDate }, responseType: 'blob' });
      saveBlob(res.data, 'Asset-ERP.zip');
    } catch (err) {
      throw await readBlobError(err);
    }
  },
};

/** EE21 Biz29_Lookup_Account (보수입금계좌) — AS-IS server/biz Biz29_Account */
export const bizFeeAccountApi = {
  /** AS-IS biz.Biz29_Account.selectBySearchText */
  search: async (searchText: string): Promise<BizFeeAccount[]> => {
    const res = await apiClient.get<ApiResponse<BizFeeAccount[]>>(ACCOUNT_BASE, { params: { searchText } });
    return res.data.data ?? [];
  },
  /** AS-IS getSeq */
  nextId: async (): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>(`${ACCOUNT_BASE}/next-id`);
    return res.data.data as number;
  },
  /** AS-IS biz.Biz29_Account.update — 번호가 있으면 UPDATE, 없으면 INSERT. 저장한 행을 다시 읽어 돌려준다 */
  save: async (rows: BizFeeAccountSaveReq[]): Promise<BizFeeAccount[]> => {
    const res = await apiClient.put<ApiResponse<BizFeeAccount[]>>(ACCOUNT_BASE, rows);
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz29_Account.delete */
  delete: async (accountIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(ACCOUNT_BASE, { data: accountIds });
    return res.data.data ?? 0;
  },
};
