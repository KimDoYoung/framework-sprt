import { apiClient } from './client';
import { ApiResponse, PageRes } from '../types/auth';
import { ChkClassTree, ChkClassTreeSaveReq, ChkDailyList, ChkDailyListConfirm, ChkDailyListConfirmParams, ChkDailyListCopyReq, ChkDailyListSaveReq, ChkDailyListWrite, ChkDailyListWriteItem } from '../types/chk';

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

  /** AS-IS chk.Chk02_DailyList.selectBySearchText2 (사용여부설정 창) — 사용여부 조건 없이 전체 */
  searchAllDailyLists: async (classTreeId: number, searchText: string): Promise<ChkDailyList[]> => {
    const res = await apiClient.get<ApiResponse<ChkDailyList[]>>('v1/chk/daily-lists/all', { params: { classTreeId, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS chk.Chk02_DailyList.updateUseYn — 바꾼 행만 → 처리 건수 */
  updateDailyListUseYn: async (items: { dailyListId: number; useYn: string }[]): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/chk/daily-lists/use-yn', { items });
    return res.data.data ?? 0;
  },

  /** AS-IS chk.Chk02_DailyList.updateWriteGroupId — writeGroupId null = 작성그룹없음 → 처리 건수 */
  updateDailyListWriteGroup: async (writeGroupId: number | null, dailyListIds: number[]): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/chk/daily-lists/write-group', { writeGroupId, dailyListIds });
    return res.data.data ?? 0;
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

  /** AS-IS chk.Chk02_DailyList.selectByPersonId — 점검일자(date)의 내 점검내역과 작성 행 */
  searchDailyListWrites: async (classTreeId: number, date: string, checkBox: boolean): Promise<ChkDailyListWrite[]> => {
    const res = await apiClient.get<ApiResponse<ChkDailyListWrite[]>>('v1/chk/daily-list-writes', { params: { classTreeId, date, checkBox } });
    return res.data.data ?? [];
  },

  /** AS-IS chk.Chk03_DailyListWrite.updateAnswerCode — 작성 행이 없으면 서버가 만든다 → 작성 행 */
  updateDailyListWriteAnswer: async (dailyListId: number, answerCode: string, date: string): Promise<ChkDailyListWriteItem> => {
    const res = await apiClient.put<ApiResponse<ChkDailyListWriteItem>>('v1/chk/daily-list-writes/answers', { dailyListId, answerCode, date });
    return res.data.data;
  },

  /** AS-IS chk.Chk03_DailyListWrite.modelUpdate (답변 없는 새 행) → 작성 행 */
  createDailyListWrite: async (dailyListId: number, date: string): Promise<ChkDailyListWriteItem> => {
    const res = await apiClient.post<ApiResponse<ChkDailyListWriteItem>>('v1/chk/daily-list-writes', { dailyListId, date });
    return res.data.data;
  },

  /** AS-IS chk.Chk03_DailyListWrite.selectById */
  getDailyListWrite: async (dailyListWriteId: number): Promise<ChkDailyListWriteItem> => {
    const res = await apiClient.get<ApiResponse<ChkDailyListWriteItem>>(`v1/chk/daily-list-writes/${dailyListWriteId}`);
    return res.data.data;
  },

  /** AS-IS Chk03_Edit_Reason.update → modelUpdate (점검결과) */
  updateDailyListWriteReason: async (dailyListWriteId: number, text: string | null): Promise<ChkDailyListWriteItem> => {
    const res = await apiClient.put<ApiResponse<ChkDailyListWriteItem>>(`v1/chk/daily-list-writes/${dailyListWriteId}/reason`, { text });
    return res.data.data;
  },

  /** AS-IS Chk03_Edit_Note.update → modelUpdate (비고) */
  updateDailyListWriteNote: async (dailyListWriteId: number, text: string | null): Promise<ChkDailyListWriteItem> => {
    const res = await apiClient.put<ApiResponse<ChkDailyListWriteItem>>(`v1/chk/daily-list-writes/${dailyListWriteId}/note`, { text });
    return res.data.data;
  },

  /** AS-IS chk.Chk03_DailyListWrite.updateConfirmYn — 선택한 행(점검내역 + 담당자)을 점검일 기준으로 확인(true)/확인취소(false) → 처리 건수 */
  updateDailyListConfirm: async (confirmYn: boolean, date: string, items: { dailyListId: number; personId: number }[]): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/chk/daily-list-writes/confirm', { confirmYn, date, items });
    return res.data.data;
  },

  /** AS-IS chk.Chk03_DailyListWrite.selectDailyListStatusPaging(+Total) — 점검일의 담당자별 점검내역(내가 확인자인 행) */
  searchDailyListConfirms: async (p: ChkDailyListConfirmParams & { offset: number; limit: number }): Promise<PageRes<ChkDailyListConfirm>> => {
    const res = await apiClient.get<ApiResponse<PageRes<ChkDailyListConfirm>>>('v1/chk/daily-list-writes/confirm-list', { params: p });
    return res.data.data;
  },

  /** AS-IS chk.Chk03_DailyListWrite.selectDailyListStatusPaging(+Total) — 확인자 조건 없는 회사 전체 점검 현황 (R04) */
  searchDailyListStatuses: async (p: ChkDailyListConfirmParams & { offset: number; limit: number }): Promise<PageRes<ChkDailyListConfirm>> => {
    const res = await apiClient.get<ApiResponse<PageRes<ChkDailyListConfirm>>>('v1/chk/daily-list-writes/status-list', { params: p });
    return res.data.data;
  },
};
