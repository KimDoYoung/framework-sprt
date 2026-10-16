/**
 * 근속연수별 연차개수 그리드 (A26) — Sys30_Tab_LeaveYear 오른쪽(가운데 80%)
 * AS-IS: myApp/client/vi/sys/Sys30_Grid_LeaveYear.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 체크박스 다중 셀 편집 그리드. 버튼이 없다 — 부모 Sys30_Tab_LeaveYear의 조회·저장·행 추가·행 삭제가 부른다
 */
import React, { useCallback, useMemo } from 'react';
import { sysApi } from '@/api/sys';
import { LeaveYear } from '@/types/sys';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';

const gb = gbFor<LeaveYear>();

/** AS-IS buildGrid() L35-43 (setChecked MULTI) */
const buildGrid = () => [
  gb.text('year', 120, '근속연수', { editor: 'text' }),  // L39
  gb.text('leaveDays', 120, '연차개수', { editor: 'text' }),  // L40
];

/**
 * AS-IS 클래스의 retrieve() L46-50 / update() L53-57 / insertRow() L60-65 / deleteRow() L68-72를 crud로 모은다
 * (crud.retrieve / saveRows / addRow / deleteChecked). 부모가 버튼으로 부른다
 */
export function useLeaveYearCrud() {
  const user = useLoginUser();
  return useGridCrud<LeaveYear>({
    idField: 'leaveYearId',
    // retrieve() L46-50: companyId = 로그인 회사 → sys.Sys30_LeaveYear.selectByAll
    search: sysApi.searchLeaveYears,
    // update() L53-57: sys.Sys30_LeaveYear.update
    save: sysApi.updateLeaveYears,
    // deleteRow() L68-72: GridDeleteData(체크한 행) — 확인 창이 없다
    remove: sysApi.deleteLeaveYears,
    deleteConfirm: false,
    // insertRow() L60-65: leaveYear.setCompanyId(LoginUser.getCompanyId())
    newRow: useCallback(() => ({ companyId: user.companyId }), [user.companyId]),
    firstEditField: 'year',
  });
}

interface Props {
  crud: ReturnType<typeof useLeaveYearCrud>;
}

export const Sys30_Grid_LeaveYear: React.FC<Props> = ({ crud }) => {
  // [E0] 화면 열림 (생성자 L27-32) → 초기화: 그리드를 가운데에 놓는다
  const columnDefs = useMemo(buildGrid, []);
  return <CellEditGrid<LeaveYear> crud={crud} columnDefs={columnDefs} sortable={false} />;
};
