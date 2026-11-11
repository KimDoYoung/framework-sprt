/**
 * 문서분류 트리 공용 부분 (E16) — Dcr01_Move_TreeGrid·Dcr01_Move_Grid·Dcr01_Lookup_DcrCopyAdmin이 같이 쓰는 GXT Tree,
 * Dcr01_Tab_ClassTree·Dcr01_Lookup_UseYn의 search() 찾기 규칙.
 */
import React, { forwardRef, memo, useEffect, useMemo, useRef, useState } from 'react';
import { message, Tree } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { FileTextOutlined, FolderOpenOutlined, FolderOutlined } from '@ant-design/icons';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrClassTree } from '@/types/dcr';

/**
 * getServiceResult() + addChild(): 전위 순서 목록(depth) → 중첩 트리 (AS-IS TreeUtil.makeDcrTree)
 * UX-18: 문서(typeCode 'T')는 단말(isLeaf) — 아이콘 함수 dcrTreeIcon이 문서 아이콘을 단다. 문서 밑에 자식이 오면 분류로 되돌린다.
 */
export const toTree = (
  list: (Pick<DcrClassTree, 'classTreeId' | 'classTreeName' | 'depth'> & { typeCode?: string | null })[],
): DataNode[] => {
  const roots: DataNode[] = [];
  const stack: { depth: number; node: DataNode }[] = [];
  list.forEach(r => {
    const isDoc = r.typeCode === 'T';
    const node: DataNode = isDoc
      ? { key: r.classTreeId, title: r.classTreeName ?? '', isLeaf: true }
      : { key: r.classTreeId, title: r.classTreeName ?? '', children: [] };
    const depth = r.depth ?? 0;
    while (stack.length && stack[stack.length - 1].depth >= depth) stack.pop();
    if (stack.length) {
      const parent = stack[stack.length - 1].node;
      if (!parent.children) { parent.children = []; delete parent.isLeaf; }
      parent.children.push(node);
    } else {
      roots.push(node);
    }
    stack.push({ depth, node });
  });
  return roots;
};

/** UX-18 문서분류 트리 아이콘: 문서(단말) = 문서, 분류 = 폴더(펼침/닫힘). `<Tree showIcon icon={dcrTreeIcon} …>` */
export const dcrTreeIcon = (p: { expanded?: boolean; isLeaf?: boolean }) =>
  p.isLeaf ? <FileTextOutlined /> : p.expanded ? <FolderOpenOutlined /> : <FolderOutlined />;

/** antd는 motion이 null·undefined면 기본 애니메이션을 쓴다. false를 주면 rc-tree가 애니메이션 단계를 건너뛴다 */
const NO_MOTION = false as unknown as TreeProps['motion'];
export type DcrTreeRef = React.ComponentRef<typeof Tree>;

/**
 * UX-19 문서분류 트리 부품 — antd Tree를 감싸 펼침·접힘을 빠르게 한다(2026-11-11, #1116에서 시험 후 전체 적용).
 * - 감싼 칸(height 100%)의 높이를 재서 `height`를 넘긴다 → 가상 스크롤로 보이는 노드만 그린다(한 회사 문서분류 약 600개).
 *   부모 칸 높이가 정해지지 않은 곳이면 내용 높이가 재어져 지금처럼 전부 그린다(깨지지 않음). `height`를 직접 주면 그 값.
 * - `motion` 끔: 하위 높이를 먼저 재고 늘였다 줄이는 애니메이션이 느렸다. 누르는 즉시 열고 닫는다.
 * - 아이콘 기본값 `showIcon` + `dcrTreeIcon`(UX-18). 그 밖의 속성(펼침·선택·체크·ref)은 antd Tree 그대로 넘긴다.
 * 쓰는 법: `<DcrTree treeData={toTree(rows)} expandedKeys={…} onExpand={…} selectedKeys={…} onSelect={…} />`
 */
export const DcrTree = memo(forwardRef<DcrTreeRef, TreeProps>((props, ref) => {
  const box = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setMeasured(el.clientHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const height = props.height ?? (measured > 0 ? measured : undefined);
  return (
    <div ref={box} style={{ height: '100%', minHeight: 0 }}>
      <Tree showIcon icon={dcrTreeIcon} motion={NO_MOTION} {...props} height={height} ref={ref} />
    </div>
  );
}));

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
        <DcrTree
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
export const ancestorKeys = (rows: Pick<DcrClassTree, 'classTreeId' | 'parentTreeId'>[], id: number): number[] => {
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
