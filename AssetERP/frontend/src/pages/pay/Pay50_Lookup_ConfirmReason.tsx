/**
 * 반려사유 창 (Y09) — Pay50_Tab_ExpenseConfirm의 [반려]·승인상태 칸이 연다
 * AS-IS: myApp/client/vi/pay/Pay50_Lookup_ConfirmReason.java (107줄) — 생성자·open·edit·view·update·close가 Pay50_Lookup_RejectReason과 줄 단위로 같다
 *   (모달 500×350 "반려사유", 글 입력칸 하나 + [저장][닫기]). 그래서 U03의 Pay50_Lookup_RejectReason을 그대로 쓰고, 클래스 이름만 맞춘 얇은 껍질로 둔다
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React from 'react';
import { Pay50_Lookup_RejectReason } from './Pay50_Lookup_RejectReason';

// [E0] 화면 열림 (생성자 L30-51) → settings(), show() — Pay50_Lookup_RejectReason [E0]
// [E1] updateButton[저장].Select (L74) → update() L93-102: 사유가 비면 "사유를 입력하세요" — Pay50_Lookup_RejectReason [E1] ([저장] 버튼 1개)
// [E2] closeButton[닫기].Select (L80) → hide(), callback(null), hide() — Pay50_Lookup_RejectReason [E2] ([닫기] 버튼 1개)
export type { RejectReasonMode as ConfirmReasonMode } from './Pay50_Lookup_RejectReason';

export const Pay50_Lookup_ConfirmReason: React.FC<React.ComponentProps<typeof Pay50_Lookup_RejectReason>> = props => (
  <Pay50_Lookup_RejectReason {...props} />
);
