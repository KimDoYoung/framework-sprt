/**
 * 문서분류 이동 창 (E16) — Dcr01_Tab_ClassTree 트리의 "이동" 칸(ImageCell TreeChange)에서 연다.
 * AS-IS: myApp/client/vi/dcr/Dcr01_Move_TreeGrid.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L74-115: 모달 "이동시킬 상위 문서분류를 선택하세요.", 420×350 트리(서비스 dcr.Dcr01_ClassTree.selectByCompanyId, typeCode C) + 확인·닫기
 */
import React, { useState } from 'react';
import { message, Modal, Space } from 'antd';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrClassTree } from '@/types/dcr';
import { Button } from '@/components/button';
import { DcrClassTreePicker } from './dcr01Tree';

interface Props {
  /** open(treeGrid, classTreeModel) L74 — 옮길 분류 (있으면 열린다) */
  model: { classTreeId: number } | null;
  /** 이동이 끝났을 때(AS-IS 콜백으로 옛 부모에서 지우고 새 부모 밑에 넣고 펼친다) — 화면은 다시 조회해 옮긴 분류를 고른다 */
  onMoved: (movedId: number, newParentId: number) => void;
  onClose: () => void;
}

export const Dcr01_Move_TreeGrid: React.FC<Props> = ({ model, onMoved, onClose }) => {
  const [target, setTarget] = useState<DcrClassTree | null>(null);

  // [E1] okButton[확인].Select (L97) → moveTree() L117-141: 고른 분류가 없으면 아무 일도 없다. 있으면 parentTreeId를 바꿔 dcr.Dcr01_ClassTree.update
  const moveTree = async () => {
    if (!model || !target) return;
    try {
      await dcrApi.moveClassTree(model.classTreeId, target.classTreeId);
      onMoved(model.classTreeId, target.classTreeId);
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <Modal
      open={model != null}
      title="이동시킬 상위 문서분류를 선택하세요."
      width={460}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={moveTree}>확인</Button>
            {/* [E2] closeButton[닫기].Select (L105) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <DcrClassTreePicker open={model != null} typeCode="C" selected={target?.classTreeId ?? null} onSelect={setTarget} />
    </Modal>
  );
};
