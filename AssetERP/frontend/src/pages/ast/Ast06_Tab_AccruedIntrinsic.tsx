/**
 * [1092] 관리회계 > 11. 특수회계처리 > 미수/미지급 (X04)
 * AS-IS: myApp/client/vi/ast/Ast06_Tab_AccruedIntrinsic.java (330줄) + Ast05_Lookup_TrCodeWindow·Ast07_Grid_History·Ast07_Lookup_Settle·Ast07_Lookup_SettleMulti (pages/ast) + Sys15_Lookup_Corp (components/lookup)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L60-94: BorderLayout 가운데 0.6(여백 20) = 툴바 50(수령/지급 100 · 거래유형 200 "전체" · 거래처 200 "전체" · 검색 250 "거래유형/거래처/종목/적요" · [조회] [결제등록] [일괄 결제등록]) + 미수/미지급 그리드(체크 다중, 6열, 합계 행 "계"),
 *   남쪽 0.4(여백 0,20,20,20, 크기 조절) = Ast07_Grid_History("1" 고유자산, 수령/지급·거래유형·거래처·검색어를 따라간다)
 * 열 때 한 번 조회한다(조회하면 아래 History도 다시 읽는다). 종목구분(classTree)은 원본에서 주석 처리되어 0 고정
 * 스타일: GG (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 * [다음 단계] History [전표변경] 아이콘의 Act02_Lookup_ModiJournal(분개 수정 창)은 안내만 한다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Splitter, message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstTrCodeByWindow, SettleAccrued } from '@/types/ast';
import { Corp } from '@/types/sys';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Ast05_Lookup_TrCodeWindow } from './Ast05_Lookup_TrCodeWindow';
import { Ast07_Grid_History } from './Ast07_Grid_History';
import { Ast07_Lookup_Settle, AstSettleTarget } from './Ast07_Lookup_Settle';
import { Ast07_Lookup_SettleMulti } from './Ast07_Lookup_SettleMulti';

const gb = gbFor<SettleAccrued>();
const ALL_LABEL = '전체';
const WINDOW_CLASS = 'Ast06_Tab_AccruedIntrinsic';
/** insert() L274-309: 거래 코드 9100(사업비 발생)이면 trId가 지출결의서 ID라 openNew9100으로 연다 */
const TR_CODE_EXPENSE = '9100';
/** getSumGrid("계",2,6,7): 일자 열에 "계", 거래금액·미수/미지급액 합계 */
const SUM_ROW = { labelField: 'date', label: '계', sum: ['amt', 'accruedAmt'] };
const DR = { color: '#456EA6', fontWeight: 'bold' };

