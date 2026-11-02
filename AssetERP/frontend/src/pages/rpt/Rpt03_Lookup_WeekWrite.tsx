/**
 * 주간업무보고 등록/수정 창 (Z11) — Rpt03_Tab_WeekWrite의 [등록]·수정 칸에서 연다
 * AS-IS: myApp/client/vi/rpt/Rpt03_Lookup_WeekWrite.java (215줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * insert() L62-75: 새 글(순번 = 부른 쪽이 정함) / update() L77-85: 고른 행. 생성자 L87-126: 680×370 "주간업무보고", 라벨 폭 125,
 *   업무구분 콤보(250, "선택") + [업무구분 설정] + 굵게 · 업무내용(높이 90) · 일정(완료예정일) 350 · 비고(높이 90), 아래 가운데 저장·닫기
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Checkbox, Input, message, Modal, Select, Space, Typography } from 'antd';
import { rptWeekApi } from '@/api/rpt';
import { errorMessage } from '@/api/client';
import { RptWeek, RptWeekCode } from '@/types/rpt';
import { Button } from '@/components/button';
import { Rpt05_Lookup_WeekBizClass } from './Rpt05_Lookup_WeekBizClass';

/** 열 때 받는 값: weekId가 없으면 새 글(기간·순번은 부른 쪽이 채운다) */
export type RptWeekEdit = Partial<RptWeek>;

interface Props {
  /** 편집할 글 — null이면 닫힘 */
  model: RptWeekEdit | null;
  onClose: () => void;
  /** AS-IS callBack.execute() → retrieve() (저장한 뒤. 창이 닫힌다) */
  onDone?: () => void;
}

/** 라벨 폭 125 (form.setLabelWidth(125)) */
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
    <Typography.Text style={{ width: 125, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10 }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

/** GXT TextField/TextArea 빈 값 = null */
const n = (s: string | null | undefined) => (s == null || s === '' ? null : s);

export const Rpt03_Lookup_WeekWrite: React.FC<Props> = ({ model, onClose, onDone }) => {
  const [f, setF] = useState<RptWeekEdit | null>(model);
  const [types, setTypes] = useState<RptWeekCode[]>([]);
  const [bizOpen, setBizOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => setF(model), [model]);

  // 생성자 L96-101: 서비스 sys.Sys00_Common.selectWeekBizClass(companyId, personId, stdDate 오늘, kindCode "WeekBizType") — 내가 사용으로 정한 업무구분
  const loadTypes = useCallback(async () => {
    try {
      setTypes(await rptWeekApi.getBizTypes());
    } catch (err) {
      message.error(errorMessage(err, '업무구분 조회 실패'));
    }
  }, []);
  useEffect(() => { if (model) void loadTypes(); }, [model, loadTypes]);

  if (!f) return null;
  const set = <K extends keyof RptWeekEdit>(k: K, v: RptWeekEdit[K]) => setF(prev => prev && { ...prev, [k]: v });
  // 수정 창에서 이미 쓰는 구분이 사용 목록에 없어도 그대로 보이게 한다
  const options = types.map(t => ({ value: t.code, label: t.name }));
  if (f.bizType && !options.some(o => o.value === f.bizType)) options.push({ value: f.bizType, label: f.bizTypeName ?? f.bizType });

  // [E2] updateButton[저장].Select (L109) → update() L172-192
  const update = async () => {
    if (!f.bizType) return message.warning('업무구분을 선택해주세요');
    setSaving(true);
    try {
      await rptWeekApi.save({
        weekId: f.weekId ?? null,
        weekStartDate: f.weekStartDate!,
        weekCloseDate: f.weekCloseDate!,
        bizType: f.bizType,
        content: n(f.content),
        dueDate: n(f.dueDate),
        seq: f.seq ?? null,
        bold: f.bold === true,
        note: n(f.note),
      });
      onDone?.();  // hide(); callBack.execute()
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
      title="주간업무보고"
      width={680}
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
            {/* [E3] closeButton[닫기].Select (L115) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {/* [E0] 화면 열림 (생성자 L87-126) → show() */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        <Field label="업무구분">
          <Space size={10}>
            {/* [E4] bizTypeComboBox[업무구분].Collapse (L130) → bizType = 고른 코드 */}
            <Select style={{ width: 250 }} placeholder="선택" options={options} value={f.bizType ?? undefined} onChange={v => set('bizType', v)} />
            {/* [E1] bizTypeButton[업무구분 설정].Select (L103) → lookupBizType() L194-202: Rpt05_Lookup_WeekBizClass.open(callback → bizTypeComboBox.retrieve()) */}
            <Button type="settings" onClick={() => setBizOpen(true)}>업무구분 설정</Button>
            <Checkbox checked={f.bold === true} onChange={e => set('bold', e.target.checked)}>굵게</Checkbox>
          </Space>
        </Field>
        <Field label="업무내용"><Input.TextArea rows={4} value={f.content ?? ''} onChange={e => set('content', e.target.value)} /></Field>
        <Field label="일정(완료예정일)"><Input style={{ width: 350 }} value={f.dueDate ?? ''} onChange={e => set('dueDate', e.target.value)} /></Field>
        <Field label="비고"><Input.TextArea rows={4} value={f.note ?? ''} onChange={e => set('note', e.target.value)} /></Field>
      </div>
      <Rpt05_Lookup_WeekBizClass open={bizOpen} onSaved={() => { void loadTypes(); }} onClose={() => { setBizOpen(false); void loadTypes(); }} />
    </Modal>
  );
};
