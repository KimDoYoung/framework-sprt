/** 내부통제 분류 트리 한 노드 (AS-IS Ics01_ClassTreeModel 중 Ics01_Tab_ClassTree 트리 열). depth는 서버가 준다 */
export interface ClassTreeNode {
  classTreeId: number;
  parentTreeId: number;
  classTreeCode?: string | null;
  classTreeName?: string | null;
  seq?: string | null;
  deadlineFullName?: string | null;
  depth?: number | null;
}

/** 법규별 문서작성 왼쪽 트리 노드 (AS-IS Ics01_ClassTreeModel 중 Ics01_Tab_ApprList 트리 열). typeCode IC 법규분류·IT 법규구분, content는 작성 Tip */
export interface IcsWriteTreeNode {
  classTreeId: number;
  parentTreeId: number;
  classTreeCode?: string | null;
  classTreeName?: string | null;
  typeCode?: string | null;
  content?: string | null;
  depth?: number | null;
}

/** 분류 등록·수정 창 값 */
export interface ClassTreeSaveReq {
  parentTreeId?: number | null;
  classTreeCode: string;
  classTreeName: string;
  seq?: string | null;
}

/** 법규 한 행 (AS-IS Ics01_ClassTreeModel 중 Ics01_Grid_IcsType 그리드 열). advisYn은 DB 형태('true'/'false') 그대로 */
export interface IcsLaw {
  classTreeId: number;
  parentTreeId?: number | null;
  classTreeCode?: string | null;
  classTreeName?: string | null;
  content?: string | null;
  submitTo?: string | null;
  cycleName?: string | null;
  fileCount?: string | null;
  relatedLaw?: string | null;
  revisionCount?: string | null;
  tdmCount?: string | null;
  advisYn?: string | null;
  companyId?: number | null;
}

/** 법규 개정내역 한 행 (AS-IS Ics20_RevisionHistoryModel 중 Ics20_Lookup_RevisionHistory 그리드 열 + 상세내용) */
export interface IcsRevisionHistory {
  revisionHistoryId: number;
  regDate?: string | null;
  submissionDate?: string | null;
  effectDate?: string | null;
  title?: string | null;
  financeAgencyName?: string | null;
  reflectionDate?: string | null;
  fileCount?: number | null;
  note?: string | null;
}

/** 법규에 연결된 서식파일 한 행 (AS-IS Sys11_RelateFileModel 중 Ics01_Lookup_IcsFile 그리드 열) */
export interface IcsRelateFile {
  relateFileId: number;
  fileId: number;
  parentId?: number | null;
  fileName?: string | null;
  regDate?: string | null;
}

/** 불러올 서식파일 한 행 (AS-IS Sys10_FileModel 중 Ics01_Lookup_IcsFileAdmin 그리드 열) */
export interface IcsFormFile {
  fileId: number;
  regDate?: string | null;
  lawName?: string | null;
  note?: string | null;
  fileName?: string | null;
}

/** 법규보고 서식파일 한 행 (AS-IS Sys10_FileModel 중 Ics01_Tab_IcsFileUpload 그리드 열, E02) */
export interface IcsFormFileAdmin {
  fileId: number;
  /** 법령구분 코드(LawType) */
  lawType?: string | null;
  lawName?: string | null;
  note?: string | null;
  regDate?: string | null;
  fileName?: string | null;
}

/** 법규 개정내역 한 행 (AS-IS Ics20_RevisionHistoryModel 중 Ics20_Tab_RevisionHistoryAdmin 그리드 열 + 편집 폼 값, E03). 날짜는 'YYYY-MM-DDT…' 또는 'YYYY-MM-DD' */
export interface IcsRevisionHistoryAdmin {
  revisionHistoryId: number;
  regDate?: string | null;
  submissionDate?: string | null;
  effectDate?: string | null;
  reflectionDate?: string | null;
  /** 소관부처 코드(FinanceAgencyCode) */
  financeAgencyCode?: string | null;
  financeAgencyName?: string | null;
  title?: string | null;
  relatedLaw?: string | null;
  note?: string | null;
  icsCount?: number | null;
  fileCount?: number | null;
}

