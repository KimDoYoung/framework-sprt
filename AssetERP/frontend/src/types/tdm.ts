/** 법규에 연결된 책무이행점검항목 한 행 (AS-IS Tdm45_ManlRelateIcsModel 중 Ics01_Lookup_RelateTdm 그리드 열) */
export interface ManlRelateIcs {
  manlRelateIcsId: number;
  manlId: number;
  icsClassTreeId?: number | null;
  roleName?: string | null;
  taskName?: string | null;
  taskDetailName?: string | null;
  taskDutyName?: string | null;
  taskCheckItem?: string | null;
  taskCheckHow?: string | null;
}

/** 책무기술서 작성 한 행 (AS-IS Tdm31_RoleDescModel 중 Tdm31_Tab_RoleDesc 그리드·저장에 쓰는 속성, N12). 새로 등록한 행은 roleDescId가 음수 */
export interface TdmRoleDescCompany {
  roleDescId: number;
  regDate: string | null;
  reasonCode: string | null;
  reasonName: string | null;
  companyId: number | null;
  personId: number;
  personName: string | null;
  roleAllcId: number;
  allcStdDate: string | null;
  roleName: string | null;
  addTitle: string | null;
  apprId: number | null;
  apprStatusCode: string | null;
  apprStatusName: string | null;
}

/** 책무기술서 등록 조회창(Tdm30_Lookup_SelectMulti) 한 행 — AS-IS tdm30_role_allc.selectPerson */
export interface TdmRoleAllcPerson {
  roleAllcId: number;
  personId: number;
  personName: string | null;
  roleName: string | null;
  addTitle: string | null;
  allcStdDate: string | null;
}

/** 책무기술서 한 행 (AS-IS Tdm31_RoleDescModel 중 Tdm31_Tab_RoleDescAdmin 그리드·재생성에 쓰는 속성) */
export interface TdmRoleDesc {
  roleDescId: number;
  regDate?: string | null;
  reasonName?: string | null;
  companyId: number;
  companyName?: string | null;
  personId: number;
  personName?: string | null;
  allcStdDate?: string | null;
  roleName?: string | null;
  addTitle?: string | null;
  apprId?: number | null;
  apprStatusCode?: string | null;
  apprStatusName?: string | null;
}

/** 책무체계도 한 행 (AS-IS Tdm32_RoleDigmModel 중 Tdm32_Tab_RoleDigmAdmin 그리드·재생성·보기에 쓰는 속성) */
export interface TdmRoleDigm {
  roleDigmId: number;
  companyId: number;
  companyName?: string | null;
  regDate?: string | null;
  allcStdDate?: string | null;
  reasonName?: string | null;
  useFileType?: string | null;
  useFileTypeName?: string | null;
  apprId?: number | null;
  apprStatusCode?: string | null;
  apprStatusName?: string | null;
  roleDigmFileId?: number | null;
}

/** 책무체계도 작성 한 행 (AS-IS Tdm32_RoleDigmModel 중 Tdm32_Tab_RoleDigm 그리드·저장·보기에 쓰는 속성, N13). fileTypeName02 = 사용자가 올린 파일 이름 */
export interface TdmRoleDigmCompany {
  roleDigmId: number;
  companyId?: number | null;
  regDate?: string | null;
  allcStdDate?: string | null;
  reasonCode?: string | null;
  reasonName?: string | null;
  useFileType?: string | null;
  apprId?: number | null;
  apprStatusCode?: string | null;
  apprStatusName?: string | null;
  roleDigmFileId?: number | null;
  fileTypeName02?: string | null;
}

/** 매뉴얼 작업대상 한 행 (AS-IS Tdm40_ManlJobModel 중 Tdm40_Tab_ManlJob 그리드·저장에 쓰는 속성, N15). 날짜는 yyyy-MM-dd */
export interface TdmManlJob {
  manlJobId: number;
  companyId?: number | null;
  regDate?: string | null;
  jobName?: string | null;
  manlApplyStartDate?: string | null;
  roleId?: number | null;
  roleName?: string | null;
  orgId?: number | null;
  orgName?: string | null;
  jobReason?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  dutyCntStr?: string | null;
  dutyEndYn?: boolean;
  dutyEndDate?: string | null;
  updName?: string | null;
  updDateStr?: string | null;
}

