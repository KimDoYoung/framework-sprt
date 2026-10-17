/**
 * 법규분류 등록·수정 창 (E01) — Ics01_Tab_ClassTree의 [상위등록]·[하위등록]·트리 [수정]에서 연다.
 * AS-IS: myApp/client/vi/ics/Ics01_Edit_ClassTree.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L84-103: 분류코드(250)·조회순서(150) / 분류명(400) / 수시알림(325, 읽기 전용) + [설정]. 라벨 폭 70. 창 440×250
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Modal, Space } from 'antd';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { ClassTreeNode } from '@/types/ics';
import { schApi } from '@/api/sch';
import { Button } from '@/components/button';
import { Sch03_Lookup_Ics } from '@/components/lookup/Sch03_Lookup_Ics';

export interface ClassEditTarget {
  /** editData(treeGrid, classTreeModel, actionCode, titleName, callback) L67-154 */
  actionCode: 'insert' | 'edit';
  titleName: string;
  /** 등록이면 상위(0은 루트)만 있는 새 모델 */
  classTreeModel: Partial<ClassTreeNode>;
}

interface Props {
  /** 값이 있으면 열린다 */
  target: ClassEditTarget | null;
  onClose: () => void;
  /** callback.execute(result): 저장 → 저장한 분류, 삭제 → null */
  onSaved: (model: ClassTreeNode | null) => void;
}

const LABEL_W = 70;
const Row: React.FC<{ label: string; width: number; children: React.ReactNode }> = ({ label, width, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
    <span style={{ width: LABEL_W, fontWeight: 600 }}>{label}</span>
    <div style={{ width: width - LABEL_W }}>{children}</div>
  </div>
);

export const Ics01_Edit_ClassTree: React.FC<Props> = ({ target, onClose, onSaved }) => {
  const [code, setCode] = useState('');
  const [seq, setSeq] = useState('');
  const [name, setName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [deadlineId, setDeadlineId] = useState<number | null>(null);

  // editData() L67-154: 폼에 모델 값을 채운다 (원본 이벤트 아님)
  useEffect(() => {
    if (!target) return;
    const m = target.classTreeModel;
    setCode(m.classTreeCode ?? '');
    setSeq(m.seq ?? '');
    setName(m.classTreeName ?? '');
    setDeadline(m.deadlineFullName ?? '');
  }, [target]);

  // [E4] closeButton[닫기].Select (L145) → hide()
  const hide = () => onClose();

  // [E3] updateButton[저장].Select (L137) → update() L156-169: seq = 분류코드, 회사 = 로그인 회사(서버) → ics.Ics01_ClassTree.update → hide() → callback.execute(updateData)
  const update = async () => {
    if (!target) return;
    const req = { parentTreeId: target.classTreeModel.parentTreeId, classTreeCode: code, classTreeName: name, seq: code };
    try {
      const saved = target.actionCode === 'edit' && target.classTreeModel.classTreeId != null
        ? await icsApi.updateClassTree(target.classTreeModel.classTreeId, req)
        : await icsApi.createClassTree(req);
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
      content: '해당 법규분류의 하위 분류까지 전부 삭제됩니다. 진행하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 550,
      // [E5] msgBox.DialogHide [YES] (L174) → deleteAll() L193-208
      onOk: async () => {
        const id = target?.classTreeModel.classTreeId;
        if (id == null) return;
        try {
          await icsApi.deleteClassTree(id);
          hide();
          onSaved(null);
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E1] deadlineButton[설정].Select (L106): Sch03_Lookup_Ics.open(classTreeId, "2", callback) → 닫으면 sch.Sch03_Deadline.selectDeadlineName(infoId)로 수시알림 칸을 채운다.
  // 원본은 새로 만드는 분류(id 없음)에서도 창을 열지만 기한을 걸 법규가 없어 아무것도 할 수 없다 — 분류를 먼저 저장하도록 안내한다
  const setDeadlineFullName = () => {
    const id = target?.classTreeModel.classTreeId;
    if (id == null) {
      message.warning('분류를 먼저 저장한 뒤에 설정할 수 있습니다.');
      return;
    }
    setDeadlineId(id);
  };
  const reloadDeadlineName = async () => {
    if (deadlineId == null) return;
    try {
      setDeadline(await schApi.getDeadlineName(deadlineId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  return (
    <>
    <Modal
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
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ width: LABEL_W, fontWeight: 600 }}>수시알림</span>
          <Input style={{ width: 255 }} readOnly value={deadline} />
          <span style={{ marginLeft: 5 }}><Button type="register" onClick={setDeadlineFullName}>설정</Button></span>
        </div>
      </div>
    </Modal>
      <Sch03_Lookup_Ics
        classTreeId={deadlineId}
        scheduleCode="2"
        onClosed={() => { void reloadDeadlineName(); }}
        onClose={() => setDeadlineId(null)}
      />
    </>
  );
};
