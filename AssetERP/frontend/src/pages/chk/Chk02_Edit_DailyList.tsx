/**
 * 일일점검내역 편집 창 (E07) — Chk02_Tab_DailyListAdmin의 등록 버튼·수정 칸에서 연다
 * AS-IS: myApp/client/vi/chk/Chk02_Edit_DailyList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * edit() L72-96: 모달 "일일점검내역 생성/수정", getEditor() L130-173: 라벨 폭 105, 분류 · 내용(높이 170) · 설명(높이 170) · CutOff/화면번호 · 조회순서/사용여부, 아래 가운데 저장·닫기
 * (open() L98-124 읽기 전용 모드는 이 화면에서 안 쓴다)
 */
import React, { useEffect, useState } from 'react';
import { Input, InputNumber, message, Modal, Select, Space, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { chkApi } from '@/api/chk';
import { errorMessage } from '@/api/client';
import { ChkDailyList } from '@/types/chk';
import { Button } from '@/components/button';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Chk01_Lookup_ClassTree } from './Chk01_Lookup_ClassTree';

/** 열 때 받는 값: dailyListId가 없으면 새 점검내역(회사·사용 true만 정해져 있다) */
export type ChkDailyListEdit = Partial<ChkDailyList>;

interface Props {
  /** 편집할 점검내역 — null이면 닫힘 */
  model: ChkDailyListEdit | null;
  /** classTreeModel.getClassTreeId(): 분류 조회창이 보여 줄 기준 분류 */
  baseClassTreeId: number | null | undefined;
  onClose: () => void;
  /** AS-IS callbackResult.execute(updateModel): 저장한 행 */
  onDone: (saved: ChkDailyList) => void;
}

/** 라벨 폭 105 (form.setLabelWidth(105)) */
const Field: React.FC<{ label: string; width?: number | string; children: React.ReactNode }> = ({ label, width = '100%', children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', width }}>
    <Typography.Text style={{ width: 105, flex: 'none', lineHeight: '32px' }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

/** GXT TextField/TextArea 빈 값 = null */
const n = (s: string | null | undefined) => (s == null || s === '' ? null : s);

export const Chk02_Edit_DailyList: React.FC<Props> = ({ model, baseClassTreeId, onClose, onDone }) => {
  const user = useLoginUser();
  const [f, setF] = useState<ChkDailyListEdit | null>(model);
  const [saving, setSaving] = useState(false);
  const [lookupOpen, setLookupOpen] = useState(false);
  useEffect(() => setF(model), [model]);
  if (!f) return null;
  const set = <K extends keyof ChkDailyListEdit>(k: K, v: ChkDailyListEdit[K]) => setF(prev => prev && { ...prev, [k]: v });
  const isNew = f.dailyListId == null;
  // [E0] 화면 열림 (생성자 L126-173) → settings(), show()
  // edit() L72-96: 관리자 점검내역을 고객사가 열면 분류·내용·설명을 못 고친다
  const locked = !!f.adminYn && user.companyId !== 0;

  // [E3] updateButton[저장].Select (L221) → update() L241-270
  const update = async () => {
    if (f.classTreeId == null) return message.warning('분류는 필수선택 항목입니다');
    if (n(f.content) == null) return message.warning('체크대상은 필수입력 항목입니다');
    setSaving(true);
    try {
      const req = { classTreeId: f.classTreeId, content: n(f.content), explan: n(f.explan), cutoff: n(f.cutoff), windowNo: n(f.windowNo),
        seq: f.seq ?? null, useYn: f.useYn ?? 'true' };
      const saved = isNew ? await chkApi.createDailyList(req) : await chkApi.updateDailyList(f.dailyListId!, req);
      onClose();
      onDone(saved);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      title="일일점검내역 생성/수정"
      width={800}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            {/* [E4] closeButton[닫기].Select [callback == null] (L227) → 원래 행을 결과로 주고 hide() — 바뀐 것이 없으니 닫기만 */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px 2px' }}>
        <Field label="분류">
          {/* [E2] classTreeName[분류].TriggerClick (L191) → Chk01_Lookup_ClassTree.edit(): 결과가 있으면 classTreeId·이름을 바꾼다 */}
          <Input readOnly disabled={locked} value={f.classTreeName ?? ''} suffix={<SearchOutlined />} style={{ cursor: locked ? 'default' : 'pointer' }}
            onClick={() => !locked && setLookupOpen(true)} />
        </Field>
        <Field label="내용"><Input.TextArea rows={7} disabled={locked} value={f.content ?? ''} onChange={e => set('content', e.target.value)} /></Field>
        <Field label="설명"><Input.TextArea rows={7} disabled={locked} value={f.explan ?? ''} onChange={e => set('explan', e.target.value)} /></Field>
        <Space size={0}>
          <Field label="CutOff" width={365}><Input value={f.cutoff ?? ''} onChange={e => set('cutoff', e.target.value)} /></Field>
          <Field label="화면번호" width={365}><Input value={f.windowNo ?? ''} onChange={e => set('windowNo', e.target.value)} /></Field>
        </Space>
        <Space size={0}>
          <Field label="조회순서" width={365}>
            <InputNumber style={{ width: '100%' }} precision={0} value={f.seq ?? null} onChange={v => set('seq', v == null ? null : Number(v))} />
          </Field>
          <Field label="사용여부" width={365}>
            {/* [E1] useYn[사용여부].Collapse (L181) → useYn = 사용이면 true */}
            <Select style={{ width: '100%' }} value={f.useYn === 'false' ? '미사용' : '사용'} options={[{ value: '사용' }, { value: '미사용' }]}
              onChange={v => set('useYn', String(v === '사용'))} />
          </Field>
        </Space>
      </div>
      <Chk01_Lookup_ClassTree open={lookupOpen} mode="edit" classTreeId={baseClassTreeId}
        onResult={node => { if (node) { setF(prev => prev && { ...prev, classTreeId: node.classTreeId, classTreeName: node.classTreeName }); } }}
        onClose={() => setLookupOpen(false)} />
    </Modal>
  );
};