/** 책무구조도 제출 한 행 (AS-IS Tdm36_RoleReportModel 중 Tdm36_Tab_RoleReport 그리드·저장에 쓰는 속성, N14). 날짜는 yyyy-MM-dd */
export interface TdmRoleReport {
  roleReportId: number;
  companyId?: number | null;
  boardOpenDate?: string | null;
  allcStdDate?: string | null;
  reportDate?: string | null;
  boardOpenLoc?: string | null;
  membTotCnt?: number | null;
  membAttendCnt?: number | null;
  boardOpenAgenda?: string | null;
  membYesName?: string | null;
  updName?: string | null;
  updDateStr?: string | null;
  apprId?: number | null;
  apprStatusCode?: string | null;
  apprStatusName?: string | null;
}

/**
 * 책무구조도 제출 첨부 목록 한 행 (AS-IS tdm36_role_report.getAttachList, N14).
 * roleReportId = 책무기술서(ROLE_DESC)·책무체계도(ROLE_DIGM) 행에서는 그 문서의 ID — 행 구분은 seq·subSeq·roleReportId를 함께
 */
export interface TdmRoleReportAttach {
  roleReportId: number;
  seq: number;
  subSeq: number;
  rptTitle: string;
  rptSubTitle?: string | null;
  rdCode?: string | null;
  rdCode2?: string | null;
  relateFileId?: number | null;
  relateApprId?: number | null;
  relateApprStatusCode?: string | null;
}

/** 책무진행 상태 한 행 (AS-IS Sys99_PrintModel 중 Tdm50_Tab_DutyProgressAdmin 그리드에 쓰는 속성, f_recon_tdm 'CHCK_STATUS' 결과). m00~m11은 조회 기준월부터 12개월 */
export interface TdmDutyProgress {
  printId: number;
  companyName?: string | null;
  roleName?: string | null;
  exctName?: string | null;
  orgName?: string | null;
  name1454?: string | null;
  apprList1463?: string | null;
  manlCnt?: number | null;
  endCnt?: number | null;
  lockCnt?: number | null;
  approveCnt?: number | null;
  unusedCnt?: number | null;
  manlAnnually?: number | null;
  manlSemiannually?: number | null;
  manlQuarterly?: number | null;
  manlMonthly?: number | null;
  manlAnytime?: number | null;
  manlEtc?: number | null;
  thisMonthYn?: string | null;
  nextMonthYn?: string | null;
  m00Cnt?: number | null;
  m01Cnt?: number | null;
  m02Cnt?: number | null;
  m03Cnt?: number | null;
  m04Cnt?: number | null;
  m05Cnt?: number | null;
  m06Cnt?: number | null;
  m07Cnt?: number | null;
  m08Cnt?: number | null;
  m09Cnt?: number | null;
  m10Cnt?: number | null;
  m11Cnt?: number | null;
  itemCnt1455?: number | null;
  checker1456?: string | null;
  apprList1456?: string | null;
  apprStatus?: string | null;
  exctApproveYn?: string | null;
  chckLockYn?: string | null;
  chckCloseYn?: string | null;
  chckApprStatus?: string | null;
}

/** 책무마감 검증 한 행 (AS-IS Sys99_PrintModel 중 Tdm50_Tab_DutyReconAdmin 그리드에 쓰는 속성, f_recon_tdm 'DB_CHK' 결과) */
export interface TdmDutyRecon {
  printId: number;
  companyName?: string | null;
  string01?: string | null;
  string02?: string | null;
  string03?: string | null;
}

/** 부서 책무매뉴얼 한 행 (AS-IS Tdm42_ManlOrgModel 중 Tdm42_Tab_ManlManagerAdmin 그리드·재생성·보기·점검항목 조회창에 쓰는 속성) */
export interface TdmManlOrg {
  manlOrgId: number;
  companyId: number;
  companyName?: string | null;
  orgName?: string | null;
  roleName?: string | null;
  exctId?: number | null;
  exctName?: string | null;
  manlDutyEndYn?: boolean | null;
  manlDutyEndDate?: string | null;
  taskCnt?: number | null;
  taskRelateDetailCnt?: number | null;
  taskRelateDutyCnt?: number | null;
  manlCnt?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  /** 적용시작일이 있으면 'true' (책무매뉴얼 보기 아이콘을 보인다) */
  startDateYnStr?: string | null;
  apprStatusCode?: string | null;
  apprStatusName?: string | null;
  jobName?: string | null;
  lockYn?: boolean | null;
}

