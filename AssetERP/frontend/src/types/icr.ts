/** 내규 분류 트리 한 노드 (AS-IS Icr01_ClassTreeModel 중 Icr01_Lookup_SelectParent 트리 열, E13-3). depth는 서버가 준다 */
export interface IcrClassTreeNode {
  classTreeId: number;
  parentTreeId: number;
  classTreeCode?: string | null;
  classTreeName?: string | null;
  seq?: string | null;
  deadlineFullName?: string | null;
  depth?: number | null;
}

/** 내규 선택 조회창 한 행 (AS-IS Icr01_ClassTreeModel 중 Icr01_Lookup_SelectMulti 그리드 열, E13-3) */
export interface IcrClassTreeLookup {
  classTreeId: number;
  classTreeCode?: string | null;
  classTreeName?: string | null;
  content?: string | null;
  submitTo?: string | null;
  cycleName?: string | null;
  relatedLaw?: string | null;
  classTreeFullName?: string | null;
}

/** 내규상세 창 값 (AS-IS Icr01_ClassTreeModel 중 Icr01_Lookup_ClassTreeDetail 폼, E13-3) */
export interface IcrClassTreeDetail {
  classTreeId: number;
  classTreeCode?: string | null;
  classTreeName?: string | null;
  content?: string | null;
  relatedLaw?: string | null;
  submitTo?: string | null;
  /** 기한 이름을 ', '로 이은 문자열 */
  deadlineName?: string | null;
  /** 분류 전체 경로 이름 (내규조회 H03의 분류 칸) */
  classTreeFullName?: string | null;
}

/** 내규조회 한 행 (AS-IS Icr01_ClassTreeModel 중 Icr01_Tab_ClassTreeView 그리드 열 + id, H03) */
export interface IcrClassTreeView {
  classTreeId: number;
  classTreeCode?: string | null;
  classTreeName?: string | null;
  content?: string | null;
  submitTo?: string | null;
  relatedLaw?: string | null;
  cycleName?: string | null;
  fileCount?: string | null;
  parentTreeFullName?: string | null;
}

/** 내규 + 그 기한 한 쌍 (AS-IS Icr01_Lookup_SelectMulti "deadline", E13-3) */
export interface IcrClassTreeDeadline {
  classTreeId: number;
  classTreeFullName?: string | null;
  deadlineId?: number | null;
  deadlineFullName?: string | null;
  cycleName?: string | null;
}

/** 내규분류 등록·수정 요청 (AS-IS Icr01_Edit_ClassTree.update, H09) — 조회순서(seq)는 저장 때 분류코드로 채운다 */
export interface IcrClassTreeSaveReq {
  parentTreeId?: number | null;
  classTreeCode: string;
  classTreeName: string;
  seq: string;
}

/** 내규관리 한 행 (AS-IS Icr01_ClassTreeModel 중 Icr01_Grid_IcrType 그리드 열 + 저장·이동에 쓰는 id, H09). useYn은 DB 형태('true'/'false') 그대로 */
export interface IcrRule {
  classTreeId: number;
  parentTreeId?: number | null;
  classTreeCode?: string | null;
  classTreeName?: string | null;
  content?: string | null;
  submitTo?: string | null;
  cycleName?: string | null;
  managerGroupName?: string | null;
  fileCount?: string | null;
  relatedLaw?: string | null;
  useYn?: string | null;
  companyId?: number | null;
}
