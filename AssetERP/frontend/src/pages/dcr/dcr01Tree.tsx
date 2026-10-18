/**
 * 문서분류 트리 공용 부분 (E16) — Dcr01_Move_TreeGrid·Dcr01_Move_Grid·Dcr01_Lookup_DcrCopyAdmin이 같이 쓰는 GXT Tree,
 * Dcr01_Tab_ClassTree·Dcr01_Lookup_UseYn의 search() 찾기 규칙.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrClassTree } from '@/types/dcr';

/** getServiceResult() + addChild(): 전위 순서 목록(depth) → 중첩 트리 (AS-IS TreeUtil.makeDcrTree) */
export const toTree = (list: DcrClassTree[]): DataNode[] => {
  const roots: DataNode[] = [];
  const stack: { depth: number; node: DataNode }[] = [];
  list.forEach(r => {
    const node: DataNode = { key: r.classTreeId, title: r.classTreeName ?? '', children: [] };
    const depth = r.depth ?? 0;
    while (stack.length && stack[stack.length - 1].depth >= depth) stack.pop();
    if (stack.length) stack[stack.length - 1].node.children!.push(node);
    else roots.push(node);
    stack.push({ depth, node });
  });
  return roots;
};

/**
 * search() 찾기 규칙 (Dcr01_Tab_ClassTree L348-384, Dcr01_Lookup_UseYn L216-252):
 * 이름에 검색어가 든 분류를 모두 찾는다. 마지막으로 고른 것이 선택으로 남고(단일 선택), 화면 이동은 깊이가 가장 깊은(같으면 먼저 나온) 분류로 한다.
 */
export function findByName<T extends { classTreeId: number; classTreeName: string; depth?: number | null }>(rows: T[], text: string): { matches: T[]; focus: T | null } {
  const matches: T[] = [];
  let focus: T | null = null;
  rows.forEach(r => {
    if (r.classTreeName.indexOf(text) > -1) {
      matches.push(r);
      if (focus == null || (r.depth ?? 0) > (focus.depth ?? 0)) focus = r;
    }
  });
  return { matches, focus };
}

interface PickerProps {
  /** 값이 true인 동안 열려 있다 — 열릴 때마다 다시 조회한다 */
  open: boolean;
  /** 서비스 dcr.Dcr01_ClassTree.selectByCompanyId의 typeCode: 'C'(문서분류만, 이동 창)·'%'(문서구분 포함, 반영 창) */
  typeCode: string;
  /** 고른 분류 id (없으면 null) */
  selected: number | null;
  onSelect: (target: DcrClassTree | null) => void;
  width?: number | string;
  height?: number | string;
}

/** 한 번 눌러도 노드가 열리고 닫힌다(원본 Tree.onClick → super.onDoubleClick) */
export const DcrClassTreePicker: React.FC<PickerProps> = ({ open, typeCode, selected, onSelect, width = 420, height = 350 }) => {
  const [rows, setRows] = useState<DcrClassTree[]>([]);
  const [expanded, setExpanded] = useState<React.Key[]>([]);
  const treeData = useMemo(() => toTree(rows), [rows]);

  // open(): 서비스 dcr.Dcr01_ClassTree.selectByCompanyId(companyId, typeCode)
  useEffect(() => {
    if (!open) return;
    onSelect(null);
    setExpanded([]);
    dcrApi.searchClassTree(typeCode)
      .then(setRows)
      .catch(err => message.error(errorMessage(err, '매뉴조회 오류')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div style={{ height, width, overflow: 'auto' }}>
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

/** 검색 결과로 트리를 펼치고 고르기 위한 도우미: 조상 key 목록 */
export const ancestorKeys = (rows: DcrClassTree[], id: number): number[] => {
  const byId = new Map(rows.map(r => [r.classTreeId, r]));
  const out: number[] = [];
  let cur = byId.get(id);
  while (cur) {
    const p = byId.get(cur.parentTreeId);
    if (!p) break;
    out.push(p.classTreeId);
    cur = p;
  }
  return out;
};
