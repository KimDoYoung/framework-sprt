/**
 * 내규 목록 창 (EE70) — 결재 전·결재중 문서의 연관내규를 더하고 빼고 기준일·마감일을 정한다. Apr20_Lookup_RelateIcsList와 같은 화면(법규 → 내규)이라 `kind="icr"`로 쓴다.
 * AS-IS: myApp/client/vi/apr/Apr22_Lookup_RelateIcrList.java (304줄) — open() L65-132: 850×500 모달 "내규 목록", 위 [행 추가][행 삭제] + 새로고침 아이콘,
 *   단일 체크 그리드(내규 510 · 주기 80 · 마감일 100 · 설정 80), 푸터 [저장][닫기]. 서버 apr.Apr22_RelateIcr.selectByApprId·check·deleteList, 내규 조회창 Icr01_Lookup_SelectMulti("deadline"),
 *   설정 창 Apr22_Lookup_RelateIcr. 변경이 있으면 상신자에게 "상신문서 연관내규 변동알림"이 간다(서버).
 * ※ 호출처 Apr01_Edit_ApprDoc.icrEdit() L1367은 AS-IS에서 단추가 없어(makeIcrEditButton 없음) 아무도 부르지 않는다 — 창만 만들고 연결하지 않았다
 * 스타일: MF (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React from 'react';
import { Apr20_Lookup_RelateIcsList } from './Apr20_Lookup_RelateIcsList';

interface Props {
  /** open(apprModel, callback) — 값이 있으면 열린다 */
  target: { apprId: number; statusCode: string } | null;
  /** [닫기] — AS-IS callback.execute(apprModel): 문서창이 연관내규 탭을 다시 읽는다 */
  onClosed: () => void;
  onClose: () => void;
}

export const Apr22_Lookup_RelateIcrList: React.FC<Props> = props => <Apr20_Lookup_RelateIcsList {...props} kind="icr" />;
