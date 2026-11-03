import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { Dev, DevProgram, DevSaveReq, DevStep, DevStepRule, ExpectProgram, Program, Sr, SrApprStep, SrDevMngSaveReq, SrSaveReq } from '../types/scm';
import { PageRes } from '../types/auth';
import { FileInfo } from '../types/sys';

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

  // ---- 시스템 개발 관리 (EE16, Scm01_Tab_DevMng) ----

  /** AS-IS scm.Scm01_Sr.selectByDevMng — 승인 완료 의뢰 */
  searchDevMng: async (p: { startDate: string; closeDate: string; searchText: string; systemCode: string; srStatus: string; checkBox01: boolean }): Promise<Sr[]> => {
    const res = await apiClient.get<ApiResponse<Sr[]>>('v1/scm/srs/dev-mng', { params: p });
    return res.data.data ?? [];
  },

  /** AS-IS scm.Scm01_Sr.update (Scm01_Edit_DevMng.updateRow) — 저장된 한 행 */
  saveDevMng: async (srId: number, req: SrDevMngSaveReq): Promise<Sr> => {
    const res = await apiClient.put<ApiResponse<Sr>>(`v1/scm/srs/${srId}/dev-mng`, req);
    return res.data.data;
  },

  /** AS-IS scm.Scm01_Sr.updateResultContent */
  updateResultContent: async (srId: number, resultContent: string): Promise<void> => {
    await apiClient.put(`v1/scm/srs/${srId}/result-content`, { resultContent });
  },

  /** AS-IS scm.Scm10_Dev.selectBySrId */
  searchDevs: async (srId: number): Promise<Dev[]> => {
    const res = await apiClient.get<ApiResponse<Dev[]>>('v1/scm/devs', { params: { srId } });
    return res.data.data ?? [];
  },

  /** AS-IS scm.Scm10_Dev.updateList */
  saveDevs: async (devs: DevSaveReq[]): Promise<void> => {
    await apiClient.put('v1/scm/devs', devs);
  },

  /** AS-IS scm.Scm11_DevStep.deleteByDevId + scm.Scm10_Dev.delete */
  deleteDevs: async (devIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/scm/devs', { data: devIds });
    return res.data.data;
  },

  /** AS-IS scm.Scm03_ExpectProgram.selectBySrId */
  searchExpectPrograms: async (srId: number): Promise<ExpectProgram[]> => {
    const res = await apiClient.get<ApiResponse<ExpectProgram[]>>('v1/scm/expect-programs', { params: { srId } });
    return res.data.data ?? [];
  },

  /** AS-IS scm.Scm03_ExpectProgram.update */
  saveExpectPrograms: async (rows: { expectProgramId: number; srId: number | null; programId: number | null }[]): Promise<void> => {
    await apiClient.put('v1/scm/expect-programs', rows);
  },

  /** AS-IS scm.Scm03_ExpectProgram.delete */
  deleteExpectPrograms: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/scm/expect-programs', { data: ids });
    return res.data.data;
  },

  /** AS-IS scm.Scm11_DevStep.selectByDevId */
  searchDevSteps: async (devId: number): Promise<DevStep[]> => {
    const res = await apiClient.get<ApiResponse<DevStep[]>>('v1/scm/dev-steps', { params: { devId } });
    return res.data.data ?? [];
  },

  /** AS-IS scm.Scm11_DevStep.delete + inUpdateProgress (Scm11_Lookup_DevStep.update) */
  saveDevSteps: async (devId: number, deleteIds: number[], steps: { devStepId: number; devStepSeq: string | null; devStepCd: string | null; personId: number | null }[]): Promise<void> => {
    await apiClient.put('v1/scm/dev-steps', { deleteIds, steps }, { params: { devId } });
  },

  /** AS-IS scm.Scm11_DevStep.updateResult */
  updateDevStepResult: async (devStepId: number, result: string): Promise<void> => {
    await apiClient.put(`v1/scm/dev-steps/${devStepId}/result`, { result });
  },

  /** AS-IS scm.Scm12_DevStepRule.getList */
  searchDevStepRules: async (): Promise<DevStepRule[]> => {
    const res = await apiClient.get<ApiResponse<DevStepRule[]>>('v1/scm/dev-step-rules');
    return res.data.data ?? [];
  },

  /** AS-IS scm.Scm12_DevStepRule.delete + updateList */
  saveDevStepRules: async (deleteIds: number[], rules: { devStepRuleId: number; devStepSeq: string | null; devStepCd: string | null }[]): Promise<void> => {
    await apiClient.put('v1/scm/dev-step-rules', { deleteIds, rules });
  },

  /** AS-IS scm.Scm13_DevProgram.selectByDevId */
  searchDevPrograms: async (devId: number): Promise<DevProgram[]> => {
    const res = await apiClient.get<ApiResponse<DevProgram[]>>('v1/scm/dev-programs', { params: { devId } });
    return res.data.data ?? [];
  },

  /** AS-IS getSeq — 변경프로그램 등록 창의 새 프로그램 번호 */
  nextProgramId: async (): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>('v1/scm/dev-programs/next-id');
    return res.data.data;
  },

  /** AS-IS scm.Scm13_DevProgram.modelUpdate */
  saveDevProgram: async (req: {
    devProgramId: number | null; devId: number | null; programId: number; deployTgtYn: string | null; deploySeq: number | null;
    systemCd: string | null; programType: string | null; programCd: string | null; programNm: string | null; source: string | null;
    note: string | null; version: number | null; regDate: string | null; insertWay: 'new' | 'edit';
  }): Promise<void> => {
    await apiClient.put('v1/scm/dev-programs', req);
  },

  /** AS-IS scm.Scm30_Program.selectByTextPaging — 프로그램 선택 창 */
  searchPrograms: async (p: { systemCode: string; programType: string; searchText: string; offset: number; limit: number }): Promise<PageRes<Program>> => {
    const res = await apiClient.get<ApiResponse<PageRes<Program>>>('v1/scm/programs', { params: p });
    return res.data.data;
  },

  /** AS-IS sys.Sys10_File.selectByDevId — 개발 첨부파일 (개발 + 진행단계에 올린 파일) */
  searchDevFiles: async (devId: number): Promise<FileInfo[]> => {
    const res = await apiClient.get<ApiResponse<FileInfo[]>>('v1/sys/files/by-dev', { params: { devId } });
    return res.data.data ?? [];
  },
};
