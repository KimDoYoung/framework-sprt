import { apiClient } from './client';
import { ApiResponse, PageRes } from '../types/auth';
import { IcrClassTreeDeadline, IcrClassTreeDetail, IcrClassTreeLookup, IcrClassTreeNode, IcrClassTreeSaveReq, IcrClassTreeView, IcrRule } from '../types/icr';
import { IcsManager } from '../types/ics';

/** icr(내규) API — 조회창(E13-3)·내규조회(H03)·내규관리(H09) */
export const icrApi = {
  /** AS-IS icr.Icr01_ClassTree.selectByCompanyId(typeCode IC): 사용 중인 분류를 전위 순서로(depth 포함) */
  searchClassTree: async (typeCode = 'IC'): Promise<IcrClassTreeNode[]> => {
    const res = await apiClient.get<ApiResponse<IcrClassTreeNode[]>>('v1/icr/class-trees', { params: { typeCode } });
    return res.data.data ?? [];
  },

  /** AS-IS icr.Icr01_ClassTree.selectByTypeCodePaging(typeCode IT): 내규 조회창 페이징. classTreeId가 있으면 그 분류와 모든 하위 */
  searchLookup: async (params: {
    classTreeId: number | null; lawSearch: string; statuteSearch: string; detailSearchYn: boolean; offset: number; limit: number;
    /** openUnConn: 'TDM46' + 점검항목 ID — 그 점검항목에 아직 연결 안 된 내규만 */
    relateTable?: string; relateId?: number;
  }): Promise<PageRes<IcrClassTreeLookup>> => {
    const res = await apiClient.get<ApiResponse<PageRes<IcrClassTreeLookup>>>('v1/icr/class-trees/lookup', { params });
    return res.data.data;
  },

  /** AS-IS icr.Icr01_ClassTree.selectByTypeCodePaging(typeCode IT): 내규조회(H03) 페이징. 서식파일 건수·분류 열까지 */
  searchView: async (params: {
    classTreeId: number | null; lawSearch: string; statuteSearch: string; detailSearchYn: boolean; offset: number; limit: number;
  }): Promise<PageRes<IcrClassTreeView>> => {
    const res = await apiClient.get<ApiResponse<PageRes<IcrClassTreeView>>>('v1/icr/class-trees/view', { params });
    return res.data.data;
  },

  /** AS-IS icr.Icr01_ClassTree.selectByListIcrId (Icr01_Lookup_SelectMulti "deadline"): 고른 내규와 그 기한 */
  searchDeadlines: async (classTreeIds: number[]): Promise<IcrClassTreeDeadline[]> => {
    const res = await apiClient.get<ApiResponse<IcrClassTreeDeadline[]>>('v1/icr/class-trees/with-deadlines', { params: { classTreeIds: classTreeIds.join(',') } });
    return res.data.data ?? [];
  },

  /** AS-IS icr.Icr01_ClassTree.selectById: 내규상세 창의 값 */
  getDetail: async (classTreeId: number): Promise<IcrClassTreeDetail> => {
    const res = await apiClient.get<ApiResponse<IcrClassTreeDetail>>(`v1/icr/class-trees/${classTreeId}/detail`);
    return res.data.data;
  },

  // ── H09 내규관리 (Icr01_Tab_ClassTree) ──

  /** AS-IS Icr01_Edit_ClassTree.update (등록) → 등록된 분류 */
  createClassTree: async (req: IcrClassTreeSaveReq): Promise<IcrClassTreeNode | null> => {
    const res = await apiClient.post<ApiResponse<IcrClassTreeNode>>('v1/icr/class-trees', req);
    return res.data.data ?? null;
  },

  /** AS-IS Icr01_Edit_ClassTree.update (수정) */
  updateClassTree: async (classTreeId: number, req: IcrClassTreeSaveReq): Promise<IcrClassTreeNode | null> => {
    const res = await apiClient.put<ApiResponse<IcrClassTreeNode>>(`v1/icr/class-trees/${classTreeId}`, req);
    return res.data.data ?? null;
  },

  /** AS-IS Icr01_Move_TreeGrid.moveTree: 상위 분류 바꾸기 */
  moveClassTree: async (classTreeId: number, parentTreeId: number): Promise<void> => {
    await apiClient.put<ApiResponse<null>>(`v1/icr/class-trees/${classTreeId}/parent`, { parentTreeId });
  },

  /** AS-IS Icr01_Edit_ClassTree.deleteAll: 하위 분류·내규까지 삭제 → 지운 건수 */
  deleteClassTree: async (classTreeId: number): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/icr/class-trees/${classTreeId}`);
    return res.data.data ?? 0;
  },

  /** AS-IS icr.Icr01_ClassTree.selectByClassTreeId(typeCode IT): 고른 분류와 모든 하위의 내규 */
  searchRules: async (classTreeId: number, searchText: string): Promise<IcrRule[]> => {
    const res = await apiClient.get<ApiResponse<IcrRule[]>>('v1/icr/rules', { params: { classTreeId, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS icr.Icr01_ClassTree.refresh: 한 행 다시 읽기 */
  refreshRule: async (classTreeId: number): Promise<IcrRule> => {
    const res = await apiClient.get<ApiResponse<IcrRule>>(`v1/icr/rules/${classTreeId}`);
    return res.data.data as IcrRule;
  },

  /** AS-IS icr.Icr01_ClassTree.update → 저장된 행(요청 순서) */
  saveRules: async (rows: IcrRule[]): Promise<IcrRule[]> => {
    const body = rows.map(({ classTreeId, parentTreeId, classTreeCode, classTreeName, submitTo, relatedLaw, useYn }) =>
      ({ classTreeId, parentTreeId, classTreeCode, classTreeName, submitTo, relatedLaw, useYn }));
    const res = await apiClient.put<ApiResponse<IcrRule[]>>('v1/icr/rules', body);
    return res.data.data ?? [];
  },

  /** AS-IS icr.Icr01_ClassTree.delete → 지운 건수 */
  deleteRules: async (classTreeIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/icr/rules', { data: classTreeIds });
    return res.data.data ?? 0;
  },

  /** AS-IS Icr01_Move_Grid.moveTree: 내규의 상위 분류 바꾸기 */
  moveRule: async (classTreeId: number, parentTreeId: number): Promise<void> => {
    await apiClient.put<ApiResponse<null>>(`v1/icr/rules/${classTreeId}/parent`, { parentTreeId });
  },

  /** AS-IS icr.Icr01_ClassTree.modelUpdate (Icr01_Lookup_Content 저장): 상세내용 + 그 행의 편집 열 → 저장된 행 */
  updateRuleContent: async (rule: IcrRule, content: string): Promise<IcrRule> => {
    const { classTreeId, classTreeCode, classTreeName, submitTo, relatedLaw, useYn } = rule;
    const res = await apiClient.put<ApiResponse<IcrRule>>(`v1/icr/rules/${classTreeId}/content`,
      { content, classTreeCode, classTreeName, submitTo, relatedLaw, useYn });
    return res.data.data as IcrRule;
  },

  /** AS-IS sys.Sys10_File.delete (Icr01_Lookup_IcrFile 삭제 열): 서식파일 행만 지운다 */
  deleteRuleFile: async (classTreeId: number, fileId: number): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>(`v1/icr/rules/${classTreeId}/files/${fileId}`);
  },

  /** AS-IS icr.Icr05_RelateManager.selectByClassTreeId (없으면 ics.Ics02_Manager.getDefaultYn): 내규의 현재 관리그룹 */
  getRelateManager: async (classTreeId: number): Promise<IcsManager> => {
    const res = await apiClient.get<ApiResponse<IcsManager>>('v1/icr/relate-managers', { params: { classTreeId } });
    return res.data.data as IcsManager;
  },

  /** AS-IS icr.Icr05_RelateManager.relateUpdate → 바뀐 내규 행 */
  relateManager: async (managerId: number, classTreeId: number): Promise<IcrRule> => {
    const res = await apiClient.put<ApiResponse<IcrRule>>('v1/icr/relate-managers', { managerId, classTreeId });
    return res.data.data as IcrRule;
  },
};
