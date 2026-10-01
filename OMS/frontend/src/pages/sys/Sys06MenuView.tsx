import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, Space, Splitter, Typography, message } from 'antd';
import { DragOutlined, EditOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { sysApi } from '../../api/sys';
import { errorMessage } from '../../api/client';
import { MenuItem } from '../../types/sys';
import { useTreeGrid } from '../../hooks/useTreeGrid';
import { MenuEditModal } from './sys06/MenuEditModal';
import { MenuMoveModal } from './sys06/MenuMoveModal';
import { MenuCopyModal } from './sys06/MenuCopyModal';
import { CompanyByMenuPanel } from './sys06/CompanyByMenuPanel';

/** 메뉴 관리 (AS-IS client/vi/sys/Sys06_Tab_Menu). KFS 관리자 전용 */
export const Sys06MenuView: React.FC = () => {
  const gridRef = useRef<AgGridReact<MenuItem>>(null);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [findText, setFindText] = useState('');
  const [selected, setSelected] = useState<MenuItem>();
  const [editTarget, setEditTarget] = useState<Partial<MenuItem> & { parentId: number }>();
  const [moveTarget, setMoveTarget] = useState<MenuItem>();
  const [copyOpen, setCopyOpen] = useState(false);
  const focusAfterLoad = useRef<number | undefined>(undefined);

  const tree = useTreeGrid<MenuItem>({ gridRef, rows: menus, idField: 'menuId', parentField: 'parentId', levelField: 'level' });

  /** AS-IS retrieve(): 다시 읽고 펼침 상태 유지, 저장한 메뉴를 펼쳐 선택 */
  const retrieve = useCallback(async (focusMenuId?: number) => {
    focusAfterLoad.current = focusMenuId;
    setLoading(true);
    try {
      setMenus(await sysApi.searchMenuItems());
    } catch (err) {
      message.error(errorMessage(err, '메뉴 조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { retrieve(); }, [retrieve]);

  const focusMenu = useCallback((menuId: number) => {
    const api = gridRef.current?.api;
    if (!api) return;
    tree.reveal(menuId);
    setTimeout(() => {
      const node = api.getRowNode(String(menuId));
      if (node?.rowIndex != null) {
        node.setSelected(true, true);
        api.ensureIndexVisible(node.rowIndex, 'middle');
      }
    });
  }, [tree]);

  const onRowDataUpdated = () => {
    if (focusAfterLoad.current != null) {
      focusMenu(focusAfterLoad.current);
      focusAfterLoad.current = undefined;
    }
  };

  /** AS-IS search(): 메뉴명+클래스명+화면번호로 찾아 펼치고 선택 */
  const find = () => {
    const api = gridRef.current?.api;
    if (!api) return;
    api.deselectAll();
    tree.collapseAll();
    const text = findText.trim().toLowerCase();
    if (!text) return;
    const found = menus.filter(m => `${m.menuNm}${m.classNm ?? ''}${m.menuNo ?? ''}`.toLowerCase().includes(text));
    found.forEach(m => tree.reveal(m.menuId));
    setTimeout(() => {
      const nodes = found.map(m => api.getRowNode(String(m.menuId))).filter(n => n != null);
      api.setNodesSelected({ nodes, newValue: true });
      // AS-IS: 가장 깊은 메뉴로 이동
      const deepest = nodes.reduce<typeof nodes[number] | undefined>((a, n) => (!a || (n.data!.level > a.data!.level) ? n : a), undefined);
      if (deepest?.rowIndex != null) api.ensureIndexVisible(deepest.rowIndex, 'middle');
    });
  };

  const addSubMenu = () => {
    if (!selected) {
      message.warning('선택된 상위 메뉴가 없습니다');
      return;
    }
    if (selected.classNm) {
      message.warning('오브젝트에는 하위 메뉴를 등록할 수 없습니다');
      return;
    }
    setEditTarget({ parentId: selected.menuId });
  };

  const ActionCell = useCallback((p: ICellRendererParams<MenuItem> & { action: 'edit' | 'move' }) => {
    if (!p.data) return null;
    const row = p.data;
    return p.action === 'edit'
      ? <EditOutlined style={{ color: '#1677ff', cursor: 'pointer' }} onClick={() => setEditTarget(row)} />
      : <DragOutlined style={{ color: '#1677ff', cursor: 'pointer' }} onClick={() => setMoveTarget(row)} />;
  }, []);

  const columnDefs = useMemo<ColDef<MenuItem>[]>(() => [
    tree.treeCol({ field: 'menuNm', headerName: '메뉴명', width: 400 }),
    { headerName: '수정', width: 60, cellRenderer: ActionCell, cellRendererParams: { action: 'edit' }, cellStyle: { textAlign: 'center' } },
    { headerName: '이동', width: 60, cellRenderer: ActionCell, cellRendererParams: { action: 'move' }, cellStyle: { textAlign: 'center' } },
    { field: 'useYn', headerName: '사용', width: 60, valueFormatter: p => (p.value ? 'Y' : 'N'), cellStyle: { textAlign: 'center' } },
    { field: 'seq', headerName: '순서', width: 70, cellStyle: { textAlign: 'center' } },
    { field: 'menuNo', headerName: '화면번호', width: 90, cellStyle: { textAlign: 'center' } },
    { field: 'classNm', headerName: '클래스명', width: 200 },
    { field: 'note', headerName: '화면안내', flex: 1, minWidth: 200 },
  ], [tree, ActionCell]);

  const afterSave = (menuId: number) => {
    setEditTarget(undefined);
    setMoveTarget(undefined);
    retrieve(menuId);
  };

  return (
    <Splitter style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel min="40%" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space wrap>
          <Typography.Text strong>메뉴구성</Typography.Text>
          <Input style={{ width: 200 }} value={findText} allowClear onChange={e => setFindText(e.target.value)} onPressEnter={find} />
          <Button onClick={() => retrieve(selected?.menuId)}>새로고침</Button>
          <Button onClick={() => setEditTarget({ parentId: 0 })}>루트메뉴 등록</Button>
          <Button onClick={addSubMenu}>하위메뉴 등록</Button>
          <Button onClick={tree.collapseAll}>감추기</Button>
          <Button onClick={() => setCopyOpen(true)}>일괄복사</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <AgGridReact<MenuItem>
            ref={gridRef}
            rowData={menus}
            loading={loading}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.menuId)}
            rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
            onSelectionChanged={e => setSelected(e.api.getSelectedRows()[0])}
            onRowDataUpdated={onRowDataUpdated}
            {...tree.gridProps}
          />
        </div>
      </Splitter.Panel>
      <Splitter.Panel defaultSize={600} min={300} style={{ padding: 12 }}>
        <CompanyByMenuPanel menuId={selected?.menuId} menuNm={selected?.menuNm} />
      </Splitter.Panel>

      <MenuEditModal target={editTarget} onClose={() => setEditTarget(undefined)} onSaved={afterSave} />
      <MenuMoveModal target={moveTarget} menus={menus} onClose={() => setMoveTarget(undefined)} onMoved={afterSave} />
      <MenuCopyModal open={copyOpen} onClose={() => { setCopyOpen(false); retrieve(selected?.menuId); }} />
    </Splitter>
  );
};
