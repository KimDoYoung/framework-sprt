import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { BizErpContCorp, BizErpContCorpSaveReq, BizErpFee, BizErpMailForm, BizErpSetup } from '../types/bizErp';

const CORP = 'v1/biz/erp-cont-corps';
const FEE = 'v1/biz/erp-fees';
const SETUP = 'v1/biz/erp-setups';

/** EE22 Biz51_Tab_ErpContCorp (AssetERP 계약사 관리) — AS-IS server/biz Biz51_ErpContCorp */
export const bizErpContCorpApi = {
  /** AS-IS biz.Biz51_ErpContCorp.selectByContStatusCode — contStatusCode 가 없으면 계약상태를 가리지 않는다 */
  search: async (contStatusCode: string | null, searchText: string): Promise<BizErpContCorp[]> => {
    const res = await apiClient.get<ApiResponse<BizErpContCorp[]>>(CORP, { params: { contStatusCode: contStatusCode ?? undefined, searchText } });
    return res.data.data ?? [];
  },
  /** AS-IS getSeq */
  nextId: async (): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>(`${CORP}/next-id`);
    return res.data.data as number;
  },
  /** AS-IS biz.Biz51_ErpContCorp.selectById */
  get: async (erpContCorpId: number): Promise<BizErpContCorp> => {
    const res = await apiClient.get<ApiResponse<BizErpContCorp>>(`${CORP}/${erpContCorpId}`);
    return res.data.data as BizErpContCorp;
  },
  /** AS-IS biz.Biz51_ErpContCorp.insertUpdate */
  save: async (req: BizErpContCorpSaveReq): Promise<BizErpContCorp> => {
    const res = await apiClient.post<ApiResponse<BizErpContCorp>>(CORP, req);
    return res.data.data as BizErpContCorp;
  },
  /** AS-IS biz.Biz51_ErpContCorp.deleteList → 지운 계약사 수 */
  delete: async (erpContCorpIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(CORP, { data: erpContCorpIds });
    return res.data.data ?? 0;
  },
};

/** EE22 Biz52_Lookup_ErpFee (계약사별 사용료) — AS-IS server/biz Biz52_ErpFee */
export const bizErpFeeApi = {
  /** AS-IS biz.Biz52_ErpFee.selectByErpContCorpId */
  search: async (erpContCorpId: number): Promise<BizErpFee[]> => {
    const res = await apiClient.get<ApiResponse<BizErpFee[]>>(FEE, { params: { erpContCorpId } });
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz52_ErpFee.selectByStartDate — 기준일 현재 사용료, 없으면 null */
  current: async (erpContCorpId: number, stdDate: string): Promise<BizErpFee | null> => {
    const res = await apiClient.get<ApiResponse<BizErpFee | null>>(`${FEE}/current`, { params: { erpContCorpId, stdDate } });
    return res.data.data ?? null;
  },
  /** AS-IS biz.Biz52_ErpFee.update — 번호가 0 이하인 새 행은 서버가 번호를 받아 INSERT. 저장한 행을 요청 순서대로 돌려준다 */
  save: async (rows: BizErpFee[]): Promise<BizErpFee[]> => {
    const res = await apiClient.put<ApiResponse<BizErpFee[]>>(FEE, rows);
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz52_ErpFee.delete */
  delete: async (erpFeeIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(FEE, { data: erpFeeIds });
    return res.data.data ?? 0;
  },
};

/** EE22 Biz50_Lookup_ErpSetup (AssetERP 기본설정)·Biz50_Lookup_MailMapping — AS-IS server/biz Biz50_ErpSetup */
export const bizErpSetupApi = {
  /** AS-IS biz.Biz50_ErpSetup.selectAll — 메모·메일양식 행 제외 */
  search: async (): Promise<BizErpSetup[]> => {
    const res = await apiClient.get<ApiResponse<BizErpSetup[]>>(SETUP);
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz50_ErpSetup.selectByStartDate — 없으면 null */
  current: async (stdDate: string): Promise<BizErpSetup | null> => {
    const res = await apiClient.get<ApiResponse<BizErpSetup | null>>(`${SETUP}/current`, { params: { stdDate } });
    return res.data.data ?? null;
  },
  /** AS-IS biz.Biz50_ErpSetup.update */
  save: async (rows: BizErpSetup[]): Promise<BizErpSetup[]> => {
    const res = await apiClient.put<ApiResponse<BizErpSetup[]>>(SETUP, rows);
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz50_ErpSetup.delete */
  delete: async (erpSetupIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(SETUP, { data: erpSetupIds });
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz50_ErpSetup.getNote — 없으면 null */
  note: async (): Promise<string | null> => {
    const res = await apiClient.get<ApiResponse<string | null>>(`${SETUP}/note`);
    return res.data.data ?? null;
  },
  /** AS-IS biz.Biz50_ErpSetup.updateNote */
  saveNote: async (note: string | null): Promise<void> => {
    await apiClient.put<ApiResponse<null>>(`${SETUP}/note`, { note });
  },
  /** AS-IS biz.Biz50_ErpSetup.selectMailForm — 아직 없으면 null */
  mailForm: async (): Promise<BizErpMailForm | null> => {
    const res = await apiClient.get<ApiResponse<BizErpMailForm | null>>(`${SETUP}/mail-form`);
    return res.data.data ?? null;
  },
  /** AS-IS biz.Biz50_ErpSetup.insertMailForm — erpSetupId 가 없으면 새 메일양식 행 */
  saveMailForm: async (erpSetupId: number | null, mailForm: string | null): Promise<BizErpMailForm> => {
    const res = await apiClient.put<ApiResponse<BizErpMailForm>>(`${SETUP}/mail-form`, { erpSetupId, mailForm });
    return res.data.data as BizErpMailForm;
  },
};
