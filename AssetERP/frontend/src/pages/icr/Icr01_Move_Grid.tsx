/**
 * 내규 이동 창 (H09) — Icr01_Grid_IcrType 그리드의 [이동]에서 연다.
 * AS-IS: myApp/client/vi/icr/Icr01_Move_Grid.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L77-118: 모달 "이동시킬 상위 내규관리를 선택하세요.", GXT Tree(분류명 420×350), 아래 가운데 [확인][닫기]. 트리는 Icr01_Move_TreeGrid와 같이 쓰는 icr01Tree.tsx
 */
import React, { useState } from 'react';
import { message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { icrApi } from '@/api/icr';
import { errorMessage } from '@/api/client';
import { IcrClassTreeNode, IcrRule } from '@/types/icr';
import { Button } from '@/components/button';
import { ClassTreePicker } from './icr01Tree';

interface Props {
  /** open(grid, classTreeModel, callback) L77-118 — 값이 있으면 열린다 */
  rule: IcrRule | null;
  /** callback.execute(): 부른 쪽이 내규를 다시 조회한다 */
  onMoved: () => void;
  onClose: () => void;
}

export const Icr01_Move_Grid: React.FC<Props> = ({ rule, onMoved, onClose }) => {
  const [target, setTarget] = useState<IcrClassTreeNode | null>(null);

  // [E1] okButton[확인].Select (L100) → moveTree() L120-135: 선택한 분류가 없으면 아무 일도 없다.
  //   parentTreeId를 바꿔 icr.Icr01_ClassTree.update → callback.execute() → hide()
  const moveTree = async () => {
    if (!rule || !target) return;
    try {
      await icrApi.moveRule(rule.classTreeId, target.classTreeId);
      onMoved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '이동 실패'));
    }
  };

  return (
    <LookupModal
      open={!!rule}
      title="이동시킬 상위 내규관리를 선택하세요."
      width={460}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={moveTree}>확인</Button>
            {/* [E2] closeButton[닫기].Select (L108) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <ClassTreePicker open={!!rule} selected={target?.classTreeId ?? null} onSelect={setTarget} />
    </LookupModal>
  );
};
