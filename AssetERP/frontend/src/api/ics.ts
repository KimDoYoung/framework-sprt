import { apiClient } from './client';
import { ApiResponse, PageRes } from '../types/auth';
import { ClassTreeNode, IcsWriteTreeNode, IcsChecklist, IcsCompliance, IcsComplianceAnswer, IcsComplianceDate, IcsChecklistClassCode, IcsChecklistLClass, IcsChecklistMClass, IcsLawDeadline, ClassTreeSaveReq, IcsFormFile, IcsFormFileAdmin, IcsLaw, IcsLawDetail, IcsLawLookup, IcsLawPeriod, IcsLawView, IcsClassTreeItem, IcsRelateFile, IcsRevisionHistory, IcsRevisionHistoryAdmin, IcsRevisionHistoryAdminSaveReq, IcsRevisionLaw, IcsUserRequest, IcsUserRequestSaveReq, IcsUserRequestSearch } from '../types/ics';

/** ics(내부통제) 화면 API (E01~) */
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
