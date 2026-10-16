/**
 * [1303] 커뮤니티 > 91. AssetERP > AssetERP 관리팀 / [1304] 관리자 > 09. 기타 > AssetERP 관리팀 등록 (A32)
 * AS-IS: myApp/client/vi/sys/Sys92_Tab_ManagementTeam.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L51-74: 툴바(조회·등록·저장·삭제) + 그리드(행번호). 두 메뉴가 같은 클래스를 쓴다 — 로그인 회사가 관리자 회사(0)면
 *   셀 편집 그리드 + 4개 버튼(buildGrid L115-158, settings L76-113), 아니면 읽기 전용 그리드 + 조회 버튼만. (A31 Sys91과 같은 구조)
 * UX보강(10): 툴바 = SearchBar(UX-01), 저장 = 저장(n)(UX-03). 조건이 없어 초기화(UX-02) 없음
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button as AntButton } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { CustomCellRendererProps } from 'ag-grid-react';
import dayjs from 'dayjs';
import { sysApi } from '@/api/sys';
import { ManagementTeam } from '@/types/sys';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { isSysAdmin, useLoginUser } from '@/hooks/useLoginUser';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';

type Row = ManagementTeam;
const gb = gbFor<Row>();

/** AS-IS buildGrid() L130-137 — 관리자 회사: 성명은 돋보기로 사원찾기(글자는 직접 못 고침), 나머지 셀 편집 */
const buildEditGrid = (openLookup: (r: Row) => void) => [
  gb.textCenter('posNm', 100, '직위'),  // L130
  gb.textCenter('personNm', 100, '성명', {  // L131 lookupEmpInfo(LookupTriggerField)
    cellStyle: { color: '#1677ff' },
    onCellDoubleClicked: p => { if (p.data) openLookup(p.data); },
    cellRenderer: (p: CustomCellRendererProps<Row>) => (
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.value}</span>
        <AntButton type="text" size="small" icon={<SearchOutlined />}
          onClick={e => { e.stopPropagation(); if (p.data) openLookup(p.data); }} />
      </span>
    ),
  }),
  gb.textArea('chargePart', 300, '현재 담당 업무', { editor: 'largeText' }),  // L132
  gb.textCenter('officeTelNo', 150, '내선번호'),  // L133
  gb.text('emailAddr', 200, '이메일'),  // L134
  gb.textCenter('workYear', 120, '관련업무<br>근속년수', { editor: 'text' }),  // L135
  gb.textArea('mainCareer', 550, '주요경력', { editor: 'largeText' }),  // L136
];

/** AS-IS buildGrid() L139-155 — 그 밖의 회사: 읽기 전용 */
const buildViewGrid = () => [
  gb.textCenter('posNm', 100, '직위'),  // L140
  gb.textCenter('personNm', 100, '성명'),  // L141
  gb.textArea('chargePart', 300, '현재 담당 업무'),  // L142
  gb.textCenter('officeTelNo', 150, '내선번호'),  // L143
  gb.text('emailAddr', 200, '이메일'),  // L144
  gb.textCenter('workYear', 120, '관련업무<br>근속년수'),  // L145
  gb.textArea('mainCareer', 550, '주요경력'),  // L146
];

export const Sys92_Tab_ManagementTeam: React.FC = () => {
  const user = useLoginUser();
  const editable = isSysAdmin(user);  // AS-IS LoginUser.getCompanyId().equals(0l)
  const [lookupRow, setLookupRow] = useState<Row | null>(null);

  const crud = useGridCrud<Row>({
    idField: 'managementTeamId',
    // retrieve() L161-170 → sys.Sys92_ManagementTeam.selectByAll
    search: sysApi.searchManagementTeams,
    // update() L173-176: GridUpdate → sys.Sys92_ManagementTeam.update
    save: sysApi.updateManagementTeams,
    remove: sysApi.deleteManagementTeams,
    // insertRow() L179-184: GridInsertRow, companyId = 1
    newRow: useCallback(() => ({ companyId: 1 }), []),
    firstEditField: 'chargePart',
    // deleteChk() L186-204
    deleteConfirm: n => `${n}건을 삭제하시겠습니까?`,
  });

  const columnDefs = useMemo(() => (editable ? buildEditGrid(setLookupRow) : buildViewGrid()), [editable]);

  // [E5] lookupEmpInfo.TriggerClick (L118) → Emp00_Lookup_SelectSingle.open(1l, 오늘, callback): 고른 행에 addChange(personId, posName, personName, officeTelNo, emailAddress)
  const onLookup = (row: TransInfo | null) => {
    const target = lookupRow;
    setLookupRow(null);
    if (!row || !target) return;
    crud.updateRow(target.managementTeamId, {
      personId: row.personId, posNm: row.posNm ?? null, personNm: row.korNm ?? null,
      officeTelNo: row.officeTelNo ?? null, emailAddr: row.emailAddr ?? null,
    });
  };

  // [E0] 화면 열림 (생성자 L51-74) → settings(), retrieve()
  useEffect(() => {
    crud.retrieve();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E1] retrieveButton[조회].Select (L77) → retrieve() */}
      <SearchBar onSearch={crud.retrieve} loading={crud.loading} extra={editable && <>
        {/* [E2] insertButton[등록].Select (L83) → insertRow() */}
        <Button type="register" onClick={crud.addRow}>등록</Button>
        {/* [E3] updateButton[저장].Select (L89) → update(). 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        {/* [E4] deleteButton[삭제].Select (L95) → deleteChk(), [E6] msgBox.DialogHide [YES] (L189) → deleteRow() → sys.Sys92_ManagementTeam.delete */}
        <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
      </>} />
      <div style={{ flex: 1, minHeight: 0 }}>
        {editable
          ? <CellEditGrid<Row> crud={crud} columnDefs={columnDefs} rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }} />
          : <SingleGrid<Row> rowData={crud.rows} columnDefs={columnDefs} getRowId={p => String(p.data.managementTeamId)} />}
      </div>
      {editable && (
        <Emp00_Lookup_SelectSingle
          open={lookupRow != null}
          companyId={1}
          transDate={dayjs().format('YYYY-MM-DD')}
          onClose={() => setLookupRow(null)}
          onResult={onLookup}
        />
      )}
    </div>
  );
};
