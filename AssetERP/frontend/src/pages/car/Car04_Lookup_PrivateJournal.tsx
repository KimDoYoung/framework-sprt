/**
 * 전용차량 운행일지 편집창 (T11) — Car04_Tab_PrivateJournal·Car04_Tab_PrivateJournalAdmin이 연다 (등록 = insert, 변경 = edit)
 * AS-IS: myApp/client/vi/car/Car04_Lookup_PrivateJournal.java (488줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L95-112: 모달 780×450 "전용차량 운행일지", 아래 가운데 [저장][닫기]. getEditor() L376-442: 라벨 폭 150, 줄 6개(사용일자·업무용 / 주행 전 · 출퇴근 / 주행 후 · 일반업무용 / 비업무용 / 주행거리 / 행선지 / 목적)
 * EditModal 규격(11 §4a). 확인(저장) 뒤 callback에 모델을 주고 닫는다 — 저장은 부르는 쪽(Tab.update())이 한다
 */
import React, { useEffect, useRef, useState } from 'react';
import { DatePicker, Input, InputNumber, message, Modal, Space } from 'antd';
import dayjs from 'dayjs';
import { carApi } from '@/api/car';
import { errorMessage } from '@/api/client';
import { CarJournal } from '@/types/car';
import { Button } from '@/components/button';

