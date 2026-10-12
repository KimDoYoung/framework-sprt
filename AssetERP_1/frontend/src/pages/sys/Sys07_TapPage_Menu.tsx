/**
 * 권한그룹별 매뉴 트리 (A08, 보기 전용) — Sys07_TabPage_Role 오른쪽(center). 클래스 이름의 오타(Tap)는 원본 그대로.
 * AS-IS: myApp/client/vi/sys/Sys07_TapPage_Menu.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 */
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { message, Space } from 'antd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { RoleMenuNode } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { useTreeGrid } from '@/hooks/useTreeGrid';

const gb = gbFor<RoleMenuNode>();

export interface Sys07_TapPage_MenuHandle {
  retrieve: (roleId: number | null, companyId: number | null) => void;
  getModel: () => RoleMenuNode | undefined;
}

export const Sys07_TapPage_Menu = forwardRef<Sys07_TapPage_MenuHandle>((_, ref) => {
  const tree = useTreeGrid<RoleMenuNode>({ idField: 'menuId', parentField: 'parentId', depthField: 'depth' });
  const roleId = useRef<number | null>(null);
  const companyId = useRef<number | null>(null);

  // buildTreeGrid() L71-80 (getTreeGrid — 행번호 없음)
  const columnDefs = useMemo(() => [
    tree.treeCol('menuNoPlusNm', 400, '매뉴명'),  // L74
    gb.booleanYn('useYn', 30, '권한'),  // L75 roleMenuYn
    gb.text('seq', 70, '조회순서'),  // L76
    gb.text('note', 500, '매뉴설명'),  // L77
  ], [tree.treeCol]);

  // retrieve(roleId, companyId) L88-113: sys.Sys06_Menu.selectByRoleId → 트리를 비우고 다시 채운다.
  // 원본은 (null, null)이면 서버가 빈 결과를 준다(회사 조건 = NULL) → TOBE는 부르지 않고 비운다
  const retrieve = async (r: number | null, c: number | null) => {
    roleId.current = r;
    companyId.current = c;
    if (r == null || c == null) {
      tree.setRows([]);
      return;
    }
    try {
      tree.setRows(await sysApi.getCompanyRoleMenuTree(c, r));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // refresh() L82-86: roleId 또는 companyId가 있을 때만
  const refresh = () => {
    if (roleId.current != null || companyId.current != null) retrieve(roleId.current, companyId.current);
  };

  useImperativeHandle(ref, () => ({
    retrieve,
    // getModel() L127-129
    getModel: () => tree.gridRef.current?.api?.getSelectedRows()[0],
  }));

  // [E0] 화면 열림 (생성자 L37-48) → settings() — 조회는 권한그룹을 고를 때
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <Space style={{ height: 51, padding: '0 8px', flex: 'none' }}>
        {/* [E1] refreshButton[조회].Select (L51) → refresh() */}
        <Button type="search" onClick={refresh}>조회</Button>
        {/* [E2] expandAll[펼치기].Select (L57) → treeGrid.expandAll() */}
        <Button type="expand" onClick={tree.expandAll}>펼치기</Button>
        {/* [E3] collapseAll[감추기].Select (L63) → treeGrid.collapseAll() */}
        <Button type="collapse" onClick={tree.collapseAll}>감추기</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<RoleMenuNode> gridRef={tree.gridRef} {...tree.gridProps} columnDefs={columnDefs} rowNumber={false} />
      </div>
    </div>
  );
});
