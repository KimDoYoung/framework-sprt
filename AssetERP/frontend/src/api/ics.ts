import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { ClassTreeNode, ClassTreeSaveReq, IcsFormFile, IcsLaw, IcsRelateFile, IcsRevisionHistory } from '../types/ics';

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
};
