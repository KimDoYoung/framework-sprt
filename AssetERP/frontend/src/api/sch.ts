import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import {
  Sch03Deadline, Sch03DeadlineSaveReq, Sch03DeadlineTemplate, Sch05RelateIcs,
  Sch01Info, Sch01InfoManager, Sch01InfoView, Sch01Org, Sch01OrgSearch, Sch01Period, Sch01PeriodSearch, Sch01InfoSave, Sch01InfoSearch, Sch06Alarm, Sch08Class, Sch08ClassCombo,
  Sch02Share, Sch22WriteGroup, Sch04List, Sch04ListManagerSearch, Sch04ListSearch, Sch10Ipo, Sch10IpoSearch, Sch12IpoCorp, Sch14IpoMismatch, Sch15IpoItemMatching,
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

  /** AS-IS sch.Sch04_List.selectByIcs (managerYn=true, H12 법규보고 점검(관리자)): orgId가 없으면 담당부서 전체 */
  searchIcsListManager: async (cond: Sch04ListManagerSearch): Promise<Sch04List[]> => {
    const res = await apiClient.get<ApiResponse<Sch04List[]>>('v1/sch/lists/ics/manager', { params: cond });
    return res.data.data ?? [];
  },

  /** 관리자 출력/다운로드 (AS-IS rdButton managerYn=true → xlsx) */
  downloadIcsListManagerExcel: async (cond: Sch04ListManagerSearch, fileName: string): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/sch/lists/ics/manager/excel', { params: cond, responseType: 'blob' });
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

  // ── K04 작성(담당)그룹 (Sch22_Lookup_WriteGroup·Sch02_Page_Share) ──

  /** AS-IS sch.Sch22_WriteGroup.selectByCompanyId */
  searchWriteGroups: async (): Promise<Sch22WriteGroup[]> => {
    const res = await apiClient.get<ApiResponse<Sch22WriteGroup[]>>('v1/sch/write-groups');
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch22_WriteGroup.update → 저장한 행(요청 순서). 새 행(id ≤ 0)은 id를 뺀다 */
  saveWriteGroups: async (rows: Sch22WriteGroup[]): Promise<Sch22WriteGroup[]> => {
    const body = rows.map(r => ({ writeGroupId: r.writeGroupId > 0 ? r.writeGroupId : null, writeGroupName: r.writeGroupName, confirmerId: r.confirmerId ?? null }));
    const res = await apiClient.put<ApiResponse<Sch22WriteGroup[]>>('v1/sch/write-groups', body);
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch22_WriteGroup.checkByWriteGroupId → 일일점검·체크리스트에서 쓰는 그룹이면 true */
  isWriteGroupInUse: async (writeGroupId: number): Promise<boolean> => {
    const res = await apiClient.get<ApiResponse<boolean>>(`v1/sch/write-groups/${writeGroupId}/in-use`);
    return res.data.data === true;
  },

  /** AS-IS sch.Sch02_Share.deleteByInfoId + sch.Sch22_WriteGroup.delete */
  deleteWriteGroup: async (writeGroupId: number): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/sch/write-groups/${writeGroupId}`);
    return res.data.data ?? 0;
  },

  /** AS-IS sch.Sch02_Share.selectByInfoId2 */
  searchWriteGroupShares: async (writeGroupId: number): Promise<Sch02Share[]> => {
    const res = await apiClient.get<ApiResponse<Sch02Share[]>>(`v1/sch/write-groups/${writeGroupId}/shares`);
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch02_Share.update → 저장한 행(요청 순서) */
  saveWriteGroupShares: async (writeGroupId: number, rows: Sch02Share[]): Promise<Sch02Share[]> => {
    const body = rows.map(r => ({ shareId: r.shareId > 0 ? r.shareId : null, shareCode: r.shareCode, personId: r.personId ?? null, orgId: r.orgId ?? null, startDate: r.startDate ?? null, closeDate: r.closeDate ?? null }));
    const res = await apiClient.put<ApiResponse<Sch02Share[]>>(`v1/sch/write-groups/${writeGroupId}/shares`, body);
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch02_Share.checkWriteGroup — 작성내역이 있으면 서버가 오류("작성내역이 존재하여 삭제할 수 없습니다") */
  checkDeleteWriteGroupShares: async (shareIds: number[]): Promise<void> => {
    await apiClient.post<ApiResponse<boolean>>('v1/sch/write-groups/shares/check-delete', shareIds);
  },

  /** AS-IS sch.Sch02_Share.delete */
  deleteWriteGroupShares: async (writeGroupId: number, shareIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/sch/write-groups/${writeGroupId}/shares`, { data: shareIds });
    return res.data.data ?? 0;
  },
  // ── O01 업무일정 등록 (Sch01_Tab_Info·Sch01_Lookup_Info·ManagerModi(Run)·Sch08_Lookup_Class·Sch06_Lookup_AlarmSetup) ──

  /** AS-IS sch.Sch01_Info.selectByText — 로그인 사용자가 담당자인 일정 */
  searchInfos: async (cond: Sch01InfoSearch): Promise<Sch01Info[]> => {
    const res = await apiClient.get<ApiResponse<Sch01Info[]>>('v1/sch/infos', { params: cond });
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch01_Info.selectByOrg — 부서별 업무일정 조회(O03) */
  searchInfosByOrg: async (cond: Sch01OrgSearch): Promise<Sch01Org[]> => {
    const res = await apiClient.get<ApiResponse<Sch01Org[]>>('v1/sch/infos/org', { params: cond });
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch01_Info.selectByCloseDate — 기간별 업무일정 조회(O02) */
  searchInfosByPeriod: async (cond: Sch01PeriodSearch): Promise<Sch01Period[]> => {
    const res = await apiClient.get<ApiResponse<Sch01Period[]>>('v1/sch/infos/period', { params: cond });
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch01_Info.selectByDeadLineId — 업무일정 보기 창 */
  getInfoView: async (infoId: number, deadlineId: number): Promise<Sch01InfoView> => {
    const res = await apiClient.get<ApiResponse<Sch01InfoView>>(`v1/sch/infos/${infoId}/view`, { params: { deadlineId } });
    return res.data.data;
  },

  /** AS-IS sch.Sch10_Ipo.selectById */
  getIpo: async (ipoId: number): Promise<Sch10Ipo> => {
    const res = await apiClient.get<ApiResponse<Sch10Ipo>>(`v1/sch/ipos/${ipoId}`);
    return res.data.data;
  },

  /** AS-IS LoginUser.getIsUserManager — 담당자 변경 창에서 담당자를 바꿀 수 있는가(관리자 역할) */
  isUserManager: async (): Promise<boolean> => {
    const res = await apiClient.get<ApiResponse<boolean>>('v1/sch/infos/user-manager');
    return res.data.data === true;
  },

  /** AS-IS sch.Sch01_Info.selectById */
  getInfo: async (infoId: number): Promise<Sch01Info> => {
    const res = await apiClient.get<ApiResponse<Sch01Info>>(`v1/sch/infos/${infoId}`);
    return res.data.data as Sch01Info;
  },

  /** AS-IS Sch01_Tab_Info.insertRow + Sch01_Lookup_Info.update01 — 빈 행을 먼저 만든다 → 만든 행 */
  createInfo: async (): Promise<Sch01Info> => {
    const res = await apiClient.post<ApiResponse<Sch01Info>>('v1/sch/infos');
    return res.data.data as Sch01Info;
  },

  /** AS-IS sch.Sch01_Info.update → 저장한 행 */
  updateInfo: async (infoId: number, req: Sch01InfoSave): Promise<Sch01Info> => {
    const res = await apiClient.put<ApiResponse<Sch01Info>>(`v1/sch/infos/${infoId}`, req);
    return res.data.data as Sch01Info;
  },

  /** AS-IS sch.Sch01_Info.checkSchInfo + delete — 이미 발생한 스케줄이 있으면 서버가 오류 */
  deleteInfos: async (infoIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sch/infos', { data: infoIds });
    return res.data.data ?? 0;
  },

  /** AS-IS sch.Sch01_Info.deleteByInfoId — 등록 창을 저장 없이 닫을 때 새 행 되돌리기 */
  rollbackInfo: async (infoId: number): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/sch/infos/${infoId}`);
    return res.data.data ?? 0;
  },

  /** AS-IS sch.Sch01_Info.selectByManagerId — 담당자 변경 창 */
  searchInfosByManager: async (managerId: number, classId: number | null, searchText: string): Promise<Sch01InfoManager[]> => {
    const res = await apiClient.get<ApiResponse<Sch01InfoManager[]>>('v1/sch/infos/by-manager', { params: { managerId, classId, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch01_Info.copySchedule — procType MOVE(이동)·COPY(복사) */
  copyInfos: async (managerId: number, procType: 'MOVE' | 'COPY', infoIds: number[]): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('v1/sch/infos/copy', { managerId, procType, infoIds });
  },

  /** AS-IS sch.Sch02_Share.selectByInfoId */
  searchInfoShares: async (infoId: number): Promise<Sch02Share[]> => {
    const res = await apiClient.get<ApiResponse<Sch02Share[]>>(`v1/sch/infos/${infoId}/shares`);
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch02_Share.update → 저장한 행(요청 순서). 새 행(id ≤ 0)은 id를 뺀다 */
  saveInfoShares: async (infoId: number, rows: Sch02Share[]): Promise<Sch02Share[]> => {
    const body = rows.map(r => ({ shareId: r.shareId > 0 ? r.shareId : null, shareCode: r.shareCode, personId: r.personId ?? null, orgId: r.orgId ?? null, startDate: r.startDate ?? null, closeDate: r.closeDate ?? null }));
    const res = await apiClient.put<ApiResponse<Sch02Share[]>>(`v1/sch/infos/${infoId}/shares`, body);
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch02_Share.delete */
  deleteInfoShares: async (infoId: number, shareIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/sch/infos/${infoId}/shares`, { data: shareIds });
    return res.data.data ?? 0;
  },

  /** AS-IS sch.Sch08_Class.selectByPersonId */
  searchClasses: async (): Promise<Sch08Class[]> => {
    const res = await apiClient.get<ApiResponse<Sch08Class[]>>('v1/sch/classes');
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys00_Common.selectScheduleClass — 분류 콤보 (ipoYn: selectScheduleClass2 = 공모주 '0' 포함, O02) */
  searchClassCombo: async (ipoYn = false): Promise<Sch08ClassCombo[]> => {
    const res = await apiClient.get<ApiResponse<Sch08ClassCombo[]>>('v1/sch/classes/combo', { params: ipoYn ? { ipoYn } : undefined });
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch08_Class.checkClassId — 쓰는 일정이 있으면 서버가 오류("사용중인 분류는 삭제 불가합니다") */
  checkClassDelete: async (classId: number): Promise<void> => {
    await apiClient.get<ApiResponse<null>>(`v1/sch/classes/${classId}/check-delete`);
  },

  /** AS-IS sch.Sch08_Class.update → 저장한 행(요청 순서). 새 행(id ≤ 0)은 id를 뺀다 */
  saveClasses: async (rows: Sch08Class[]): Promise<Sch08Class[]> => {
    const body = rows.map(r => ({ classId: r.classId > 0 ? r.classId : null, className: r.className, seq: r.seq ?? null, useYn: r.useYn ?? false, note: r.note ?? null }));
    const res = await apiClient.put<ApiResponse<Sch08Class[]>>('v1/sch/classes', body);
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch08_Class.delete */
  deleteClasses: async (classIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sch/classes', { data: classIds });
    return res.data.data ?? 0;
  },

  /** AS-IS sch.Sch06_Alarm.selectByTargetId */
  searchAlarms: async (targetId: number): Promise<Sch06Alarm[]> => {
    const res = await apiClient.get<ApiResponse<Sch06Alarm[]>>('v1/sch/alarms', { params: { targetId } });
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch06_Alarm.update → 저장한 행(요청 순서). 새 행(id ≤ 0)은 id를 뺀다 */
  saveAlarms: async (rows: Sch06Alarm[]): Promise<Sch06Alarm[]> => {
    const body = rows.map(r => ({
      alarmId: r.alarmId > 0 ? r.alarmId : null, targetCode: r.targetCode, targetId: r.targetId, alarmType: r.alarmType,
      dayWeekCode: r.dayWeekCode, num: r.num ?? null, befAftCode: r.befAftCode, amPmCode: r.amPmCode, hourCode: r.hourCode,
      minuteCode: r.minuteCode, holidayCode: r.holidayCode, useYn: r.useYn ?? false,
    }));
    const res = await apiClient.put<ApiResponse<Sch06Alarm[]>>('v1/sch/alarms', body);
    return res.data.data ?? [];
  },

  /** AS-IS sch.Sch06_Alarm.delete */
  deleteAlarms: async (alarmIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sch/alarms', { data: alarmIds });
    return res.data.data ?? 0;
  },
};
