/**
 * 메뉴별 권한그룹 보기 (A11) — Sys06_Tab_MenuView 오른쪽(center). 왼쪽 = 권한그룹 그리드, 오른쪽 = 권한그룹별 사원(Sys05_Page_UserRoleView).
 * AS-IS: myApp/client/vi/sys/Sys04_Page_RoleView.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 레이아웃(생성자 L27-54): 왼쪽 50%·오른쪽 50%(둘 다 최대 1000, 분할), 왼쪽 = 툴바(높이 50, 빈 ButtonBar) + 그리드
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Splitter } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Role } from '@/types/sys';
import { SingleGrid, gbFor } from '@/components/grid';
import { Sys05_Page_UserRoleView } from './Sys05_Page_UserRoleView';

const gb = gbFor<Role>();

/** AS-IS buildGrid() — 행번호 + 권한명 200, 권한설명 400 */
const buildGrid = () => [
  gb.text('roleNm', 200, '권한명'),
  gb.text('note', 400, '권한설명'),
];

interface Props {
  /** retrieve(menuId) — 왼쪽 메뉴 트리에서 고른 메뉴. 없으면(null) 그리드를 비운다 */
  menuId?: number;
}

export const Sys04_Page_RoleView: React.FC<Props> = ({ menuId }) => {
  const [rows, setRows] = useState<Role[]>([]);
  const [roleId, setRoleId] = useState<number>();
  const selectFirst = useRef(false);
  const gridRef = useRef<AgGridReact<Role>>(null);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve(menuId) L82-100: null이면 비우고 retrieveUserRole(), 아니면 서비스 sys.Sys04_Role.selectByMenuId(menuId, 로그인 회사)
  //   조회 뒤 한 건 이상이면 첫 행을 선택 → retrieveUserRole()
  const retrieve = useCallback(async () => {
    if (menuId === undefined) { setRows([]); setRoleId(undefined); return; }
    try {
      const list = await sysApi.searchRolesByMenuId(menuId);
      // AS-IS SQL이 sys05_user_role을 LEFT JOIN해 사원 수만큼 같은 권한그룹이 나온다 → 그리드 키(roleId)가 겹치므로 처음 한 번만 쓴다
      const seen = new Set<number>();
      selectFirst.current = true;
      setRows(list.filter(r => !seen.has(r.roleId) && !!seen.add(r.roleId)));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [menuId]);

  // [E0] 화면 열림 (생성자 L27-54) → settings(). 메뉴가 바뀔 때마다 다시 조회
  useEffect(() => { void retrieve(); }, [retrieve]);

  useEffect(() => {
    if (!selectFirst.current || rows.length === 0) return;
    selectFirst.current = false;
    setTimeout(() => gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true));
  }, [rows]);

  return (
    <Splitter style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel defaultSize="50%" max={1000} min={100}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 50, flex: 'none' }} />
          <div style={{ flex: 1, minHeight: 0 }}>
            {/* [E1] grid.SelectionChanged (L57) → retrieveUserRole() L73-80 */}
            <SingleGrid<Role>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.roleId)}
              onSelect={r => setRoleId(r?.roleId)}
            />
          </div>
        </div>
      </Splitter.Panel>
      <Splitter.Panel max={1000}>
        <Sys05_Page_UserRoleView roleId={roleId} />
      </Splitter.Panel>
    </Splitter>
  );
};
