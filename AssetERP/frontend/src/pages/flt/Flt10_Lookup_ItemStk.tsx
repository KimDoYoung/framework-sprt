/**
 * 종목(주식/ETF) 찾기 창 (EE99) — 기준일의 공용 시세(icam20_price) 주식 종목을 찾는다
 * AS-IS: myApp/client/vi/flt/Flt10_Lookup_ItemStk.java (217줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L81-118: 550×500 모달 "종목(주식/ETF) 찾기", 위 툴바 = 기준일(100) + 검색(150 "종목코드/명") + [조회], 그리드(종목코드 120 · 종목명 350) + 페이징 툴바(300건), 아래 가운데 [선택][닫기]
 * 호출처 Flt13_Lookup_BookInit은 AS-IS에서 이 창을 여는 줄이 주석(L401)이라 TOBE에서 여는 곳이 없다 — 창만 만들고 연결하지 않는다
 * 같은 화면 모양의 Com50_Lookup_StkItem(종목정보, com50_item)과 달리 이 창은 기준일의 공용 시세(icam20_price)를 읽는다
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { icamPriceApi } from '@/api/icam';
import { errorMessage } from '@/api/client';
import { IcamPriceStock } from '@/types/icam';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { PagingToolBar } from '@/components/grid/PagingToolBar';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';

const gb = gbFor<IcamPriceStock>();
const FORMAT = 'YYYY-MM-DD';
const LIMIT = 300;  // gridToolBar.setToolBar(300)

interface Props {
  /** open(date, callback) L56 — 기준일('yyyy-MM-dd'). 값이 있으면 열린다 */
  date: string | null;
  /** confirm() L197-208: 고른 종목 */
  onResult: (item: IcamPriceStock) => void;
  onClose: () => void;
}

export const Flt10_Lookup_ItemStk: React.FC<Props> = ({ date, onResult, onClose }) => {
  const open = date != null;
  const gridRef = useRef<AgGridReact<IcamPriceStock>>(null);
  const [stdDate, setStdDate] = useState(dayjs().format(FORMAT));
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<IcamPriceStock[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  /** gridToolBar.addParam(…) — 페이지를 넘길 때는 마지막 조회 조건을 쓴다(GridPagingLoader) */
  const paramRef = useRef({ stdDate: '', searchText: '' });

  const getPaging = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await icamPriceApi.searchStocks(paramRef.current.stdDate, paramRef.current.searchText, LIMIT, (p - 1) * LIMIT);
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
      // retrieve() L189-191: 첫 행을 고른다
      setTimeout(() => gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // retrieve() L175-195: 조건을 만들어 1페이지부터 다시 읽는다 ("%검색어%")
  const retrieve = (d = stdDate, text = searchText) => {
    paramRef.current = { stdDate: d, searchText: `%${text}%` };
    return getPaging(1);
  };

  // [E0] 화면 열림 (open(date) L56-79, open() L81-118): 기준일이 오늘 이후면 오늘의 전영업일 → settings(), show(), retrieve()
  useEffect(() => {
    if (!open || date == null) return;
    let alive = true;
    setSearchText('');
    setRows([]);
    setTotal(0);
    (async () => {
      let d = date;
      try {
        d = await icamPriceApi.getStockStdDate(date);
      } catch (err) {
        message.error(errorMessage(err, '기준일 조회 실패'));
      }
      if (!alive) return;
      setStdDate(d);
      await retrieve(d, '');
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, date]);

  // [E4] oKButton[선택].Select (L151) · [E3] grid.CellDoubleClick (L138) → confirm() L197-208: 고른 종목이 없으면 "선택된 종목이 없습니다"
  const confirm = () => {
    const selected = gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) { message.warning('선택된 종목이 없습니다'); return; }
    onResult(selected[0]);
    onClose();
  };

  // buildGrid() L165-173
  const columnDefs = useMemo(() => [
    gb.textCenter('isin', 120, '종목코드'),  // L169
    gb.text('itemName', 350, '종목명'),  // L170
  ], []);

  return (
    <LookupModal
      open={open}
      title="종목(주식/ETF) 찾기"
      width={720}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="select" onClick={confirm}>선택</Button>
            {/* [E5] cancelButton[닫기].Select (L157) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 420, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] searchText.KeyPress [Enter] (L129), [E2] retrieveButton[조회].Select (L145) → retrieve() */}
        <SearchBar onSearch={() => retrieve()} loading={loading}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 130 }} allowClear={false} format={FORMAT} value={dayjs(stdDate)} onChange={d => d && setStdDate(d.format(FORMAT))} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 150 }} placeholder="종목코드/명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<IcamPriceStock> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.isin)} onRowDoubleClicked={confirm} />
        </div>
        <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={getPaging} />
      </div>
    </LookupModal>
  );
};