/** 부서 책무매뉴얼의 점검항목 한 행 (AS-IS Tdm43_ManlModel 중 Tdm43_Lookup_ManlItem 그리드·삭제와 Tdm43_Edit_Manl 등록·수정·보기가 쓰는 속성) */
export interface TdmManlItem {
  manlId: number;
  manlOrgId: number;
  companyId?: number | null;
  orgId?: number | null;
  exctId?: number | null;
  roleId?: number | null;
  roleName?: string | null;
  taskId?: number | null;
  taskName?: string | null;
  taskRelateDetailId?: number | null;
  taskRelateDetailName?: string | null;
  taskRelateDutyId?: number | null;
  taskRelateDutyName?: string | null;
  manlDutyId?: number | null;
  manlCode?: string | null;
  taskDetailAddSeq?: string | null;
  taskDutyAddSeq?: string | null;
  checkItem?: string | null;
  checkItemAddCode?: string | null;
  checkCycleCode?: string | null;
  checkMonth?: string | null;
  checkHow?: string | null;
  checkHowLimit?: string | null;
  checkCycleName?: string | null;
  checkEvidDocName?: string | null;
  refBasis?: string | null;
  startDate?: string | null;
  ceoDutyCode?: string | null;
  exctDutyMap?: string | null;
  exctDutyName?: string | null;
  importLevelCode?: string | null;
  unuseYn?: boolean | null;
}

/** 점검항목에 연결된 법규·내규·양식·문서분류 (AS-IS Tdm43_Page_Relate 그리드 4개). id가 없는 행은 아직 저장 안 한 새 연결 */
export interface TdmManlRelates {
  ics: { manlRelateIcsId?: number; icsClassTreeId: number; icsClassTreeCode?: string | null; icsClassTreeName?: string | null }[];
  icr: { manlRelateIcrId?: number; icrClassTreeId: number; icrClassTreeCode?: string | null; icrClassTreeName?: string | null }[];
  forms: { relateFileId?: number; fileId: number; fileName?: string | null; regDate?: string | null }[];
  dcrs: { manlRelateDcrId?: number; dcrClassTreeId: number; dcrClassTreeCode?: string | null; dcrClassTreeName?: string | null; dcrClassTreeFullName?: string | null }[];
}

/** 점검항목 저장 요청 (AS-IS tdm.Tdm43_Manl.modelUpdate) */
export interface TdmManlSaveReq {
  manlId: number;
  manlOrgId: number;
  orgId?: number | null;
  exctId?: number | null;
  roleId?: number | null;
  roleName?: string | null;
  taskId?: number | null;
  taskName?: string | null;
  taskRelateDetailId?: number | null;
  taskRelateDetailName?: string | null;
  taskRelateDutyId?: number | null;
  taskRelateDutyName?: string | null;
  manlDutyId?: number | null;
  checkItem: string;
  checkCycleCode: string;
  checkMonth: string;
  checkEvidDocName?: string | null;
  checkHow?: string | null;
  refBasis?: string | null;
  startDate?: string | null;
  ceoDutyCode?: string | null;
  exctDutyMap?: string | null;
  importLevelCode?: string | null;
  relateIcsClassTreeIds: number[];
  relateIcrClassTreeIds: number[];
  relateFormFileIds: number[];
  relateDcrClassTreeIds: number[];
}

/** 연결할 책무점검 양식 파일 한 행 (AS-IS Sys10_FileModel 중 Tdm43_Lookup_RelateFormFileList 그리드 열) */
export interface TdmManlFormFile {
  fileId: number;
  tdmCheckFormTypeName?: string | null;
  fileName?: string | null;
  note?: string | null;
  regDate?: string | null;
}