/** 개정내역 저장 값 (revisionHistoryId가 없거나 0 이하면 새로 등록) */
export interface IcsRevisionHistoryAdminSaveReq {
  revisionHistoryId?: number | null;
  regDate?: string | null;
  submissionDate?: string | null;
  effectDate?: string | null;
  reflectionDate?: string | null;
  financeAgencyCode?: string | null;
  title?: string | null;
  relatedLaw?: string | null;
  note?: string | null;
}

/** 개정내역에 연결된 법규 한 행 (AS-IS Ics19_RevisionRelateIcsModel 중 ics19_Grid_IcsList 그리드 열, E03). 저장 전 새 행은 임시 음수 ID */
export interface IcsRevisionLaw {
  revisionRelateIcsId: number;
  revisionHistoryId?: number | null;
  classTreeId: number;
  classTreeName?: string | null;
}

/** 법규조회 한 행 (AS-IS Ics01_ClassTreeModel 중 Ics01_Tab_ClassTreeUserView 그리드 열 + id, H02). advisYn은 'true'/'false' */
export interface IcsLawView {
  classTreeId: number;
  classTreeCode?: string | null;
  classTreeName?: string | null;
  content?: string | null;
  submitTo?: string | null;
  relatedLaw?: string | null;
  revisionCount?: string | null;
  cycleName?: string | null;
  fileCount?: string | null;
  parentTreeFullName?: string | null;
  advisYn?: string | null;
}

/** 법규관리 한 행 (AS-IS Ics01_ClassTreeModel 중 Ics01_Tab_ClassTreeUser 그리드 열 + id, H08). advisYn·exceptYn·autoYn은 'true'/'false' */
export interface IcsLawManage {
  classTreeId: number;
  classTreeCode?: string | null;
  classTreeName?: string | null;
  content?: string | null;
  submitTo?: string | null;
  relatedLaw?: string | null;
  revisionCount?: string | null;
  cycleName?: string | null;
  fileCount?: string | null;
  parentTreeFullName?: string | null;
  advisYn?: string | null;
  managerGroupName?: string | null;
  exceptYn?: string | null;
  autoYn?: string | null;
}

/** 법규 사용여부 설정 창 한 행 (AS-IS Ics01_ClassTreeModel 중 Ics01_Lookup_Except 그리드 열, H08). exceptYn은 'true'(미사용)/'false' */
export interface IcsLawExcept {
  classTreeId: number;
  classTreeCode?: string | null;
  classTreeFullName?: string | null;
  cycleName?: string | null;
  exceptYn?: string | null;
}

/** 법규 관리그룹 (AS-IS Ics02_ManagerModel, H08) */
export interface IcsManager {
  managerId: number;
  managerGroupName?: string | null;
  personId?: number | null;
  personName?: string | null;
  note?: string | null;
  defaultYn?: boolean | null;
}

/** 관리그룹 공유 한 행 (AS-IS Ics04_ShareModel, H08) */
export interface IcsShare {
  shareId: number;
  shareCode?: string | null;
  shareName?: string | null;
  personId?: number | null;
  personName?: string | null;
  orgId?: number | null;
  orgName?: string | null;
  companyId?: number | null;
}

/** 법규 회사별 설정 저장 한 행 (AS-IS ics.Ics03_CompanyInfo.modelUpdate, H08) */
export interface IcsCompanyInfoSave {
  classTreeId: number;
  exceptYn?: boolean;
  autoYn?: boolean;
  advisYn?: boolean;
}

/** 월별 법규조회 한 행 (AS-IS Ics01_ClassTreeModel 중 Ics01_Tab_PeriodList 그리드 열, H04). rowNo = 행 키, realClassTreeId = 진짜 법규 id. advisYn은 'true'/'false' */
export interface IcsLawPeriod {
  rowNo: number;
  realClassTreeId: number;
  closeDate?: string | null;
  level1Name?: string | null;
  level2Name?: string | null;
  classTreeNameAddAppr?: string | null;
  submitTo?: string | null;
  cycleName?: string | null;
  relatedLaw?: string | null;
  fileCount?: string | null;
  advisYn?: string | null;
}

