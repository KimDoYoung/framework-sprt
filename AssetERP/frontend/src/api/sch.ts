import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import {
  Sch03Deadline, Sch03DeadlineSaveReq, Sch03DeadlineTemplate, Sch05RelateIcs,
  Sch04List, Sch04ListSearch, Sch10Ipo, Sch10IpoSearch, Sch12IpoCorp, Sch14IpoMismatch, Sch15IpoItemMatching,
} from '../types/sch';
import { readBlobError } from './file';

/** sch(스케줄) 화면 API (E01-1~) */
export const schApi = {
  /** AS-IS sch.Sch03_Deadline.selectByClassTreeId: 법규(infoId)의 기한 */
  searchDeadlines: async (infoId: number): Promise<Sch03Deadline[]> => {
    const res = await apiClient.get<ApiResponse<Sch03Deadline[]>>('v1/sch/deadlines', { params: { infoId } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys00_Common.selectDeadLine: 기본 기한 콤보 */
  searchDeadlineTemplates: async (): Promise<Sch03DeadlineTemplate[]> => {
    const res = await apiClient.get<ApiResponse<Sch03DeadlineTemplate[]>>('v1/sch/deadlines/templates');
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch03_Deadline.selectDeadlineName: 법규의 기한 이름(여럿이면 "… 외 n건") */
  getDeadlineName: async (infoId: number): Promise<string> => {
    const res = await apiClient.get<ApiResponse<string>>('v1/sch/deadlines/name', { params: { infoId } });
    return res.data.data ?? '';
  },

  /** AS-IS sch.Sch03_Deadline.insertModel → 저장된 행. deadlineId가 없거나 0 이하면 새로 등록 */
  saveDeadline: async (req: Sch03DeadlineSaveReq): Promise<Sch03Deadline> => {
    const res = await apiClient.put<ApiResponse<Sch03Deadline>>('v1/sch/deadlines', req);
    return res.data.data;
  },

  /** AS-IS sch.Sch03_Deadline.updateModel: 기본 기한을 법규·내규에 복사 → 새 행 (scheduleCode: 법규 "2", 내규 "6") */
  copyDeadline: async (deadlineId: number, infoId: number, scheduleCode = '2'): Promise<Sch03Deadline> => {
    const res = await apiClient.post<ApiResponse<Sch03Deadline>>('v1/sch/deadlines/copy', { deadlineId, infoId, scheduleCode });
    return res.data.data;
  },

  /** AS-IS sch.Sch03_Deadline.delete → 지운 건수 */
  deleteDeadlines: async (deadlineIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sch/deadlines', { data: deadlineIds });
    return res.data.data ?? 0;
  },

  /** AS-IS sch.Sch03_Deadline.selectById: 기한 한 건 */
  getDeadline: async (deadlineId: number): Promise<Sch03Deadline> => {
    const res = await apiClient.get<ApiResponse<Sch03Deadline>>(`v1/sch/deadlines/${deadlineId}`);
    return res.data.data;
  },

  // ── E04 연관 내부통제 (Sch05_Page_RelateIcs) ──

  /** AS-IS sch.Sch05_RelateIcs.selectByInfoId */
  searchRelateIcs: async (infoId: number): Promise<Sch05RelateIcs[]> => {
    const res = await apiClient.get<ApiResponse<Sch05RelateIcs[]>>('v1/sch/relate-ics', { params: { infoId } });
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch05_RelateIcs.modelUpdate: 고른 (법규, 기한) 쌍을 연결 → 넣은 행 */
  addRelateIcs: async (infoId: number, items: { icsClassTreeId: number; deadlineId: number }[]): Promise<Sch05RelateIcs[]> => {
    const res = await apiClient.post<ApiResponse<Sch05RelateIcs[]>>('v1/sch/relate-ics', items, { params: { infoId } });
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch05_RelateIcs.delete → 지운 건수 */
  deleteRelateIcs: async (relateIcsIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sch/relate-ics', { data: relateIcsIds });
    return res.data.data ?? 0;
  },

  // ── E20 공모주 일정등록 (Sch10_Tab_IpoAdmin) ──

  /** AS-IS sch.Sch10_Ipo.selectBySearchTextAdmin */
  searchIpos: async (cond: Sch10IpoSearch): Promise<Sch10Ipo[]> => {
    const res = await apiClient.get<ApiResponse<Sch10Ipo[]>>('v1/sch/ipos', { params: cond });
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch10_Ipo.update → 저장된 행(요청 순서) */
  updateIpos: async (rows: Sch10Ipo[]): Promise<Sch10Ipo[]> => {
    const body = rows.map(({ ipoId, marketCode, itemName, issCorpCode, demandStartDate, demandCloseDate, subscriptionStartDate, subscriptionCloseDate,
      payDate, listDate, priceBracket, price, note, cancelYn }) => ({ ipoId, marketCode, itemName, issCorpCode, demandStartDate, demandCloseDate,
      subscriptionStartDate, subscriptionCloseDate, payDate, listDate, priceBracket, price, note, cancelYn }));
    const res = await apiClient.put<ApiResponse<Sch10Ipo[]>>('v1/sch/ipos', body);
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch10_Ipo.delete → 지운 건수 */
  deleteIpos: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sch/ipos', { data: ids });
    return res.data.data ?? 0;
  },

  /** 템플릿 받기 (AS-IS downloadForm → ./excelTemplete/Template_공모주 일정등록.xlsx) */
  downloadIpoTemplate: async (): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/sch/ipos/template', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Template_공모주 일정등록.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      throw await readBlobError(err);
    }
  },

  /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=ipoUpload) → 등록·갱신한 건수 */
  uploadIposExcel: async (file: File): Promise<number> => {
    const form = new FormData();
    form.append('excelUpload', file);
    const res = await apiClient.post<ApiResponse<number>>('v1/sch/ipos/excel', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.data ?? 0;
  },

  // ── E20 주간사 등록 (Sch12_Lookup_IpoCorp) ──

  /** AS-IS sch.Sch12_IpoCorp.selectBySearchText */
  searchIpoCorps: async (searchText: string): Promise<Sch12IpoCorp[]> => {
    const res = await apiClient.get<ApiResponse<Sch12IpoCorp[]>>('v1/sch/ipo-corps', { params: { searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch12_IpoCorp.update → 저장된 행(요청 순서) */
  updateIpoCorps: async (rows: Sch12IpoCorp[]): Promise<Sch12IpoCorp[]> => {
    const body = rows.map(({ ipoCorpId, corpName, homepage }) => ({ ipoCorpId, corpName, homepage }));
    const res = await apiClient.put<ApiResponse<Sch12IpoCorp[]>>('v1/sch/ipo-corps', body);
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch12_IpoCorp.delete → 지운 건수 */
  deleteIpoCorps: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sch/ipo-corps', { data: ids });
    return res.data.data ?? 0;
  },

  // ── E20 종목코드 매칭 (Sch15_Lookup_IpoItemMatching) ──

  /** AS-IS sch.Sch15_IpoItemMatching.selectByText */
  searchIpoItemMatchings: async (searchText: string): Promise<Sch15IpoItemMatching[]> => {
    const res = await apiClient.get<ApiResponse<Sch15IpoItemMatching[]>>('v1/sch/ipo-item-matchings', { params: { searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch15_IpoItemMatching.update → 저장된 행(요청 순서) */
  updateIpoItemMatchings: async (rows: Sch15IpoItemMatching[]): Promise<Sch15IpoItemMatching[]> => {
    const body = rows.map(({ ipoItemMatchingId, itemCode, validItemCode, itemName }) => ({ ipoItemMatchingId, itemCode, validItemCode, itemName }));
    const res = await apiClient.put<ApiResponse<Sch15IpoItemMatching[]>>('v1/sch/ipo-item-matchings', body);
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch15_IpoItemMatching.delete → 지운 건수 */
  deleteIpoItemMatchings: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sch/ipo-item-matchings', { data: ids });
    return res.data.data ?? 0;
  },

  // ── E20 공모주일정 미일치내역 (Sch14_Lookup_IpoMismatch) ──

  /** AS-IS sch.Sch14_IpoMismatch.createIpoMismatch + selectByCheckYn — 조회가 쓰기(미일치내역을 새로 만든다) */
  searchIpoMismatches: async (checkYn: boolean): Promise<Sch14IpoMismatch[]> => {
    const res = await apiClient.get<ApiResponse<Sch14IpoMismatch[]>>('v1/sch/ipo-mismatches', { params: { checkYn } });
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch14_IpoMismatch.update(확인완료) → 저장된 행(요청 순서) */
  updateIpoMismatches: async (rows: Sch14IpoMismatch[]): Promise<Sch14IpoMismatch[]> => {
    const body = rows.map(({ ipoMismatchId, checkYn }) => ({ ipoMismatchId, checkYn }));
    const res = await apiClient.put<ApiResponse<Sch14IpoMismatch[]>>('v1/sch/ipo-mismatches', body);
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch04_List.selectByIcs (H06 법규보고 점검): 발생구분·주기구분은 전체면 '%' */
  searchIcsList: async (cond: Sch04ListSearch): Promise<Sch04List[]> => {
    const res = await apiClient.get<ApiResponse<Sch04List[]>>('v1/sch/lists/ics', { params: cond });
    return res.data.data ?? [];
  },

  /** 출력/다운로드 (AS-IS sys.Sys99_Print.insertRdIcsList + RD 리포트 Sch04_Rd_IcsList → xlsx) — 조회 조건 그대로, 브라우저 저장 */
  downloadIcsListExcel: async (cond: Sch04ListSearch, fileName: string): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/sch/lists/ics/excel', { params: cond, responseType: 'blob' });
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
  },

  /** AS-IS sch.Sch04_List.upsert: 고친 행(처리구분·처리일)을 저장한다 */
  upsertIcsList: async (rows: Sch04List[]): Promise<number> => {
    const body = rows.map(r => ({
      listId: r.listId, closeDate: r.closeDate, manageDate: r.manageDate, infoId: r.infoId, title: r.title, scheduleCode: r.scheduleCode,
      cycleCode: r.cycleCode, managerId: r.managerId, statusCode: r.statusCode, note: r.note, deadlineId: r.deadlineId, apprId: null, mngOrgId: r.mngOrgId,
    }));
    const res = await apiClient.put<ApiResponse<number>>('v1/sch/lists', body);
    return res.data.data ?? 0;
  },

  /** AS-IS sch.Sch04_List.updateConfirm: type U 처리결과 저장 / P 확인 / C 확인취소 → 바뀐 한 행 */
  updateIcsListResult: async (listId: number, type: 'U' | 'P' | 'C', note?: string | null): Promise<Sch04List> => {
    const res = await apiClient.put<ApiResponse<Sch04List>>(`v1/sch/lists/${listId}/result`, { type, note });
    return res.data.data;
  },
};
