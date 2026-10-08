/**
 * 권한그룹별 매뉴 트리 (A06) — Sys07_Tab_RoleMenu 오른쪽(center).
 * AS-IS: myApp/client/vi/sys/Sys07_Tree_RoleMenu.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Space, Typography } from 'antd';
import type { CellClickedEvent } from 'ag-grid-community';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { RoleMenuNode } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { isTreeToggleClick, useTreeGrid } from '@/hooks/useTreeGrid';

const gb = gbFor<RoleMenuNode>();

interface Props {
  /** retrieve(roleId) — 왼쪽 권한 그리드에서 고른 권한그룹 */
  roleId?: number;
}

export const Sys07_Tree_RoleMenu: React.FC<Props> = ({ roleId }) => {
  const tree = useTreeGrid<RoleMenuNode>({ idField: 'menuId', parentField: 'parentId', depthField: 'depth' });
  const [searchText, setSearchText] = useState('');
  const changed = useRef(new Set<number>());

  // buildTreeGrid() L141-149 (트리 컬럼 1번 = 매뉴명)
  const columnDefs = useMemo(() => [
    tree.treeCol('menuNoPlusNm', 350, '매뉴명'),  // L144
    gb.boolean('useYn', 40, '권한'),  // L145 roleMenuYn(= roleMenuModel.useYn) — 클릭은 getColumn()이 처리
    gb.text('seq', 80, '조회순서'),  // L146
    gb.text('note', 500, '매뉴설명'),  // L147
  ], [tree.treeCol]);

  // search() L213-231: 모두 접고 선택 해제 → 매뉴명(소문자)에 검색어가 있으면 그 행이 보이게 펼치고 선택
  // AS-IS는 바로 위 부모만 펼친다 → TOBE는 조상을 모두 펼친다(그래야 보인다, A15 Sys82와 같음)
  const search = useCallback((list: RoleMenuNode[] = tree.rows) => {
    const api = tree.gridRef.current?.api;
    api?.deselectAll();
    tree.collapseAll();
    if (!searchText) return;
    const found = list.filter(m => m.menuNoPlusNm.toLowerCase().indexOf(searchText) > -1);
    tree.expandAncestors(found.map(m => m.menuId));
    setTimeout(() => found.forEach(m => api?.getRowNode(String(m.menuId))?.setSelected(true, false)));
  }, [searchText, tree]);

  // retrieve(roleId) L157-183: 서비스 sys.Sys06_Menu.selectByRoleId(로그인 회사, roleId) → 트리 구성 → search()
  const retrieve = useCallback(async () => {
    if (!roleId) return;
    try {
      const list = await sysApi.getRoleMenuTree(roleId);
      changed.current.clear();
      tree.setRows(list);
      search(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [roleId, tree, search]);

  // refresh() L151-155: roleId가 있을 때만 retrieve
  const refresh = retrieve;

  // [E6] treeGrid.CellMouseDown [rowIndex >= 0] (L99) → getColumn() L111-139: 행을 깊게 펼치고, 권한 칸이면 값을 뒤집고 조상(true일 때)·자손에 같은 값
  const getColumn = (e: CellClickedEvent<RoleMenuNode>) => {
    if (!e.data || isTreeToggleClick(e.event)) return; // 펼침 단추 클릭은 접기·펼치기만
    tree.expandDeep(e.data.menuId);
    if (e.colDef.field !== 'useYn') return;
    tree.cascadeToggle(e.api, e.data, 'useYn').forEach(t => changed.current.add(t));
  };

  // update() L196-211: 바뀐 행 → 서비스 sys.Sys06_Menu.updateRoleMenu(roleId) → 결과로 그 행을 바꾼다(다시 조회하면 트리가 깨진다 — 원본 주석)
  const update = async () => {
    if (!roleId) return;
    const rows = tree.rows.filter(r => changed.current.has(r.menuId));
    if (rows.length === 0) {
      message.info('저장할 내용이 없습니다.');
      return;
    }
    try {
      const saved = await sysApi.updateRoleMenus(roleId, rows);
      const api = tree.gridRef.current?.api;
      saved.forEach(s => {
        const node = api?.getRowNode(String(s.menuId));
        if (node?.data) node.setData({ ...node.data, roleMenuId: s.roleMenuId, useYn: s.useYn });
      });
      changed.current.clear();
      message.success(`${saved.length}건 저장되었습니다.`);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L47-62) → settings() — 조회는 왼쪽에서 권한을 고를 때
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (roleId) retrieve(); }, [roleId]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 12px 0' }}>
      <Space wrap>
        <Typography.Text strong>매뉴명</Typography.Text>
        {/* [E1] searchText.KeyPress [Enter] (L66) → search() */}
        <Input style={{ width: 160 }} value={searchText} onChange={e => setSearchText(e.target.value)} onPressEnter={() => search()} />
        {/* [E2] refreshButton[조회].Select (L74) → refresh() */}
        <Button type="search" onClick={refresh}>조회</Button>
        {/* [E3] expandAll[펼치기].Select (L80) → treeGrid.expandAll() */}
        <Button type="expand" onClick={tree.expandAll}>펼치기</Button>
        {/* [E4] collapseAll[감추기].Select (L86) → treeGrid.collapseAll() */}
        <Button type="collapse" onClick={tree.collapseAll}>감추기</Button>
        {/* [E5] updateButton[저장].Select (L93) → update() */}
        <Button type="save" onClick={update}>저장</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<RoleMenuNode>
          gridRef={tree.gridRef}
          {...tree.gridProps}
          columnDefs={columnDefs}
          sortable={false}
          rowSelection={{ mode: 'multiRow', checkboxes: false, headerCheckbox: false, enableClickSelection: true }}
          onCellClicked={getColumn}
        />
      </div>
    </div>
  );
};
