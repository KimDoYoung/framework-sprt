/**
 * 시가평가 탭 (W09) — Ast06_Tab_EvalFinance의 첫 탭
 * AS-IS: myApp/client/vi/ast/Ast06_TabPage_MarketEval.java (121줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L29-41: BorderLayout 가운데 = 평가 그리드(60%, 행번호·체크 다중·14열), 아래 = Ast06_Grid_Journal(40%, 분할)
 * 평가구분(evalType) "1" 시가평가
 */
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message, Splitter } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstEval } from '@/types/ast';
import { MultiGrid, gbFor } from '@/components/grid';
import { Ast06_Grid_Journal, Ast06_Grid_JournalHandle } from './Ast06_Grid_Journal';

const gb = gbFor<AstEval>();

/** 평가 탭이 부모에게 여는 것 — AS-IS InterfaceTabPage.getGrid()/retrieve(param)/init() */
export interface Ast06_EvalTabParam {
  closeDate: string;
  corpId: number | null;
  accountId: number | null;
  classTreeId: number | null;
  searchText: string;
}

export interface Ast06_EvalTabHandle {
  retrieve: (param: Ast06_EvalTabParam) => Promise<void>;
  /** grid.getSelectionModel().getSelectedItems() */
  getSelected: () => AstEval[];
  /** grid.getStore().get(0) */
  getFirst: () => AstEval | undefined;
  /** grid.getStore().update(trModel) — 처리한 줄로 바꾼다 */
  updateRows: (rows: AstEval[]) => void;
  mask: (on: boolean) => void;
}

// [E0] 화면 열림 (생성자 L29-41) → setting() L43-50
export const Ast06_TabPage_MarketEval = forwardRef<Ast06_EvalTabHandle>((_props, ref) => {
  const gridRef = useRef<AgGridReact<AstEval>>(null);
  const journalRef = useRef<Ast06_Grid_JournalHandle>(null);
  const [rows, setRows] = useState<AstEval[]>([]);
  const [loading, setLoading] = useState(false);

  // retrievePage() L80-83: gridJournal.retrieve(journalId, date)
  const retrievePage = (row: AstEval | undefined) => journalRef.current?.retrieve(row?.journalId);

  // retrieve(param) L92-115: ast.Ast06_Tr.selectEvalList(companyId, assetType, closeDate, corpId, accountId, classTreeId, searchText, evalType "1") → 첫 행 선택 → retrievePage()
  const retrieve = async (p: Ast06_EvalTabParam) => {
    setLoading(true);
    try {
      const list = await astApi.searchEvals({ ...p, evalType: '1' });
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

  // buildGrid() L52-78 (setChecked MULTI)
  const columnDefs = useMemo(() => [
    gb.textCenter('evalYnName', 80, '평가여부'),         // L60
    gb.textCenter('evalTypeName', 80, '평가구분'),       // L61
    gb.date('date', 90, '평가일자'),                     // L62
    gb.text('corpAccountName', 200, '계좌'),             // L63
    gb.text('astClassName', 150, '종목유형'),            // L64
    gb.text('classTreeName', 250, '종목'),               // L65
    gb.double('qty', 100, '보유수량'),                   // L66
    gb.long('financeBookAmt', 120, '보유금액'),          // L67
    gb.double('price', 100, '평가단가'),                 // L68
    gb.long('amt', 120, '평가금액'),                     // L69
    gb.long('pl', 100, '평가손익'),                      // L70
    gb.textRight('holdPeriod', 120, '보유기간'),         // L71
    gb.text('note', 150, '적요'),                        // L72
    gb.textCenter('personName', 80, '처리자'),           // L73
  ], []);

  return (
    <Splitter layout="vertical" style={{ height: '100%' }}>
      <Splitter.Panel defaultSize="60%" min={120}>
        <div style={{ height: '100%', paddingBottom: 8, boxSizing: 'border-box' }}>
          {/* [E1] grid.RowClick (L44) → retrievePage() */}
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
Ast06_TabPage_MarketEval.displayName = 'Ast06_TabPage_MarketEval';
