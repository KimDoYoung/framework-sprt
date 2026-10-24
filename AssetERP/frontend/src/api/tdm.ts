import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { TdmChangeDetail, TdmChangeHistory, TdmCouncil, TdmCouncilRole, TdmCouncilRoleLookup, TdmCouncilSaveReq, TdmRole, TdmRoleCouncil, TdmRoleOrg, TdmRoleSaveReq, TdmRoleTask, TdmTask, TdmTaskDetail, TdmTaskDuty, TdmTaskDutyDetail, TdmTaskSaveReq, TdmTaskType, TdmAddTitle, TdmHr, TdmHrApplyReq, TdmHrChange, Manl, ManlRelateIcs, TdmDashboardCheckEnd, TdmDashboardChckOrg, TdmDashboardInsuff, TdmDashboardMyOrg, TdmDashboardProgress, TdmDashboardUndone, TdmDutyProgress, TdmDutyRecon, TdmManlFormFile, TdmManlItem, TdmManlOrg, TdmManlRelates, TdmHrLookup, TdmManlSaveReq, TdmRoleDesc, TdmRoleDigm, TdmManager, TdmManagerInfo, TdmRoleOrgLookup, TdmApprStep, TdmApprStepChild, TdmRoleAllc, TdmRoleAllcCreateReq, TdmRoleAllcUpdateReq, TdmRoleAllcDetail, TdmRoleAllcTask, TdmRoleAllcTaskDetail, TdmHrRecord } from '../types/tdm';

