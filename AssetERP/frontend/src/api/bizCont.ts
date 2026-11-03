import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import {
  BizContCorp, BizContDualFund, BizContEach, BizContEachAddr, BizContFeeInfo, BizContHoldFee, BizContPrintReq, BizContRelateAppr, BizContSaveReq,
  BizContSaveRes, BizContSearch, BizContShare, BizContShareReq, BizContWithCorp,
} from '../types/bizCont';

const BASE = 'v1/biz/cont-corps';

/** EE20 Biz10_Tab_ContCorp (계약사 관리) — AS-IS server/biz Biz10_ContCorp·Biz11~Biz17 */
export const bizContCorpApi = {
  /** AS-IS biz.Biz10_ContCorp.selectByText */
  search: async (c: BizContSearch): Promise<BizContCorp[]> => {
    const res = await apiClient.get<ApiResponse<BizContCorp[]>>(BASE, {
      params: { searchText: c.searchText, check: c.check, stdYear: c.stdYear, statusCode: c.statusCode, statusCheck: c.statusCheck, endMonth: c.endMonth },
    });
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz10_ContCorp.selectById */
  get: async (contCorpId: number): Promise<BizContCorp> => {
    const res = await apiClient.get<ApiResponse<BizContCorp>>(`${BASE}/${contCorpId}`);
    return res.data.data as BizContCorp;
  },
  /** AS-IS getSeq */
  nextId: async (): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>(`${BASE}/next-id`);
    return res.data.data as number;
  },
  /** AS-IS biz.Biz10_ContCorp.insertUpdate */
  save: async (req: BizContSaveReq): Promise<BizContSaveRes> => {
    const res = await apiClient.post<ApiResponse<BizContSaveRes>>(BASE, req);
    return res.data.data as BizContSaveRes;
  },
  /** AS-IS biz.Biz11_ContHistory.deleteContCorpId + biz.Biz10_ContCorp.delete */
  delete: async (contCorpIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(BASE, { data: contCorpIds });
    return res.data.data ?? 0;
  },
  /** AS-IS sys.Sys99_Print.insertRdContCorp → 출력 그룹 ID */
  rdPrint: async (req: BizContPrintReq): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>(`${BASE}/rd-print`, req);
    return res.data.data ?? '';
  },

  // ── Biz11_ContHistory ──
  /** AS-IS biz.Biz11_ContHistory.selectByContCorpId */
  searchHistories: async (contCorpId: number): Promise<BizContCorp[]> => {
    const res = await apiClient.get<ApiResponse<BizContCorp[]>>(`${BASE}/${contCorpId}/histories`);
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz11_ContHistory.deleteCheck → 이력 수 */
  countHistories: async (contCorpId: number): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>(`${BASE}/${contCorpId}/histories/count`);
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz11_ContHistory.delete */
  deleteHistories: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`${BASE}/histories`, { data: ids });
    return res.data.data ?? 0;
  },

  // ── Biz12_FeeInfo ──
  /** AS-IS biz.Biz12_FeeInfo.modelUpdate → 저장된 보수정보 */
  saveFeeInfo: async (req: Omit<BizContFeeInfo, 'feeInfoId' | 'feeChargeTypeNm' | 'minFeeStr' | 'withFeeStr'> & { feeInfoId: number | null }): Promise<BizContFeeInfo> => {
    const res = await apiClient.put<ApiResponse<BizContFeeInfo>>(`${BASE}/fee-infos`, req);
    return res.data.data as BizContFeeInfo;
  },

  // ── Biz15_Share ──
  /** AS-IS biz.Biz15_Share.selectByContHistoryId */
  searchShares: async (contHistoryId: number): Promise<BizContShare[]> => {
    const res = await apiClient.get<ApiResponse<BizContShare[]>>(`${BASE}/histories/${contHistoryId}/shares`);
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz15_Share.insert (직전 이력의 공유자 복사) */
  copyShares: async (contCorpId: number, contHistoryId: number): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>(`${BASE}/histories/${contHistoryId}/shares/copy`, null, { params: { contCorpId } });
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz15_Share.update + biz.Biz15_Share.delete */
  saveShares: async (adds: BizContShareReq[], deleteIds: number[]): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>(`${BASE}/shares`, { adds, deleteIds });
    return res.data.data ?? 0;
  },

  // ── Biz13_WithCorp ──
  /** AS-IS biz.Biz13_WithCorp.selectByHistoryContCorpId */
  searchWithCorps: async (contCorpId: number): Promise<BizContWithCorp[]> => {
    const res = await apiClient.get<ApiResponse<BizContWithCorp[]>>(`${BASE}/${contCorpId}/with-corps`);
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz13_WithCorp.update. 새 행(id ≤ 0)은 id를 빼고 보낸다 */
  saveWithCorps: async (rows: BizContWithCorp[]): Promise<number> => {
    const body = rows.map(r => ({ withCorpId: r.withCorpId > 0 ? r.withCorpId : null, contCorpId: r.contCorpId, manageType: r.manageType, corpId: r.corpId, firstStartDate: r.firstStartDate, lastCloseDate: r.lastCloseDate }));
    const res = await apiClient.put<ApiResponse<number>>(`${BASE}/with-corps`, body);
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz13_WithCorp.delete */
  deleteWithCorps: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`${BASE}/with-corps`, { data: ids });
    return res.data.data ?? 0;
  },

  // ── Biz14_RelateAppr ──
  /** AS-IS biz.Biz14_RelateAppr.selectByContHistoryId */
  searchRelateApprs: async (contHistoryId: number): Promise<BizContRelateAppr[]> => {
    const res = await apiClient.get<ApiResponse<BizContRelateAppr[]>>(`${BASE}/histories/${contHistoryId}/relate-apprs`);
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz14_RelateAppr.modelUpdate */
  createRelateAppr: async (apprId: number, contHistoryId: number): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>(`${BASE}/relate-apprs`, { apprId, contHistoryId });
    return res.data.data as number;
  },
  /** AS-IS biz.Biz14_RelateAppr.delete */
  deleteRelateApprs: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`${BASE}/relate-apprs`, { data: ids });
    return res.data.data ?? 0;
  },

  // ── Biz16_EachCont ──
  /** AS-IS biz.Biz16_EachCont.selectByCorpId */
  searchEachConts: async (contCorpId: number): Promise<BizContEach[]> => {
    const res = await apiClient.get<ApiResponse<BizContEach[]>>(`${BASE}/${contCorpId}/each-conts`);
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz16_EachCont.selectByContCorpId (계약사 주소·대표이사) */
  searchEachContAddr: async (contCorpId: number): Promise<BizContEachAddr[]> => {
    const res = await apiClient.get<ApiResponse<BizContEachAddr[]>>(`${BASE}/${contCorpId}/each-conts/address`);
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz16_EachCont.update. 새 행(id ≤ 0)은 id를 빼고 보낸다 */
  saveEachConts: async (rows: BizContEach[]): Promise<number> => {
    const body = rows.map(r => ({ contractId: r.contractId > 0 ? r.contractId : null, contCorpId: r.contCorpId, date: r.date, fundNm: r.fundNm, fundStartDate: r.fundStartDate, fundFee: r.fundFee, note: r.note, startDate: r.startDate }));
    const res = await apiClient.put<ApiResponse<number>>(`${BASE}/each-conts`, body);
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz16_EachCont.delete */
  deleteEachConts: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`${BASE}/each-conts`, { data: ids });
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz16_EachCont.updateApprId */
  updateEachContApprId: async (contractId: number, apprId: number): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>(`${BASE}/each-conts/${contractId}/appr-id`, null, { params: { apprId } });
    return res.data.data ?? 0;
  },

  // ── Biz17_DualManageFund ──
  /** AS-IS biz.Biz17_DualManageFund.selectByContCorpId */
  searchDualFunds: async (contCorpId: number): Promise<BizContDualFund[]> => {
    const res = await apiClient.get<ApiResponse<BizContDualFund[]>>(`${BASE}/${contCorpId}/dual-funds`);
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz17_DualManageFund.update. 새 행(id ≤ 0)은 id를 빼고 보낸다 */
  saveDualFunds: async (rows: BizContDualFund[]): Promise<number> => {
    const body = rows.map(r => ({ dualFundId: r.dualFundId > 0 ? r.dualFundId : null, contCorpId: r.contCorpId, fundCd: r.fundCd, startDate: r.startDate, fundFee: r.fundFee, fundSubFee: r.fundSubFee, positionType: r.positionType }));
    const res = await apiClient.put<ApiResponse<number>>(`${BASE}/dual-funds`, body);
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz17_DualManageFund.delete */
  deleteDualFunds: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`${BASE}/dual-funds`, { data: ids });
    return res.data.data ?? 0;
  },
  /** AS-IS ast.Ast30_BookFundFee.selectByContCorpId (Biz17_Lookup_HoldFee) */
  searchHoldFees: async (contCorpId: number, holdDate: string, searchText: string): Promise<BizContHoldFee[]> => {
    const res = await apiClient.get<ApiResponse<BizContHoldFee[]>>(`${BASE}/${contCorpId}/hold-funds`, { params: { holdDate, searchText } });
    return res.data.data ?? [];
  },
};
