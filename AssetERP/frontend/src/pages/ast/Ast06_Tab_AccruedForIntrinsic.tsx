/**
 * [1173] 관리회계 > 12. 특수회계처리(외화) > 미수/미지급(외화) (X09)
 * AS-IS: myApp/client/vi/ast/Ast06_Tab_AccruedForIntrinsic.java (284줄) + Ast05_Lookup_TrCodeWindow·Ast07_Grid_ForHistory·Ast07_Lookup_ForSettle (pages/ast) + Sys15_Lookup_Corp (components/lookup)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L60-93: BorderLayout 가운데 0.6(여백 20) = 툴바 50(수령/지급 100 · 거래유형 200 "전체" · 거래처 200 "전체" · 검색 300 "거래유형/거래처/종목/적요/통화" · [조회] [결제등록]) + 미수/미지급 그리드(단일 선택, 9열),
 *   남쪽 0.4(여백 0,20,20,20, 크기 조절) = Ast07_Grid_ForHistory("1" 고유자산, 수령/지급·거래유형·거래처·검색어를 따라간다)
 * 미수/미지급(Ast06_Tab_AccruedForIntrinsic, X04)의 외화 판 — 국외(abroType "2")만 읽고, 일괄 결제등록·합계 행이 없으며 통화·외화 거래금액·외화 미수/미지급 열을 쓴다. 지출결의서(9100) 분기도 없다
 * 열 때 한 번 조회한다(조회하면 아래 History도 다시 읽는다)
 * 스타일: GG (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Splitter, message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstTrCodeByWindow, SettleAccrued } from '@/types/ast';
import { Corp } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Ast05_Lookup_TrCodeWindow } from './Ast05_Lookup_TrCodeWindow';
import { Ast07_Grid_ForHistory } from './Ast07_Grid_ForHistory';
import { Ast07_Lookup_ForSettle, AstForSettleTarget } from './Ast07_Lookup_ForSettle';

const gb = gbFor<SettleAccrued>();
const ALL_LABEL = '전체';
const WINDOW_CLASS = 'Ast06_Tab_AccruedForIntrinsic';
const DR = { color: '#456EA6', fontWeight: 'bold' };

export const Ast06_Tab_AccruedForIntrinsic: React.FC = () => {
  // [E0] 화면 열림 (생성자 L60-94) → setting(), retrieve()
  // setting() L95-190: 수령/지급 = 전체("%"), 거래유형·거래처 = 전체
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
  const [target, setTarget] = useState<AstForSettleTarget | null>(null);
  const [historyNonce, setHistoryNonce] = useState(0);
  const gridRef = useRef<AgGridReact<SettleAccrued>>(null);

  /** retrieve()가 읽는 조건 */
  const condRef = useRef({ payCode, trCode, corpId, searchText });
  condRef.current = { payCode, trCode, corpId, searchText };

  // retrieve() L226-260: ast.Ast06_Tr.selectByAccrued(companyId, userId, orgId, assetType "1", abroType "2", searchText, trCode, payCode, classTreeId 0, corpId) → 끝나면 gridSettle.retrieve()
  const retrieve = useCallback(async () => {
    const c = condRef.current;
    setLoading(true);
    try {
      setRows(await astApi.searchSettleAccrueds({ corpId: c.corpId, searchText: c.searchText, trCode: c.trCode ?? '%', payCode: c.payCode, abroType: '2' }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
      setHistoryNonce(n => n + 1);
    }
  }, []);

  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E1] trName.TriggerClick [result != null] (L104) → Ast05_Lookup_TrCodeWindow.open("Ast06_Tab_AccruedForIntrinsic", null, …): 고르면 거래코드·이름, 전체면 "%"·"전체"
  const onTrCodeResult = (row: AstTrCodeByWindow | null) => {
    setTrCodeOpen(false);
    setTrCode(row ? row.trCode : null);
    setTrName(row ? row.trName ?? '' : ALL_LABEL);
  };

  // [E2] corpName.TriggerClick [result != null] (L127) → Sys15_Lookup_Corp.open(…): 고르면 이름·ID, 전체면 "전체"·null
  const onCorpResult = (c: Corp | null) => {
    setCorpOpen(false);
    setCorpName(c ? c.corpName ?? '' : ALL_LABEL);
    setCorpId(c ? c.corpId : null);
  };

  // [E5] updateButton[결제등록].Select (L187) → insert() L263-279: 선택이 없으면 "결제건을 선택해주세요." → Ast07_Lookup_ForSettle.openNew(trId) → 저장되면 retrieve()
  const insert = () => {
    const sel = gridRef.current?.api.getSelectedRows() ?? [];
    if (sel.length === 0) { message.info('결제건을 선택해주세요.'); return; }
    setTarget({ mode: 'NEW', trId: sel[0].trId });
  };

  // buildGrid() L208-225: setChecked(SINGLE), 합계 행 없음
  const columnDefs = useMemo(() => [
    gb.date('date', 100, '일자'),  // L211
    gb.text('trName', 200, '거래유형'),  // L212
    gb.text('corpName', 200, '거래처'),  // L213
    gb.text('note', 450, '종목/거래적요'),  // L214
    gb.textCenter('curCode', 80, '통화'),  // L215
    gb.double('forAmt', 150, '외화 거래금액'),  // L216
    gb.double('accruedAmt', 150, '외화 미수/미지급', { headerStyle: DR }),  // L217
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
                  <SearchBar.Input style={{ width: 300 }} placeholder="거래유형/거래처/종목/적요/통화" value={searchText} onChange={e => setSearchText(e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                <SingleGrid<SettleAccrued>
                  gridRef={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.trId)}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize="40%" min={200}>
          <div style={{ height: '100%', padding: '0 20px 20px 20px', boxSizing: 'border-box' }}>
            <Ast07_Grid_ForHistory assetType="1" payCode={payCode} trCode={trCode} corpId={corpId} searchText={searchText} nonce={historyNonce} onChanged={() => void retrieve()} />
          </div>
        </Splitter.Panel>
      </Splitter>
      <Ast05_Lookup_TrCodeWindow open={trCodeOpen} windowClassName={WINDOW_CLASS} onResult={onTrCodeResult} onClose={() => setTrCodeOpen(false)} />
      <Sys15_Lookup_Corp open={corpOpen} onResult={onCorpResult} onClose={() => setCorpOpen(false)} />
      <Ast07_Lookup_ForSettle target={target} onDone={() => void retrieve()} onClose={() => setTarget(null)} />
    </div>
  );
};
