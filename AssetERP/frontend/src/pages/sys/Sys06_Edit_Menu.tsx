/**
 * 매뉴 편집 팝업 (A09) — Sys06_Tab_Menu의 수정 칸·루트매뉴 등록·하위매뉴 등록에서 연다.
 * AS-IS: myApp/client/vi/sys/Sys06_Edit_Menu.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * editMenu() L66-86: 제목 "매뉴 편집", 550×510, 모달, 크기 고정. setForm() L134-200: 라벨 폭 90, 아래 가운데 삭제·저장·닫기
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, Input, message, Modal, Select, Space, Typography } from 'antd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { MenuSaveReq } from '@/types/sys';
import { Button } from '@/components/button';

interface Props {
  /** 편집할 매뉴(menuId 없으면 새 매뉴) — null이면 닫힘 */
  menu: MenuSaveReq | null;
  onClose: () => void;
  /** AS-IS callback.execute(모델): 저장 → 저장한 매뉴 ID, 삭제 → 부모 매뉴 ID */
  onDone: (menuId: number | undefined) => void;
}

/** 라벨 폭 90 (form.setLabelWidth(90)) */
const Field: React.FC<{ label: string; width?: number | string; children: React.ReactNode }> = ({ label, width = '100%', children }) => (
  <div style={{ display: 'flex', alignItems: 'center', width }}>
    <Typography.Text style={{ width: 90, flex: 'none' }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

/** GXT TextField 빈 값 = null */
const n = (s: string | null | undefined) => (s == null || s === '' ? null : s);

export const Sys06_Edit_Menu: React.FC<Props> = ({ menu, onClose, onDone }) => {
  const [f, setF] = useState<MenuSaveReq | null>(menu);
  const [saving, setSaving] = useState(false);
  useEffect(() => setF(menu), [menu]);
  if (!f) return null;
  const set = <K extends keyof MenuSaveReq>(k: K, v: MenuSaveReq[K]) => setF(prev => prev && { ...prev, [k]: v });
  const yn = (k: 'addTitleUseYn' | 'mobiUseYn') => (
    <Checkbox checked={f[k] === 'true'} onChange={e => set(k, String(e.target.checked))} />
  );

  // [E4] updateButton[저장].Select (L156) → update() L88-98: editDriver.flush() → sys.Sys06_Menu.update → 닫고 callback(저장한 모델)
  const update = async () => {
    setSaving(true);
    try {
      const saved = await sysApi.saveMenu({
        ...f,
        menuNm: f.menuNm, seq: n(f.seq), note: n(f.note), classNm: n(f.classNm), menualUrl: n(f.menualUrl),
        mobiClassNm: n(f.mobiClassNm), menuNo: n(f.menuNo),
      });
      onClose();
      onDone(saved.menuId);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // [E3] deleteButton[삭제].Select (L150) → deleteChk() L100-118
  const deleteChk = () => Modal.confirm({
    title: '삭제',
    content: '선택한 매뉴를 삭제하시겠습니까?',
    okText: '예',
    cancelText: '아니오',
    // [E1] msgBox.DialogHide [YES] (L103) → delete()
    onOk: remove,
  });

  // delete() L120-132: sys.Sys06_Menu.delete → 닫고 callback(부모 모델). 저장 안 한 새 매뉴는 원본도 0건 삭제 → 서버를 부르지 않는다(결과 같음)
  const remove = async () => {
    try {
      if (f.menuId) await sysApi.deleteMenu(f.menuId);
      onClose();
      onDone(f.parentId || undefined);
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  return (
    <Modal
      open
      title="매뉴 편집"
      width={550}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="delete" onClick={deleteChk}>삭제</Button>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            {/* [E5] closeButton[닫기].Select (L162) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 2px 2px' }}>
        <Field label="매뉴명"><Input value={f.menuNm ?? ''} onChange={e => set('menuNm', e.target.value)} /></Field>
        <Field label="클래스명"><Input value={f.classNm ?? ''} onChange={e => set('classNm', e.target.value)} /></Field>
        <Space size={0}>
          <Field label="화면번호" width={200}><Input value={f.menuNo ?? ''} onChange={e => set('menuNo', e.target.value)} /></Field>
          <Field label="정렬순서" width={200}><Input value={f.seq ?? ''} onChange={e => set('seq', e.target.value)} /></Field>
        </Space>
        <Space size={0}>
          <Field label="사용여부" width={200}>
            {/* [E2] useYnComboBox[사용여부].Collapse (L139) → useYn = ("사용함") */}
            <Select style={{ width: '100%' }} value={f.useYn === 'true' ? '사용함' : '사용안함'}
              options={[{ value: '사용함' }, { value: '사용안함' }]}
              onChange={v => set('useYn', String(v === '사용함'))} />
          </Field>
          <Field label="겸직사용" width={200}>{yn('addTitleUseYn')}</Field>
        </Space>
        <Field label="화면안내"><Input.TextArea rows={3} value={f.note ?? ''} onChange={e => set('note', e.target.value)} /></Field>
        <Field label="비고"><Input.TextArea rows={3} value={f.menualUrl ?? ''} onChange={e => set('menualUrl', e.target.value)} /></Field>
        <Space size={0} style={{ marginTop: 8 }}>
          <Field label="모바일사용" width={117}>{yn('mobiUseYn')}</Field>
          <Field label="클래스명" width={400}><Input value={f.mobiClassNm ?? ''} onChange={e => set('mobiClassNm', e.target.value)} /></Field>
        </Space>
      </div>
    </Modal>
  );
};
