/**
 * 문서구분 이동 창 (E16) — Dcr01_Grid_DocType 그리드의 "이동" 칸(ImageCell TreeChange)에서 연다.
 * AS-IS: myApp/client/vi/dcr/Dcr01_Move_Grid.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L77-118: 모달 "이동시킬 상위 문서분류를 선택하세요.", 420×350 트리(서비스 dcr.Dcr01_ClassTree.selectByCompanyId, typeCode C) + 확인·닫기.
 * Dcr01_Move_TreeGrid와 같은 창 — 이동 뒤 부른 쪽이 그리드를 다시 읽는다(callback.execute())
 */
import React, { useState } from 'react';
import { message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrClassTree } from '@/types/dcr';
import { Button } from '@/components/button';
import { DcrClassTreePicker } from './dcr01Tree';

interface Props {
  /** open(grid, classTreeModel, callback) L77 — 옮길 문서구분 (있으면 열린다) */
  model: { classTreeId: number } | null;
  /** callback.execute() — moveTree() 성공 뒤 */
  onMoved: () => void;
  onClose: () => void;
}

export const Dcr01_Move_Grid: React.FC<Props> = ({ model, onMoved, onClose }) => {
  const [target, setTarget] = useState<DcrClassTree | null>(null);

  // [E1] okButton[확인].Select (L100) → moveTree() L120-135: 고른 분류가 없으면 아무 일도 없다. 있으면 parentTreeId를 바꿔 dcr.Dcr01_ClassTree.update → callback.execute(); hide()
  const moveTree = async () => {
    if (!model || !target) return;
    try {
      await dcrApi.moveClassTree(model.classTreeId, target.classTreeId);
      onMoved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <LookupModal
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
            {/* [E2] closeButton[닫기].Select (L108) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <DcrClassTreePicker open={model != null} typeCode="C" selected={target?.classTreeId ?? null} onSelect={setTarget} />
    </LookupModal>
  );
};
