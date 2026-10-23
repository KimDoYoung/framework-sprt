import { apiClient } from './client';
import { readBlobError } from './file';
import { ApiResponse, PageRes } from '../types/auth';
import { IcsChecklistUser, ClassTreeNode, IcsWriteTreeNode, IcsChecklist, IcsCompliance, IcsComplianceAnswer, IcsComplianceDate, IcsChecklistClassCode, IcsChecklistLClass, IcsChecklistMClass, IcsLawDeadline, ClassTreeSaveReq, IcsFormFile, IcsFormFileAdmin, IcsLaw, IcsLawDetail, IcsLawLookup, IcsLawPeriod, IcsLawView, IcsLawManage, IcsLawExcept, IcsManager, IcsManagerSaveReq, IcsShare, IcsShareSaveReq, IcsCompanyInfoSave, IcsClassTreeItem, IcsRelateFile, IcsRevisionHistory, IcsRevisionHistoryAdmin, IcsRevisionHistoryAdminSaveReq, IcsRevisionLaw, IcsUserRequest, IcsUserRequestSaveReq, IcsUserRequestSearch, IcsUserRequestMySearch, IcsUserRequestMyReq, IcsComplianceWrite, IcsComplianceWriteItem, IcsChecklistWrite, IcsChecklistWriteItem, IcsComplianceConfirm, IcsComplianceReportRow, IcsComplianceReportAppr, IcsChecklistConfirm, IcsChecklistRelateAppr, ChecklistConfirmParams, IcsChecklistStatus, IcsChecklistStatusDetail, IcsExtrActivity, IcsExtrActivitySaveReq } from '../types/ics';

