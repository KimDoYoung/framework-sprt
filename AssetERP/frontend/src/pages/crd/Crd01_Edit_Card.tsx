/**
 * 법인카드 편집 폼 (U13) — Crd01_Tab_Card 아래 왼쪽(570)에 붙는 폼
 * AS-IS: myApp/client/vi/crd/Crd01_Edit_Card.java (263줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L133-187: 라벨 폭 90, 줄마다 여백 20, 줄 = 카드명(500) / 카드번호(500) / 식별구분(500) / 카드회사(250)+사용여부(250) /
 *   시작일자(250)+카드구분(250) / 종료일자(250)+결제계좌(250, 읽기 전용 + 조회창 트리거) / 비고(500), 아래 [저장]
 * 선택한 카드가 없으면 폼 전체 비활성(Tab의 editForm.setEnabled)
 * (row00의 은행(카드) 줄은 layout.add에서 빠져 있어 그려지지 않는다 → 만들지 않는다)
 * UX보강(10): 저장 버튼 중복 클릭 방지(UX-01)
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, DatePicker, Input, message } from 'antd';
import dayjs from 'dayjs';
import { crdApi } from '@/api/crd';
import { errorMessage } from '@/api/client';
import { CrdCard } from '@/types/crd';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Ast01_Lookup_CorpAccount } from '@/pages/ast/Ast01_Lookup_CorpAccount';

const FORMAT = 'YYYY-MM-DD';

/** 칸 하나: 라벨(폭 90) + 입력. 줄 안에서 폭 250(한 칸) 또는 500(두 칸) */
const Cell: React.FC<{ label: string; width?: number; children: React.ReactNode }> = ({ label, width = 250, children }) => (
  <div style={{ width, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
    <label style={{ width: 90, flexShrink: 0, textAlign: 'right', paddingRight: 8 }}>{label}</label>
    <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>{children}</div>
  </div>
);

const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', margin: '10px 0 10px 20px' }}>{children}</div>
);

interface Props {
  /** 목록에서 고른 카드 (retrieve(cardModel) → editDriver.edit). null이면 폼 비활성 */
  model: CrdCard | null;
  /** update() 성공: 서버가 돌려준 카드 — 부르는 쪽이 목록의 그 행을 바꾼다 */
  onSaved: (oldId: number, saved: CrdCard) => void;
}

export const Crd01_Edit_Card: React.FC<Props> = ({ model, onSaved }) => {
  const [draft, setDraft] = useState<CrdCard | null>(model);
  const [saving, setSaving] = useState(false);
  const [lookupOpen, setLookupOpen] = useState(false);

  // [E0] 화면 열림 (생성자 L75-86) → setting(), getEditor() / retrieve(cardModel) L189-197: editDriver.edit(cardModel), 없으면 initialize
  useEffect(() => { setDraft(model ? { ...model } : null); }, [model]);

  const patch = (p: Partial<CrdCard>) => setDraft(prev => (prev ? { ...prev, ...p } : prev));
  const disabled = draft == null;
  const text = (key: 'cardName' | 'cardNoSlip' | 'cardNo' | 'note') => (
    <Input value={draft?.[key] ?? ''} onChange={e => patch({ [key]: e.target.value })} />
  );
  const date = (key: 'frDate' | 'toDate') => (
    <DatePicker style={{ width: '100%' }} format={FORMAT} value={draft?.[key] ? dayjs(draft[key]) : null}
      onChange={(_, s) => patch({ [key]: (s as string) || null })} />
  );

  // [E3] updateButton[저장].Select (L125) → updateCheck() L199-227: 카드번호 20자 초과 "카드번호를 다시 확인 바랍니다."
  //   → 사용내역이 있는 카드의 식별구분 수정 불가(서버가 crd.Crd02_Data.selectByCardNo로 확인) → update() L229-243: crd.Crd01_Card.update
  const updateCheck = async () => {
    if (!draft) return;
    if ((draft.cardNoSlip ?? '').length > 20) {
      message.warning('카드번호를 다시 확인 바랍니다.');
      return;
    }
    setSaving(true);
    try {
      const saved = await crdApi.saveCard(draft);
      onSaved(draft.cardId, saved);
      setDraft({ ...saved, cardManagerName: draft.cardManagerName });
      message.success('저장이 완료되었습니다.');
    } catch (err) {
      message.warning(errorMessage(err, '저장 실패'));  // new SimpleMessage("확인", serviceResult.getMessage())
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', opacity: disabled ? 0.6 : 1 }}>
      <fieldset disabled={disabled || saving} style={{ flex: 1, minHeight: 0, overflow: 'auto', border: 0, margin: 0, padding: 0 }}>
        <Row><Cell label="카드명" width={500}>{text('cardName')}</Cell></Row>
        <Row><Cell label="카드번호" width={500}>{text('cardNoSlip')}</Cell></Row>
        <Row><Cell label="식별구분" width={500}>{text('cardNo')}</Cell></Row>
        <Row>
          <Cell label="카드회사">
            <SystemCodeComboBox kindCd="CreditCardCompany" style={{ width: '100%' }} value={draft?.bankCode || undefined}
              onChange={(c, n) => patch({ bankCode: c ?? null, bankName: n ?? null })} />
          </Cell>
          <Cell label="사용여부">
            <Checkbox checked={draft?.closeYn === 'true'} onChange={e => patch({ closeYn: e.target.checked ? 'true' : 'false' })} />
          </Cell>
        </Row>
        <Row>
          <Cell label="시작일자">{date('frDate')}</Cell>
          <Cell label="카드구분">
            {/* [E1 생략] cardTypeName[카드구분].Collapse (L90) → 본문이 주석 처리(setDepositEnable)라 하는 일이 없다 */}
            <SystemCodeComboBox kindCd="CardType" style={{ width: '100%' }} value={draft?.cardType || undefined}
              onChange={(c, n) => patch({ cardType: c ?? null, cardTypeName: n ?? null })} />
          </Cell>
        </Row>
        <Row>
          <Cell label="종료일자">{date('toDate')}</Cell>
          <Cell label="결제계좌">
            {/* [E2] depositName[결제계좌].TriggerClick (L105) → Ast01_Lookup_CorpAccount.open(오늘, "NOT", …): 고른 계좌가 없으면(선택안함) 비운다 */}
            <LookupInput value={draft?.depositName ?? ''} disabled={disabled} onOpen={() => setLookupOpen(true)}
              onClear={() => patch({ depositId: null, depositName: null })} />
          </Cell>
        </Row>
        <Row><Cell label="비고" width={500}>{text('note')}</Cell></Row>
      </fieldset>
      <div style={{ height: 60, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <Button type="save" disabled={disabled} onClick={updateCheck}>저장</Button>
      </div>
      <Ast01_Lookup_CorpAccount open={lookupOpen} stdDate={dayjs()} mode="NOT"
        onResult={acc => { setLookupOpen(false); patch({ depositId: acc?.classTreeId ?? null, depositName: acc?.classTreeName ?? null }); }}
        onClose={() => setLookupOpen(false)} />
    </div>
  );
};
