/**
 * 평가자 변경 (T01) — Emp43_Tab_EvalTarget의 [평가자 변경(선택)]에서 연다
 * AS-IS: myApp/client/vi/emp/Emp43_Edit_ChangeEval.java (201줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L53-70: 모달 580×180 "평가자 변경"(X 없음), getEditor() L130-147: 라벨 폭 85, 1차 평가자(400, 파랑 0069B4) · 비중(%)(140), 2차 평가자(400, 빨강 DD5E5E) · 비중(%)(140), 아래 가운데 [변경][닫기]
 * 처음 값 settings() L72-100: 비중 1차 50 · 2차 50
 */
import React, { useEffect, useState } from 'react';
import { InputNumber, message, Modal, Space } from 'antd';
import { empEvalApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { EvalTarget, TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import dayjs from 'dayjs';

interface Props {
  /** open(evalTargetList, callback) L53 — 평가자를 바꿀 대상자들. null이면 닫힘 */
  targets: EvalTarget[] | null;
  /** callback.execute() — 변경 뒤 (목록 다시 조회) */
  onChanged: () => void;
  onClose: () => void;
}

/** 라벨 폭 85 (form.setLabelWidth(85)), 색은 setHtmlStyle */
const Field: React.FC<{ label: string; color: string; width: number; children: React.ReactNode }> = ({ label, color, width, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', width }}>
    <span style={{ width: 85, flex: 'none', textAlign: 'right', paddingRight: 10, fontWeight: 'bold', color }}>{label}</span>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

export const Emp43_Edit_ChangeEval: React.FC<Props> = ({ targets, onChanged, onClose }) => {
  const [firstName, setFirstName] = useState('');
  const [firstId, setFirstId] = useState<number | null>(null);
  const [firstWeight, setFirstWeight] = useState<number | null>(50);
  const [secondName, setSecondName] = useState('');
  const [secondId, setSecondId] = useState<number | null>(null);
  const [secondWeight, setSecondWeight] = useState<number | null>(50);
  const [lookup, setLookup] = useState<'1' | '2' | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!targets) return;
    setFirstName(''); setFirstId(null); setFirstWeight(50);
    setSecondName(''); setSecondId(null); setSecondWeight(50);
  }, [targets]);

  // [E3] firstPersonName[1차 평가자].TriggerClick (L88)·[E4] secondPersonName[2차 평가자].TriggerClick (L94) → changeEval(number) L102-128
  //   Emp00_Lookup_SelectSingle.open(true, 오늘, callback): 고르면 "조직명 성명"과 ID, [전체]는 비운다
  const changeEval = (row: TransInfo | null) => {
    const number = lookup;
    setLookup(null);
    const name = row ? `${row.orgKorNm ?? ''} ${row.korNm ?? ''}` : '';
    const id = row ? row.personId : null;
    if (number === '1') { setFirstName(name); setFirstId(id); } else { setSecondName(name); setSecondId(id); }
  };

  // [E1] updateButton[변경].Select (L76) → update() L149-192
  const update = async () => {
    if (!targets) return;
    const second = secondWeight ?? 0;
    if (firstId == null) { message.warning('1차 평가자는 필수선택항목 입니다'); return; }
    if (second > 0 && secondId == null) { message.warning('초기설정값의 합은 100(%)이어야 합니다'); return; }
    if ((firstWeight ?? 0) + second !== 100) { message.warning('초기설정값의 합은 100(%)이어야 합니다'); return; }
    setSaving(true);
    try {
      await empEvalApi.changeEvalTargetEvaluators(targets.map(t => t.evalTargetId), firstId, firstWeight ?? 0,
        second > 0 ? secondId : null, second > 0 ? second : null);
      onChanged();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '변경 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Modal
        open={targets != null}
        title="평가자 변경"
        width={640}
        closable={false}
        maskClosable={false}
        destroyOnHidden
        onCancel={onClose}
        styles={{
          header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },  // EditModal 견본: 머리말 아래 선
          footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },  // 단추 줄 위 선
        }}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="change" onClick={update} loading={saving}>변경</Button>
              {/* [E2] closeButton[닫기].Select (L82) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
          <div style={{ display: 'flex', gap: 5 }}>
            <Field label="1차 평가자" color="#0069B4" width={400}>
              <LookupInput width={300} value={firstName} onOpen={() => setLookup('1')} />
            </Field>
            <Field label="비중(%)" color="#0069B4" width={140}>
              <InputNumber style={{ width: 55 }} precision={0} controls={false} value={firstWeight} onChange={v => setFirstWeight(v == null ? null : Number(v))} />
            </Field>
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            <Field label="2차 평가자" color="#DD5E5E" width={400}>
              <LookupInput width={300} value={secondName} onOpen={() => setLookup('2')} />
            </Field>
            <Field label="비중(%)" color="#DD5E5E" width={140}>
              <InputNumber style={{ width: 55 }} precision={0} controls={false} value={secondWeight} onChange={v => setSecondWeight(v == null ? null : Number(v))} />
            </Field>
          </div>
        </div>
      </Modal>
      <Emp00_Lookup_SelectSingle open={lookup != null} separateAddTitle transDate={dayjs().format('YYYY-MM-DD')} onResult={changeEval} onClose={() => setLookup(null)} />
    </>
  );
};
