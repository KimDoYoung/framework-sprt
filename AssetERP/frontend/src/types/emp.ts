/** 사원정보 목록 행 (GET /api/v1/emp/trans-infos, AS-IS Emp00_TransInfoModel). Y/N은 'true'/'false' 문자열, 날짜는 'yyyy-MM-dd…' */
export interface TransInfo {
  transId: number;
  personId: number;
  transDate?: string | null;
  transCd?: string | null;
  transNm?: string | null;
  kindCd?: string | null;
  kindNm?: string | null;
  posCd?: string | null;
  posNm?: string | null;
  titleCd?: string | null;
  titleNm?: string | null;
  orgCodeId?: number | null;
  orgKorNm?: string | null;
  parentFullNm?: string | null;
  officerYn?: string | null;
  expiryDate?: string | null;
  empNo?: string | null;
  korNm?: string | null;
  orderSeq?: string | null;
  hireCd?: string | null;
  hireNm?: string | null;
  applyCd?: string | null;
  applyNm?: string | null;
  hireDate?: string | null;
  retireDate?: string | null;
  emailAddr?: string | null;
  officeTelNo?: string | null;
  officeDetail?: string | null;
  mobileTelNo?: string | null;
  note?: string | null;
  financeProYn?: string | null;
  birthday?: string | null;
  genderNm?: string | null;
}

/** 신규사원 등록 (POST /api/v1/emp/trans-infos, AS-IS Emp03_Edit_Person) */
export interface TransInfoCreateReq {
  empNo: string;
  korNm: string;
  kindCd?: string;
  hireDate?: string;
  expiryDate?: string;
  officeTelNo?: string;
  officeDetail?: string;
  mobileTelNo: string;
  hireCd?: string;
  emailAddr: string;
  titleCd?: string;
  posCd?: string;
  orgCodeId?: number;
  note?: string;
}

/** 기본정보 탭 저장 (PUT /api/v1/emp/persons/{personId}, AS-IS Emp01_PersonModel) */
export interface PersonSaveReq {
  empNo?: string | null;
  korNm?: string | null;
  hireDate?: string | null;
  hireCd?: string | null;
  applyCd?: string | null;
  orderSeq?: string | null;
  emailAddr?: string | null;
  officeTelNo?: string | null;
  officeDetail?: string | null;
  mobileTelNo?: string | null;
  note?: string | null;
}

/** 일반발령 행 (GET /api/v1/emp/persons/{personId}/trans, AS-IS Emp03_TransModel) */
export interface Trans {
  transId: number;
  personId: number;
  transDate?: string | null;
  transCd?: string | null;
  transNm?: string | null;
  kindCd?: string | null;
  kindNm?: string | null;
  orgCodeId?: number | null;
  orgNm?: string | null;
  titleCd?: string | null;
  titleNm?: string | null;
  posCd?: string | null;
  posNm?: string | null;
  gradeNm?: string | null;
  duty?: string | null;
  expiryDate?: string | null;
  transReason?: string | null;
  orgHeadYn?: string | null;
  officerYn?: string | null;
  tdmTargetYn?: string | null;
  nonStayYn?: string | null;
}

/** 조직 (GET /api/v1/org/org-infos, AS-IS Org00_OrgInfoModel) */
export interface OrgInfo {
  orgCodeId: number;
  orgCd?: string | null;
  korNm?: string | null;
  parentFullNm?: string | null;
  levelCd?: string | null;
  levelNm?: string | null;
  modDate?: string | null;
}

/** 책무 대상 조직 (GET /api/v1/org/org-infos/tdm, AS-IS Org00_OrgInfoModel 중 Org00_Lookup_SelectTdm 그리드·선택 속성) */
export interface OrgTdm {
  orgCodeId: number;
  orgCd?: string | null;
  korNm?: string | null;
  korNmWithSubOrg?: string | null;
}

