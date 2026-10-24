/**
 * [1454] 책무 > 01. 기본정보 > 책무담당자 등록 (N09)
 * AS-IS: myApp/client/vi/tdm/Tdm08_Tab_Manager.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L69-110: 가운데 = 툴바(검색 · [조회]) + 구분/수행부서 그리드(단일 체크), 동쪽 = 툴바([행 추가][행 삭제][저장]) + 담당자 적용기간 셀 편집 그리드
 * 함께: Emp00_Lookup_SelectSingle(성명 돋보기, 다른 도메인 — 기존 부품)
 * UX보강(10): 툴바 = SearchBar(UX-01), 저장 = 저장(n)(UX-03), 행추가는 맨 아래(03 원칙 17)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, message, Splitter } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmManager, TdmManagerInfo } from '@/types/tdm';
import { Button } from '@/components/button';
import { CellEditGrid, SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { TransInfo } from '@/types/emp';

const gb = gbFor<TdmManager>();
const gbInfo = gbFor<TdmManagerInfo>();
const FORMAT = 'YYYY-MM-DD';

/** buildGrid() L185-195 */
const buildGrid = () => [
  gb.textCenter('managerTypeName', 130, '구분'),  // L190
  gb.text('orgName', 250, '책무이행점검 수행부서'),  // L191
  gb.textCenter('personName', 120, '부서책무담당자'),  // L192
];

/** isDateOverlap() L291-311: 종료일이 없으면 무기한 */
const day = (v: string | null | undefined) => (v ? v.slice(0, 10) : null);
const isDateOverlap = (a: TdmManagerInfo, b: TdmManagerInfo) => {
  const start1 = day(a.startDate)!, end1 = day(a.endDate);
  const start2 = day(b.startDate)!, end2 = day(b.endDate);
  if (end1 === null && end2 === null) return true;
  if (end1 === null) return start1 <= end2!;
  if (end2 === null) return start2 <= end1;
  return !(end1 < start2 || start1 > end2);
};

/** update() L251-289 앞부분: 필수값 → 전체 행 쌍의 기간 겹침 */
const validate = (changed: TdmManagerInfo[], all: TdmManagerInfo[]) => {
  for (const r of changed) {
    if (!r.startDate) return '적용시작일을 입력하세요';
    if (r.personId == null) return '담당자를 선택하세요';
  }
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      if (day(all[i].startDate) && day(all[j].startDate) && isDateOverlap(all[i], all[j])) return '적용기간이 겹치는 담당자가 존재합니다.';
    }
  }
  return undefined;
};

