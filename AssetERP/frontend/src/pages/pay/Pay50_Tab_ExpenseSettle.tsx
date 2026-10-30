/**
 * [1390] 자금관리 > 20. 사업비관리 > 미지급반제처리 (U11)
 * AS-IS: myApp/client/vi/pay/Pay50_Tab_ExpenseSettle.java (246줄) + Ast07_Grid_History·Ast07_Lookup_Settle·Ast07_Lookup_SettleMulti (pages/ast) + Sys15_Lookup_Corp (components/lookup)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L57-91: BorderLayout 가운데 0.6(여백 20) = 툴바 50(거래처 200 "전체" · 검색 250 "거래처/적요" · [조회] [결제등록] [일괄 결제등록]) + 미지급 그리드(체크 다중, 5열, 합계 행 "계"),
 *   남쪽 0.4(여백 0,20,20,20, 크기 조절) = Ast07_Grid_History(최근 결제내역·취소)
 * 열 때 한 번 조회한다(조회하면 아래 History도 다시 읽는다). 지급(02)·거래 구분 9100(사업비발생) 고정
 * 스타일: GG (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 * [다음 단계] History [전표변경] 아이콘의 Act02_Lookup_ModiJournal(분개 수정 창)은 안내만 한다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, Splitter, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { AgGridReact } from 'ag-grid-react';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { SettleAccrued } from '@/types/ast';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { Ast07_Grid_History } from '@/pages/ast/Ast07_Grid_History';
import { Ast07_Lookup_Settle } from '@/pages/ast/Ast07_Lookup_Settle';
import { Ast07_Lookup_SettleMulti } from '@/pages/ast/Ast07_Lookup_SettleMulti';

const gb = gbFor<SettleAccrued>();
/** setting() L94-95: trCode "9100" (사업비발생) */
const TR_CODE = '9100';
/** getSumGrid("계",2,5,6): 일자 열에 "계", 거래금액·미지급액 합계 */
const SUM_ROW = { labelField: 'date', label: '계', sum: ['amt', 'accruedAmt'] };
const DR = { color: '#456EA6', fontWeight: 'bold' };

export const Pay50_Tab_ExpenseSettle: React.FC = () => {
  // [E0] 화면 열림 (생성자 L57-91) → setting(), retrieve()
  const [corpId, setCorpId] = useState<number | null>(null);
  const [corpName, setCorpName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<SettleAccrued[]>([]);
  const [loading, setLoading] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const [settleId, setSettleId] = useState<number | null>(null);
  const [multiRows, setMultiRows] = useState<SettleAccrued[] | null>(null);
  const [historyNonce, setHistoryNonce] = useState(0);
  const gridRef = useRef<AgGridReact<SettleAccrued>>(null);

  /** retrieve()가 읽는 조건 */
  const condRef = useRef({ corpId, searchText });
  condRef.current = { corpId, searchText };

  // retrieve() L174-201: ast.Ast06_Tr.selectByAccrued(companyId, userId, orgId, assetType "1", abroType "1", payCode "02", classTreeId 0, searchText, trCode "9100", corpId) → 끝나면 gridSettle.retrieve()
  const retrieve = useCallback(async () => {
    const c = condRef.current;
    setLoading(true);
    try {
      setRows(await astApi.searchSettleAccrueds({ corpId: c.corpId, searchText: c.searchText, trCode: TR_CODE }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
      setHistoryNonce(n => n + 1);
    }
  }, []);

  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E4] updateButton[결제등록].Select (L137) → insert() L203-225: 선택 검사 → Ast07_Lookup_Settle.openNew9100(trId, …) → 저장되면 retrieve()
  const insert = () => {
    const sel = gridRef.current?.api.getSelectedRows() ?? [];
    if (sel.length === 0) { message.info('결제건을 선택해주세요.'); return; }
    if (sel.length > 1) { message.info("단건 처리만 가능합니다. 다건 처리는 '일괄결제등록' 버튼을 사용하세요"); return; }
    setSettleId(sel[0].trId);
  };

  // [E5] multiUpdateButton[일괄 결제등록].Select (L143) → multiInsert() L227-241: 선택 검사 → Ast07_Lookup_SettleMulti.open(…) → 저장되면 retrieve()
  const multiInsert = () => {
    const sel = gridRef.current?.api.getSelectedRows() ?? [];
    if (sel.length === 0) { message.info('결제건을 선택해주세요.'); return; }
    setMultiRows(sel);
  };

  // buildGrid() L160-172: setChecked(MULTI)
  const columnDefs = useMemo(() => [
    gb.date('date', 100, '일자'),  // L165
    gb.text('corpName', 200, '거래처'),  // L166
    gb.textArea('note', 450, '적요'),  // L167
    gb.long('amt', 150, '거래금액'),  // L168
    gb.double('accruedAmt', 150, '미지급액', { headerStyle: DR }),  // L169
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel defaultSize="60%" min={120}>
          <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* [E3] retrieveButton[조회].Select (L131) / [E2] searchText.KeyPress [Enter] (L122) → retrieve() */}
              <SearchBar onSearch={retrieve} loading={loading} extra={<>
                <Button type="register" onClick={insert}>결제등록</Button>
                <Button type="register" onClick={multiInsert}>일괄 결제등록</Button>
              </>}>
                <SearchBar.Field label="거래처">
                  {/* [E1] corpName.TriggerClick [result != null] (L100) → Sys15_Lookup_Corp.open(false, true, …): 고르면 이름·ID, 전체면 "전체"·null */}
                  <Input readOnly style={{ width: 200, cursor: 'pointer' }} placeholder="전체" value={corpName} suffix={<SearchOutlined />} onClick={() => setCorpOpen(true)} />
                </SearchBar.Field>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 250 }} placeholder="거래처/적요" value={searchText} onChange={e => setSearchText(e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                <MultiGrid<SettleAccrued>
                  gridRef={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.trId)}
                  sumRow={SUM_ROW}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize="40%" min={200}>
          <div style={{ height: '100%', padding: '0 20px 20px 20px', boxSizing: 'border-box' }}>
            <Ast07_Grid_History assetType="1" expenseOnly trCode={TR_CODE} corpId={corpId} searchText={searchText} nonce={historyNonce} onChanged={() => void retrieve()} />
          </div>
        </Splitter.Panel>
      </Splitter>
      <Sys15_Lookup_Corp open={corpOpen} empYn
        onResult={corp => { setCorpName(corp ? corp.corpName ?? '' : ''); setCorpId(corp ? corp.corpId : null); setCorpOpen(false); }}
        onClose={() => setCorpOpen(false)} />
      <Ast07_Lookup_Settle expenseId={settleId} onDone={() => void retrieve()} onClose={() => setSettleId(null)} />
      <Ast07_Lookup_SettleMulti rows={multiRows} onDone={() => void retrieve()} onClose={() => setMultiRows(null)} />
    </div>
  );
};