/** 법규 분류 한 노드 (AS-IS Ics01_ClassTreeModel 중 IcsComboBoxField·Ics01_Lookup_CheckList 열, H04) */
export interface IcsClassTreeItem {
  classTreeId: number;
  classTreeName?: string | null;
  parentTreeName?: string | null;
}

/** 법규 분류 조회창 한 행 (AS-IS Ics01_ClassTreeModel 중 Ics01_Lookup_SelectMulti 그리드 열, E03) */
export interface IcsLawLookup {
  classTreeId: number;
  classTreeCode?: string | null;
  classTreeName?: string | null;
  content?: string | null;
  submitTo?: string | null;
  cycleName?: string | null;
  relatedLaw?: string | null;
  classTreeFullName?: string | null;
}

/** 법규상세 창 값 (AS-IS Ics01_ClassTreeModel 중 Ics01_Lookup_ClassTreeDetail 폼, E03-1) */
export interface IcsLawDetail {
  classTreeId: number;
  classTreeCode?: string | null;
  classTreeName?: string | null;
  /** 분류 경로를 이은 이름 */
  classTreeFullName?: string | null;
  content?: string | null;
  relatedLaw?: string | null;
  submitTo?: string | null;
  /** 기한 이름을 ', '로 이은 문자열 */
  deadlineName?: string | null;
}

/** 내부통제 체크리스트 한 행 (AS-IS Ics10_ChecklistModel, E04). useYn은 DB 형태('true'/'false') 그대로 */
export interface IcsChecklist {
  checklistId: number;
  companyId?: number | null;
  content?: string | null;
  criterion?: string | null;
  useYn?: string | null;
  checklistMClassId?: number | null;
  seq?: number | null;
  checkLClassName?: string | null;
  checkMClassName?: string | null;
  checkLClassId?: number | null;
  checkLClassSeq?: number | null;
  checkMClassSeq?: number | null;
}

/** 내부통제 체크리스트 한 행 — 고객사용 (K04, AS-IS ics10_checklist.selectBySearchText). useYn은 고객사별 설정, writeGroupName은 담당그룹 */
export interface IcsChecklistUser extends IcsChecklist {
  writeGroupName?: string | null;
}

/** 체크리스트 분류 콤보 항목 (AS-IS sys.Sys09_Code.selectByIcs21·selectByIcs23) */
export interface IcsChecklistClassCode {
  code: string;
  name: string;
}

/** 체크리스트 대분류 한 행 (AS-IS Ics21_ChecklistLClassModel, E04) */
export interface IcsChecklistLClass {
  checklistLClassId: number;
  checklistLClassName?: string | null;
  companyId?: number | null;
  note?: string | null;
  seq?: number | null;
  useYn?: string | null;
  closeDate?: string | null;
}

/** 체크리스트 중분류 한 행 (AS-IS Ics23_ChecklistMClassModel, E04) */
export interface IcsChecklistMClass {
  checklistMClassId: number;
  checklistMClassName?: string | null;
  checklistLClassId?: number | null;
  companyId?: number | null;
  note?: string | null;
  seq?: number | null;
  useYn?: string | null;
  closeDate?: string | null;
}

/** 법규 + 그 기한 한 쌍 (AS-IS Ics01_Lookup_SelectMulti "deadline", E04) */
export interface IcsLawDeadline {
  classTreeId: number;
  classTreeFullName?: string | null;
  deadlineId?: number | null;
  deadlineFullName?: string | null;
  cycleName?: string | null;
}

// ── E05 임직원 내부통제 준수리스트 (Ics30_Tab_Compliance) ──

/** 기준 적용일 한 행 (AS-IS ics30_compliance.groupByStartDate). 날짜는 'YYYY-MM-DD' */
export interface IcsComplianceDate {
  complianceId: number
  startDate: string
  dateFixYn?: string | null
}

/** 준수항목 한 행 (AS-IS ics30_compliance.selectByStartDate). 사용여부 등은 'true'/'false' 문자열 */
export interface IcsCompliance {
  complianceId: number
  companyId?: number | null
  startDate: string
  complianceType?: string | null
  complianceTypeName?: string | null
  subNum?: string | null
  content?: string | null
  naUseYn?: string | null
  useYn?: string | null
  useCloseDate?: string | null
  note?: string | null
  dateFixYn?: string | null
}