/** ics(내부통제) 화면 API (E01~) */
/** 파일을 받아 저장한다(blob). 오류 응답은 메시지로 바꿔 던진다 */
async function downloadXlsx(path: string, params: Record<string, unknown> | undefined, fileName: string): Promise<void> {
  try {
    const res = await apiClient.get<Blob>(path, { params, responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (err) {
    throw await readBlobError(err);
  }
}

export const icsApi = {
  // ── E01 법규관리(관리자) (Ics01_Tab_ClassTree) ──

  /** AS-IS ics.Ics01_ClassTree.selectByCompanyId(typeCode IC): 사용 중인 분류를 전위 순서로(depth 포함) */
  searchClassTree: async (typeCode = 'IC'): Promise<ClassTreeNode[]> => {
    const res = await apiClient.get<ApiResponse<ClassTreeNode[]>>('v1/ics/class-trees', { params: { typeCode } });
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics01_ClassTree.selectByCompanyId(typeCode %) (Ics01_Tab_ApprList, F03): 법규분류(IC)·법규구분(IT) 전위 순서(depth 포함) */
  searchWriteTree: async (): Promise<IcsWriteTreeNode[]> => {
    const res = await apiClient.get<ApiResponse<IcsWriteTreeNode[]>>('v1/ics/class-trees/write');
    return res.data.data ?? [];
  },

  /** AS-IS Ics01_Edit_ClassTree.update (등록) → 등록된 분류 */
  createClassTree: async (req: ClassTreeSaveReq): Promise<ClassTreeNode | null> => {
    const res = await apiClient.post<ApiResponse<ClassTreeNode>>('v1/ics/class-trees', req);
    return res.data.data ?? null;
  },

  /** AS-IS Ics01_Edit_ClassTree.update (수정) */
  updateClassTree: async (classTreeId: number, req: ClassTreeSaveReq): Promise<ClassTreeNode | null> => {
    const res = await apiClient.put<ApiResponse<ClassTreeNode>>(`v1/ics/class-trees/${classTreeId}`, req);
    return res.data.data ?? null;
  },

  /** AS-IS Ics01_Move_TreeGrid.moveTree: 상위 분류 바꾸기 */
  moveClassTree: async (classTreeId: number, parentTreeId: number): Promise<void> => {
    await apiClient.put<ApiResponse<null>>(`v1/ics/class-trees/${classTreeId}/parent`, { parentTreeId });
  },

  /** AS-IS Ics01_Edit_ClassTree.deleteAll: 하위 분류·법규까지 삭제 → 지운 건수 */
  deleteClassTree: async (classTreeId: number): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/ics/class-trees/${classTreeId}`);
    return res.data.data ?? 0;
  },

  /** AS-IS ics.Ics01_ClassTree.selectByClassTreeId(typeCode IT): 고른 분류와 모든 하위의 법규 */
  searchLaws: async (classTreeId: number, searchText: string, advisYn: boolean, publicType = '%'): Promise<IcsLaw[]> => {
    const res = await apiClient.get<ApiResponse<IcsLaw[]>>('v1/ics/laws', { params: { classTreeId, searchText, advisYn, publicType } });
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics01_ClassTree.refresh: 한 행 다시 읽기 */
  refreshLaw: async (classTreeId: number): Promise<IcsLaw> => {
    const res = await apiClient.get<ApiResponse<IcsLaw>>(`v1/ics/laws/${classTreeId}`);
    return res.data.data as IcsLaw;
  },

  /** AS-IS ics.Ics01_ClassTree.update → 저장된 행(요청 순서) */
  saveLaws: async (rows: IcsLaw[]): Promise<IcsLaw[]> => {
    const body = rows.map(({ classTreeId, parentTreeId, classTreeCode, classTreeName, submitTo, relatedLaw, advisYn }) =>
      ({ classTreeId, parentTreeId, classTreeCode, classTreeName, submitTo, relatedLaw, advisYn }));
    const res = await apiClient.put<ApiResponse<IcsLaw[]>>('v1/ics/laws', body);
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics01_ClassTree.delete → 지운 건수 */
  deleteLaws: async (classTreeIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/ics/laws', { data: classTreeIds });
    return res.data.data ?? 0;
  },

  /** AS-IS Ics01_Move_Grid.moveTree: 법규의 상위 분류 바꾸기 */
  moveLaw: async (classTreeId: number, parentTreeId: number): Promise<void> => {
    await apiClient.put<ApiResponse<null>>(`v1/ics/laws/${classTreeId}/parent`, { parentTreeId });
  },

  /** AS-IS ics.Ics01_ClassTree.modelUpdate (Ics01_Lookup_Content 저장): 상세내용 + 그 행의 편집 열 → 저장된 행 */
  updateLawContent: async (law: IcsLaw, content: string): Promise<IcsLaw> => {
    const { classTreeId, classTreeCode, classTreeName, submitTo, relatedLaw, advisYn } = law;
    const res = await apiClient.put<ApiResponse<IcsLaw>>(`v1/ics/laws/${classTreeId}/content`,
      { content, classTreeCode, classTreeName, submitTo, relatedLaw, advisYn });
    return res.data.data as IcsLaw;
  },

  /** AS-IS sys.Sys11_RelateFile.selectByParentId: 법규에 연결된 서식파일 */
  searchLawFiles: async (classTreeId: number): Promise<IcsRelateFile[]> => {
    const res = await apiClient.get<ApiResponse<IcsRelateFile[]>>(`v1/ics/laws/${classTreeId}/files`);
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys11_RelateFile.insert(relateId, tableName ics01_class_tree) → 새로 연결한 건수 */
  addLawFiles: async (classTreeId: number, fileIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>(`v1/ics/laws/${classTreeId}/files`, { fileIds });
    return res.data.data ?? 0;
  },

  /** AS-IS sys.Sys11_RelateFile.delete → 지운 건수(연결만, 파일은 그대로) */
  deleteLawFiles: async (classTreeId: number, relateFileIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/ics/laws/${classTreeId}/files`, { data: relateFileIds });
    return res.data.data ?? 0;
  },

  /** AS-IS sys.Sys10_File.getIcsFile: 불러올 서식파일 */
  searchFormFiles: async (searchText: string): Promise<IcsFormFile[]> => {
    const res = await apiClient.get<ApiResponse<IcsFormFile[]>>('v1/ics/form-files', { params: { searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys10_File.getIcsFile(lawType null) (Ics01_Tab_IcsFileUser, H07): 법규보고 서식파일 목록 */
  searchFormFilesUser: async (searchText: string): Promise<IcsFormFile[]> => {
    const res = await apiClient.get<ApiResponse<IcsFormFile[]>>('v1/ics/form-files/user', { params: { searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics20_RevisionHistory.selectByClassTreeId: 법규의 개정내역 */
  searchRevisionHistories: async (classTreeId: number): Promise<IcsRevisionHistory[]> => {
    const res = await apiClient.get<ApiResponse<IcsRevisionHistory[]>>('v1/ics/revision-histories', { params: { classTreeId } });
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics20_RevisionHistory.selectByDate (Ics20_Tab_RevisionHistory, H05): 관리자 화면과 같은 SQL, 조회만 */
  searchRevisionPeriod: async (params: {
    startDate: string; closeDate: string; financeAgencyCode: string; searchText: string; relatedLawSearchText: string; dateType: 'reg' | 'effect';
  }): Promise<IcsRevisionHistoryAdmin[]> => {
    const res = await apiClient.get<ApiResponse<IcsRevisionHistoryAdmin[]>>('v1/ics/revision-histories/period', { params });
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics19_RevisionRelateIcs.selectByRevisionHistoryId (Ics20_Edit_RevisionHistory, H05) */
  searchRevisionLawsView: async (revisionHistoryId: number): Promise<IcsRevisionLaw[]> => {
    const res = await apiClient.get<ApiResponse<IcsRevisionLaw[]>>(`v1/ics/revision-histories/${revisionHistoryId}/laws`);
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics20_RevisionHistory.updateContent */
  updateRevisionContent: async (revisionHistoryId: number, content: string): Promise<void> => {
    await apiClient.put<ApiResponse<null>>(`v1/ics/revision-histories/${revisionHistoryId}/content`, { content });
  },

  // ── E02 법규보고 서식파일 등록 (Ics01_Tab_IcsFileUpload) ──

  /** AS-IS sys.Sys10_File.getIcsFile(parentId 0, lawType, searchText): 서식파일 목록. lawType '%'는 전체 */
  searchFormFileAdmin: async (lawType: string, searchText: string): Promise<IcsFormFileAdmin[]> => {
    const res = await apiClient.get<ApiResponse<IcsFormFileAdmin[]>>('v1/ics/form-file-admin', { params: { lawType, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys10_File.update(GridUpdate): 바꾼 행의 내용 저장 → 저장된 행(요청 순서) */
  saveFormFileAdmin: async (rows: IcsFormFileAdmin[]): Promise<IcsFormFileAdmin[]> => {
    const res = await apiClient.put<ApiResponse<IcsFormFileAdmin[]>>('v1/ics/form-file-admin', rows.map(({ fileId, note }) => ({ fileId, note })));
    return res.data.data ?? [];
  },

  /** AS-IS FileUpload?mode=ics01&lawName=&content=&parentId=0: 파일 하나 올리기 → 올린 행 */
  uploadFormFileAdmin: async (lawType: string, note: string, file: File): Promise<IcsFormFileAdmin> => {
    const form = new FormData();
    form.append('file', file);
    const res = await apiClient.post<ApiResponse<IcsFormFileAdmin>>('v1/ics/form-file-admin', form, {
      params: { lawType, note },
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
  // ── E03 법규개정내역 등록 (Ics20_Tab_RevisionHistoryAdmin) ──

  /** AS-IS ics.Ics20_RevisionHistory.selectByDate: dateType 'reg'면 등록일, 'effect'면 시행일 기준. 소관부처 '%'는 전체 */
  searchRevisionHistoryAdmin: async (params: {
    startDate: string; closeDate: string; financeAgencyCode: string; searchText: string; relatedLawSearchText: string; dateType: 'reg' | 'effect';
  }): Promise<IcsRevisionHistoryAdmin[]> => {
    const res = await apiClient.get<ApiResponse<IcsRevisionHistoryAdmin[]>>('v1/ics/revision-history-admin', { params });
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics20_RevisionHistory.update(GridUpdate) → 저장된 행. revisionHistoryId가 없거나 0 이하면 새로 등록 */
  saveRevisionHistoryAdmin: async (req: IcsRevisionHistoryAdminSaveReq): Promise<IcsRevisionHistoryAdmin> => {
    const res = await apiClient.put<ApiResponse<IcsRevisionHistoryAdmin>>('v1/ics/revision-history-admin', req);
    return res.data.data as IcsRevisionHistoryAdmin;
  },

  /** AS-IS ics.Ics20_RevisionHistory.delete → 지운 건수 */
  deleteRevisionHistoryAdmin: async (revisionHistoryId: number): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/ics/revision-history-admin/${revisionHistoryId}`);
    return res.data.data ?? 0;
  },

  /** AS-IS ics.Ics19_RevisionRelateIcs.selectByRevisionHistoryId: 개정내역에 연결된 법규 */
  searchRevisionLaws: async (revisionHistoryId: number): Promise<IcsRevisionLaw[]> => {
    const res = await apiClient.get<ApiResponse<IcsRevisionLaw[]>>(`v1/ics/revision-history-admin/${revisionHistoryId}/laws`);
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics19_RevisionRelateIcs.update(GridUpdate, 새 행): 고른 법규를 연결 → 넣은 행(요청 순서) */
  addRevisionLaws: async (revisionHistoryId: number, classTreeIds: number[]): Promise<IcsRevisionLaw[]> => {
    const res = await apiClient.post<ApiResponse<IcsRevisionLaw[]>>(`v1/ics/revision-history-admin/${revisionHistoryId}/laws`, classTreeIds);
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics19_RevisionRelateIcs.delete → 지운 건수 */
  deleteRevisionLaws: async (revisionRelateIcsIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/ics/revision-history-admin/laws', { data: revisionRelateIcsIds });
    return res.data.data ?? 0;
  },

  /** AS-IS ics.Ics01_ClassTree.selectByTypeCodePaging(typeCode IT): 법규 분류 조회창 페이징. classTreeId가 있으면 그 분류와 모든 하위 */
  searchLawLookup: async (params: {
    classTreeId: number | null; lawSearch: string; statuteSearch: string; detailSearchYn: boolean; offset: number; limit: number;
    /** openUnConn: 'TDM45' + 점검항목 ID — 그 점검항목에 아직 연결 안 된 법규만 */
    relateTable?: string; relateId?: number;
  }): Promise<PageRes<IcsLawLookup>> => {
    const res = await apiClient.get<ApiResponse<PageRes<IcsLawLookup>>>('v1/ics/laws/lookup', { params });
    return res.data.data;
  },

  /** AS-IS ics.Ics01_ClassTree.selectByTypeCodePaging(typeCode IT): 법규조회(H02) 페이징. 개정이력·서식파일 건수·분류·일임 열까지 */
  searchLawView: async (params: {
    classTreeId: number | null; lawSearch: string; statuteSearch: string; detailSearchYn: boolean; advisYn: boolean; offset: number; limit: number;
  }): Promise<PageRes<IcsLawView>> => {
    const res = await apiClient.get<ApiResponse<PageRes<IcsLawView>>>('v1/ics/laws/view', { params });
    return res.data.data;
  },

  /** AS-IS ics.Ics01_ClassTree.selectByPeriod: 월별 법규조회(H04). 날짜는 yyyy-MM-dd, 비운 대분류·중분류·주기·구분은 보내지 않는다(서버가 전체) */
  searchLawPeriod: async (params: {
    startDate: string; closeDate: string; searchText: string; level1Name?: string; level2Name?: string;
    cycleCode?: string; lawPublicType?: string; exceptDailyYn: boolean; advisYn: boolean;
  }): Promise<IcsLawPeriod[]> => {
    const res = await apiClient.get<ApiResponse<IcsLawPeriod[]>>('v1/ics/laws/period', { params });
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics01_ClassTree.selectByParentTreeId(parentTreeId 있음) / selectByAll(없음): 대분류 콤보·중분류 조회창(H04) */
  searchClassTreeItems: async (parentTreeId: number | null, searchText = ''): Promise<IcsClassTreeItem[]> => {
    const res = await apiClient.get<ApiResponse<IcsClassTreeItem[]>>('v1/ics/class-trees/items', {
      params: { ...(parentTreeId != null ? { parentTreeId } : {}), searchText },
    });
    return res.data.data ?? [];
  },

  // ── E03-1 법규상세 창 (Ics01_Lookup_ClassTreeDetail) ──

  /** AS-IS ics.Ics01_ClassTree.selectById: 법규상세 창의 값 */
  getLawDetail: async (classTreeId: number): Promise<IcsLawDetail> => {
    const res = await apiClient.get<ApiResponse<IcsLawDetail>>(`v1/ics/laws/${classTreeId}/detail`);
    return res.data.data;
  },

  // ── E04 내부통제 체크리스트(관리자) (Ics10_Tab_ChecklistAdmin) ──

  /** AS-IS ics.Ics10_Checklist.selectByAdmin: 대분류·중분류 없으면 전체, useYn '%'(전체)·'true'·'false' */
  searchChecklists: async (params: { checklistLClassId?: number | null; checklistMClassId?: number | null; useYn: string; searchText: string }): Promise<IcsChecklist[]> => {
    const res = await apiClient.get<ApiResponse<IcsChecklist[]>>('v1/ics/checklists', { params });
    return res.data.data ?? [];
  },

  /** 새 체크리스트의 id (AS-IS GridInsertRow가 getSeq로 받던 id) */
  getChecklistNextId: async (): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>('v1/ics/checklists/next-id');
    return res.data.data;
  },

  /** AS-IS ics.Ics10_Checklist.modelUpdate → 저장된 행 */
  saveChecklist: async (row: { checklistId?: number | null; content?: string | null; criterion?: string | null; useYn?: string | null; checklistMClassId?: number | null; seq?: number | null }): Promise<IcsChecklist> => {
    const res = await apiClient.put<ApiResponse<IcsChecklist>>('v1/ics/checklists', row);
    return res.data.data;
  },

  /** AS-IS ics.Ics10_Checklist.delete → 지운 건수 */
  deleteChecklists: async (checklistIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/ics/checklists', { data: checklistIds });
    return res.data.data ?? 0;
  },

  /** AS-IS sys.Sys09_Code.selectByIcs21: 사용 중인 대분류 (기준일을 안 주면 오늘 — K05는 기준 분기(월)의 말일) */
  searchChecklistLCodes: async (stdDate?: string): Promise<IcsChecklistClassCode[]> => {
    const res = await apiClient.get<ApiResponse<IcsChecklistClassCode[]>>('v1/ics/checklists/l-codes', { params: { stdDate } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys09_Code.selectByIcs23: 사용 중인 중분류(대분류를 주면 그 아래만) */
  searchChecklistMCodes: async (checklistLClassId?: number | null, stdDate?: string): Promise<IcsChecklistClassCode[]> => {
    const res = await apiClient.get<ApiResponse<IcsChecklistClassCode[]>>('v1/ics/checklists/m-codes', { params: { checklistLClassId, stdDate } });
    return res.data.data ?? [];
  },

  // ── E04 체크리스트 분류관리 (Ics21_Lookup_CheckList·Ics23_TabPage_CheckList) ──

  /** AS-IS ics.Ics21_ChecklistLClass.selectByCompanyId */
  searchChecklistLClasses: async (): Promise<IcsChecklistLClass[]> => {
    const res = await apiClient.get<ApiResponse<IcsChecklistLClass[]>>('v1/ics/checklist-classes/l');
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics21_ChecklistLClass.update → 저장 뒤 대분류 목록. 새 행(id ≤ 0)은 id를 빼고 보낸다 */
  saveChecklistLClasses: async (rows: IcsChecklistLClass[]): Promise<IcsChecklistLClass[]> => {
    const body = rows.map(({ checklistLClassId, checklistLClassName, note, seq, useYn, closeDate }) =>
      ({ checklistLClassId: checklistLClassId > 0 ? checklistLClassId : null, checklistLClassName, note, seq, useYn, closeDate }));
    const res = await apiClient.put<ApiResponse<IcsChecklistLClass[]>>('v1/ics/checklist-classes/l', body);
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics21_ChecklistLClass.deleteCheck → 작성 기록이 있어 못 지우는 분류 수 */
  checkDeleteChecklistLClasses: async (ids: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/ics/checklist-classes/l/check-delete', ids);
    return res.data.data ?? 0;
  },

  /** AS-IS ics.Ics21_ChecklistLClass.delete → 지운 건수 */
  deleteChecklistLClasses: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/ics/checklist-classes/l', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS ics.Ics23_ChecklistMClass.selectByCompanyId */
  searchChecklistMClasses: async (checklistLClassId: number): Promise<IcsChecklistMClass[]> => {
    const res = await apiClient.get<ApiResponse<IcsChecklistMClass[]>>('v1/ics/checklist-classes/m', { params: { checklistLClassId } });
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics23_ChecklistMClass.update → 저장 뒤 그 대분류의 중분류 목록 */
  saveChecklistMClasses: async (rows: IcsChecklistMClass[]): Promise<IcsChecklistMClass[]> => {
    const body = rows.map(({ checklistMClassId, checklistLClassId, checklistMClassName, note, seq, useYn, closeDate }) =>
      ({ checklistMClassId: checklistMClassId > 0 ? checklistMClassId : null, checklistLClassId, checklistMClassName, note, seq, useYn, closeDate }));
    const res = await apiClient.put<ApiResponse<IcsChecklistMClass[]>>('v1/ics/checklist-classes/m', body);
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics23_ChecklistMClass.deleteCheck */
  checkDeleteChecklistMClasses: async (ids: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/ics/checklist-classes/m/check-delete', ids);
    return res.data.data ?? 0;
  },

  /** AS-IS ics.Ics23_ChecklistMClass.delete */
  deleteChecklistMClasses: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/ics/checklist-classes/m', { data: ids });
    return res.data.data ?? 0;
  },

  // ── K04 내부통제 체크리스트 관리 (Ics10_Tab_Checklist) ──

  /** AS-IS ics.Ics10_Checklist.selectBySearchText: 대분류·중분류 없으면 전체, useYn '%'(전체)·'true'·'false' */
  searchChecklistsForCompany: async (params: { checklistLClassId?: number | null; checklistMClassId?: number | null; useYn: string; searchText: string }): Promise<IcsChecklistUser[]> => {
    const res = await apiClient.get<ApiResponse<IcsChecklistUser[]>>('v1/ics/checklists/company', { params });
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics10_Checklist.preDelete → 작성내역이 있어 못 지우는 체크리스트 수 */
  checkDeleteChecklists: async (checklistIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/ics/checklists/check-delete', checklistIds);
    return res.data.data ?? 0;
  },

  /** AS-IS ics.Ics11_ChecklistCompany.updateUseYn */
  updateChecklistUseYn: async (rows: { checklistId: number; useYn: string }[]): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/ics/checklists/use-yn', rows);
    return res.data.data ?? 0;
  },

  /** AS-IS ics.Ics11_ChecklistCompany.updateWriteGroupId (writeGroupId null = 지정 해제) */
  updateChecklistWriteGroup: async (writeGroupId: number | null, checklists: { checklistId: number; useYn: string }[]): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/ics/checklists/write-group', { writeGroupId, checklists });
    return res.data.data ?? 0;
  },

  /** 출력/다운로드 (AS-IS Sys99_Print.insertRdCheckList + RD 리포트 Ics10_Rd_Checklist → 한 시트 xlsx) */
  downloadChecklistExcel: async (params: { checklistLClassId?: number | null; checklistMClassId?: number | null; searchText: string }): Promise<void> => {
    await downloadXlsx('v1/ics/checklists/excel', params, '내부통제 체크리스트.xlsx');
  },

  /** 템플릿 받기 (AS-IS downloadForm → ./excelTemplete/Template_내부통제 체크리스트.xlsx) */
  downloadChecklistTemplate: async (): Promise<void> => {
    await downloadXlsx('v1/ics/checklists/template', undefined, 'Template_내부통제 체크리스트.xlsx');
  },

  /** 데이터업로드 (AS-IS ExcelUpload?uploadType=icsChecklistUpload) → 넣은 건수 */
  uploadChecklistExcel: async (file: File): Promise<number> => {
    const form = new FormData();
    form.append('excelUpload', file);
    const res = await apiClient.post<ApiResponse<number>>('v1/ics/checklists/excel', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.data ?? 0;
  },

  /** AS-IS ics.Ics01_ClassTree.selectByListIcsId (Ics01_Lookup_SelectMulti "deadline"): 고른 법규와 그 기한 */
  searchLawDeadlines: async (classTreeIds: number[]): Promise<IcsLawDeadline[]> => {
    const res = await apiClient.get<ApiResponse<IcsLawDeadline[]>>('v1/ics/laws/with-deadlines', { params: { classTreeIds: classTreeIds.join(',') } });
    return res.data.data ?? [];
  },

  // ── E05 임직원 내부통제 준수리스트 (Ics30_Tab_Compliance·Ics30_Lookup_Insert·Ics33_TabPage_ComplianceAnswer) ──

  /** AS-IS ics.Ics30_Compliance.groupByStartDate: 기준 적용일 목록 */
  searchComplianceDates: async (): Promise<IcsComplianceDate[]> => {
    const res = await apiClient.get<ApiResponse<IcsComplianceDate[]>>('v1/ics/compliances/dates');
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics30_Compliance.insert (Ics30_Lookup_Insert): 새 기준 적용일('YYYY-MM-DD') — 이전 준수항목·답변을 복사 */
  createComplianceDate: async (startDate: string): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('v1/ics/compliances/dates', { startDate });
  },

  /** AS-IS ics.Ics30_Compliance.deleteByDate: 작성 기록이 있으면 서버가 거절한다 */
  deleteComplianceDate: async (startDate: string): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>('v1/ics/compliances/dates', { params: { startDate } });
  },

  /** AS-IS ics.Ics30_Compliance.updateDateFixYn: 확정('true')·확정취소('false') */
  updateComplianceDateFix: async (startDate: string, dateFixYn: 'true' | 'false'): Promise<void> => {
    await apiClient.put<ApiResponse<null>>('v1/ics/compliances/dates/fix', { startDate, dateFixYn });
  },

  /** AS-IS ics.Ics31_ComplianceWrite.selectByStartDate: 기준 적용일 이후 작성 기록이 있는가 */
  hasComplianceWriteAfter: async (startDate: string): Promise<boolean> => {
    const res = await apiClient.get<ApiResponse<boolean>>('v1/ics/compliances/dates/has-write-after', { params: { startDate } });
    return !!res.data.data;
  },

  /** AS-IS ics.Ics30_Compliance.checkDate: 그 기준 적용일의 준수항목에 작성 기록이 있는가 */
  hasComplianceWrite: async (startDate: string): Promise<boolean> => {
    const res = await apiClient.get<ApiResponse<boolean>>('v1/ics/compliances/dates/has-write', { params: { startDate } });
    return !!res.data.data;
  },

  /** AS-IS ics.Ics30_Compliance.selectByStartDate */
  searchCompliances: async (startDate: string): Promise<IcsCompliance[]> => {
    const res = await apiClient.get<ApiResponse<IcsCompliance[]>>('v1/ics/compliances', { params: { startDate } });
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics30_Compliance.updateList(actionCode "check"): 1 그대로 / 1 초과 확인 창 / 1 미만 못 지움. 새 행(id ≤ 0)은 id를 빼고 보낸다 */
  checkSaveCompliances: async (rows: IcsCompliance[], deleteIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/ics/compliances/save-check', { rows: complianceBody(rows), deleteIds });
    return res.data.data ?? 1;
  },

  /** AS-IS ics.Ics30_Compliance.updateList(actionCode "yes") → 저장·삭제한 건수 */
  saveCompliances: async (rows: IcsCompliance[], deleteIds: number[]): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/ics/compliances', { rows: complianceBody(rows), deleteIds });
    return res.data.data ?? 0;
  },

  /** AS-IS ics.Ics33_ComplianceAnswer.selectByCompanyId */
  searchComplianceAnswers: async (startDate: string, complianceType: string): Promise<IcsComplianceAnswer[]> => {
    const res = await apiClient.get<ApiResponse<IcsComplianceAnswer[]>>('v1/ics/compliance-answers', { params: { startDate, complianceType } });
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics33_ComplianceAnswer.update. 새 행(id ≤ 0)은 id를 빼고 보낸다 */
  saveComplianceAnswers: async (rows: IcsComplianceAnswer[]): Promise<number> => {
    const body = rows.map(({ complianceAnswerId, startDate, complianceType, caseNo, answer1Cd, answer2Cd, answer3Cd, answer4Cd, answer5Cd }) =>
      ({ complianceAnswerId: complianceAnswerId > 0 ? complianceAnswerId : null, startDate, complianceType, caseNo, answer1Cd, answer2Cd, answer3Cd, answer4Cd, answer5Cd }));
    const res = await apiClient.put<ApiResponse<number>>('v1/ics/compliance-answers', body);
    return res.data.data ?? 0;
  },

  /** AS-IS ics.Ics33_ComplianceAnswer.delete → 지운 건수 */
  deleteComplianceAnswers: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/ics/compliance-answers', { data: ids });
    return res.data.data ?? 0;
  },

  // ── E09 법규등록신청확인 (Ics17_Tab_UserRequestAdmin) ──

  /** AS-IS ics.Ics17_UserRequest.selectBySearchTextAdmin (관리자) */
  searchUserRequestsAdmin: async (params: IcsUserRequestSearch): Promise<IcsUserRequest[]> => {
    const res = await apiClient.get<ApiResponse<IcsUserRequest[]>>('v1/ics/user-requests/admin', { params });
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics17_UserRequest.update → 저장된 행 */
  updateUserRequest: async (userRequestId: number, req: IcsUserRequestSaveReq): Promise<IcsUserRequest> => {
    const res = await apiClient.put<ApiResponse<IcsUserRequest>>(`v1/ics/user-requests/${userRequestId}`, req);
    return res.data.data;
  },

  /** AS-IS ics.Ics17_UserRequest.updateLawContent → 저장된 행 */
  updateUserRequestLawContent: async (userRequestId: number, lawContent: string): Promise<IcsUserRequest> => {
    const res = await apiClient.put<ApiResponse<IcsUserRequest>>(`v1/ics/user-requests/${userRequestId}/law-content`, { lawContent });
    return res.data.data;
  },

  // ── H11 법규등록신청 (Ics17_Tab_UserRequest, 로그인 회사) ──

  /** AS-IS ics.Ics17_UserRequest.selectBySearchText */
  searchUserRequests: async (params: IcsUserRequestMySearch): Promise<IcsUserRequest[]> => {
    const res = await apiClient.get<ApiResponse<IcsUserRequest[]>>('v1/ics/user-requests/my', { params });
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics17_UserRequest.update (새 행) → 저장된 행 */
  createUserRequest: async (req: IcsUserRequestMyReq): Promise<IcsUserRequest> => {
    const res = await apiClient.post<ApiResponse<IcsUserRequest>>('v1/ics/user-requests/my', req);
    return res.data.data;
  },

  /** AS-IS ics.Ics17_UserRequest.update (기존 행) → 저장된 행 */
  updateMyUserRequest: async (userRequestId: number, req: IcsUserRequestMyReq): Promise<IcsUserRequest> => {
    const res = await apiClient.put<ApiResponse<IcsUserRequest>>(`v1/ics/user-requests/my/${userRequestId}`, req);
    return res.data.data;
  },

  /** AS-IS ics.Ics17_UserRequest.delete */
  deleteUserRequest: async (userRequestId: number): Promise<void> => {
    await apiClient.delete(`v1/ics/user-requests/my/${userRequestId}`);
  },

  // ── H08 법규관리 (Ics01_Tab_ClassTreeUser) ──

  /** AS-IS ics.Ics01_ClassTree.selectByTypeCodePaging(typeCode IT): 법규관리(H08) 페이징. mngGroupId = 관리그룹 */
  searchLawManage: async (params: {
    classTreeId: number | null; lawSearch: string; statuteSearch: string; detailSearchYn: boolean; advisYn: boolean; mngGroupId: number | null; offset: number; limit: number;
  }): Promise<PageRes<IcsLawManage>> => {
    const res = await apiClient.get<ApiResponse<PageRes<IcsLawManage>>>('v1/ics/laws/manage', { params });
    return res.data.data;
  },

  /** AS-IS ics.Ics01_ClassTree.refresh (H08): 서식파일 창을 닫은 뒤 한 행 */
  refreshLawManage: async (classTreeId: number): Promise<IcsLawManage> => {
    const res = await apiClient.get<ApiResponse<IcsLawManage>>(`v1/ics/laws/${classTreeId}/manage`);
    return res.data.data;
  },

  /** AS-IS ics.Ics01_ClassTree.selectByExcept (Ics01_Lookup_Except, H08). exceptYn 'true'(미사용)·'false'(사용)·비우면 전체 */
  searchLawExcept: async (params: { classTreeId: number | null; exceptYn?: string; searchText: string; detailSearchYn: boolean }): Promise<IcsLawExcept[]> => {
    const res = await apiClient.get<ApiResponse<IcsLawExcept[]>>('v1/ics/laws/except', { params });
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics03_CompanyInfo.modelUpdate (H08): 법규별 제외·자동·일임을 회사 설정에 저장 */
  saveCompanyInfo: async (rows: IcsCompanyInfoSave[]): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/ics/laws/company-info', rows);
    return res.data.data ?? 0;
  },

  /** AS-IS ics.Ics02_Manager.selectByCompanyId (Ics02_Lookup_Manager, H08): 로그인 회사의 관리그룹 */
  searchManagers: async (): Promise<IcsManager[]> => {
    const res = await apiClient.get<ApiResponse<IcsManager[]>>('v1/ics/managers');
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics04_Share.selectByManagerId (Ics01_Lookup_Share, H08): 관리그룹의 공유 */
  searchManagerShares: async (managerId: number): Promise<IcsShare[]> => {
    const res = await apiClient.get<ApiResponse<IcsShare[]>>(`v1/ics/managers/${managerId}/shares`);
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics02_Manager.update (Ics02_Tab_Manager, H10): 관리그룹 저장(새 행 id ≤ 0) → 저장된 행 */
  saveManagers: async (rows: IcsManagerSaveReq[]): Promise<IcsManager[]> => {
    const res = await apiClient.put<ApiResponse<IcsManager[]>>('v1/ics/managers', rows);
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics02_Manager.checkRelateIcs (H10): 하나라도 법규에 연결돼 있으면 true */
  isManagersInUse: async (managerIds: number[]): Promise<boolean> => {
    const res = await apiClient.get<ApiResponse<boolean>>('v1/ics/managers/in-use', { params: { managerIds: managerIds.join(',') } });
    return res.data.data ?? false;
  },

  /** AS-IS ics.Ics02_Manager.delete (H10) → 지운 수 */
  deleteManagers: async (managerIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/ics/managers', { data: managerIds });
    return res.data.data ?? 0;
  },

  /** AS-IS ics.Ics04_Share.update (Ics04_Page_Share, H10): 관리그룹의 공유 부서 저장 → 저장된 행 */
  saveManagerShares: async (managerId: number, rows: IcsShareSaveReq[]): Promise<IcsShare[]> => {
    const res = await apiClient.put<ApiResponse<IcsShare[]>>(`v1/ics/managers/${managerId}/shares`, rows);
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics04_Share.delete (H10) → 지운 수 */
  deleteManagerShares: async (managerId: number, shareIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/ics/managers/${managerId}/shares`, { data: shareIds });
    return res.data.data ?? 0;
  },

  /** AS-IS ics.Ics05_RelateManager.selectByClassTreeId (없으면 ics.Ics02_Manager.getDefaultYn) (Ics01_Lookup_Share, H08) */
  getRelateManager: async (classTreeId: number): Promise<IcsManager> => {
    const res = await apiClient.get<ApiResponse<IcsManager>>('v1/ics/relate-managers', { params: { classTreeId } });
    return res.data.data;
  },

  /** AS-IS ics.Ics05_RelateManager.relateUpdate (H08): 고른 법규들을 관리그룹에 연결 → 바뀐 법규관리 행들 */
  relateManager: async (managerId: number, classTreeIds: number[]): Promise<IcsLawManage[]> => {
    const res = await apiClient.put<ApiResponse<IcsLawManage[]>>('v1/ics/relate-managers', { managerId, classTreeIds });
    return res.data.data ?? [];
  },

  // ── K05 내부통제 체크리스트 작성 (Ics15_Tab_ChecklistWrite·Ics15_Edit_Reason) ──

  /** AS-IS sys.Sys01_Company.selectById 중 체크주기: 'M'(월) / 'Q'(분기) / 설정 없음 null */
  getChecklistWriteCycleType: async (): Promise<string | null> => {
    const res = await apiClient.get<ApiResponse<string | null>>('v1/ics/checklist-writes/cycle-type');
    return res.data.data ?? null;
  },

  /** AS-IS ics.Ics10_Checklist.selectByPersonId: stdDate = 기준 분기(월)의 말일, checkBox = 미체크 보기 */
  searchChecklistWrites: async (params: { stdDate: string; cycleType: string; checklistLClassId?: number | null; checklistMClassId?: number | null; searchText: string; checkBox: boolean }): Promise<IcsChecklistWrite[]> => {
    const res = await apiClient.get<ApiResponse<IcsChecklistWrite[]>>('v1/ics/checklist-writes', { params });
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics15_ChecklistWrite.updateAnswerCode: answerCode Y(예)·N(아니오)·X(해당없음). yyyymm = 'yyyy.MM' */
  updateChecklistWriteAnswer: async (checklistId: number, answerCode: string, yyyymm: string, cycleType: string): Promise<IcsChecklistWriteItem> => {
    const res = await apiClient.put<ApiResponse<IcsChecklistWriteItem>>('v1/ics/checklist-writes/answers', { checklistId, answerCode, yyyymm, cycleType });
    return res.data.data as IcsChecklistWriteItem;
  },

  /** AS-IS ics.Ics15_ChecklistWrite.modelUpdate(새 행): 사유 창을 처음 열 때 답변 없는 작성 행을 만든다 */
  createChecklistWrite: async (checklistId: number, yyyymm: string, cycleType: string): Promise<IcsChecklistWriteItem> => {
    const res = await apiClient.post<ApiResponse<IcsChecklistWriteItem>>('v1/ics/checklist-writes', { checklistId, yyyymm, cycleType });
    return res.data.data as IcsChecklistWriteItem;
  },

  /** AS-IS ics.Ics15_ChecklistWrite.selectById */
  getChecklistWrite: async (checklistWriteId: number): Promise<IcsChecklistWriteItem> => {
    const res = await apiClient.get<ApiResponse<IcsChecklistWriteItem>>(`v1/ics/checklist-writes/${checklistWriteId}`);
    return res.data.data as IcsChecklistWriteItem;
  },

  /** AS-IS ics.Ics15_ChecklistWrite.modelUpdate: 사유 저장 */
  updateChecklistWriteReason: async (checklistWriteId: number, reason: string): Promise<IcsChecklistWriteItem> => {
    const res = await apiClient.put<ApiResponse<IcsChecklistWriteItem>>(`v1/ics/checklist-writes/${checklistWriteId}/reason`, { reason });
    return res.data.data as IcsChecklistWriteItem;
  },

  /** AS-IS ics.Ics15_ChecklistWrite.updateFixYn: 제출(true)·제출취소(false) */
  updateChecklistWriteFix: async (fixYn: boolean, writeIds: number[]): Promise<void> => {
    await apiClient.put<ApiResponse<number>>('v1/ics/checklist-writes/fix', { fixYn, writeIds });
  },

  /** AS-IS ics.Ics15_ChecklistWrite.deleteByPersonId (새로작성): 작성내역이 없거나 확인이 끝난 내역이 있으면 서버가 거절한다 */
  deleteChecklistWrites: async (stdDate: string, cycleType: string): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/ics/checklist-writes', { params: { stdDate, cycleType } });
    return res.data.data ?? 0;
  },

  // ── K01 내부통제 준수확인서 작성 (Ics31_Tab_ComplianceWrite·Ics31_Edit_Reason) ──

  /** AS-IS sys.Sys01_Company.selectById 중 체크주기: 'M'(월) / 'Q'(분기) / 설정 없음 null */
  getComplianceWriteCycleType: async (): Promise<string | null> => {
    const res = await apiClient.get<ApiResponse<string | null>>('v1/ics/compliance-writes/cycle-type');
    return res.data.data ?? null;
  },

  /** AS-IS ics.Ics30_Compliance.selectByPersonId: stdDate = 기준 분기(월)의 말일, checkBox = 미체크 보기 */
  searchComplianceWrites: async (stdDate: string, cycleType: string, checkBox: boolean): Promise<IcsComplianceWrite[]> => {
    const res = await apiClient.get<ApiResponse<IcsComplianceWrite[]>>('v1/ics/compliance-writes', { params: { stdDate, cycleType, checkBox } });
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics31_ComplianceWrite.updateAnswerCode: answerCode Y(예)·N(아니오)·X(해당없음), null이면 비운다. yyyymm = 'yyyy.MM' */
  updateComplianceWriteAnswer: async (complianceId: number, answerCode: string | null, yyyymm: string, cycleType: string): Promise<IcsComplianceWriteItem> => {
    const res = await apiClient.put<ApiResponse<IcsComplianceWriteItem>>('v1/ics/compliance-writes/answers', { complianceId, answerCode, yyyymm, cycleType });
    return res.data.data as IcsComplianceWriteItem;
  },

  /** AS-IS ics.Ics31_ComplianceWrite.modelUpdate(새 행): 사유 창을 처음 열 때 답변 없는 작성 행을 만든다 */
  createComplianceWrite: async (complianceId: number, yyyymm: string, cycleType: string): Promise<IcsComplianceWriteItem> => {
    const res = await apiClient.post<ApiResponse<IcsComplianceWriteItem>>('v1/ics/compliance-writes', { complianceId, yyyymm, cycleType });
    return res.data.data as IcsComplianceWriteItem;
  },

  /** AS-IS ics.Ics31_ComplianceWrite.selectById */
  getComplianceWrite: async (complianceWriteId: number): Promise<IcsComplianceWriteItem> => {
    const res = await apiClient.get<ApiResponse<IcsComplianceWriteItem>>(`v1/ics/compliance-writes/${complianceWriteId}`);
    return res.data.data as IcsComplianceWriteItem;
  },

  /** AS-IS ics.Ics31_ComplianceWrite.modelUpdate: 사유 저장 */
  updateComplianceWriteReason: async (complianceWriteId: number, reason: string): Promise<IcsComplianceWriteItem> => {
    const res = await apiClient.put<ApiResponse<IcsComplianceWriteItem>>(`v1/ics/compliance-writes/${complianceWriteId}/reason`, { reason });
    return res.data.data as IcsComplianceWriteItem;
  },

  /** AS-IS ics.Ics31_ComplianceWrite.updateFixYn: 제출(true)·제출취소(false) */
  updateComplianceWriteFix: async (fixYn: boolean, writeIds: number[]): Promise<void> => {
    await apiClient.put<ApiResponse<number>>('v1/ics/compliance-writes/fix', { fixYn, writeIds });
  },

  /** AS-IS ics.Ics31_ComplianceWrite.deleteByPersonId (새로작성): 제출한 내역이 있으면 서버가 거절한다 */
  deleteComplianceWrites: async (stdDate: string, cycleType: string): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/ics/compliance-writes', { params: { stdDate, cycleType } });
    return res.data.data ?? 0;
  },

  /** 엑셀다운로드 (AS-IS Sys99_Print.insertRdComplianceWrite + RD 리포트 Ics31_Rd_ComplianceWrite → 한 시트 xlsx). fileName은 확장자 없이 */
  downloadComplianceWriteExcel: async (stdDate: string, cycleType: string, checkBox: boolean, fileName: string): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/ics/compliance-writes/excel', { params: { stdDate, cycleType, checkBox }, responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      throw await readBlobError(err);
    }
  },

  // ── K02 내부통제 준수점검(준감인) (Ics31_Tab_ComplianceConfirm) ──

  /** AS-IS ics.Ics30_Compliance.selectByPaging: stdDate = 기준 분기(월)의 말일, checkBox = 미확인건만 조회. 검색어의 앞뒤 %는 서버가 붙인다 */
  searchComplianceConfirms: async (params: { stdDate: string; cycleType: string; searchText: string; checkBox: boolean; offset: number; limit: number }): Promise<PageRes<IcsComplianceConfirm>> => {
    const res = await apiClient.get<ApiResponse<PageRes<IcsComplianceConfirm>>>('v1/ics/compliance-confirms', { params });
    return res.data.data as PageRes<IcsComplianceConfirm>;
  },

  /** AS-IS ics.Ics31_ComplianceWrite.updateConfirmYn: 고른 작성 행을 확인(true)·확인취소(false) */
  updateComplianceConfirm: async (confirmYn: boolean, writeIds: number[]): Promise<void> => {
    await apiClient.put<ApiResponse<number>>('v1/ics/compliance-confirms/confirm', { confirmYn, writeIds });
  },

  // ── K06 내부통제내역 확인(부서장) (Ics15_Tab_ChecklistConfirm·Ics16_Lookup_RelateAppr) ──

  /** AS-IS ics.Ics11_ChecklistCompany.selectChecklistStatusPaging: stdDate = 기준 분기(월)의 말일, 확인자 = 로그인 사용자. 검색어의 앞뒤 %는 서버가 붙인다 */
  searchChecklistConfirms: async (params: ChecklistConfirmParams & { offset: number; limit: number }): Promise<PageRes<IcsChecklistConfirm>> => {
    const res = await apiClient.get<ApiResponse<PageRes<IcsChecklistConfirm>>>('v1/ics/checklist-confirms', { params });
    return res.data.data as PageRes<IcsChecklistConfirm>;
  },

  /** 출력/다운로드 (AS-IS Sys99_Print.insertRdChecklistConfirm + RD 리포트 Ics15_Rd_ChecklistConfirm → 한 시트 xlsx). 조회 조건 그대로 전체 행 */
  downloadChecklistConfirmExcel: async (params: ChecklistConfirmParams, fileName: string): Promise<void> => {
    await downloadXlsx('v1/ics/checklist-confirms/excel', { ...params, fileName }, `${fileName}.xlsx`);
  },

  /** AS-IS ics.Ics15_ChecklistWrite.updateConfirmYn: 고른 행을 확인(true)·확인취소(false). yyyymm = 'yyyy.MM' */
  updateChecklistConfirm: async (confirmYn: boolean, yyyymm: string, cycleType: string, rows: { checklistId: number; personId: number }[]): Promise<void> => {
    await apiClient.put<ApiResponse<number>>('v1/ics/checklist-confirms/confirm', { confirmYn, yyyymm, cycleType, rows });
  },

  /** AS-IS ics.Ics16_RelateAppr.selectByConfirmerId: 대분류별 전체·확인 건수와 결재 상태 (상신 조회창) */
  searchChecklistRelateApprs: async (stdDate: string, cycleType: string): Promise<IcsChecklistRelateAppr[]> => {
    const res = await apiClient.get<ApiResponse<IcsChecklistRelateAppr[]>>('v1/ics/checklist-confirms/relate-apprs', { params: { stdDate, cycleType } });
    return res.data.data ?? [];
  },

  // ── K07 내부통제내역 현황(준감인) (Ics15_Tab_ChecklistStatus·Ics15_Lookup_ChecklistStatusDetail) ──

  /** AS-IS sys.Sys99_Print.insertIcsCheckListStatus: 체크리스트별 월(분기)별 체크·확인 현황. year = 조회년도 4자리, 검색어의 앞뒤 %는 서버가 붙인다 */
  searchChecklistStatus: async (params: { year: string; cycleType: string; checklistLClassId?: number | null; checklistMClassId?: number | null; searchText: string }): Promise<IcsChecklistStatus[]> => {
    const res = await apiClient.get<ApiResponse<IcsChecklistStatus[]>>('v1/ics/checklist-status', { params });
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics11_ChecklistCompany.selectByChecklistIdStatus: 한 체크리스트의 담당자별 내역 (상세 조회창). stdDate = 그 월(분기)의 말일 */
  searchChecklistStatusByChecklist: async (checklistId: number, params: { stdDate: string; cycleType: string; unCheckYn: boolean; unConfirmYn: boolean }): Promise<IcsChecklistStatusDetail[]> => {
    const res = await apiClient.get<ApiResponse<IcsChecklistStatusDetail[]>>(`v1/ics/checklist-status/checklists/${checklistId}`, { params });
    return res.data.data ?? [];
  },

  // ── K08 내부통제내역 상세(준감인) (Ics15_Tab_ChecklistStatusDetail) ──

  /** AS-IS ics.Ics11_ChecklistCompany.selectChecklistStatusPaging: stdDate = 기준 분기(월)의 말일. K06과 달리 확인자 조건이 없다(회사 전체). 검색어의 앞뒤 %는 서버가 붙인다 */
  searchChecklistStatusDetails: async (params: ChecklistConfirmParams & { offset: number; limit: number }): Promise<PageRes<IcsChecklistStatusDetail>> => {
    const res = await apiClient.get<ApiResponse<PageRes<IcsChecklistStatusDetail>>>('v1/ics/checklist-status/details', { params });
    return res.data.data as PageRes<IcsChecklistStatusDetail>;
  },

  /** 출력/다운로드 (AS-IS Sys99_Print.insertRdChecklistDetail + RD 리포트 Ics15_Rd_ChecklistDetail → 한 시트 xlsx). 조회 조건 그대로 전체 행 */
  downloadChecklistStatusDetailExcel: async (params: ChecklistConfirmParams, fileName: string): Promise<void> => {
    await downloadXlsx('v1/ics/checklist-status/details/excel', { ...params, fileName }, `${fileName}.xlsx`);
  },

  // ── K03 내부통제 준수보고(준감인) (Ics31_Tab_ComplianceReport) ──

  /** AS-IS sys.Sys99_Print.insertComplianceState: 재직 사원별 준수항목 결과·미준수 사유 (stdDate = 기준 분기(월)의 말일) */
  searchComplianceReport: async (stdDate: string, cycleType: string): Promise<IcsComplianceReportRow[]> => {
    const res = await apiClient.get<ApiResponse<IcsComplianceReportRow[]>>('v1/ics/compliance-reports', { params: { stdDate, cycleType } });
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics32_RelateAppr.selectByCompanyId: 그 달 상신 연결과 결재 상태, 연결이 없으면 null (yyyymm = 'yyyy.MM') */
  getComplianceReportAppr: async (yyyymm: string, cycleType: string): Promise<IcsComplianceReportAppr | null> => {
    const res = await apiClient.get<ApiResponse<IcsComplianceReportAppr | null>>('v1/ics/compliance-reports/appr', { params: { yyyymm, cycleType } });
    return res.data.data ?? null;
  },

  // ── M01·M02 대외활동 (Ics35_Tab_ExtrActivity·Ics35_Tab_ExtrActivityList) ──

  /** AS-IS ics.Ics35_ExtrActivity.selectByPersonId: 로그인 사원 본인의 신청 */
  searchExtrActivities: async (startDate: string, closeDate: string): Promise<IcsExtrActivity[]> => {
    const res = await apiClient.get<ApiResponse<IcsExtrActivity[]>>('v1/ics/extr-activities', { params: { startDate, closeDate } });
    return res.data.data ?? [];
  },

  /** AS-IS ics.Ics35_ExtrActivity.selectByCompanyId: 회사 전체(임시저장 제외). unknown = 기간 없이 결과보고 누락건만 */
  searchExtrActivitiesForCompany: async (startDate: string, closeDate: string, unknown: boolean): Promise<IcsExtrActivity[]> => {
    const res = await apiClient.get<ApiResponse<IcsExtrActivity[]>>('v1/ics/extr-activities/company', { params: { startDate, closeDate, unknown } });
    return res.data.data ?? [];
  },

  /** 새 신청의 id (AS-IS Ics35_Edit_ExtrActivity.insert의 DBUtil.setSeq) */
  getExtrActivityNextId: async (): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>('v1/ics/extr-activities/next-id');
    return res.data.data;
  },

  /** AS-IS ics.Ics35_ExtrActivity.modelUpdate → 저장된 행 */
  saveExtrActivity: async (req: IcsExtrActivitySaveReq): Promise<IcsExtrActivity> => {
    const res = await apiClient.put<ApiResponse<IcsExtrActivity>>('v1/ics/extr-activities', req);
    return res.data.data;
  },

  /** AS-IS ics.Ics35_ExtrActivity.delete → 지운 건수 */
  deleteExtrActivities: async (extrActivityIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/ics/extr-activities', { data: extrActivityIds });
    return res.data.data;
  },
};

/** 준수항목 저장 본문: 서버가 쓰는 열만, 새 행(id ≤ 0)은 id를 뺀다 */
const complianceBody = (rows: IcsCompliance[]) => rows.map(r => ({
  complianceId: r.complianceId > 0 ? r.complianceId : null,
  startDate: r.startDate,
  complianceType: r.complianceType,
  subNum: r.subNum,
  content: r.content,
  naUseYn: r.naUseYn,
  useYn: r.useYn,
  useCloseDate: r.useCloseDate,
  note: r.note,
}));
