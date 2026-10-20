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
