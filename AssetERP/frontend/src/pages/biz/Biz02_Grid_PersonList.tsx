/**
 * 이익제공(수령) 인원 목록 (L02) — 직원(위) + 거래상대방(아래) 반반
 * AS-IS: myApp/client/vi/biz/Biz02_Grid_PersonList.java (46줄) — 생성자 L14-17: internalList · externalList 를 VerticalLayoutData(1, 0.5)로 쌓는다.
 * setting() L19-22(둘 다 setEnabled(false)) · setButtonVisible() L24-27 · retrieve() L29-45(둘 다 읽는다) — props(promo·closed·refreshKey)로 같은 일을 한다
 */
import React from 'react';
import { BizPromoCard } from '@/types/biz';
import { Biz02_Grid_InternalList } from './Biz02_Grid_InternalList';
import { Biz02_Grid_ExternalList } from './Biz02_Grid_ExternalList';

interface Props {
  promo: BizPromoCard | null;
  closed: boolean;
  refreshKey: number;
  onChanged: () => void;
}

// [E0] 화면 열림 (생성자 L14-17) → 직원·거래상대방 칸을 반반으로 쌓는다
export const Biz02_Grid_PersonList: React.FC<Props> = props => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
    <div style={{ flex: 1, minHeight: 0 }}><Biz02_Grid_InternalList {...props} /></div>
    <div style={{ flex: 1, minHeight: 0 }}><Biz02_Grid_ExternalList {...props} /></div>
  </div>
);
