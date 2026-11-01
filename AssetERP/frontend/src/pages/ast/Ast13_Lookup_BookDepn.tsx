/**
 * 보유자산 조회창 (X03) — Ast06_Lookup_TrIntrinsic의 종목 칸(비품폐기 5013·비품매각 5014)에서 연다
 * AS-IS: myApp/client/vi/ast/Ast13_Lookup_BookDepn.java (188줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L57-73: 모달 1000×500 "보유자산", 툴바(보유일 100 · 구분 150 "전체" · 검색 200 "자산구분/자산명" · 조회) + 단일 선택 그리드(행번호, 자산구분 150 · 자산명 300 · 취득일 100 · 취득금액 150), [확인] [닫기]
 * 구분 콤보(ItemSClassCode, 코드 5050%)는 원본도 조회 조건으로 보내지 않는다 — 그대로 둔다(원본-이상한점)
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 조회창(UX-05·06). 초기화(UX-02)는 조건이 3개지만 원본에 없어 넣지 않는다
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DatePicker, message, Select, Space } from 'antd';
import { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { astApi } from '@/api/ast';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { AstBookDepn } from '@/types/ast';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<AstBookDepn>();
const FORMAT = 'YYYY-MM-DD';

/** buildGrid() L152-163 */
const columnDefs = [
  gb.text('itemType', 150, '자산구분'),   // L157
  gb.text('itemName', 300, '자산명'),     // L158
  gb.date('purDate', 100, '취득일'),      // L159
  gb.long('purAmt', 150, '취득금액'),     // L160
];

interface Props {
  open: boolean;
  /** open(holdDate, …): 보유일 */
  holdDate: Dayjs;
  /** callback.execute(model): [확인]·더블클릭 — 부르는 쪽이 닫는다 */
  onResult: (row: AstBookDepn) => void;
  /** [닫기]: hide()만 */
  onClose: () => void;
}

export const Ast13_Lookup_BookDepn: React.FC<Props> = ({ open, holdDate, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<AstBookDepn>>(null);
  const [stdDate, setStdDate] = useState<Dayjs>(holdDate);
  const [astType, setAstType] = useState('%');
  const [types, setTypes] = useState<Code[]>([]);
  const [text, setText] = useState('');
  const [rows, setRows] = useState<AstBookDepn[]>([]);
  const [loading, setLoading] = useState(false);

  // retrieve() L165-179: ast.Ast13_BookDepn.selectByDepnDate(companyId, depnDate, "%검색어%")
  const retrieve = useCallback(async (d: Dayjs, t: string) => {
    setLoading(true);
    try {
      setRows(await astApi.searchBookDepns(d.format(FORMAT), t));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L57-73, open L75-79) → setting(holdDate), retrieve()
  useEffect(() => {
    if (!open) return;
    setStdDate(holdDate);
    setAstType('%');
    setText('');
    void retrieve(holdDate, '');
    // 구분 콤보: sys.Sys00_Common.selectByKindCode(kindCode ItemSClassCode, code "5050%")
    sysApi.searchCodes('ItemSClassCode').then(list => setTypes(list.filter(c => c.code.startsWith('5050')))).catch(() => setTypes([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E2] confirmButton[확인].Select [callbackResult != null] (L113) / [E5] grid.CellDoubleClick (L140) → callback(model), hide()
  const confirm = () => {
    const row = gridRef.current?.api.getSelectedRows()[0];
    if (!row) { message.info('보유자산을 선택해주세요.'); return; }
    onResult(row);
  };

  return (
    <LookupModal open={open} title="보유자산" width={1000} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E3] cancleButton[닫기].Select (L127) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E4] retrieveButton[조회].Select (L133) → retrieve(), [E1] searchText.KeyPress [Enter] (L96) → retrieve() */}
        <SearchBar onSearch={() => retrieve(stdDate, text)} loading={loading}>
          <SearchBar.Field label="보유일">
            <DatePicker style={{ width: 120 }} allowClear={false} value={stdDate} format={FORMAT} onChange={d => d && setStdDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="구분">
            <Select style={{ width: 150 }} value={astType} onChange={setAstType}
              options={[{ value: '%', label: '전체' }, ...types.map(c => ({ value: c.code, label: c.name }))]} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="자산구분/자산명" value={text} onChange={e => setText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AstBookDepn> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.purTrId)}
            onRowDoubleClicked={confirm} />
        </div>
      </div>
    </LookupModal>
  );
};
