import { RefObject, useCallback, useEffect, useMemo, useRef } from 'react';
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import type { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridOptions, ICellRendererParams, IRowNode } from 'ag-grid-community';

/**
 * AG Grid Community용 트리 그리드 (Community에는 treeData가 없다 — AS-IS GXT TreeGrid 대체).
 * 행은 서버가 깊이 우선 순서 + level로 준 평평한 목록이고, 접힌 노드의 자손은 외부 필터로 숨긴다.
 *
 * 사용법: `const tree = useTreeGrid({ gridRef, rows, idField, parentField, levelField })`
 * → `<AgGridReact {...tree.gridProps} />`, 이름 컬럼은 `tree.treeCol({...})`, 버튼에 `expandAll / collapseAll`.
 */
export interface TreeGridOptions<T> {
  gridRef: RefObject<AgGridReact<T> | null>;
  rows: T[];
  idField: keyof T & string;
  parentField: keyof T & string;
  levelField: keyof T & string;
  /** 처음 펼칠 깊이 (기본 0: 1차만 펼쳐 2차까지 보인다) */
  expandLevel?: number;
}

export function useTreeGrid<T extends object>(options: TreeGridOptions<T>) {
  const { gridRef, rows, idField, parentField, levelField, expandLevel = 0 } = options;
  const expanded = useRef(new Set<number>());

  const idOf = useCallback((r: T) => r[idField] as unknown as number, [idField]);

  const { parentOf, childrenOf } = useMemo(() => {
    const parentOf = new Map<number, number>();
    const childrenOf = new Map<number, number[]>();
    const ids = new Set(rows.map(idOf));
    for (const r of rows) {
      const p = r[parentField] as unknown as number;
      if (ids.has(p)) {
        parentOf.set(idOf(r), p);
        childrenOf.set(p, [...(childrenOf.get(p) ?? []), idOf(r)]);
      }
    }
    return { parentOf, childrenOf };
  }, [rows, idOf, parentField]);

  const refresh = useCallback(() => {
    const api = gridRef.current?.api;
    api?.onFilterChanged();
    api?.refreshCells({ force: true });
  }, [gridRef]);

  // 처음 받은 목록은 expandLevel까지 펼친다. 이후 노드가 추가·삭제돼도 펼침 상태는 유지한다 (AS-IS saveExpandedState)
  const initialized = useRef(false);
  const idsKey = useMemo(() => rows.map(idOf).join(','), [rows, idOf]);
  useEffect(() => {
    if (!initialized.current && rows.length > 0) {
      expanded.current = new Set(rows.filter(r => (r[levelField] as unknown as number) <= expandLevel).map(idOf));
      initialized.current = true;
    }
    setTimeout(refresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, levelField, expandLevel]);

  const ancestors = useCallback((id: number) => {
    const list: number[] = [];
    for (let p = parentOf.get(id); p != null; p = parentOf.get(p)) list.push(p);
    return list;
  }, [parentOf]);

  const descendants = useCallback((id: number) => {
    const list: number[] = [];
    const walk = (n: number) => (childrenOf.get(n) ?? []).forEach(c => { list.push(c); walk(c); });
    walk(id);
    return list;
  }, [childrenOf]);

  const toggle = useCallback((id: number) => {
    if (expanded.current.has(id)) expanded.current.delete(id);
    else expanded.current.add(id);
    refresh();
  }, [refresh]);

  const expandAll = useCallback(() => {
    expanded.current = new Set(childrenOf.keys());
    refresh();
  }, [childrenOf, refresh]);

  const collapseAll = useCallback(() => {
    expanded.current.clear();
    refresh();
  }, [refresh]);

  /** id가 보이도록 조상을 펼친다 */
  const reveal = useCallback((id: number) => {
    ancestors(id).forEach(a => expanded.current.add(a));
    refresh();
  }, [ancestors, refresh]);

  const TreeCell = useCallback((p: ICellRendererParams<T>) => {
    if (!p.data) return null;
    const id = idOf(p.data);
    const level = p.data[levelField] as unknown as number;
    const hasChildren = childrenOf.has(id);
    const Icon = expanded.current.has(id) ? CaretDownOutlined : CaretRightOutlined;
    return (
      <span style={{ paddingLeft: level * 16, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <span
          style={{ width: 14, cursor: hasChildren ? 'pointer' : undefined, color: '#8c8c8c' }}
          onClick={e => { e.stopPropagation(); if (hasChildren) toggle(id); }}
        >
          {hasChildren && <Icon />}
        </span>
        {p.valueFormatted ?? String(p.value ?? '')}
      </span>
    );
  }, [idOf, levelField, childrenOf, toggle]);

  const treeCol = useCallback((col: ColDef<T>): ColDef<T> => ({ ...col, cellRenderer: TreeCell }), [TreeCell]);

  const gridProps: GridOptions<T> = {
    isExternalFilterPresent: () => true,
    doesExternalFilterPass: (node: IRowNode<T>) =>
      !node.data || ancestors(idOf(node.data)).every(a => expanded.current.has(a)),
  };

  return { gridProps, treeCol, expandAll, collapseAll, reveal, toggle, ancestors, descendants };
}
