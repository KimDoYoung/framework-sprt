/**
 * [1399] 자금관리 > 20. 사업비관리 > 사업비발생현황 (U12)
 * AS-IS: myApp/client/vi/pay/Pay50_Tab_AccountSumList.java (211줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L47-75: 가운데(여백 20, 테두리) = 툴바(기준년도 50 "YYYY" · 검색 200 "계정과목" · [조회] · [엑셀다운로드]) + 계정과목별 1~12월·계 그리드(SingleGrid, 합계 행 없음)
 * 열 때 한 번 조회한다. 기준년도는 오늘의 연도
 * 스타일: SG (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 2개라 넣지 않는다
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import { payApi } from '@/api/pay';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { PayExpenseAccountSum } from '@/types/pay';
import { rdDownload } from '@/utils/rdDownload';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<PayExpenseAccountSum>();

export const Pay50_Tab_AccountSumList: React.FC = () => {
  const [year, setYear] = useState(() => dayjs().format('YYYY'));   // settings() L77-80: 오늘의 연도
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<PayExpenseAccountSum[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  // retrieve() L139-153: pay.Pay50_Expense.selectExpenseAccountSum (companyId는 서버, year, searchText = '%' + 글자 + '%' — 서버가 감싼다)
  const retrieve = async () => {
    setLoading(true);   // grid.mask("Loading")
    try {
      setRows(await payApi.searchExpenseAccountSums(year, searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L47-75) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  // [E4] downloadButton[엑셀다운로드].Select (L109) → createRdExcel() L155-206: sys.Sys99_Print.insertRdAccountSumList(companyId, personId, "Pay50_Tab_AccountSumList", year, searchText)
  //   → 성공이면 RDUtil.download(page CommonInvokerDownload.jsp · mrd Pay50_Rd_AccountSumList · options "/rexportopt [6] /rxlsopt [100]" · 파일 "{년도}년도 사업비발생현황.xlsx" · rv rdGroupId·year)
  const createRdExcel = async () => {
    setBusy(true);   // grid.mask("Loading")
    try {
      const groupId = await payApi.rdPrintExpenseAccountSums(year, searchText);
      const res = await rdApi.buildUrl({
        kind: 'download',
        mrd: 'Pay50_Rd_AccountSumList',
        options: '/rexportopt [6] /rxlsopt [100]',
        exportType: 'xlsx',
        fileName: `${year}년도 사업비발생현황.xlsx`,
        rv: { rdGroupId: groupId, year },
      });
      await rdDownload(res);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    } finally {
      setBusy(false);
    }
  };

  // buildGrid() L117-137 (월 열 12개 폭 100, 합계 행 없음)
  const columnDefs = useMemo(() => [
    gb.text('accountName', 200, '계정과목'),  // L121
    ...Array.from({ length: 12 }, (_, i) => {
      const m = String(i + 1).padStart(2, '0');
      return gb.long(`month${m}Amt` as keyof PayExpenseAccountSum, 100, `${i + 1}월`);  // L122-133
    }),
    gb.long('yearAmt', 100, '계'),  // L134
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L102) → retrieve() */}
        <SearchBar
          onSearch={retrieve}
          loading={loading}
          extra={
            <Button type="download" loading={busy} onClick={createRdExcel}>엑셀다운로드</Button>
          }
        >
          <SearchBar.Field label="기준년도">
            {/* [E1] yearText.KeyPress [Enter] (L82) → retrieve() */}
            <SearchBar.Input style={{ width: 70 }} placeholder="YYYY" value={year} onChange={e => setYear(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            {/* [E2] searchText.KeyPress [Enter] (L93) → retrieve() */}
            <SearchBar.Input style={{ width: 200 }} placeholder="계정과목" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<PayExpenseAccountSum> rowData={rows} columnDefs={columnDefs} loading={loading || busy} getRowId={p => String(p.data.expenseId)} />
        </div>
      </div>
    </div>
  );
};
