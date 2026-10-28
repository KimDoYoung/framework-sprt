/**
 * 급여항목조회 (S19) — 경영관리 > 04. 급여관리 > 급여항목조회 #1285
 * AS-IS: myApp/client/vi/pay/Pay10_Tab_MonthSearch.java (247줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L160-179 / settings() L63-158: 툴바 50 (조회기간 [시작일] ~ [종료일] · 항목 칸 "전체" · 검색 칸 "사원/항목명" · [조회][출력/다운로드])
 *   + 보기 그리드(체크 다중: 지급일 100 · 지급구분 100 · 사번 100 · 사원명 150 · 직급 100 · 항목구분 150 · 항목명 250 · 금액 150).
 * 조회기간 기본값 = 이번 달 1일 ~ 이번 달 말일. 항목 조회창 Pay20_Lookup_MonthItem은 S17 것을 재사용한다
 * 출력 창은 공통 RdViewer가 맡는다(AS-IS RDViewer.viewer, mrd Pay10_Rd_MonthSearch)
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 지급일 폭 UX-08(90)
 */
import React, { useMemo, useRef, useState } from 'react';
import { DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { payApi } from '@/api/pay';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { PayItem, PayMonthItemDate } from '@/types/pay';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { RdViewer } from '@/components/lookup/RdViewer';
import { Pay20_Lookup_MonthItem } from './Pay20_Lookup_MonthItem';

const gb = gbFor<PayMonthItemDate>();
const FORMAT = 'YYYY-MM-DD';

export const Pay10_Tab_MonthSearch: React.FC = () => {
  // [E0] 화면 열림 (생성자 L160-179) → settings(): 조회기간 = 이번 달 1일 ~ 말일, 항목 = "전체"(코드 "%"), 검색 = "사원/항목명". 열 때 조회는 하지 않는다
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs().endOf('month'));
  // itemCode: 항목 칸이 정한 코드("%" = 전체), itemName: 칸에 보이는 글자
  const [itemCode, setItemCode] = useState('%');
  const [itemName, setItemName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [itemLookupOpen, setItemLookupOpen] = useState(false);
  const [rows, setRows] = useState<PayMonthItemDate[]>([]);
  const [loading, setLoading] = useState(false);
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  const [rdLoading, setRdLoading] = useState(false);
  const gridRef = useRef<AgGridReact<PayMonthItemDate>>(null);

  // buildGrid() L181-197: 지급일 · 지급구분 · 사번 · 사원명 · 직급 · 항목구분 · 항목명 · 금액
  const columnDefs = useMemo(() => [
    gb.date('payDate', 90, '지급일'),
    gb.textCenter('payName', 100, '지급구분'),
    gb.textCenter('personNo', 100, '사번'),
    gb.textCenter('personName', 150, '사원명'),
    gb.textCenter('posName', 100, '직급'),
    gb.textCenter('itemTypeName', 150, '항목구분'),
    gb.text('itemName', 250, '항목명'),
    gb.long('itemAmt', 150, '금액'),
  ], []);

  // [E2][E3] retrieve() L199-220 → pay.Pay11_MonthItem.selectByDate (companyId는 서버가 로그인 사용자로). 조회 뒤 첫 행 선택
  const retrieve = async () => {
    setLoading(true);
    try {
      const list = await payApi.searchMonthItemsByDate({
        startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), itemCode, searchText,
      });
      setRows(list);
      setTimeout(() => gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true, true), 0);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E1] itemName.TriggerClick (L92) → lookupItemList() L222-237: 고르면 항목 코드·이름, [취소]면 코드 "%"·이름 비움
  const lookupItemList = (item: PayItem | null) => {
    setItemLookupOpen(false);
    setItemCode(item?.itemCd ?? '%');
    setItemName(item?.itemName ?? '');
  };

  // [E4] downLoadButton[출력/다운로드].Select (L115): insertRdMonthSearch → RDViewer.viewer(mrd Pay10_Rd_MonthSearch, rv rdGroupId·startDate·closeDate)
  const download = async () => {
    setRdLoading(true);
    try {
      const rdGroupId = await payApi.rdPrintMonthItemsByDate({
        startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), itemCode, searchText,
      });
      const res = await rdApi.buildUrl({
        kind: 'viewer', mrd: 'Pay10_Rd_MonthSearch', options: '/rhtmlimportopt [2]',
        rv: { rdGroupId, startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT) },
      });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    } finally {
      setRdLoading(false);
    }
  };

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20 }}>
      <div style={{ height: '100%', boxSizing: 'border-box', border: '1px solid #d9d9d9', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L109) → retrieve() */}
        <SearchBar
          onSearch={retrieve}
          loading={loading}
          extra={
            /* [E4] downLoadButton[출력/다운로드].Select (L115) */
            <Button type="download" onClick={download} loading={rdLoading}>출력/다운로드</Button>
          }
        >
          <SearchBar.Field label="조회기간">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT}
                onChange={d => { if (d) setStartDate(d); }} />
              <span>~</span>
              <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT}
                onChange={d => { if (d) setCloseDate(d); }} />
            </span>
          </SearchBar.Field>
          <SearchBar.Field label="항목">
            {/* [E1] itemName.TriggerClick (L92) → lookupItemList(). x = 항목 "전체"로 되돌림(AS-IS [취소]) */}
            <LookupInput
              value={itemName}
              placeholder="전체"
              width={160}
              onOpen={() => setItemLookupOpen(true)}
              onClear={() => { setItemCode('%'); setItemName(''); }}
            />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            {/* [E2] searchText.KeyPress [Enter] (L100) → retrieve() */}
            <SearchBar.Input style={{ width: 200 }} placeholder="사원/항목명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<PayMonthItemDate> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.monthItemId)} />
        </div>
      </div>
      <Pay20_Lookup_MonthItem open={itemLookupOpen} onResult={lookupItemList} />
      {/* 출력 창은 RdViewer (AS-IS RDViewer.viewer) */}
      <RdViewer url={rdUrl} title="급여항목조회" onClose={() => setRdUrl(null)} />
    </div>
  );
};
