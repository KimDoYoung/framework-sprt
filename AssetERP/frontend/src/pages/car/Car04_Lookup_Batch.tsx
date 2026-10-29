/**
 * 전용차량 운행일지 일괄생성 창 (T12) — Car04_Tab_PrivateJournalAdmin [일괄생성]이 연다
 * AS-IS: myApp/client/vi/car/Car04_Lookup_Batch.java (295줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L67-84: 모달 780×300 "전용차량 운행일지(일괄등록)", 아래 가운데 [생성][취소]. getEditor() L183-218: 라벨 폭 140, 줄 4개(일일 주행거리·비업무용 / 출퇴근용·일반업무용 / 행선지 / 목적)
 * EditModal 규격(11 §4a). 입력칸 값 확정(AS-IS Change = 칸을 벗어날 때)마다 calculation()
 */
import React, { useEffect, useState } from 'react';
import { Input, InputNumber, message, Modal, Space } from 'antd';
import { carApi } from '@/api/car';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';

/** NumberFormat "###,###,###" */
const fmtLong = (v: string | number | undefined) => (v == null || v === '' ? '' : `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
const parseNum = (v: string | undefined) => (v ?? '').replace(/,/g, '');
const num = (v: number | null | undefined) => v ?? 0;

/** 칸 하나: 라벨(폭 140) + 입력 + 뒤 글자(km) */
const Cell: React.FC<{ label: string; width: number; unit?: boolean; children: React.ReactNode }> = ({ label, width, unit, children }) => (
  <div style={{ width, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
    <label style={{ width: 140, flexShrink: 0, textAlign: 'right', paddingRight: 10 }}>{label}</label>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    {unit && <span style={{ width: 50, paddingLeft: 5 }}>km</span>}
  </div>
);

const Row: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', margin: '0 10px 20px 10px' }}>{children}</div>
);

interface Draft {
  mileage: number | null;
  unBizMileage: number | null;
  commuteMileage: number | null;
  bizMileage: number | null;
  destination: string | null;
  reason: string | null;
}
const EMPTY: Draft = { mileage: null, unBizMileage: null, commuteMileage: null, bizMileage: null, destination: null, reason: null };

/**
 * calculation() L158-181 — mileage = 주행 후 − 주행 전(둘 다 채워지지 않는 칸이라 mileage 그대로), 업무용 = 주행거리 − 비업무용.
 * 출퇴근용이 0이면 일반업무용 0·출퇴근용 = 주행거리 − 비업무용, 아니면 일반업무용 = 업무용 − 출퇴근용. 이어서 일반업무용이 0이면 출퇴근용 = 주행거리 − 비업무용, 아니면 출퇴근용 = 업무용 − 일반업무용
 */
const calculation = (d: Draft): Draft => {
  const mileage = num(d.mileage);
  const business = mileage - num(d.unBizMileage);
  let commute = num(d.commuteMileage);
  let biz = num(d.bizMileage);
  if (commute === 0) { biz = 0; commute = mileage - num(d.unBizMileage); } else { biz = business - commute; }
  if (biz === 0) { commute = mileage - num(d.unBizMileage); biz = 0; } else { commute = business - biz; }
  return { ...d, mileage, commuteMileage: commute, bizMileage: biz, unBizMileage: num(d.unBizMileage) };
};

interface Props {
  /** insert(infoId, stdMonth, cb)가 값을 주면 열림. stdMonth는 'YYYY.MM' */
  target: { infoId: number; stdMonth: string } | null;
  /** callBack.execute() — 생성이 끝났을 때(부르는 쪽이 다시 조회) */
  onDone: () => void;
  onClose: () => void;
}

export const Car04_Lookup_Batch: React.FC<Props> = ({ target, onDone, onClose }) => {
  const [draft, setDraft] = useState<Draft>(EMPTY);

  // insert() L59-65: 열릴 때마다 새 입력
  useEffect(() => { if (target) setDraft(EMPTY); }, [target]);

  const km = (key: 'mileage' | 'unBizMileage' | 'commuteMileage' | 'bizMileage') => (
    <InputNumber style={{ width: '100%' }} controls={false} precision={0} formatter={fmtLong} parser={parseNum as never}
      value={draft[key]} onChange={v => setDraft(prev => ({ ...prev, [key]: v == null ? null : Number(v) }))}
      // [E3]~[E9] 각 칸.Change (L112-155) → calculation() — 칸을 벗어날 때. [E3] afterMileage는 비활성이라 도달 불가
      onBlur={() => setDraft(prev => calculation(prev))} />
  );

  // [E1] batchButton[생성].Select (L87) → batchCheck() L220-239: 확인창 → [E10] batch() L241-278
  const batchCheck = () => {
    if (!target) return;
    Modal.confirm({
      title: '확인',
      content: `[ ${target.stdMonth} ] 운행일지를 일괄생성 하시겠습니까? (이미 등록된 운행일지가 존재할 경우 해당일자는 생략됩니다)`,
      okText: '예',
      cancelText: '아니오',
      width: 750,
      onOk: () => batch(),
    });
  };

  const batch = async () => {
    if (!target) return;
    if (draft.mileage == null || draft.mileage === 0) { message.warning('주행거리는 필수입력 항목입니다'); return; }
    if (num(draft.bizMileage) !== 0) {
      if (!draft.destination) { message.warning('일반업무용은 행선지가 필수입력 항목입니다'); return; }
      if (!draft.reason) { message.warning('일반업무용은 목적이 필수입력 항목입니다'); return; }
    }
    try {
      await carApi.batchJournals({ infoId: target.infoId, stdMonth: target.stdMonth, ...draft });
      onDone();
      onClose();
    } catch (err) {
      message.warning(errorMessage(err, '일괄생성 실패'));
    }
  };

  return (
    <Modal
      open={target != null}
      title="전용차량 운행일지(일괄등록)"
      width={780}
      maskClosable={false}
      destroyOnHidden
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="generate" onClick={batchCheck}>생성</Button>
            {/* [E2] closeButton[취소].Select (L93) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      {/* [E0] 화면 열림 (생성자 L67-84) → settings(), show() */}
      <div style={{ padding: '12px 2px 0' }}>
        <Row>
          <Cell label="일일 주행거리" width={330} unit>{km('mileage')}</Cell>
          <div style={{ width: 20 }} />
          <Cell label="비업무용 사용거리" width={330} unit>{km('unBizMileage')}</Cell>
        </Row>
        <Row>
          <Cell label="(출퇴근용)" width={330} unit>{km('commuteMileage')}</Cell>
          <div style={{ width: 20 }} />
          <Cell label="(일반업무용)" width={330} unit>{km('bizMileage')}</Cell>
        </Row>
        <Row>
          <Cell label="행선지" width={680}>
            <Input value={draft.destination ?? ''} onChange={e => setDraft(prev => ({ ...prev, destination: e.target.value }))} onBlur={() => setDraft(prev => calculation(prev))} />
          </Cell>
        </Row>
        <Row>
          <Cell label="목적" width={680}>
            <Input value={draft.reason ?? ''} onChange={e => setDraft(prev => ({ ...prev, reason: e.target.value }))} onBlur={() => setDraft(prev => calculation(prev))} />
          </Cell>
        </Row>
      </div>
    </Modal>
  );
};
