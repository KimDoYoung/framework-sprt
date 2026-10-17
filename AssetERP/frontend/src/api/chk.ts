import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { ChkClassTree, ChkClassTreeSaveReq, ChkDailyList, ChkDailyListCopyReq, ChkDailyListSaveReq } from '../types/chk';

/** chk(일일점검) 화면 API (E06~) */
export const chkApi = {
  // ── E06 일일점검내역 분류(관리자) (Chk01_Tab_ClassTree·Chk01_Edit_ClassTree) ──

  /** AS-IS chk.Chk01_ClassTree.selectByAll: 전체 분류를 전위 순서로(depth 포함) */
  searchClassTree: async (): Promise<ChkClassTree[]> => {
    const res = await apiClient.get<ApiResponse<ChkClassTree[]>>('v1/chk/class-trees');
    return res.data.data ?? [];
  },

  /** AS-IS chk.Chk01_ClassTree.update (새 분류) → 저장된 행 */
  createClassTree: async (req: ChkClassTreeSaveReq): Promise<ChkClassTree> => {
    const res = await apiClient.post<ApiResponse<ChkClassTree>>('v1/chk/class-trees', req);
    return res.data.data;
  },

  /** AS-IS chk.Chk01_ClassTree.update (수정) → 저장된 행 */
  updateClassTree: async (classTreeId: number, req: ChkClassTreeSaveReq): Promise<ChkClassTree> => {
    const res = await apiClient.put<ApiResponse<ChkClassTree>>(`v1/chk/class-trees/${classTreeId}`, req);
    return res.data.data;
  },

  /** AS-IS chk.Chk01_ClassTree.delete → 지운 건수 */
  deleteClassTree: async (classTreeId: number): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/chk/class-trees/${classTreeId}`);
    return res.data.data ?? 0;
  },

  // ── E07 일일점검내역 관리(관리자) (Chk02_Tab_DailyListAdmin·Chk02_Edit_DailyList·Chk01_Lookup_ClassTree) ──

  /** AS-IS chk.Chk01_ClassTree.selectByLinkCode: 링크코드 분류 한 건(없으면 null) */
  getClassTreeByLinkCode: async (linkCode: string): Promise<ChkClassTree | null> => {
    const res = await apiClient.get<ApiResponse<ChkClassTree | null>>(`v1/chk/class-trees/link/${linkCode}`);
    return res.data.data ?? null;
  },

  /** AS-IS chk.Chk01_ClassTree.selectByCompanyId: 기준 분류 아래 전체(사용 분류, 회사 0·로그인 회사), 전위 순서(depth) */
  searchClassTreeByCompany: async (parentTreeId?: number | null): Promise<ChkClassTree[]> => {
    const res = await apiClient.get<ApiResponse<ChkClassTree[]>>('v1/chk/class-trees/by-company', { params: { parentTreeId } });
    return res.data.data ?? [];
  },

  /** AS-IS chk.Chk02_DailyList.selectByAdmin — useYn은 'true'/'false', 없으면 전체 */
  searchDailyLists: async (classTreeId: number, useYn: string | undefined, searchText: string): Promise<ChkDailyList[]> => {
    const res = await apiClient.get<ApiResponse<ChkDailyList[]>>('v1/chk/daily-lists', { params: { classTreeId, useYn, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS chk.Chk02_DailyList.modelUpdate (새 행) → 저장된 행 */
  createDailyList: async (req: ChkDailyListSaveReq): Promise<ChkDailyList> => {
    const res = await apiClient.post<ApiResponse<ChkDailyList>>('v1/chk/daily-lists', req);
    return res.data.data;
  },

  /** AS-IS chk.Chk02_DailyList.modelUpdate (수정) → 저장된 행 */
  updateDailyList: async (dailyListId: number, req: ChkDailyListSaveReq): Promise<ChkDailyList> => {
    const res = await apiClient.put<ApiResponse<ChkDailyList>>(`v1/chk/daily-lists/${dailyListId}`, req);
    return res.data.data;
  },

  /** AS-IS chk.Chk02_DailyList.delete → 지운 건수 */
  deleteDailyLists: async (dailyListIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/chk/daily-lists', { data: dailyListIds });
    return res.data.data ?? 0;
  },

  /** AS-IS chk.Chk02_DailyList.insert (점검내역복사) → 처리한 (고객사 × 점검내역) 수 */
  copyDailyLists: async (req: ChkDailyListCopyReq): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/chk/daily-lists/copy', req);
    return res.data.data ?? 0;
  },
};
