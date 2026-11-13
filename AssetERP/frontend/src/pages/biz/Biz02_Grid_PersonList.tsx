/**
 * 이익제공(수령) 인원 목록 (L02) — 직원(위) + 거래상대방(아래) 반반
 * AS-IS: myApp/client/vi/biz/Biz02_Grid_PersonList.java — 생성자 L14-17: internalList · externalList 를 VerticalLayoutData(1, 0.5)로 쌓는다.
 * setting() L19-22(둘 다 setEnabled(false)) · setButtonVisible() L24-27 · retrieve() L34-(둘 다 읽는다) — props(promo·closed·refreshKey)로 같은 일을 한다
 * 원본 2026-11-13(2e053393e, CH-0408): setButtonVisibleProvidePurCode() L29-32 — 직원 칸 버튼만 켜고 끈다(거래상대방 칸은 그대로) → internalClosed
 */
import React from 'react';
import { Biz02_Grid_InternalList } from './Biz02_Grid_InternalList';
import { Biz02_Grid_ExternalList } from './Biz02_Grid_ExternalList';

interface Props {
  promo: { promoId: number } | null;
  closed: boolean;
  /** 직원 칸만 따로 닫을 때(setButtonVisibleProvidePurCode). 없으면 closed */
  internalClosed?: boolean;
  refreshKey: number;
  onChanged: () => void;
}

// [E0] 화면 열림 (생성자 L14-17) → 직원·거래상대방 칸을 반반으로 쌓는다
export const Biz02_Grid_PersonList: React.FC<Props> = ({ internalClosed, ...props }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
    <div style={{ flex: 1, minHeight: 0 }}><Biz02_Grid_InternalList {...props} closed={internalClosed ?? props.closed} /></div>
    <div style={{ flex: 1, minHeight: 0 }}><Biz02_Grid_ExternalList {...props} /></div>
  </div>
);
