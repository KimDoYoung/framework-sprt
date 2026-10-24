/**
 * [1415] 책무 > 01. 기본정보 > 회의체 등록 (N07)
 * AS-IS: myApp/client/vi/tdm/Tdm05_Tab_Cncl.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L53-79: 가운데 = 툴바(기준일 · 전체보기 · [조회][등록][삭제]) + 회의체 그리드(MultiGrid)
 * 함께: Tdm05_Edit_Cncl(편집창), Tdm22_Lookup_RoleRelateCncl2(직책 연결, 안에 Tdm20_Lookup_SelectMulti)
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmCouncil } from '@/types/tdm';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Tdm05_Edit_Cncl } from './Tdm05_Edit_Cncl';
import { Tdm22_Lookup_RoleRelateCncl2 } from './Tdm22_Lookup_RoleRelateCncl2';

const gb = gbFor<TdmCouncil>();
const FORMAT = 'YYYY-MM-DD';

export const Tdm05_Tab_Cncl: React.FC = () => {
  const gridRef = useRef<AgGridReact<TdmCouncil>>(null);
  const [baseDate, setBaseDate] = useState<Dayjs>(dayjs());          // settings() L82 기준일 = 오늘
  const [allYn, setAllYn] = useState(true);                          // L85 전체보기 기본 체크 (기준일은 이때 바뀌어야 비활성)
  const [baseDisabled, setBaseDisabled] = useState(false);           // E1에서만 바뀐다 — 처음에는 켜져 있다(원본 그대로)
  const [rows, setRows] = useState<TdmCouncil[]>([]);
  const [edit, setEdit] = useState<{ mode: 'INSERT' | 'UPDATE'; council: TdmCouncil | null } | null>(null);
  const [relate, setRelate] = useState<TdmCouncil | null>(null);

  // retrieve() L175-188: tdm.Tdm05_Cncl.selectByDate (companyId는 서버, baseDate, allYn)
  const retrieve = async (over?: { allYn?: boolean }) => {
    try {
      setRows(await tdmApi.searchCouncils({ baseDate: baseDate.format(FORMAT), allYn: over?.allYn ?? allYn }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L53-79) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  // buildGrid() L119-173
  const columnDefs = useMemo(() => [
    // L121 수정 아이콘 → Tdm05_Edit_Cncl.edit(selectModel, callback → retrieve())
    iconCell<TdmCouncil>('edit', 'editCncl', 50, '수정', row => setEdit({ mode: 'UPDATE', council: row })),
    gb.text('cnclName', 200, '회의체'),  // L162
    gb.textCenter('openCycleName', 80, '개최주기'),  // L163
    gb.textArea('mainDecision', 630, '주요의결사항'),  // L164
    gb.date('startDate', 100, '사용시작일'),  // L165
    gb.date('endDate', 100, '사용종료일'),  // L166
    gb.textCenter('relateRoleCnt', 70, '연결직책'),  // L167
    // L136 relateRoleCell → Tdm22_Lookup_RoleRelateCncl2.open(cnclId, baseDate, 건수 → 그 행의 연결직책)
    iconCell<TdmCouncil>('edit', 'editRole', 35, '', row => setRelate(row)),
    gb.textCenter('updName', 100, '변경자'),  // L169
    gb.textCenter('updDateStr', 150, '변경일시'),  // L170
  ], []);

  // [E4] deleteButton[삭제].Select (L111) → deleteChk() L200-218: "n건을 삭제하시겠습니까?" → [E5] YES → deleteRow() L220-235
  const deleteChk = () => {
    const selected = gridRef.current?.api?.getSelectedRows() ?? [];
    Modal.confirm({
      title: '삭제',
      content: `${selected.length}건을 삭제하시겠습니까?`,
      width: 280,
      onOk: () => deleteRow(selected),
    });
  };

  // deleteRow() L220-235: tdm.Tdm05_Cncl.delete — 연결된 직책이 있으면 서버가 메시지로 거절
  const deleteRow = async (selected: TdmCouncil[]) => {
    if (selected.length === 0) return;
    const ids = selected.map(r => r.cnclId);
    try {
      await tdmApi.deleteCouncils(ids);
      setRows(prev => prev.filter(r => !ids.includes(r.cnclId)));
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L99) → retrieve() 는 SearchBar의 [조회] */}
        <SearchBar
          onSearch={() => retrieve()}
          extra={
            <>
              {/* [E3] insertButton[등록].Select (L105) → insertRow() L190-198: Tdm05_Edit_Cncl.insert(callback → retrieve()) */}
              <Button type="register" onClick={() => setEdit({ mode: 'INSERT', council: null })}>등록</Button>
              <Button type="delete" onClick={deleteChk}>삭제</Button>
            </>
          }
        >
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 120 }} allowClear={false} disabled={baseDisabled} value={baseDate} format={FORMAT} onChange={d => d && setBaseDate(d)} />
          </SearchBar.Field>
          {/* [E1] allYn[전체보기].ValueChange [allYn.getValue()] (L87) → 기준일 활성/비활성 + retrieve() */}
          <Checkbox
            checked={allYn}
            onChange={e => { setAllYn(e.target.checked); setBaseDisabled(e.target.checked); void retrieve({ allYn: e.target.checked }); }}
          >
            전체보기
          </Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<TdmCouncil> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.cnclId)} />
        </div>
      </div>
      <Tdm05_Edit_Cncl mode={edit?.mode ?? null} council={edit?.council} onSaved={() => void retrieve()} onClose={() => setEdit(null)} />
      <Tdm22_Lookup_RoleRelateCncl2
        cnclId={relate?.cnclId ?? null}
        onClose={count => {
          // callback L148-162: 건수를 그 행의 연결직책(0이면 빈칸, 아니면 "n건")으로
          if (relate) {
            const id = relate.cnclId;
            setRows(prev => prev.map(r => (r.cnclId === id ? { ...r, relateRoleCnt: count === 0 ? '' : `${count}건` } : r)));
          }
          setRelate(null);
        }}
      />
    </div>
  );
};
