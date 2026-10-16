/**
 * [1069] 관리자 > 01. 화면권한관리 > 권한그룹 관리  (A01)
 * AS-IS: myApp/client/vi/sys/Sys04_Tab_Role.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * UX보강(10) B12-1: 툴바 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03). 초기화(UX-02)는 조건이 1개라 없음
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { sysApi } from '@/api/sys';
import { Role } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';

const gb = gbFor<Role>();

/** AS-IS buildGrid() L112-120 — 기본권한·관리자권한 컬럼은 원본에서 주석 처리 */
const buildGrid = () => [
  gb.text('roleNm', 200, '*권한명', { editor: 'text' }),  // L114
  gb.textCenter('seq', 70, '조회순서', { editor: 'text' }),  // L115
  gb.text('note', 800, '권한설명', { editor: 'text' }),  // L118
];

export const Sys04_Tab_Role: React.FC = () => {
  const user = useLoginUser();
  const [roleName, setRoleName] = useState('');
  const columnDefs = useMemo(buildGrid, []);

  const crud = useGridCrud<Role>({
    idField: 'roleId',
    // AS-IS retrieve() L123-137: '%권한명%' + 로그인 회사
    search: useCallback(() => sysApi.searchRoles(roleName), [roleName]),
    save: sysApi.updateRoles,
    remove: sysApi.deleteRoles,
    // AS-IS insertRow() L184-190: 회사 = 로그인 회사
    newRow: useCallback(() => ({ companyId: user.companyId, roleNm: '' }), [user.companyId]),
    firstEditField: 'roleNm',
    // AS-IS update() L140-177: 불러온 행 전체에서 기본권한이 2개 이상이면 저장하지 않는다
    validate: (_changed, all) =>
      all.filter(r => r.defaultRole === 'true').length > 1 ? '기본권한은 1개만 지정 가능합니다.' : undefined,
    // AS-IS deleteChk() L192-210
    deleteConfirm: '선택한 권한을 삭제하시겠습니까?',
  });

  const retrieve = crud.retrieve;
  const update = crud.saveRows;
  const insertRow = crud.addRow;
  const deleteChk = crud.deleteChecked; // [E5] YES → deleteRow() L213-217: 체크된 행 삭제 (useGridCrud 안)

  // [E0] 화면 열림 (생성자 L53-110) → retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 12, background: '#fff', boxSizing: 'border-box' }}>
      {/* [E1] retrieveButton[조회].Select (L55) */}
      <SearchBar onSearch={retrieve} loading={crud.loading} extra={<>
        {/* [E2] updateButton[저장].Select (L61). 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={update}>저장</Button>
        {/* [E3] insertButton[등록].Select (L67) */}
        <Button type="register" onClick={insertRow}>등록</Button>
        {/* [E4] deleteButton[삭제].Select (L73) */}
        <Button type="delete" onClick={deleteChk}>삭제</Button>
      </>}>
        <SearchBar.Field label="권한명">
          <SearchBar.Input style={{ width: 180 }} value={roleName} onChange={e => setRoleName(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<Role> crud={crud} columnDefs={columnDefs} sortable={false} />
      </div>
    </div>
  );
};
