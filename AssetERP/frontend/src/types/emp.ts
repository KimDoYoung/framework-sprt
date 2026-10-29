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

/** 급여공제정보 사원 목록 행 (GET /api/v1/emp/deducts/persons, AS-IS Emp35_DeductModel — S28) */
export interface DeductPerson {
  deductId: number;
  companyId: number;
  personId: number;
  personNo?: string | null;
  personName?: string | null;
  hireDate?: string | null;
  birthday?: string | null;
  basicDeductCnt?: number | null;
  addDeductYn?: string | null;
  insureYn?: string | null;
  reprYn?: string | null;
  npsYn?: string | null;
  withHoldRate?: number | null;
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

/** 주소록 한 행 (AS-IS Emp10_AddrBookModel — Emp10_Tab_AddrBook·PublicAddrBook 그리드, G11·G12). 논리 값은 'true'/'false' 문자열 */
export interface EmpAddrBook {
  addrBookId: number;
  contactName?: string | null;
  emailAddress?: string | null;
  mobileTelNo?: string | null;
  officeTelNo?: string | null;
  companyName?: string | null;
  posName?: string | null;
  note?: string | null;
  publicYn?: string | null;
  /** 등록자 사원 ID */
  personId?: number | null;
  personName?: string | null;
}

/** 주소록 그룹 한 행 (AS-IS Emp57_AddrBookGroupModel — Emp57_Lookup_Insert 왼쪽 그리드, G11). personId = 등록자 */
export interface EmpAddrBookGroup {
  addrBookGroupId: number;
  groupName?: string | null;
  publicYn?: string | null;
  personId?: number | null;
  personName?: string | null;
}

/** 그룹 안의 담당자·사원 한 행 (AS-IS Emp57_AddrBookGroupModel — Emp57_TabPage_Insert 그리드, G11). parentGubun = 외부/사내 */
export interface EmpAddrBookMember {
  addrBookGroupId: number;
  parentId?: number | null;
  /** 외부 = 주소록 ID, 사내 = 사원 ID */
  relateId?: number | null;
  note?: string | null;
  parentGubun?: string | null;
  parentName?: string | null;
  emailAddress?: string | null;
  mobileTelNo?: string | null;
}

/** 책무 대상 사원찾기 한 행 (GET /api/v1/emp/trans/tdm, AS-IS Emp03_TransModel — emp03_trans.selectByTdmYn) */
export interface TransTdm {
  personId: number;
  orgNm?: string | null;
  titleNm?: string | null;
  empNo?: string | null;
  korNm?: string | null;
  transDate?: string | null;
  /** 사원의 조직(emp01_org_id) — N22 이행점검의 점검자 부서 */
  orgId?: number | null;
}

// ── S02 사원정보 변경조회 (Emp00_Tab_ChangeHistory) ──
/** 일반발령 탭 행 (emp03_trans.selectByHistory) — 날짜는 서버 'yyyy-MM-ddTHH:mm:ss' */
export interface ChangeHistoryTrans {
  transDate?: string | null;
  empKorName?: string | null;
  transName?: string | null;
  kindName?: string | null;
  orgName?: string | null;
  titleName?: string | null;
  posName?: string | null;
  gradeName?: string | null;
  duty?: string | null;
  expiryDate?: string | null;
  orgHeadYn?: string | null;
  officerYn?: string | null;
  tdmTargetYn?: string | null;
  nonStayYn?: string | null;
  transReason?: string | null;
}

/** 자격사항 탭 행 (emp08_license.selectByHistory) */
export interface ChangeHistoryLicense {
  empOrgName?: string | null;
  empKorName?: string | null;
  certifiedName?: string | null;
  certifiedDt?: string | null;
  licenseNumber?: string | null;
  issuingAgency?: string | null;
  financeProTypeName?: string | null;
  financeRelateYn?: string | null;
  kofiaRegDate?: string | null;
  note?: string | null;
}

/** 상벌내역 탭 행 (emp11_reward.selectByHistory) */
export interface ChangeHistoryReward {
  rewardDt?: string | null;
  empKorName?: string | null;
  rewardCodeName?: string | null;
  rewardGroup?: string | null;
  rewardName?: string | null;
  rewardDesc?: string | null;
  note?: string | null;
}

/** [출력/다운로드] 조건 — 자격사항은 startDate(기준일)·searchText만 쓴다 */
export interface ChangeHistoryPrintReq {
  startDate: string;
  closeDate?: string;
  searchText: string;
  empTransCode?: string;
}

// ── S03 임원정보 관리 (Emp31_Tab_Director) ──
/** 임원 그리드 행 (emp31_director.selectByText). `personId`가 행 키(임시 ID 없음 — 행 추가 버튼이 없다). 날짜는 'yyyy-MM-dd' */
export interface Director {
  directorId?: number | null;
  personId: number;
  personName?: string | null;
  chnName?: string | null;
  posName?: string | null;
  officerYn?: string | null;
  ctzNo?: string | null;
  initAssignDate?: string | null;
  rcntAssingDate?: string | null;
  expireDate?: string | null;
  assignCnt?: number | null;
  addTitle?: string | null;
  qualified?: string | null;
  preferStock?: number | null;
  commonStock?: number | null;
  endDate?: string | null;
  endReason?: string | null;
  note?: string | null;
}

/** 조직별 사원조회 그리드 행 (S04, AS-IS Emp00_TransInfoModel · selectByAllOrgCodeId) */
export interface OrgPerson {
  transId: number;
  personId: number;
  empKorName?: string | null;
  posName?: string | null;
  orgKorName?: string | null;
  titleName2?: string | null;
  hireDate?: string | null;
  emailAddress?: string | null;
  mobileTelNo?: string | null;
  officeTelNo?: string | null;
  empNo?: string | null;
}

/** 증명서 발급 그리드 행 (S05, AS-IS Emp15_CertModel · selectByCompanyId) */
export interface Cert {
  certId: number;
  issueDate?: string | null;
  linkCode?: string | null;
  linkName?: string | null;
  personId: number;
  personNo?: string | null;
  personName?: string | null;
  certUseCode?: string | null;
  certUse?: string | null;
  certUseName?: string | null;
  dcrClassTreeId?: number | null;
  apprId?: number | null;
  stampSeqText?: string | null;
  apprStatusName?: string | null;
  emailAddress?: string | null;
}

/** 증명서 발급 등록 (AS-IS Emp15_Lookup_Cert.update → modelUpdate) */
export interface CertSaveReq {
  issueDate: string;
  linkCode: string;
  personId: number;
  certUseCode: string;
  certUse: string | null;
  dcrClassTreeId: number;
}

/** S06 휴가관리 그리드 한 행 (Emp20_LeaveModel 중 Emp20_Tab_LeaveManager가 쓰는 열). 날짜는 'yyyy-MM-dd' */
export interface Leave {
  leaveId: number;
  personId: number;
  apprId: number | null;
  startDate: string | null;
  closeDate: string | null;
  leaveName: string | null;
  leaveCount: number | null;
  managerName: string | null;
  reason: string | null;
  apprStatusCode: string | null;
  apprStatusName: string | null;
  overConfirmStatusCode: string | null;
  overConfirmStatusName: string | null;
  overConfirmerName: string | null;
  overConfirmDateStr: string | null;
}

/** S06 요약 칸 (emp20_leave.selectByDays + emp22_etc_leave.selectByDays) */
export interface LeaveDays {
  totalDays: number | null;
  pyRemainMonthDays: number | null;
  useDays: number | null;
  remainDays: number | null;
  stdPeriod: string | null;
  etcTotalDays: number | null;
  etcUseDays: number | null;
  etcRemainDays: number | null;
}

/** S06 로그인 회사의 휴가 설정 (leaveYn·leaveConfirmYn·leaveMonthCode) */
export interface LeaveOption {
  leaveYn: boolean;
  leaveConfirmYn: boolean;
  leaveMonthCode: string | null;
}

/** S06 초기설정 휴가일수 (Emp26_InitLeaveModel). 새 행은 initLeaveId 음수 */
export interface InitLeave {
  initLeaveId: number;
  personId: number;
  year: string | null;
  personNo: string | null;
  personName: string | null;
  posName: string | null;
  useDays: number | null;
}

/** S06 포상휴가 내역 (Emp22_EtcLeaveModel) */
export interface EtcLeave {
  etcLeaveId: number;
  reason: string | null;
  startDate: string | null;
  closeDate: string | null;
  days: number | null;
  useDays: number | null;
  remainDays: number | null;
  note: string | null;
}

/** S07 연월차휴가 현황 한 행 (emp01_person.selectByYearList). 날짜는 'yyyy-MM-dd' */
export interface YearLeave {
  personId: number;
  empNo: string | null;
  korName: string | null;
  hireDateLeaveCalc: string | null;
  yearPeriod: string | null;
  yearPer: number | null;
  yearLeaveDays: number | null;
  monthPeriod: string | null;
  monthLeaveDays: number | null;
  pyRemainMonthDays: number | null;
  totalDays: number | null;
  useYearDays: number | null;
  useMonthDays: number | null;
  useDays: number | null;
  remainYearDays: number | null;
  remainMonthDays: number | null;
  remainDays: number | null;
  rewardTotalDays: number | null;
  rewardUseDays: number | null;
  rewardRemainDays: number | null;
  spcDays: number | null;
}

/** S07 조회 조건 — monthStdDateType: 1 현재 · 2 기준연도말 · 3 특정일, retireType: 100 재직 · 900 퇴직 · 000 전체 */
export interface YearLeaveParam {
  stdYear: string;
  monthStdDateType: string;
  stdDate: string;
  retireType: string;
}

/** S08 미사용 연차·월차 휴가 한 행 (Emp21_UnLeaveModel). 날짜는 'yyyy-MM-dd' */
export interface UnLeave {
  unLeaveId: number;
  personId: number;
  unLeaveCode: string | null;
  unLeaveName: string | null;
  personNo: string | null;
  personName: string | null;
  hireDate: string | null;
  totalDays: number | null;
  useDays: number | null;
  remainDays: number | null;
  startDate: string | null;
  apprId: number | null;
  apprStatusCode: string | null;
  apprStatusName: string | null;
  expectApprId: number | null;
  expectApprStatusCode: string | null;
  expectApprStatusName: string | null;
}

/** S09 공동연차 한 행 (Emp24_JointLeaveModel). 날짜는 'yyyy-MM-dd' */
export interface JointLeave {
  jointLeaveId: number;
  companyId: number | null;
  startDate: string | null;
  closeDate: string | null;
  reason: string | null;
  note: string | null;
  apprId: number | null;
  apprStatusCode: string | null;
  apprStatusName: string | null;
}

/** S09 공동연차 제외사원 한 행 (Emp28_JointLeaveExceptModel) */
export interface JointLeaveExcept {
  jointLeaveExceptId: number;
  jointLeaveId: number;
  personId: number;
  orgName: string | null;
  personName: string | null;
  reason: string | null;
}

/** S10 포상휴가 한 행 (Emp22_EtcLeaveModel — 포상휴가관리 그리드). 날짜는 'yyyy-MM-dd' */
export interface EtcLeaveManage {
  etcLeaveId: number;
  companyId: number | null;
  leaveCode: string | null;
  reason: string | null;
  days: number | null;
  startDate: string | null;
  closeDate: string | null;
  note: string | null;
  apprId: number | null;
  apprStatusCode: string | null;
  apprStatusName: string | null;
}

/** S10 포상휴가 대상 직원 한 행 (Emp23_EtcLeavePersonModel) */
export interface EtcLeavePerson {
  etcLeavePersonId: number;
  etcLeaveId: number;
  personId: number;
  orgName: string | null;
  personName: string | null;
}

/** S11 출장 한 행 (Emp53_BizTripModel — 출장관리 그리드). 날짜는 'yyyy-MM-dd' */
export interface BizTrip {
  bizTripId: number;
  personInfo: string | null;
  startDate: string | null;
  closeDate: string | null;
  bizTripName: string | null;
  destination: string | null;
  purpose: string | null;
  num: string | null;
  companion: string | null;
  apprId: number | null;
  apprStatusCode: string | null;
  apprStatusName: string | null;
  resultApprId: number | null;
  resultApprStatusCode: string | null;
  resultApprStatusName: string | null;
  resultSkipYn: boolean | null;
  skipReason: string | null;
}

/** S12 외출 한 행 (Emp54_ErrandModel — 외출관리 그리드). 날짜는 'yyyy-MM-dd' */
export interface Errand {
  errandId: number;
  date: string | null;
  weekday: string | null;
  personInfo: string | null;
  errandName: string | null;
  departTime: string | null;
  returnTime: string | null;
  reason: string | null;
  venue: string | null;
  host: string | null;
  note: string | null;
  apprId: number | null;
  aprStatusName: string | null;
}

/** 발령 기준 사원 선택(Emp01_Lookup_TransDate) 행 — 그리드는 조직·사번·성명·직책 */
export interface TransTarget {
  personId: number;
  transCd: string;
  hireDate?: string | null;
  transDate: string;
  orgNm?: string;
  empNo?: string;
  korNm?: string;
  titleNm?: string;
}

/** 인사평가 대상자 한 행 (AS-IS emp43_eval_target.selectByTermCode — Emp43_Tab_EvalTarget). status는 '진행중'·'상신중'·'완료'·'' */
export interface EvalTarget {
  evalTargetId: number;
  companyId: number;
  personId: number;
  stdYear: string;
  stdTermCd: string;
  evalListStdId: number;
  evalStartDate: string | null;
  evalCloseDate: string | null;
  orgHeadNm: string | null;
  posNm: string | null;
  personNm: string | null;
  orgNm: string | null;
  firstEvaluatorId: number | null;
  firstOrgNm: string | null;
  firstPersonNm: string | null;
  firstEvalWeight: number | null;
  secondEvaluatorId: number | null;
  secondOrgNm: string | null;
  secondPersonNm: string | null;
  secondEvalWeight: number | null;
  sumEvalWeight: number | null;
  status: string;
}

/** 인사평가 대상등록 조회창 한 행 (AS-IS emp00_trans_info.selectByEvalText — Emp43_Lookup_SelectMulti) */
export interface EvalCandidate {
  personId: number;
  orgCodeId: number;
  orgTitleNm: string | null;
  parentFullNm: string | null;
  titleNm: string | null;
  posNm: string | null;
  korNm: string | null;
  orgHeadNm: string | null;
  hireDate: string | null;
  transDate: string | null;
}

/** 상위 조직장 (AS-IS emp00_trans_info.getHighInfo) */
export interface HighInfo {
  personId: number;
  orgTitleNm: string | null;
  korNm: string | null;
}

/** 회사의 인사평가 설정 — 05 반기별 / 06 연별, 시작월(MonthsCode '01'…'12') */
export interface EvalSetting {
  empEvalCycleCode: string | null;
  empEvalMonthCode: string | null;
}

/** 인사평가수행 목록 한 행 (AS-IS emp43_eval_target.selectByText — Emp43_Tab_EvalExecute·Emp44_Lookup_Write). orderEvalNm '1차'·'2차' */
export interface EvalExecute {
  evalTargetId: number;
  evalListStdId: number;
  stdYear: string;
  stdTermCd: string;
  personId: number;
  orderEvalNm: string;
  orgHeadNm: string | null;
  posNm: string | null;
  personNm: string | null;
  orgNm: string | null;
  hireDateStr: string | null;
  workYear: string | null;
  dateStr: string | null;
  orderScore: string | null;
  orderGrade: string | null;
  orderStatus: string | null;
  orderReason: string | null;
  firstEvalReason: string | null;
  secondEvalReason: string | null;
}

/** 인사평가결과(인사부)·인사평가보고(대표이사)·결과조회 한 행 (AS-IS emp43_eval_target.selectByTextAdmin[All] — T03 Emp43_Tab_FirstAppr·T04 Emp43_Tab_FinalAppr·T05 Emp43_Tab_EvalResult). *OrderReason '작성필요'·'작성완료'·'' */
export interface EvalAdmin {
  evalTargetId: number;
  personId: number;
  orgNm: string | null;
  personNm: string | null;
  posNm: string | null;
  orgHeadNm: string | null;
  firstPersonNm: string | null;
  firstEvalScore: number | null;
  firstEvalGrade: string | null;
  firstOrderReason: string | null;
  firstEvalReason: string | null;
  secondPersonNm: string | null;
  secondEvalScore: number | null;
  secondEvalGrade: string | null;
  secondOrderReason: string | null;
  secondEvalReason: string | null;
  totalEvalScore: number | null;
  totalEvalGrade: string | null;
  totalEvalStatus: string | null;
  totalOrderReason: string | null;
  plusScore: number | null;
  minusScore: number | null;
  reasonAdjustScore: number | null;
  adjustEvalScore: number | null;
  adjustEvalGrade: string | null;
  apprStatus: string | null;
  ceoEvalBonus: number | null;
  ceoEvalPenalty: number | null;
  finalEvalScore: number | null;
  finalEvalGrade: string | null;
  titleNm: string | null;
  evalStartDate: string | null;
  evalCloseDate: string | null;
  /** T05 "대표이사 평가" 열: 원본 모델에만 있고 SQL·테이블에 열이 없어 늘 비어 있다 */
  ceoEvalScore?: number | null;
}

/** 인사평가 상신문서 연결 (AS-IS emp45_eval_relate_appr.selectByTermCode). apprId는 1차 보고, finalApprId는 최종(대표이사) 보고 상신문서 */
export interface EvalRelateAppr {
  evalRelateApprId: number;
  apprId: number | null;
  finalApprId: number | null;
  apprStatusCode: string | null;
  apprStatusName: string | null;
  finalApprStatusCode: string | null;
  finalApprStatusName: string | null;
}

/** 인사평가표 한 행 (AS-IS emp44_eval_write.getEvalTargetList — Emp44_Lookup_Write). 평가 안 한 항목은 evalGrade 등이 null */
export interface EvalWrite {
  evalWriteId: number;
  evalListId: number;
  evalClassNm: string | null;
  content: string | null;
  weightMember: number | null;
  weightLeader: number | null;
  evalGrade: string | null;
  evalGradeId: number | null;
  evalGradeScore: number | null;
}

