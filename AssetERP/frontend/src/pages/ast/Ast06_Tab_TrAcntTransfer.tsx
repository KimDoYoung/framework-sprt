/**
 * [1208] 고유자산 > 20. 고유자산 거래처리 > 금융상품 계좌대체 (W08)
 * AS-IS: myApp/client/vi/ast/Ast06_Tab_TrAcntTransfer.java (463줄) + Ast06_Lookup_TrAcntTransfer.java (623줄) + Ast09_Lookup_Book.java (181줄)
 *   + Ast06_Grid_Journal.java (143줄) + Ast01_Lookup_CorpAccount·Ast01_Lookup_Info — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L84-111: BorderLayout 위 = 툴바 88(여백 20,20,0,20: 1줄 조회기간 100 ~ 100 · 거래계좌 250 "전체" · 검색 250 "거래유형/거래처/종목유형/종목/적요" · [조회] / 2줄 종목 504 "전체")
 *   + 가운데 그리드(툴바 50: [등록][삭제] + 행번호·체크 다중·12열), 아래 300(여백 0,20,20,20) = Ast06_Grid_Journal
 * 스타일: GG (견본 — docs/page-style.md). 툴바가 두 줄이라 SearchPanel(R03), [등록][삭제] 줄은 그리드 위에 따로 둔다. W06 Ast06_Tab_TrFinance와 같은 골격이다
 * UX보강(10): 툴바 = SearchPanel(UX-01), 읽기 전용 날짜 열 폭 90(UX-08, 원본 100)
 * 연관문서 아이콘 = Act80_Lookup_RelateAppr(W05 2단계 ⓑ), 분개 그리드의 [변경] = Act02_Lookup_ModiJournal(2단계 ⓐ)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstTrCodeTreeNode, AstTrFinance } from '@/types/ast';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { Button } from '@/components/button';
import { SearchPanel } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Ast01_Lookup_CorpAccount } from './Ast01_Lookup_CorpAccount';
import { Ast01_Lookup_Info } from './Ast01_Lookup_Info';
import { Ast06_Lookup_TrAcntTransfer, AstTrAcntTransferTarget } from './Ast06_Lookup_TrAcntTransfer';
import { Ast06_Grid_Journal, Ast06_Grid_JournalHandle } from './Ast06_Grid_Journal';
import { Act80_Lookup_RelateAppr, ActRelateApprTarget } from '../act/Act80_Lookup_RelateAppr';

const gb = gbFor<AstTrFinance>();
const FORMAT = 'YYYY-MM-DD';
const ALL_LABEL = '전체';
const WINDOW_CLASS = 'Ast06_Tab_TrAcntTransfer';

export const Ast06_Tab_TrAcntTransfer: React.FC = () => {
  const gridRef = useRef<AgGridReact<AstTrFinance>>(null);
  const journalRef = useRef<Ast06_Grid_JournalHandle>(null);
  // setting() L124-313: 조회기간 = 이번 달 1일 ~ 말일(start·close), 거래유형·거래계좌·종목 = 전체
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs().endOf('month'));
  const [corpAccountId, setCorpAccountId] = useState<number | null>(null);
  const [corpAccountName, setCorpAccountName] = useState(ALL_LABEL);
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [classTreeName, setClassTreeName] = useState(ALL_LABEL);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AstTrFinance[]>([]);
  const [loading, setLoading] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [target, setTarget] = useState<AstTrAcntTransferTarget | null>(null);
  const [relateTarget, setRelateTarget] = useState<ActRelateApprTarget | null>(null);
  /** 변경 창을 연 행 — 닫을 때 그 행의 분개를 다시 읽는다(callback.execute(trModel)) */
  const editRowId = useRef<number | null>(null);
  const rowsRef = useRef<AstTrFinance[]>([]);
  rowsRef.current = rows;

  const params = () => ({
    startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT),
    accountId: corpAccountId, classTreeId, searchText,
  });

  // retrieve() L311-345: ast.Ast06_Tr.selectByPayCode(기간·회사·assetType "1"·abroType "1"·계좌·windowClassName·검색어·종목) → 첫 행 선택 → retrievePage()
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      const list = await astApi.searchTrFinances({ ...params(), windowClassName: WINDOW_CLASS, assetType: '1', abroType: '1' });
      setRows(list);
      const first = list[0];
      if (first) {
        setTimeout(() => gridRef.current?.api?.getRowNode(String(first.trId))?.setSelected(true), 0);
        await journalRef.current?.retrieve(first.journalId);  // retrievePage() L347-350
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, closeDate, corpAccountId, classTreeId, searchText]);

  // [E0] 화면 열림 (생성자 L84-111) → setting() — 마지막에 retrieve() L311-345
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E1] corpAccountName.TriggerClick [result != null] (L130) → Ast01_Lookup_CorpAccount.open(조회 시작일, …): 고른 계좌가 있으면 거래처(계좌) 이름·ID, 없으면(전체) "전체"·null
  const onCorpResult = (acc: { classTreeId: number; corpAccountName: string | null } | null) => {
    setCorpOpen(false);
    setCorpAccountName(acc ? acc.corpAccountName ?? '' : ALL_LABEL);
    setCorpAccountId(acc ? acc.classTreeId : null);
  };

  // [E2] classTreeName.TriggerClick [result != null] (L153) → Ast01_Lookup_Info.select("1", "20", "1", …): 고른 종목이 있으면 전체 경로 이름·ID, 없으면(전체) "전체"·null
  const onInfoResult = (node: AstTrCodeTreeNode | null) => {
    setInfoOpen(false);
    setClassTreeName(node ? node.classTreeFullName ?? node.classTreeName : ALL_LABEL);
    setClassTreeId(node ? node.classTreeId : null);
  };

  // [E5] insertButton[등록].Select (L208) → insertRow() L352-363: Ast06_Lookup_TrAcntTransfer.openNew()
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

  // 변경 아이콘 actionCell(ImageCell "Edit") (L316-330): Ast06_Lookup_TrAcntTransfer.open(고른 행, "MODI", …)
  const openModi = (row: AstTrFinance) => {
    editRowId.current = row.trId;
    setTarget({ mode: 'MODI', tr: row });
  };

  // 연관문서 아이콘: 제목 = 일자(yyyy-MM-dd) + " 거래유형" + " 거래처"
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

  // [E6] deleteButton[삭제].Select (L214) → deleteRow() L365-383: 확인(440) "N건의 항목을 삭제하면 실수령/지급내역이 같이 삭제됩니다. 진행하시겠습니까?" → [E9] YES → delete() L385-441
  const deleteRow = () => {
    const checked = gridRef.current?.api.getSelectedRows() ?? [];
    Modal.confirm({
      title: '확인', content: `${checked.length}건의 항목을 삭제하면 실수령/지급내역이 같이 삭제됩니다. 진행하시겠습니까?`, width: 440, okText: '예', cancelText: '아니오',
      onOk: async () => {
        if (checked.length === 0) { message.warning('삭제대상을 선택하여 주십시오.'); return; }
        try {
          // 회계마감 검사(act.Act04_GenLedger.checkClose)와 삭제(ast.Ast06_Tr.delete)는 서버가 한 트랜잭션으로 한다
          await astApi.deleteTrs(checked.map(r => r.trId));
          const gone = new Set(checked.map(r => r.trId));
          setRows(prev => prev.filter(r => !gone.has(r.trId)));
          journalRef.current?.clear();  // gridJournal.gridClear()
          // 예금원장정리 호출: 일자가 바뀔 때마다 한 번(updateDepositBook L443-455, 결과는 쓰지 않는다)
          let prev: string | null = null;
          for (const r of checked) {
            if (r.date !== prev) { prev = r.date; void astApi.cleanDepositBook(r.date).catch(() => undefined); }
          }
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // buildGrid() L234-309
  const columnDefs = useMemo(() => [
    gb.date('date', 90, '일자'),  // L293
    gb.text('accountName', 200, '출고계좌'),  // L294
    gb.text('inAccountName', 200, '입고계좌'),  // L295
    gb.textCenter('astClassName', 100, '종목유형'),  // L296
    gb.text('classTreeName', 200, '종목'),  // L297
    gb.double('qty', 100, '수량'),  // L298
    gb.long('trAmt', 120, '취득금액'),  // L299
    gb.long('bookAmt', 120, '장부금액'),  // L300
    gb.long('fee', 70, '수수료'),  // L301
    iconCell<AstTrFinance>('edit', 'modiAction', 50, '변경', openModi),  // L302 actionCell
    gb.textCenter('apprCnt', 55, '연관문서'),  // L303
    // [E8] actionCell2 (ImageCell "View") callbackOnCreate (L273) → Act80_Lookup_RelateAppr.open(제목, "trId", trId, dcrClassTreeId, callback): 닫으면 그 거래를 다시 읽어 연관문서 건수를 갱신(ast.Ast06_Tr.selectById)
    iconCell<AstTrFinance>('view', 'relateAction', 25, ' ', openRelate),  // L304 actionCell2
    gb.text('note', 250, '적요'),  // L305
    gb.textCenter('personName', 80, '등록자'),  // L306
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel min={120}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* [E4] retrieveButton[조회].Select (L202) → retrieve(), [E3] searchText.KeyPress [Enter] (L175) → retrieve() */}
              <SearchPanel onSearch={retrieve} loading={loading} fieldsWidth={960}>
                <SearchPanel.Row>
                  <SearchPanel.Field label="조회기간">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
                      ~
                      <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
                    </span>
                  </SearchPanel.Field>
                  <SearchPanel.Field label="거래계좌">
                    <LookupInput value={corpAccountName} width={250} placeholder={ALL_LABEL} onOpen={() => setCorpOpen(true)} onClear={() => onCorpResult(null)} />
                  </SearchPanel.Field>
                  <SearchPanel.Field label="검색">
                    <SearchPanel.Input style={{ width: 250 }} placeholder="거래유형/거래처/종목유형/종목/적요" value={searchText} onChange={e => setSearchText(e.target.value)} />
                  </SearchPanel.Field>
                </SearchPanel.Row>
                <SearchPanel.Row>
                  <SearchPanel.Field label="종목">
                    <LookupInput value={classTreeName} width={504} placeholder={ALL_LABEL} onOpen={() => setInfoOpen(true)} onClear={() => onInfoResult(null)} />
                  </SearchPanel.Field>
                </SearchPanel.Row>
                <SearchPanel.Actions>{null}</SearchPanel.Actions>
                <SearchPanel.Actions>{null}</SearchPanel.Actions>
              </SearchPanel>
              <div style={{ display: 'flex', gap: 8, padding: '8px 0 0 0' }}>
                <Button type="register" onClick={insertRow}>등록</Button>
                <Button type="delete" onClick={deleteRow}>삭제</Button>
              </div>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                {/* [E7] grid.RowClick (L224) → retrievePage() L347-350: 고른 행의 분개를 다시 읽는다(같은 행을 다시 눌러도) */}
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
      <Ast01_Lookup_Info open={infoOpen} assetType="1" itemLClass="20" abroType="1" withAll onResult={onInfoResult} onClose={() => setInfoOpen(false)} />
      <Ast06_Lookup_TrAcntTransfer target={target} onChanged={onChanged} onClose={closeEdit} />
      <Act80_Lookup_RelateAppr target={relateTarget} onClosed={() => void closeRelate()} onClose={() => setRelateTarget(null)} />
    </div>
  );
};
