/**
 * [1284] 관리자 > 01. 화면권한관리 > 메뉴별 그룹권한(View)  (A11)
 * AS-IS: myApp/client/vi/sys/Sys06_Tab_MenuView.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 레이아웃(생성자 L47-80): 왼쪽(고정 500, 최소 500, 분할, 여백 20,0,20,20) = 툴바(높이 50) + 메뉴 트리, 가운데 = Sys04_Page_RoleView(여백 20,20,20,-2)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input, message, Space, Splitter } from 'antd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { MenuViewNode } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid } from '@/components/grid';
import { useTreeGrid } from '@/hooks/useTreeGrid';
import { Sys04_Page_RoleView } from './Sys04_Page_RoleView';

export const Sys06_Tab_MenuView: React.FC = () => {
  const tree = useTreeGrid<MenuViewNode>({ idField: 'menuId', parentField: 'parentId', depthField: 'depth' });
  const [searchText, setSearchText] = useState('');
  const [menuId, setMenuId] = useState<number>();

  // buildTreeGrid() L127-134: menuNoPlusName 400 "매뉴명" (getTreeGrid(1) — 행번호 다음이 트리 칸. TOBE 트리는 행번호를 두지 않는다, A09와 같음)
  const columnDefs = useMemo(() => [tree.treeCol('menuNoPlusNm', 400, '매뉴명')], [tree.treeCol]);

  // retrieve() L136-142 → getServiceResult() L176-200: 서비스 sys.Sys06_Menu.selectByCompanyId(로그인 회사)
  //   트리를 비우고 다시 구성한 뒤 맨 위(루트) 메뉴를 모두 펼친다
  const retrieve = useCallback(async () => {
    try {
      const list = await sysApi.getMenuViewTree();
      tree.setRows(list);
      list.filter(m => m.depth === 0).forEach(m => tree.toggle(m.menuId));
    } catch (err) {
      message.error(errorMessage(err, 'error'));
    }
  }, [tree]);

  // search() L155-173: 선택 해제·전부 접기 → 검색어가 없으면 끝, 있으면 메뉴번호+메뉴명에 검색어가 들어 있는 행을 선택하고 바로 위 부모를 펼친다
  // AS-IS는 바로 위 부모만 펼친다 → TOBE는 조상을 모두 펼친다(그래야 보인다, A06과 같음)
  const search = () => {
    const api = tree.gridRef.current?.api;
    api?.deselectAll();
    tree.collapseAll();
    if (!searchText) return;
    const found = tree.rows.filter(m => m.menuNoPlusNm.indexOf(searchText) > -1);
    tree.expandAncestors(found.map(m => m.menuId));
    setTimeout(() => found.forEach(m => api?.getRowNode(String(m.menuId))?.setSelected(true, false)));
  };

  // [E0] 화면 열림 (생성자 L47-80) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  return (
    <Splitter style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel defaultSize={500} min={500} max={1000}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', margin: '20px 0 20px 20px', border: '1px solid #d9d9d9' }}>
          <Space style={{ height: 50, flex: 'none', padding: '0 8px' }}>
            {/* [E1] searchText.KeyPress [Enter] (L85) → search() */}
            <Input style={{ width: 150 }} value={searchText} onChange={e => setSearchText(e.target.value)} onPressEnter={search} />
            {/* [E2] retrieveButton[검색].Select (L93) → search() */}
            <Button type="search" onClick={search}>검색</Button>
            {/* [E3] expandAll[펼치기].Select (L100) → treeGrid.expandAll() */}
            <Button type="expand" onClick={tree.expandAll}>펼치기</Button>
            {/* [E4] collapseAll[감추기].Select (L106) → treeGrid.collapseAll() */}
            <Button type="collapse" onClick={tree.collapseAll}>감추기</Button>
          </Space>
          <div style={{ flex: 1, minHeight: 0 }}>
            {/* [E5] treeGrid.SelectionChanged [data != null] (L113) → roleViewPage.retrieve(menuId), 선택이 없으면 retrieve(null) */}
            <SingleGrid<MenuViewNode>
              gridRef={tree.gridRef}
              {...tree.gridProps}
              rowNumber={false}
              columnDefs={columnDefs}
              onSelect={r => setMenuId(r?.menuId)}
            />
          </div>
        </div>
      </Splitter.Panel>
      <Splitter.Panel>
        <div style={{ height: '100%', margin: '20px 20px 20px -2px', border: '1px solid #d9d9d9' }}>
          <Sys04_Page_RoleView menuId={menuId} />
        </div>
      </Splitter.Panel>
    </Splitter>
  );
};
