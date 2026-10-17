/**
 * Ics01_Move_TreeGrid·Ics01_Move_Grid가 같이 쓰는 "상위 법규관리 선택" 트리 (AS-IS 두 클래스 모두 같은 GXT Tree + 확인/닫기 창).
 * 서버의 전위 순서 목록(depth)을 트리로 만든다 (AS-IS TreeUtil.makeIcsTree + addChild). 창과 확인/닫기 버튼은 각 Move_* 클래스에 있다.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { ClassTreeNode } from '@/types/ics';

/** getServiceResult() + addChild(): 전위 순서 목록 → 중첩 트리 */
export const toTree = (list: ClassTreeNode[]): DataNode[] => {
  const roots: DataNode[] = [];
  const stack: { depth: number; node: DataNode }[] = [];
  list.forEach(r => {
    const node: DataNode = { key: r.classTreeId, title: r.classTreeName ?? '', children: [] };
    const depth = r.depth ?? 1;
    while (stack.length && stack[stack.length - 1].depth >= depth) stack.pop();
    if (stack.length) stack[stack.length - 1].node.children!.push(node);
    else roots.push(node);
    stack.push({ depth, node });
  });
  return roots;
};

interface Props {
  /** 값이 true인 동안 열려 있다 — 열릴 때마다 다시 조회한다 */
  open: boolean;
  /** 고른 분류 id (없으면 null) */
  selected: number | null;
  onSelect: (target: ClassTreeNode | null) => void;
}

/** 420×350 트리. 한 번 눌러도 노드가 열리고 닫힌다(원본 Tree.onClick → super.onDoubleClick) */
export const ClassTreePicker: React.FC<Props> = ({ open, selected, onSelect }) => {
  const [rows, setRows] = useState<ClassTreeNode[]>([]);
  const [expanded, setExpanded] = useState<React.Key[]>([]);
  const treeData = useMemo(() => toTree(rows), [rows]);

  // open(): 서비스 ics.Ics01_ClassTree.selectByCompanyId(companyId, typeCode IC)
  useEffect(() => {
    if (!open) return;
    onSelect(null);
    setExpanded([]);
    icsApi.searchClassTree('IC')
      .then(setRows)
      .catch(err => message.error(errorMessage(err, '조회 오류')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div style={{ height: 350, width: 420, overflow: 'auto' }}>
      {treeData.length > 0 && (
        <Tree
          treeData={treeData}
          expandedKeys={expanded}
          onExpand={keys => setExpanded(keys)}
          selectedKeys={selected == null ? [] : [selected]}
          onSelect={(keys, info) => {
            const id = keys.length ? Number(keys[0]) : Number(info.node.key);
            onSelect(rows.find(r => r.classTreeId === id) ?? null);
            setExpanded(prev => (prev.includes(info.node.key) ? prev.filter(k => k !== info.node.key) : [...prev, info.node.key]));
          }}
        />
      )}
    </div>
  );
};
