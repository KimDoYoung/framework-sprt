/**
 * 정기보고현황 (J06) — 준법감시 > 11. 임직원매매(준감인) > 정기보고현황 #1152
 * AS-IS: myApp/client/vi/flt/Flt10_Tab_EmpAppr.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L49-83: north = 툴바(기준년월 · 검색 · 미보고건만 보기 · [조회]) / center(50%) = 사원별 정기보고 그리드 / east(50%) = 선택한 사원의 상신문서(Flt10_Grid_EmpAppr), 가운데 분할선
 * 열릴 때 조회(L82). 조회하면 첫 행을 고르고, 고른 사원이 바뀌면 오른쪽을 다시 읽는다(L138).
 * 오른쪽 상세보기가 여는 전자결재 편집창(Apr01_Edit_ApprDoc, 다른 도메인)은 다음 단계
 * UX보강(10): 툴바 = SearchBar(UX-01)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, Input, message, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltEmpAppr } from '@/types/flt';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Flt10_Grid_EmpAppr } from './Flt10_Grid_EmpAppr';

const gb = gbFor<FltEmpAppr>();

export const Flt10_Tab_EmpAppr: React.FC = () => {
  const gridRef = useRef<AgGridReact<FltEmpAppr> | null>(null);
  // settings() L85-146: 기준년월 = 오늘의 한 달 전 yyyy.MM, 미보고건만 보기 = false
  const [dataYM, setDataYM] = useState(() => dayjs().subtract(1, 'month').format('YYYY.MM'));
  const [unApprYn, setUnApprYn] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<FltEmpAppr[]>([]);
  const [selected, setSelected] = useState<FltEmpAppr | undefined>(undefined);
  // retrieve()가 정한 기준일(기준년월의 말일) — 오른쪽 그리드가 쓴다
  const [stdDate, setStdDate] = useState<Dayjs>(() => dayjs().subtract(1, 'month').endOf('month'));
  const paramRef = useRef({ dataYM, unApprYn, searchText });
  paramRef.current = { dataYM, unApprYn, searchText };

  // retrieve() L159-182: 기준년월 yyyy.MM → 그 달의 말일을 stdDate로, 서비스 flt.Flt10_Tr.selectEmpAppr(companyId, stdDate, unApprYn, searchText "%…%") → 첫 행 선택
  const retrieve = useCallback(async (override?: Partial<typeof paramRef.current>) => {
    const p = { ...paramRef.current, ...override };
    const month = dayjs(`${p.dataYM.replace(/-/g, '.')}.01`, 'YYYY.MM.DD', true);
    if (!month.isValid()) {
      message.warning('기준년월을 yyyy.MM 형식으로 입력해주세요.');
      return;
    }
    const end = month.endOf('month');
    try {
      const list = await fltApi.searchEmpApprs(end.format('YYYY-MM-DD'), p.unApprYn, p.searchText);
      setStdDate(end);
      setRows(list);
      setTimeout(() => gridRef.current?.api.getDisplayedRowAtIndex(0)?.setSelected(true, true));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L49-83) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, [retrieve]);

  // buildGrid() L148-157
  const columnDefs = useMemo(() => [
    gb.text('orgName', 150, '본부(부서)'),
    gb.textCenter('personName', 120, '사원명'),
    gb.textCenter('oathYnName', 120, '서약서 서명유무'),
    gb.textCenter('checkCycleName', 120, '점검주기'),
    gb.textCenter('checkApprName', 150, '상신상태'),
  ], []);

  // [E5] grid.SelectionChanged [선택>0] (L138) → gridEmpAppr.retrieve(선택 사원, stdDate)
  const onSelect = (row: FltEmpAppr | undefined) => { if (row) setSelected(row); };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E4] retrieveButton[조회].Select (L126) → retrieve(). [E3] searchText.KeyPress [Enter] (L117) → retrieve() */}
      <SearchBar onSearch={() => retrieve()}>
        <SearchBar.Field label="기준년월">
          {/* [E1] dataYMText.KeyPress [Enter] (L97) → retrieve() */}
          <Input style={{ width: 70 }} maxLength={7} value={dataYM} onChange={e => setDataYM(e.target.value)} onPressEnter={() => retrieve()} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 200 }} placeholder="본부(부서)/사원명" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
        {/* [E2] unApprYn[미보고건만 보기].ValueChange (L108) → retrieve() */}
        <Checkbox checked={unApprYn} onChange={e => { setUnApprYn(e.target.checked); void retrieve({ unApprYn: e.target.checked }); }}>미보고건만 보기</Checkbox>
      </SearchBar>
      <Splitter style={{ flex: 1, minHeight: 0 }}>
        <Splitter.Panel defaultSize="50%" min={200}>
          <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
            <SingleGrid<FltEmpAppr>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.trId)}
              onSelect={onSelect}
            />
          </div>
        </Splitter.Panel>
        <Splitter.Panel min={200}>
          <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
            <Flt10_Grid_EmpAppr emp={selected} stdDate={stdDate} />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
