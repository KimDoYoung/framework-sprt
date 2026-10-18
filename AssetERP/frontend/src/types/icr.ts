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
}

/** 내규 + 그 기한 한 쌍 (AS-IS Icr01_Lookup_SelectMulti "deadline", E13-3) */
export interface IcrClassTreeDeadline {
  classTreeId: number;
  classTreeFullName?: string | null;
  deadlineId?: number | null;
  deadlineFullName?: string | null;
  cycleName?: string | null;
}
