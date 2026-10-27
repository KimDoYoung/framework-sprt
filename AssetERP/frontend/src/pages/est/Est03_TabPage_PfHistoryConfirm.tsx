/**
 * 용역수행내역 상세 보기 (Q11) — Est03_Tab_PfHistoryConfirm 아래 330 영역 (읽기 전용)
 * AS-IS: myApp/client/vi/est/Est03_TabPage_PfHistoryConfirm.java (133줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * getEditor() L69-110: 라벨 120, 왼쪽 660 폼(수행번호 · 수행시작일 · 수행종료일 / 담당자 · 승인자 · 승인상태 각 220 / 수행내역 660 / 상세내역 660×100, 모두 읽기 전용) + 오른쪽 "증빙자료" 890×277(Est04_Grid_PfFileConfirm). 버튼 없음
 */
import React from 'react';
import { Input } from 'antd';
import { PfHistory } from '@/types/est';
import { Est04_Grid_PfFileConfirm } from './Est04_Grid_PfFileConfirm';

const Field: React.FC<{ label: string; width: number; children: React.ReactNode }> = ({ label, width, children }) => (
  <div style={{ width, flex: 'none', display: 'flex', alignItems: 'flex-start' }}>
    <span style={{ width: 120, flex: 'none', lineHeight: '32px' }}>{label} </span>
    <div style={{ flex: 1, minWidth: 0, paddingRight: 10 }}>{children}</div>
  </div>
);

interface Props {
  /** retrieve(param) L113-117 — 그리드에서 고른 내역. init() L120-122 — 없으면 빈 폼 */
  row: PfHistory | null;
  /** 같은 행을 다시 눌러도 증빙을 다시 읽도록 부모가 올린다 */
  nonce: number;
}

export const Est03_TabPage_PfHistoryConfirm: React.FC<Props> = ({ row, nonce }) => (
  // [E0] 화면 열림 (생성자 L47-110 → settings L58-67, getEditor L69-110)
  <div style={{ height: '100%', display: 'flex', background: '#fff' }}>
    <div style={{ width: 660, flex: 'none', display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 40 }}>
      <div style={{ display: 'flex' }}>
        <Field label="수행번호" width={220}><Input readOnly value={row?.no ?? ''} /></Field>
        <Field label="수행시작일" width={220}><Input readOnly value={row?.startDate ?? ''} /></Field>
        <Field label="수행종료일" width={220}><Input readOnly value={row?.closeDate ?? ''} /></Field>
      </div>
      <div style={{ display: 'flex' }}>
        <Field label="담당자" width={220}><Input readOnly value={row?.personName ?? ''} /></Field>
        <Field label="승인자" width={220}><Input readOnly value={row?.confirmerName ?? ''} /></Field>
        <Field label="승인상태" width={220}><Input readOnly value={row?.statusName ?? ''} /></Field>
      </div>
      <Field label="수행내역" width={660}><Input readOnly value={row?.content ?? ''} /></Field>
      <Field label="상세내역" width={660}>
        <Input.TextArea readOnly style={{ height: 100, resize: 'none' }} value={row?.detail ?? ''} />
      </Field>
    </div>
    <div style={{ width: 890, flex: 'none', display: 'flex', margin: '40px 20px 20px 10px' }}>
      <span style={{ width: 120, flex: 'none', lineHeight: '32px' }}>증빙자료 </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Est04_Grid_PfFileConfirm pfHistoryId={row?.pfHistoryId ?? null} nonce={nonce} />
      </div>
    </div>
  </div>
);
