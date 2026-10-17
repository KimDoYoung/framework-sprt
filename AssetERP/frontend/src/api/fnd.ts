import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { Consignment, OfficeWork, TrustBank } from '../types/fnd';

/** fnd(기관정보) 화면 API (D11~) */
export const fndApi = {
  // ── D11 수탁사정보 관리(관리자) (Fnd03_Tab_ConsignmentManager) ──

  /** AS-IS fnd.Fnd03_Consignment.selectByCompanyId0: 공통 회사(0) 전용 — 사용여부 체크면 사용 중인 것만 */
  searchConsignments: async (searchText: string, useYn: boolean): Promise<Consignment[]> => {
    const res = await apiClient.get<ApiResponse<Consignment[]>>('v1/fnd/consignments', { params: { searchText, useYn } });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd03_Consignment.insertCheck → 저장된 행(요청 순서) */
  saveConsignments: async (rows: Consignment[]): Promise<Consignment[]> => {
    const body = rows.map(({ consignmentId, consignmentCode, consignmentName, useYn, note }) => ({ consignmentId, consignmentCode, consignmentName, useYn, note }));
    const res = await apiClient.put<ApiResponse<Consignment[]>>('v1/fnd/consignments', body);
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd03_Consignment.selectIcamConsignment: ICAM가져오기 — 외부 ICAM DB 연동이 없으면 오류 */
  importIcamConsignments: async (): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('v1/fnd/consignments/import');
  },

  // ── D12 사무수탁사정보 관리(관리자) (Fnd06_Tab_OfficeWorkManager) ──

  /** AS-IS fnd.Fnd06_OfficeWork.selectByCompanyId0: 공통 회사(0) 전용 — 사용여부 체크면 사용 중인 것만 */
  searchOfficeWorks: async (searchText: string, useYn: boolean): Promise<OfficeWork[]> => {
    const res = await apiClient.get<ApiResponse<OfficeWork[]>>('v1/fnd/office-works', { params: { searchText, useYn } });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd06_OfficeWork.update → 저장된 행(요청 순서) */
  saveOfficeWorks: async (rows: OfficeWork[]): Promise<OfficeWork[]> => {
    const body = rows.map(({ officeWorkId, officeWorkName, officeWorkCode, kofiaCode, etcOfficeWorkCode01, useYn, note }) =>
      ({ officeWorkId, officeWorkName, officeWorkCode, kofiaCode, etcOfficeWorkCode01, useYn, note }));
    const res = await apiClient.put<ApiResponse<OfficeWork[]>>('v1/fnd/office-works', body);
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd06_OfficeWork.selectIcamOfficeWork: ICAM가져오기 — 외부 ICAM DB 연동이 없으면 오류 */
  importIcamOfficeWorks: async (): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('v1/fnd/office-works/import');
  },

  // ── D13 수탁은행정보 관리(관리자) (Fnd09_Tab_TrustBankManager) ──

  /** AS-IS fnd.Fnd09_TrustBank.selectByCompanyId0: 공통 회사(0) 전용 — 사용여부 체크면 사용 중인 것만 */
  searchTrustBanks: async (searchText: string, useYn: boolean): Promise<TrustBank[]> => {
    const res = await apiClient.get<ApiResponse<TrustBank[]>>('v1/fnd/trust-banks', { params: { searchText, useYn } });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd09_TrustBank.insertCheck — 원본 서버에 없는 서비스라 서버가 거절 */
  saveTrustBanks: async (rows: TrustBank[]): Promise<TrustBank[]> => {
    const body = rows.map(({ trustBankId, trustBankCode, trustBankName, useYn, note }) => ({ trustBankId, trustBankCode, trustBankName, useYn, note }));
    const res = await apiClient.put<ApiResponse<TrustBank[]>>('v1/fnd/trust-banks', body);
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd09_TrustBank.selectIcamTrustBank: ICAM가져오기 — 외부 ICAM DB 연동이 없으면 오류 */
  importIcamTrustBanks: async (): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('v1/fnd/trust-banks/import');
  },
};