/** 연결할 책무이행점검항목 한 행 (AS-IS Tdm43_ManlModel 중 Ics01_Lookup_SelectTdm 그리드 열) */
export interface Manl {
  manlId: number;
  manlCode?: string | null;
  roleName?: string | null;
  taskRelateDutyName?: string | null;
  checkItemAddCode?: string | null;
  checkHow?: string | null;
}

/** 책무점검 현황 모니터 (GET /api/v1/tdm/dashboard/progress, AS-IS Tdm51_ChckOrgModel 중 진행율·적정비율·점검결과 정보). checkCntInfo는 `<b style=color:#…;>` 조각을 포함한 글자 */
export interface TdmDashboardProgress {
  progRate: number | null;
  suffRate: number | null;
  checkCntInfo: string | null;
}

/** 임원별(직책별)·부서별 진행현황 한 행 (GET dashboard/exct-progress · org-progress, AS-IS Tdm51_ChckOrgModel) */
export interface TdmDashboardChckOrg {
  chckOrgId: number;
  exctName?: string | null;
  roleName?: string | null;
  orgName?: string | null;
  progRate: number | null;
  monthCheckCnt: number | null;
  monthManlUndoneCnt: number | null;
  monthCheck1Cnt: number | null;
  monthCheck2Cnt: number | null;
  monthCheck9Cnt: number | null;
}

/** 미점검·반려·당월발생 미흡 한 행 (GET dashboard/undone, AS-IS Tdm52_ChckManlModel 중 이 화면 그리드가 쓰는 속성) */
export interface TdmDashboardUndone {
  chckManlId: number;
  orgName: string | null;
  checkerName: string | null;
  checkItem: string | null;
  checkCycleName: string | null;
  checkStatusName: string | null;
}

/** 미흡 조치현황 한 행 (GET dashboard/insuff, AS-IS Tdm54_ChckInsuffModel 중 이 화면 그리드가 쓰는 속성). 날짜는 yyyy-MM-dd */
export interface TdmDashboardInsuff {
  chckInsuffId: number;
  checkYm: string | null;
  dueDate: string | null;
  actionDate: string | null;
  actionDueDate: string | null;
  statusName: string | null;
  orgName: string | null;
  actionEmpName: string | null;
  actionName: string | null;
}

/** 점검년월의 마감 정보 (GET dashboard/check-end). 날짜는 yyyy-MM-dd */
export interface TdmDashboardCheckEnd {
  endYn: boolean | null;
  endDate: string | null;
}

/** 로그인 사용자의 조직 (GET dashboard/my-org, AS-IS LoginUser.getOrgCodeId()·getOrgInfoModel().getKorName()) */
export interface TdmDashboardMyOrg {
  orgCodeId: number;
  korName: string | null;
}

/** 임원선택 조회창 한 행 (GET /api/v1/tdm/hrs/lookup, AS-IS Tdm01_HrModel 중 Tdm01_Lookup_SelectSingle 그리드·선택 속성) */
export interface TdmHrLookup {
  personId: number;
  personName: string | null;
  posName: string | null;
  orgName: string | null;
}

/** 임원 등록 목록 한 행 (GET /api/v1/tdm/hrs, AS-IS Tdm01_HrModel 중 Tdm01_Tab_Hr 그리드 속성) */
export interface TdmHr {
  hrId: number;
  personId: number;
  personName: string | null;
  posName: string | null;
  orgName: string | null;
  hireDate: string | null;
  retireDate: string | null;
  endDate: string | null;
  addTitle: string | null;
  updName: string | null;
  updDateStr: string | null;
}

/** 인사정보 가져오기 창 한 행 (GET /api/v1/tdm/hrs/changes, AS-IS Tdm01_HrModel 중 Tdm01_Lookup_HrChangeInfo 그리드·적용 속성) */
export interface TdmHrChange {
  hrId: number;
  changeTypeCode: string;
  changeTypeName: string | null;
  personId: number;
  personName: string | null;
  befPosName: string | null;
  befTitleName: string | null;
  befOrgName: string | null;
  befHireDate: string | null;
  befRetireDate: string | null;
  befEndDate: string | null;
  aftPosName: string | null;
  aftTitleName: string | null;
  aftOrgName: string | null;
  aftHireDate: string | null;
  aftRetireDate: string | null;
  aftEndDate: string | null;
}

