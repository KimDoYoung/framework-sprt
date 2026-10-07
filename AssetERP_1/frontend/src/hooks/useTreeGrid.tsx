/**
 * 트리 그리드 공통 훅 (AS-IS GridBuilder.getTreeGrid — AG Grid Community에는 treeData가 없다).
 * 서버가 전위 순서(부모 다음에 자식)의 평평한 목록을 주면, 접힌 조상이 있는 행을 외부 필터로 숨겨 트리처럼 보여 준다.
 *
 *   const tree = useTreeGrid<Menu>({ idField: 'menuId', parentField: 'parentId', depthField: 'depth' });
 *   tree.setRows(list);
 *   <SingleGrid gridRef={tree.gridRef} {...tree.gridProps} columnDefs={[tree.treeCol('menuNm', 250, '매뉴명'), …]} />
 *   버튼: tree.expandAll / tree.collapseAll, 노드: tree.toggle(id) / tree.expandAncestors(id) / tree.descendants(id) / tree.ancestors(id)
 *   권한 칸 클릭(AS-IS getColumn): tree.cascadeToggle(api, row, 'useYn') → 바꾼 행 ID
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ColDef, GridApi, IRowNode } from 'ag-grid-community';
import type { AgGridReact, CustomCellRendererProps } from 'ag-grid-react';
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';

export interface TreeGridOptions<T> {
  idField: keyof T & string;
  parentField: keyof T & string;
  depthField: keyof T & string;
}

export function useTreeGrid<T extends object>({ idField, parentField, depthField }: TreeGridOptions<T>) {
  const gridRef = useRef<AgGridReact<T>>(null);
  const [rows, setRowsState] = useState<T[]>([]);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;

  const idOf = useCallback((r: T) => r[idField] as unknown as number, [idField]);
  const parentOf = useCallback((r: T) => r[parentField] as unknown as number, [parentField]);

  const byId = useMemo(() => new Map(rows.map(r => [idOf(r), r])), [rows, idOf]);
  const childrenOf = useMemo(() => {
    const m = new Map<number, number[]>();
    rows.forEach(r => {
      const p = parentOf(r);
      if (!m.has(p)) m.set(p, []);
      m.get(p)!.push(idOf(r));
    });
    return m;
  }, [rows, idOf, parentOf]);
  const byIdRef = useRef(byId);
  byIdRef.current = byId;

  /** 조상 ID (가까운 것부터) */
  const ancestors = useCallback((id: number): number[] => {
    const out: number[] = [];
    let cur = byIdRef.current.get(id);
    while (cur) {
      const p = parentOf(cur);
      const parent = byIdRef.current.get(p);
      if (!parent) break;
      out.push(p);
      cur = parent;
    }
    return out;
  }, [parentOf]);

  /** 모든 자손 ID */
  const descendants = useCallback((id: number): number[] => {
    const out: number[] = [];
    const walk = (x: number) => (childrenOf.get(x) ?? []).forEach(c => { out.push(c); walk(c); });
    walk(id);
    return out;
  }, [childrenOf]);

  const hasChildren = useCallback((id: number) => (childrenOf.get(id)?.length ?? 0) > 0, [childrenOf]);

  const setRows = useCallback((list: T[]) => { setRowsState(list); setExpanded(new Set()); }, []);
  const expandAll = useCallback(() => setExpanded(new Set(rows.filter(r => hasChildren(idOf(r))).map(idOf))), [rows, hasChildren, idOf]);
  const collapseAll = useCallback(() => setExpanded(new Set()), []);
  const toggle = useCallback((id: number) => setExpanded(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  }), []);
  /** id의 조상을 모두 펼친다 (보이게) */
  const expandAncestors = useCallback((ids: number[]) => setExpanded(prev => {
    const next = new Set(prev);
    ids.forEach(id => ancestors(id).forEach(a => next.add(a)));
    return next;
  }), [ancestors]);
  /** id와 그 자손을 모두 펼친다 (AS-IS setExpanded(model, true, true)) */
  const expandDeep = useCallback((id: number) => setExpanded(prev => {
    const next = new Set(prev);
    [id, ...descendants(id)].forEach(x => { if (hasChildren(x)) next.add(x); });
    return next;
  }), [descendants, hasChildren]);

  useEffect(() => { gridRef.current?.api?.onFilterChanged(); }, [expanded, rows]);

  /** 트리 컬럼: 깊이만큼 들여쓰기 + 펼침 단추 */
  const treeCol = useCallback((field: keyof T & string, width: number, headerName: string): ColDef<T> => ({
    field: field as unknown as ColDef<T>['field'],
    width,
    headerName,
    cellRenderer: (p: CustomCellRendererProps<T>) => {
      if (!p.data) return null;
      const id = idOf(p.data);
      const depth = Number(p.data[depthField] ?? 0);
      const open = expandedRef.current.has(id);
      return (
        <span style={{ paddingLeft: depth * 16, display: 'flex', alignItems: 'center', gap: 4, height: '100%' }}>
          {hasChildren(id) ? (
            <span style={{ cursor: 'pointer', display: 'inline-flex', width: 14 }} onClick={e => { e.stopPropagation(); toggle(id); }}>
              {open ? <CaretDownOutlined /> : <CaretRightOutlined />}
            </span>
          ) : <span style={{ display: 'inline-block', width: 14 }} />}
          {p.value as React.ReactNode}
        </span>
      );
    },
  }), [depthField, hasChildren, idOf, toggle]);

  // 펼침이 바뀌면 트리 컬럼 아이콘을 다시 그린다
  useEffect(() => { gridRef.current?.api?.refreshCells({ force: true }); }, [expanded]);

  /**
   * AS-IS 트리 권한 칸 클릭(getColumn): 값을 뒤집고(null → true), true면 조상도 true, 자손은 모두 같은 값.
   * 바꾼 행 ID 목록을 돌려준다(저장할 변경 행). 값은 DB 형태 'true'/'false' 문자열
   */
  const cascadeToggle = useCallback((api: GridApi<T>, row: T, field: keyof T & string): number[] => {
    const id = idOf(row);
    const cur = row[field] as unknown;
    const next = cur == null ? true : !(cur === true || cur === 'true');
    const targets = [...(next ? ancestors(id) : []), id, ...descendants(id)];
    const changed: number[] = [];
    targets.forEach(t => {
      const node = api.getRowNode(String(t));
      if (node?.data) {
        node.setDataValue(field, String(next));
        changed.push(t);
      }
    });
    return changed;
  }, [idOf, ancestors, descendants]);

  const gridProps = {
    rowData: rows,
    getRowId: (p: { data: T }) => String(idOf(p.data)),
    isExternalFilterPresent: () => true,
    doesExternalFilterPass: (node: IRowNode<T>) => !node.data || ancestors(idOf(node.data)).every(a => expandedRef.current.has(a)),
  };

  return { gridRef, rows, setRows, setRowsState, expanded, expandAll, collapseAll, toggle, expandAncestors, expandDeep, ancestors, descendants, hasChildren, cascadeToggle, treeCol, gridProps };
}
