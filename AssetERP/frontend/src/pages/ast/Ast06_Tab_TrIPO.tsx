/**
 * [1288] 고유자산 > 20. 고유자산 거래처리 > 청약처리 (W05)
 * AS-IS: myApp/client/vi/ast/Ast06_Tab_TrIPO.java (553줄) + Ast06_Lookup_TrIPO.java (883줄) + Ast06_Lookup_CreateIpoAstClass.java (117줄) + Ast01_Lookup_Info.java (408줄)
 *   + Ast06_Grid_Journal.java (143줄) + Ast05_Lookup_TrCodeWindow.java (195줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L95-122: BorderLayout 위 = 툴바 88(여백 20,20,0,20: 1줄 조회기간 100 ~ 100 · 거래유형 200 "전체" · 거래계좌 250 "전체" · [조회][엑셀다운로드] / 2줄 종목 504 "전체" · 검색 250 "거래유형/거래처/종목유형/종목/적요")
 *   + 가운데 그리드(툴바 50: [등록][삭제] + 행번호·체크 다중·17열), 아래 300(여백 0,20,20,20) = Ast06_Grid_Journal
 * 스타일: GG (견본 — docs/page-style.md). 툴바가 두 줄이라 SearchPanel(R03), [등록][삭제] 줄은 그리드 위에 따로 둔다
 * UX보강(10): 툴바 = SearchPanel(UX-01), 읽기 전용 날짜 열 폭 90(UX-08, 원본 100)
 * [다음 단계] 연관문서 아이콘이 여는 Act80_Lookup_RelateAppr(다른 도메인 act, 안에서 전자결재 편집창 Apr01_Edit_ApprDoc)과 분개 그리드의 [변경]이 여는 Act02_Lookup_ModiJournal은 지금은 안내만 한다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstTrCodeByWindow, AstTrCodeTreeNode, AstTrFinance } from '@/types/ast';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { Button } from '@/components/button';
import { SearchPanel } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Ast01_Lookup_CorpAccount } from './Ast01_Lookup_CorpAccount';
import { Ast01_Lookup_Info } from './Ast01_Lookup_Info';
import { Ast05_Lookup_TrCodeWindow } from './Ast05_Lookup_TrCodeWindow';
import { Ast06_Lookup_TrIPO, AstTrIpoTarget } from './Ast06_Lookup_TrIPO';
import { Ast06_Grid_Journal, Ast06_Grid_JournalHandle } from './Ast06_Grid_Journal';

const gb = gbFor<AstTrFinance>();
const FORMAT = 'YYYY-MM-DD';
const ALL_LABEL = '전체';
const WINDOW_CLASS = 'Ast06_Tab_TrIPO';

export const Ast06_Tab_TrIPO: React.FC = () => {
  const gridRef = useRef<AgGridReact<AstTrFinance>>(null);
  const journalRef = useRef<Ast06_Grid_JournalHandle>(null);
  // setting() L124-313: 조회기간 = 올해 1/1 ~ 12/31(start·close), 거래유형·거래계좌·종목 = 전체
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs().endOf('year'));
  const [trCodeId, setTrCodeId] = useState<number | null>(null);
  const [trName, setTrName] = useState(ALL_LABEL);
  const [corpAccountId, setCorpAccountId] = useState<number | null>(null);
  const [corpAccountName, setCorpAccountName] = useState(ALL_LABEL);
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [classTreeName, setClassTreeName] = useState(ALL_LABEL);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AstTrFinance[]>([]);
  const [loading, setLoading] = useState(false);
  const [trCodeOpen, setTrCodeOpen] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [target, setTarget] = useState<AstTrIpoTarget | null>(null);
  /** 변경 창을 연 행 — 닫을 때 그 행의 분개를 다시 읽는다(callback.execute(trModel)) */
  const editRowId = useRef<number | null>(null);
  const rowsRef = useRef<AstTrFinance[]>([]);
  rowsRef.current = rows;

  const params = () => ({
    startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT),
    accountId: corpAccountId, classTreeId, trCodeId, searchText,
  });

  // retrieve() L396-435: ast.Ast06_Tr.selectByPayCode(기간·회사·assetType "1"·abroType "1"·계좌·windowClassName·검색어·종목·거래유형) → 첫 행 선택 → retrievePage()
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      const list = await astApi.searchTrFinances({ ...params(), windowClassName: WINDOW_CLASS, assetType: '1', abroType: '1' });
      setRows(list);
      const first = list[0];
      if (first) {
        setTimeout(() => gridRef.current?.api?.getRowNode(String(first.trId))?.setSelected(true), 0);
        await journalRef.current?.retrieve(first.journalId);  // retrievePage() L437-440
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, closeDate, corpAccountId, classTreeId, trCodeId, searchText]);

  // [E0] 화면 열림 (생성자 L95-122) → setting() — 마지막에 retrieve() L312
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E1] trName.TriggerClick [result != null] (L142) → Ast05_Lookup_TrCodeWindow.open("Ast06_Tab_TrIPO", null, …): 고른 거래유형이 있으면 이름·ID, 없으면(전체) "전체"·null
  const onTrCodeResult = (row: AstTrCodeByWindow | null) => {
    setTrCodeOpen(false);
    setTrName(row ? row.trName ?? '' : ALL_LABEL);
    setTrCodeId(row ? row.trCodeId : null);
  };

  // [E2] corpAccountName.TriggerClick [result != null] (L165) → Ast01_Lookup_CorpAccount.open(조회 시작일, …): 고른 계좌가 있으면 거래처(계좌) 이름·ID, 없으면(전체) "전체"·null
  const onCorpResult = (acc: { classTreeId: number; corpAccountName: string | null } | null) => {
    setCorpOpen(false);
    setCorpAccountName(acc ? acc.corpAccountName ?? '' : ALL_LABEL);
    setCorpAccountId(acc ? acc.classTreeId : null);
  };

  // [E3] classTreeName.TriggerClick [result != null] (L188) → Ast01_Lookup_Info.select("1", "20", "1", …): 고른 종목이 있으면 전체 경로 이름·ID, 없으면(전체) "전체"·null
  const onInfoResult = (node: AstTrCodeTreeNode | null) => {
    setInfoOpen(false);
    setClassTreeName(node ? node.classTreeFullName ?? node.classTreeName : ALL_LABEL);
    setClassTreeId(node ? node.classTreeId : null);
  };

  // [E6] insertButton[등록].Select (L250) → insertRow() L442-453: Ast06_Lookup_TrIPO.openNew()
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

  // 변경 아이콘 actionCell(ImageCell "Edit") (L316-330): Ast06_Lookup_TrIPO.open(고른 행, "MODI", …)
  const openModi = (row: AstTrFinance) => {
    editRowId.current = row.trId;
    setTarget({ mode: 'MODI', tr: row });
  };

  // [E7] deleteButton[삭제].Select (L256) → deleteRow() L455-473: 확인(440) "N건의 항목을 삭제하면 실수령/지급내역이 같이 삭제됩니다. 진행하시겠습니까?" → [E11] YES → delete() L475-531
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
          // 예금원장정리 호출: 일자가 바뀔 때마다 한 번(updateDepositBook L533-545, 결과는 쓰지 않는다)
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

  // [E8] downloadButton[엑셀다운로드].Select (L262) → ExcelDownload?actionCode=ast06IpoList
  const download = async () => {
    try {
      await astApi.downloadIpoExcel(params());
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  // buildGrid() L315-394
  const columnDefs = useMemo(() => [
    gb.date('date', 90, '일자'),  // L360
    gb.text('trName', 175, '거래유형'),  // L361
    gb.text('corpAccountName', 200, '거래처'),  // L362
    gb.textCenter('astClassName', 100, '종목유형'),  // L363
    gb.text('classTreeName', 200, '종목'),  // L364
    gb.double('qty', 100, '거래수량'),  // L365
    gb.double('price', 80, '거래단가'),  // L366
    gb.long('trAmt', 120, '거래금액'),  // L367
    gb.long('fee', 100, '수수료'),  // L368
    gb.long('amt', 120, '결제금액'),  // L369
    gb.textCenter('lockUpPeriodName', 100, '확약기간'),  // L370
    iconCell<AstTrFinance>('edit', 'modiAction', 50, '변경', openModi),  // L371 actionCell
    gb.textCenter('apprCnt', 55, '연관문서'),  // L372
    // [E10] actionCell2 (ImageCell "View") callbackOnCreate (L354) → Act80_Lookup_RelateAppr.open(…) — 다음 단계(안내만)
    iconCell<AstTrFinance>('view', 'relateAction', 25, ' ', () => message.info('연관문서 창(Act80_Lookup_RelateAppr)은 다음 단계에서 연결합니다.')),  // L373 actionCell2
    gb.text('depositName', 150, '예금계좌'),  // L375
    gb.text('note', 250, '적요'),  // L376
    gb.textCenter('personName', 80, '등록자'),  // L377
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel min={120}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* [E5] retrieveButton[조회].Select (L244) → retrieve(), [E4] searchText.KeyPress [Enter] (L210) → retrieve() */}
              <SearchPanel onSearch={retrieve} loading={loading} fieldsWidth={960}>
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
                  <SearchPanel.Field label="거래계좌">
                    <LookupInput value={corpAccountName} width={250} placeholder={ALL_LABEL} onOpen={() => setCorpOpen(true)} onClear={() => onCorpResult(null)} />
                  </SearchPanel.Field>
                </SearchPanel.Row>
                <SearchPanel.Row>
                  <SearchPanel.Field label="종목">
                    <LookupInput value={classTreeName} width={504} placeholder={ALL_LABEL} onOpen={() => setInfoOpen(true)} onClear={() => onInfoResult(null)} />
                  </SearchPanel.Field>
                  <SearchPanel.Field label="검색">
                    <SearchPanel.Input style={{ width: 250 }} placeholder="거래유형/거래처/종목유형/종목/적요" value={searchText} onChange={e => setSearchText(e.target.value)} />
                  </SearchPanel.Field>
                </SearchPanel.Row>
                <SearchPanel.Actions>
                  <Button type="download" onClick={download}>엑셀다운로드</Button>
                </SearchPanel.Actions>
                <SearchPanel.Actions>{null}</SearchPanel.Actions>
              </SearchPanel>
              <div style={{ display: 'flex', gap: 8, padding: '8px 0 0 0' }}>
                <Button type="register" onClick={insertRow}>등록</Button>
                <Button type="delete" onClick={deleteRow}>삭제</Button>
              </div>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                {/* [E9] grid.RowClick (L305) → retrievePage() L437-440: 고른 행의 분개를 다시 읽는다(같은 행을 다시 눌러도) */}
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
      <Ast05_Lookup_TrCodeWindow open={trCodeOpen} windowClassName={WINDOW_CLASS} onResult={onTrCodeResult} onClose={() => setTrCodeOpen(false)} />
      <Ast01_Lookup_CorpAccount open={corpOpen} stdDate={startDate} onResult={onCorpResult} onClose={() => setCorpOpen(false)} />
      <Ast01_Lookup_Info open={infoOpen} assetType="1" itemLClass="20" abroType="1" withAll onResult={onInfoResult} onClose={() => setInfoOpen(false)} />
      <Ast06_Lookup_TrIPO target={target} onChanged={onChanged} onClose={closeEdit} />
    </div>
  );
};
