/**
 * 문서분류 편집 창 (E16) — Dcr01_Tab_ClassTree의 수정 칸·업무등록·하위등록에서 연다
 * AS-IS: myApp/client/vi/dcr/Dcr01_Edit_ClassTree.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * editData() L82-146: 모달 440×330 (제목 = 업무등록 "루트등록"·하위등록 "하위분류 등록"·수정 "문서분류 수정"), 분류코드(250)·조회순서(150) / 분류명(400) / 상세설명(400×130),
 * 아래 가운데 삭제(수정일 때만)·저장·닫기
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Modal, Space } from 'antd';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrClassTree } from '@/types/dcr';
import { Button } from '@/components/button';
import { useLoginUser } from '@/hooks/useLoginUser';

/** 열 때 받는 값: classTreeId가 없으면 새 분류(상위 분류·관리자 여부만 정해져 있다) */
export type DcrClassTreeEdit = Pick<DcrClassTree, 'parentTreeId' | 'adminYn'> & Partial<Omit<DcrClassTree, 'parentTreeId' | 'adminYn' | 'depth'>>;

interface Props {
  /** 편집할 분류 — null이면 닫힘 */
  model: DcrClassTreeEdit | null;
  /** 창 제목 (titleName) */
  title: string;
  onClose: () => void;
  /** AS-IS callback.execute(모델): 저장 → 저장한 분류 ID, 삭제 → 부모 분류 ID(없으면 undefined) */
  onDone: (classTreeId: number | undefined) => void;
}

/** 라벨 폭 70 (form.setLabelWidth(70)) */
const Field: React.FC<{ label: string; width?: number | string; children: React.ReactNode }> = ({ label, width = '100%', children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', width }}>
    <span style={{ width: 70, flex: 'none', paddingTop: 4 }}>{label}</span>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

/** GXT TextField 빈 값 = null */
const n = (s: string | null | undefined) => (s == null || s === '' ? null : s);

export const Dcr01_Edit_ClassTree: React.FC<Props> = ({ model, title, onClose, onDone }) => {
  const user = useLoginUser();
  const [f, setF] = useState<DcrClassTreeEdit | null>(model);
  const [saving, setSaving] = useState(false);
  useEffect(() => setF(model), [model]);
  if (!f) return null;
  const set = <K extends keyof DcrClassTreeEdit>(k: K, v: DcrClassTreeEdit[K]) => setF(prev => prev && { ...prev, [k]: v });
  const isNew = f.classTreeId == null;

  // update() L178-198: 업무명·조회순서 필수 → dcr.Dcr01_ClassTree.update → 닫고 callback(저장한 모델)
  const update = async () => {
    if (!f.classTreeName) return message.warning('업무명은 필수입력 항목입니다');
    if (!f.seq) return message.warning('조회순서는 필수입력 항목입니다');
    setSaving(true);
    try {
      const req = { parentTreeId: f.parentTreeId, classTreeName: n(f.classTreeName), classTreeCode: n(f.classTreeCode), seq: n(f.seq), note: n(f.note) };
      const saved = isNew ? await dcrApi.createClassTree(req) : await dcrApi.updateClassTree(f.classTreeId!, req);
      onClose();
      onDone(saved.classTreeId);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // [E2] updateButton[저장].Select (L129) → updateCheck() L148-176: 관리자 분류(adminYn)는 관리자 회사만 — 서버 점검(dcr.Dcr01_ClassTree.updateCheck, status 1이면 update()), 그 밖의 회사는 안내. 일반 분류는 바로 update()
  const updateCheck = async () => {
    if (f.adminYn === 'true') {
      if (user.companyId === 0) {
        try {
          const check = await dcrApi.checkUpdate([{ classTreeId: f.classTreeId ?? null, classTreeCode: n(f.classTreeCode), classTreeName: n(f.classTreeName), seq: n(f.seq), note: n(f.note) }]);
          if (check.status === 1) await update();
          else message.warning(check.message ?? '');
        } catch (err) {
          message.error(errorMessage(err, '점검 실패'));
        }
      } else {
        message.warning("'Asset-ERP'에서 제공하는 문서분류는 변경불가능합니다");
      }
    } else {
      await update();
    }
  };

  // deleteAll() L269-285: dcr.Dcr01_ClassTree.deleteAll → 닫고 callback(부모 분류)
  const deleteAll = async () => {
    try {
      await dcrApi.deleteClassTree(f.classTreeId!);
      onClose();
      onDone(f.parentTreeId || undefined);
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // deleteCheck() L212-267: 하위 분류도 함께 지운다는 확인(폭 400) → [YES] [E4] msgBox.DialogHide (L215) 서버 점검(dcr.Dcr01_ClassTree.deleteCheck) → status 0이면 deleteAll()
  const deleteCheck = () => Modal.confirm({
    title: '확인',
    content: '선택된 문서분류의 하위 문서분류도 같이 삭제됩니다. 진행하시겠습니까?',
    okText: '예',
    cancelText: '아니오',
    width: 400,
    onOk: async () => {
      try {
        const check = await dcrApi.checkDelete(f.classTreeId!);
        if (check.status === 0) await deleteAll();
        else if (check.message === 'continue') message.warning('상신문서가 존재합니다. 문서이동 후 삭제하세요');
        else message.warning(`${check.message}가 존재합니다. 문서분류지정 해제후 재시도 부탁드립니다`);
      } catch (err) {
        message.error(errorMessage(err, '삭제 실패'));
      }
    },
  });

  // [E1] deleteButton[삭제].Select (L120) → adminCheck() L200-210: 관리자 분류는 관리자 회사만 지울 수 있다
  const adminCheck = () => {
    if (f.adminYn === 'true') {
      if (user.companyId === 0) deleteCheck();
      else message.warning("'Asset-ERP'에서 제공하는 문서분류는 삭제불가능합니다");
    } else {
      deleteCheck();
    }
  };

  return (
    <Modal
      open
      title={title}
      width={440}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {!isNew && <Button type="delete" onClick={adminCheck}>삭제</Button>}
            <Button type="save" onClick={updateCheck} loading={saving}>저장</Button>
            {/* [E3] closeButton[닫기].Select (L137) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '12px 2px 2px' }}>
        <Space size={0} align="start">
          <Field label="분류코드" width={250}><Input value={f.classTreeCode ?? ''} onChange={e => set('classTreeCode', e.target.value)} /></Field>
          <Field label="조회순서" width={150}><Input value={f.seq ?? ''} onChange={e => set('seq', e.target.value)} /></Field>
        </Space>
        <Field label="분류명"><Input value={f.classTreeName ?? ''} onChange={e => set('classTreeName', e.target.value)} /></Field>
        <Field label="상세설명"><Input.TextArea rows={5} value={f.note ?? ''} onChange={e => set('note', e.target.value)} /></Field>
      </div>
    </Modal>
  );
};
