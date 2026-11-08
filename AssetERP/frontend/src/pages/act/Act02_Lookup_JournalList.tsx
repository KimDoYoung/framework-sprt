/**
 * 전표 불러오기 조회창 (X01) — Act02_Lookup_CreateJournal의 [불러오기]가 연다
 * AS-IS: myApp/client/vi/act/Act02_Lookup_JournalList.java (195줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L57-64 / open() L66-82: 모달 900×550 "전표 불러오기", 툴바(조회일자 100 ~ 100 · 검색 200 "거래처/적요" · 조회) + 체크박스 단일 그리드(일자 90 · 전표번호 90 · 거래처 150 · 적요 350 · 금액 120), [확인] [닫기]
 * setting() L84-144: 조회일자 = 3개월 전 1일 ~ 오늘, 열 때 retrieve()
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { Journal } from '@/types/act';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';

const gb = gbFor<Journal>();
const FORMAT = 'YYYY-MM-DD';

/** buildGrid() L146-158: setChecked(SINGLE) */
const buildGrid = () => [
  gb.date('date', 90, '일자'),
  gb.textCenter('journalNoStr', 90, '전표번호'),
  gb.text('corpName', 150, '거래처'),
  gb.text('note', 350, '적요'),
  gb.long('journalAmt', 120, '금액'),
];

/** rowSelection은 상수로 넘긴다(렌더마다 새 객체면 선택이 풀린다 — 11 §1 함정) */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

const initStart = () => dayjs().subtract(3, 'month').startOf('month');

interface Props {
  open: boolean;
  /** callback.execute(list.get(0)): 확인이면 고른 전표 */
  onResult: (row: Journal) => void;
  /** 닫기: hide()만 */
  onClose: () => void;
}

export const Act02_Lookup_JournalList: React.FC<Props> = ({ open, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<Journal>>(null);
  const [startDate, setStartDate] = useState<Dayjs>(initStart());
  const [closeDate, setCloseDate] = useState<Dayjs>(dayjs());
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(false);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L160-176: act.Act02_Journal.selectByDate(companyId, startDate, closeDate, "1", "%검색어%")
  const retrieve = useCallback(async (s = startDate, c = closeDate, text = searchText) => {
    setLoading(true);
    try {
      setRows(await actApi.searchJournals(s.format(FORMAT), c.format(FORMAT), text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [startDate, closeDate, searchText]);

  // [E0] 화면 열림 (생성자 L57-64, open L66-82) → setting(), retrieve()
  useEffect(() => {
    if (!open) return;
    const s = initStart();
    const c = dayjs();
    setStartDate(s);
    setCloseDate(c);
    setSearchText('');
    setRows([]);
    void retrieve(s, c, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E2] grid.RowDoubleClick (L107) / [E3] selectButton[확인].Select (L125) → select() L178-186
  const select = () => {
    const row = gridRef.current?.api.getSelectedRows()[0];
    if (!row) { message.warning('선택된 내역이 없습니다'); return; }
    onResult(row);
  };

  return (
    <LookupModal open={open} title="전표 불러오기" width={990} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={select}>확인</Button>
            {/* [E4] cancleButton[닫기].Select (L131) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E5] retrieveButton[조회].Select (L137) / [E1] searchText.KeyPress [Enter] (L97) → retrieve() */}
        <SearchBar onSearch={() => retrieve()} loading={loading}>
          <SearchBar.Field label="조회일자">
            <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
            <span style={{ margin: '0 4px' }}>~</span>
            <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="거래처/적요" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<Journal>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.journalId)}
            rowSelection={SINGLE_CHECK}
            onRowDoubleClicked={select}
          />
        </div>
      </div>
    </LookupModal>
  );
};
