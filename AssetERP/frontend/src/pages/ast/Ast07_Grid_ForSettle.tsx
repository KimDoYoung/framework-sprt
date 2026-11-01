/**
 * 결제내역 그리드(외화) (X08) — Ast06_Tab_TrForIntrinsic의 오른쪽(30%)에 놓인다
 * AS-IS: myApp/client/vi/ast/Ast07_Grid_ForSettle.java (354줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L57-82: 툴바 50([등록][삭제]) + 그리드(행번호, 단일 체크, 결제일자 110 · 외화결제금액 100 · 적용환율 100 · 원화결제금액 120 · 변경 아이콘 50 · 예금계좌 150 · 적요 250, 합계 행 "계")
 * 거래가 미수/미지급 관리 대상이 아니면(settleMngYn false) [등록][삭제]가 꺼진다(retrieve L158-179)
 * 결제 등록·변경 창은 Ast07_Lookup_ForSettle(외화)
 */
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { actApi } from '@/api/act';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstSettleByTr, AstTrIntrinsic } from '@/types/ast';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Button } from '@/components/button';
import { Ast06_Grid_ForJournalHandle } from './Ast06_Grid_ForJournal';
import { Ast07_Lookup_ForSettle, AstForSettleTarget } from './Ast07_Lookup_ForSettle';

const gb = gbFor<AstSettleByTr>();

export interface Ast07_Grid_ForSettleHandle {
  /** retrieve(trModel) L127-148 — 그 거래의 결제내역을 읽는다 */
  retrieve: (tr: AstTrIntrinsic) => Promise<void>;
  /** gridClear() L150-152 */
  clear: () => void;
}

interface Props {
  /** setJournal(journal) L118-120 — 결제를 고르거나 바꾸면 그 결제의 분개를 보여 준다 */
  journalRef: React.RefObject<Ast06_Grid_ForJournalHandle | null>;
}

// [E0] 화면 열림 (생성자 L57-87) → 툴바·그리드를 만들고 행 클릭 핸들러를 건다
export const Ast07_Grid_ForSettle = forwardRef<Ast07_Grid_ForSettleHandle, Props>(({ journalRef }, ref) => {
  const gridRef = useRef<AgGridReact<AstSettleByTr>>(null);
  const [rows, setRows] = useState<AstSettleByTr[]>([]);
  /** retrieve()가 받은 거래 — 결제 등록·변경이 쓴다 */
  const [tr, setTr] = useState<AstTrIntrinsic | null>(null);
  const [target, setTarget] = useState<AstForSettleTarget | null>(null);
  const trRef = useRef<AstTrIntrinsic | null>(null);

  const load = async (t: AstTrIntrinsic) => {
    try {
      setRows(await astApi.searchSettlesByTr(t.trId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  useImperativeHandle(ref, () => ({
    retrieve: async (t: AstTrIntrinsic) => { setTr(t); trRef.current = t; setRows([]); await load(t); },
    clear: () => { setRows([]); setTr(null); trRef.current = null; },
  }));

  // journalRetrieve() L122-125: 고른 결제의 분개를 읽는다
  const journalRetrieve = (row?: AstSettleByTr | null) => {
    const r = row ?? gridRef.current?.api.getSelectedRows()[0];
    if (r) void journalRef.current?.retrieve(r.journalId);
  };

  const reload = async () => { if (trRef.current) await load(trRef.current); };

  // [E1] insertButton[등록].Select (L60) → insertRow() L154-169: 거래가 없으면 "거래를 선택해주세요", Ast07_Lookup_ForSettle.openNew(trId, …) — 저장하면 분개를 읽는다
  const insertRow = () => {
    if (!tr) { message.info('거래를 선택해주세요'); return; }
    setTarget({ mode: 'NEW', trId: tr.trId });
  };

  // 변경 아이콘 actionCell(ImageCell "Edit") (L107-119): Ast07_Lookup_ForSettle.open(고른 행, "MODI", …) — 닫으면 분개를 읽는다
  const openModi = (row: AstSettleByTr) => {
    if (!tr) return;
    setTarget({ mode: 'MODI', settle: row });
  };

  const onSettleDone = async () => {
    await reload();
    // 저장·닫기 뒤 분개는 새로 읽은 목록에서 같은 결제를 찾아 읽는다
    setTimeout(() => {
      const sel = gridRef.current?.api.getSelectedRows()[0];
      journalRetrieve(sel);
    }, 100);
  };

  // [E2] deleteButton[삭제].Select (L66) → deleteRow() L171-182: 확인 "선택한 정보를 삭제하시겠습니까?" → [E4] YES → delete() L184-236
  const deleteRow = () => {
    Modal.confirm({
      title: '확인', content: '선택한 정보를 삭제하시겠습니까?', okText: '예', cancelText: '아니오',
      onOk: async () => {
        const checked = gridRef.current?.api.getSelectedRows() ?? [];
        if (checked.length === 0) { message.info('삭제대상을 선택하여 주십시오.'); return; }
        try {
          // 회계마감여부 체크(결제일마다) → ast.Ast07_Settle.delete
          for (const r of checked) await actApi.checkLedgerClose(r.settleDate);
          await astApi.deleteSettles(checked.map(r => r.settleId));
          const gone = new Set(checked.map(r => r.settleId));
          setRows(prev => prev.filter(r => !gone.has(r.settleId)));
          journalRef.current?.clear();  // journal.gridClear()
          // 예금원장정리 호출: 일자가 바뀔 때마다 한 번(updateDepositBook L238-250, 결과는 쓰지 않는다)
          let prev: string | null = null;
          for (const r of checked) {
            if (r.settleDate !== prev) { prev = r.settleDate; void astApi.cleanDepositBook(r.settleDate).catch(() => undefined); }
          }
        } catch (err) {
          message.info(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  const manageable = tr?.settleMngYn ?? false;

  // buildGrid() L105-136
  const columnDefs = [
    gb.date('settleDate', 110, '결제일자'),        // L123
    gb.double('forSettleAmt', 100, '외화결제금액'),  // L124
    gb.double('fxRate', 100, '적용환율'),           // L125
    gb.long('settleAmt', 120, '원화결제금액'),       // L126
    iconCell<AstSettleByTr>('edit', 'modiAction', 50, '변경', openModi),  // L127 actionCell
    gb.text('depositName', 150, '예금계좌'),        // L128
    gb.text('note', 250, '적요'),                   // L129
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: 8, paddingBottom: 8 }}>
        <Button type="register" onClick={insertRow} disabled={!manageable}>등록</Button>
        <Button type="delete" onClick={deleteRow} disabled={!manageable}>삭제</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        {/* [E3] grid.RowClick (L81) → journalRetrieve() */}
        <SingleGrid<AstSettleByTr> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.settleId)}
          sumRow={{ labelField: 'settleDate', label: '계', sum: ['forSettleAmt', 'settleAmt'] }}
          onRowClicked={e => { if (e.data) journalRetrieve(e.data); }} />
      </div>
      <Ast07_Lookup_ForSettle target={target} onDone={() => void onSettleDone()} onClose={() => setTarget(null)} />
    </div>
  );
});
