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
