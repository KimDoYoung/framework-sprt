/**
 * [1472] 고유자산 > 40. 예금관리 > 예금/예치금 이자수령 (W23) — 같은 클래스가 메뉴 #1205(관리회계 > 11. 특수회계처리)에도 있다(X05)
 * AS-IS: myApp/client/vi/ast/Ast06_Tab_TrDepositInt.java (367줄) + Ast06_Lookup_TrDepositInt.java (421줄) + Ast06_Grid_Journal.java (143줄)
 *   + Ast01_Lookup_CorpAccount·Act80_Lookup_RelateAppr — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L71-88: BorderLayout 위 = 툴바 50(여백 20,20,0,20: 조회기간 · 거래계좌 "전체" · [조회][등록][삭제]) + 가운데 그리드(행번호·체크 다중·12열),
 *   아래 300(여백 0,20,20,20) = Ast06_Grid_Journal
 * 스타일: GG (견본 Est02_Tab_PfResultReport — docs/page-style.md). 툴바는 한 줄이라 SearchBar, 원본 툴바의 [등록][삭제]는 extra
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 읽기 전용 날짜 열 폭 90(UX-08, 원본 100). 초기화(UX-02)는 조건이 2개라 부품이 그리지 않는다
 * 연관문서 아이콘 = Act80_Lookup_RelateAppr(W05 2단계 ⓑ), 분개 그리드의 [변경] = Act02_Lookup_ModiJournal(2단계 ⓐ)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstTrFinance } from '@/types/ast';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Ast01_Lookup_CorpAccount } from './Ast01_Lookup_CorpAccount';
import { Ast06_Lookup_TrDepositInt, AstTrDepositIntTarget } from './Ast06_Lookup_TrDepositInt';
import { Ast06_Grid_Journal, Ast06_Grid_JournalHandle } from './Ast06_Grid_Journal';
import { Act80_Lookup_RelateAppr, ActRelateApprTarget } from '../act/Act80_Lookup_RelateAppr';

const gb = gbFor<AstTrFinance>();
const FORMAT = 'YYYY-MM-DD';
const ALL_LABEL = '전체';
const WINDOW_CLASS = 'Ast06_Tab_TrDepositInt';

export const Ast06_Tab_TrDepositInt: React.FC = () => {
  const gridRef = useRef<AgGridReact<AstTrFinance>>(null);
  const journalRef = useRef<Ast06_Grid_JournalHandle>(null);
  // setting() L90-169: 조회기간 = 이번 달 1일 ~ 말일(start·close), 거래계좌 = 전체
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs().endOf('month'));
  const [corpAccountId, setCorpAccountId] = useState<number | null>(null);
  const [corpAccountName, setCorpAccountName] = useState(ALL_LABEL);
  const [rows, setRows] = useState<AstTrFinance[]>([]);
  const [loading, setLoading] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const [target, setTarget] = useState<AstTrDepositIntTarget | null>(null);
  const [relateTarget, setRelateTarget] = useState<ActRelateApprTarget | null>(null);
  /** 변경 창을 연 행 — 닫을 때 그 행의 분개를 다시 읽는다(callback.execute(trModel)) */
  const editRowId = useRef<number | null>(null);
  const rowsRef = useRef<AstTrFinance[]>([]);
  rowsRef.current = rows;

  // retrieve() L246-279: ast.Ast06_Tr.selectByPayCode(기간·회사·assetType "1"·abroType "1"·payCode "01"·windowClassName·계좌 classTreeId) → 첫 행 선택 → retrievePage()
  // 수령/지급(payCode "01")은 서버가 거래유형으로 가른다 — 이 화면의 거래유형(3212)은 window 표(ast15_tr_code_window)가 정한다
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      const list = await astApi.searchTrFinances({
        startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), accountId: null, classTreeId: corpAccountId,
        searchText: '', windowClassName: WINDOW_CLASS, assetType: '1', abroType: '1',
      });
      setRows(list);
      const first = list[0];
      if (first) {
        setTimeout(() => gridRef.current?.api?.getRowNode(String(first.trId))?.setSelected(true), 0);
        await journalRef.current?.retrieve(first.journalId);  // retrievePage() L281-284
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, closeDate, corpAccountId]);

  // [E0] 화면 열림 (생성자 L71-88) → setting()
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E1] corpAccountName.TriggerClick [result != null] (L107) → Ast01_Lookup_CorpAccount.open(조회 시작일, …): 고른 계좌가 있으면 계좌 이름·ID, 없으면(전체) "전체"·null
  const onCorpResult = (acc: { classTreeId: number; corpAccountName: string | null } | null) => {
    setCorpOpen(false);
    setCorpAccountName(acc ? acc.corpAccountName ?? '' : ALL_LABEL);
    setCorpAccountId(acc ? acc.classTreeId : null);
  };

  // [E3] insertButton[등록].Select (L147) → insertRow() L286-297: Ast06_Lookup_TrDepositInt.openNew()
  const insertRow = () => setTarget({ mode: 'NEW' });

  /** 편집창이 서버에서 다시 읽은 거래를 그리드에 반영한다. 새 거래면 맨 아래에 넣고 그 행만 선택한 뒤 분개를 읽는다(callback.execute(trModel) → gridJournal.retrieve) */
  const onChanged = (tr: AstTrFinance, created: boolean) => {
    setRows(prev => (created ? [...prev, tr] : prev.map(r => (r.trId === tr.trId ? tr : r))));
    if (!created) return;
    setTimeout(() => {
      const api = gridRef.current?.api;
      api?.deselectAll();
      const node = api?.getRowNode(String(tr.trId));
      node?.setSelected(true);
      if (node?.rowIndex != null) api?.ensureIndexVisible(node.rowIndex);
    }, 50);
    void journalRef.current?.retrieve(tr.journalId);
  };

  /** 편집창을 닫는다. 변경(MODI)은 닫을 때 callback.execute(trModel)로 그 행의 분개를 다시 읽는다 */
  const closeEdit = () => {
    const modi = target?.mode === 'MODI';
    setTarget(null);
    if (!modi) return;
    const row = rowsRef.current.find(r => r.trId === editRowId.current);
    if (row) void journalRef.current?.retrieve(row.journalId);
  };

  // 변경 아이콘 actionCell(ImageCell "Edit"): Ast06_Lookup_TrDepositInt.open(고른 행, "MODI", …)
  const openModi = (row: AstTrFinance) => {
    editRowId.current = row.trId;
    setTarget({ mode: 'MODI', tr: row });
  };

  // [E6] actionCell2 (ImageCell "View") callbackOnCreate (L210) → Act80_Lookup_RelateAppr.open(제목, "trId", trId, dcrClassTreeId, callback): 닫으면 그 거래를 다시 읽어 연관문서 건수를 갱신(ast.Ast06_Tr.selectById)
  // 제목 = 일자(yyyy-MM-dd) + " 거래유형" + " 거래처"
  const openRelate = (row: AstTrFinance) => {
    editRowId.current = row.trId;
    setRelateTarget({
      title: `${row.date}${row.trName ? ' ' + row.trName : ''}${row.corpName ? ' ' + row.corpName : ''}`,
      code: 'trId', relateId: row.trId, dcrClassTreeId: row.dcrClassTreeId,
    });
  };
  const closeRelate = async () => {
    const id = editRowId.current;
    if (id == null) return;
    try {
      const fresh = await astApi.getTrFinance(id);
      setRows(prev => prev.map(r => (r.trId === id ? fresh : r)));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E4] deleteButton[삭제].Select (L153) → deleteRow() L299-317: 확인(300) "N건의 거래를 삭제하시겠습니까?" → [E7] YES → delete() L319-362
  const deleteRow = () => {
    const checked = gridRef.current?.api.getSelectedRows() ?? [];
    Modal.confirm({
      title: '확인', content: `${checked.length}건의 거래를 삭제하시겠습니까?`, width: 300, okText: '예', cancelText: '아니오',
      onOk: async () => {
        if (checked.length === 0) { message.warning('삭제대상을 선택하여 주십시오.'); return; }
        try {
          // 회계마감 검사(act.Act04_GenLedger.checkClose)와 삭제(ast.Ast06_Tr.delete)는 서버가 한 트랜잭션으로 한다. 예금원장정리는 이 화면에 없다
          await astApi.deleteTrs(checked.map(r => r.trId));
          const gone = new Set(checked.map(r => r.trId));
          setRows(prev => prev.filter(r => !gone.has(r.trId)));
          journalRef.current?.clear();  // gridJournal.gridClear()
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // buildGrid() L55-75 (analysis grid)
  const columnDefs = useMemo(() => [
    gb.date('date', 90, '일자'),  // L61
    gb.text('classTreeName', 150, '구분'),  // L62 — 원본은 '구분'·'계좌' 두 열이 같은 속성(classTreeName)을 보인다
    { ...gb.text('classTreeName', 200, '계좌'), colId: 'classTreeName2' },  // L63
    gb.long('intAmt', 150, '이자'),  // L64
    gb.long('corpTax', 100, '법인세'),  // L65
    gb.long('localTax', 100, '지방세'),  // L66
    gb.long('amt', 150, '실수령액'),  // L67
    iconCell<AstTrFinance>('edit', 'modiAction', 50, '변경', openModi),  // L68 actionCell
    gb.textCenter('apprCnt', 55, '연관문서'),  // L69
    iconCell<AstTrFinance>('view', 'relateAction', 25, ' ', openRelate),  // L70 actionCell2
    gb.text('note', 300, '적요'),  // L71
    gb.textCenter('personName', 80, '등록자'),  // L72
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel min={120}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* [E2] retrieveButton[조회].Select (L141) → retrieve() */}
              <SearchBar
                onSearch={retrieve}
                loading={loading}
                extra={<>
                  <Button type="register" onClick={insertRow}>등록</Button>
                  <Button type="delete" onClick={deleteRow}>삭제</Button>
                </>}
              >
                <SearchBar.Field label="조회기간">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
                    ~
                    <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
                  </span>
                </SearchBar.Field>
                <SearchBar.Field label="거래계좌">
                  <LookupInput value={corpAccountName} width={250} placeholder={ALL_LABEL} onOpen={() => setCorpOpen(true)} onClear={() => onCorpResult(null)} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                {/* [E5] grid.RowClick (L160) → retrievePage() L281-284: 고른 행의 분개를 다시 읽는다(같은 행을 다시 눌러도) */}
                <MultiGrid<AstTrFinance> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.trId)}
                  onRowClicked={e => { if (e.data) void journalRef.current?.retrieve(e.data.journalId); }} />
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
      <Ast01_Lookup_CorpAccount open={corpOpen} stdDate={startDate} onResult={onCorpResult} onClose={() => setCorpOpen(false)} />
      <Ast06_Lookup_TrDepositInt target={target} onChanged={onChanged} onClose={closeEdit} />
      <Act80_Lookup_RelateAppr target={relateTarget} onClosed={() => void closeRelate()} onClose={() => setRelateTarget(null)} />
    </div>
  );
};
