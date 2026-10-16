/**
 * [1197] 관리자 > 02. 시스템관리 > Admin 사용자 관리 (A22)
 * AS-IS: myApp/client/vi/sys/Sys80_Tab_AdminUserList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L44-90: 툴바(조회·등록·저장·삭제) + 셀 편집 그리드(행번호, 체크박스 다중)
 * UX보강(10): 툴바 = SearchBar(UX-01), 저장 = 저장(n)(UX-03). 조건이 없어 초기화(UX-02) 없음
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { sysApi } from '@/api/sys';
import { AdminUserList } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<AdminUserList>();

/** AS-IS buildGrid() L92-100 */
const buildGrid = () => [
  gb.text('userPhone', 150, '휴대폰', { editor: 'text' }),
  gb.text('userName', 100, '성명', { editor: 'text' }),
  gb.text('note', 500, '비고', { editor: 'text' }),
];

const NEW_ROW: Partial<AdminUserList> = {};

export const Sys80_Tab_AdminUserList: React.FC = () => {
  const columnDefs = useMemo(buildGrid, []);

  const crud = useGridCrud<AdminUserList>({
    idField: 'adminUserListId',
    // retrieve() L103-112 → sys.Sys80_AdminUserList.selectByAll
    search: sysApi.searchAdminUserLists,
    // update() L115-119: GridUpdate → sys.Sys80_AdminUserList.update (personId 파라미터는 서버가 쓰지 않는다)
    save: sysApi.updateAdminUserLists,
    remove: sysApi.deleteAdminUserLists,
    // insertRow() L122-126: GridInsertRow — 빈 행
    newRow: useCallback(() => NEW_ROW, []),
    firstEditField: 'userPhone',
    // deleteRow() L129-150
    deleteConfirm: n => `${n}건의 사용자 정보를 삭제하시겠습니까?`,
  });

  // [E0] 화면 열림 (생성자 L44-90) → retrieve()
  useEffect(() => {
    crud.retrieve();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E1] retrieveButton[조회].Select (L54) → retrieve() */}
      <SearchBar onSearch={crud.retrieve} loading={crud.loading} extra={<>
        {/* [E2] insertButton[등록].Select (L60) → insertRow() */}
        <Button type="register" onClick={crud.addRow}>등록</Button>
        {/* [E3] updateButton[저장].Select (L66) → update(). 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        {/* [E4] deleteButton[삭제].Select (L72) → deleteRow(), [E5] msgBox.DialogHide [YES] (L132) → sys.Sys80_AdminUserList.delete */}
        <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
      </>} />
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<AdminUserList> crud={crud} columnDefs={columnDefs} />
      </div>
    </div>
  );
};
