/**
 * [1414] 책무 > 01. 기본정보 > 직책별 책무 등록 (N08)
 * AS-IS: myApp/client/vi/tdm/Tdm20_Tab_Role.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L67-104: 가운데(여백 20, 테두리) = 툴바(기준일 · 전체보기 · 검색 · [조회][등록][삭제] · 오른쪽 [변경이력]) + 직책 그리드(MultiGrid, 체크·수정·직책 열은 왼쪽 고정)
 * 함께: Tdm20_Edit_Role(편집창), Tdm21_Lookup_RoleRelateTask(연결책무), Tdm22_Lookup_RoleRelateCncl(연결회의체), Tdm23_Lookup_RoleRelateOrg(연결부서),
 *       Tdm20_Lookup_SelectSingle(보고CEO), Tdm95_Lookup_ChangeHistory(변경이력)
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Modal, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmRole } from '@/types/tdm';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { AreaMessage } from '@/components/lookup/AreaMessage';
import { SearchBar } from '@/components/search';
import { Tdm20_Edit_Role } from './Tdm20_Edit_Role';
import { Tdm20_Lookup_SelectSingle } from './Tdm20_Lookup_SelectSingle';
import { Tdm21_Lookup_RoleRelateTask } from './Tdm21_Lookup_RoleRelateTask';
import { Tdm22_Lookup_RoleRelateCncl } from './Tdm22_Lookup_RoleRelateCncl';
import { Tdm23_Lookup_RoleRelateOrg } from './Tdm23_Lookup_RoleRelateOrg';
import { Tdm95_Lookup_ChangeHistory } from './Tdm95_Lookup_ChangeHistory';

const gb = gbFor<TdmRole>();
const FORMAT = 'YYYY-MM-DD';
const cntStr = (n: number) => (n === 0 ? '' : `${n}건`);
const left = { pinned: 'left' as const };

export const Tdm20_Tab_Role: React.FC = () => {
  const gridRef = useRef<AgGridReact<TdmRole>>(null);
  const [baseDate, setBaseDate] = useState<Dayjs>(dayjs());          // settings() L107 기준일 = 오늘
  const [allYn, setAllYn] = useState(true);                          // L110 전체보기 기본 체크 (기준일은 이때 바뀌어야 비활성)
  const [baseDisabled, setBaseDisabled] = useState(false);           // E1에서만 바뀐다 — 처음에는 켜져 있다(원본 그대로)
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<TdmRole[]>([]);
  const [edit, setEdit] = useState<{ mode: 'INSERT' | 'UPDATE'; role: TdmRole | null } | null>(null);
  const [taskRole, setTaskRole] = useState<TdmRole | null>(null);
  const [cnclRole, setCnclRole] = useState<TdmRole | null>(null);
  const [orgRole, setOrgRole] = useState<TdmRole | null>(null);
  const [ceoRole, setCeoRole] = useState<TdmRole | null>(null);
  const [history, setHistory] = useState<{ targetId: number | null } | null>(null);
  const [deleteIds, setDeleteIds] = useState<number[] | null>(null);

  // retrieve() L309-323: tdm.Tdm20_Role.selectByDate (companyId는 서버, baseDate, allYn, searchText = '%' + 글자 + '%' — 서버가 감싼다)
  const retrieve = async (over?: { allYn?: boolean }) => {
    try {
      setRows(await tdmApi.searchRoles({ baseDate: baseDate.format(FORMAT), allYn: over?.allYn ?? allYn, searchText }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L67-104) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  /** 연결 창이 닫힐 때 그 행의 건수 열을 바꾼다 (callback.execute(건수) → setRoleRelate…Cnt, grid.getStore().update) */
  const setCount = (id: number, key: 'roleRelateTaskCnt' | 'roleRelateCnclCnt' | 'roleRelateOrgCnt', count: number) =>
    setRows(prev => prev.map(r => (r.roleId === id ? { ...r, [key]: cntStr(count) } : r)));

  // buildGrid() L162-307
  const columnDefs = useMemo(() => [
    // L283 수정 아이콘(고정) → Tdm20_Edit_Role.edit(selectModel, baseDate, callback → retrieve())
    { ...iconCell<TdmRole>('edit', 'editRole', 35, '수정', row => setEdit({ mode: 'UPDATE', role: row })), ...left },
    { ...gb.text('roleName', 150, '직책'), ...left },  // L284 addTextFrozen
    gb.text('roleTypeName', 110, '직책그룹'),  // L289
    gb.text('roleTypeEtcName', 160, '기타그룹명'),  // L290
    gb.textArea('overview', 500, '개요'),  // L291
    gb.textCenter('roleRelateTaskCnt', 70, '연결책무'),  // L292
    // L293 actionCell02 → Tdm21_Lookup_RoleRelateTask.open(roleId, 건수 → 그 행의 연결책무)
    iconCell<TdmRole>('edit', 'editTask', 35, ' ', row => setTaskRole(row)),
    gb.textCenter('roleRelateCnclCnt', 70, '연결회의체'),  // L294
    // L295 actionCell03 → Tdm22_Lookup_RoleRelateCncl.open(roleId, 건수 → 그 행의 연결회의체)
    iconCell<TdmRole>('edit', 'editCncl', 35, ' ', row => setCnclRole(row)),
    gb.textCenter('roleRelateOrgCnt', 70, '연결부서'),  // L296
    // L297 actionCell04 → Tdm23_Lookup_RoleRelateOrg.open(selectModel, baseDate, 건수 → 그 행의 연결부서)
    iconCell<TdmRole>('edit', 'editOrg', 35, ' ', row => setOrgRole(row)),
    gb.textCenter('ceoRoleName', 160, '보고CEO'),  // L298
    // L299 actionCell05 → Tdm20_Lookup_SelectSingle.open("C", selectModel, 보고CEO 이름 → 그 행)
    iconCell<TdmRole>('edit', 'editCeo', 35, ' ', row => setCeoRole(row)),
    gb.date('startDate', 90, '사용시작일'),  // L300
    gb.date('endDate', 90, '사용종료일'),  // L301
    gb.textCenter('updName', 80, '변경자'),  // L302
    gb.textCenter('updDateStr', 150, '변경일시'),  // L303
    // L304 historyCell(ImageCell "View") → Tdm95_Lookup_ChangeHistory.open("tdm20_role", 그 행의 ID)
    iconCell<TdmRole>('view', 'history', 70, '변경이력 ', row => setHistory({ targetId: row.roleId })),
  ], []);

  // [E5] deleteButton[삭제].Select (L147) → deleteChk() L335-392: 미선택 안내 → 연결 검사 → "n건을 삭제하시겠습니까?" → [E7] YES → 삭제사유 → deleteRow()
  const deleteChk = async () => {
    const selected = gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) {
      message.warning('삭제대상을 선택하세요');
      return;
    }
    try {
      if ((await tdmApi.countRoleUse(selected.map(r => r.roleId))) !== 0) {
        message.warning('연결되어 있는 직책입니다');
        return;
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    Modal.confirm({
      title: '삭제',
      content: `${selected.length}건을 삭제하시겠습니까?`,
      width: 280,
      onOk: () => setDeleteIds(selected.map(r => r.roleId)),
    });
  };

  // deleteRow(historyMap) L394-411: tdm.Tdm20_Role.delete (삭제이력은 서버가 만든다)
  const deleteRow = async (reason: string | null) => {
    if (reason == null) {
      message.warning('삭제가 취소되었습니다 (사유 미입력)');
      return;
    }
    const ids = deleteIds ?? [];
    try {
      await tdmApi.deleteRoles(ids, reason);
      setRows(prev => prev.filter(r => !ids.includes(r.roleId)));
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          {/* [E3] retrieveButton[조회].Select (L135) → retrieve() 는 SearchBar의 [조회] */}
          <SearchBar
            onSearch={() => retrieve()}
            extra={
              <>
                {/* [E4] insertButton[등록].Select (L141) → insertRow() L325-333: Tdm20_Edit_Role.insert(baseDate, callback → retrieve()) */}
                <Button type="register" onClick={() => setEdit({ mode: 'INSERT', role: null })}>등록</Button>
                <Button type="delete" onClick={deleteChk}>삭제</Button>
              </>
            }
          >
            <SearchBar.Field label="기준일">
              <DatePicker style={{ width: 120 }} allowClear={false} disabled={baseDisabled} value={baseDate} format={FORMAT} onChange={d => d && setBaseDate(d)} />
            </SearchBar.Field>
            {/* [E1] allYn[전체보기].ValueChange [allYn.getValue()] (L112) → 기준일 활성/비활성 + retrieve() */}
            <Checkbox
              checked={allYn}
              onChange={e => { setAllYn(e.target.checked); setBaseDisabled(e.target.checked); void retrieve({ allYn: e.target.checked }); }}
            >
              전체보기
            </Checkbox>
            <SearchBar.Field label="검색">
              {/* [E2] searchText.KeyPress [Enter] (L126) → retrieve() */}
              <SearchBar.Input style={{ width: 200 }} placeholder="직책/직책그룹/개요" value={searchText} onChange={e => setSearchText(e.target.value)} />
            </SearchBar.Field>
          </SearchBar>
          <Space>
            {/* [E6] historyButton[변경이력].Select (L153) → Tdm95_Lookup_ChangeHistory.open("tdm20_role", null) */}
            <Button type="change" onClick={() => setHistory({ targetId: null })}>변경이력</Button>
          </Space>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<TdmRole>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.roleId)}
            selectionColumnDef={{ pinned: 'left' }}
          />
        </div>
      </div>
      <Tdm20_Edit_Role mode={edit?.mode ?? null} role={edit?.role} baseDate={baseDate.format(FORMAT)} onSaved={() => void retrieve()} onClose={() => setEdit(null)} />
      <Tdm21_Lookup_RoleRelateTask roleId={taskRole?.roleId ?? null} onClose={count => { if (taskRole) setCount(taskRole.roleId, 'roleRelateTaskCnt', count); setTaskRole(null); }} />
      <Tdm22_Lookup_RoleRelateCncl roleId={cnclRole?.roleId ?? null} onClose={count => { if (cnclRole) setCount(cnclRole.roleId, 'roleRelateCnclCnt', count); setCnclRole(null); }} />
      <Tdm23_Lookup_RoleRelateOrg roleId={orgRole?.roleId ?? null} baseDate={baseDate.format(FORMAT)} onClose={count => { if (orgRole) setCount(orgRole.roleId, 'roleRelateOrgCnt', count); setOrgRole(null); }} />
      <Tdm20_Lookup_SelectSingle
        open={!!ceoRole}
        roleType="C"
        roleModel={ceoRole}
        onSelect={r => setRows(prev => prev.map(x => (x.roleId === r.roleId ? { ...x, ceoRoleId: r.ceoRoleId, ceoRoleName: r.ceoRoleName } : x)))}
        onClose={() => setCeoRole(null)}
      />
      <Tdm95_Lookup_ChangeHistory targetTable={history ? 'tdm20_role' : null} targetId={history?.targetId} onClose={() => setHistory(null)} />
      <AreaMessage open={!!deleteIds} title="삭제사유" required onResult={deleteRow} onClose={() => setDeleteIds(null)} />
    </div>
  );
};