/** 준수답변 한 행 (AS-IS ics33_compliance_answer.selectByCompanyId) */
export interface IcsComplianceAnswer {
  complianceAnswerId: number
  companyId?: number | null
  startDate?: string | null
  complianceType?: string | null
  caseNo?: number | null
  answer1Cd?: string | null
  answer1Name?: string | null
  answer2Cd?: string | null
  answer2Name?: string | null
  answer3Cd?: string | null
  answer3Name?: string | null
  answer4Cd?: string | null
  answer4Name?: string | null
  answer5Cd?: string | null
  answer5Name?: string | null
}

/** 법규등록요청 (ics17_user_request, E09) — confirmYn은 DB 형태('true'/'false' 문자열), 일자는 YYYY-MM-DD */
export interface IcsUserRequest {
  userRequestId: number;
  companyId: number;
  companyName: string;
  personId: number;
  personName: string;
  regDate: string;
  lawTitle: string;
  lawContent: string | null;
  submitTo: string | null;
  relatedLaw: string | null;
  reportCycle: string | null;
  result: string | null;
  note: string | null;
  stateCode: string | null;
  stateName: string | null;
  closeDate: string | null;
  confirmYn: string | null;
}

export interface IcsUserRequestSaveReq {
  regDate: string;
  confirmYn: string;
  stateCode: string | null;
  closeDate: string | null;
  result: string | null;
  note: string | null;
}

/** 법규등록요청 조회 조건 (Ics17_Tab_UserRequestAdmin.retrieve) */
export interface IcsUserRequestSearch {
  startDate: string;
  closeDate: string;
  /** 회사명 또는 '%'(전체) */
  companyText: string;
  /** 진행상태 코드 또는 '%'(전체) */
  stateCode: string;
  unconfirmedOnly: boolean;
  incompleteOnly: boolean;
  searchText: string;
}

/** 법규등록신청 조회 조건 (Ics17_Tab_UserRequest.retrieve) */
export interface IcsUserRequestMySearch {
  startDate: string;
  closeDate: string;
  /** 진행상태 코드 또는 '%'(전체) */
  stateCode: string;
  unconfirmedOnly: boolean;
  searchText: string;
}

/** 법규등록신청 저장 (H11, 서버 UserRequestMyReq) — 신청자 화면이 고치는 칸 */
export interface IcsUserRequestMyReq {
  regDate: string;
  confirmYn: string;
  lawTitle: string | null;
  lawContent: string | null;
  reportCycle: string | null;
  submitTo: string | null;
  relatedLaw: string | null;
}

/** 관리그룹 저장 한 행 (H10, 서버 IcsManagerSaveReq) — 새 행은 managerId ≤ 0 */
export interface IcsManagerSaveReq {
  managerId: number;
  managerGroupName?: string | null;
}

/** 관리그룹 공유 저장 한 행 (H10, 서버 IcsShareSaveReq) — 새 행은 shareId ≤ 0 */
export interface IcsShareSaveReq {
  shareId: number;
  shareCode?: string | null;
  orgId?: number | null;
}

/** 내부통제 준수확인서 작성 그리드 한 행 (K01, 서버 IcsComplianceWriteRes) — 작성 행이 없으면 complianceWriteId·answerCode·reason이 null */
export interface IcsComplianceWrite {
  complianceId: number;
  companyId: number;
  startDate: string;
  complianceType: string;
  complianceTypeName: string | null;
  subNum: string | null;
  content: string | null;
  /** 'true'면 '해당없음' 선택 가능 (ics30_na_use_yn) */
  naUseYn: string | null;
  complianceWriteId: number | null;
  /** Y 예 / N 아니오 / X 해당없음 */
  answerCode: string | null;
  reason: string | null;
  fixYn: boolean;
  confirmYn: boolean;
  confirmerName: string | null;
  personName: string | null;
  orgName: string | null;
}

/** 작성 행 하나 (K01, 서버 IcsComplianceWriteItem — AS-IS Ics31_ComplianceWriteModel) */
export interface IcsComplianceWriteItem {
  complianceWriteId: number;
  complianceId: number;
  answerCode: string | null;
  reason: string | null;
  fixYn: boolean;
  confirmYn: boolean;
}