/** 인사정보 적용 요청 한 건 (POST /api/v1/tdm/hrs/changes/apply) */
export interface TdmHrApplyReq {
  personId: number;
  changeTypeCode: string;
  befEndDate: string | null;
  aftEndDate: string | null;
}

/** 직무겸직(사내) 한 행 (GET /api/v1/tdm/add-titles, AS-IS Tdm03_AddTitleModel) */
export interface TdmAddTitle {
  addTitleId: number;
  personId: number;
  addTitleName: string | null;
  startDate: string | null;
  closeDate: string | null;
}

/** 책무 한 행 (GET /api/v1/tdm/tasks, AS-IS Tdm10_TaskModel) */
export interface TdmTask {
  taskId: number;
  taskClassCode: string | null;
  taskClassName: string | null;
  taskTypeCode: string | null;
  taskTypeName: string | null;
  taskName: string | null;
  commonYn: string | null;
  ceoYn: string | null;
  startDate: string | null;
  endDate: string | null;
  updName: string | null;
  updDateStr: string | null;
  taskRelateDetailCntStr: string | null;
  taskRelateLawCnt: number | null;
  taskRelateRuleCnt: number | null;
}

/** 책무 등록·복사·수정 요청 (POST/PUT /api/v1/tdm/tasks) — 수정은 reason 필요 */
export interface TdmTaskSaveReq {
  taskId: number | null;
  taskClassCode: string | null;
  taskTypeCode: string | null;
  taskName: string | null;
  commonYn: string;
  ceoYn: string;
  startDate: string | null;
  endDate: string | null;
  oldTaskId?: number | null;
  reason?: string | null;
}

/** 책무 세부내용 한 행 (GET /api/v1/tdm/task-details, AS-IS Tdm12_TaskRelateDetailModel) */
export interface TdmTaskDetail {
  taskRelateDetailId: number;
  taskId: number;
  content: string | null;
  seq: number | null;
  useYn: string | null;
}

/** 관리의무 등록 위쪽 그리드 한 행 (GET /api/v1/tdm/task-duties/details, AS-IS Tdm12_TaskRelateDetailModel) */
export interface TdmTaskDutyDetail {
  taskRelateDetailId: number;
  taskId: number;
  taskTypeName: string | null;
  taskName: string | null;
  taskStartDate: string | null;
  taskEndDate: string | null;
  content: string | null;
  useYn: string | null;
  dutyCnt: string | null;
}

/** 관리의무 한 행 (GET /api/v1/tdm/task-duties, AS-IS Tdm13_TaskRelateDutyModel) */
export interface TdmTaskDuty {
  taskRelateDutyId: number;
  taskId: number;
  taskRelateDetailId: number;
  content: string | null;
  seq: number | null;
  useYn: string | null;
}

/** 책무유형 한 행 (GET /api/v1/tdm/task-types, AS-IS Tdm14_TaskTypeModel) */
export interface TdmTaskType {
  taskTypeId: number;
  taskClassCode: string | null;
  taskClassName: string | null;
  taskTypeCode: string | null;
  taskTypeName: string | null;
  useYn: string | null;
}

/** 변경/삭제 이력 한 행 (GET /api/v1/tdm/change-histories, AS-IS Tdm95_ChangeHistoryModel) */
export interface TdmChangeHistory {
  changeHistoryId: number;
  rowNum: number;
  changeDateStr: string | null;
  changeEmpName: string | null;
  changeType: string | null;
  reason: string | null;
}

/** 변경/삭제 이력 상세 한 행 (AS-IS Tdm96_ChangeDetailModel) */
export interface TdmChangeDetail {
  changeDetailId: number;
  windowItemName: string | null;
  beforeData: string | null;
  afterData: string | null;
}

/** 회의체 한 행 (GET /api/v1/tdm/councils, AS-IS Tdm05_CnclModel) */
export interface TdmCouncil {
  cnclId: number;
  cnclName: string | null;
  openCycleCode: string | null;
  openCycleName: string | null;
  mainDecision: string | null;
  startDate: string | null;
  endDate: string | null;
  relateRoleCnt: string | null;
  updName: string | null;
  updDateStr: string | null;
}

