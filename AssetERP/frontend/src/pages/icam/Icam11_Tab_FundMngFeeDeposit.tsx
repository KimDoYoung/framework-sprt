/**
 * [1217] 관리회계 > 30. 펀드운용보수관리 > 운용보수 입금계좌 관리 (X33)
 * AS-IS: myApp/client/vi/icam/Icam11_Tab_FundMngFeeDeposit.java (173줄) + Icam11_Grid_MngFeeDeposit — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L41-79: BorderLayout 위 = 툴바 50(여백 20,20,0,20: 검색 300 "펀드코드/펀드명/수탁사/예금계좌" · [조회][등록][저장][삭제]) /
 *   왼쪽 0.7(분할) = 펀드별 현재 입금계좌 그리드(단일 선택, 4열) / 가운데 0.3(분할) = 선택 펀드의 입금계좌 이력 그리드(Icam11_Grid_MngFeeDeposit, 셀 편집 2열)
 * 열 때는 조회하지 않는다(setting()만 부른다). 위 그리드 행을 누르면 그 펀드의 이력을 읽는다(retrievePage). [등록][저장][삭제]는 이력 그리드의 insertRow·update·deleteRow
 * X27(Icam11_Tab_OfficeMngFeeDeposit)의 짝 — 운용사 칸이 없고 열이 4개(운용사·통화 열 없음). API(`icam/fee-deposits`)·이력 그리드·예금계좌 조회창은 X27 재사용
 * 스타일: GGH (원본이 좌우 분할 — yunhee page-style은 GG로 판별한다. docs/page-style.md). 견본 docs/page-style/GGH/Pay50_Tab_ExpensePay.tsx
 * UX보강(10): 툴바 = SearchBar(UX-01·04), [저장(n)] UX-03. 조건이 1개라 초기화(UX-02)는 넣지 않는다
 * 왼쪽 폭: 원본 0.7(비율) 대신 850 — X27과 같다(12 원칙 1)
 */
import React, { useCallback, useRef, useState } from 'react';
import { message, Splitter } from 'antd';
import { icamApi } from '@/api/icam';
import { errorMessage } from '@/api/client';
import { IcamFeeDeposit } from '@/types/icam';
import { Button, type ChangeCount } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Icam11_Grid_MngFeeDeposit, MngFeeDepositGridHandle } from './Icam11_Grid_MngFeeDeposit';

const gb = gbFor<IcamFeeDeposit>();

/** buildGrid() L120-131: setChecked(SINGLE). 폭은 원본 값을 flex 비율로 쓰고 최소 폭을 둔다(850 안에서 가로 스크롤이 없게) */
const columnDefs = [
  gb.textCenter('fundCode', 100, '펀드코드'),                                                       // L125
  gb.text('fundName', 450, '펀드명', { flex: 450, minWidth: 150 }),                                // L126 SQL 계산 컬럼
  gb.text('consignmentName', 250, '수탁사', { flex: 250, minWidth: 110 }),                          // L127
  gb.text('depositName', 200, '예금계좌', { flex: 200, minWidth: 110 }),                            // L128
];

export const Icam11_Tab_FundMngFeeDeposit: React.FC = () => {
  const depositRef = useRef<MngFeeDepositGridHandle>(null);
  // [E0] 화면 열림 (생성자 L41-79) → setting(): 검색칸 안내 문구. 열 때 조회하지 않는다
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<IcamFeeDeposit[]>([]);
  const [selected, setSelected] = useState<IcamFeeDeposit | null>(null);
  const [loading, setLoading] = useState(false);
  const [changes, setChanges] = useState<ChangeCount>({ added: 0, modified: 0 });
  const retrieveSeq = useRef(0);

  // [E2] searchTextField.KeyPress [Enter] (L85)·[E3] retrieveButton[조회].Select (L94) → retrieve() L134-151:
  //   icam.Icam11_FeeDeposit.selectByCompanyId(companyId, searchText) → 행이 있으면 첫 행을 고르고 retrievePage()
  const retrieve = useCallback(async () => {
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await icamApi.searchFeeDeposits({ corpId: null, searchText });
      if (my !== retrieveSeq.current) return;
      setRows(list);
      if (list.length === 0) setSelected(null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);
    }
  }, [searchText]);

  return (
    <div style={{ height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 'none', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
        <SearchBar
          onSearch={() => void retrieve()}
          loading={loading}
          extra={<>
            {/* [E4] insertButton[등록].Select (L100) → depositGrid.insertRow() */}
            <Button type="register" onClick={() => depositRef.current?.insertRow()}>등록</Button>
            {/* [E6] updateButton[저장].Select (L112) → depositGrid.update(). 저장(n)은 UX-03 */}
            <Button type="save" count={changes} onClick={() => depositRef.current?.update()}>저장</Button>
            {/* [E5] deleteButton[삭제].Select (L106) → depositGrid.deleteRow() */}
            <Button type="delete" onClick={() => depositRef.current?.deleteRow()}>삭제</Button>
          </>}
        >
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 300 }} placeholder="펀드코드/펀드명/수탁사/예금계좌" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
      </div>
      <Splitter style={{ flex: 1, minHeight: 0 }}>
        <Splitter.Panel defaultSize={850} min={300} max={1000}>
          <div style={{ height: '100%', boxSizing: 'border-box', padding: '8px 10px 20px 20px' }}>
            {/* [E1] grid.RowClick (L57) → retrievePage() L153-156 → depositGrid.retrieve(선택 행, 검색어) */}
            <SingleGrid<IcamFeeDeposit>
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.feeDepositId)}
              loading={loading}
              onRowDataUpdated={e => { if (e.api.getSelectedRows().length === 0) e.api.getDisplayedRowAtIndex(0)?.setSelected(true); }}
              onSelect={row => setSelected(row ?? null)}
            />
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ height: '100%', boxSizing: 'border-box', padding: '8px 20px 20px 10px' }}>
            <Icam11_Grid_MngFeeDeposit ref={depositRef} master={selected} onChanges={setChanges} />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
