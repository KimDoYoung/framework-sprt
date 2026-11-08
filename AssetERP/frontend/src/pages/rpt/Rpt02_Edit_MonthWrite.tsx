/**
 * 월간회의자료 등록/수정 창 (Z10) — Rpt02_Tab_MonthWrite의 [등록]·수정 칸에서 연다
 * AS-IS: myApp/client/vi/rpt/Rpt02_Edit_MonthWrite.java (204줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * insert() L53-72: "월간회의자료 등록", 기준 = 오늘 연·월 / edit() L74-105: "월간회의자료 수정", 내가 쓴 글이 아니면 칸을 잠그고 [저장]을 숨긴다
 * 생성자 L107-143: 700×500, 라벨 폭 75, 기준년월(연 45 + "년" + 월 콤보 60) · 업무내용(높이 230) · 비고(높이 150), 아래 가운데 저장·닫기
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Modal, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { rptMonthApi } from '@/api/rpt';
import { errorMessage } from '@/api/client';
import { RptMonth } from '@/types/rpt';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { useLoginUser } from '@/hooks/useLoginUser';

/** 열 때 받는 값: monthId가 없으면 새 글(기준 = 오늘 연·월) */
export type RptMonthEdit = Partial<RptMonth>;

interface Props {
  /** 편집할 글 — null이면 닫힘 */
  model: RptMonthEdit | null;
  onClose: () => void;
  /** AS-IS callback.execute() → retrieve() (저장한 뒤. 창이 닫힌다) */
  onDone?: () => void;
}

/** 라벨 폭 75 (form.setLabelWidth(75)) */
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
    <Typography.Text style={{ width: 75, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10 }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

/** GXT TextArea 빈 값 = null */
const n = (s: string | null | undefined) => (s == null || s === '' ? null : s);

export const Rpt02_Edit_MonthWrite: React.FC<Props> = ({ model, onClose, onDone }) => {
  const user = useLoginUser();
  const [f, setF] = useState<RptMonthEdit | null>(model);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setF(model);
    if (model) {
      const ym = model.yyyyMm ?? dayjs().format('YYYY.MM');  // insert() L61-66 / edit() L95-99
      setYear(ym.substring(0, 4));
      setMonth(ym.substring(5) || null);
    }
  }, [model]);
  if (!f) return null;
  const set = <K extends keyof RptMonthEdit>(k: K, v: RptMonthEdit[K]) => setF(prev => prev && { ...prev, [k]: v });
  const isNew = f.monthId == null;
  // edit() L79-93: 내가 쓴 글이 아니면 칸을 잠그고 [저장]을 숨긴다
  const readOnly = !isNew && user.userId !== f.personId;

  // [E1] updateButton[저장].Select (L146) → update() L161-195
  const update = async () => {
    if (!year) return message.warning('기준년도는 필수작성 항목입니다');
    if (year.length !== 4) return message.warning('기준년도를 확인하여 주십시오');
    if (!month) return message.warning('기준월은 필수선택 항목입니다');
    if (n(f.content) == null) return message.warning('업무내용은 필수작성 항목입니다');
    setSaving(true);
    try {
      await rptMonthApi.save({ monthId: f.monthId ?? null, yyyyMm: `${year}.${month}`, content: f.content!, note: n(f.note) });
      onDone?.();  // callback.execute(); hide()
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      title={isNew ? '월간회의자료 등록' : '월간회의자료 수정'}
      width={700}
      maskClosable={false}
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },  // EditModal 규격: 머리말 아래 선
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },  // 단추 줄 위 선
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {!readOnly && <Button type="save" onClick={update} loading={saving}>저장</Button>}
            {/* [E2] closeButton[닫기].Select (L152) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {/* [E0] 화면 열림 (생성자 L107-143) → settings(), show() */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        <Field label="기준년월">
          <Space size={5}>
            <Input style={{ width: 60 }} maxLength={4} disabled={readOnly} value={year} onChange={e => setYear(e.target.value)} />
            <span>년</span>
            <SystemCodeComboBox kindCd="MonthsCode" allowClear={false} disabled={readOnly} style={{ width: 80 }} value={month ?? undefined} onChange={c => setMonth(c ?? null)} />
          </Space>
        </Field>
        <Field label="업무내용"><Input.TextArea rows={9} disabled={readOnly} value={f.content ?? ''} onChange={e => set('content', e.target.value)} /></Field>
        <Field label="비고"><Input.TextArea rows={5} disabled={readOnly} value={f.note ?? ''} onChange={e => set('note', e.target.value)} /></Field>
      </div>
    </Modal>
  );
};
