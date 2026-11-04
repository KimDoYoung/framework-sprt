/**
 * 종목별 보유펀드 조회창 — Flt10_Tab_PreApprove(#1128)의 [펀드보유종목 확인]이 연다 (다른 도메인(fnd) 조회창).
 * AS-IS: myApp/client/vi/fnd/Fnd10_Lookup_RelateFund.java (203줄) — 메서드 이름·줄 번호는 원본(IDMS-IC)
 * 생성자 L52-84: 모달 1100×600 "종목별 보유펀드", 툴바 기준일 + 종목코드/명 + [조회], 왼쪽(0.43) 종목 그리드 + 오른쪽(0.57) 펀드 그리드, [닫기]
 * open() L124-139: sys.Sys12_Calendar.selectBizDate(오늘, "-1" = 전 영업일)를 기준일로 넣고 itemRetrieve()
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import { AgGridReact } from 'ag-grid-react';
import { fndApi } from '@/api/fnd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { BookFund, BookItem } from '@/types/fnd';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';

const FORMAT = 'YYYY-MM-DD';
const gbItem = gbFor<BookItem>();
const gbFund = gbFor<BookFund>();

/** itemBuildGrid() L141-148 */
const buildItemGrid = () => [
  gbItem.textCenter('itemCode', 120, '종목코드'),  // L144
  gbItem.text('itemName', 250, '종목명'),  // L145
];

/** fundBuildGrid() L150-158 */
const buildFundGrid = () => [
  gbFund.textCenter('fundCode', 100, '펀드코드'),  // L153
  gbFund.text('fundName', 350, '펀드명'),  // L154
  gbFund.text('manageType', 100, '구분'),  // L155
];

interface Props {
  /** open(): true면 열림 */
  open: boolean;
  /** 닫기: hide()만 */
  onClose: () => void;
}

export const Fnd10_Lookup_RelateFund: React.FC<Props> = ({ open, onClose }) => {
  const [stdDate, setStdDate] = useState(dayjs().format(FORMAT));
  const [searchText, setSearchText] = useState('');
  const [items, setItems] = useState<BookItem[]>([]);
  const [funds, setFunds] = useState<BookFund[]>([]);
  const itemGridRef = useRef<AgGridReact<BookItem>>(null);
  const loadedItem = useRef<string | null>(null);
  const itemCols = useMemo(buildItemGrid, []);
  const fundCols = useMemo(buildFundGrid, []);

  // fundRetrieve(itemCode) L180-194: fnd.Fnd10_Book.selectFundListByItemCode(companyId, stdDate, itemCode)
  const fundRetrieve = useCallback(async (date: string, itemCode: string) => {
    loadedItem.current = itemCode;
    try {
      setFunds(await fndApi.searchBookFundsByItem({ stdDate: date, itemCode }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // itemRetrieve() L160-178: fnd.Fnd10_Book.selectItemList(companyId, stdDate, "%" + 입력 + "%") → 첫 행을 고르고 그 종목의 펀드 조회
  const itemRetrieve = useCallback(async (date: string, text: string) => {
    try {
      const list = await fndApi.searchBookItems({ stdDate: date, searchText: text });
      setItems(list);
      loadedItem.current = null;
      if (list.length > 0) {
        setTimeout(() => itemGridRef.current?.api.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
        await fundRetrieve(date, list[0].itemCode);
      } else {
        setFunds([]);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [fundRetrieve]);

  // [E0] 화면 열림 (open L124-139) → Sys12_Calendar.selectBizDate(오늘, "-1") = 전 영업일을 기준일로 → itemRetrieve()
  useEffect(() => {
    if (!open) return;
    let alive = true;
    setSearchText('');
    setItems([]);
    setFunds([]);
    (async () => {
      let date = dayjs().format(FORMAT);
      try {
        date = await sysApi.getBizDate(date, '-1');
      } catch (err) {
        message.error(errorMessage(err, '기준일 조회 실패'));
      }
      if (!alive) return;
      setStdDate(date);
      await itemRetrieve(date, '');
    })();
    return () => { alive = false; };
  }, [open, itemRetrieve]);

  return (
    // 열 폭 합계 (120+250) + (100+350+100) = 920 + 행번호 2×30 = 980 + 여백 130 = 1110 (03 원칙 21, AS-IS 1100보다 작지 않게)
    <LookupModal open={open} title="종목별 보유펀드" width={1110} maskClosable={false} onCancel={onClose} destroyOnHidden
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 }, footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 } }}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E4] closeButton[닫기].Select (L116) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 480, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L110) → itemRetrieve(). [E1] searchText.KeyPress [Enter] (L91) → itemRetrieve() */}
        <SearchBar onSearch={() => itemRetrieve(stdDate, searchText)}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 130 }} allowClear={false} format={FORMAT} value={dayjs(stdDate)}
              onChange={d => d && setStdDate(d.format(FORMAT))} />
          </SearchBar.Field>
          <SearchBar.Field label="종목코드/명">
            <SearchBar.Input style={{ width: 250 }} placeholder="종목코드/종목명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 8 }}>
          <div style={{ flex: 43, minWidth: 0 }}>
            {/* [E2] itemGrid.SelectionChanged [선택>0] (L100) → fundRetrieve(선택 행의 종목코드) */}
            <SingleGrid<BookItem>
              gridRef={itemGridRef}
              rowData={items}
              columnDefs={itemCols}
              getRowId={p => String(p.data.bookId)}
              onSelect={row => { if (row && row.itemCode !== loadedItem.current) void fundRetrieve(stdDate, row.itemCode); }}
            />
          </div>
          <div style={{ flex: 57, minWidth: 0 }}>
            <SingleGrid<BookFund>
              rowData={funds}
              columnDefs={fundCols}
              getRowId={p => String(p.data.bookId)}
            />
          </div>
        </div>
      </div>
    </LookupModal>
  );
};
