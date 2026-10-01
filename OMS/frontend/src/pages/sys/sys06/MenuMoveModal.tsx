import React, { useMemo, useState } from 'react';
import { Modal, Tree, message } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { sysApi } from '../../../api/sys';
import { errorMessage } from '../../../api/client';
import { MenuItem } from '../../../types/sys';

interface MenuMoveModalProps {
  /** 옮길 메뉴 */
  target?: MenuItem;
  /** 전체 메뉴 (깊이 우선 평평한 목록) */
  menus: MenuItem[];
  onClose: () => void;
  onMoved: (menuId: number) => void;
}

/** 깊이 우선 평평한 목록 → antd Tree 데이터 (화면 메뉴와 자기 자신 아래는 대상에서 뺀다) */
const toTree = (menus: MenuItem[], excludeId: number): DataNode[] => {
  const byParent = new Map<number, MenuItem[]>();
  menus.forEach(m => byParent.set(m.parentId, [...(byParent.get(m.parentId) ?? []), m]));
  const build = (parentId: number): DataNode[] =>
    (byParent.get(parentId) ?? [])
      .filter(m => m.menuId !== excludeId && !m.classNm)
      .map(m => ({ key: m.menuId, title: m.menuNm, children: build(m.menuId) }));
  return build(0);
};

/** 상위 메뉴 이동 (AS-IS Sys06_Select_Menu): 대상 상위 메뉴를 고르면 parentId만 바꿔 저장 */
export const MenuMoveModal: React.FC<MenuMoveModalProps> = ({ target, menus, onClose, onMoved }) => {
  const [selected, setSelected] = useState<number>();
  const treeData = useMemo(() => (target ? toTree(menus, target.menuId) : []), [menus, target]);

  const move = async () => {
    if (!target) return;
    if (selected == null) {
      message.warning('이동시킬 상위 메뉴를 선택하세요.');
      return;
    }
    try {
      await sysApi.updateMenuItem(target.menuId, {
        parentId: selected, menuNm: target.menuNm, classNm: target.classNm, menuNo: target.menuNo,
        seq: target.seq, useYn: target.useYn, note: target.note,
      });
      message.success('이동되었습니다.');
      onMoved(target.menuId);
    } catch (err) {
      message.error(errorMessage(err, '이동 실패'));
    }
  };

  return (
    <Modal open={!!target} title="이동시킬 상위메뉴를 선택하세요." width={460} onOk={move} onCancel={onClose}
      okText="확인" cancelText="닫기" destroyOnClose afterOpenChange={open => !open && setSelected(undefined)}>
      <div style={{ height: 350, overflow: 'auto' }}>
        <Tree treeData={treeData} onSelect={keys => setSelected(keys[0] as number | undefined)} />
      </div>
    </Modal>
  );
};
