/**
 * [1175] 고유자산 > 20. 고유자산 거래처리 > 감가상각처리 (W11)
 * AS-IS: myApp/client/vi/ast/Ast06_Tab_EvalDepn.java (381줄) + Ast16_Lookup_NonDeductTax.java (191줄) + Ast06_Lookup_ModifyDepnCost.java (116줄)
 *   + Ast06_Grid_Journal.java (143줄) + Act02_Lookup_ModiJournal(분개 그리드의 [변경], W05 재사용) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L61-80: BorderLayout 위 = 툴바 50(여백 20,20,0,20: 상각년월 70 "YYYY.MM" · [조회][처리][취소] · 안내 "※ 자산명 더블클릭시 불공제세액 관리 팝업창이 열립니다" 파랑 456EA6 12px)
 *   + 가운데 그리드(여백 -2,20,-2,20, 행번호·체크 다중·10열·맨 아래 합계 "계"), 아래 300(여백 0,20,20,20) = Ast06_Grid_Journal
 * 스타일: GG (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01), 읽기 전용 날짜 열 폭 90(UX-08, 원본 100)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Splitter } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstDepn } from '@/types/ast';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { Ast06_Grid_Journal, Ast06_Grid_JournalHandle } from './Ast06_Grid_Journal';
import { Ast16_Lookup_NonDeductTax, NonDeductTaxTarget } from './Ast16_Lookup_NonDeductTax';
import { Ast06_Lookup_ModifyDepnCost, ModifyDepnCostTarget } from './Ast06_Lookup_ModifyDepnCost';

const gb = gbFor<AstDepn>();
const FORMAT = 'YYYY-MM-DD';

export const Ast06_Tab_EvalDepn: React.FC = () => {
  const gridRef = useRef<AgGridReact<AstDepn>>(null);
  const journalRef = useRef<Ast06_Grid_JournalHandle>(null);
  // setting() L84-90: 상각년월 = 지난달(오늘의 이번 달 1일 - 1일)
  const [closeDate, setCloseDate] = useState(() => dayjs().startOf('month').subtract(1, 'day').format('YYYY.MM'));
  const [rows, setRows] = useState<AstDepn[]>([]);
  const [loading, setLoading] = useState(false);
  const [taxTarget, setTaxTarget] = useState<NonDeductTaxTarget | null>(null);
  const [costTarget, setCostTarget] = useState<ModifyDepnCostTarget | null>(null);

  /** getDepnDate() L323-329: 상각년월의 말일. 형식이 틀리면 null(AS-IS는 파싱 예외로 아무 일도 안 한다) */
  const getDepnDate = useCallback(() => {
    const m = dayjs(closeDate.replace(/-/g, '.') + '.01', 'YYYY.MM.DD', true);
    return m.isValid() ? m.endOf('month') : null;
  }, [closeDate]);

  // retrieve() L181-198: ast.Ast06_Tr.selectDepn(회사, depnDate) → 첫 행 선택 → retrievePage() L200-203
  const retrieve = useCallback(async () => {
    const depn = getDepnDate();
    if (!depn) { message.warning('상각년월을 확인하세요. (YYYY.MM)'); return; }
    setLoading(true);
    try {
      const list = await astApi.searchDepns(depn.format(FORMAT));
      setRows(list);
      const first = list[0];
      if (first) {
        setTimeout(() => gridRef.current?.api?.getRowNode(String(first.trId))?.setSelected(true), 0);
        await journalRef.current?.retrieve(first.journalId);
      } else {
        journalRef.current?.clear();
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [getDepnDate]);

  // [E0] 화면 열림 (생성자 L61-80) → setting() — 마지막에 retrieve() L145
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const selected = () => gridRef.current?.api.getSelectedRows() ?? [];

  // [E3] updateButton[처리].Select (L118) → update() L205-256
  const update = async () => {
    const depn = getDepnDate();
    if (!depn) { message.warning('상각년월을 확인하세요. (YYYY.MM)'); return; }
    if (depn.isAfter(dayjs())) { message.warning('평가일이 미래일입니다.'); return; }
    const sel = selected();
    if (sel.length === 0) { message.warning('처리대상을 선택하세요'); return; }
    if (sel.some(r => r.statusName === '처리완료')) { message.warning('상각처리가 완료자산이 포함되어 있습니다.'); return; }
    setLoading(true);   // grid.mask("처리중 입니다.")
    try {
      // 회계마감 검사(act.Act04_GenLedger.checkClose)와 처리(ast.Ast06_Tr.updateDepnEval)는 서버가 한 트랜잭션으로 한다
      await astApi.processDepns(sel);
      message.success('처리가 완료되었습니다.');
      setLoading(false);
      await retrieve();
    } catch (err) {
      setLoading(false);
      message.error(errorMessage(err, '처리 실패'));
    }
  };

  // [E4] cancelButton[취소].Select (L124) → delete() L258-301: ast.Ast06_Tr.delete
  const cancelDepn = async () => {
    const sel = selected();
    if (sel.length === 0) { message.warning('취소대상을 선택하세요'); return; }
    if (sel.some(r => r.statusName === '미처리')) { message.warning('처리전 자산이 포함되어 있습니다.'); return; }
    setLoading(true);   // grid.mask("취소중 입니다")
    try {
      // checkClose(depnDate)는 deleteTrs 안에서 거래일마다 한다
      await astApi.deleteTrs(sel.map(r => r.trId));
      message.success('취소가 완료되었습니다.');
      setLoading(false);
      await retrieve();
    } catch (err) {
      setLoading(false);
      message.error(errorMessage(err, '취소 실패'));
    }
  };

  const titleOf = (r: AstDepn) => `[ ${r.classTreeName ?? ''} ] (취득일 ${r.purDate})`;

  // [E6] grid.RowDoubleClick (L138) → lookupNonDeductTax() L331-348: 처리완료면 안내, 아니면 Ast16_Lookup_NonDeductTax.open(purTrId, 제목, callback = retrieve)
  const lookupNonDeductTax = (r: AstDepn) => {
    if (r.statusName === '처리완료') { message.warning('불공제세액 변경은 감가상각처리 취소 후 가능합니다'); return; }
    setTaxTarget({ purTrId: r.purTrId, title: titleOf(r) });
  };

  // 수정 아이콘 actionCell (L150-155) → lookupModify() L350-372: 미처리면 안내 → checkClose(depnDate) → Ast06_Lookup_ModifyDepnCost.open(…, 저장하면 그 행의 금액을 바꾼다)
  const lookupModify = async (r: AstDepn) => {
    if (r.statusName === '미처리') { message.warning('수정할 처리내역이 없습니다.'); return; }
    const depn = getDepnDate();
    if (!depn) { message.warning('상각년월을 확인하세요. (YYYY.MM)'); return; }
    try {
      await astApi.checkDepnClose(depn.format(FORMAT));
    } catch (err) {
      message.error(errorMessage(err, '회계마감 확인 실패'));
      return;
    }
    setCostTarget({ trId: r.trId, title: titleOf(r), amt: r.amt });
  };

  // buildGrid() L148-179
  const columnDefs = useMemo(() => [
    gb.date('date', 90, '상각일자'),                                  // L162
    gb.text('itemClassTypeName', 200, '구분'),                        // L163
    gb.text('classTreeName', 300, '자산명'),                          // L164
    gb.date('purDate', 90, '취득일자'),                               // L165
    gb.long('bookAmt', 150, '취득금액'),                              // L166
    gb.long('nonDeductTax', 130, '불공제세액<br>(추가분)'),           // L167
    gb.textCenter('depnTypeName', 100, '상각방식'),                   // L168
    gb.long('amt', 150, '감가상각비'),                                // L169
    gb.textCenter('statusName', 100, '처리여부'),                     // L170
    iconCell<AstDepn>('edit', 'modiAction', 50, '수정', r => void lookupModify(r)),   // L171 actionCell
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [closeDate]);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel min={120}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* [E2] retrieveButton[조회].Select (L112) → retrieve(), [E1] closeDate.KeyPress [Enter] (L91) → retrieve() */}
              <SearchBar
                onSearch={retrieve}
                loading={loading}
                extra={
                  <>
                    <Button type="save" onClick={update}>처리</Button>
                    <Button type="cancel" onClick={cancelDepn}>취소</Button>
                    <span style={{ color: '#456EA6', fontSize: 12, marginLeft: 8 }}>※ 자산명 더블클릭시 불공제세액 관리 팝업창이 열립니다</span>
                  </>
                }
              >
                <SearchBar.Field label="상각년월">
                  <SearchBar.Input style={{ width: 100 }} placeholder="YYYY.MM" value={closeDate} onChange={e => setCloseDate(e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                {/* [E5] grid.RowClick (L131) → retrievePage(): 고른 행의 분개를 다시 읽는다(같은 행을 다시 눌러도) */}
                <MultiGrid<AstDepn> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.trId)}
                  sumRow={{ labelField: 'itemClassTypeName', label: '계', sum: ['bookAmt', 'nonDeductTax', 'amt'] }}
                  onRowClicked={e => { if (e.data) void journalRef.current?.retrieve(e.data.journalId); }}
                  onRowDoubleClicked={e => { if (e.data) lookupNonDeductTax(e.data); }} />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={300} min={200}>
          <div style={{ height: '100%', padding: '0 20px 20px 20px', boxSizing: 'border-box' }}>
            <Ast06_Grid_Journal ref={journalRef} />
          </div>
        </Splitter.Panel>
      </Splitter>
      <Ast16_Lookup_NonDeductTax target={taxTarget} onSaved={() => void retrieve()} onClose={() => setTaxTarget(null)} />
      <Ast06_Lookup_ModifyDepnCost target={costTarget} onClose={() => setCostTarget(null)}
        onSaved={(trId, amt) => setRows(prev => prev.map(r => (r.trId === trId ? { ...r, amt, forAmt: amt } : r)))} />
    </div>
  );
};
