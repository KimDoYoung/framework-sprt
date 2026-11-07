/**
 * 퇴직정산서 생성 창 (EE96) — 퇴직자의 퇴직정산서를 만든다. 정산월수·확정보험료를 넣지 않으면 서버 프로시저가 자동 계산한다.
 * AS-IS: myApp/client/vi/pay/Pay07_Lookup_RetireCreate.java (224줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L51-165: 400×400 모달 "퇴직정산서 생성", 라벨 폭 150, 안내 글 · 정산월수 · 안내 글 · 건강/장기요양/고용 확정보험료(각 120 + "없음" 체크), 아래 가운데 [생성][닫기]
 * 호출처 Pay07_Tab_Retire는 TOBE에 없다(퇴직정산은 Pay10_Tab_Retire로 대체) — 창만 만들고 연결하지 않는다
 * 스타일: MF (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useState } from 'react';
import { Checkbox, InputNumber, message, Space, Typography } from 'antd';
import { payRetireStatementApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';

const NOTE_STYLE: React.CSSProperties = { color: '#456EA6', fontWeight: 600, fontSize: 13 };
const fmt = (v: number | string | undefined) => `${v ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const parse = (v: string | undefined) => Number((v ?? '').replace(/,/g, ''));

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
    <Typography.Text style={{ width: 150, flex: 'none', textAlign: 'right', paddingRight: 10 }}>{label}</Typography.Text>
    {children}
  </div>
);

interface Props {
  /** open(personId, callback) L51 — 값이 있으면 열린다 */
  personId: number | null;
  /** 생성에 성공했을 때 callback.execute() */
  onResult: () => void;
  onClose: () => void;
}

export const Pay07_Lookup_RetireCreate: React.FC<Props> = ({ personId, onResult, onClose }) => {
  const [calcMonth, setCalcMonth] = useState<number | null>(null);
  const [fixHi, setFixHi] = useState<number | null>(null);
  const [fixLt, setFixLt] = useState<number | null>(null);
  const [fixEi, setFixEi] = useState<number | null>(null);
  const [nonHiYn, setNonHiYn] = useState(false);
  const [nonLtYn, setNonLtYn] = useState(false);
  const [nonEiYn, setNonEiYn] = useState(false);
  const [saving, setSaving] = useState(false);

  // [E4] createButton[생성].Select (L147) → create() L167-212: 빈 금액은 0 → pay.Pay07_Retire.createRetire → 성공이면 callback.execute(), hide(), 아니면 서버 메시지
  const create = async () => {
    if (personId == null) return;
    setSaving(true);
    try {
      await payRetireStatementApi.create({ personId, calcMonth, fixHi, fixLt, fixEi, nonHiYn, nonLtYn, nonEiYn });
      onResult();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '생성 실패'));
    } finally {
      setSaving(false);
    }
  };

  // 없음 체크 L75-107: 체크하면 금액을 비우고 입력을 막는다
  const money = (value: number | null, set: (v: number | null) => void, none: boolean, setNone: (b: boolean) => void, setValueOnCheck = set) => (
    <>
      <InputNumber style={{ width: 120 }} precision={0} value={value} disabled={none} formatter={fmt} parser={parse} onChange={v => set(v == null ? null : Number(v))} />
      <Checkbox style={{ marginLeft: 10 }} checked={none} onChange={e => { setNone(e.target.checked); if (e.target.checked) setValueOnCheck(null); }}>없음</Checkbox>
    </>
  );

  return (
    <LookupModal
      open={personId != null}
      title="퇴직정산서 생성"
      width={400}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      afterOpenChange={open => {
        if (open) { setCalcMonth(null); setFixHi(null); setFixLt(null); setFixEi(null); setNonHiYn(false); setNonLtYn(false); setNonEiYn(false); }
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => void create()} loading={saving}>생성</Button>
            {/* [E5] closeButton[닫기].Select (L154) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ padding: '10px 0' }}>
        <div style={{ ...NOTE_STYLE, margin: '10px 20px 5px' }}>※ 근무월수와 정산월수가 다른경우에만 입력해주세요.<br />&nbsp;&nbsp; (미입력시 근무월수로 계산됩니다)</div>
        <Field label="정산월수">
          <InputNumber style={{ width: 120 }} precision={0} value={calcMonth} onChange={v => setCalcMonth(v == null ? null : Number(v))} />
        </Field>
        <div style={{ ...NOTE_STYLE, margin: '20px 20px 5px' }}>※ 확정보험료 미입력시 자동계산됩니다.</div>
        {/* [E1~E3] nonHiYn·nonLtYn·nonEiYn.ValueChange (L75-107) */}
        <Field label="건강 확정보험료">{money(fixHi, setFixHi, nonHiYn, setNonHiYn)}</Field>
        <Field label="장기요양 확정보험료">{money(fixLt, setFixLt, nonLtYn, setNonLtYn)}</Field>
        <Field label="고용 확정보험료">{money(fixEi, setFixEi, nonEiYn, setNonEiYn)}</Field>
      </div>
    </LookupModal>
  );
};
