/**
 * 실수령/지급 History 그리드(외화) (X09) — Ast06_Tab_AccruedForIntrinsic 아래에서 최근 결제내역을 보고 취소한다
 * AS-IS: myApp/client/vi/ast/Ast07_Grid_ForHistory.java (309줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L80-105: 위 툴바 50(라디오 "최근입력순(최대 20건)" · "조회조건 적용" · [새로고침] [취소]) + 그리드(행번호, 체크 다중, 8열) + 아래 페이징 툴바(100건)
 * 국내 판(Ast07_Grid_History, U11)과 달리 국외(abroType "2")만 읽고, 원거래유형 열이 없고 통화·외화 결제금액이 더해졌으며 사업비지출 전용 모드(expenseOnlyYn)가 없다
 * [전표변경] 아이콘 = Act02_Lookup_ModiForJournal(X08) — 그 결제의 분개를 고친다
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
import { Act02_Lookup_ModiForJournal } from '../act/Act02_Lookup_ModiForJournal';

const gb = gbFor<SettleHistory>();
const LIMIT = 100;

interface Props {
  /** new Ast07_Grid_ForHistory(assetType, …) — 1: 고유자산 */
  assetType: string;
  /** 수령/지급 (payName 콤보) — 없으면 "%" (X04) */
  payCode?: string;
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

export const Ast07_Grid_ForHistory: React.FC<Props> = ({ assetType, payCode = '%', trCode, corpId, searchText, nonce, onChanged }) => {
  const gridRef = useRef<AgGridReact<SettleHistory>>(null);
  // setting() L113-126: selectType "1" = 최근입력순, "2" = 조회조건 적용
  const [mode, setMode] = useState<'1' | '2'>('1');
  const [rows, setRows] = useState<SettleHistory[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modiId, setModiId] = useState<number | null>(null);

  const cond = useRef({ payCode, trCode, corpId, searchText, mode });
  cond.current = { payCode, trCode, corpId, searchText, mode };

  // retrieve() L176-220: ast.Ast07_Settle.selectByHistoryPaging(companyId, userId, orgId, assetType, abroType "2", selectType, searchText, payCode "%", trCode, corpId) — 쪽 나누기 100건
  const load = useCallback(async (p: number) => {
    const c = cond.current;
    const selectType = c.mode === '2' ? '2' : '1';
    setLoading(true);
    try {
      const res = await astApi.searchSettleHistories({
        assetType, selectType, payCode: c.payCode, trCode: c.trCode ?? '%', corpId: c.corpId == null ? '%' : String(c.corpId),
        searchText: c.searchText, limit: LIMIT, offset: (p - 1) * LIMIT, abroType: '2',
      });
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [assetType]);

  // [E0] 화면 열림 (생성자 L80-105) → setting(), toolBar.refresh() · 부모가 조회할 때마다 다시 읽는다
  useEffect(() => { void load(1); }, [nonce, mode, load]);

  // [E3] deleteButton[취소].Select (L134) → deleteCheck() L215-227: "n건의 결제내역을 취소하시겠습니까?"(350) → [E4] YES → delete() L229-286
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
    // updateDepositBook() L288-300: 결제일이 바뀔 때마다 예금원장 정리 (결과는 보지 않는다)
    let checkDate: string | null = null;
    for (const r of list) {
      const d = dayjs(r.settleDate).format('YYYY-MM-DD');
      if (d !== checkDate) { checkDate = d; void astApi.cleanDepositBook(d).catch(() => undefined); }
    }
  };

  // buildGrid() L148-174: setChecked(MULTI)
  const columnDefs = useMemo(() => [
    gb.date('settleDate', 100, '일자'),  // L164
    gb.text('trName', 200, '거래유형'),  // L165
    gb.text('corpName', 200, '거래처'),  // L166
    gb.text('note', 400, '종목/거래적요'),  // L167
    gb.textCenter('curCode', 60, '통화'),  // L168
    gb.double('forSettleAmt', 120, '외화 결제금액'),  // L169
    gb.long('settleAmt', 150, '원화 결제금액'),  // L170
    // L150-160 actionCell: Act02_Lookup_ModiForJournal.open(고른 결제의 journalId) — 닫아도 아무것도 하지 않는다
    iconCell<SettleHistory>('edit', 'actionCell', 80, '전표변경', row => { if (row.journalId != null) setModiId(row.journalId); }),  // L171
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Space size={12} wrap>
        <b style={{ fontSize: 13 }}>실수령/지급 History :</b>
        {/* [E1] selectTypeToggleGroup.ValueChange (L116) → retrieve() */}
        <Radio.Group value={mode} onChange={e => setMode(e.target.value)}>
          <Radio value="1">최근입력순(최대 20건)</Radio>
          <Radio value="2">조회조건 적용</Radio>
        </Radio.Group>
        {/* [E2] refreshButton[새로고침].Select (L128) → retrieve() */}
        <Button type="reset" onClick={() => load(1)}>새로고침</Button>
        <Button type="cancel" onClick={deleteCheck}>취소</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<SettleHistory> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.settleId)} loading={loading} />
        </div>
        <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={p => void load(p)} />
      </div>
      <Act02_Lookup_ModiForJournal journalId={modiId} onSaved={() => undefined} onClose={() => setModiId(null)} />
    </div>
  );
};
