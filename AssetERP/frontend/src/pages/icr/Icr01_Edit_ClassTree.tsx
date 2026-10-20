/**
 * 내규분류 등록·수정 창 (H09) — Icr01_Tab_ClassTree의 [상위등록]·[하위등록]·트리 [수정]에서 연다.
 * AS-IS: myApp/client/vi/icr/Icr01_Edit_ClassTree.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L84-103: 분류코드(250)·조회순서(150) / 분류명(400). 라벨 폭 70. 창 440×200.
 *   수시알림(deadlineFullName)·[설정](deadlineButton) 줄은 원본에서 주석 처리돼 화면에 없다 → E1 생략
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Modal, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { icrApi } from '@/api/icr';
import { errorMessage } from '@/api/client';
import { IcrClassTreeNode } from '@/types/icr';
import { Button } from '@/components/button';

export interface IcrClassEditTarget {
  /** editData(treeGrid, classTreeModel, actionCode, titleName, callback) L67-154 */
  actionCode: 'insert' | 'edit';
  titleName: string;
  /** 등록이면 상위(0은 루트)만 있는 새 모델 */
  classTreeModel: Partial<IcrClassTreeNode>;
}

interface Props {
  /** 값이 있으면 열린다 */
  target: IcrClassEditTarget | null;
  onClose: () => void;
  /** callback.execute(result): 저장 → 저장한 분류, 삭제 → null */
  onSaved: (model: IcrClassTreeNode | null) => void;
}

const LABEL_W = 70;
const Row: React.FC<{ label: string; width: number; children: React.ReactNode }> = ({ label, width, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
    <span style={{ width: LABEL_W, fontWeight: 600 }}>{label}</span>
    <div style={{ width: width - LABEL_W }}>{children}</div>
  </div>
);

export const Icr01_Edit_ClassTree: React.FC<Props> = ({ target, onClose, onSaved }) => {
  const [code, setCode] = useState('');
  const [seq, setSeq] = useState('');
  const [name, setName] = useState('');

  // editData() L67-154: 폼에 모델 값을 채운다 (원본 이벤트 아님)
  useEffect(() => {
    if (!target) return;
    const m = target.classTreeModel;
    setCode(m.classTreeCode ?? '');
    setSeq(m.seq ?? '');
    setName(m.classTreeName ?? '');
  }, [target]);

  // [E4] closeButton[닫기].Select (L145) → hide()
  const hide = () => onClose();

  // [E3] updateButton[저장].Select (L137) → update() L156-169: seq = 분류코드, 회사 = 로그인 회사(서버) → icr.Icr01_ClassTree.update → hide() → callback.execute(updateData)
  const update = async () => {
    if (!target) return;
    const req = { parentTreeId: target.classTreeModel.parentTreeId, classTreeCode: code, classTreeName: name, seq: code };
    try {
      const saved = target.actionCode === 'edit' && target.classTreeModel.classTreeId != null
        ? await icrApi.updateClassTree(target.classTreeModel.classTreeId, req)
        : await icrApi.createClassTree(req);
      hide();
      onSaved(saved);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E2] deleteButton[삭제].Select (L128, 수정 모드만) → deleteCheck() L171-190
  const deleteCheck = () => {
    Modal.confirm({
      title: '확인',
      content: '해당 내규분류의 하위 분류까지 전부 삭제됩니다. 진행하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 550,
      // [E5] msgBox.DialogHide [YES] (L174) → deleteAll() L193-208
      onOk: async () => {
        const id = target?.classTreeModel.classTreeId;
        if (id == null) return;
        try {
          await icrApi.deleteClassTree(id);
          hide();
          onSaved(null);
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E1 생략] deadlineButton[설정].Select (L106) → Sch03_Lookup_Ics.open + sch.Sch03_Deadline.selectDeadlineName: 수시알림 줄이 원본에서 주석 처리돼(L88-90) 화면에 없다

  return (
    <LookupModal
      open={!!target}
      title={target?.titleName}
      width={480}
      maskClosable={false}
      onCancel={hide}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {target?.actionCode === 'edit' && <Button type="delete" onClick={deleteCheck}>삭제</Button>}
            <Button type="save" onClick={update}>저장</Button>
            <Button type="close" onClick={hide}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ padding: '20px 10px 0 10px' }}>
        <div style={{ display: 'flex', gap: 0 }}>
          <div style={{ width: 250 }}>
            <Row label="분류코드" width={250}><Input value={code} onChange={e => setCode(e.target.value)} /></Row>
          </div>
          <div style={{ width: 150 }}>
            <Row label="조회순서" width={150}><Input value={seq} onChange={e => setSeq(e.target.value)} /></Row>
          </div>
        </div>
        <Row label="분류명" width={400}><Input value={name} onChange={e => setName(e.target.value)} /></Row>
      </div>
    </LookupModal>
  );
};
