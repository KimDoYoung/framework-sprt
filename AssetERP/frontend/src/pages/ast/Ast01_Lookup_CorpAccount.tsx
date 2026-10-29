/**
 * 계좌선택 조회창 (U02) — Ast09_Tab_DepositBookPeriod의 계좌 칸에서 연다 (선급거래처 선택은 `prePayOnly`)
 * AS-IS: myApp/client/vi/ast/Ast01_Lookup_CorpAccount.java (224줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(stdDate, mode, callback) L74-108: 모달 650×400 "계좌선택"(선급이면 "선급거래처 선택"), 툴바(기준일자 100 · 검색 200 "보관처명/계좌명" · 조회) + 체크박스 단일 그리드(계좌구분 150 · 보관처 150 · 계좌 250),
 *   [확인] + ([선택안함] mode NOT / [전체]) + [닫기]
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 조회창(UX-05·06)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstCorpAccount } from '@/types/ast';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<AstCorpAccount>();
const FORMAT = 'YYYY-MM-DD';

/** rowSelection은 상수로 넘긴다(렌더마다 새 객체면 선택이 풀린다 — 11 §1 함정) */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

/** buildGrid() L184-194: setChecked(SINGLE) */
const buildGrid = () => [
  gb.text('itemSClassName', 150, '계좌구분'),  // L189
  gb.text('corpName', 150, '보관처'),  // L190
  gb.text('classTreeName', 250, '계좌'),  // L191
];

interface Props {
  open: boolean;
  /** open(stdDate, …)의 기준일자 */
  stdDate: Dayjs;
  /** mode "NOT" — [전체] 대신 [선택안함] (openPrePayOnly도 NOT) */
  mode?: 'NOT';
  /** openPrePayOnly(stdDate, corpId, cb) — 선급거래처만 */
  prePayOnly?: boolean;
  corpId?: number | null;
  /** callback.execute(result): [확인]·더블클릭이면 고른 계좌, [전체]·[선택안함]이면 null */
  onResult: (row: AstCorpAccount | null) => void;
  onClose: () => void;
}

export const Ast01_Lookup_CorpAccount: React.FC<Props> = ({ open, stdDate, mode, prePayOnly, corpId, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<AstCorpAccount>>(null);
  const [date, setDate] = useState<Dayjs>(stdDate);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AstCorpAccount[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L196-215: ast.Ast01_ClassTree.selectCorpAccount(companyId, searchText = "%검색어%", stdDate, prePayOnlyYn, corpId)
  const retrieve = useCallback(async (d: Dayjs = date, text: string = searchText) => {
    try {
      setRows(await astApi.searchCorpAccounts(d.format(FORMAT), text, prePayOnly, corpId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [date, searchText, prePayOnly, corpId]);

  // [E0] 화면 열림 (생성자 L60-65, open L79-108): 기준일자를 받아 열고 곧바로 retrieve()
  useEffect(() => {
    if (!open) return;
    setDate(stdDate);
    setSearchText('');
    setRows([]);
    void retrieve(stdDate, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E1] grid.CellDoubleClick (L111) / [E2] confirmButton[확인].Select (L121): 고른 계좌가 없으면 "계좌를 선택해주세요."
  const confirm = (picked?: AstCorpAccount) => {
    const row = picked ?? gridRef.current?.api.getSelectedRows()[0];
    if (!row) {
      message.warning('계좌를 선택해주세요.');
      return;
    }
    onResult(row);
  };

  const notMode = mode === 'NOT' || !!prePayOnly;

  return (
    <LookupModal open={open} title={prePayOnly ? '선급거래처 선택' : '계좌선택'} width={740} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E3] selectAllButton[전체].Select (L135) / [E4] selectNotButton[선택안함].Select (L142) → callback(null), hide() */}
            {notMode ? <Button type="select" onClick={() => onResult(null)}>선택안함</Button> : <Button type="select" onClick={() => onResult(null)}>전체</Button>}
            {/* [E5] cancleButton[닫기].Select (L149) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E6] retrieveButton[조회].Select (L155) → retrieve(), [E7] searchText.KeyPress [Enter] (L166) → retrieve() */}
        <SearchBar onSearch={() => retrieve()}>
          <SearchBar.Field label="기준일자">
            <DatePicker style={{ width: 120 }} allowClear={false} value={date} format={FORMAT} onChange={d => d && setDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input autoFocus style={{ width: 200 }} placeholder="보관처명/계좌명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AstCorpAccount>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.classTreeId)}
            rowSelection={SINGLE_CHECK}
            onRowDoubleClicked={e => { if (e.data) confirm(e.data); }}
          />
        </div>
      </div>
    </LookupModal>
  );
};
