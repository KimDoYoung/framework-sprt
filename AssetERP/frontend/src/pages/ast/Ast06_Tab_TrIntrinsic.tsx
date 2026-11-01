/**
 * [1091] 관리회계 > 11. 특수회계처리 > 고유자산 거래처리 (X03)
 * AS-IS: myApp/client/vi/ast/Ast06_Tab_TrIntrinsic.java (606줄) + Ast06_Lookup_TrIntrinsic.java (759줄) + Ast07_Grid_Settle.java (252줄) + Ast06_Lookup_TrList.java (209줄)
 *   + Ast06_Lookup_InsertCF.java (150줄) + Ast13_Lookup_BookDepn.java (188줄) + Ast06_Grid_Journal.java (143줄) + Ast05_Lookup_TrCodeWindow.java (195줄)
 *   + Sys15_Lookup_Corp·Ast01_Lookup_Info — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L98-134: BorderLayout 위 = 툴바 88(여백 20,20,0,20: 1줄 조회기간 100 ~ 100 · 거래유형 200 "전체" · 거래처 200 "전체" · 수령/지급 100 · [조회] / 2줄 종목구분 504 "전체" · 검색 385 "거래유형/거래처/종목/비고")
 *   + 가운데 70%(툴바 50: [등록][삭제][C/F가져오기] + 행번호·체크 다중·13열) + 오른쪽 30% = Ast07_Grid_Settle, 아래 300(여백 0,20,20,20) = Ast06_Grid_Journal
 * 스타일: GG (견본 — docs/page-style.md). 툴바가 두 줄이라 SearchPanel(R03), [등록][삭제][C/F가져오기] 줄은 그리드 위에 따로 둔다
 * UX보강(10): 툴바 = SearchPanel(UX-01), 읽기 전용 날짜 열 폭 90(UX-08, 원본 100)
 * 연관문서 아이콘 = Act80_Lookup_RelateAppr(W05 2단계 ⓑ), 분개 그리드의 [변경] = Act02_Lookup_ModiJournal(2단계 ⓐ)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { actApi } from '@/api/act';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstTrCodeByWindow, AstTrCodeTreeNode, AstTrIntrinsic } from '@/types/ast';
import { Corp } from '@/types/sys';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { Button } from '@/components/button';
import { SearchPanel } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Ast01_Lookup_Info } from './Ast01_Lookup_Info';
import { Ast05_Lookup_TrCodeWindow } from './Ast05_Lookup_TrCodeWindow';
import { Ast06_Lookup_TrIntrinsic, AstTrIntrinsicTarget } from './Ast06_Lookup_TrIntrinsic';
import { Ast06_Lookup_InsertCF } from './Ast06_Lookup_InsertCF';
import { Ast06_Grid_Journal, Ast06_Grid_JournalHandle } from './Ast06_Grid_Journal';
import { Ast07_Grid_Settle, Ast07_Grid_SettleHandle } from './Ast07_Grid_Settle';
import { Act80_Lookup_RelateAppr, ActRelateApprTarget } from '../act/Act80_Lookup_RelateAppr';

const gb = gbFor<AstTrIntrinsic>();
const FORMAT = 'YYYY-MM-DD';
const ALL_LABEL = '전체';
const WINDOW_CLASS = 'Ast06_Tab_TrIntrinsic';

export const Ast06_Tab_TrIntrinsic: React.FC = () => {
  const gridRef = useRef<AgGridReact<AstTrIntrinsic>>(null);
  const journalRef = useRef<Ast06_Grid_JournalHandle>(null);
  const settleRef = useRef<Ast07_Grid_SettleHandle>(null);
  // setting() L136-310: 조회기간 = 이번 달 1일 ~ 말일(start·close), 거래유형·거래처·종목 = 전체, 수령/지급 = 전체("%")
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs().endOf('month'));
  const [trCodeId, setTrCodeId] = useState<number | null>(null);
  const [trName, setTrName] = useState(ALL_LABEL);
  const [corpId, setCorpId] = useState<number | null>(null);
  const [corpName, setCorpName] = useState(ALL_LABEL);
  const [payCode, setPayCode] = useState('%');
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [classTreeName, setClassTreeName] = useState(ALL_LABEL);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AstTrIntrinsic[]>([]);
  const [loading, setLoading] = useState(false);
  const [trCodeOpen, setTrCodeOpen] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [cfOpen, setCfOpen] = useState(false);
  const [target, setTarget] = useState<AstTrIntrinsicTarget | null>(null);
  const [relateTarget, setRelateTarget] = useState<ActRelateApprTarget | null>(null);
  /** 변경 창·연관문서 창을 연 행 — 닫을 때 그 행의 결제내역·분개를 다시 읽는다 */
  const editRowId = useRef<number | null>(null);
  const rowsRef = useRef<AstTrIntrinsic[]>([]);
  rowsRef.current = rows;

  // retrievePage() L439-443: 고른 행의 결제내역(gridSettle.retrieve)과 분개(gridJournal.retrieve)를 읽는다
  const retrievePage = (tr: AstTrIntrinsic) => {
    void settleRef.current?.retrieve(tr);
    void journalRef.current?.retrieve(tr.journalId);
  };

  // retrieve() L389-437: gridSettle·gridJournal 비움 → ast.Ast06_Tr.selectByPayCode(기간·검색어·종목·거래유형·거래처·결제구분·assetType "1"·abroType "1"·windowClassName) → 첫 행 선택 → retrievePage()
  const retrieve = useCallback(async () => {
    settleRef.current?.clear();
    journalRef.current?.clear();
    setLoading(true);
    try {
      const list = await astApi.searchTrIntrinsics({
        startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), windowClassName: WINDOW_CLASS,
        payCode, corpId, classTreeId, trCodeId, searchText,
      });
      setRows(list);
      const first = list[0];
      if (first) {
        setTimeout(() => gridRef.current?.api?.getRowNode(String(first.trId))?.setSelected(true), 0);
        retrievePage(first);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, closeDate, payCode, corpId, classTreeId, trCodeId, searchText]);

  // [E0] 화면 열림 (생성자 L98-134) → setting() — 마지막에 retrieve()
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E1] trName.TriggerClick [result != null] (L153) → Ast05_Lookup_TrCodeWindow.open("Ast06_Tab_TrIntrinsic", null, …): 고른 거래유형이 있으면 이름·ID, 없으면(전체) "전체"·null
  const onTrCodeResult = (row: AstTrCodeByWindow | null) => {
    setTrCodeOpen(false);
    setTrName(row ? row.trName ?? '' : ALL_LABEL);
    setTrCodeId(row ? row.trCodeId : null);
  };

  // [E2] corpName.TriggerClick [result != null] (L181) → Sys15_Lookup_Corp.open(false, true, …): 고른 거래처가 있으면 이름·ID, 없으면(전체) "전체"·null
  const onCorpResult = (c: Corp | null) => {
    setCorpOpen(false);
    setCorpName(c ? c.corpName ?? '' : ALL_LABEL);
    setCorpId(c ? c.corpId : null);
  };

  // [E3] classTreeName.TriggerClick [result != null] (L204) → Ast01_Lookup_Info.select("1", …): 고른 종목이 있으면 전체 경로 이름·ID, 없으면(전체) "전체"·null
  const onInfoResult = (node: AstTrCodeTreeNode | null) => {
    setInfoOpen(false);
    setClassTreeName(node ? node.classTreeFullName ?? node.classTreeName : ALL_LABEL);
    setClassTreeId(node ? node.classTreeId : null);
  };

  // [E6] insertButton[등록].Select (L266) → insertRow() L445-457: Ast06_Lookup_TrIntrinsic.openNew()
  const insertRow = () => setTarget({ mode: 'NEW' });

  /** 편집창이 서버에서 다시 읽은 거래를 그리드에 반영한다. 새 거래면 맨 아래에 넣고 그 행만 선택한 뒤 결제내역·분개를 읽는다(callback.execute(trModel) → gridSettle·gridJournal.retrieve) */
  const onChanged = (tr: AstTrIntrinsic, created: boolean) => {
    setRows(prev => (created ? [...prev, tr] : prev.map(r => (r.trId === tr.trId ? tr : r))));
    if (!created) return;
    setTimeout(() => {
      const api = gridRef.current?.api;
      api?.deselectAll();
      const node = api?.getRowNode(String(tr.trId));
      node?.setSelected(true);
      if (node?.rowIndex != null) api?.ensureIndexVisible(node.rowIndex);
    }, 50);
    retrievePage(tr);
  };

  /** 편집창을 닫는다. 변경(MODI)은 닫을 때 callback.execute(trModel)로 그 행의 결제내역·분개를 다시 읽는다 */
  const closeEdit = () => {
    const modi = target?.mode === 'MODI';
    setTarget(null);
    if (!modi) return;
    const row = rowsRef.current.find(r => r.trId === editRowId.current);
    if (row) retrievePage(row);
  };

  // 변경 아이콘 actionCell(ImageCell "Edit") (L314-330): Ast06_Lookup_TrIntrinsic.open(고른 행, "MODI", …)
  const openModi = (row: AstTrIntrinsic) => {
    editRowId.current = row.trId;
    setTarget({ mode: 'MODI', tr: row });
  };

  // [E10] 연관문서 아이콘 actionCell2 (ImageCell "View") callbackOnCreate (L352) → Act80_Lookup_RelateAppr.open(제목, "trId", trId, dcrClassTreeId, callback): 제목 = 일자(yyyy-MM-dd) + " 거래유형" + " 거래처"
  const openRelate = (row: AstTrIntrinsic) => {
    editRowId.current = row.trId;
    setRelateTarget({
      title: `${row.date}${row.trName ? ' ' + row.trName : ''}${row.corpName ? ' ' + row.corpName : ''}`,
      code: 'trId', relateId: row.trId, dcrClassTreeId: row.dcrClassTreeId,
    });
  };
  // 닫으면 그 거래를 다시 읽어 연관문서 건수를 갱신(ast.Ast06_Tr.selectById)
  const closeRelate = async () => {
    const id = editRowId.current;
    if (id == null) return;
    try {
      const fresh = await astApi.getTrIntrinsic(id);
      setRows(prev => prev.map(r => (r.trId === id ? fresh : r)));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E7] deleteButton[삭제].Select (L272) → deleteRow() L459-477: 확인(440) "N건의 항목을 삭제하면 실수령/지급내역이 같이 삭제됩니다. 진행하시겠습니까?" → [E11] YES → delete() L479-540
  const deleteRow = () => {
    const checked = gridRef.current?.api.getSelectedRows() ?? [];
    Modal.confirm({
      title: '확인', content: `${checked.length}건의 항목을 삭제하면 실수령/지급내역이 같이 삭제됩니다. 진행하시겠습니까?`, width: 440, okText: '예', cancelText: '아니오',
      onOk: async () => {
        if (checked.length === 0) { message.warning('삭제대상을 선택하여 주십시오.'); return; }
        try {
          // 행마다 감가상각 검사(상각 대상 50·55, checkDepn L556-579) → 회계마감 검사(act.Act04_GenLedger.checkClose)를 모두 통과해야 삭제(ast.Ast06_Tr.delete)
          for (const r of checked) {
            await astApi.checkTrIntrinsicDepn({ date: r.date, purTrId: r.purTrId, itemLClassCode: r.itemLClassCode });
            await actApi.checkLedgerClose(r.date);
          }
          await astApi.deleteTrs(checked.map(r => r.trId));
          const gone = new Set(checked.map(r => r.trId));
          setRows(prev => prev.filter(r => !gone.has(r.trId)));
          settleRef.current?.clear();   // gridSettle.gridClear()
          journalRef.current?.clear();  // gridJournal.gridClear()
          // 예금원장정리 호출: 일자가 바뀔 때마다 한 번(updateDepositBook L542-554, 결과는 쓰지 않는다)
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

  // [E8] importButton[C/F가져오기].Select (L278) → importInfoToday() L581-589: Ast06_Lookup_InsertCF.open("Ast06_Tab_TrIntrinsic", 닫히면 retrieve())
  const importInfoToday = () => setCfOpen(true);

  // buildGrid() L312-387
  const columnDefs = useMemo(() => [
    gb.date('date', 90, '일자'),  // L372
    gb.text('trName', 180, '거래유형'),  // L373
    gb.text('corpName', 150, '거래처'),  // L374
    gb.text('classTreeName', 200, '종목'),  // L375
    gb.long('amt', 120, '금액'),  // L376
    gb.long('tax', 80, '세금'),  // L377
    iconCell<AstTrIntrinsic>('edit', 'modiAction', 50, '변경', openModi),  // L378 actionCell
    gb.textCenter('apprCnt', 55, '연관문서'),  // L379
    iconCell<AstTrIntrinsic>('view', 'relateAction', 25, ' ', openRelate),  // L380 actionCell2
    gb.boolean('settleMngYn', 80, '미수/미지급'),  // L381
    gb.text('depositName', 150, '예금계좌'),  // L382
    gb.textArea('note', 250, '적요'),  // L383
    gb.textCenter('personName', 80, '등록자'),  // L384
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel min={120}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* [E5] retrieveButton[조회].Select (L260) → retrieve(), [E4] searchText.KeyPress [Enter] (L226) → retrieve() */}
              <SearchPanel onSearch={retrieve} loading={loading} fieldsWidth={1100}>
                <SearchPanel.Row>
                  <SearchPanel.Field label="조회기간">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
                      ~
                      <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
                    </span>
                  </SearchPanel.Field>
                  <SearchPanel.Field label="거래유형">
                    <LookupInput value={trName} width={200} placeholder={ALL_LABEL} onOpen={() => setTrCodeOpen(true)} onClear={() => onTrCodeResult(null)} />
                  </SearchPanel.Field>
                  <SearchPanel.Field label="거래처">
                    <LookupInput value={corpName} width={200} placeholder={ALL_LABEL} onOpen={() => setCorpOpen(true)} onClear={() => onCorpResult(null)} />
                  </SearchPanel.Field>
                  <SearchPanel.Field label="수령/지급">
                    <SystemCodeComboBox kindCd="RcvPayCode" altCode={['%', ALL_LABEL]} style={{ width: 100 }} value={payCode} onChange={code => setPayCode(code ?? '%')} />
                  </SearchPanel.Field>
                </SearchPanel.Row>
                <SearchPanel.Row>
                  <SearchPanel.Field label="종목구분">
                    <LookupInput value={classTreeName} width={504} placeholder={ALL_LABEL} onOpen={() => setInfoOpen(true)} onClear={() => onInfoResult(null)} />
                  </SearchPanel.Field>
                  <SearchPanel.Field label="검색">
                    <SearchPanel.Input style={{ width: 385 }} placeholder="거래유형/거래처/종목/비고" value={searchText} onChange={e => setSearchText(e.target.value)} />
                  </SearchPanel.Field>
                </SearchPanel.Row>
                <SearchPanel.Actions>{null}</SearchPanel.Actions>
                <SearchPanel.Actions>{null}</SearchPanel.Actions>
              </SearchPanel>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                <Splitter style={{ height: '100%' }}>
                  <Splitter.Panel defaultSize="70%" min={300}>
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingRight: 8, boxSizing: 'border-box' }}>
                      <div style={{ display: 'flex', gap: 8, paddingBottom: 8 }}>
                        <Button type="register" onClick={insertRow}>등록</Button>
                        <Button type="delete" onClick={deleteRow}>삭제</Button>
                        <Button type="addRow" onClick={importInfoToday}>C/F가져오기</Button>
                      </div>
                      <div style={{ flex: 1, minHeight: 0 }}>
                        {/* [E9] grid.RowClick (L302) → retrievePage() L439-443: 고른 행의 결제내역·분개를 다시 읽는다(같은 행을 다시 눌러도) */}
                        <MultiGrid<AstTrIntrinsic> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.trId)}
                          onRowClicked={e => { if (e.data) retrievePage(e.data); }} />
                      </div>
                    </div>
                  </Splitter.Panel>
                  <Splitter.Panel min={200}>
                    <div style={{ height: '100%', paddingLeft: 8, boxSizing: 'border-box' }}>
                      <Ast07_Grid_Settle ref={settleRef} journalRef={journalRef} />
                    </div>
                  </Splitter.Panel>
                </Splitter>
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
      <Ast05_Lookup_TrCodeWindow open={trCodeOpen} windowClassName={WINDOW_CLASS} onResult={onTrCodeResult} onClose={() => setTrCodeOpen(false)} />
      <Sys15_Lookup_Corp open={corpOpen} empYn onResult={onCorpResult} onClose={() => setCorpOpen(false)} />
      <Ast01_Lookup_Info open={infoOpen} assetType="1" withAll onResult={onInfoResult} onClose={() => setInfoOpen(false)} />
      <Ast06_Lookup_TrIntrinsic target={target} onChanged={onChanged} onClose={closeEdit} />
      <Ast06_Lookup_InsertCF open={cfOpen} windowClassName={WINDOW_CLASS} onDone={() => void retrieve()} onClose={() => setCfOpen(false)} />
      <Act80_Lookup_RelateAppr target={relateTarget} onClosed={() => void closeRelate()} onClose={() => setRelateTarget(null)} />
    </div>
  );
};