export const Ast06_Tab_AccruedIntrinsic: React.FC = () => {
  // [E0] 화면 열림 (생성자 L60-94) → setting(), retrieve()
  // setting() L96-217: 수령/지급 = 전체("%"), 거래유형·거래처 = 전체
  const [payCode, setPayCode] = useState('%');
  const [trCode, setTrCode] = useState<string | null>(null);
  const [trName, setTrName] = useState(ALL_LABEL);
  const [corpId, setCorpId] = useState<number | null>(null);
  const [corpName, setCorpName] = useState(ALL_LABEL);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<SettleAccrued[]>([]);
  const [loading, setLoading] = useState(false);
  const [trCodeOpen, setTrCodeOpen] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const [expenseId, setExpenseId] = useState<number | null>(null);
  const [target, setTarget] = useState<AstSettleTarget | null>(null);
  const [multiRows, setMultiRows] = useState<SettleAccrued[] | null>(null);
  const [historyNonce, setHistoryNonce] = useState(0);
  const gridRef = useRef<AgGridReact<SettleAccrued>>(null);

  /** retrieve()가 읽는 조건 */
  const condRef = useRef({ payCode, trCode, corpId, searchText });
  condRef.current = { payCode, trCode, corpId, searchText };

  // retrieve() L235-272: ast.Ast06_Tr.selectByAccrued(companyId, userId, orgId, assetType "1", abroType "1", searchText, trCode, payCode, classTreeId 0, corpId) → 끝나면 gridSettle.retrieve()
  const retrieve = useCallback(async () => {
    const c = condRef.current;
    setLoading(true);
    try {
      setRows(await astApi.searchSettleAccrueds({ corpId: c.corpId, searchText: c.searchText, trCode: c.trCode ?? '%', payCode: c.payCode }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
      setHistoryNonce(n => n + 1);
    }
  }, []);

  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E1] trName.TriggerClick [result != null] (L105) → Ast05_Lookup_TrCodeWindow.open("Ast06_Tab_AccruedIntrinsic", null, …): 고르면 거래코드·이름, 전체면 "%"·"전체"
  const onTrCodeResult = (row: AstTrCodeByWindow | null) => {
    setTrCodeOpen(false);
    setTrCode(row ? row.trCode : null);
    setTrName(row ? row.trName ?? '' : ALL_LABEL);
  };

  // [E2] corpName.TriggerClick [result != null] (L128) → Sys15_Lookup_Corp.open(false, true, …): 고르면 이름·ID, 전체면 "전체"·null
  const onCorpResult = (c: Corp | null) => {
    setCorpOpen(false);
    setCorpName(c ? c.corpName ?? '' : ALL_LABEL);
    setCorpId(c ? c.corpId : null);
  };

  // [E5] updateButton[결제등록].Select (L188) → insert() L274-309: 선택 검사 → 9100이면 openNew9100(trId), 아니면 openNew(trId) → 저장되면 retrieve()
  const insert = () => {
    const sel = gridRef.current?.api.getSelectedRows() ?? [];
    if (sel.length === 0) { message.info('결제건을 선택해주세요.'); return; }
    if (sel.length > 1) { message.info("단건 처리만 가능합니다. 다건 처리는 '일괄결제등록' 버튼을 사용하세요"); return; }
    const row = sel[0];
    if (row.trCode === TR_CODE_EXPENSE) setExpenseId(row.trId);
    else setTarget({ mode: 'NEW', trId: row.trId });
  };

  // [E6] multiUpdateButton[일괄 결제등록].Select (L194) → multiInsert() L311-325: 선택 검사 → Ast07_Lookup_SettleMulti.open(…) → 저장되면 retrieve()
  const multiInsert = () => {
    const sel = gridRef.current?.api.getSelectedRows() ?? [];
    if (sel.length === 0) { message.info('결제건을 선택해주세요.'); return; }
    setMultiRows(sel);
  };

  // buildGrid() L219-233: setChecked(MULTI)
  const columnDefs = useMemo(() => [
    gb.date('date', 100, '일자'),  // L225
    gb.text('trName', 200, '거래유형'),  // L226
    gb.text('corpName', 200, '거래처'),  // L227
    gb.textArea('note', 450, '종목/거래적요'),  // L228
    gb.long('amt', 150, '거래금액'),  // L229
    gb.double('accruedAmt', 150, '미수/미지급액', { headerStyle: DR }),  // L230
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel defaultSize="60%" min={120}>
          <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* [E4] retrieveButton[조회].Select (L182) / [E3] searchText.KeyPress [Enter] (L173) → retrieve() */}
              <SearchBar onSearch={retrieve} loading={loading} extra={<>
                <Button type="register" onClick={insert}>결제등록</Button>
                <Button type="register" onClick={multiInsert}>일괄 결제등록</Button>
              </>}>
                <SearchBar.Field label="수령/지급">
                  <SystemCodeComboBox kindCd="RcvPayCode" altCode={['%', ALL_LABEL]} style={{ width: 100 }} value={payCode} onChange={code => setPayCode(code ?? '%')} />
                </SearchBar.Field>
                <SearchBar.Field label="거래유형">
                  <LookupInput value={trName} width={200} placeholder={ALL_LABEL} onOpen={() => setTrCodeOpen(true)} onClear={() => onTrCodeResult(null)} />
                </SearchBar.Field>
                <SearchBar.Field label="거래처">
                  <LookupInput value={corpName} width={200} placeholder={ALL_LABEL} onOpen={() => setCorpOpen(true)} onClear={() => onCorpResult(null)} />
                </SearchBar.Field>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 250 }} placeholder="거래유형/거래처/종목/적요" value={searchText} onChange={e => setSearchText(e.target.value)} />
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
            <Ast07_Grid_History assetType="1" expenseOnly={false} payCode={payCode} trCode={trCode} corpId={corpId} searchText={searchText} nonce={historyNonce} onChanged={() => void retrieve()} />
          </div>
        </Splitter.Panel>
      </Splitter>
      <Ast05_Lookup_TrCodeWindow open={trCodeOpen} windowClassName={WINDOW_CLASS} onResult={onTrCodeResult} onClose={() => setTrCodeOpen(false)} />
      <Sys15_Lookup_Corp open={corpOpen} empYn onResult={onCorpResult} onClose={() => setCorpOpen(false)} />
      <Ast07_Lookup_Settle expenseId={expenseId} target={target} onDone={() => void retrieve()} onClose={() => { setExpenseId(null); setTarget(null); }} />
      <Ast07_Lookup_SettleMulti rows={multiRows} onDone={() => void retrieve()} onClose={() => setMultiRows(null)} />
    </div>
  );
};
