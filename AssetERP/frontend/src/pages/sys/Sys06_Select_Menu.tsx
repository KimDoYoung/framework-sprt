/**
 * 매뉴 이동 팝업 (A09) — Sys06_Tab_Menu의 이동 칸에서 연다.
 * AS-IS: myApp/client/vi/sys/Sys06_Select_Menu.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * open() L79-117: 제목 "이동시킬 상위매뉴를 선택하세요.", 모달, 크기 고정, 트리 420×350, 아래 가운데 확인·닫기
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message, Modal, Space, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { MenuNode } from '@/types/sys';
import { Button } from '@/components/button';

interface Props {
  /** 옮길 매뉴 — null이면 닫힘 */
  menu: MenuNode | null;
  onClose: () => void;
  /** 저장 뒤: 메인 트리를 다시 읽고 대상 노드를 펼친다 */
  onMoved: (moved: MenuNode) => void;
}

/** 전위 순서 평평한 목록 → antd Tree 데이터 (getServiceResult L163-176 + addChild L151-160) */
const toTree = (list: MenuNode[]): DataNode[] => {
  const byParent = new Map<number, MenuNode[]>();
  list.forEach(m => { if (!byParent.has(m.parentId)) byParent.set(m.parentId, []); byParent.get(m.parentId)!.push(m); });
  const build = (parentId: number): DataNode[] => (byParent.get(parentId) ?? []).map(m => {
    const children = build(m.menuId);
    return { key: m.menuId, title: m.menuNm, children, isLeaf: children.length === 0 };
  });
  return build(0);
};

export const Sys06_Select_Menu: React.FC<Props> = ({ menu, onClose, onMoved }) => {
  const [list, setList] = useState<MenuNode[]>([]);
  const [target, setTarget] = useState<number>();
  const treeData = useMemo(() => toTree(list), [list]);

  // open(): 서비스 sys.Sys06_Menu.selectByAll → 트리 구성
  useEffect(() => {
    if (!menu) return;
    setTarget(undefined);
    sysApi.getMenuTree().then(setList).catch(err => message.error(errorMessage(err, '매뉴조회 오류')));
  }, [menu]);

  if (!menu) return null;

  // [E1] okButton[확인].Select (L99) → moveTree() L120-149: 고른 노드가 없으면 아무것도 안 함, 있으면 parentId를 바꿔 sys.Sys06_Menu.update
  const moveTree = async () => {
    if (target == null) return;
    try {
      const { depth: _depth, ...rest } = menu;
      const saved = await sysApi.saveMenu({ ...rest, parentId: target });
      onClose();
      onMoved(saved);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <Modal
      open
      title="이동시킬 상위매뉴를 선택하세요."
      width={460}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={moveTree}>확인</Button>
            {/* [E2] closeButton[닫기].Select (L107) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {/* getMenuTree() L62-77: 한 번 클릭으로 노드를 연다(onClick → onDoubleClick) */}
      <Tree
        style={{ width: 420 }}
        height={350}
        treeData={treeData}
        expandAction="click"
        selectedKeys={target == null ? [] : [target]}
        onSelect={keys => setTarget(keys.length ? Number(keys[0]) : undefined)}
      />
    </Modal>
  );
};
