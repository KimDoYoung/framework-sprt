/**
 * 실수령/지급 History 그리드 (U11) — Pay50_Tab_ExpenseSettle 아래에서 최근 결제내역을 보고 취소한다
 * AS-IS: myApp/client/vi/ast/Ast07_Grid_History.java (321줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L82-109: 위 툴바 50(라디오 "최근입력순(최대 20건)" · "조회조건 적용" · [새로고침] [취소]) + 그리드(행번호, 체크 다중, 7열) + 아래 페이징 툴바(100건)
 * setting() L111-155: expenseOnlyYn이면 거래유형 열(index 3)을 숨기고, 최근입력순(1)은 사업비지출(9100) 거래만(3)으로 바꿔 조회한다
 * [다음 단계] [전표변경] 아이콘이 여는 Act02_Lookup_ModiJournal(L159-169)은 분개 수정 창이라 지금은 안내만 한다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Radio, Space, message } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { actApi } from '@/api/act';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { SettleHistory } from '@/types/ast';
import { Button } from '@/components/button';
import { MultiGrid, PagingToolBar, gbFor, iconCell } from '@/components/grid';

const gb = gbFor<SettleHistory>();
const LIMIT = 100;

interface Props {
  /** new Ast07_Grid_History(assetType, …) — 1: 고유자산 */
  assetType: string;
  /** 사업비지출(9100) 거래만 보는 화면이면 true (expenseOnlyYn) */
  expenseOnly: boolean;
  /** 거래 구분 (trCode TextField) — 없으면 "%" */
  trCode: string | null;
  /** 거래처 (corpId LongField) — 없으면 "%" */
  corpId: number | null;
  /** 검색어 (searchText TextField) */
  searchText: string;
  /** 부모가 retrieve() 뒤에 값을 바꿔 다시 읽게 한다 (AS-IS gridSettle.retrieve()) */
  nonce: number;
  /** 취소 뒤 부모의 retrieve() (callback.execute()) */
  onChanged: () => void;
}

export const Ast07_Grid_History: React.FC<Props> = ({ assetType, expenseOnly, trCode, corpId, searchText, nonce, onChanged }) => {
  const gridRef = useRef<AgGridReact<SettleHistory>>(null);
  // setting() L113-126: selectType "1" = 최근입력순, "2" = 조회조건 적용
  const [mode, setMode] = useState<'1' | '2'>('1');
  const [rows, setRows] = useState<SettleHistory[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const cond = useRef({ trCode, corpId, searchText, mode });
  cond.current = { trCode, corpId, searchText, mode };

  // retrieve() L184-229: ast.Ast07_Settle.selectByHistoryPaging(companyId, userId, orgId, assetType, abroType "1", selectType, searchText, payCode "%", trCode, corpId) — 쪽 나누기 100건
  const load = useCallback(async (p: number) => {
    const c = cond.current;
    const selectType = c.mode === '2' ? '2' : (expenseOnly ? '3' : '1');
    setLoading(true);
    try {
      const res = await astApi.searchSettleHistories({
        assetType, selectType, payCode: '%', trCode: c.trCode ?? '%', corpId: c.corpId == null ? '%' : String(c.corpId),
        searchText: c.searchText, limit: LIMIT, offset: (p - 1) * LIMIT,
      });
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [assetType, expenseOnly]);

  // [E0] 화면 열림 (생성자 L82-109) → setting(), toolBar.refresh() · 부모가 조회할 때마다 다시 읽는다
  useEffect(() => { void load(1); }, [nonce, mode, load]);

  // [E3] deleteButton[취소].Select (L138) → deleteCheck() L231-243: "n건의 결제내역을 취소하시겠습니까?"(350) → [E4] YES → delete() L245-302
  const deleteCheck = () => {
    const n = gridRef.current?.api.getSelectedRows().length ?? 0;
    Modal.confirm({ title: '확인', content: `${n}건의 결제내역을 취소하시겠습니까?`, width: 350, okText: '예', cancelText: '아니오', onOk: remove });
  };

  const remove = async () => {
    const list = gridRef.current?.api.getSelectedRows() ?? [];
    if (list.length === 0) { message.info('취소대상을 선택하여 주십시오.'); return; }
    try {
      // 회계마감여부 체크: 결제일마다 act.Act04_GenLedger.checkClose — 하나라도 마감이면 그 메시지로 멈춘다
      for (const r of list) await actApi.checkLedgerClose(dayjs(r.settleDate).format('YYYY-MM-DD'));
      await astApi.deleteSettles(list.map(r => r.settleId));
    } catch (err) {
      message.info(errorMessage(err, '취소 실패'));
      return;
    }
    onChanged();
    // updateDepositBook() L304-316: 결제일이 바뀔 때마다 예금원장 정리 (결과는 보지 않는다)
    let checkDate: string | null = null;
    for (const r of list) {
      const d = dayjs(r.settleDate).format('YYYY-MM-DD');
      if (d !== checkDate) { checkDate = d; void astApi.cleanDepositBook(d).catch(() => undefined); }
    }
  };

  // buildGrid() L157-182: setChecked(MULTI)
  const columnDefs = useMemo(() => [
    gb.date('settleDate', 100, '일자'),  // L173
    gb.text('trName', 150, '거래유형', expenseOnly ? { hide: true } : undefined),  // L174 · setting() L145 expenseOnlyYn → 숨김
    gb.text('orgTrName', 200, '원거래유형'),  // L175
    gb.text('corpName', 200, '거래처'),  // L176
    gb.text('note', 500, '종목/거래적요'),  // L177
    gb.long('settleAmt', 150, '결제금액'),  // L178
    // L159-169 actionCell: Act02_Lookup_ModiJournal.open(journalId) — 다음 단계
    iconCell<SettleHistory>('edit', 'actionCell', 80, '전표변경', () => message.info('분개 수정 창(Act02_Lookup_ModiJournal)은 다음 단계에서 연결합니다.')),  // L179
  ], [expenseOnly]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Space size={12} wrap>
        <b style={{ fontSize: 13 }}>실수령/지급 History :</b>
        {/* [E1] selectTypeToggleGroup.ValueChange (L120) → retrieve() */}
        <Radio.Group value={mode} onChange={e => setMode(e.target.value)}>
          <Radio value="1">최근입력순(최대 20건)</Radio>
          <Radio value="2">조회조건 적용</Radio>
        </Radio.Group>
        {/* [E2] refreshButton[새로고침].Select (L132) → retrieve() */}
        <Button type="reset" onClick={() => load(1)}>새로고침</Button>
        <Button type="cancel" onClick={deleteCheck}>취소</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<SettleHistory> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.settleId)} loading={loading} />
        </div>
        <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={p => void load(p)} />
      </div>
    </div>
  );
};