/** 사원찾기 행 (GET /api/v1/emp/trans, AS-IS Emp01_Lookup_PersonModel) */
export interface TransPerson {
  transId: number;
  personId: number;
  orgCodeId?: number | null;
  orgNm?: string | null;
  empNo?: string | null;
  korNm?: string | null;
  titleNm?: string | null;
}

/** 급여공제 행 (GET /api/v1/emp/persons/{personId}/deducts, AS-IS Emp35_DeductModel) */
export interface Deduct {
  deductId: number;
  companyId?: number | null;
  personId?: number | null;
  startDate?: string | null;
  basicDeductCnt?: number | null;
  addDeductYn?: string | null;
  insureYn?: string | null;
  reprYn?: string | null;
  withHoldRate?: number | null;
  note?: string | null;
  childDeductCnt?: number | null;
}

/** 추가인적공제 행 (GET /api/v1/emp/deducts/{deductId}/add-deducts, AS-IS Emp36_AddDeductModel) */
export interface AddDeduct {
  addDeductId: number;
  deductId: number;
  addDeductType?: string | null;
  addDeductTypeName?: string | null;
  addDeductCnt?: number | null;
}

/** 급여계좌 행 (GET /api/v1/emp/persons/{personId}/accounts, AS-IS Emp14_AccountModel) */
export interface Account {
  accountId: number;
  companyId?: number | null;
  personId?: number | null;
  startDate?: string | null;
  bankCd?: string | null;
  bankName?: string | null;
  accountNoDec?: string | null;
  note?: string | null;
}

/** 연관파일 행 (GET /api/v1/emp/persons/{personId}/relate-files, AS-IS Emp18_RelateFileModel — emp18 + sys10_file) */
export interface RelateFile {
  relateFileId: number;
  personId?: number | null;
  note?: string | null;
  fileId?: number | null;
  regDate?: string | null;
  fileName?: string | null;
  /** 용량(KB) — sys10_size */
  size?: number | null;
}

/** 가족사항 행 (GET /api/v1/emp/persons/{personId}/families, AS-IS Emp06_FamilyModel) */
export interface Family {
  familyId: number;
  personId?: number | null;
  familyNm?: string | null;
  relationCd?: string | null;
  locateCd?: string | null;
  locateNm?: string | null;
  disabilityGrade?: string | null;
  birthday?: string | null;
  familySchool?: string | null;
  familyJob?: string | null;
  schoolLocation?: string | null;
  familyLocation?: string | null;
  note?: string | null;
}

/** 경력사항 행 (GET /api/v1/emp/persons/{personId}/careers, AS-IS Emp07_CareerModel) */
export interface Career {
  careerId: number;
  personId?: number | null;
  frYm?: string | null;
  toYm?: string | null;
  companyNm?: string | null;
  industry?: string | null;
  finalOrg?: string | null;
  finalTitle?: string | null;
  careerTyCd?: string | null;
  careerTyNm?: string | null;
  finalRole?: string | null;
  financeRelateYn?: string | null;
  mainCareerYn?: string | null;
  extrAddTitleYn?: string | null;
  note?: string | null;
}

/** 학력정보 행 (GET /api/v1/emp/persons/{personId}/academics, AS-IS Emp05_AcademicModel) */
export interface Academic {
  academicId: number;
  personId?: number | null;
  frYm?: string | null;
  toYm?: string | null;
  schoolName?: string | null;
  bachelorDegree?: string | null;
  bachelorDegreeNm?: string | null;
  financeRelateYn?: string | null;
  degreeCredit?: string | null;
  graduateDegree?: string | null;
  graduateDegreeNm?: string | null;
  schoolLocation?: string | null;
  note?: string | null;
}

/** 자격사항 행 (GET /api/v1/emp/persons/{personId}/licenses, AS-IS Emp08_LicenseModel) */
export interface License {
  licenseId: number;
  personId?: number | null;
  certifiedDt?: string | null;
  certifiedNm?: string | null;
  licenseNo?: string | null;
  issuingAgency?: string | null;
  issuingGrade?: string | null;
  financeRelateYn?: string | null;
  kofiaRegDate?: string | null;
  note?: string | null;
}

