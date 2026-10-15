/**
 * 사원별 메뉴 트리 (C04) — Emp00_Tab_RoleMenu 오른쪽(center). 컬럼 없는 GXT Tree(메뉴번호+메뉴명만 보인다).
 * AS-IS: myApp/client/vi/sys/Sys07_Tree_PersonRoleMenu.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input, message, Space } from 'antd';
import type { CellClickedEvent } from 'ag-grid-community';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { PersonMenuNode } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid } from '@/components/grid';
import { isTreeToggleClick, useTreeGrid } from '@/hooks/useTreeGrid';

interface Props {
  /** retrieve(personId) — 왼쪽 사원 그리드에서 고른 사원 */
  personId?: number;
}

export const Sys07_Tree_PersonRoleMenu: React.FC<Props> = ({ personId }) => {
  const tree = useTreeGrid<PersonMenuNode>({ idField: 'menuId', parentField: 'parentId', depthField: 'depth' });
  const [searchText, setSearchText] = useState('');

  // getMenuTree() L88-119: 값 = menuNoPlusName, 트리에 헤더가 없다
  const columnDefs = useMemo(() => [tree.treeCol('menuNoPlusNm', 400, '')], [tree.treeCol]);

  // search() L177-197: 모두 접고 선택 해제 → 화면명(소문자)에 검색어가 있으면 그 행이 보이게 펼치고 선택
  // AS-IS는 바로 위 부모만 펼친다 → TOBE는 조상을 모두 펼친다(그래야 보인다, A06과 같음)
  const search = useCallback((list: PersonMenuNode[] = tree.rows) => {
    const api = tree.gridRef.current?.api;
    api?.deselectAll();
    tree.collapseAll();
    if (!searchText) return;
    const found = list.filter(m => m.menuNoPlusNm.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
    tree.expandAncestors(found.map(m => m.menuId));
    setTimeout(() => found.forEach(m => api?.getRowNode(String(m.menuId))?.setSelected(true, false)));
  }, [searchText, tree]);

  // retrieve(personId) L127-153: 서비스 sys.Sys06_Menu.selectByPersonId(로그인 회사, personId) → 트리를 비우고 다시 구성
  const retrieve = useCallback(async () => {
    if (personId === undefined) return;
    try {
      tree.setRows(await sysApi.getPersonMenuTree(personId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [personId, tree]);

  // refresh() L121-125: personId가 있을 때만 retrieve
  const refresh = retrieve;

  // onClick(Event) L93-96: 노드를 한 번 클릭으로 펼친다(super.onDoubleClick)
  const onNodeClick = (e: CellClickedEvent<PersonMenuNode>) => {
    if (!e.data || isTreeToggleClick(e.event)) return; // 펼침 단추 클릭은 접기·펼치기만
    tree.expandDeep(e.data.menuId);
  };

  // [E0] 화면 열림 (생성자 L41-53) → settings() — 조회는 왼쪽에서 사원을 고를 때
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, [personId]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 12px 0', boxSizing: 'border-box' }}>
      <Space wrap>
        {/* [E1] menuSearch.KeyPress [Enter] (L60) → search() */}
        <Input style={{ width: 200 }} placeholder="화면명" value={searchText} onChange={e => setSearchText(e.target.value)} onPressEnter={() => search()} />
        {/* [E2] refreshButton[조회].Select (L68) → refresh() */}
        <Button type="search" onClick={refresh}>조회</Button>
        {/* [E3] expandAll[펼치기].Select (L74) → tree.expandAll() */}
        <Button type="expand" onClick={tree.expandAll}>펼치기</Button>
        {/* [E4] collapseAll[감추기].Select (L80) → tree.collapseAll() */}
        <Button type="collapse" onClick={tree.collapseAll}>감추기</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<PersonMenuNode>
          gridRef={tree.gridRef}
          {...tree.gridProps}
          columnDefs={columnDefs}
          rowNumber={false}
          headerHeight={0}
          sortable={false}
          rowSelection={{ mode: 'multiRow', checkboxes: false, headerCheckbox: false, enableClickSelection: true }}
          onCellClicked={onNodeClick}
        />
      </div>
    </div>
  );
};
