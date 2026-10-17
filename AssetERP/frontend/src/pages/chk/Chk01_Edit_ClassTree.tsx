/**
 * 분류 편집 창 (E06) — Chk01_Tab_ClassTree의 수정 칸·상위분류 등록·하위분류 등록에서 연다
 * AS-IS: myApp/client/vi/chk/Chk01_Edit_ClassTree.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * edit() L66-87·insert() L89-110: 모달 600×350 "분류 수정"/"분류 신규등록", setForm() L160-232: 라벨 폭 80, 분류명·비고(높이 100)·순서/사용여부·매뉴링크, 아래 가운데 삭제·저장·닫기
 */
import React, { useEffect, useState } from 'react';
import { Input, InputNumber, message, Modal, Select, Space, Typography } from 'antd';
import { chkApi } from '@/api/chk';
import { errorMessage } from '@/api/client';
import { ChkClassTree } from '@/types/chk';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { useLoginUser } from '@/hooks/useLoginUser';

/** 열 때 받는 값: classTreeId가 없으면 새 분류(상위 분류만 정해져 있다) */
export type ChkClassTreeEdit = Pick<ChkClassTree, 'parentTreeId'> & Partial<Omit<ChkClassTree, 'parentTreeId' | 'depth'>>;

interface Props {
  /** 편집할 분류 — null이면 닫힘 */
  model: ChkClassTreeEdit | null;
  onClose: () => void;
  /** AS-IS callback.execute(모델): 저장 → 저장한 분류 ID, 삭제 → 부모 분류 ID(없으면 undefined) */
  onDone: (classTreeId: number | undefined) => void;
}

/** 라벨 폭 80 (form.setLabelWidth(80)) */
const Field: React.FC<{ label: string; width?: number | string; children: React.ReactNode }> = ({ label, width = '100%', children }) => (
  <div style={{ display: 'flex', alignItems: 'center', width }}>
    <Typography.Text style={{ width: 80, flex: 'none' }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

/** GXT TextField 빈 값 = null */
const n = (s: string | null | undefined) => (s == null || s === '' ? null : s);

export const Chk01_Edit_ClassTree: React.FC<Props> = ({ model, onClose, onDone }) => {
  const user = useLoginUser();
  const [f, setF] = useState<ChkClassTreeEdit | null>(model);
  const [saving, setSaving] = useState(false);
  useEffect(() => setF(model), [model]);
  if (!f) return null;
  const set = <K extends keyof ChkClassTreeEdit>(k: K, v: ChkClassTreeEdit[K]) => setF(prev => prev && { ...prev, [k]: v });
  const isNew = f.classTreeId == null;
  // setForm() L160-232: 관리자 회사가 아니거나 하위 분류면 매뉴링크를 못 고친다
  const linkDisabled = user.companyId !== 0 || f.parentTreeId !== 0;

  // [E5] updateButton[저장].Select (L198) → update() L112-124: 회사 = 로그인 회사 → chk.Chk01_ClassTree.update → 닫고 callback(저장한 모델)
  const update = async () => {
    setSaving(true);
    try {
      const req = { parentTreeId: f.parentTreeId, classTreeName: n(f.classTreeName), seq: f.seq ?? null, useYn: f.useYn ?? 'true', note: n(f.note), linkCode: n(f.linkCode) };
      const saved = isNew ? await chkApi.createClassTree(req) : await chkApi.updateClassTree(f.classTreeId!, req);
      onClose();
      onDone(saved.classTreeId);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // [E4] deleteButton[삭제].Select (L192) → deleteChk() L126-144: "삭제"/"선택한 분류를 삭제하시겠습니까?"(폭 300)
  const deleteChk = () => Modal.confirm({
    title: '삭제',
    content: '선택한 분류를 삭제하시겠습니까?',
    okText: '예',
    cancelText: '아니오',
    width: 300,
    // [E1] msgBox.DialogHide [YES] (L129) → delete()
    onOk: remove,
  });

  // delete() L146-158: chk.Chk01_ClassTree.delete → 닫고 callback(부모 분류). 저장 안 한 새 분류는 원본도 0건 삭제 → 서버를 부르지 않는다(결과 같음)
  const remove = async () => {
    try {
      if (!isNew) await chkApi.deleteClassTree(f.classTreeId!);
      onClose();
      onDone(f.parentTreeId || undefined);
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  return (
    <Modal
      open
      title={isNew ? '분류 신규등록' : '분류 수정'}
      width={600}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="delete" onClick={deleteChk}>삭제</Button>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            {/* [E6] closeButton[닫기].Select (L204) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 2px 2px' }}>
        <Field label="분류명"><Input value={f.classTreeName ?? ''} onChange={e => set('classTreeName', e.target.value)} /></Field>
        <Field label="비고"><Input.TextArea rows={4} value={f.note ?? ''} onChange={e => set('note', e.target.value)} /></Field>
        <Space size={0}>
          <Field label="순서" width={200}>
            <InputNumber style={{ width: '100%' }} precision={0} value={f.seq ?? null} onChange={v => set('seq', v == null ? null : Number(v))} />
          </Field>
          <div style={{ width: 160 }} />
          <Field label="사용여부" width={200}>
            {/* [E3] useYn[사용여부].Collapse (L182) → useYn = 사용이면 true */}
            <Select style={{ width: '100%' }} value={f.useYn === 'true' ? '사용' : '미사용'} options={[{ value: '사용' }, { value: '미사용' }]}
              onChange={v => set('useYn', String(v === '사용'))} />
          </Field>
        </Space>
        <Field label="매뉴링크">
          {/* [E2] linkName[매뉴링크].Collapse (L170) → linkCode = 고른 코드("(선택안함)"은 비움) */}
          <SystemCodeComboBox kindCd="ChkLinkCode" altCode={['', '(선택안함)']} style={{ width: 400 }} placeholder="선택" disabled={linkDisabled}
            value={f.linkCode ?? ''} onChange={v => set('linkCode', v ? v : null)} />
        </Field>
      </div>
    </Modal>
  );
};
