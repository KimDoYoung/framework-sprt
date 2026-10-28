/**
 * 급여명세서(경영관리팀) (S21) — 경영관리 > 04. 급여관리 > 급여명세서(경영관리팀) #1273
 * AS-IS: myApp/client/vi/pay/Pay10_Tab_PersonListManager.java (253줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L58-144: BorderLayout — 위 툴바 50 (해당 연도 · 사원명 · [조회]) / 왼쪽 급여 목록 그리드 470 / 가운데 RD 보고서 폼(Pay10_Rd_PersonList, S20과 공용).
 * S20과 다른 점: 사원을 고른다(조회창 Emp00_Lookup_SelectSingle) · 열 때 조회하지 않는다 · 그리드 3열(일자·구분·실수령액)
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 일자 폭 UX-08(90)
 */
import React, { useMemo, useRef, useState } from 'react';
import { Input, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { payApi } from '@/api/pay';
import { empApi } from '@/api/emp';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { PayMonthPerson } from '@/types/pay';
import { TransInfo } from '@/types/emp';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { Pay10_Rd_PersonList } from './Pay10_Rd_PersonList';

const gb = gbFor<PayMonthPerson>();

export const Pay10_Tab_PersonListManager: React.FC = () => {
  const today = dayjs().format('YYYY-MM-DD');
  // [E0] 화면 열림 (생성자 L58-144): 해당 연도 = 올해. 열 때 조회하지 않는다
  const [yearText, setYearText] = useState(dayjs().format('YYYY'));
  const [personName, setPersonName] = useState('');
  const [personLookup, setPersonLookup] = useState<{ searchText: string } | null>(null);
  const [rows, setRows] = useState<PayMonthPerson[]>([]);
  const [loading, setLoading] = useState(false);
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  const gridRef = useRef<AgGridReact<PayMonthPerson>>(null);
  const personIdRef = useRef<number | null>(null);
  const committedRef = useRef('');
  const yearRef = useRef(yearText);
  yearRef.current = yearText;

  // buildGrid() L146-153: 일자 120 → 읽기 전용 90(UX-08) · 구분 80 · 실수령액 160
  const columnDefs = useMemo(() => [
    gb.date('date', 90, '일자'),
    gb.textCenter('payName', 80, '구분'),
    gb.long('deductionSum', 160, '실수령액'),
  ], []);

  // [E4] grid.CellClick (L138) → retrieveEditPage() L155-198: 지급·공제 항목 수 중 큰 값을 num으로 보고서(mrd Pay10_Rd_PersonList)를 연다
  const retrieveEditPage = async (row: PayMonthPerson) => {
    try {
      const num = await payApi.payMonthItemCount(row.monthId, false);
      const res = await rdApi.buildUrl({
        kind: 'viewer', mrd: 'Pay10_Rd_PersonList', options: '/rhtmlimportopt [2]',
        rv: { monthId: String(row.monthId), date: row.date, num: String(num) },
      });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '명세서 열기 실패'));
    }
  };

  // [E1] retrieveButton[조회].Select (L71) → retrieve() L200-222: 사원이 없으면 안내, 조회 뒤 첫 행 선택 + 보고서
  const retrieve = async () => {
    if (personIdRef.current == null) {
      message.warning('사원을 선택해주세요.');
      return;
    }
    setLoading(true);
    try {
      const list = await payApi.searchPersonPayMonths(personIdRef.current, yearRef.current);
      setRows(list);
      if (list.length > 0) {
        setTimeout(() => gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true, true), 0);
        await retrieveEditPage(list[0]);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E3] personName.ValueChange (L105): 비우면 사원 해제 + 그리드·보고서 비움, 아니면 재직(100) '%글자%'로 찾아 한 명이면 바로 선택·retrieve(), 아니면 openLookupPerson(글자)
  const onPersonCommit = async (text: string) => {
    if (text === committedRef.current) return;
    committedRef.current = text;
    if (text === '') {
      personIdRef.current = null;
      setRows([]);
      setRdUrl(null);
      return;
    }
    try {
      const list = await empApi.searchTransInfos(today, text, '100');
      if (list.length === 1) {
        committedRef.current = list[0].korNm ?? '';
        setPersonName(list[0].korNm ?? '');
        personIdRef.current = list[0].personId;
        await retrieve();
      } else {
        setPersonLookup({ searchText: text });
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E2] personName.TriggerClick (L99) → openLookupPerson() L224-248: 고르면 이름·ID를 채우고 retrieve()
  const onPersonPicked = async (row: TransInfo | null) => {
    setPersonLookup(null);
    if (row == null) return;
    committedRef.current = row.korNm ?? '';
    setPersonName(row.korNm ?? '');
    personIdRef.current = row.personId;
    await retrieve();
  };

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, display: 'flex', flexDirection: 'column' }}>
      <div style={{ boxSizing: 'border-box', border: '1px solid #d9d9d9', padding: 10 }}>
        <SearchBar onSearch={retrieve} loading={loading}>
          <SearchBar.Field label="해당 연도">
            <SearchBar.Input style={{ width: 70 }} value={yearText} onChange={e => setYearText(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="사원명">
            <Input
              style={{ width: 100 }}
              value={personName}
              allowClear
              suffix={<SearchOutlined style={{ cursor: 'pointer' }} onClick={() => setPersonLookup({ searchText: '' })} />}
              onChange={e => { setPersonName(e.target.value); if (e.target.value === '') void onPersonCommit(''); }}
              onPressEnter={e => void onPersonCommit((e.target as HTMLInputElement).value.trim())}
              onBlur={e => void onPersonCommit(e.target.value.trim())}
            />
          </SearchBar.Field>
        </SearchBar>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <div style={{ width: 470, boxSizing: 'border-box', border: '1px solid #d9d9d9', marginTop: -1 }}>
          <SingleGrid<PayMonthPerson>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.monthId)}
            onRowClicked={e => { if (e.data) retrieveEditPage(e.data); }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0, boxSizing: 'border-box', border: '1px solid #d9d9d9', borderLeft: 0, marginTop: -1 }}>
          <Pay10_Rd_PersonList url={rdUrl} />
        </div>
      </div>
      <Emp00_Lookup_SelectSingle open={personLookup != null} separateAddTitle searchText={personLookup?.searchText ?? ''} transDate={today} onResult={onPersonPicked} onClose={() => setPersonLookup(null)} />
    </div>
  );
};
