/**
 * [1171] 관리회계 > 12. 특수회계처리(외화) > 고유자산 거래처리(외화) (X08)
 * AS-IS: myApp/client/vi/ast/Ast06_Tab_TrForIntrinsic.java (509줄) + Ast06_Lookup_TrForIntrinsic.java (576줄) + Ast07_Grid_ForSettle.java (354줄) + Ast07_Lookup_ForSettle.java (356줄)
 *   + Ast06_Grid_ForJournal.java (145줄) + Act02_Lookup_ModiForJournal.java (666줄) + Ast05_Lookup_TrCodeWindow.java (195줄)
 *   + Sys15_Lookup_Corp·Ast01_Lookup_Info — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L89-121: BorderLayout 위 = 툴바 88(여백 20,20,0,20: 1줄 조회기간 100 ~ 100 · 거래유형 200 "전체" · 거래처 200 "전체" · [조회] / 2줄 종목구분 504 "전체" · 수령/지급 100)
 *   + 가운데 70%(툴바 50: [등록][삭제] + 행번호·체크 다중·16열) + 오른쪽 30% = Ast07_Grid_ForSettle, 아래 300(여백 0,20,20,20) = Ast06_Grid_ForJournal
 * 고유자산 거래처리(Ast06_Tab_TrForIntrinsic, X03)의 외화 판 — 국외(abroType "2") 거래만 읽고, 검색어·[C/F가져오기]·삭제 전 감가상각 검사가 없으며 통화·적용환율·외화금액·원화금액 열을 쓴다
 * 스타일: GG (견본 — docs/page-style.md). 툴바가 두 줄이라 SearchPanel(R03), [등록][삭제] 줄은 그리드 위에 따로 둔다
 * UX보강(10): 툴바 = SearchPanel(UX-01), 읽기 전용 날짜 열 폭 90(UX-08, 원본 100)
 * 연관문서 아이콘 = Act80_Lookup_RelateAppr(W05 2단계 ⓑ), 분개 그리드의 [변경] = Act02_Lookup_ModiForJournal(X08)
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
import type { AstTrIntrinsicTarget } from './Ast06_Lookup_TrIntrinsic';
import { Ast06_Lookup_TrForIntrinsic } from './Ast06_Lookup_TrForIntrinsic';
import { Ast06_Grid_ForJournal, Ast06_Grid_ForJournalHandle } from './Ast06_Grid_ForJournal';
import { Ast07_Grid_ForSettle, Ast07_Grid_ForSettleHandle } from './Ast07_Grid_ForSettle';
import { Act80_Lookup_RelateAppr, ActRelateApprTarget } from '../act/Act80_Lookup_RelateAppr';

const gb = gbFor<AstTrIntrinsic>();
const FORMAT = 'YYYY-MM-DD';
const ALL_LABEL = '전체';
const WINDOW_CLASS = 'Ast06_Tab_TrForIntrinsic';

export const Ast06_Tab_TrForIntrinsic: React.FC = () => {
  const gridRef = useRef<AgGridReact<AstTrIntrinsic>>(null);
  const journalRef = useRef<Ast06_Grid_ForJournalHandle>(null);
  const settleRef = useRef<Ast07_Grid_ForSettleHandle>(null);
  // setting() L123-209: 조회기간 = 이번 달 1일 ~ 말일(start·close), 거래유형·거래처·종목 = 전체, 수령/지급 = 전체("%")
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs().endOf('month'));
  const [trCodeId, setTrCodeId] = useState<number | null>(null);
  const [trName, setTrName] = useState(ALL_LABEL);
  const [corpId, setCorpId] = useState<number | null>(null);
  const [corpName, setCorpName] = useState(ALL_LABEL);
  const [payCode, setPayCode] = useState('%');
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [classTreeName, setClassTreeName] = useState(ALL_LABEL);
  const [rows, setRows] = useState<AstTrIntrinsic[]>([]);
  const [loading, setLoading] = useState(false);
  const [trCodeOpen, setTrCodeOpen] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [target, setTarget] = useState<AstTrIntrinsicTarget | null>(null);
  const [relateTarget, setRelateTarget] = useState<ActRelateApprTarget | null>(null);
  /** 변경 창·연관문서 창을 연 행 — 닫을 때 그 행의 결제내역·분개를 다시 읽는다 */
  const editRowId = useRef<number | null>(null);
  const rowsRef = useRef<AstTrIntrinsic[]>([]);
  rowsRef.current = rows;

  // retrievePage() L284-288: 고른 행의 결제내역(gridSettle.retrieve)과 분개(gridJournal.retrieve)를 읽는다
  const retrievePage = (tr: AstTrIntrinsic) => {
    void settleRef.current?.retrieve(tr);
    void journalRef.current?.retrieve(tr.journalId);
  };

  // retrieve() L389-437: gridSettle·gridJournal 비움 → ast.Ast06_Tr.selectByPayCode(기간·종목·거래유형·거래처·결제구분·assetType "1"·abroType "2"·windowClassName) → 첫 행 선택 → retrievePage()
  const retrieve = useCallback(async () => {
    settleRef.current?.clear();
    journalRef.current?.clear();
    setLoading(true);
    try {
      const list = await astApi.searchTrIntrinsics({
        startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), windowClassName: WINDOW_CLASS,
        payCode, corpId, classTreeId, trCodeId, searchText: '', abroType: '2',
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
  }, [startDate, closeDate, payCode, corpId, classTreeId, trCodeId]);

  // [E0] 화면 열림 (생성자 L89-121) → setting() — 마지막에 retrieve()
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E1] trName.TriggerClick [result != null] (L140) → Ast05_Lookup_TrCodeWindow.open("Ast06_Tab_TrForIntrinsic", null, …): 고른 거래유형이 있으면 이름·ID, 없으면(전체) "전체"·null
  const onTrCodeResult = (row: AstTrCodeByWindow | null) => {
    setTrCodeOpen(false);
    setTrName(row ? row.trName ?? '' : ALL_LABEL);
    setTrCodeId(row ? row.trCodeId : null);
  };

  // [E2] corpName.TriggerClick [result != null] (L168) → Sys15_Lookup_Corp.open(…): 고른 거래처가 있으면 이름·ID, 없으면(전체) "전체"·null
  const onCorpResult = (c: Corp | null) => {
    setCorpOpen(false);
    setCorpName(c ? c.corpName ?? '' : ALL_LABEL);
    setCorpId(c ? c.corpId : null);
  };

  // [E3] classTreeName.TriggerClick [result != null] (L191) → Ast01_Lookup_Info.select("1", …): 고른 종목이 있으면 전체 경로 이름·ID, 없으면(전체) "전체"·null
  const onInfoResult = (node: AstTrCodeTreeNode | null) => {
    setInfoOpen(false);
    setClassTreeName(node ? node.classTreeFullName ?? node.classTreeName : ALL_LABEL);
    setClassTreeId(node ? node.classTreeId : null);
  };

  // [E5] insertButton[등록].Select (L240) → insertRow() L395-407: Ast06_Lookup_TrForIntrinsic.openNew()
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

  // [E8] 연관문서 아이콘 actionCell2 (ImageCell "View") callbackOnCreate (L309) → Act80_Lookup_RelateAppr.open(제목, "trId", trId, dcrClassTreeId, callback): 제목 = 일자(yyyy-MM-dd) + " 거래유형" + " 거래처"
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

  // [E6] deleteButton[삭제].Select (L246) → deleteRow() L420-440: 확인(440) "N건의 항목을 삭제시 실수령/지급내역이 같이 삭제됩니다. 진행하시겠습니까?" → [E9] YES → delete() L442-488
  const deleteRow = () => {
    const checked = gridRef.current?.api.getSelectedRows() ?? [];
    Modal.confirm({
      title: '확인', content: `${checked.length}건의 항목을 삭제시 실수령/지급내역이 같이 삭제됩니다. 진행하시겠습니까?`, width: 440, okText: '예', cancelText: '아니오',
      onOk: async () => {
        if (checked.length === 0) { message.warning('삭제대상을 선택하여 주십시오.'); return; }
        try {
          // 행마다 회계마감 검사(act.Act04_GenLedger.checkClose)를 모두 통과해야 삭제(ast.Ast06_Tr.delete) — 국내 판과 달리 감가상각 검사는 없다
          for (const r of checked) await actApi.checkLedgerClose(r.date);
          await astApi.deleteTrs(checked.map(r => r.trId));
          const gone = new Set(checked.map(r => r.trId));
          setRows(prev => prev.filter(r => !gone.has(r.trId)));
          settleRef.current?.clear();   // gridSettle.gridClear()
          journalRef.current?.clear();  // gridJournal.gridClear()
          // 예금원장정리 호출: 일자가 바뀔 때마다 한 번(updateDepositBook L491-503, 결과는 쓰지 않는다)
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

  // buildGrid() L291-387
  const columnDefs = useMemo(() => [
    gb.date('date', 90, '일자'),  // L369
    gb.text('trName', 180, '거래유형'),  // L370
    gb.text('corpName', 150, '거래처'),  // L371
    gb.text('classTreeName', 200, '종목'),  // L372
    gb.textCenter('curCode', 60, '통화'),  // L373
    gb.double('fxRate', 100, '적용환율'),  // L374
    gb.double('forAmt', 100, '외화금액'),  // L375
    gb.long('amt', 120, '원화금액'),  // L376
    iconCell<AstTrIntrinsic>('edit', 'modiAction', 50, '변경', openModi),  // L377 actionCell
    gb.textCenter('apprCnt', 55, '연관문서'),  // L378
    iconCell<AstTrIntrinsic>('view', 'relateAction', 25, ' ', openRelate),  // L379 actionCell2
    gb.boolean('settleMngYn', 80, '미수/미지급'),  // L380
    gb.text('depositName', 150, '예금계좌'),  // L381
    gb.text('note', 250, '적요'),  // L382
    gb.textCenter('personName', 80, '등록자'),  // L383
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel min={120}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* [E4] retrieveButton[조회].Select (L234) → retrieve() */}
              <SearchPanel onSearch={retrieve} loading={loading} fieldsWidth={1000}>
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
                </SearchPanel.Row>
                <SearchPanel.Row>
                  <SearchPanel.Field label="종목구분">
                    <LookupInput value={classTreeName} width={504} placeholder={ALL_LABEL} onOpen={() => setInfoOpen(true)} onClear={() => onInfoResult(null)} />
                  </SearchPanel.Field>
                  <SearchPanel.Field label="수령/지급">
                    <SystemCodeComboBox kindCd="RcvPayCode" altCode={['%', ALL_LABEL]} style={{ width: 100 }} value={payCode} onChange={code => setPayCode(code ?? '%')} />
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
                      </div>
                      <div style={{ flex: 1, minHeight: 0 }}>
                        {/* [E7] grid.RowClick (L259) → retrievePage() L439-443: 고른 행의 결제내역·분개를 다시 읽는다(같은 행을 다시 눌러도) */}
                        <MultiGrid<AstTrIntrinsic> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.trId)}
                          onRowClicked={e => { if (e.data) retrievePage(e.data); }} />
                      </div>
                    </div>
                  </Splitter.Panel>
                  <Splitter.Panel min={200}>
                    <div style={{ height: '100%', paddingLeft: 8, boxSizing: 'border-box' }}>
                      <Ast07_Grid_ForSettle ref={settleRef} journalRef={journalRef} />
                    </div>
                  </Splitter.Panel>
                </Splitter>
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={300} min={200}>
          <div style={{ height: '100%', padding: '0 20px 20px 20px', boxSizing: 'border-box' }}>
            <Ast06_Grid_ForJournal ref={journalRef} />
          </div>
        </Splitter.Panel>
      </Splitter>
      <Ast05_Lookup_TrCodeWindow open={trCodeOpen} windowClassName={WINDOW_CLASS} onResult={onTrCodeResult} onClose={() => setTrCodeOpen(false)} />
      <Sys15_Lookup_Corp open={corpOpen} onResult={onCorpResult} onClose={() => setCorpOpen(false)} />
      <Ast01_Lookup_Info open={infoOpen} assetType="1" withAll onResult={onInfoResult} onClose={() => setInfoOpen(false)} />
      <Ast06_Lookup_TrForIntrinsic target={target} onChanged={onChanged} onClose={closeEdit} />
      <Act80_Lookup_RelateAppr target={relateTarget} onClosed={() => void closeRelate()} onClose={() => setRelateTarget(null)} />
    </div>
  );
};
