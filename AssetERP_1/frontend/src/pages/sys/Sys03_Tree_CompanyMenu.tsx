/**
 * 고객별 매뉴 트리 (A10) — Sys03_Tab_CompanyMenu 오른쪽(center).
 * AS-IS: myApp/client/vi/sys/Sys03_Tree_CompanyMenu.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { message, Space, Typography } from 'antd';
import type { CellClickedEvent } from 'ag-grid-community';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { CompanyMenuNode } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { isTreeToggleClick, useTreeGrid } from '@/hooks/useTreeGrid';

const gb = gbFor<CompanyMenuNode>();

interface Props {
  /** retrieve(companyId) — 왼쪽 고객 그리드에서 고른 회사 */
  companyId?: number;
}

export const Sys03_Tree_CompanyMenu: React.FC<Props> = ({ companyId }) => {
  const tree = useTreeGrid<CompanyMenuNode>({ idField: 'menuId', parentField: 'parentId', depthField: 'depth' });
  const changed = useRef(new Set<number>());

  // buildTreeGrid() L135-145 (트리 컬럼 1번 = 매뉴명)
  const columnDefs = useMemo(() => [
    tree.treeCol('menuNm', 250, '매뉴명'),  // L139
    gb.boolean('useYn', 60, '권한'),  // L140 companyMenuUseYn — 클릭은 getColumn()이 처리
    gb.text('seq', 80, '조회순서'),  // L141
    gb.text('note', 500, '매뉴설명'),  // L142
  ], [tree.treeCol]);

  // retrieve(companyId) L147-177: 서비스 sys.Sys06_Menu.selectByCompanyIdAll → 트리 구성
  const retrieve = useCallback(async () => {
    if (!companyId) return;
    try {
      const list = await sysApi.getCompanyMenuTree(companyId);
      changed.current.clear();
      tree.setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [companyId, tree]);

  // [E5] treeGrid.CellMouseDown (L83) → getColumn() L95-133: 행을 깊게 펼치고, 권한 칸이면 값을 뒤집고 조상(true일 때)·자손에 같은 값
  const getColumn = (e: CellClickedEvent<CompanyMenuNode>) => {
    if (!e.data || isTreeToggleClick(e.event)) return; // 펼침 단추 클릭은 접기·펼치기만
    tree.expandDeep(e.data.menuId);
    if (e.colDef.field !== 'useYn') return;
    tree.cascadeToggle(e.api, e.data, 'useYn').forEach(t => changed.current.add(t));
  };

  // update() L190-211: 바뀐 행 → 서비스 sys.Sys06_Menu.updateCompanyMenu(companyId) → 결과로 그 행을 바꾼다(다시 조회하지 않음)
  const update = async () => {
    if (!companyId) return;
    const rows = tree.rows.filter(r => changed.current.has(r.menuId));
    if (rows.length === 0) {
      message.info('저장할 내용이 없습니다.');
      return;
    }
    try {
      const saved = await sysApi.updateCompanyMenus(companyId, rows);
      const api = tree.gridRef.current?.api;
      saved.forEach(s => {
        const node = api?.getRowNode(String(s.menuId));
        if (node?.data) node.setData({ ...node.data, companyMenuId: s.companyMenuId, useYn: s.useYn });
      });
      changed.current.clear();
      message.success(`${saved.length}건 저장되었습니다.`);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (companyId) retrieve(); }, [companyId]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 12px 0' }}>
      <Space wrap>
        <Typography.Text strong>고객별 매뉴조회</Typography.Text>
        {/* [E1] refreshButton[조회].Select [companyId != null] (L47) → retrieve() */}
        <Button type="search" onClick={retrieve}>조회</Button>
        {/* [E2] expandAll[펼치기].Select (L57) → treeGrid.expandAll() */}
        <Button type="expand" onClick={tree.expandAll}>펼치기</Button>
        {/* [E3] collapseAll[감추기].Select (L65) → treeGrid.collapseAll() */}
        <Button type="collapse" onClick={tree.collapseAll}>감추기</Button>
        {/* [E4] updateButton[저장].Select (L73) → update() */}
        <Button type="save" onClick={update}>저장</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<CompanyMenuNode>
          gridRef={tree.gridRef}
          {...tree.gridProps}
          columnDefs={columnDefs}
          sortable={false}
          onCellClicked={getColumn}
        />
      </div>
    </div>
  );
};
