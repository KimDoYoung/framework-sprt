/**
 * 차량정보 편집 폼 (T10) — Car01_Tab_Info 아래 왼쪽(865)에 붙는 폼
 * AS-IS: myApp/client/vi/car/Car01_Edit_Info.java (172줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L91-130: 라벨 폭 150, 줄마다 여백 20, 칸 250/350/600/850(비고 높이 120), 아래 가운데 [저장](버튼줄 60)
 * 선택한 행이 없으면 폼 전체 비활성(Tab의 editForm.setEnabled)
 */
import React, { useEffect, useState } from 'react';
import { Input, InputNumber, message } from 'antd';
import { carApi } from '@/api/car';
import { errorMessage } from '@/api/client';
import { CarInfo } from '@/types/car';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

/** NumberFormat "###,###,###" (초기설정 주행거리) */
const fmtLong = (v: string | number | undefined) => (v == null || v === '' ? '' : `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
const parseNum = (v: string | undefined) => (v ?? '').replace(/,/g, '');

/** 칸 하나: 라벨(폭 150) + 입력 */
const Cell: React.FC<{ label: string; width: number; align?: 'center' | 'flex-start'; children: React.ReactNode }> = ({ label, width, align = 'center', children }) => (
  <div style={{ width, display: 'flex', alignItems: align, flexShrink: 0 }}>
    <label style={{ width: 150, flexShrink: 0, textAlign: 'right', paddingRight: 10 }}>{label}</label>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', margin: 20 }}>{children}</div>
);

interface Props {
  /** 목록에서 고른 행 (editDriver.edit(infoModel)). null이면 폼 비활성 */
  model: CarInfo | null;
  /** carTypeName.Collapse → callback(carTypeName.getCode()) — 차량구분을 바꾸면 사용자 그리드 활성을 다시 정한다 */
  onCarTypeChange: (carType: string | null) => void;
  /** update() 성공: 서버가 돌려준 행 — 부르는 쪽이 목록의 그 행을 바꾼다 */
  onSaved: (oldId: number, saved: CarInfo) => void;
}

export const Car01_Edit_Info: React.FC<Props> = ({ model, onCarTypeChange, onSaved }) => {
  // [E0] 화면 열림 (생성자 L58-89) → getEditor() L91-130
  const [draft, setDraft] = useState<CarInfo | null>(model);
  const [saving, setSaving] = useState(false);

  // retrieve(infoModel, callback) L132-140: editDriver.edit(infoModel) / null이면 initialize
  useEffect(() => { setDraft(model ? { ...model } : null); }, [model]);

  const patch = (p: Partial<CarInfo>) => setDraft(prev => (prev ? { ...prev, ...p } : prev));
  const disabled = draft == null;
  const text = (key: 'carNo' | 'carNm' | 'carInfo') => (
    <Input value={draft?.[key] ?? ''} onChange={e => patch({ [key]: e.target.value })} />
  );

  // [E1] updateButton[저장].Select (L72) → update() L142-166: 차량구분·차량번호 필수 → car.Car01_Info.update
  const update = async () => {
    if (!draft) return;
    if (!draft.carType) { message.warning('차량구분은 필수선택 항목입니다.'); return; }
    if (!draft.carNo) { message.warning('차량번호는 필수입력 항목입니다.'); return; }
    setSaving(true);
    try {
      const saved = await carApi.saveInfo(draft);
      onSaved(draft.infoId, saved);
      setDraft({ ...saved });
    } catch (err) {
      message.warning(errorMessage(err, '저장 실패'));  // new SimpleMessage("확인", serviceResult.getMessage())
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', opacity: disabled ? 0.6 : 1 }}>
      <fieldset disabled={disabled || saving} style={{ flex: 1, minHeight: 0, overflow: 'auto', border: 0, margin: 0, padding: 0 }}>
        <Row>
          <Cell label="차량구분" width={250}>
            {/* [E2] carTypeName[차량구분].Collapse (L79) → carType 값 변경 + callback(code) */}
            <SystemCodeComboBox kindCd="CarTypeCode" placeholder="선택" style={{ width: '100%' }} value={draft?.carType || undefined}
              onChange={(c, n) => { patch({ carType: c ?? null, carTypeNm: n ?? null }); onCarTypeChange(c ?? null); }} />
          </Cell>
          <Cell label="차량명" width={350}>{text('carNm')}</Cell>
          <Cell label="초기설정 주행거리" width={250}>
            <InputNumber style={{ width: '100%' }} controls={false} precision={0} formatter={fmtLong} parser={parseNum as never}
              value={draft?.initMileage ?? null} onChange={v => patch({ initMileage: v == null ? null : Number(v) })} />
          </Cell>
          <div style={{ width: 50, marginLeft: 5, display: 'flex', alignItems: 'center' }}>km</div>
        </Row>
        <Row>
          <Cell label="차량번호" width={250}>{text('carNo')}</Cell>
          <Cell label="차량정보" width={600}>{text('carInfo')}</Cell>
        </Row>
        <Row>
          <Cell label="비고" width={850} align="flex-start">
            <Input.TextArea style={{ height: 120 }} value={draft?.note ?? ''} onChange={e => patch({ note: e.target.value })} />
          </Cell>
        </Row>
      </fieldset>
      <div style={{ height: 60, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <Button type="save" disabled={disabled} onClick={update}>저장</Button>
      </div>
    </div>
  );
};
