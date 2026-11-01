/**
 * 이자평가 탭 (W09) — Ast06_Tab_EvalFinance의 둘째 탭
 * AS-IS: myApp/client/vi/ast/Ast06_TabPage_InterestEval.java (118줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L29-41: BorderLayout 가운데 = 평가 그리드(60%, 행번호·체크 다중·12열), 아래 = Ast06_Grid_Journal(40%, 분할)
 * 평가구분(evalType) "2" 이자평가 — 시가평가 탭과 달리 평가구분·평가단가·평가손익 열이 없고 평가금액 열이 "이자금액"이다
 */
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message, Splitter } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstEval } from '@/types/ast';
import { MultiGrid, gbFor } from '@/components/grid';
import { Ast06_Grid_Journal, Ast06_Grid_JournalHandle } from './Ast06_Grid_Journal';
import type { Ast06_EvalTabHandle, Ast06_EvalTabParam } from './Ast06_TabPage_MarketEval';

const gb = gbFor<AstEval>();

// [E0] 화면 열림 (생성자 L29-41) → setting()
export const Ast06_TabPage_InterestEval = forwardRef<Ast06_EvalTabHandle>((_props, ref) => {
  const gridRef = useRef<AgGridReact<AstEval>>(null);
  const journalRef = useRef<Ast06_Grid_JournalHandle>(null);
  const [rows, setRows] = useState<AstEval[]>([]);
  const [loading, setLoading] = useState(false);

  // retrievePage(): gridJournal.retrieve(journalId, date)
  const retrievePage = (row: AstEval | undefined) => journalRef.current?.retrieve(row?.journalId);

  // retrieve(param) L89-112: ast.Ast06_Tr.selectEvalList(…, evalType "2") → 첫 행 선택 → retrievePage()
  const retrieve = async (p: Ast06_EvalTabParam) => {
    setLoading(true);
    try {
      const list = await astApi.searchEvals({ ...p, evalType: '2' });
      setRows(list);
      const first = list[0];
      if (first) {
        setTimeout(() => gridRef.current?.api?.getRowNode(String(first.trId))?.setSelected(true), 0);
        await retrievePage(first);
      } else {
        journalRef.current?.clear();
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    retrieve,
    getSelected: () => gridRef.current?.api?.getSelectedRows() ?? [],
    getFirst: () => rows[0],
    updateRows: changed => {
      const byId = new Map(changed.map(r => [r.trId, r]));
      setRows(prev => prev.map(r => byId.get(r.trId) ?? r));
    },
    mask: on => setLoading(on),
  }));

  // buildGrid() (setChecked MULTI)
  const columnDefs = useMemo(() => [
    gb.textCenter('evalYnName', 80, '평가여부'),
    gb.date('date', 90, '평가일자'),
    gb.text('corpAccountName', 200, '계좌'),
    gb.text('astClassName', 150, '종목유형'),
    gb.text('classTreeName', 250, '종목'),
    gb.double('qty', 100, '보유수량'),
    gb.long('financeBookAmt', 120, '보유금액'),
    gb.long('amt', 120, '이자금액'),
    gb.textRight('holdPeriod', 120, '보유기간'),
    gb.text('note', 150, '적요'),
    gb.textCenter('personName', 80, '처리자'),
  ], []);

  return (
    <Splitter layout="vertical" style={{ height: '100%' }}>
      <Splitter.Panel defaultSize="60%" min={120}>
        <div style={{ height: '100%', paddingBottom: 8, boxSizing: 'border-box' }}>
          {/* [E1] grid.RowClick → retrievePage() */}
          <MultiGrid<AstEval> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} loading={loading} getRowId={p => String(p.data.trId)}
            onRowClicked={e => { if (e.data) void retrievePage(e.data); }} />
        </div>
      </Splitter.Panel>
      <Splitter.Panel defaultSize="40%" min={160}>
        <div style={{ height: '100%', paddingTop: 8, boxSizing: 'border-box' }}>
          <Ast06_Grid_Journal ref={journalRef} />
        </div>
      </Splitter.Panel>
    </Splitter>
  );
});
Ast06_TabPage_InterestEval.displayName = 'Ast06_TabPage_InterestEval';
