/**
 * 공용차량 운행일지 편집창 (T14) — Car04_Tab_PublicJournal의 [변경] 아이콘이 연다 (edit만)
 * AS-IS: myApp/client/vi/car/Car04_Lookup_PublicJournal.java (311줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L70-87: 모달 780×430 "공용차량 운행일지", 아래 가운데 [저장][닫기]. getEditor() L169-224: 라벨 폭 140, 줄 = 사용일자(읽기 전용)·업무용 사용거리(읽기 전용) / (출퇴근용) / (일반업무용) / 주행거리(읽기 전용)·비업무용 사용거리 / 행선지 / 목적 / 참석자(읽기 전용)
 * EditModal 규격(11 §4a). 확인(저장) 뒤 callback에 모델을 주고 닫는다 — 저장은 부르는 쪽(Tab.updateCheck())이 한다
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, InputNumber, message, Modal, Space } from 'antd';
import dayjs from 'dayjs';
import { CarPublicJournal } from '@/types/car';
import { Button } from '@/components/button';

const FORMAT = 'YYYY-MM-DD';
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

interface Props {
  /** edit(selectModel, callBack): 값이 있으면 열림 */
  target: CarPublicJournal | null;
  /** callBack.execute(updateModel) — 저장 단추를 눌렀을 때 입력값 (부르는 쪽이 저장) */
  onResult: (row: CarPublicJournal) => void;
  onClose: () => void;
}

export const Car04_Lookup_PublicJournal: React.FC<Props> = ({ target, onResult, onClose }) => {
  const [draft, setDraft] = useState<CarPublicJournal>({});

  // edit() L59-68: 열릴 때마다 선택 행으로 모델을 만든다
  useEffect(() => {
    if (target) setDraft({ ...target });
  }, [target]);

  // calculation() L226-265: 업무용 = 출퇴근 + 일반업무, 주행거리 = 업무용 + 비업무
  const calculate = (d: CarPublicJournal): CarPublicJournal => ({
    ...d,
    businessMileage: num(d.commuteMileage) + num(d.bizMileage),
    mileage: num(d.commuteMileage) + num(d.bizMileage) + num(d.unBizMileage),
  });
  /** [E3]~[E5] commuteMileage·bizMileage·unBizMileage.KeyUp (L149-166) → calculation() */
  const setKm = (key: 'commuteMileage' | 'bizMileage' | 'unBizMileage', v: number | null) => setDraft(prev => calculate({ ...prev, [key]: v }));

  // [E1] updateButton[저장].Select (L90) → update() L275-302: 필수 검사 뒤 callBack.execute(model), hide()
  const update = () => {
    if (draft.mileage == null || draft.mileage === 0) { message.warning('주행거리는 필수입력 항목입니다'); return; }
    if (!draft.destination) { message.warning('행선지는 필수입력 항목입니다'); return; }
    if (!draft.reason) { message.warning('목적은 필수입력 항목입니다'); return; }
    onResult(draft);
  };

  const km = (value: number | null | undefined, disabled: boolean, onChange?: (v: number | null) => void) => (
    <InputNumber style={{ width: '100%' }} controls={false} precision={0} formatter={fmtLong} parser={parseNum as never}
      disabled={disabled} value={value ?? null} onChange={v => onChange?.(v == null ? null : Number(v))} />
  );

  return (
    <Modal
      open={target != null}
      title="공용차량 운행일지"
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
            <Button type="save" onClick={update}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L96) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {/* [E0] 화면 열림 (생성자 L70-87) → settings(), show() */}
      <div style={{ padding: '12px 2px 0' }}>
        <Row>
          <Cell label="사용일자" width={330}>
            <DatePicker style={{ width: '100%' }} format={FORMAT} disabled allowClear={false} value={draft.date ? dayjs(draft.date) : null} />
          </Cell>
          <div style={{ width: 20 }} />
          <Cell label="업무용  사용거리" width={330} unit>{km(draft.businessMileage, true)}</Cell>
        </Row>
        <Row>
          <div style={{ width: 350 }} />
          <Cell label="(출퇴근용)" width={330} unit>{km(draft.commuteMileage, false, v => setKm('commuteMileage', v))}</Cell>
        </Row>
        <Row>
          <div style={{ width: 350 }} />
          <Cell label="(일반업무용)" width={330} unit>{km(draft.bizMileage, false, v => setKm('bizMileage', v))}</Cell>
        </Row>
        <Row>
          <Cell label="주행거리" width={330} unit>{km(draft.mileage, true)}</Cell>
          <div style={{ width: 20 }} />
          <Cell label="비업무용 사용거리" width={330} unit>{km(draft.unBizMileage, false, v => setKm('unBizMileage', v))}</Cell>
        </Row>
        <Row>
          <Cell label="행선지" width={680}>
            <Input value={draft.destination ?? ''} onChange={e => setDraft(prev => ({ ...prev, destination: e.target.value }))} />
          </Cell>
        </Row>
        <Row>
          <Cell label="목적" width={680}>
            <Input value={draft.reason ?? ''} onChange={e => setDraft(prev => ({ ...prev, reason: e.target.value }))} />
          </Cell>
        </Row>
        <Row>
          <Cell label="참석자" width={680}>
            <Input disabled value={draft.attendance ?? ''} />
          </Cell>
        </Row>
      </div>
    </Modal>
  );
};
