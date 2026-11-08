/**
 * 내규분류 선택창 (EE69) — 새 전자결재 문서에 붙일 연관내규를 고른다. Apr20_Lookup_SelectIcs와 같은 화면(법규 → 내규)이라 `kind="icr"`로 쓴다.
 * AS-IS: myApp/client/vi/apr/Apr22_Lookup_SelectIcr.java (188줄) — 800×450 모달 "내규분류", 체크박스 다중 그리드(구분 50 · 내규 450 · 주기 80 · 상세보기 60 · 삭제 60), 푸터 [확인][닫기]
 * 서버 apr.Apr22_RelateIcr.insertIcr(문서분류·고른 내규). 오늘의 할일에서 상신하는 open(…, Sch04_ListModel, …)은 AS-IS 호출처가 주석이라 만들지 않았다
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React from 'react';
import { AprRelateSelect } from '@/types/apr';
import { Apr20_Lookup_SelectIcs } from './Apr20_Lookup_SelectIcs';

interface Props {
  /** 값이 있으면 열린다 — 상신하는 문서분류(dcrClassTreeId)와 고른 내규(classTreeId) */
  target: { dcrClassTreeId: number; classTreeId: number } | null;
  onResult: (rows: AprRelateSelect[]) => void;
  onClose: () => void;
}

export const Apr22_Lookup_SelectIcr: React.FC<Props> = props => <Apr20_Lookup_SelectIcs {...props} kind="icr" />;
