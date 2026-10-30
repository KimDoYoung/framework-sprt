/**
 * 접대비 현황(U18) 탭 페이지 공통 약속 — AS-IS InterfaceTabPage.retrieve(Map param)
 * param = year(yyyy) · month('01'~'12' | '전체') · cardRealUserType('관리자' | '실사용자')
 */
export interface EntertmParam {
  year: string;
  month: string;
  cardRealUserType: string;
}

export interface EntertmTabHandle {
  /** AS-IS retrieve(param) — 탭을 고르거나 [조회]를 누르면 상위가 활성 탭에 시킨다 */
  retrieve: (param: EntertmParam) => Promise<void>;
  /** AS-IS init() — 그리드 비움 */
  init: () => void;
}
