/**
 * 일일업무보고 등록/수정 창 (Z08) — Rpt01_Tab_DailyWrite의 [등록]·수정 칸에서 연다
 * AS-IS: myApp/client/vi/rpt/Rpt01_Edit_DailyWrite.java (176줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * insert() L48-56: "일일업무보고 등록", 일자 오늘 / edit() L58-75: "일일업무보고 수정", 확인처리된 글이면 일자·업무내용 칸 잠금
 * 생성자 L78-114: 700×500, 라벨 폭 75, 일자 · 업무내용(높이 230) · 비고(높이 150), 아래 가운데 저장·닫기
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, message, Modal, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { rptDailyApi } from '@/api/rpt';
import { errorMessage } from '@/api/client';
import { RptDaily } from '@/types/rpt';
import { Button } from '@/components/button';

const DATE = 'YYYY-MM-DD';

/** 열 때 받는 값: dailyId가 없으면 새 글(일자 오늘) */
export type RptDailyEdit = Partial<RptDaily>;

interface Props {
  /** 편집할 글 — null이면 닫힘 */
  model: RptDailyEdit | null;
  onClose: () => void;
  /** AS-IS callback.execute() → retrieve() (저장한 뒤. 창은 닫히지 않는다) */
  onDone?: () => void;
}

/** 라벨 폭 75 (form.setLabelWidth(75)) */
const Field: React.FC<{ label: string; width?: number | string; children: React.ReactNode }> = ({ label, width = '100%', children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', width }}>
    <Typography.Text style={{ width: 75, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10 }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

/** GXT TextArea 빈 값 = null */
const n = (s: string | null | undefined) => (s == null || s === '' ? null : s);

export const Rpt01_Edit_DailyWrite: React.FC<Props> = ({ model, onClose, onDone }) => {
  const [f, setF] = useState<RptDailyEdit | null>(model);
  const [saving, setSaving] = useState(false);
  useEffect(() => setF(model), [model]);
  if (!f) return null;
  const set = <K extends keyof RptDailyEdit>(k: K, v: RptDailyEdit[K]) => setF(prev => prev && { ...prev, [k]: v });
  const isNew = f.dailyId == null;
  // edit() L63-71: 확인처리된 글이면 일자·업무내용을 못 고친다
  const locked = f.confirmYn === true;

  // [E1] updateButton[저장].Select (L118) → update() L133-166
  const update = async () => {
    if (!f.date) return message.warning('일자는 필수작성 항목입니다');
    if (n(f.content) == null) return message.warning('업무내용은 필수작성 항목입니다');
    setSaving(true);
    try {
      const saved = await rptDailyApi.save({ dailyId: f.dailyId ?? null, date: f.date, content: f.content!, note: n(f.note) });
      // 저장 뒤 hide()는 주석 처리 — 창은 그대로 열려 있고 받은 ID를 모델에 채워 다음 저장은 수정이 된다 (이상한점 #183)
      setF(prev => prev && { ...prev, dailyId: saved.dailyId, personId: saved.personId });
      message.success('저장이 완료되었습니다.');
      onDone?.();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      title={isNew ? '일일업무보고 등록' : '일일업무보고 수정'}
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
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L124) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {/* [E0] 화면 열림 (생성자 L78-114) → settings(), show() */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        <Field label="일자" width={200}>
          <DatePicker style={{ width: '100%' }} allowClear={false} disabled={locked} value={f.date ? dayjs(f.date) : null} onChange={d => set('date', d ? d.format(DATE) : null)} />
        </Field>
        <Field label="업무내용"><Input.TextArea rows={9} disabled={locked} value={f.content ?? ''} onChange={e => set('content', e.target.value)} /></Field>
        <Field label="비고"><Input.TextArea rows={5} value={f.note ?? ''} onChange={e => set('note', e.target.value)} /></Field>
      </div>
    </Modal>
  );
};
