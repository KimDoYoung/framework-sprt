/**
 * 보유자산 조회창 (W06) — Ast06_Lookup_TrFinance의 종목 칸에서 연다(거래유형이 보유 원장을 쓰는 출고·입/출고·원장변경·해당없음일 때)
 * AS-IS: myApp/client/vi/ast/Ast09_Lookup_Book.java (181줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L62-78: 모달 1100×500 "보유자산", 툴바(보유일 100 · 검색 200 "보관처명/계좌명/자산명" · 조회) + 체크박스 단일 그리드 7열, [확인][닫기]
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 조회창(UX-05·06)
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstHoldBook } from '@/types/ast';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<AstHoldBook>();
const FORMAT = 'YYYY-MM-DD';

/** rowSelection은 상수로 넘긴다(렌더마다 새 객체면 선택이 풀린다 — 11 §1 함정) */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

/** buildGrid() L139-154: setChecked(SINGLE) */
const buildGrid = () => [
  gb.text('keepAccountName', 200, '계좌'),  // L145
  gb.text('astClassName', 150, '종목유형'),  // L146
  gb.text('astClassTreeName', 200, '종목'),  // L147
  gb.double('holdQty', 100, '보유수량'),  // L148
  gb.long('purAmt', 120, '보유취득금액'),  // L149
  gb.long('bookAmt', 120, '보유장부금액'),  // L150
  gb.date('lockUpDate', 100, '매도제한일'),  // L151
];

interface Props {
  open: boolean;
  /** open(holdDate, …)의 보유일 — 거래일자 */
  holdDate: Dayjs;
  /** open(…, abroType, …) — 1 국내 · 2 국외 */
  abroType: string;
  /** callback.execute(model): [확인]·더블클릭이면 고른 보유자산 (닫기는 결과 없이 닫는다) */
  onResult: (row: AstHoldBook) => void;
  onClose: () => void;
}

export const Ast09_Lookup_Book: React.FC<Props> = ({ open, holdDate, abroType, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<AstHoldBook>>(null);
  const [date, setDate] = useState<Dayjs>(holdDate);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AstHoldBook[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L156-172: ast.Ast09_Book.selectByHoldDate(companyId, holdDate, astType "2", abroType, searchText = "%검색어%")
  const retrieve = useCallback(async (d: Dayjs = date, text: string = searchText) => {
    try {
      setRows(await astApi.searchHolds(d.format(FORMAT), abroType, text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [date, searchText, abroType]);

  // [E0] 화면 열림 (생성자 L62-78, open L55-60): 보유일을 받아 열고 곧바로 retrieve()
  useEffect(() => {
    if (!open) return;
    setDate(holdDate);
    setSearchText('');
    setRows([]);
    void retrieve(holdDate, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E1] grid.CellDoubleClick [callbackResult != null] (L81) / [E2] confirmButton[확인].Select [callbackResult != null] (L91): 고른 것이 없으면 "보유자산을 선택해주세요."
  const confirm = (picked?: AstHoldBook) => {
    const row = picked ?? gridRef.current?.api.getSelectedRows()[0];
    if (!row) {
      message.warning('보유자산을 선택해주세요.');
      return;
    }
    onResult(row);
  };

  return (
    <LookupModal open={open} title="보유자산" width={1120} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E3] cancleButton[닫기].Select (L105) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E4] retrieveButton[조회].Select (L111) → retrieve(), [E5] searchText.KeyPress [Enter] (L123) → retrieve() */}
        <SearchBar onSearch={() => retrieve()}>
          <SearchBar.Field label="보유일">
            <DatePicker style={{ width: 120 }} allowClear={false} value={date} format={FORMAT} onChange={d => d && setDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input autoFocus style={{ width: 200 }} placeholder="보관처명/계좌명/자산명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AstHoldBook>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => `${p.data.astClassTreeId}-${p.data.keepAccountId}`}
            rowSelection={SINGLE_CHECK}
            onRowDoubleClicked={e => { if (e.data) confirm(e.data); }}
          />
        </div>
      </div>
    </LookupModal>
  );
};