const FORMAT = 'YYYY-MM-DD';
/** NumberFormat "###,###,###" */
const fmtLong = (v: string | number | undefined) => (v == null || v === '' ? '' : `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
const parseNum = (v: string | undefined) => (v ?? '').replace(/,/g, '');
const num = (v: number | null | undefined) => v ?? 0;

/** 칸 하나: 라벨(폭 150) + 입력 + 뒤 글자(km) */
const Cell: React.FC<{ label: string; width: number; unit?: boolean; children: React.ReactNode }> = ({ label, width, unit, children }) => (
  <div style={{ width, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
    <label style={{ width: 150, flexShrink: 0, textAlign: 'right', paddingRight: 10 }}>{label}</label>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    {unit && <span style={{ width: 50, paddingLeft: 5 }}>km</span>}
  </div>
);

const Row: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', margin: '0 10px 20px 10px' }}>{children}</div>
);

export type PrivateJournalTarget =
  /** insert(infoId, cb) L70-83: 새 모델(로그인 회사·사원, 확정·마감 false) */
  | { mode: 'insert'; infoId: number; personId: number }
  /** edit(selectModel, cb) L85-93: 사용일자는 고칠 수 없다 */
  | { mode: 'edit'; row: CarJournal };

interface Props {
  /** 값이 있으면 열림 */
  target: PrivateJournalTarget | null;
  /** callback.execute(updateModel) — 저장 단추를 눌렀을 때 입력값(주행 전·후 계기판 포함, 부르는 쪽이 저장) */
  onResult: (row: CarJournal) => void;
  onClose: () => void;
}

export const Car04_Lookup_PrivateJournal: React.FC<Props> = ({ target, onResult, onClose }) => {
  const [draft, setDraft] = useState<CarJournal>({});
  /** updateButton.setEnabled — 사용일자 검사에서 막히면 false */
  const [saveEnabled, setSaveEnabled] = useState(true);
  const checkSeq = useRef(0);

  // insert()·edit(): 열릴 때마다 모델을 새로 만든다
  useEffect(() => {
    if (!target) return;
    setSaveEnabled(true);
    setDraft(target.mode === 'insert'
      ? { infoId: target.infoId, personId: target.personId, fixYn: false, closeYn: false }
      : { ...target.row });
  }, [target]);

  // calculation() L327-374: 업무용 = 출퇴근 + 일반업무, 주행거리 = 업무용 + 비업무, 주행 후 = 주행 전 + 주행거리
  const calculate = (d: CarJournal): CarJournal => ({
    ...d,
    businessMileage: num(d.commuteMileage) + num(d.bizMileage),
    mileage: num(d.commuteMileage) + num(d.bizMileage) + num(d.unBizMileage),
    afterMileage: num(d.beforeMileage) + num(d.commuteMileage) + num(d.bizMileage) + num(d.unBizMileage),
  });
  /** [E4]~[E6] commuteMileage·bizMileage·unBizMileage.KeyUp (L192-209) → calculation() */
  const setKm = (key: 'commuteMileage' | 'bizMileage' | 'unBizMileage', v: number | null) => setDraft(prev => calculate({ ...prev, [key]: v }));

  // [E3] date[사용일자⁽¹⁾].ValueChange (L141) → checkCloseYn() L212-231 → checkFixYn → checkJournal → checkDate → getBeforeMileage L303-325
  const onDateChange = async (date: string | null) => {
    const my = ++checkSeq.current;
    setDraft(prev => ({ ...prev, date }));
    if (!date || draft.infoId == null) return;
    try {
      const res = await carApi.checkJournalDate({ infoId: draft.infoId, date });
      if (my !== checkSeq.current) return;
      if (res.message) {
        setSaveEnabled(false);
        message.warning(res.message);
        return;
      }
      setSaveEnabled(true);
      // 가져온 값이 있으면 계산, 없으면(0) 주행 전만 0
      setDraft(prev => (res.beforeMileage != null && res.beforeMileage !== 0 ? calculate({ ...prev, beforeMileage: res.beforeMileage }) : { ...prev, beforeMileage: res.beforeMileage ?? 0 }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E1] updateButton[저장].Select (L115) → update() L444-471: 필수 검사 뒤 callback.execute(model), hide()
  const update = () => {
    if (!draft.date) { message.warning('사용일자는 필수선택 항목입니다'); return; }
    if (draft.mileage == null || draft.mileage === 0) { message.warning('주행거리는 필수입력 항목입니다'); return; }
    if (draft.afterMileage == null) { message.warning('주행 후 계기판은 필수입력 항목입니다'); return; }
    if (num(draft.bizMileage) !== 0) {
      if (!draft.destination) { message.warning('일반업무용은 행선지가 필수입력 항목입니다'); return; }
      if (!draft.reason) { message.warning('일반업무용은 목적이 필수입력 항목입니다'); return; }
    }
    onResult(draft);
  };

  const km = (value: number | null | undefined, disabled: boolean, onChange?: (v: number | null) => void) => (
    <InputNumber style={{ width: '100%' }} controls={false} precision={0} formatter={fmtLong} parser={parseNum as never}
      disabled={disabled} value={value ?? null} onChange={v => onChange?.(v == null ? null : Number(v))} />
  );

  return (
    <Modal
      open={target != null}
      title="전용차량 운행일지"
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
            <Button type="save" disabled={!saveEnabled} onClick={update}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L121) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {/* [E0] 화면 열림 (생성자 L95-112) → settings(), show() */}
      <div style={{ padding: '12px 2px 0' }}>
        <Row>
          <Cell label="사용일자⁽¹⁾" width={330}>
            <DatePicker style={{ width: '100%' }} format={FORMAT} disabled={target?.mode === 'edit'} allowClear={false}
              value={draft.date ? dayjs(draft.date) : null} onChange={(_, s) => void onDateChange((s as string) || null)} />
          </Cell>
          <div style={{ width: 20 }} />
          <Cell label="업무용  사용거리" width={330} unit>{km(draft.businessMileage, true)}</Cell>
        </Row>
        <Row>
          <Cell label="주행 전 계기판" width={330} unit>{km(draft.beforeMileage, true)}</Cell>
          <div style={{ width: 20 }} />
          <Cell label="(출퇴근용)⁽²⁾" width={330} unit>{km(draft.commuteMileage, false, v => setKm('commuteMileage', v))}</Cell>
        </Row>
        <Row>
          <Cell label="주행 후 계기판" width={330} unit>{km(draft.afterMileage, true)}</Cell>
          <div style={{ width: 20 }} />
          <Cell label="(일반업무용)⁽³⁾" width={330} unit>{km(draft.bizMileage, false, v => setKm('bizMileage', v))}</Cell>
        </Row>
        <Row>
          <div style={{ width: 350 }} />
          <Cell label="비업무용 사용거리⁽⁴⁾" width={330} unit>{km(draft.unBizMileage, false, v => setKm('unBizMileage', v))}</Cell>
        </Row>
        <Row>
          <div style={{ width: 350 }} />
          <Cell label="주행거리" width={330} unit>{km(draft.mileage, true)}</Cell>
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
      </div>
    </Modal>
  );
};