/** 회의체 편집창 저장 (PUT /api/v1/tdm/councils, cnclId가 없으면 새 회의체) */
export interface TdmCouncilSaveReq {
  cnclId: number | null;
  cnclName: string;
  openCycleCode: string;
  mainDecision: string;
  startDate: string;
  endDate: string | null;
}

/** 회의체에 연결된 직책 한 행 (GET /api/v1/tdm/councils/{id}/roles, AS-IS Tdm22_RoleRelateCnclModel) */
export interface TdmCouncilRole {
  roleRelateCnclId: number;
  roleId: number;
  cnclId: number;
  roleName: string | null;
  memberType: string | null;
  memberTypeName: string | null;
  startDate: string | null;
  endDate: string | null;
}

/** 직책 고르기창 한 행 (GET /api/v1/tdm/councils/role-lookup, AS-IS Tdm20_RoleModel) */
export interface TdmCouncilRoleLookup {
  roleId: number;
  roleName: string | null;
  roleTypeName: string | null;
  roleTypeEtcName: string | null;
  overview: string | null;
  startDate: string | null;
  endDate: string | null;
}

/** 직책 한 행 (GET /api/v1/tdm/roles, AS-IS Tdm20_RoleModel) */
export interface TdmRole {
  roleId: number;
  roleName: string | null;
  roleType: string | null;
  roleTypeName: string | null;
  roleTypeEtcName: string | null;
  overview: string | null;
  roleRelateTaskCnt: string | null;
  roleRelateCnclCnt: string | null;
  roleRelateOrgCnt: string | null;
  ceoRoleId: number | null;
  ceoRoleName: string | null;
  startDate: string | null;
  endDate: string | null;
  updName: string | null;
  updDateStr: string | null;
}

/** 직책 편집창 저장 (PUT /api/v1/tdm/roles, roleId가 없으면 새 직책, reason은 수정일 때만) */
export interface TdmRoleSaveReq {
  roleId: number | null;
  roleName: string;
  roleType: string;
  roleTypeEtcName: string | null;
  overview: string;
  startDate: string;
  endDate: string | null;
  ceoRoleId: number | null;
  reason: string | null;
}

/** 직책에 연결된 책무 한 행 (AS-IS Tdm21_RoleRelateTaskModel). 새 행은 ID ≤ 0 */
export interface TdmRoleTask {
  roleRelateTaskId: number;
  roleId: number;
  taskId: number;
  taskClassName: string | null;
  taskTypeName: string | null;
  taskName: string | null;
  startDate: string | null;
  endDate: string | null;
}

/** 직책에 연결된 회의체 한 행 (AS-IS Tdm22_RoleRelateCnclModel, 직책 쪽). 새 행은 ID ≤ 0 */
export interface TdmRoleCouncil {
  roleRelateCnclId: number;
  roleId: number;
  cnclId: number;
  cnclName: string | null;
  memberType: string | null;
  memberTypeName: string | null;
  startDate: string | null;
  endDate: string | null;
}

/** 직책에 연결된 부서 한 행 (AS-IS Tdm23_RoleRelateOrgModel). 새 행은 ID ≤ 0 */
export interface TdmRoleOrg {
  roleRelateOrgId: number;
  roleId: number;
  orgId: number;
  orgName: string | null;
}

/** 담당부서 조회창 한 행 (GET /api/v1/tdm/roles/{roleId}/orgs/lookup, AS-IS Tdm23_RoleRelateOrgModel) */
export interface TdmRoleOrgLookup {
  roleRelateOrgId: number;
  roleId: number;
  orgId: number;
  orgCode: string | null;
  orgName: string | null;
}

/** 직책-부서 승인선 한 행 (GET /api/v1/tdm/appr-steps, AS-IS Tdm09_ApprStepModel). 새 행은 ID ≤ 0 */
export interface TdmApprStep {
  apprStepId: number;
  roleId: number | null;
  orgId: number | null;
  roleName: string | null;
  exctName: string | null;
  orgName: string | null;
  managerName: string | null;
}

