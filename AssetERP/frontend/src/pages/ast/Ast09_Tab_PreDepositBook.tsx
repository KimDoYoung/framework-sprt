/**
 * [1342] 관리회계 > 21. 회계장부 > 선급금/선급비용 조회 (X19)
 * AS-IS: myApp/client/vi/ast/Ast09_Tab_PreDepositBook.java (149줄) + Act02_Grid_History (pages/act, 새로 만듦) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L39-68: BorderLayout 위 = 툴바 50(여백 20,20,0,20: 보유일자 100 · 검색 250 "구분/자산명/거래처" · [조회]) / 가운데 0.6(여백 -2,20,0,20) = 선급 그리드(행번호 + 일자 120 · 구분 200 · 자산명 350 · 거래처 200 · 잔액 150, 합계 행 "계") /
 *   아래 0.4(분할, 여백 -2,20,20,20) = 자산별 분개 이력 Act02_Grid_History. 열 때 retrieve()
 * 조회가 끝나면 첫 행을 고르고 아래 이력을 읽는다(행이 없으면 비운다). 행을 누르면 그 자산의 이력을 다시 읽는다
 * 스타일: GG (견본 Est02_Tab_PfResultReport — docs/page-style.md). 원본은 위 60% / 아래 40%
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstPreDeposit } from '@/types/ast';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Act02_Grid_History } from '@/pages/act/Act02_Grid_History';

const gb = gbFor<AstPreDeposit>();
const FORMAT = 'YYYY-MM-DD';
const SUM_ROW = { labelField: 'stdDate', label: '계', sum: ['holdQty'] };

export const Ast09_Tab_PreDepositBook: React.FC = () => {
  const gridRef = useRef<AgGridReact<AstPreDeposit>>(null);
  // [E0] 화면 열림 (생성자 L39-68) → setting() L70-102: 보유일자 = 오늘 → retrieve()
  const [stdDate, setStdDate] = useState<Dayjs>(dayjs());
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AstPreDeposit[]>([]);
  const [loading, setLoading] = useState(false);
  const [astClassTreeId, setAstClassTreeId] = useState<number | null>(null);
  const [nonce, setNonce] = useState(0);

  // retrieve() L118-140: ast.Ast09_Book.selectPreDepositByHoldDate(companyId, holdDate, "%검색어%") → 첫 행을 고르고 retrievePage(), 행이 없으면 gridTr.clear()
  const retrieve = useCallback(async () => {
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await astApi.searchPreDeposits(stdDate.format(FORMAT), searchText);
      setRows(list);
      const first = list[0] ?? null;
      setAstClassTreeId(first ? first.astClassTreeId : null);
      setNonce(n => n + 1);
      if (first) setTimeout(() => gridRef.current?.api?.getRowNode(String(first.bookId))?.setSelected(true), 0);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [stdDate, searchText]);

  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // buildGrid() L104-116: getSumGrid("계",1,5,5) — 합계 행 라벨은 일자 열, 합계는 잔액
  const columnDefs = useMemo(() => [
    gb.date('stdDate', 120, '일자'),  // L109
    gb.text('astSClassName', 200, '구분'),  // L110
    gb.text('astClassTreeName', 350, '자산명'),  // L111
    gb.text('corpName', 200, '거래처'),  // L112
    gb.double('holdQty', 150, '잔액'),  // L113
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel defaultSize="60%" min={120}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* [E2] retrieveButton[조회].Select (L89) / [E1] searchText.KeyPress [Enter] (L77) → retrieve() */}
              <SearchBar onSearch={retrieve} loading={loading}>
                <SearchBar.Field label="보유일자">
                  <DatePicker style={{ width: 130 }} allowClear={false} value={stdDate} format={FORMAT} onChange={d => d && setStdDate(d)} />
                </SearchBar.Field>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 250 }} placeholder="구분/자산명/거래처" value={searchText} onChange={e => setSearchText(e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                {/* [E3] grid.RowClick (L96) → retrievePage() L142-144: 같은 행을 다시 눌러도 다시 읽는다 */}
                <SingleGrid<AstPreDeposit>
                  gridRef={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.bookId)}
                  sumRow={SUM_ROW}
                  loading={loading}
                  onRowClicked={e => { if (e.data) { setAstClassTreeId(e.data.astClassTreeId); setNonce(n => n + 1); } }}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize="40%" min={200}>
          <div style={{ height: '100%', padding: '8px 20px 20px 20px', boxSizing: 'border-box' }}>
            <Act02_Grid_History astClassTreeId={astClassTreeId} nonce={nonce} />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
