/** 문서분류 선택 조회창 한 행 (AS-IS Dcr01_ClassTreeModel 중 Dcr01_Lookup_SelectMulti 그리드 열, E13-3) */
export interface DcrClassTreeLookup {
  classTreeId: number;
  classTreeCode?: string | null;
  classTreeFullName?: string | null;
}
