import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, Space, Typography, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { CellValueChangedEvent, ColDef } from 'ag-grid-community';
import { errorMessage } from '../../api/client';
import { useTreeGrid } from '../../hooks/useTreeGrid';

/** 메뉴 체크 트리의 행: 메뉴 트리(깊이 우선 + level) + 체크 컬럼 */
export interface MenuCheckRow {
  menuId: number;
  parentId: number;
  level: number;
  seq: string | null;
  note: string | null;
}

interface MenuCheckTreeProps<T extends MenuCheckRow> {
  /** 버튼 앞 라벨 */
  title?: ReactNode;
  /** 조회. 바뀌면 다시 조회한다 (마스터 선택). undefined면 비운다 */
  load?: () => Promise<T[]>;
  /** 바꾼 행 저장 → 저장된 행의 바뀐 필드(menuId 기준으로 덮어쓴다) */
  save: (changed: T[]) => Promise<Partial<T>[]>;
  nameField: keyof T & string;
  checkField: keyof T & string;
  nameHeader?: string;
  /** AS-IS Sys07: 메뉴명 검색(Enter) */
  findable?: boolean;
}

/**
 * 메뉴 트리 + 권한 체크 (AS-IS Sys07_Tree_RoleMenu, Sys03_Tree_CompanyMenu).
 * 체크를 켜면 상위 메뉴도 켜고, 하위 메뉴는 모두 같은 값으로 바꾼다. 저장은 바꾼 행만.
 */
export function MenuCheckTree<T extends MenuCheckRow>(props: MenuCheckTreeProps<T>) {
  const { title, load, save, nameField, checkField, nameHeader = '메뉴명', findable = false } = props;
  const gridRef = useRef<AgGridReact<T>>(null);
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [findText, setFindText] = useState('');
  const dirty = useRef(new Set<number>());

  const tree = useTreeGrid<T>({ gridRef, rows, idField: 'menuId', parentField: 'parentId', levelField: 'level' });

  const retrieve = useCallback(async () => {
    dirty.current.clear();
    if (!load) {
      setRows([]);
      return;
    }
    setLoading(true);
    try {
      setRows(await load());
    } catch (err) {
      message.error(errorMessage(err, '메뉴 조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [load]);

  useEffect(() => { retrieve(); }, [retrieve]);

  /** AS-IS search(): 모두 접고, 메뉴명에 글자가 있는 메뉴를 펼쳐 선택 */
  const find = () => {
    const api = gridRef.current?.api;
    if (!api) return;
    api.deselectAll();
    tree.collapseAll();
    const text = findText.trim().toLowerCase();
    if (!text) return;
    const found = rows.filter(r => String(r[nameField] ?? '').toLowerCase().includes(text));
    found.forEach(r => tree.reveal(r.menuId));
    setTimeout(() => {
      const nodes = found.map(r => api.getRowNode(String(r.menuId))).filter(n => n != null);
      api.setNodesSelected({ nodes, newValue: true });
      if (nodes[0]?.rowIndex != null) api.ensureIndexVisible(nodes[0].rowIndex);
    });
  };

  /** AS-IS getColumn(): 켜면 상위도 켜고, 하위는 모두 같은 값 */
  const onCellValueChanged = (e: CellValueChangedEvent<T>) => {
    if (!e.data || e.colDef.field !== checkField) return;
    const value = Boolean(e.newValue);
    const targets = [...tree.descendants(e.data.menuId), ...(value ? tree.ancestors(e.data.menuId) : [])];
    dirty.current.add(e.data.menuId);
    for (const id of targets) {
      const data = e.api.getRowNode(String(id))?.data as Record<string, unknown> | undefined;
      if (data && data[checkField] !== value) {
        data[checkField] = value;
        dirty.current.add(id);
      }
    }
    e.api.refreshCells({ columns: [checkField] });
  };

  const handleSave = async () => {
    gridRef.current?.api?.stopEditing();
    const changed = rows.filter(r => dirty.current.has(r.menuId));
    if (changed.length === 0) {
      message.info('저장할 내용이 없습니다.');
      return;
    }
    try {
      const saved = await save(changed);
      const byMenu = new Map(saved.map(s => [s.menuId, s]));
      setRows(prev => prev.map(r => (byMenu.has(r.menuId) ? { ...r, ...byMenu.get(r.menuId) } : r)));
      dirty.current.clear();
      message.success(`${saved.length}건 저장되었습니다.`);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  const columnDefs = useMemo<ColDef<T>[]>(() => [
    tree.treeCol({ field: nameField as ColDef<T>['field'], headerName: nameHeader, width: 350 }),
    { field: checkField as ColDef<T>['field'], headerName: '권한', width: 70, editable: true, cellDataType: 'boolean' },
    { field: 'seq' as ColDef<T>['field'], headerName: '조회순서', width: 90 },
    { field: 'note' as ColDef<T>['field'], headerName: '메뉴설명', flex: 1, minWidth: 200 },
  ], [tree.treeCol, nameField, checkField, nameHeader]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Space wrap>
        {title && <Typography.Text strong>{title}</Typography.Text>}
        {findable && (
          <Input style={{ width: 200 }} placeholder="메뉴명" value={findText} allowClear
            onChange={e => setFindText(e.target.value)} onPressEnter={find} />
        )}
        <Button type="primary" onClick={retrieve}>조회</Button>
        <Button onClick={tree.expandAll}>펼치기</Button>
        <Button onClick={tree.collapseAll}>감추기</Button>
        <Button onClick={handleSave} disabled={!load}>저장</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact<T>
          ref={gridRef}
          rowData={rows}
          loading={loading}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.menuId)}
          rowSelection={{ mode: 'multiRow', checkboxes: false, headerCheckbox: false, enableClickSelection: true }}
          onCellValueChanged={onCellValueChanged}
          {...tree.gridProps}
        />
      </div>
    </div>
  );
}
