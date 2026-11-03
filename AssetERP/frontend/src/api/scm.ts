import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { Sr, SrApprStep, SrSaveReq } from '../types/scm';

/** scm(KFS 시스템 개발) 화면 API (EE15~) */
export const scmApi = {
  /** AS-IS scm.Scm01_Sr.selectByText (gubun = sr) */
  searchSrs: async (p: {
    startDate: string; closeDate: string; searchText: string; systemCode: string; srStatus: string;
    checkBox01: boolean; checkBox02: boolean; checkBoxMyReg: boolean;
  }): Promise<Sr[]> => {
    const res = await apiClient.get<ApiResponse<Sr[]>>('v1/scm/srs', { params: p });
    return res.data.data ?? [];
  },

  /** AS-IS scm.Scm01_Sr.selectById */
  getSr: async (srId: number): Promise<Sr> => {
    const res = await apiClient.get<ApiResponse<Sr>>(`v1/scm/srs/${srId}`);
    return res.data.data;
  },

  /** AS-IS getSeq — [등록]의 새 의뢰 번호 */
  nextSrId: async (): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>('v1/scm/srs/next-id');
    return res.data.data;
  },

  /** AS-IS scm.Scm01_Sr.update — 저장된 한 행 */
  saveSr: async (req: SrSaveReq): Promise<Sr> => {
    const res = await apiClient.put<ApiResponse<Sr>>('v1/scm/srs', req);
    return res.data.data;
  },

  /** AS-IS scm.Scm01_Sr.updateContent */
  updateSrContent: async (srId: number, srContent: string): Promise<void> => {
    await apiClient.put(`v1/scm/srs/${srId}/content`, { srContent });
  },

  /** AS-IS scm.Scm01_Sr.delete */
  deleteSrs: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/scm/srs', { data: ids });
    return res.data.data;
  },

  /** AS-IS scm.Scm02_SrApprStep.selectBySrId */
  searchSrApprSteps: async (srId: number): Promise<SrApprStep[]> => {
    const res = await apiClient.get<ApiResponse<SrApprStep[]>>(`v1/scm/srs/${srId}/appr-steps`);
    return res.data.data ?? [];
  },

  /** AS-IS scm.Scm02_SrApprStep.updateList — 그 의뢰의 결재단계를 보낸 줄로 바꾼다 */
  saveSrApprSteps: async (srId: number, steps: SrApprStep[]): Promise<SrApprStep[]> => {
    const res = await apiClient.put<ApiResponse<SrApprStep[]>>(`v1/scm/srs/${srId}/appr-steps`, steps);
    return res.data.data ?? [];
  },

  /** AS-IS Scm01_Edit_Sr.updateApprStep — 승인 '20' / 반려 '30', 마지막 결재자면 last */
  decideSrApprStep: async (stepId: number, stepStatusCd: '20' | '30', last: boolean): Promise<SrApprStep[]> => {
    const res = await apiClient.put<ApiResponse<SrApprStep[]>>(`v1/scm/srs/appr-steps/${stepId}/decision`, { stepStatusCd, last });
    return res.data.data ?? [];
  },

  /** AS-IS Scm02_Edit_NoteMessage.update — 결재의견·반려사유 */
  updateSrApprNote: async (stepId: number, note: string | null, rejectReason: string | null): Promise<void> => {
    await apiClient.put(`v1/scm/srs/appr-steps/${stepId}/note`, { note, rejectReason });
  },
};