/** tdm(책무) 화면 API */
export const tdmApi = {
  // ── E01 법규관리(관리자) — 연결 책무이행점검(Ics01_Lookup_RelateTdm·Ics01_Lookup_SelectTdm) ──

  /** AS-IS tdm.Tdm45_ManlRelateIcs.selectByIcsId: 법규에 연결된 점검항목(관리자 회사만 행이 나온다) */
  searchManlRelateIcs: async (icsId: number, searchText: string): Promise<ManlRelateIcs[]> => {
    const res = await apiClient.get<ApiResponse<ManlRelateIcs[]>>('v1/tdm/manl-relate-ics', { params: { icsId, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm43_Manl.selectByExceptIcsId: 연결할 점검항목 후보 */
  searchManlCandidates: async (icsId: number, searchText: string): Promise<Manl[]> => {
    const res = await apiClient.get<ApiResponse<Manl[]>>('v1/tdm/manl-relate-ics/candidates', { params: { icsId, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm45_ManlRelateIcs.insertList → 새로 연결한 건수 */
  addManlRelateIcs: async (icsId: number, manlIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/tdm/manl-relate-ics', { icsId, manlIds });
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm45_ManlRelateIcs.delete → 지운 건수 */
  deleteManlRelateIcs: async (icsId: number, manlRelateIcsIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/tdm/manl-relate-ics', { params: { icsId }, data: manlRelateIcsIds });
    return res.data.data ?? 0;
  },

  // ── E11 책무기술서 재생성(Tdm31_Tab_RoleDescAdmin) ──

  /** AS-IS tdm.Tdm31_RoleDesc.selectByRegDateAdmin (companyId 없음 = 전체, 관리자 회사만. 일자는 전체보기가 아닐 때만 건다) */
  searchRoleDescs: async (p: { companyId?: number; startDate: string; closeDate: string; searchText: string; endYn: boolean; notPeriodYn: boolean }): Promise<TdmRoleDesc[]> => {
    const res = await apiClient.get<ApiResponse<TdmRoleDesc[]>>('v1/tdm/role-descs', { params: p });
    return res.data.data ?? [];
  },

  /** 한 건 재생성 (AS-IS createRd 한 건 분량). RD 연동이 없는 동안 서버가 거절한다 */
  recreateRoleDesc: async (roleDescId: number): Promise<void> => {
    await apiClient.post<ApiResponse<null>>(`v1/tdm/role-descs/${roleDescId}/recreate`);
  },

  // ── E12 책무체계도 재생성(Tdm32_Tab_RoleDigmAdmin) ──

  /** AS-IS tdm.Tdm32_RoleDigm.selectByRegDateAdmin (companyId 없음 = 전체, 관리자 회사만. 일자는 전체보기가 아닐 때만 건다. 원본은 상신건만(endYn=true) 고정) */
  searchRoleDigms: async (p: { companyId?: number; startDate: string; closeDate: string; endYn: boolean; notPeriodYn: boolean }): Promise<TdmRoleDigm[]> => {
    const res = await apiClient.get<ApiResponse<TdmRoleDigm[]>>('v1/tdm/role-digms', { params: p });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm33_RoleDigmFile.selectByFileType: 책무체계도의 파일정보 ID들 (fileType 1 시스템 생성 / 2 사용자 업로드) */
  getRoleDigmFileIds: async (roleDigmId: number, fileType: string): Promise<number[]> => {
    const res = await apiClient.get<ApiResponse<number[]>>(`v1/tdm/role-digms/${roleDigmId}/file-ids`, { params: { fileType } });
    return res.data.data ?? [];
  },

  /** 한 건 재생성 (AS-IS createRd 한 건 분량). RD 연동이 없는 동안 서버가 거절한다 */
  recreateRoleDigm: async (roleDigmId: number): Promise<void> => {
    await apiClient.post<ApiResponse<null>>(`v1/tdm/role-digms/${roleDigmId}/recreate`);
  },

  // ── E15 책무마감 검증(Tdm50_Tab_DutyReconAdmin) ──

  /** AS-IS sys.Sys99_Print.insertReconTdm(windowClassName "DB_CHK"): 사용자 몫의 점검 행을 기준월(그 달 1일)로 다시 만든다 (companyId 0 = 전체, KFS 관리자 외에는 로그인 회사) */
  createDutyReconData: async (p: { companyId?: number; baseDate: string }): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('v1/tdm/duty-recon/data', null, { params: p });
  },

  /** AS-IS sys.Sys99_Print.selectByWindowClassName: createDutyReconData가 만든 행 */
  searchDutyRecon: async (): Promise<TdmDutyRecon[]> => {
    const res = await apiClient.get<ApiResponse<TdmDutyRecon[]>>('v1/tdm/duty-recon');
    return res.data.data ?? [];
  },

  // ── E14 책무진행 상태(Tdm50_Tab_DutyProgressAdmin) ──

  /** AS-IS sys.Sys99_Print.insertReconTdm: 사용자 몫의 점검상태 행을 기준월(그 달 1일)로 다시 만든다 (companyId 0 = 전체, KFS 관리자 외에는 로그인 회사) */
  createDutyProgressData: async (p: { companyId?: number; baseDate: string }): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('v1/tdm/duty-progress/data', null, { params: p });
  },

  /** AS-IS sys.Sys99_Print.selectByWindowClassName: createDutyProgressData가 만든 행 */
  searchDutyProgress: async (): Promise<TdmDutyProgress[]> => {
    const res = await apiClient.get<ApiResponse<TdmDutyProgress[]>>('v1/tdm/duty-progress');
    return res.data.data ?? [];
  },

  // ── E13 책무매뉴얼 재생성(Tdm42_Tab_ManlManagerAdmin) · 점검항목 조회창(Tdm43_Lookup_ManlItem) ──

  /** AS-IS tdm.Tdm42_ManlOrg.selectByText (companyId 없음 = 전체. 원본은 상신건만(adminYn=true)·useYn=false 고정. 일자는 전체보기가 아닐 때만 건다) */
  searchManlOrgs: async (p: { companyId?: number; orgId?: number; searchText: string; notPeriodYn: boolean; startDate: string; closeDate: string }): Promise<TdmManlOrg[]> => {
    const res = await apiClient.get<ApiResponse<TdmManlOrg[]>>('v1/tdm/manl-orgs', { params: p });
    return res.data.data ?? [];
  },

  /** 한 건 재생성 (AS-IS createRd 한 건 분량). RD 연동이 없는 동안 서버가 거절한다 */
  recreateManlOrg: async (manlOrgId: number): Promise<void> => {
    await apiClient.post<ApiResponse<null>>(`v1/tdm/manl-orgs/${manlOrgId}/recreate`);
  },

  /** AS-IS tdm.Tdm43_Manl.selectByManlOrgId (useYn: '%' 전체 / 'true' 사용 / 'false' 미사용) */
  searchManlItems: async (manlOrgId: number, useYn: string, searchText: string): Promise<TdmManlItem[]> => {
    const res = await apiClient.get<ApiResponse<TdmManlItem[]>>('v1/tdm/manls', { params: { manlOrgId, useYn, searchText } });
    return res.data.data ?? [];
  },

  // ── E13-2 점검항목 등록·수정창(Tdm43_Edit_Manl)·연관 페이지(Tdm43_Page_Relate) ──

  /** 등록창을 열 때 받는 새 점검항목 번호 (AS-IS DBUtil.setSeq) */
  nextManlId: async (manlOrgId: number): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>('v1/tdm/manls/next-id', { params: { manlOrgId } });
    return res.data.data;
  },

  /** AS-IS Tdm45·46·47_…selectByManlId·Sys11_RelateFile.selectByParentId (등록 직후 번호는 빈 목록) */
  getManlRelates: async (manlOrgId: number, manlId: number): Promise<TdmManlRelates> => {
    const res = await apiClient.get<ApiResponse<TdmManlRelates>>(`v1/tdm/manls/${manlId}/relates`, { params: { manlOrgId } });
    return res.data.data;
  },

  /** AS-IS tdm.Tdm43_Manl.modelUpdate (manlId가 이미 있으면 수정, 없으면 등록) */
  saveManl: async (req: TdmManlSaveReq): Promise<void> => {
    await apiClient.put<ApiResponse<null>>('v1/tdm/manls', req);
  },

  /** 연결 한 건 삭제 — kind: ics·icr·form·dcr */
  deleteManlRelate: async (manlOrgId: number, manlId: number, kind: 'ics' | 'icr' | 'form' | 'dcr', relateId: number): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>(`v1/tdm/manls/${manlId}/relates/${kind}/${relateId}`, { params: { manlOrgId } });
  },

  /** AS-IS sys.Sys10_File.selectUnConnTdmFormFile (formType: '%' 전체 / 코드) */
  searchManlFormFiles: async (formType: string, searchText: string, relateId: number): Promise<TdmManlFormFile[]> => {
    const res = await apiClient.get<ApiResponse<TdmManlFormFile[]>>('v1/tdm/manls/form-files', { params: { formType, searchText, relateId } });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm43_Manl.delete (선택한 한 건 + 연결 법규·내규·양식·첨부) */
  deleteManlItem: async (manlOrgId: number, manlId: number): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>(`v1/tdm/manls/${manlId}`, { params: { manlOrgId } });
  },

  // ── N01 책무점검 현황(Tdm50_Tab_TotalDashboard) — 모두 조회. 점검년월 checkYm은 'yyyy.MM', 기준일 stdDate는 그 달 1일 'yyyy-MM-dd' ──

  /** AS-IS tdm.Tdm50_ChckJob.selectRcntChckJob: 진행 중인 가장 최근 점검년월(없으면 null) */
  getDashboardRecentCheckYm: async (): Promise<string | null> => {
    const res = await apiClient.get<ApiResponse<string | null>>('v1/tdm/dashboard/recent-check-ym');
    return res.data.data ?? null;
  },

  /** AS-IS tdm.Tdm50_ChckJob.selectByCheckYm: 점검 작업이 정확히 하나일 때만 값(마감 여부·마감일) */
  getDashboardCheckEnd: async (checkYm: string): Promise<TdmDashboardCheckEnd | null> => {
    const res = await apiClient.get<ApiResponse<TdmDashboardCheckEnd | null>>('v1/tdm/dashboard/check-end', { params: { checkYm } });
    return res.data.data ?? null;
  },

  /** AS-IS tdm.Tdm51_ChckOrg.selectDashboardProgress (statusType 1:최종승인 / 2:점검완료, exctId·orgId는 있을 때만) */
  getDashboardProgress: async (p: { checkYm: string; stdDate: string; statusType: string; exctId?: number | null; orgId?: number | null }): Promise<TdmDashboardProgress | null> => {
    const res = await apiClient.get<ApiResponse<TdmDashboardProgress | null>>('v1/tdm/dashboard/progress', { params: p });
    return res.data.data ?? null;
  },

  /** AS-IS tdm.Tdm51_ChckOrg.selectDashboardExct: 임원별(exctId 있으면 직책별) 진행현황 */
  searchDashboardExctProgress: async (p: { checkYm: string; statusType: string; exctId?: number | null }): Promise<TdmDashboardChckOrg[]> => {
    const res = await apiClient.get<ApiResponse<TdmDashboardChckOrg[]>>('v1/tdm/dashboard/exct-progress', { params: p });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm51_ChckOrg.selectDashboardOrg: 부서별 진행현황 */
  searchDashboardOrgProgress: async (p: { checkYm: string; statusType: string; exctId?: number | null }): Promise<TdmDashboardChckOrg[]> => {
    const res = await apiClient.get<ApiResponse<TdmDashboardChckOrg[]>>('v1/tdm/dashboard/org-progress', { params: p });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm52_ChckManl.selectDashboardUndone (orgId가 있으면 retrieveType 1:미점검 / 2:반려 / 3:당월발생 미흡) */
  searchDashboardUndone: async (p: { checkYm: string; statusType?: string; exctId?: number | null; orgId?: number | null; retrieveType?: string }): Promise<TdmDashboardUndone[]> => {
    const res = await apiClient.get<ApiResponse<TdmDashboardUndone[]>>('v1/tdm/dashboard/undone', { params: p });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm54_ChckInsuff.selectDashboardInsuff (AS-IS 서버처럼 부서는 받지 않는다) */
  searchDashboardInsuff: async (p: { checkYm: string; exctId?: number | null }): Promise<TdmDashboardInsuff[]> => {
    const res = await apiClient.get<ApiResponse<TdmDashboardInsuff[]>>('v1/tdm/dashboard/insuff', { params: p });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm08_ManagerInfo.checkIsManager: 책무담당자·책무관리자 여부 (stdDate = 오늘) */
  isDashboardManager: async (stdDate: string): Promise<boolean> => {
    const res = await apiClient.get<ApiResponse<boolean>>('v1/tdm/dashboard/is-manager', { params: { stdDate } });
    return !!res.data.data;
  },

  /** AS-IS tdm.Tdm30_RoleAllc.selectByExctId(exctId = 로그인 사용자): 내가 임원인가 */
  hasDashboardRoleAllc: async (stdDate: string): Promise<boolean> => {
    const res = await apiClient.get<ApiResponse<boolean>>('v1/tdm/dashboard/role-allc-exists', { params: { stdDate } });
    return !!res.data.data;
  },

  /** AS-IS LoginUser.getOrgCodeId()·getOrgInfoModel().getKorName(): 부서별 탭 초기값 (없으면 null) */
  getDashboardMyOrg: async (): Promise<TdmDashboardMyOrg | null> => {
    const res = await apiClient.get<ApiResponse<TdmDashboardMyOrg | null>>('v1/tdm/dashboard/my-org');
    return res.data.data ?? null;
  },

  /** AS-IS tdm.Tdm01_Hr.selectByEndDate: 임원선택 조회창 (서버가 %…%로 감싼다) */
  searchHrLookup: async (searchText: string): Promise<TdmHrLookup[]> => {
    const res = await apiClient.get<ApiResponse<TdmHrLookup[]>>('v1/tdm/hrs/lookup', { params: { searchText } });
    return res.data.data ?? [];
  },

  // ── N04 임원 등록(Tdm01_Tab_Hr) ──

  /** AS-IS tdm.Tdm01_Hr.selectByCompanyId (searchText는 서버가 %…%로 감싼다) */
  searchHrs: async (exceptRetireYn: boolean, searchText: string): Promise<TdmHr[]> => {
    const res = await apiClient.get<ApiResponse<TdmHr[]>>('v1/tdm/hrs', { params: { exceptRetireYn, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm01_Hr.selectPersonModifyed: 인사정보 가져오기(신규·변동·제외) */
  searchHrChanges: async (): Promise<TdmHrChange[]> => {
    const res = await apiClient.get<ApiResponse<TdmHrChange[]>>('v1/tdm/hrs/changes');
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm01_Hr.updateHrInfo: 변동 후 인사정보 적용 */
  applyHrChanges: async (rows: TdmHrApplyReq[]): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('v1/tdm/hrs/changes/apply', rows);
  },

  /** AS-IS tdm.Tdm03_AddTitle.selectByPersonId (사내 겸직) */
  searchAddTitles: async (personId: number): Promise<TdmAddTitle[]> => {
    const res = await apiClient.get<ApiResponse<TdmAddTitle[]>>('v1/tdm/add-titles', { params: { personId } });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm03_AddTitle.update → UpdateDataModel */
  saveAddTitles: async (rows: TdmAddTitle[]): Promise<TdmAddTitle[]> => {
    const body = rows.map(r => ({ addTitleId: r.addTitleId, personId: r.personId, addTitleName: r.addTitleName, startDate: r.startDate, closeDate: r.closeDate }));
    const res = await apiClient.put<ApiResponse<TdmAddTitle[]>>('v1/tdm/add-titles', body);
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm03_AddTitle.delete */
  deleteAddTitles: async (addTitleIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/tdm/add-titles', { data: addTitleIds });
    return res.data.data ?? 0;
  },

  // ── N05 책무 등록(Tdm10_Tab_Task) ──

  /** AS-IS tdm.Tdm10_Task.selectByText (taskClassCode '%'=전체, searchText는 서버가 %…%로 감싼다) */
  searchTasks: async (p: { baseDate: string; taskClassCode: string; allYn: boolean; searchText: string; dedupYn?: boolean }): Promise<TdmTask[]> => {
    const res = await apiClient.get<ApiResponse<TdmTask[]>>('v1/tdm/tasks', { params: p });
    return res.data.data ?? [];
  },

  /** AS-IS DBUtil.setSeq: 새 책무 ID */
  getTaskNextId: async (): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>('v1/tdm/tasks/next-id');
    return res.data.data as number;
  },

  /** AS-IS tdm.Tdm10_Task.selectById */
  getTask: async (taskId: number): Promise<TdmTask> => {
    const res = await apiClient.get<ApiResponse<TdmTask>>(`v1/tdm/tasks/${taskId}`);
    return res.data.data as TdmTask;
  },

  /** AS-IS tdm.Tdm10_Task.countUseByTaskId: 사용 건수 합 */
  countTaskUse: async (taskIds: number[]): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>('v1/tdm/tasks/use-count', { params: { taskIds: taskIds.join(',') } });
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm10_Task.modelUpdate (INSERT·COPY) */
  createTask: async (req: TdmTaskSaveReq): Promise<TdmTask> => {
    const res = await apiClient.post<ApiResponse<TdmTask>>('v1/tdm/tasks', req);
    return res.data.data as TdmTask;
  },

  /** AS-IS tdm.Tdm10_Task.modelUpdate (UPDATE, 변경사유 필요) */
  updateTask: async (taskId: number, req: TdmTaskSaveReq): Promise<TdmTask> => {
    const res = await apiClient.put<ApiResponse<TdmTask>>(`v1/tdm/tasks/${taskId}`, req);
    return res.data.data as TdmTask;
  },

  /** AS-IS tdm.Tdm10_Task.delete (삭제사유 필요) */
  deleteTasks: async (ids: number[], reason: string): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/tdm/tasks', { data: { ids, reason } });
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm12_TaskRelateDetail.selectByTaskId */
  searchTaskDetails: async (taskId: number): Promise<TdmTaskDetail[]> => {
    const res = await apiClient.get<ApiResponse<TdmTaskDetail[]>>('v1/tdm/task-details', { params: { taskId } });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm12_TaskRelateDetail.countByTaskDetailId */
  countTaskDetailUse: async (detailIds: number[]): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>('v1/tdm/task-details/use-count', { params: { detailIds: detailIds.join(',') } });
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm12_TaskRelateDetail.update (기존 행을 고쳤으면 reason 필요) */
  saveTaskDetails: async (rows: TdmTaskDetail[], reason: string | null): Promise<TdmTaskDetail[]> => {
    const body = {
      rows: rows.map(r => ({ taskRelateDetailId: r.taskRelateDetailId, taskId: r.taskId, content: r.content, seq: r.seq, useYn: r.useYn })),
      reason,
    };
    const res = await apiClient.put<ApiResponse<TdmTaskDetail[]>>('v1/tdm/task-details', body);
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm12_TaskRelateDetail.delete (삭제사유 필요) */
  deleteTaskDetails: async (ids: number[], reason: string): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/tdm/task-details', { data: { ids, reason } });
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm12_TaskRelateDetail.selectByText (관리의무 등록 위쪽 목록, taskTypeCode '%'=전체) */
  searchTaskDutyDetails: async (p: { baseDate: string; taskTypeCode: string; allYn: boolean; searchText: string }): Promise<TdmTaskDutyDetail[]> => {
    const res = await apiClient.get<ApiResponse<TdmTaskDutyDetail[]>>('v1/tdm/task-duties/details', { params: p });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm13_TaskRelateDuty.selectByTaskRelateDetailId */
  searchTaskDuties: async (taskRelateDetailId: number): Promise<TdmTaskDuty[]> => {
    const res = await apiClient.get<ApiResponse<TdmTaskDuty[]>>('v1/tdm/task-duties', { params: { taskRelateDetailId } });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm13_TaskRelateDuty.countByDutyId */
  countTaskDutyUse: async (dutyIds: number[]): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>('v1/tdm/task-duties/use-count', { params: { dutyIds: dutyIds.join(',') } });
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm13_TaskRelateDuty.update (기존 행을 고쳤으면 reason 필요) */
  saveTaskDuties: async (rows: TdmTaskDuty[], reason: string | null): Promise<TdmTaskDuty[]> => {
    const body = {
      rows: rows.map(r => ({ taskRelateDutyId: r.taskRelateDutyId, taskId: r.taskId, taskRelateDetailId: r.taskRelateDetailId, content: r.content, seq: r.seq, useYn: r.useYn })),
      reason,
    };
    const res = await apiClient.put<ApiResponse<TdmTaskDuty[]>>('v1/tdm/task-duties', body);
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm13_TaskRelateDuty.delete (삭제사유 필요) */
  deleteTaskDuties: async (ids: number[], reason: string): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/tdm/task-duties', { data: { ids, reason } });
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm14_TaskType.selectByCompanyId (taskClassCode '%'=전체) */
  searchTaskTypes: async (taskClassCode: string, useYn: boolean): Promise<TdmTaskType[]> => {
    const res = await apiClient.get<ApiResponse<TdmTaskType[]>>('v1/tdm/task-types', { params: { taskClassCode, useYn } });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm14_TaskType.update */
  saveTaskTypes: async (rows: TdmTaskType[]): Promise<TdmTaskType[]> => {
    const body = rows.map(r => ({ taskTypeId: r.taskTypeId, taskTypeCode: r.taskTypeCode, taskTypeName: r.taskTypeName, useYn: r.useYn }));
    const res = await apiClient.put<ApiResponse<TdmTaskType[]>>('v1/tdm/task-types', body);
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm14_TaskType.delete */
  deleteTaskTypes: async (taskTypeIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/tdm/task-types', { data: taskTypeIds });
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm95_ChangeHistory.selectByTargetId (changeType은 구분 콤보 글자, 없으면 전체) */
  searchChangeHistories: async (p: { targetTable: string; targetId?: number | null; changeType?: string | null; searchText?: string | null }): Promise<TdmChangeHistory[]> => {
    const res = await apiClient.get<ApiResponse<TdmChangeHistory[]>>('v1/tdm/change-histories', { params: p });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm96_ChangeDetail.selectByChangeHistoryId */
  searchChangeDetails: async (changeHistoryId: number): Promise<TdmChangeDetail[]> => {
    const res = await apiClient.get<ApiResponse<TdmChangeDetail[]>>(`v1/tdm/change-histories/${changeHistoryId}/details`);
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm05_Cncl.selectByDate (allYn이면 기간 조건 없음) */
  searchCouncils: async (p: { baseDate: string; allYn: boolean; roleId?: number | null }): Promise<TdmCouncil[]> => {
    const res = await apiClient.get<ApiResponse<TdmCouncil[]>>('v1/tdm/councils', { params: { ...p, roleId: p.roleId ?? undefined } });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm05_Cncl.modelUpdate (cnclId가 없으면 새 회의체) */
  saveCouncil: async (req: TdmCouncilSaveReq): Promise<TdmCouncil> => {
    const res = await apiClient.put<ApiResponse<TdmCouncil>>('v1/tdm/councils', req);
    return res.data.data as TdmCouncil;
  },

  /** AS-IS tdm.Tdm05_Cncl.delete (연결된 직책이 있으면 서버가 거절) */
  deleteCouncils: async (cnclIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/tdm/councils', { data: cnclIds });
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm22_RoleRelateCncl.selectByCnclId */
  searchCouncilRoles: async (cnclId: number): Promise<TdmCouncilRole[]> => {
    const res = await apiClient.get<ApiResponse<TdmCouncilRole[]>>(`v1/tdm/councils/${cnclId}/roles`);
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm22_RoleRelateCncl.update (ID ≤ 0은 새 행) */
  saveCouncilRoles: async (cnclId: number, rows: TdmCouncilRole[]): Promise<TdmCouncilRole[]> => {
    const res = await apiClient.put<ApiResponse<TdmCouncilRole[]>>(`v1/tdm/councils/${cnclId}/roles`, rows);
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm22_RoleRelateCncl.delete */
  deleteCouncilRoles: async (cnclId: number, ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/tdm/councils/${cnclId}/roles`, { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm20_Role.selectByDate (직책 고르기창, searchText는 서버가 '%…%'로 감싼다) */
  searchCouncilRoleLookup: async (p: { baseDate: string; searchText: string }): Promise<TdmCouncilRoleLookup[]> => {
    const res = await apiClient.get<ApiResponse<TdmCouncilRoleLookup[]>>('v1/tdm/councils/role-lookup', { params: p });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm20_Role.selectByDate (roleType을 주면 그 직책그룹만 — 보고CEO 고르기는 "C") */
  searchRoles: async (p: { baseDate: string; allYn: boolean; searchText: string; roleType?: string | null }): Promise<TdmRole[]> => {
    const res = await apiClient.get<ApiResponse<TdmRole[]>>('v1/tdm/roles', { params: { ...p, roleType: p.roleType ?? undefined } });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm20_Role.countUseByRoleId (임원별 직책배정에 쓰인 건수 합) */
  countRoleUse: async (roleIds: number[]): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>('v1/tdm/roles/use-count', { params: { roleIds: roleIds.join(',') } });
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm20_Role.modelUpdate (roleId가 없으면 새 직책, 수정이면 reason 필요) */
  saveRole: async (req: TdmRoleSaveReq): Promise<TdmRole> => {
    const res = await apiClient.put<ApiResponse<TdmRole>>('v1/tdm/roles', req);
    return res.data.data as TdmRole;
  },

  /** AS-IS Tdm20_Lookup_SelectSingle.confirm — 그 직책의 보고CEO만 바꾼다 */
  updateRoleCeo: async (roleId: number, ceoRoleId: number): Promise<TdmRole> => {
    const res = await apiClient.put<ApiResponse<TdmRole>>(`v1/tdm/roles/${roleId}/ceo`, null, { params: { ceoRoleId } });
    return res.data.data as TdmRole;
  },

  /** AS-IS tdm.Tdm20_Role.delete (삭제사유 필요) */
  deleteRoles: async (ids: number[], reason: string): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/tdm/roles', { data: { ids, reason } });
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm21_RoleRelateTask.selectByRoloId */
  searchRoleTasks: async (roleId: number): Promise<TdmRoleTask[]> => {
    const res = await apiClient.get<ApiResponse<TdmRoleTask[]>>(`v1/tdm/roles/${roleId}/tasks`);
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm21_RoleRelateTask.update (새 행만 INSERT) */
  saveRoleTasks: async (roleId: number, rows: TdmRoleTask[]): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>(`v1/tdm/roles/${roleId}/tasks`, rows);
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm21_RoleRelateTask.delete */
  deleteRoleTasks: async (roleId: number, ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/tdm/roles/${roleId}/tasks`, { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm22_RoleRelateCncl.selectByRoleId */
  searchRoleCouncils: async (roleId: number): Promise<TdmRoleCouncil[]> => {
    const res = await apiClient.get<ApiResponse<TdmRoleCouncil[]>>(`v1/tdm/roles/${roleId}/councils`);
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm22_RoleRelateCncl.update (ID ≤ 0은 새 행) */
  saveRoleCouncils: async (roleId: number, rows: TdmRoleCouncil[]): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>(`v1/tdm/roles/${roleId}/councils`, rows);
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm22_RoleRelateCncl.delete */
  deleteRoleCouncils: async (roleId: number, ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/tdm/roles/${roleId}/councils`, { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm23_RoleRelateOrg.selectByRoleId (기준일의 조직) */
  searchRoleOrgs: async (roleId: number, stdDate: string): Promise<TdmRoleOrg[]> => {
    const res = await apiClient.get<ApiResponse<TdmRoleOrg[]>>(`v1/tdm/roles/${roleId}/orgs`, { params: { stdDate } });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm23_RoleRelateOrg.update (새 행만 INSERT) */
  saveRoleOrgs: async (roleId: number, stdDate: string, rows: TdmRoleOrg[]): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>(`v1/tdm/roles/${roleId}/orgs`, rows, { params: { stdDate } });
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm23_RoleRelateOrg.delete */
  deleteRoleOrgs: async (roleId: number, ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/tdm/roles/${roleId}/orgs`, { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm08_ManagerInfo.selectByCompanyId (companyId는 서버, searchText는 서버가 '%…%') */
  searchManagers: async (searchText: string): Promise<TdmManager[]> => {
    const res = await apiClient.get<ApiResponse<TdmManager[]>>('v1/tdm/managers', { params: { searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm08_ManagerInfo.selectByManagerType */
  searchManagerInfos: async (managerType: string, orgId: number | null): Promise<TdmManagerInfo[]> => {
    const res = await apiClient.get<ApiResponse<TdmManagerInfo[]>>('v1/tdm/managers/infos', { params: { managerType, orgId: orgId ?? undefined } });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm08_ManagerInfo.update (ID ≤ 0은 INSERT) */
  saveManagerInfos: async (rows: TdmManagerInfo[]): Promise<TdmManagerInfo[]> => {
    const req = rows.map(r => ({ managerInfoId: r.managerInfoId, managerType: r.managerType, orgId: r.orgId, personId: r.personId, startDate: r.startDate, endDate: r.endDate || null }));
    const res = await apiClient.put<ApiResponse<TdmManagerInfo[]>>('v1/tdm/managers', req);
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm08_ManagerInfo.delete */
  deleteManagerInfos: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/tdm/managers', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm23_RoleRelateOrg.selectByRoleId (담당부서 조회창 Tdm23_Lookup_SelectOrg — tdm09Yn이면 승인선에 아직 없는 부서만, searchText는 서버가 '%…%') */
  searchRoleOrgLookup: async (roleId: number, stdDate: string, tdm09Yn: boolean, searchText: string): Promise<TdmRoleOrgLookup[]> => {
    const res = await apiClient.get<ApiResponse<TdmRoleOrgLookup[]>>(`v1/tdm/roles/${roleId}/orgs/lookup`, { params: { stdDate, tdm09Yn, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm09_ApprStep.selectByCompanyId (companyId는 서버, typeCode 'C', searchText는 서버가 '%…%') */
  searchApprSteps: async (searchText: string): Promise<TdmApprStep[]> => {
    const res = await apiClient.get<ApiResponse<TdmApprStep[]>>('v1/tdm/appr-steps', { params: { searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm09_ApprStep.update (ID ≤ 0은 INSERT, 하위 승인자의 직책·부서도 같이 바뀐다) */
  saveApprSteps: async (rows: TdmApprStep[]): Promise<TdmApprStep[]> => {
    const req = rows.map(r => ({ apprStepId: r.apprStepId, roleId: r.roleId, orgId: r.orgId }));
    const res = await apiClient.put<ApiResponse<TdmApprStep[]>>('v1/tdm/appr-steps', req);
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm09_ApprStep.deleteByParentId (하위 승인자도 같이 지운다) */
  deleteApprSteps: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/tdm/appr-steps', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm09_ApprStep.selectByParentId (typeCode 'T') */
  searchApprStepChildren: async (apprStepId: number): Promise<TdmApprStepChild[]> => {
    const res = await apiClient.get<ApiResponse<TdmApprStepChild[]>>(`v1/tdm/appr-steps/${apprStepId}/steps`);
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm09_ApprStep.modelUpdate (고른 사원 ID마다 승인자 한 행, 승인순서는 서버가 이어 붙인다) */
  addApprStepChildren: async (apprStepId: number, personIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>(`v1/tdm/appr-steps/${apprStepId}/steps`, personIds);
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm09_ApprStep.inUpdateData (위로·아래로 뒤 순서 저장) */
  saveApprStepChildOrder: async (rows: Pick<TdmApprStepChild, 'apprStepId' | 'apprSeq'>[]): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/tdm/appr-steps/steps/order', rows.map(r => ({ apprStepId: r.apprStepId, apprSeq: r.apprSeq })));
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm09_ApprStep.delete (승인자 행) */
  deleteApprStepChildren: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/tdm/appr-steps/steps', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm30_RoleAllc.selectByText (companyId는 서버, searchText는 서버가 '%…%', allYn이 true면 기준일 조건 없음) */
  searchRoleAllcs: async (baseDate: string, allYn: boolean, searchText: string): Promise<TdmRoleAllc[]> => {
    const res = await apiClient.get<ApiResponse<TdmRoleAllc[]>>('v1/tdm/role-allcs', { params: { baseDate, allYn, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm30_RoleAllc.notInRoleAllcIdList (겹침 검사용: 고른 행을 뺀 회사의 직책배정) */
  searchRoleAllcOthers: async (excludeIds: number[]): Promise<TdmRoleAllc[]> => {
    const res = await apiClient.get<ApiResponse<TdmRoleAllc[]>>('v1/tdm/role-allcs/others', { params: { excludeIds: excludeIds.join(',') } });
    return res.data.data ?? [];
  },

  /** AS-IS Tdm30_Edit_RoleAllc.update (직책배정 + 책무배분일 한 건) */
  createRoleAllc: async (req: TdmRoleAllcCreateReq): Promise<TdmRoleAllc> => {
    const res = await apiClient.post<ApiResponse<TdmRoleAllc>>('v1/tdm/role-allcs', req);
    return res.data.data;
  },

  /** AS-IS Tdm30_Edit_RoleAllcModify.update */
  updateRoleAllc: async (roleAllcId: number, req: TdmRoleAllcUpdateReq): Promise<TdmRoleAllc> => {
    const res = await apiClient.put<ApiResponse<TdmRoleAllc>>(`v1/tdm/role-allcs/${roleAllcId}`, req);
    return res.data.data;
  },

  /** AS-IS tdm.Tdm30_RoleAllc.delete (책무배분일도 같이 지운다) */
  deleteRoleAllcs: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/tdm/role-allcs', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm34_RoleAllcDetail.selectByRoleAllcId */
  searchRoleAllcDetails: async (roleAllcId: number): Promise<TdmRoleAllcDetail[]> => {
    const res = await apiClient.get<ApiResponse<TdmRoleAllcDetail[]>>(`v1/tdm/role-allcs/${roleAllcId}/details`);
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm34_RoleAllcDetail.update (ID ≤ 0은 INSERT, 저장 뒤 목록 전체를 돌려준다) */
  saveRoleAllcDetails: async (roleAllcId: number, rows: TdmRoleAllcDetail[]): Promise<TdmRoleAllcDetail[]> => {
    const req = rows.map(r => ({ roleAllcDetailId: r.roleAllcDetailId, roleAllcDate: r.roleAllcDate, regReason: r.regReason, deputyEmpName: r.deputyEmpName }));
    const res = await apiClient.put<ApiResponse<TdmRoleAllcDetail[]>>(`v1/tdm/role-allcs/${roleAllcId}/details`, req);
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm34_RoleAllcDetail.delete */
  deleteRoleAllcDetails: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/tdm/role-allcs/details', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm35_RoleAllcTask.selectTask */
  searchRoleAllcTasks: async (roleAllcDetailId: number): Promise<TdmRoleAllcTask[]> => {
    const res = await apiClient.get<ApiResponse<TdmRoleAllcTask[]>>(`v1/tdm/role-allcs/details/${roleAllcDetailId}/tasks`);
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm35_RoleAllcTask.selectTaskDetail */
  searchRoleAllcTaskDetails: async (roleAllcDetailId: number, taskId: number): Promise<TdmRoleAllcTaskDetail[]> => {
    const res = await apiClient.get<ApiResponse<TdmRoleAllcTaskDetail[]>>(`v1/tdm/role-allcs/details/${roleAllcDetailId}/tasks/${taskId}/details`);
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm35_RoleAllcTask.deleteInsert (상신 전 확정책무를 다시 만든다) */
  rebuildRoleAllcTasks: async (roleAllcDetailId: number): Promise<void> => {
    await apiClient.post<ApiResponse<void>>(`v1/tdm/role-allcs/details/${roleAllcDetailId}/tasks/rebuild`);
  },

  /** AS-IS tdm.Tdm31_RoleDesc.getRollAllcDetailId (승인 완료된 책무기술서 ID, 없으면 null) */
  searchRoleDescIdByDetail: async (roleAllcDetailId: number): Promise<number | null> => {
    const res = await apiClient.get<ApiResponse<number | null>>(`v1/tdm/role-allcs/details/${roleAllcDetailId}/role-desc`);
    return res.data.data ?? null;
  },

  /** AS-IS tdm.Tdm02_HrRecord.selectByCompanyId (applyCode "0"=미적용건만 · "%"=조회기간, searchText는 서버가 '%…%') */
  searchHrRecords: async (applyCode: string, startDate: string | null, closeDate: string | null, searchText: string, limit?: number): Promise<TdmHrRecord[]> => {
    const res = await apiClient.get<ApiResponse<Omit<TdmHrRecord, 'applyYn'>[]>>('v1/tdm/hr-records', { params: { applyCode, startDate, closeDate, searchText, limit } });
    return (res.data.data ?? []).map(r => ({ ...r, applyYn: r.applyCode != null && r.applyCode !== '0' }));
  },

  /** AS-IS tdm.Tdm02_HrRecord.updateApplyCode */
  saveHrRecords: async (rows: { hrRecordId: number; applyCode: string | null; note: string | null }[]): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/tdm/hr-records', rows);
    return res.data.data ?? 0;
  },
};
