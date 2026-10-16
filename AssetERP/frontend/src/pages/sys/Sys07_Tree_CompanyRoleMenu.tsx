/**
 * 고객사 권한그룹별 매뉴 트리 (A07) — Sys07_Tab_CompanyRoleMenu 오른쪽(center).
 * AS-IS: myApp/client/vi/sys/Sys07_Tree_CompanyRoleMenu.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * A06 Sys07_Tree_RoleMenu와 같은 트리 패턴. 다른 점: 매뉴명 검색 없음, 회사는 왼쪽에서 고른 회사, 셀 클릭은 권한 칸만 처리
 * UX보강(10) B12-1: 저장 = 저장(n)(UX-03, 바뀐 행 수). 검색 칸이 없어 SearchBar는 쓰지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { CellClickedEvent } from 'ag-grid-community';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Role, RoleMenuNode } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { isTreeToggleClick, useTreeGrid } from '@/hooks/useTreeGrid';

const gb = gbFor<RoleMenuNode>();

interface Props {
  /** retrieve(roleModel) — 왼쪽 권한 그리드에서 고른 권한그룹 (companyId·roleId) */
  roleModel?: Role;
}

export const Sys07_Tree_CompanyRoleMenu: React.FC<Props> = ({ roleModel }) => {
  const tree = useTreeGrid<RoleMenuNode>({ idField: 'menuId', parentField: 'parentId', depthField: 'depth' });
  const changed = useRef(new Set<number>());
  const [changedCount, setChangedCount] = useState(0);  // 저장(n) (UX-03)

  // buildTreeGrid() L124-132 (getTreeGrid(1): 트리 컬럼 1번 = 매뉴명)
  const columnDefs = useMemo(() => [
    tree.treeCol('menuNm', 250, '매뉴명'),  // L126 menuName
    gb.boolean('useYn', 40, '권한'),  // L127 roleMenuYn(= roleMenuModel.useYn) — 클릭은 getColumn()이 처리
    gb.text('seq', 80, '조회순서'),  // L128
    gb.text('note', 500, '매뉴설명'),  // L129
  ], [tree.treeCol]);

  // retrieve(roleModel) L142-167: 서비스 sys.Sys06_Menu.selectByRoleId(roleModel.companyId, roleModel.roleId) → 트리 구성
  const retrieve = useCallback(async (role: Role) => {
    try {
      const list = await sysApi.getCompanyRoleMenuTree(role.companyId!, role.roleId);
      changed.current.clear();
      setChangedCount(0);
      tree.setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [tree]);

  // [E1] refreshButton[조회].Select (L58) → refresh() L134-140: 권한이 있으면 retrieve, 없으면 트리를 비운다
  const refresh = () => {
    if (roleModel) retrieve(roleModel);
    else { changed.current.clear(); setChangedCount(0); tree.setRows([]); }
  };

  // [E5] treeGrid.CellMouseDown [rowIndex >= 0 && cellIndex == 2] (L82-90) → getColumn() L94-122:
  //      행을 깊게 펼치고, 값을 뒤집어(null → true) true면 조상도 true, 자손은 모두 같은 값. 권한 칸이 아니면 아무것도 안 한다
  const getColumn = (e: CellClickedEvent<RoleMenuNode>) => {
    if (!e.data || isTreeToggleClick(e.event)) return;
    if (e.colDef.field !== 'useYn') return;
    tree.expandDeep(e.data.menuId);
    tree.cascadeToggle(e.api, e.data, 'useYn').forEach(t => changed.current.add(t));
    setChangedCount(changed.current.size);
  };

  // [E4] updateButton[저장].Select (L76) → update() L181-196: 바뀐 행 → 서비스 sys.Sys06_Menu.updateRoleMenu(roleId)
  //      → 결과로 그 행을 바꾼다(다시 조회하지 않는다 — A06 원본 주석 "다시 조회하면 트리가 깨진다")
  const update = async () => {
    if (!roleModel) return; // 원본은 roleModel null이면 NPE(아무 반응 없음) — A06과 같음
    const rows = tree.rows.filter(r => changed.current.has(r.menuId));
    if (rows.length === 0) {
      message.info('저장할 내용이 없습니다.');
      return;
    }
    try {
      const saved = await sysApi.updateCompanyRoleMenus(roleModel.companyId!, roleModel.roleId, rows);
      const api = tree.gridRef.current?.api;
      saved.forEach(s => {
        const node = api?.getRowNode(String(s.menuId));
        if (node?.data) node.setData({ ...node.data, roleMenuId: s.roleMenuId, useYn: s.useYn });
      });
      changed.current.clear();
      setChangedCount(0);
      message.success(`${saved.length}건 저장되었습니다.`);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L42-55) → settings() — 조회는 왼쪽에서 권한을 고를 때(본 화면 E3).
  // 권한이 없어지면(회사 선택 취소 — 사용자 결정 2026-10-12) 트리를 비운다
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { refresh(); }, [roleModel]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 12px 0', boxSizing: 'border-box' }}>
      <Space wrap>
        <Button type="search" onClick={refresh}>조회</Button>
        {/* [E2] expandAll[펼치기].Select (L64) → treeGrid.expandAll() */}
        <Button type="expand" onClick={tree.expandAll}>펼치기</Button>
        {/* [E3] collapseAll[감추기].Select (L70) → treeGrid.collapseAll() */}
        <Button type="collapse" onClick={tree.collapseAll}>감추기</Button>
        {/* 저장(n)은 UX-03 */}
        <Button type="save" count={changedCount} onClick={update}>저장</Button>
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
