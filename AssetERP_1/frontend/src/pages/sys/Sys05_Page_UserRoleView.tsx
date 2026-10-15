/**
 * 권한그룹별 사원 보기 (A11) — Sys04_Page_RoleView 오른쪽(center). 조회 전용 그리드.
 * AS-IS: myApp/client/vi/sys/Sys05_Page_UserRoleView.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 레이아웃(생성자 L23-42): 툴바(높이 50, 빈 ButtonBar) + 그리드, 여백 (-2,-1,-1,-1)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { UserRole } from '@/types/sys';
import { SingleGrid, gbFor } from '@/components/grid';

const gb = gbFor<UserRole>();

/** AS-IS buildGrid() — 행번호 + 조직 160, 직책 100, 사번 80, 성명 80 */
const buildGrid = () => [
  gb.text('orgNm', 160, '조직'),
  gb.text('titleNm', 100, '직책'),
  gb.text('empNo', 80, '사번'),
  gb.text('korNm', 80, '성명'),
];

interface Props {
  /** retrieve(roleId) — 왼쪽 권한그룹 그리드에서 고른 권한그룹. 없으면(null) 그리드를 비운다 */
  roleId?: number;
}

export const Sys05_Page_UserRoleView: React.FC<Props> = ({ roleId }) => {
  const [rows, setRows] = useState<UserRole[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve(roleId) L54-62: null이면 비우고, 아니면 서비스 sys.Sys05_UserRole.selectByRoleId(roleId)
  const retrieve = useCallback(async () => {
    if (roleId === undefined) { setRows([]); return; }
    try {
      setRows(await sysApi.searchUserRoles(roleId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [roleId]);

  // [E0] 화면 열림 (생성자 L23-42) → 초기화. 권한그룹이 바뀔 때마다 다시 조회
  useEffect(() => { void retrieve(); }, [retrieve]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9' }}>
      <div style={{ height: 50, flex: 'none' }} />
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<UserRole> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.userRoleId)} />
      </div>
    </div>
  );
};
