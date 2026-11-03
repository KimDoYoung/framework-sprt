import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import {
  BizErpCompany, BizErpContCorp, BizErpContCorpSaveReq, BizErpFee, BizErpFeeCharge, BizErpFeeChargeSaveReq, BizErpFeeDefault, BizErpMailForm, BizErpSetup,
} from '../types/bizErp';

const CORP = 'v1/biz/erp-cont-corps';
const FEE = 'v1/biz/erp-fees';
const SETUP = 'v1/biz/erp-setups';
const CHARGE = 'v1/biz/erp-fee-charges';

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

/** EE23 Biz55_Tab_ErpFeeCharge (AssetERP 사용료청구) — AS-IS server/biz Biz55_ErpFeeCharge */
export const bizErpFeeChargeApi = {
  /** AS-IS biz.Biz55_ErpFeeCharge.selectByStdDate — stdDate 는 청구년월의 1일 'yyyy-MM-dd' */
  search: async (stdDate: string, searchText: string): Promise<BizErpFeeCharge[]> => {
    const res = await apiClient.get<ApiResponse<BizErpFeeCharge[]>>(CHARGE, { params: { stdDate, searchText } });
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz51_ErpContCorp.selectErpCompany — 계약사 조회창(그 달 청구가 없는 계약사) */
  companies: async (stdDate: string, searchText: string): Promise<BizErpCompany[]> => {
    const res = await apiClient.get<ApiResponse<BizErpCompany[]>>(`${CHARGE}/companies`, { params: { stdDate, searchText } });
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz52_ErpFee.selectDefaultData — 사용료 설정이 없으면 null */
  defaultData: async (erpContCorpId: number, companyId: number | null, startDate: string, closeDate: string): Promise<BizErpFeeDefault | null> => {
    const res = await apiClient.get<ApiResponse<BizErpFeeDefault | null>>(`${CHARGE}/default`, {
      params: { erpContCorpId, companyId: companyId ?? undefined, startDate, closeDate },
    });
    return res.data.data ?? null;
  },
  /** AS-IS biz.Biz55_ErpFeeCharge.updateErpCompany — dataYm 'YYYY.MM' → 만든 건수 */
  create: async (dataYm: string, erpContCorpIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>(CHARGE, { dataYm, erpContCorpIds });
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz55_ErpFeeCharge.insertUpdate */
  save: async (req: BizErpFeeChargeSaveReq): Promise<BizErpFeeCharge> => {
    const res = await apiClient.put<ApiResponse<BizErpFeeCharge>>(CHARGE, req);
    return res.data.data as BizErpFeeCharge;
  },
  /** AS-IS biz.Biz55_ErpFeeCharge.confirmUpdate */
  confirm: async (erpFeeChargeIds: number[], fixYn: boolean): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>(`${CHARGE}/confirm`, { erpFeeChargeIds, fixYn });
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz55_ErpFeeCharge.updateApprId */
  updateApprId: async (apprId: number, erpFeeChargeIds: number[]): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>(`${CHARGE}/appr-id`, { apprId, erpFeeChargeIds });
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz55_ErpFeeCharge.delete → 지운 건수 */
  delete: async (erpFeeChargeIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(CHARGE, { data: erpFeeChargeIds });
    return res.data.data ?? 0;
  },
};
