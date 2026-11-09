/**
 * 평가자 변경 (T01) — Emp43_Tab_EvalTarget의 [평가자 변경(선택)]에서 연다
 * AS-IS: myApp/client/vi/emp/Emp43_Edit_ChangeEval.java (201줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L53-70: 모달 580×180 "평가자 변경"(X 없음), getEditor() L130-147: 라벨 폭 85, 1차 평가자(400, 파랑 0069B4) · 비중(%)(140), 2차 평가자(400, 빨강 DD5E5E) · 비중(%)(140), 아래 가운데 [변경][닫기]
 * 처음 값 settings() L72-100: 비중 1차 50 · 2차 50
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { InputNumber, message, Space } from 'antd';
import { empEvalApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { EvalTarget, TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { EditModal, EditRow, EditField } from '@/components/form/EditForm';
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

/** 라벨 색은 setHtmlStyle (굵게) — 라벨 칸 폭은 가장 긴 라벨 '1차 평가자' 기준 85 */
const LW = 85;
const lab = (text: string, color: string) => <span style={{ fontWeight: 'bold', color }}>{text}</span>;

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
      <EditModal
        open={targets != null}
        title="평가자 변경"
        width={640}
        closable={false}
        destroyOnHidden
        onCancel={onClose}
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
        {/* 폭 540 → 592로 비례 확대(640 모달 안쪽 600 − 칸 사이 8): 400:140 → 438:154 */}
        <EditRow>
          <EditField label={lab('1차 평가자', '#0069B4')} labelWidth={LW} width={438}>
            <LookupInput width={300} value={firstName} onOpen={() => setLookup('1')} />
          </EditField>
          <EditField label={lab('비중(%)', '#0069B4')} labelWidth={LW} width={154}>
            <InputNumber style={{ width: 55 }} precision={0} controls={false} value={firstWeight} onChange={v => setFirstWeight(v == null ? null : Number(v))} />
          </EditField>
        </EditRow>
        <EditRow>
          <EditField label={lab('2차 평가자', '#DD5E5E')} labelWidth={LW} width={438}>
            <LookupInput width={300} value={secondName} onOpen={() => setLookup('2')} />
          </EditField>
          <EditField label={lab('비중(%)', '#DD5E5E')} labelWidth={LW} width={154}>
            <InputNumber style={{ width: 55 }} precision={0} controls={false} value={secondWeight} onChange={v => setSecondWeight(v == null ? null : Number(v))} />
          </EditField>
        </EditRow>
      </EditModal>
      <Emp00_Lookup_SelectSingle open={lookup != null} separateAddTitle transDate={dayjs().format('YYYY-MM-DD')} onResult={changeEval} onClose={() => setLookup(null)} />
    </>
  );
};
