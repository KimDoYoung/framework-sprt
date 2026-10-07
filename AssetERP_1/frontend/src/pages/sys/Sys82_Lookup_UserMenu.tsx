/**
 * 매뉴권한(관리자별 메뉴 권한) 조회창 (A15) — 고객별 관리자 탭(Sys02_Tab_User)의 [권한설정]에서 연다.
 * AS-IS: myApp/client/vi/sys/Sys82_Lookup_UserMenu.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Modal, Space, Typography } from 'antd';
import type { CellClickedEvent } from 'ag-grid-community';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { AdminUserMenu } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { isTreeToggleClick, useTreeGrid } from '@/hooks/useTreeGrid';

const gb = gbFor<AdminUserMenu>();

interface Props {
  /** open(userId) L53-57 — 값이 있으면 열린다 */
  userId?: number;
  onClose: () => void;
}

export const Sys82_Lookup_UserMenu: React.FC<Props> = ({ userId, onClose }) => {
  const tree = useTreeGrid<AdminUserMenu>({ idField: 'menuId', parentField: 'parentId', depthField: 'depth' });
  const [searchText, setSearchText] = useState('');
  const changed = useRef(new Set<number>());

  // buildTreeGrid() L169-177 (트리 컬럼 1번 = 매뉴명)
  const columnDefs = useMemo(() => [
    tree.treeCol('menuNm', 250, '매뉴명'),  // L171
    gb.boolean('useYn', 40, '권한'),  // L172 adminUserMenuYn — 클릭은 getColumn()이 처리
    gb.text('seq', 80, '조회순서'),  // L173
    gb.text('note', 250, '매뉴설명'),  // L174
  ], [tree.treeCol]);

  // search() L247-265: 모두 접고 선택 해제 → 매뉴명에 검색어가 있으면 그 행이 보이게 펼치고 선택
  const search = useCallback((list: AdminUserMenu[] = tree.rows) => {
    const api = tree.gridRef.current?.api;
    api?.deselectAll();
    tree.collapseAll();
    if (!searchText) return;
    const found = list.filter(m => m.menuNm.toLowerCase().indexOf(searchText) > -1);
    tree.expandAncestors(found.map(m => m.menuId));
    setTimeout(() => found.forEach(m => api?.getRowNode(String(m.menuId))?.setSelected(true, false)));
  }, [searchText, tree]);

  // retrieve() L185-214: 서비스 sys.Sys06_Menu.selectByAdminUserId → 트리 구성 → search()
  const retrieve = useCallback(async () => {
    if (!userId) return;
    try {
      const list = await sysApi.searchAdminUserMenus(userId);
      changed.current.clear();
      tree.setRows(list);
      search(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [userId, tree, search]);

  // refresh() L179-183
  const refresh = retrieve;

  // [E7] treeGrid.CellMouseDown (L127) → getColumn() L139-167: 권한 칸이면 값을 뒤집고(null → true), true면 조상도 true, 자손은 같은 값
  const getColumn = (e: CellClickedEvent<AdminUserMenu>) => {
    if (!e.data || isTreeToggleClick(e.event)) return; // 펼침 단추 클릭은 접기·펼치기만
    tree.expandDeep(e.data.menuId);
    if (e.colDef.field !== 'useYn') return;
    tree.cascadeToggle(e.api, e.data, 'useYn').forEach(t => changed.current.add(t));
  };

  // update() L230-245: 바뀐 행 → 서비스 sys.Sys82_AdminUserMenu.updateMenu(userId) → 결과로 그 행을 바꾼다(다시 조회하지 않음)
  const update = async () => {
    if (!userId) return;
    const rows = tree.rows.filter(r => changed.current.has(r.menuId));
    if (rows.length === 0) {
      message.info('저장할 내용이 없습니다.');
      return;
    }
    try {
      const saved = await sysApi.updateAdminUserMenus(userId, rows);
      const api = tree.gridRef.current?.api;
      saved.forEach(s => {
        const node = api?.getRowNode(String(s.menuId));
        if (node?.data) node.setData({ ...node.data, adminUserMenuId: s.adminUserMenuId, useYn: s.useYn });
      });
      changed.current.clear();
      message.success(`${saved.length}건 저장되었습니다.`);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // open(userId) L53-57 → retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (userId) { setSearchText(''); retrieve(); } }, [userId]);

  return (
    <Modal
      open={!!userId}
      title="매뉴권한"
      width={650}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E5] updateButton[저장].Select (L115) → update() */}
            <Button type="save" onClick={update}>저장</Button>
            {/* [E6] closeButton[닫기].Select (L121) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 560, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space>
          <Typography.Text strong>매뉴명</Typography.Text>
          {/* [E1] searchText.KeyPress [Enter] (L89) → search() */}
          <Input style={{ width: 160 }} value={searchText} onChange={e => setSearchText(e.target.value)} onPressEnter={() => search()} />
          {/* [E2] refreshButton[조회].Select (L97) → refresh() */}
          <Button type="search" onClick={refresh}>조회</Button>
          {/* [E3] expandAll[펼치기].Select (L103) → treeGrid.expandAll() */}
          <Button type="expand" onClick={tree.expandAll}>펼치기</Button>
          {/* [E4] collapseAll[감추기].Select (L109) → treeGrid.collapseAll() */}
          <Button type="collapse" onClick={tree.collapseAll}>감추기</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AdminUserMenu>
            gridRef={tree.gridRef}
            {...tree.gridProps}
            columnDefs={columnDefs}
            rowNumber={false}
            rowSelection={{ mode: 'multiRow', checkboxes: false, headerCheckbox: false, enableClickSelection: true }}
            onCellClicked={getColumn}
          />
        </div>
      </div>
    </Modal>
  );
};
