/**
 * 급여명세서 (S20) — 경영관리 > 04. 급여관리 > 급여명세서 #1272
 * AS-IS: myApp/client/vi/pay/Pay10_Tab_PersonList.java (177줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L47-97: BorderLayout — 위 툴바 50 (해당 연도 · [조회]) / 왼쪽 급여 목록 그리드 600 / 가운데 RD 보고서 폼(Pay10_Rd_PersonList).
 * 본인 급여만 보인다(사원은 서버가 로그인 사용자로 정한다). 열 때 바로 조회하고 첫 행을 고르면 보고서가 열린다
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 일자 폭 UX-08(90)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { payApi } from '@/api/pay';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { PayMonthPerson } from '@/types/pay';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Pay10_Rd_PersonList } from './Pay10_Rd_PersonList';

const gb = gbFor<PayMonthPerson>();

export const Pay10_Tab_PersonList: React.FC = () => {
  // [E0] 화면 열림 (생성자 L47-97): 해당 연도 = 올해 → retrieve()
  const [yearText, setYearText] = useState(dayjs().format('YYYY'));
  const [rows, setRows] = useState<PayMonthPerson[]>([]);
  const [loading, setLoading] = useState(false);
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  const gridRef = useRef<AgGridReact<PayMonthPerson>>(null);
  const yearRef = useRef(yearText);
  yearRef.current = yearText;

  // buildGrid() L99-108: 일자 100 · 구분 80 · 실수령액 100 · 급여액 100 · 소득세액 100
  const columnDefs = useMemo(() => [
    gb.date('date', 90, '일자'),
    gb.textCenter('payName', 80, '구분'),
    gb.long('deductionSum', 100, '실수령액'),
    gb.long('paySum', 100, '급여액'),
    gb.long('incomeTaxSum', 100, '소득세액'),
  ], []);

  // [E3] grid.CellClick (L90) → retrieveEditPage() L110-153: 지급·공제 항목 수 중 큰 값을 num으로 보고서(mrd Pay10_Rd_PersonList)를 연다
  const retrieveEditPage = async (row: PayMonthPerson) => {
    try {
      const num = await payApi.payMonthItemCount(row.monthId, true);
      const res = await rdApi.buildUrl({
        kind: 'viewer', mrd: 'Pay10_Rd_PersonList', options: '/rhtmlimportopt [2]',
        rv: { monthId: String(row.monthId), date: row.date, num: String(num) },
      });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '명세서 열기 실패'));
    }
  };

  // [E0][E1][E2] retrieve() L155-172 → pay.Pay10_Month.selectByYearPersonId (companyId·personId는 서버가 로그인 사용자로). 조회 뒤 첫 행 선택 + 보고서
  const retrieve = async () => {
    setLoading(true);
    try {
      const list = await payApi.searchMyPayMonths(yearRef.current);
      setRows(list);
      if (list.length > 0) {
        setTimeout(() => gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true, true), 0);
        await retrieveEditPage(list[0]);
      } else {
        setRdUrl(null);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면이 열리면 한 번 조회한다
  useEffect(() => { retrieve(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, display: 'flex', flexDirection: 'column' }}>
      {/* [E2] retrieveButton[조회].Select (L63) → retrieve(), [E1] yearText.KeyPress (L51) → retrieve() */}
      <div style={{ boxSizing: 'border-box', border: '1px solid #d9d9d9', padding: 10 }}>
        <SearchBar onSearch={retrieve} loading={loading}>
          <SearchBar.Field label="해당 연도">
            <SearchBar.Input style={{ width: 70 }} value={yearText} onChange={e => setYearText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <div style={{ width: 600, boxSizing: 'border-box', border: '1px solid #d9d9d9', marginTop: -1 }}>
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
    </div>
  );
};