/** 기타정보 탭 (AS-IS Emp02_OthersModel) — GET 응답 = PUT body */
export interface Others {
  othersId?: number | null;
  personId: number;
  chnName?: string | null;
  engName?: string | null;
  decCtzNo?: string | null;
  birthday?: string | null;
  lunarCode?: string | null;
  genderCode?: string | null;
  nationCode?: string | null;
  emailOther?: string | null;
  militaryCode?: string | null;
  familyDscr?: string | null;
  marriageCode?: string | null;
  zipCode?: string | null;
  zipAddress?: string | null;
  zipDetail?: string | null;
  homeTelNo?: string | null;
  note?: string | null;
  hireDateGroup?: string | null;
  hireDateLeaveCalc?: string | null;
}

/** 상벌내역 행 (GET /api/v1/emp/persons/{personId}/rewards, AS-IS Emp11_RewardModel) */
export interface Reward {
  rewardId: number;
  personId?: number | null;
  rewardCd?: string | null;
  rewardCdNm?: string | null;
  rewardDt?: string | null;
  rewardGroup?: string | null;
  rewardNm?: string | null;
  rewardDesc?: string | null;
  note?: string | null;
}

/** 고과(평가)내역 행 (GET /api/v1/emp/persons/{personId}/evaluations, AS-IS Emp09_EvaluationModel) */
export interface Evaluation {
  evaluationId: number;
  personId?: number | null;
  evaluationDt?: string | null;
  evaluationOrg?: string | null;
  evaluationEmp?: string | null;
  evaluationGrade?: string | null;
  evaluationDesc?: string | null;
  note?: string | null;
}

/** 행사내역 행 (GET /api/v1/emp/persons/{personId}/events, AS-IS Emp12_EventModel) */
export interface EmpEvent {
  eventId: number;
  personId?: number | null;
  eventDt?: string | null;
  eventNm?: string | null;
  eventPart?: string | null;
  eventDesc?: string | null;
  note?: string | null;
}

/** 프로젝트 행 (GET /api/v1/emp/persons/{personId}/projects, AS-IS Emp13_ProjectModel) */
export interface Project {
  projectId: number;
  personId?: number | null;
  frYm?: string | null;
  toYm?: string | null;
  projectNm?: string | null;
  note?: string | null;
}

/** 겸직발령 행 (GET /api/v1/emp/add-titles?personId, AS-IS Emp04_AddTitleModel). transPersonId·posCd·posNm·orgHeadYn은 겸직사원 발령(transModel) */
export interface AddTitle {
  addTitleId: number;
  personId?: number | null;
  addPersonId?: number | null;
  orgCodeId?: number | null;
  startDate?: string | null;
  closeDate?: string | null;
  orgNm?: string | null;
  titleCd?: string | null;
  titleNm?: string | null;
  transReason?: string | null;
  empNo?: string | null;
  transPersonId?: number | null;
  posCd?: string | null;
  posNm?: string | null;
  orgHeadYn?: string | null;
}

/** 겸직 등록·수정 요청 (AS-IS Emp04_Edit_AddTitle.update) */
export interface AddTitleSaveReq {
  addTitleId?: number | null;
  personId: number;
  transPersonId?: number | null;
  startDate: string;
  closeDate?: string | null;
  orgCodeId: number;
  orgHeadYn: string;
  titleCd: string;
  posCd: string;
  transReason?: string | null;
}

/** 교육사항 행 (GET /api/v1/emp/persons/{personId}/educations, AS-IS Emp19_EducationModel) */
export interface Education {
  educationId: number;
  personId?: number | null;
  issueDate?: string | null;
  content?: string | null;
  educationYn?: string | null;
  note?: string | null;
  educationCorpNm?: string | null;
}

