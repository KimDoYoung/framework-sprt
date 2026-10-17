import { apiClient } from './client';
import { ApiResponse, PageRes } from '../types/auth';
import { ClassTreeNode, IcsChecklist, IcsChecklistClassCode, IcsChecklistLClass, IcsChecklistMClass, IcsLawDeadline, ClassTreeSaveReq, IcsFormFile, IcsFormFileAdmin, IcsLaw, IcsLawDetail, IcsLawLookup, IcsRelateFile, IcsRevisionHistory, IcsRevisionHistoryAdmin, IcsRevisionHistoryAdminSaveReq, IcsRevisionLaw } from '../types/ics';

/** ics(내부통제) 화면 API (E01~) */
export const icsApi = {
  // ── E01 법규관리(관리자) (Ics01_Tab_ClassTree) ──

  /** AS-IS ics.Ics01_ClassTree.selectByCompanyId(typeCode IC): 사용 중인 분류를 전위 순서로(depth 포함) */
  searchClassTree: async (typeCode = 'IC'): Promise<ClassTreeNode[]> => {
    const res = await apiClient.get<ApiResponse<ClassTreeNode[]>>('v1/ics/class-trees', { params: { typeCode } });
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

  /** AS-IS ics.Ics20_RevisionHistory.selectByClassTreeId: 법규의 개정내역 */
  searchRevisionHistories: async (classTreeId: number): Promise<IcsRevisionHistory[]> => {
    const res = await apiClient.get<ApiResponse<IcsRevisionHistory[]>>('v1/ics/revision-histories', { params: { classTreeId } });
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
  }): Promise<PageRes<IcsLawLookup>> => {
    const res = await apiClient.get<ApiResponse<PageRes<IcsLawLookup>>>('v1/ics/laws/lookup', { params });
    return res.data.data;
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

  /** AS-IS sys.Sys09_Code.selectByIcs21: 사용 중인 대분류 */
  searchChecklistLCodes: async (): Promise<IcsChecklistClassCode[]> => {
    const res = await apiClient.get<ApiResponse<IcsChecklistClassCode[]>>('v1/ics/checklists/l-codes');
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys09_Code.selectByIcs23: 사용 중인 중분류(대분류를 주면 그 아래만) */
  searchChecklistMCodes: async (checklistLClassId?: number | null): Promise<IcsChecklistClassCode[]> => {
    const res = await apiClient.get<ApiResponse<IcsChecklistClassCode[]>>('v1/ics/checklists/m-codes', { params: { checklistLClassId } });
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

  /** AS-IS ics.Ics01_ClassTree.selectByListIcsId (Ics01_Lookup_SelectMulti "deadline"): 고른 법규와 그 기한 */
  searchLawDeadlines: async (classTreeIds: number[]): Promise<IcsLawDeadline[]> => {
    const res = await apiClient.get<ApiResponse<IcsLawDeadline[]>>('v1/ics/laws/with-deadlines', { params: { classTreeIds: classTreeIds.join(',') } });
    return res.data.data ?? [];
  },
};
