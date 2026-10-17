import { apiClient } from './client';
import { ApiResponse, PageRes } from '../types/auth';
import { Academic, Account, AddDeduct, AddTitle, AddTitleSaveReq, Education, Career, Deduct, EmpEvent, Evaluation, ExceptBiz, Family, License, CompanyPerson, NoteAdmin, OrgInfo, Others, PersonSaveReq, Project, RelateFile, Reward, Trans, TransInfo, TransInfoCreateReq, TransPerson, UserInfo } from '../types/emp';

/** 날짜 칸은 'yyyy-MM-dd'로 맞춘다 (서버 LocalDateTime 'yyyy-MM-ddTHH:mm:ss' → 날짜 편집기) */
const day = (v?: string | null) => (v ? v.slice(0, 10) : v);
const toTrans = (t: Trans): Trans => ({ ...t, transDate: day(t.transDate), expiryDate: day(t.expiryDate) });

/** C01 사원정보 관리 (Emp00_Tab_TransInfo) */
export const empApi = {
  /**
   * AS-IS emp.Emp00_TransInfo.selectByText: transCode 전체 000 / 재직 100 / 겸직 800 / 퇴직 900.
   * separateAddTitle = isSeparateAddTitle (안 주면 true — C01. A04는 false: 겸직도 재직으로)
   */
  searchTransInfos: async (transDate: string | undefined, searchText: string, transCode: string, separateAddTitle?: boolean): Promise<TransInfo[]> => {
    const res = await apiClient.get<ApiResponse<TransInfo[]>>('v1/emp/trans-infos', { params: { transDate, searchText, transCode, separateAddTitle } });
    return res.data.data ?? [];
  },

  /** AS-IS emp.Emp00_TransInfo.selectByText — 고른 회사의 사원 (Emp00_Lookup_SelectMulti.open(companyId, …), sys admin만) */
  searchCompanyTransInfos: async (companyId: number, transDate: string | undefined, searchText: string, transCode: string): Promise<TransInfo[]> => {
    const res = await apiClient.get<ApiResponse<TransInfo[]>>(`v1/emp/companies/${companyId}/trans-infos`, { params: { transDate, searchText, transCode } });
    return res.data.data ?? [];
  },

  /** AS-IS emp.Emp00_TransInfo.update (신규사원 등록) → 등록된 행 */
  createTransInfo: async (req: TransInfoCreateReq): Promise<TransInfo> => {
    const res = await apiClient.post<ApiResponse<TransInfo>>('v1/emp/trans-infos', req);
    return res.data.data;
  },

  /** AS-IS emp.Emp00_TransInfo.selectOneByPersonId(personId, '%') — Emp00_Current_TransInfoModel */
  getCurrentTransInfo: async (personId: number): Promise<TransInfo> => {
    const res = await apiClient.get<ApiResponse<TransInfo>>(`v1/emp/persons/${personId}/trans-info`);
    return res.data.data;
  },

  /** AS-IS emp.Emp01_Person.update */
  updatePerson: async (personId: number, req: PersonSaveReq): Promise<void> => {
    await apiClient.put(`v1/emp/persons/${personId}`, req);
  },

  /** 기타정보 탭: AS-IS selectByText 행의 empOthersModel (사람 1명) */
  getOthers: async (personId: number): Promise<Others> => {
    const res = await apiClient.get<ApiResponse<Others>>(`v1/emp/persons/${personId}/others`);
    return res.data.data;
  },

  /** AS-IS emp.Emp02_Others.updateOne (emp02_others.upsert) → 다시 읽은 값 */
  updateOthers: async (req: Others): Promise<Others> => {
    const res = await apiClient.put<ApiResponse<Others>>('v1/emp/others', req);
    return res.data.data;
  },

  /** AS-IS emp.Emp04_AddTitle.selectByPersonId → 건수 */
  countAddTitles: async (personId: number): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>(`v1/emp/persons/${personId}/add-titles/count`);
    return res.data.data ?? 0;
  },

  /** AS-IS emp.Emp01_Person.deleteTarget */
  deletePerson: async (personId: number): Promise<void> => {
    await apiClient.delete(`v1/emp/persons/${personId}`);
  },

  /** AS-IS emp.Emp03_Trans.selectByPersonId (deleteCheck도 이것으로) */
  searchTranses: async (personId: number): Promise<Trans[]> => {
    const res = await apiClient.get<ApiResponse<Trans[]>>(`v1/emp/persons/${personId}/trans`);
    return (res.data.data ?? []).map(toTrans);
  },

  /** AS-IS emp.Emp03_Trans.selectByText (사원찾기): 조직/직무/성명 '%검색어%' */
  searchTransPersons: async (searchText: string): Promise<TransPerson[]> => {
    const res = await apiClient.get<ApiResponse<TransPerson[]>>('v1/emp/trans', { params: { searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS emp.Emp03_Trans.selectByText — 사원찾기 open(companyId, …): 고른 고객사 사원 (A05, sys admin) */
  searchCompanyTransPersons: async (companyId: number, searchText: string): Promise<TransPerson[]> => {
    const res = await apiClient.get<ApiResponse<TransPerson[]>>(`v1/emp/companies/${companyId}/trans`, { params: { searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS emp.Emp03_Trans.update: 추가·변경 행 → 저장된 행(요청 순서) */
  updateTranses: async (rows: Trans[]): Promise<Trans[]> => {
    const body = rows.map(({ transId, personId, transDate, transCd, kindCd, orgCodeId, titleCd, posCd, duty, expiryDate, transReason, orgHeadYn, officerYn, tdmTargetYn, nonStayYn }) =>
      ({ transId, personId, transDate, transCd, kindCd, orgCodeId, titleCd, posCd, duty, expiryDate: expiryDate || null, transReason, orgHeadYn, officerYn, tdmTargetYn, nonStayYn }));
    const res = await apiClient.put<ApiResponse<Trans[]>>('v1/emp/trans', body);
    return (res.data.data ?? []).map(toTrans);
  },

  /** AS-IS emp.Emp03_Trans.delete → 지운 건수 */
  deleteTranses: async (transIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/emp/trans', { data: transIds });
    return res.data.data ?? 0;
  },

  /** AS-IS emp.Emp35_Deduct.selectByPersonId */
  getDeducts: async (personId: number): Promise<Deduct[]> => {
    const res = await apiClient.get<ApiResponse<Deduct[]>>(`v1/emp/persons/${personId}/deducts`);
    return res.data.data ?? [];
  },

  /** AS-IS Emp35_Deduct.insert — 급여공제 생성 */
  createDeduct: async (personId: number, startDate: string): Promise<void> => {
    await apiClient.post('v1/emp/deducts', { personId, startDate });
  },

  /** AS-IS Emp35_Deduct.update → UpdateDataModel */
  updateDeduct: async (deductId: number, req: Partial<Deduct>): Promise<Deduct> => {
    const res = await apiClient.put<ApiResponse<Deduct>>(`v1/emp/deducts/${deductId}`, req);
    return res.data.data;
  },

  /** AS-IS Emp35_Deduct.deleteAll */
  deleteDeduct: async (deductId: number): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/emp/deducts/${deductId}`);
    return res.data.data ?? 0;
  },

  /** AS-IS Emp36_AddDeduct.selectByDeductId */
  getAddDeducts: async (deductId: number): Promise<AddDeduct[]> => {
    const res = await apiClient.get<ApiResponse<AddDeduct[]>>(`v1/emp/deducts/${deductId}/add-deducts`);
    return res.data.data ?? [];
  },

  /** AS-IS Emp36_AddDeduct.updateDeductCnt */
  updateAddDeducts: async (deductId: number, rows: AddDeduct[]): Promise<AddDeduct[]> => {
    const body = rows.map(r => ({ addDeductId: r.addDeductId, addDeductCnt: r.addDeductCnt }));
    const res = await apiClient.put<ApiResponse<AddDeduct[]>>(`v1/emp/deducts/${deductId}/add-deducts`, body);
    return res.data.data ?? [];
  },

  /** AS-IS Emp14_Account.selectByPersonId */
  getAccounts: async (personId: number): Promise<Account[]> => {
    const res = await apiClient.get<ApiResponse<Account[]>>(`v1/emp/persons/${personId}/accounts`);
    return res.data.data ?? [];
  },

  /** AS-IS Emp14_Account.update → UpdateDataModel */
  updateAccounts: async (rows: Account[]): Promise<Account[]> => {
    const body = rows.map(r => ({
      accountId: r.accountId, personId: r.personId,
      startDate: r.startDate, bankCd: r.bankCd,
      accountNoDec: r.accountNoDec, note: r.note,
    }));
    const res = await apiClient.put<ApiResponse<Account[]>>('v1/emp/accounts', body);
    return res.data.data ?? [];
  },

  /** AS-IS Emp14_Account.delete → UpdateDataModel.deleteModel */
  deleteAccounts: async (accountIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/emp/accounts', { data: accountIds });
    return res.data.data ?? 0;
  },

  /** AS-IS Emp18_RelateFile.selectByPersonId */
  getRelateFiles: async (personId: number): Promise<RelateFile[]> => {
    const res = await apiClient.get<ApiResponse<RelateFile[]>>(`v1/emp/persons/${personId}/relate-files`);
    return res.data.data ?? [];
  },

  /** AS-IS Emp18_RelateFile.update → UpdateDataModel */
  updateRelateFiles: async (rows: RelateFile[]): Promise<RelateFile[]> => {
    const body = rows.map(r => ({ relateFileId: r.relateFileId, personId: r.personId, note: r.note }));
    const res = await apiClient.put<ApiResponse<RelateFile[]>>('v1/emp/relate-files', body);
    return res.data.data ?? [];
  },

  /** AS-IS Emp18_RelateFile.delete → UpdateDataModel.deleteModel */
  deleteRelateFiles: async (relateFileIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/emp/relate-files', { data: relateFileIds });
    return res.data.data ?? 0;
  },

  /** AS-IS Emp06_Family.selectByPersonId */
  getFamilies: async (personId: number): Promise<Family[]> => {
    const res = await apiClient.get<ApiResponse<Family[]>>(`v1/emp/persons/${personId}/families`);
    return res.data.data ?? [];
  },

  /** AS-IS Emp06_Family.update → UpdateDataModel */
  updateFamilies: async (rows: Family[]): Promise<Family[]> => {
    const body = rows.map(r => ({
      familyId: r.familyId, personId: r.personId, familyNm: r.familyNm,
      relationCd: r.relationCd, locateCd: r.locateCd, disabilityGrade: r.disabilityGrade,
      birthday: r.birthday, familySchool: r.familySchool, familyJob: r.familyJob,
      schoolLocation: r.schoolLocation, familyLocation: r.familyLocation, note: r.note,
    }));
    const res = await apiClient.put<ApiResponse<Family[]>>('v1/emp/families', body);
    return res.data.data ?? [];
  },

  /** AS-IS Emp06_Family.delete */
  deleteFamilies: async (familyIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/emp/families', { data: familyIds });
    return res.data.data ?? 0;
  },

  /** AS-IS Emp07_Career.selectByPersonId */
  getCareers: async (personId: number): Promise<Career[]> => {
    const res = await apiClient.get<ApiResponse<Career[]>>(`v1/emp/persons/${personId}/careers`);
    return res.data.data ?? [];
  },

  /** AS-IS Emp07_Career.update → UpdateDataModel */
  updateCareers: async (rows: Career[]): Promise<Career[]> => {
    const body = rows.map(r => ({
      careerId: r.careerId, personId: r.personId, frYm: r.frYm, toYm: r.toYm,
      companyNm: r.companyNm, industry: r.industry, finalOrg: r.finalOrg,
      finalTitle: r.finalTitle, careerTyCd: r.careerTyCd, finalRole: r.finalRole,
      financeRelateYn: r.financeRelateYn, mainCareerYn: r.mainCareerYn,
      extrAddTitleYn: r.extrAddTitleYn, note: r.note,
    }));
    const res = await apiClient.put<ApiResponse<Career[]>>('v1/emp/careers', body);
    return res.data.data ?? [];
  },

  /** AS-IS Emp07_Career.delete */
  deleteCareers: async (careerIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/emp/careers', { data: careerIds });
    return res.data.data ?? 0;
  },

  /** AS-IS Emp05_Academic.selectByPersonId */
  getAcademics: async (personId: number): Promise<Academic[]> => {
    const res = await apiClient.get<ApiResponse<Academic[]>>(`v1/emp/persons/${personId}/academics`);
    return res.data.data ?? [];
  },

  /** AS-IS Emp05_Academic.update → UpdateDataModel */
  updateAcademics: async (rows: Academic[]): Promise<Academic[]> => {
    const body = rows.map(r => ({
      academicId: r.academicId, personId: r.personId, frYm: r.frYm, toYm: r.toYm,
      schoolName: r.schoolName, bachelorDegree: r.bachelorDegree,
      financeRelateYn: r.financeRelateYn, degreeCredit: r.degreeCredit,
      graduateDegree: r.graduateDegree, schoolLocation: r.schoolLocation, note: r.note,
    }));
    const res = await apiClient.put<ApiResponse<Academic[]>>('v1/emp/academics', body);
    return res.data.data ?? [];
  },

  /** AS-IS Emp05_Academic.delete */
  deleteAcademics: async (academicIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/emp/academics', { data: academicIds });
    return res.data.data ?? 0;
  },

  /** AS-IS Emp08_License.selectByPersonId */
  getLicenses: async (personId: number): Promise<License[]> => {
    const res = await apiClient.get<ApiResponse<License[]>>(`v1/emp/persons/${personId}/licenses`);
    return res.data.data ?? [];
  },

  /** AS-IS Emp08_License.update → UpdateDataModel */
  updateLicenses: async (rows: License[]): Promise<License[]> => {
    const body = rows.map(r => ({
      licenseId: r.licenseId, personId: r.personId, certifiedDt: r.certifiedDt,
      certifiedNm: r.certifiedNm, licenseNo: r.licenseNo, issuingAgency: r.issuingAgency,
      issuingGrade: r.issuingGrade, financeRelateYn: r.financeRelateYn,
      kofiaRegDate: r.kofiaRegDate, note: r.note,
    }));
    const res = await apiClient.put<ApiResponse<License[]>>('v1/emp/licenses', body);
    return res.data.data ?? [];
  },

  /** AS-IS Emp08_License.delete */
  deleteLicenses: async (licenseIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/emp/licenses', { data: licenseIds });
    return res.data.data ?? 0;
  },
};

/** AS-IS Emp11_TabPage_Reward */
export const empRewardApi = {
  getRewards: async (personId: number): Promise<Reward[]> => {
    const res = await apiClient.get<ApiResponse<Reward[]>>(`v1/emp/persons/${personId}/rewards`);
    return res.data.data ?? [];
  },
  updateRewards: async (rows: Reward[]): Promise<Reward[]> => {
    const body = rows.map(r => ({
      rewardId: r.rewardId, personId: r.personId, rewardCd: r.rewardCd,
      rewardDt: r.rewardDt, rewardGroup: r.rewardGroup,
      rewardNm: r.rewardNm, rewardDesc: r.rewardDesc, note: r.note,
    }));
    const res = await apiClient.put<ApiResponse<Reward[]>>('v1/emp/rewards', body);
    return res.data.data ?? [];
  },
  deleteRewards: async (rewardIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/emp/rewards', { data: rewardIds });
    return res.data.data ?? 0;
  },
};

/** E05-1 AS-IS Emp33_Lookup_ExceptBiz (사원별 예외업무) */
export const empExceptBizApi = {
  /** AS-IS emp.Emp33_ExceptBiz.selectByExceptBizCode */
  searchExceptBiz: async (exceptBizCode: string): Promise<ExceptBiz[]> => {
    const res = await apiClient.get<ApiResponse<ExceptBiz[]>>('v1/emp/except-biz', { params: { exceptBizCode } });
    return res.data.data ?? [];
  },
  /** AS-IS emp.Emp33_ExceptBiz.update → 저장된 행(요청 순서). 새 행(id ≤ 0)은 id를 빼고 보낸다 */
  saveExceptBiz: async (rows: ExceptBiz[]): Promise<ExceptBiz[]> => {
    const body = rows.map(({ exceptBizId, personId, exceptBizCode, startDate, closeDate, reason, unvisibleYn }) =>
      ({ exceptBizId: exceptBizId > 0 ? exceptBizId : null, personId, exceptBizCode, startDate, closeDate, reason, unvisibleYn }));
    const res = await apiClient.put<ApiResponse<ExceptBiz[]>>('v1/emp/except-biz', body);
    return res.data.data ?? [];
  },
  /** AS-IS emp.Emp33_ExceptBiz.delete → 지운 건수 */
  deleteExceptBiz: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/emp/except-biz', { data: ids });
    return res.data.data ?? 0;
  },
};

/** AS-IS Emp09_TabPage_Evaluation */
export const empEvaluationApi = {
  getEvaluations: async (personId: number): Promise<Evaluation[]> => {
    const res = await apiClient.get<ApiResponse<Evaluation[]>>(`v1/emp/persons/${personId}/evaluations`);
    return res.data.data ?? [];
  },
  updateEvaluations: async (rows: Evaluation[]): Promise<Evaluation[]> => {
    const body = rows.map(r => ({
      evaluationId: r.evaluationId, personId: r.personId, evaluationDt: r.evaluationDt,
      evaluationOrg: r.evaluationOrg, evaluationEmp: r.evaluationEmp,
      evaluationGrade: r.evaluationGrade, evaluationDesc: r.evaluationDesc, note: r.note,
    }));
    const res = await apiClient.put<ApiResponse<Evaluation[]>>('v1/emp/evaluations', body);
    return res.data.data ?? [];
  },
  deleteEvaluations: async (evaluationIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/emp/evaluations', { data: evaluationIds });
    return res.data.data ?? 0;
  },
};

/** AS-IS Emp12_TabPage_Event */
export const empEventApi = {
  getEvents: async (personId: number): Promise<EmpEvent[]> => {
    const res = await apiClient.get<ApiResponse<EmpEvent[]>>(`v1/emp/persons/${personId}/events`);
    return res.data.data ?? [];
  },
  updateEvents: async (rows: EmpEvent[]): Promise<EmpEvent[]> => {
    const body = rows.map(r => ({
      eventId: r.eventId, personId: r.personId, eventDt: r.eventDt,
      eventNm: r.eventNm, eventPart: r.eventPart, eventDesc: r.eventDesc, note: r.note,
    }));
    const res = await apiClient.put<ApiResponse<EmpEvent[]>>('v1/emp/events', body);
    return res.data.data ?? [];
  },
  deleteEvents: async (eventIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/emp/events', { data: eventIds });
    return res.data.data ?? 0;
  },
};

/** AS-IS Emp13_TabPage_Project */
export const empProjectApi = {
  getProjects: async (personId: number): Promise<Project[]> => {
    const res = await apiClient.get<ApiResponse<Project[]>>(`v1/emp/persons/${personId}/projects`);
    return res.data.data ?? [];
  },
  updateProjects: async (rows: Project[]): Promise<Project[]> => {
    const body = rows.map(r => ({
      projectId: r.projectId, personId: r.personId, frYm: r.frYm,
      toYm: r.toYm, projectNm: r.projectNm, note: r.note,
    }));
    const res = await apiClient.put<ApiResponse<Project[]>>('v1/emp/projects', body);
    return res.data.data ?? [];
  },
  deleteProjects: async (projectIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/emp/projects', { data: projectIds });
    return res.data.data ?? 0;
  },
};

/** AS-IS Emp04_TabPage_AddTitle, Emp04_Edit_AddTitle */
export const empAddTitleApi = {
  getAddTitles: async (personId: number): Promise<AddTitle[]> => {
    const res = await apiClient.get<ApiResponse<AddTitle[]>>('v1/emp/add-titles', { params: { personId } });
    return res.data.data ?? [];
  },
  /** updateList — 등록(transPersonId 없음)은 POST, 수정은 PUT */
  updateList: async (req: AddTitleSaveReq): Promise<AddTitle> => {
    const res = req.addTitleId
      ? await apiClient.put<ApiResponse<AddTitle>>('v1/emp/add-titles', req)
      : await apiClient.post<ApiResponse<AddTitle>>('v1/emp/add-titles', req);
    return res.data.data;
  },
  /** deleteList + delete */
  deleteAddTitle: async (addTitleId: number): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/emp/add-titles/${addTitleId}`);
    return res.data.data ?? 0;
  },
};

/** AS-IS Emp19_TabPage_education */
export const empEducationApi = {
  getEducations: async (personId: number): Promise<Education[]> => {
    const res = await apiClient.get<ApiResponse<Education[]>>(`v1/emp/persons/${personId}/educations`);
    return res.data.data ?? [];
  },
  updateEducations: async (rows: Education[]): Promise<Education[]> => {
    const body = rows.map(r => ({
      educationId: r.educationId, personId: r.personId, issueDate: r.issueDate,
      content: r.content, educationYn: r.educationYn,
    }));
    const res = await apiClient.put<ApiResponse<Education[]>>('v1/emp/educations', body);
    return res.data.data ?? [];
  },
  deleteEducations: async (educationIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/emp/educations', { data: educationIds });
    return res.data.data ?? 0;
  },
  /** multiUpdate — 일괄등록 */
  copyEducation: async (src: Education, personIds: number[]): Promise<number> => {
    const { issueDate, content, educationYn, note, educationCorpNm } = src;
    const res = await apiClient.post<ApiResponse<number>>('v1/emp/educations/copy', { issueDate, content, educationYn, note, educationCorpNm, personIds });
    return res.data.data ?? 0;
  },
};

/** C03 사용자정보 조회 (Emp01_Tab_UserInfo) — sys admin */
export const empUserInfoApi = {
  /** AS-IS emp.Emp01_Person.selectBySearchTextPaging (GridPagingLoader: offset·limit → 페이지 행 + 전체 건수) */
  searchUserInfos: async (params: { companyId?: number | null; searchText: string; useYn: string; quitYn: string; offset: number; limit: number }): Promise<PageRes<UserInfo>> => {
    const res = await apiClient.get<ApiResponse<PageRes<UserInfo>>>('v1/emp/persons', { params });
    return res.data.data ?? { total: 0, rows: [] };
  },
  /** C06 문자발송 대상 고르기: AS-IS emp.Emp01_Person.selectByPaging(selectByCompanyIdPaging) — companyId는 '%'(전체) 또는 회사 ID 문자열 */
  searchCompanyPersons: async (params: { companyId: string; searchText: string; useYn: string; offset: number; limit: number }): Promise<PageRes<CompanyPerson>> => {
    const res = await apiClient.get<ApiResponse<PageRes<CompanyPerson>>>('v1/emp/persons/by-company', { params });
    return res.data.data ?? { total: 0, rows: [] };
  },
  /** AS-IS emp.Emp02_Others.selectById(personId) */
  getNoteAdmin: async (personId: number): Promise<NoteAdmin> => {
    const res = await apiClient.get<ApiResponse<NoteAdmin>>(`v1/emp/persons/${personId}/note-admin`);
    return res.data.data;
  },
  /** AS-IS emp.Emp02_Others.modelUpdate → 다시 읽은 값 */
  updateNoteAdmin: async (req: NoteAdmin): Promise<NoteAdmin> => {
    const res = await apiClient.put<ApiResponse<NoteAdmin>>(`v1/emp/persons/${req.personId}/note-admin`,
      { othersId: req.othersId, noteAdmin: req.noteAdmin });
    return res.data.data;
  },
};

/** 조직 (Org00_Lookup_SelectSingle, Org00_OrgInfo) */
export const orgApi = {
  /** AS-IS org.Org00_OrgInfo.selectByKorName */
  searchOrgInfos: async (korName: string | undefined, baseDate: string): Promise<OrgInfo[]> => {
    const res = await apiClient.get<ApiResponse<OrgInfo[]>>('v1/org/org-infos', { params: { korName: korName || undefined, baseDate } });
    return res.data.data ?? [];
  },

  /** AS-IS org.Org00_OrgInfo.selectByOrgCodeId (없으면 null) */
  getOrgInfo: async (orgCodeId: number, baseDate: string): Promise<OrgInfo | null> => {
    const res = await apiClient.get<ApiResponse<OrgInfo | null>>(`v1/org/org-infos/${orgCodeId}`, { params: { baseDate } });
    return res.data.data ?? null;
  },
};
