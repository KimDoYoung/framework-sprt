/** 퇴직정산(Pay10_Tab_Retire) 탭들이 공유하는 계약 — AS-IS InterfaceTabPage.retrieve(Map param) (S22) */
export interface RetireTabParam {
  /** 고른 사원 (없으면 null) */
  personId: number | null;
  /** 고른 사원의 발령일(퇴직일) 연도 'yyyy' — AS-IS retrieveTabpage(): transDate가 없으면 null */
  year: string | null;
}

export interface RetireTabHandle {
  /** 탭을 고를 때·[조회]·성명을 바꿀 때 부모가 부른다 */
  retrieve: (param: RetireTabParam) => Promise<unknown>;
  /** 사원이 바뀌어 모든 탭을 비운다(AS-IS는 탭마다 다시 retrieve) */
  clear?: () => void;
}

export const RETIRE_NO_MONTH = '선택한 사원의 퇴직정산서 내역이 없습니다. 생성 후 다시시도해주세요';