/** 승인자 한 행 (GET /api/v1/tdm/appr-steps/{id}/steps, AS-IS Tdm09_ApprStepModel) */
export interface TdmApprStepChild {
  apprStepId: number;
  apprSeq: string | null;
  apprEmpId: number | null;
  apprStepInfo: string | null;
  apprEmpName: string | null;
  posName: string | null;
  apprOrgName: string | null;
}

/** 책무이행점검 수행부서·담당자 (GET /api/v1/tdm/managers, AS-IS Tdm08_ManagerInfoModel) */
export interface TdmManager {
  managerInfoId: number;
  managerType: string;
  managerTypeName: string | null;
  orgId: number | null;
  orgName: string | null;
  personId: number | null;
  personName: string | null;
}

/** 담당자 적용기간 (GET /api/v1/tdm/managers/infos) */
export interface TdmManagerInfo {
  managerInfoId: number;
  managerType: string;
  orgId: number | null;
  personId: number | null;
  startDate: string | null;
  endDate: string | null;
  personName: string | null;
  posName: string | null;
  orgName: string | null;
}

/** 임원별 직책배정 한 행 (GET /api/v1/tdm/role-allcs, AS-IS Tdm30_RoleAllcModel) */
export interface TdmRoleAllc {
  roleAllcId: number;
  roleId: number | null;
  personId: number | null;
  roleName: string | null;
  personName: string | null;
  addTitleYn: boolean;
  startDate: string | null;
  endDate: string | null;
  /** 상신중이거나 완료된 임원동의서가 있다 */
  apprYn: boolean;
  updName: string | null;
  updDateStr: string | null;
}

/** 책무배분 등록창 저장 (POST /api/v1/tdm/role-allcs) */
export interface TdmRoleAllcCreateReq {
  roleId: number;
  personId: number;
  addTitleYn: boolean;
  startDate: string;
  roleAllcDate: string;
  regReason: string;
  deputyEmpName: string | null;
}

/** 책무배분 수정창 저장 (PUT /api/v1/tdm/role-allcs/{id}) */
export interface TdmRoleAllcUpdateReq {
  roleId: number | null;
  personId: number;
  addTitleYn: boolean;
  startDate: string;
  endDate: string | null;
}

/** 책무배분일 한 행 (GET /api/v1/tdm/role-allcs/{id}/details, AS-IS Tdm34_RoleAllcDetailModel). 새 행은 ID ≤ 0 */
export interface TdmRoleAllcDetail {
  roleAllcDetailId: number;
  roleAllcId: number;
  roleAllcDate: string | null;
  regReason: string | null;
  deputyEmpName: string | null;
  apprId: number | null;
  /** 상신 전 '00', 99 임시저장·40 반려·10/20 진행·30 완료 */
  apprStatusCode: string | null;
  apprStatusName: string | null;
  /** 겸직 'Y'/'N' — 'N'일 때만 책무기술서 미리보기 아이콘 */
  addTitleYnStr: string | null;
  updName: string | null;
  updDateStr: string | null;
}

/** 책무 및 세부내용 창의 책무 한 행 (AS-IS Tdm35_RoleAllcTaskModel) */
export interface TdmRoleAllcTask {
  roleAllcTaskId: number;
  taskId: number;
  taskName: string | null;
  apprYn: boolean;
}

/** 책무 및 세부내용 창의 세부내용 한 행 */
export interface TdmRoleAllcTaskDetail {
  roleAllcTaskId: number;
  taskRelateDetailName: string | null;
}

/** 인사정보 한 행 (GET /api/v1/tdm/hr-records, AS-IS Tdm02_HrRecordModel). applyCode 0 미적용 / 1 적용완료 / 9 해당없음 */
export interface TdmHrRecord {
  hrRecordId: number;
  regDate: string | null;
  regTypeNm: string | null;
  personNm: string | null;
  changeData: string | null;
  applyCode: string | null;
  /** 적용완료 체크 — AS-IS applyYn (applyCode가 null·0이면 false). 서버 응답에는 없고 화면이 채운다 */
  applyYn: boolean;
  note: string | null;
  updNm: string | null;
  updDateStr: string | null;
}
