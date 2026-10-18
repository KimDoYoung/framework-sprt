/**
 * 임원의 상당한 주의의무 선택창 (E13-2) — Tdm43_Edit_Manl의 임원의무 칸에서 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm43_Lookup_ExctDuty.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L83-148: 모달 550×420(크기 고정) "임원의 상당한 주의의무", 체크박스 6개, 아래 가운데 [선택완료][닫기]
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, Modal, Space } from 'antd';
import { Button } from '@/components/button';

/** L88-118 box01Name~box06Name */
const NAMES = [
  '1. 내부통제기준의 적정 마련 여부 점검',
  '2. 내부통제기준의 효과적 집행·운영 여부 점검',
  '3. 임직원 내부통제기준 준수 여부 점검',
  '4. 위반·미흡사항에 대한 시정·개선 조치',
  '5. 교육·훈련 지원',
  '6. 보고체계 마련',
];

interface Props {
  /** AS-IS open(exctDutyMap, callback) L36-43 — 있으면(빈 문자열 포함) 열린다. "101000"처럼 6자리 0/1 */
  exctDutyMap: string | null;
  /** callback.execute({exctDutyMap, exctDutyName}) — 이름은 첫 선택 + " 외 N", 선택이 없으면 null */
  onResult: (r: { exctDutyMap: string; exctDutyName: string | null }) => void;
  onClose: () => void;
}

export const Tdm43_Lookup_ExctDuty: React.FC<Props> = ({ exctDutyMap, onResult, onClose }) => {
  const [checked, setChecked] = useState<boolean[]>(NAMES.map(() => false));

  // [E0] 화면 열림 (생성자 L83-148) → open() L36-43 → checkBox() L45-81: 지도(map)의 각 자리가 "1"이면 체크 (빈 문자열이면 건드리지 않는다)
  useEffect(() => {
    if (exctDutyMap == null) return;
    setChecked(NAMES.map((_, i) => exctDutyMap.charAt(i) === '1'));
  }, [exctDutyMap]);

  // [E1] selectButton[선택완료].Select (L120) → select() L150-234: 6자리 0/1 지도와 이름("첫 선택 외 N")을 돌려주고 닫는다
  const select = () => {
    const picked = NAMES.filter((_, i) => checked[i]);
    const map = checked.map(c => (c ? '1' : '0')).join('');
    const name = picked.length === 0 ? null : picked.length > 1 ? `${picked[0]} 외 ${picked.length - 1}` : picked[0];
    onResult({ exctDutyMap: map, exctDutyName: name });
    onClose();
  };

  return (
    <Modal
      open={exctDutyMap != null}
      title={<b>임원의 상당한 주의의무</b>}
      width={550}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={select}>선택완료</Button>
            {/* [E2] closeButton[닫기].Select (L126) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ padding: '10px 0 0 30px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {NAMES.map((n, i) => (
          <Checkbox key={n} checked={checked[i]} onChange={e => setChecked(prev => prev.map((c, j) => (j === i ? e.target.checked : c)))}>
            <b style={{ fontSize: 14 }}>{n}</b>
          </Checkbox>
        ))}
      </div>
    </Modal>
  );
};