export const Tdm08_Tab_Manager: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<TdmManager[]>([]);
  const [selected, setSelected] = useState<TdmManager | undefined>();
  const [lookupRow, setLookupRow] = useState<TdmManagerInfo | null>(null);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L219-233: tdm.Tdm08_ManagerInfo.selectByCompanyId (companyId는 서버, searchText "%…%")
  const retrieve = useCallback(async () => {
    try {
      setRows(await tdmApi.searchManagers(searchText));
      setSelected(undefined);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [searchText]);

  // [E0] 화면 열림 (생성자 L69-110) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, []);

  const crud = useGridCrud<TdmManagerInfo>({
    idField: 'managerInfoId',
    // retrieve(selectModel) L235-249: tdm.Tdm08_ManagerInfo.selectByManagerType
    search: useCallback(() => (selected ? tdmApi.searchManagerInfos(selected.managerType, selected.orgId) : Promise.resolve([])), [selected]),
    // update() L276-288: GridUpdate → tdm.Tdm08_ManagerInfo.update, 저장 뒤 retrieve()
    save: tdmApi.saveManagerInfos,
    remove: tdmApi.deleteManagerInfos,
    // insert() L313-325: 구분·조직은 고른 행, 적용시작일 = 오늘
    newRow: useCallback(() => ({
      managerType: selected?.managerType, orgId: selected?.orgId ?? null, startDate: dayjs().format(FORMAT), endDate: null,
    }), [selected]),
    firstEditField: 'startDate',
    validate,
    reloadAfterSave: true,
    deleteConfirm: n => `${n}건의 정보를 삭제하시겠습니까?`,
  });

  // [E7] grid.SelectionChanged (L169) → 고른 행이 있으면 retrieve(selectModel), 없으면 manageGrid 가림
  useEffect(() => {
    if (selected) void crud.retrieve(); else crud.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // [E8] lookupEmpInfo.TriggerClick (L202) → openLookupEmpInfo() L327-354
  const crudRows = useRef<TdmManagerInfo[]>([]);
  crudRows.current = crud.rows;
  const openLookupEmpInfo = (row: TdmManagerInfo) => {
    const current = crudRows.current.find(r => r.managerInfoId === row.managerInfoId) ?? row;
    if (!current.startDate) {
      message.warning('시작일자를 입력해주세요.');
      return;
    }
    setLookupRow(current);
  };

  // manageBuildGrid() L197-217
  const manageColumnDefs = useMemo(() => [
    gbInfo.date('startDate', 100, '적용시작일', { editor: 'date' }),  // L210
    gbInfo.date('endDate', 100, '적용종료일', { editor: 'date' }),  // L211
    gbInfo.textCenter('personName', 100, '성명', {  // L212 LookupTriggerField (lookupEmpInfo)
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: { data?: TdmManagerInfo; value?: string }) => (
        <>
          <AntButton type="text" size="small" icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); if (p.data) openLookupEmpInfo(p.data); }} />
          {p.value}
        </>
      ),
    }),
    gbInfo.textCenter('posName', 100, '직위'),  // L213
    gbInfo.text('orgName', 250, '본부(부서)'),  // L214
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  // lookupEmpTransInfo.open(startDate, true, callback) L335-345: 고른 사원의 성명·본부(부서)·직위를 행의 변경으로
  const onEmpResult = (emp: TransInfo | null) => {
    if (emp && lookupRow) {
      crud.updateRow(lookupRow.managerInfoId, { personId: emp.personId, personName: emp.korNm ?? null, orgName: emp.orgKorNm ?? null, posName: emp.posNm ?? null });
    }
    setLookupRow(null);
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel defaultSize="46%" min="30%">
          <div style={{ height: '100%', border: '1px solid #d9d9d9', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* [E1] searchText.KeyPress [Enter] (L114)·[E2] retrieveButton[조회].Select (L123) → retrieve() */}
            <SearchBar onSearch={() => retrieve()}>
              <SearchBar.Field label="검색">
                <SearchBar.Input style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
              </SearchBar.Field>
            </SearchBar>
            <div style={{ flex: 1, minHeight: 0 }}>
              <SingleGrid<TdmManager>
                rowData={rows}
                columnDefs={columnDefs}
                getRowId={p => String(p.data.managerInfoId)}
                rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
                onSelect={setSelected}
              />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ height: '100%', border: '1px solid #d9d9d9', borderLeft: 0, padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8, opacity: selected ? 1 : 0.5, pointerEvents: selected ? 'auto' : 'none' }}>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              {/* [E3] insertRButton[행 추가].Select (L130) → insert() */}
              <Button type="addRow" onClick={() => { if (selected) crud.addRow(); }}>행 추가</Button>
              {/* [E5] deleteRButton[행 삭제].Select [YES] (L142)·[E6] msgBox.DialogHide [YES] (L151) → delete() */}
              <Button type="removeRow" onClick={() => {
                if ((crud.gridRef.current?.api?.getSelectedRows() ?? []).length === 0) {
                  message.warning('선택된 내역이 없습니다.');
                  return;
                }
                crud.deleteChecked();
              }}>행 삭제</Button>
              {/* [E4] updateRButton[저장].Select (L136) → update() */}
              <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <CellEditGrid<TdmManagerInfo> crud={crud} columnDefs={manageColumnDefs} />
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>
      <Emp00_Lookup_SelectSingle
        open={lookupRow !== null}
        separateAddTitle
        noneLabel={null}
        transDate={day(lookupRow?.startDate) ?? dayjs().format(FORMAT)}
        onResult={onEmpResult}
        onClose={() => setLookupRow(null)}
      />
    </div>
  );
};