/** 내부통제 체크리스트 작성 그리드 한 행 (K05, 서버 IcsChecklistWriteRes) — 작성 행이 없으면 checklistWriteId·answerCode·reason이 null */
export interface IcsChecklistWrite extends IcsChecklist {
  checklistWriteId: number | null;
  /** Y 예 / N 아니오 / X 해당없음 */
  answerCode: string | null;
  reason: string | null;
  fixYn: boolean;
  confirmYn: boolean;
}

/** 체크리스트 작성 행 하나 (K05, 서버 IcsChecklistWriteItem — AS-IS Ics15_ChecklistWriteModel) */
export interface IcsChecklistWriteItem {
  checklistWriteId: number;
  checklistId: number;
  answerCode: string | null;
  reason: string | null;
  fixYn: boolean;
  confirmYn: boolean;
}

/** 내부통제내역 확인 그리드 한 행 (K06, 서버 IcsChecklistConfirmRes — AS-IS Ics11_ChecklistCompanyModel). 작성 행이 없으면 checklistWriteId null, reason은 "답변 (사유)" */
export interface IcsChecklistConfirm extends IcsChecklist {
  checklistWriteId: number | null;
  reason: string | null;
  orgName: string | null;
  personId: number;
  personName: string | null;
  fixYn: boolean;
  confirmYn: boolean;
}

/** 내부통제내역 확인 조회 조건 (K06) — stdDate = 기준 분기(월)의 말일 */
export interface ChecklistConfirmParams {
  stdDate: string;
  cycleType: string;
  checklistLClassId?: number | null;
  checklistMClassId?: number | null;
  searchText: string;
  unCheckYn: boolean;
  unConfirmYn: boolean;
}

/** 내부통제내역 현황 그리드 한 행 (K07, 서버 IcsChecklistStatusRes — AS-IS Sys99_PrintModel). months는 1~12월 12칸("O / X", 기준월 이후는 "-"), 분기 체크주기는 3·6·9·12번째 칸이 1~4분기 */
export interface IcsChecklistStatus {
  checklistId: number;
  checkLClassName: string | null;
  checkMClassName: string | null;
  content: string | null;
  months: string[];
}

/** 내부통제내역 상세 한 행 (K07 상세 조회창·K08, 서버 IcsChecklistStatusDetailRes) — 확인 그리드 행 + 확인자 이름 */
export interface IcsChecklistStatusDetail extends IcsChecklistConfirm {
  confirmerName: string | null;
}

/** 상신 조회창 한 행 (K06, 서버 IcsChecklistRelateApprRes — AS-IS Ics16_RelateApprModel) */
export interface IcsChecklistRelateAppr {
  relateApprId: number;
  checkLClassName: string | null;
  totalCount: number;
  confirmCount: number;
  checklistLClassId: number;
  apprId: number | null;
  /** 결재 상태 코드 — 10 상신 / 20 결재 중 / 99 임시저장 */
  statusCode: string | null;
  statusName: string | null;
}

/** 내부통제 준수점검 그리드 한 행 (K02, 서버 IcsComplianceConfirmRes) — reason은 "답변(사유)" */
export interface IcsComplianceConfirm {
  complianceWriteId: number;
  complianceTypeName: string | null;
  subNum: string | null;
  content: string | null;
  reason: string | null;
  orgName: string | null;
  personName: string | null;
  fixYn: boolean;
  confirmYn: boolean;
}

/** 내부통제 준수보고서 한 줄 (K03, 서버 IcsComplianceReportRes — AS-IS가 sys99_print에 쌓던 행) */
export interface IcsComplianceReportRow {
  seq: number;
  personId: number;
  personName: string | null;
  orgName: string | null;
  complianceType: string;
  complianceTypeName: string | null;
  complianceResult: string | null;
  reason: string | null;
}

/** 그 달 준수보고의 상신 연결 (K03, 서버 IcsComplianceReportApprRes) — 상신 전이면 statusCode 없음 */
export interface IcsComplianceReportAppr {
  relateApprId: number;
  apprId: number | null;
  statusCode: string | null;
  statusName: string | null;
}
