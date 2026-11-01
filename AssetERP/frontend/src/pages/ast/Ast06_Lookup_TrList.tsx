/**
 * 거래 불러오기 조회창 (X03) — Ast06_Lookup_TrIntrinsic의 [거래 불러오기]에서 연다
 * AS-IS: myApp/client/vi/ast/Ast06_Lookup_TrList.java (209줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L60-67: 모달 1200×550 "거래 불러오기", 툴바(조회일자 100 ~ 100 · 검색 200 "거래유형/거래처/종목/적요" · 조회) + 단일 선택 그리드
 *   (행번호, 일자 90 · 거래유형 180 · 거래처 180 · 종목 200 · 금액 100 · 적요 350) + 안내 "※ 원장연동 거래유형(비품폐기 등)인 경우 불러오기에서 제외됩니다.", [확인] [닫기]
 * 조회기간 기본: 지난 달 1일 ~ 오늘(setting L88-97). 조회는 ast.Ast06_Tr.selectByPayCode(bookIoCheck true, windowClassName Ast06_Tab_TrIntrinsic)
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 조회창(UX-05·06). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstTrIntrinsic } from '@/types/ast';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<AstTrIntrinsic>();
const FORMAT = 'YYYY-MM-DD';
const WINDOW_CLASS = 'Ast06_Tab_TrIntrinsic';

/** buildGrid() L150-163 */
const columnDefs = [
  gb.date('date', 90, '일자'),             // L155
  gb.text('trName', 180, '거래유형'),      // L156
  gb.text('corpName', 180, '거래처'),      // L157
  gb.text('classTreeName', 200, '종목'),   // L158
  gb.long('amt', 100, '금액'),             // L159
  gb.text('note', 350, '적요'),            // L160
];

interface Props {
  open: boolean;
  /** callback.execute(list.get(0)): [확인]·더블클릭 — 부르는 쪽이 닫는다 */
  onResult: (row: AstTrIntrinsic) => void;
  /** [닫기]: hide()만 */
  onClose: () => void;
}

export const Ast06_Lookup_TrList: React.FC<Props> = ({ open, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<AstTrIntrinsic>>(null);
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(1, 'month').startOf('month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [text, setText] = useState('');
  const [rows, setRows] = useState<AstTrIntrinsic[]>([]);
  const [loading, setLoading] = useState(false);

  // retrieve() L165-190: 거래유형·종목·거래처 0, 결제구분 "%", assetType "1", abroType "1", bookIoCheck true
  const retrieve = useCallback(async (s: Dayjs, c: Dayjs, t: string) => {
    setLoading(true);
    try {
      setRows(await astApi.searchTrIntrinsics({ startDate: s.format(FORMAT), closeDate: c.format(FORMAT), windowClassName: WINDOW_CLASS, searchText: t, bookIoCheck: true }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L60-67, open L69-86) → setting(), show(), retrieve()
  useEffect(() => {
    if (!open) return;
    const s = dayjs().subtract(1, 'month').startOf('month');
    const c = dayjs();
    setStartDate(s);
    setCloseDate(c);
    setText('');
    void retrieve(s, c, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E2] grid.RowDoubleClick (L111) / [E3] selectButton[확인].Select (L129) → select() L192-200: 없으면 "선택된 내역이 없습니다", 있으면 callback(첫 행), hide()
  const select = () => {
    const row = gridRef.current?.api.getSelectedRows()[0];
    if (!row) { message.info('선택된 내역이 없습니다'); return; }
    onResult(row);
  };

  return (
    <LookupModal open={open} title="거래 불러오기" width={1200} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={select}>확인</Button>
            {/* [E4] cancleButton[닫기].Select (L135) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E5] retrieveButton[조회].Select (L141) → retrieve(), [E1] searchText.KeyPress [Enter] (L101) → retrieve() */}
        <SearchBar onSearch={() => retrieve(startDate, closeDate, text)} loading={loading}>
          <SearchBar.Field label="조회일자">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
              ~
              <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
            </span>
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="거래유형/거래처/종목/적요" value={text} onChange={e => setText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AstTrIntrinsic> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.trId)}
            onRowDoubleClicked={select} />
        </div>
        <div style={{ color: '#4A7DB1', fontSize: 13, fontWeight: 'bold', paddingLeft: 10 }}>
          ※ 원장연동 거래유형(비품폐기 등)인 경우 불러오기에서 제외됩니다.
        </div>
      </div>
    </LookupModal>
  );
};
