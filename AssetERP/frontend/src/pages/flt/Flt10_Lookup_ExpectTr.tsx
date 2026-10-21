/**
 * 사전신고내역 창 (I03) — Flt10_Tab_BuyReport(·I04 매도 사전신고) [기간조회]에서 연다.
 * AS-IS: myApp/client/vi/flt/Flt10_Lookup_ExpectTr.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(trType, stdDate, callback) L57-102: 1200×500 모달, 툴바 "사전신고일" 시작 ~ 종료 · "검색"(200, "계좌명/종목명") · [조회],
 *   그리드(체크박스 단일 선택), [선택][닫기]. 제목은 trType 10I면 "매수 사전신고내역", 아니면 "매도 사전신고내역"
 * 열 폭 합계가 1120을 넘어(03 원칙 21) 모달을 AS-IS 폭(1200)에 두고 가로 스크롤을 허용한다
 * UX보강(10): 툴바 = SearchBar(UX-01), 조회창 UX-05·06
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltTr } from '@/types/flt';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<FltTr>();
const DATE_FORMAT = 'YYYY-MM-DD';

/** AS-IS buildGrid() — setChecked(SINGLE): 체크박스 하나만 선택 */
const buildGrid = () => [
  gb.date('regDate', 90, '사전신고일'),  // 원본 100 → UX-08
  gb.text('accountInfo', 250, '계좌명'),
  gb.text('itemTypeName', 150, '종목유형'),
  gb.text('itemName', 250, '종목명'),
  gb.textCenter('itemCode', 110, '종목코드'),
  gb.double('expectTrQty', 100, '주문수량'),
  gb.long('expectTrAmt', 150, '주문총액'),
];

/** 렌더마다 새 객체를 주면 선택이 풀린다 — 상수로 둔다 (11 §1 함정) */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** open(trType, …): 10I 매수 / 20O 매도 */
  trType: string;
  /** open(…, stdDate, …): 기준일(YYYY-MM-DD) — 시작일은 그 달 1일, 종료일은 기준일 */
  stdDate: string;
  /** callback.execute(grid.getSelectionModel().getSelectedItem()) L185-195 */
  onResult: (tr: FltTr) => void;
  onClose: () => void;
}

export const Flt10_Lookup_ExpectTr: React.FC<Props> = ({ open, trType, stdDate, onResult, onClose }) => {
  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const [closeDate, setCloseDate] = useState<Dayjs>(dayjs());
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<FltTr[]>([]);
  const [selected, setSelected] = useState<FltTr | undefined>(undefined);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L166-183: 서비스 flt.Flt10_Tr.selectByAccountId(companyId, personId, startDate, closeDate, searchText "%…%", trType)
  const retrieve = useCallback(async (start: Dayjs, close: Dayjs, text: string) => {
    try {
      setRows(await fltApi.searchTrs({ trType, startDate: start.format(DATE_FORMAT), closeDate: close.format(DATE_FORMAT), searchText: text }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [trType]);

  // open() L64-102 → settings() L104-148: 시작일 = 기준일의 그 달 1일, 종료일 = 기준일 → show() 뒤 retrieve()
  useEffect(() => {
    if (!open) return;
    const std = dayjs(stdDate);
    const start = std.startOf('month');
    setStartDate(start);
    setCloseDate(std);
    setSearchText('');
    setSelected(undefined);
    setRows([]);
    void retrieve(start, std, '');
  }, [open, stdDate, retrieve]);

  // [E3] oKButton[선택].Select (L120) · [E5] grid.CellDoubleClick (L142) → confirm() L185-195
  const confirm = (picked?: FltTr) => {
    const tr = picked ?? selected;
    if (!tr) {
      message.warning('선택된 내역이 없습니다');
      return;
    }
    onResult(tr);
  };

  return (
    <LookupModal
      open={open}
      title={trType === '10I' ? '매수 사전신고내역' : '매도 사전신고내역'}
      width={1200}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="select" onClick={() => confirm()}>선택</Button>
            {/* [E4] cancelButton[닫기].Select (L126) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L114) → retrieve(). [E1] searchText.KeyPress [Enter] (L108) → retrieve() */}
        <SearchBar onSearch={() => retrieve(startDate, closeDate, searchText)}>
          <SearchBar.Field label="사전신고일">
            <Space size={4}>
              <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} format={DATE_FORMAT} onChange={d => d && setStartDate(d)} />
              <span>~</span>
              <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} format={DATE_FORMAT} onChange={d => d && setCloseDate(d)} />
            </Space>
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="계좌명/종목명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<FltTr>
            rowData={rows}
            columnDefs={columnDefs}
            rowSelection={SINGLE_CHECK}
            getRowId={p => String(p.data.trId)}
            onSelect={setSelected}
            onRowDoubleClicked={e => { if (e.data) confirm(e.data); }}
          />
        </div>
      </div>
    </LookupModal>
  );
};
