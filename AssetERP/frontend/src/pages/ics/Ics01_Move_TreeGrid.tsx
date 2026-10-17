/**
 * 법규분류 이동 창 (E01) — Ics01_Tab_ClassTree 트리의 [이동]에서 연다.
 * AS-IS: myApp/client/vi/ics/Ics01_Move_TreeGrid.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L74-115: 모달 "이동시킬 상위 법규관리를 선택하세요.", GXT Tree(분류명 420×350), 아래 가운데 [확인][닫기]. 트리는 Ics01_Move_Grid와 같이 쓰는 ics01Tree.tsx
 */
import React, { useState } from 'react';
import { message, Modal, Space } from 'antd';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { ClassTreeNode } from '@/types/ics';
import { Button } from '@/components/button';
import { ClassTreePicker } from './ics01Tree';

interface Props {
  /** open(treeGrid, classTreeModel) L74-115 — 값이 있으면 열린다 */
  classTreeModel: ClassTreeNode | null;
  /** moveTree() 뒤: 옮긴 분류와 새 상위 */
  onMoved: (moved: ClassTreeNode, target: ClassTreeNode) => void;
  onClose: () => void;
}

export const Ics01_Move_TreeGrid: React.FC<Props> = ({ classTreeModel, onMoved, onClose }) => {
  const [target, setTarget] = useState<ClassTreeNode | null>(null);

  // [E1] okButton[확인].Select (L97) → moveTree() L117-141: 선택한 분류가 없으면 아무 일도 없다.
  //   parentTreeId를 바꿔 ics.Ics01_ClassTree.update → 이전 트리에서 빼고 새 상위 밑에 넣고 펼침 → hide()
  const moveTree = async () => {
    if (!classTreeModel || !target) return;
    try {
      await icsApi.moveClassTree(classTreeModel.classTreeId, target.classTreeId);
      onMoved(classTreeModel, target);
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '이동 실패'));
    }
  };

  return (
    <Modal
      open={!!classTreeModel}
      title="이동시킬 상위 법규관리를 선택하세요."
      width={460}
      maskClosable={false}
      onCancel={onClose}
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
      <ClassTreePicker open={!!classTreeModel} selected={target?.classTreeId ?? null} onSelect={setTarget} />
    </Modal>
  );
};
