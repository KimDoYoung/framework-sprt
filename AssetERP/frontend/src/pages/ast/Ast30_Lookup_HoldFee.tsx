/**
 * 보수원장 조회창 (X28) — Ast33_Lookup_OfficeMngFundTrans(2)의 이관(출) 펀드 고르기에서 연다.
 * AS-IS: myApp/client/vi/ast/Ast30_Lookup_HoldFee.java (224줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L57-64: 모달 1000×550 "보수원장". open(stdDate, corpId, selectMode, callback) L66-93: 기준일자(읽기 전용 100) · 검색 200(운용사 없으면 "운용사/펀드", 있으면 "펀드") · [조회] + 그리드(체크박스, MULTI면 다중) + [확인][닫기]
 * setting() L95-160: 운용사가 정해져 있으면 운용사·운용사명 열(2,3)을 숨긴다. buildGrid() L162-181
 * 조회창이므로 모달은 LookupModal, 행 클릭 선택
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 조회창 UX-05·06
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { PreHoldFee } from '@/types/ast';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<PreHoldFee>();

interface Props {
  open: boolean;
  /** 기준일자 'yyyy-MM-dd' — 이 날의 전날 보수원장을 읽는다 (읽기 전용으로 보여 준다) */
  stdDate: string;
  /** 운용사 ID — 있으면 그 운용사만 읽고 운용사 열을 숨긴다 */
  corpId?: number | null;
  /** selectMode "MULTI" */
  multi?: boolean;
  /** [확인]·더블클릭 — 고른 행들(단일이면 한 행). 닫는 것은 부르는 쪽 */
  onResult: (rows: PreHoldFee[]) => void;
  onClose: () => void;
}

export const Ast30_Lookup_HoldFee: React.FC<Props> = ({ open, stdDate, corpId, multi = false, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<PreHoldFee>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<PreHoldFee[]>([]);

  // buildGrid() L162-181 — 운용사가 정해져 있으면 2,3번째 열(운용사·운용사명)을 숨긴다 (setting() L133-139)
  const columnDefs = useMemo(() => [
    gb.textCenter('corpCode', 70, '운용사', { hide: corpId != null }),  // L172
    gb.text('corpName', 150, '운용사명', { hide: corpId != null }),  // L173
    gb.textCenter('fundCode', 100, '펀드코드'),  // L174
    gb.text('fundName', 350, '펀드명'),  // L175
    gb.textCenter('curCode', 50, '통화'),  // L176
    gb.double('forFee', 120, '보수(외화)'),  // L177
    gb.long('fee', 120, '보수(원화)'),  // L178
  ], [corpId]);

  // retrieve() L183-198: ast.Ast30_BookFundFee.selectByPreHoldDate(companyId, holdDate, corpId, searchText)
  const retrieve = useCallback(async (text: string) => {
    try {
      setRows(await astApi.searchPreHoldFees({ holdDate: stdDate, corpId: corpId ?? undefined, searchText: text }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [stdDate, corpId]);

  // [E0] 화면 열림 (생성자 L57-64, open() L76-93) → setting(), retrieve() — 열 때마다 새 창이라 검색을 비운다
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setRows([]);
    void retrieve('');
  }, [open, retrieve]);

  // [E3] selectButton[확인].Select (L141) · [E2] grid.RowDoubleClick (L117) → select() L200-215
  const select = (picked?: PreHoldFee) => {
    const selected = picked ? [picked] : (gridRef.current?.api.getSelectedRows() ?? []);
    if (selected.length === 0) { message.warning('선택된 내역이 없습니다'); return; }
    onResult(multi ? selected : [selected[0]]);
  };

  return (
    <LookupModal
      open={open}
      title="보수원장"
      width={1000}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="select" onClick={() => select()}>확인</Button>
            {/* [E4] cancleButton[닫기].Select (L147) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E5] retrieveButton[조회].Select (L153) → retrieve(). [E1] searchText.KeyPress [Enter] (L106) → retrieve() */}
        <SearchBar onSearch={() => retrieve(searchText)}>
          <SearchBar.Field label="기준일자">
            <SearchBar.Input style={{ width: 100 }} value={stdDate} disabled />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder={corpId == null ? '운용사/펀드' : '펀드'} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<PreHoldFee>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            rowSelection={{ mode: multi ? 'multiRow' : 'singleRow', checkboxes: true, headerCheckbox: false, enableClickSelection: true }}
            getRowId={p => String(p.data.bookFundFeeId)}
            onRowDoubleClicked={e => { if (e.data) select(e.data); }}
          />
        </div>
      </div>
    </LookupModal>
  );
};