/** 사용자정보 조회 행 (C03, GET /api/v1/emp/persons — AS-IS Emp01_PersonModel 중 그리드 컬럼) */
export interface UserInfo {
  personId: number;
  companyId?: number | null;
  companyName?: string | null;
  korName?: string | null;
  empNo?: string | null;
  posName?: string | null;
  orgName?: string | null;
  officeTelNo?: string | null;
  mobileTelNo?: string | null;
  emailAddress?: string | null;
  hireDate?: string | null;
  retireDate?: string | null;
  noteAdmin?: string | null;
}

/** 비고(시스템관리자전용) 팝업 (C03 Emp02_Edit_Note, GET/PUT /api/v1/emp/persons/{personId}/note-admin) */
export interface NoteAdmin {
  othersId?: number | null;
  personId: number;
  noteAdmin?: string | null;
}

/** 문자발송 대상 고르기 한 행 (C06, AS-IS Emp01_PersonModel — emp.Emp01_Person.selectByPaging) */
export interface CompanyPerson {
  personId: number;
  companyId: number;
  companyName: string | null;
  orgName: string | null;
  posName: string | null;
  korName: string | null;
  mobileTelNo: string | null;
}

// ── E05-1 사원별 예외업무 (Emp33_Lookup_ExceptBiz) ──

/** 사원별 예외업무 한 행 (AS-IS emp33_except_biz.selectByExceptBizCode). 표시안함 여부는 'true'/'false' 문자열 */
export interface ExceptBiz {
  exceptBizId: number
  companyId?: number | null
  personId: number
  exceptBizCode?: string | null
  exceptBizName?: string | null
  startDate?: string | null
  closeDate?: string | null
  reason?: string | null
  unvisibleYn?: string | null
  personName?: string | null
  personInfo?: string | null
}

// ── E25 복리후생비 코드관리 (Emp55_Tab_benefitInfoManager) ──

/** 복리후생비 고객사별 설정 한 행 (AS-IS emp55_benefit_info.selectBySearchText). 미사용은 'true'/'false' 문자열 */
export interface BenefitInfo {
  benefitInfoId: number;
  companyId: number;
  benefitCode: string;
  benefitName: string;
  issueLinkCode: string;
  expenseLinkCode: string;
  accountCode: string;
  accountName: string;
  unUseYn: string;
}

// ── E26 인사평가 항목 (Emp41_Tab_EvalList) ──

/** 인사평가 항목리스트 기준 적용일 한 행 (AS-IS emp40_eval_list_std.selectByCompanyId). 확정은 'true'/'false' 문자열 */
export interface EvalListStd {
  evalListStdId: number;
  companyId: number;
  startDate: string;
  fixYn: string;
}

/** 인사평가 항목 한 행 (AS-IS emp41_eval_list.selectByEvalListStdId) */
export interface EvalList {
  evalListId: number;
  evalListStdId: number;
  evalClassCode: string;
  evalClassName: string;
  content: string;
  weightMember: number | null;
  weightLeader: number | null;
  seq: number | null;
}

/** 평가등급 한 행 (AS-IS emp42_eval_grade.selectByEvalListStdId). 평정사유 필수는 'true'/'false' 문자열 */
export interface EvalGrade {
  evalGradeId: number;
  evalListStdId: number;
  grade: string;
  gradeWeight: number | null;
  gradeScore: number | null;
  compareCode: string;
  compareName: string;
  reasonYn: string;
}

/** 결재서명 한 행 (AS-IS Emp60_SignModel — Emp60_Tab_Sign 그리드, G09). 논리 값은 'true'/'false' 문자열 */
export interface EmpSign {
  signId: number;
  /** 서명 이미지 칸(sys10_file 부모 ID) */
  signIdString?: string;
  signFileId?: number | null;
  useYn: string;
  note?: string | null;
}

/** 결재선 예외 한 행 (AS-IS Emp30_ApprStepExceptModel — Emp30_Tab_ApprStepExcept 그리드, G10). 논리 값은 'true'/'false' 문자열, 날짜는 'yyyy-MM-dd' */
export interface EmpApprStepExcept {
  apprStepExceptId: number;
  regDate: string;
  personId?: number | null;
  personName?: string | null;
  useYn: string;
  note?: string | null;
}
