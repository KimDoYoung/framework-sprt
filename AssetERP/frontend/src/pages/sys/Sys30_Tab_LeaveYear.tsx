/**
 * [1036] 경영관리 > 02. 휴가/출장 관리 > 연차휴가 결산기준  (A26)
 * AS-IS: myApp/client/vi/sys/Sys30_Tab_LeaveYear.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃(생성자 L33-86): 위 = 툴바(높이 50, 조회·저장·행 추가·행 삭제), 왼쪽 20% = 회사 휴가 설정 그리드(1행, 분할 조절),
 * 가운데 80% = 근속연수별 연차개수 `Sys30_Grid_LeaveYear`. 열 때 바로 조회한다
 * UX보강(10) B12-2: 조회 버튼 로딩(UX-01), 저장(n)(UX-03, 두 그리드 변경 합). 조건이 없어 SearchBar·초기화(UX-02) 없음
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Splitter, message } from 'antd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Code, LeaveSetting } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Sys30_Grid_LeaveYear, useLeaveYearCrud } from './Sys30_Grid_LeaveYear';

const gb = gbFor<LeaveSetting>();

/** AS-IS buildGrid() L88-106 — monthComboBox Collapse(E5)가 leaveMonthCode·leaveMonthName을 함께 바꾼다 */
const buildGrid = (months: Code[]) => [
  gb.boolean('leaveYn', 100, '휴가초과<br>허용여부', { editable: true }),  // L102 addBoolean
  gb.text('leaveMonthName', 100, '휴가결산월', {
    editor: 'select',
    values: months.map(c => c.name),
    valueSetter: p => {
      p.data.leaveMonthName = p.newValue;
      p.data.leaveMonthCode = months.find(c => c.name === p.newValue)?.code ?? null;
      return true;
    },
  }),  // L103
];

export const Sys30_Tab_LeaveYear: React.FC = () => {
  const [months, setMonths] = useState<Code[]>([]);
  const columnDefs = useMemo(() => buildGrid(months), [months]);
  const leaveYear = useLeaveYearCrud();

  // ComboBoxField("MonthsCode") — 만들 때 조회
  useEffect(() => { sysApi.searchCodes('MonthsCode').then(setMonths).catch(() => setMonths([])); }, []);

  // 왼쪽 그리드: 로그인 회사 한 행. 임시 ID 없이 companyId가 행 ID (AS-IS Sys01_CompanyModel)
  const company = useGridCrud<LeaveSetting>({
    idField: 'companyId',
    // retrieve() L109-114: sys.Sys01_Company.selectById(companyId)
    search: useCallback(async () => [await sysApi.getLeaveSetting()], []),
    // update() L117-121: GridUpdate → sys.Sys01_Company.update (바뀐 행만)
    save: useCallback(async (rows: LeaveSetting[]) => [await sysApi.updateLeaveSetting(rows[0])], []),
    remove: useCallback(async () => 0, []),
    newRow: useCallback(() => ({}), []),
    // 체크박스 없는 단일 행 편집 — 저장 완료 메시지는 오른쪽 그리드가 말한다
  });

  // [E0] 화면 열림 (생성자 L33-86) → retrieve()
  // [E1] retrieveButton[조회].Select (L34) → retrieve() L109-114: 회사 행 조회 + gridLeaveYear.retrieve()
  const retrieve = async () => {
    await company.retrieve();
    await leaveYear.retrieve();
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, []);

  // [E2] updateButton[저장].Select (L40) → update() L117-121: 회사 행 저장 후 연차 그리드 저장
  const update = async () => {
    try {
      await company.saveRows();
      await leaveYear.saveRows();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E3] addRowButton[행 추가].Select (L46) → insertRow() L124-126: gridLeaveYear.insertRow()
  const insertRow = () => leaveYear.addRow();

  // [E4] deleteRowButton[행 삭제].Select (L52) → deleteRow() L129-131: gridLeaveYear.deleteRow()
  const deleteRow = () => leaveYear.deleteChecked();

  // UX-03: 두 그리드의 저장 안 한 변경 수를 더한다
  const changes = {
    added: company.changes.added + leaveYear.changes.added,
    modified: company.changes.modified + leaveYear.changes.modified,
    editing: company.changes.editing || leaveYear.changes.editing,
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '20px 20px 20px', boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: 50, flex: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', border: '1px solid #f0f0f0' }}>
        <Button type="search" onClick={retrieve}>조회</Button>
        <Button type="save" count={changes} onClick={update}>저장</Button>
        <Button type="addRow" onClick={insertRow}>행 추가</Button>
        <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
      </div>
      <Splitter style={{ flex: 1, minHeight: 0 }}>
        <Splitter.Panel defaultSize="20%" min={150}>
          {/* [E5] monthComboBox[MonthsCode].Collapse (L94) → leaveMonthCode·leaveMonthName 함께 변경 (buildGrid의 valueSetter) */}
          <CellEditGrid<LeaveSetting> crud={company} columnDefs={columnDefs} sortable={false}
            rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }} />
        </Splitter.Panel>
        <Splitter.Panel>
          <Sys30_Grid_LeaveYear crud={leaveYear} />
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
