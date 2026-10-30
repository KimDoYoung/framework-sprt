/**
 * [1196] 자금관리 > 20. 사업비관리 > 세금/4대보험 등록 (U04)
 * AS-IS: myApp/client/vi/ast/Ast06_Tab_TrTax.java (593줄) + Ast06_Lookup_TrTax.java (645줄) + Ast06_Lookup_Tr4Insure.java (809줄) + Ast06_Grid_Journal.java (143줄) + Ast05_Lookup_TrCodeWindow.java (195줄)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L80-97: BorderLayout 위 = 툴바 50(여백 20,20,0,20: 조회기간 100 ~ 100 · 거래유형 200 "전체" · [조회][등록][삭제] · [문서분류지정]) + 가운데 그리드(행번호, 체크 다중, 9열),
 *   아래 300(여백 0,20,20,20) = Ast06_Grid_Journal
 * 스타일: GG (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 2개라 넣지 않는다
 * [다음 단계] 결재요청·문서보기가 여는 전자결재 편집창 Apr01_Edit_ApprDoc(insertLinkApproval·retrieveApproval)과 분개 그리드의 [변경]이 여는 Act02_Lookup_ModiJournal은 다른 도메인이라 지금은 안내만 한다.
 *   결재요청은 편집창이 열릴 자리까지(결재 상태 검사 → 재상신 확인 → 거래유형별 Link 코드 → 문서분류 지정 여부)를 원본 그대로 한다. 결재 뒤 updateApprId API(PUT ast/trs/{id}/appr)는 만들어 두었다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { astApi } from '@/api/ast';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { AstTr, AstTrCodeByWindow } from '@/types/ast';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Dcr30_Lookup_Link } from '@/components/lookup/Dcr30_Lookup_Link';
import { Ast05_Lookup_TrCodeWindow } from './Ast05_Lookup_TrCodeWindow';
import { Ast06_Lookup_TrTax, AstTrTaxTarget } from './Ast06_Lookup_TrTax';
import { Ast06_Lookup_Tr4Insure, AstTr4InsureTarget } from './Ast06_Lookup_Tr4Insure';
import { Ast06_Grid_Journal, Ast06_Grid_JournalHandle } from './Ast06_Grid_Journal';

const gb = gbFor<AstTr>();
const FORMAT = 'YYYY-MM-DD';
const ALL_LABEL = '전체';
const NEXT_STEP = '전자결재 편집창(Apr01_Edit_ApprDoc)은 다음 단계에서 연결합니다.';

export const Ast06_Tab_TrTax: React.FC = () => {
  const gridRef = useRef<AgGridReact<AstTr>>(null);
  const journalRef = useRef<Ast06_Grid_JournalHandle>(null);
  // setting() L101-114: 조회기간 = 이번 달 1일 ~ 말일, 거래유형 = 전체
  const [startDate, setStartDate] = useState<Dayjs | null>(() => dayjs().startOf('month'));
  const [closeDate, setCloseDate] = useState<Dayjs | null>(() => dayjs().endOf('month'));
  const [trCode, setTrCode] = useState<string | null>(null);
  const [trName, setTrName] = useState(ALL_LABEL);
  const [rows, setRows] = useState<AstTr[]>([]);
  const [loading, setLoading] = useState(false);
  const [trCodeOpen, setTrCodeOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [taxTarget, setTaxTarget] = useState<AstTrTaxTarget | null>(null);
  const [insureTarget, setInsureTarget] = useState<AstTr4InsureTarget | null>(null);
  /** 변경 창을 연 행 — 닫을 때 그 행의 분개를 다시 읽는다(callback.execute(trModel)) */
  const editRowId = useRef<number | null>(null);
  const rowsRef = useRef<AstTr[]>([]);
  rowsRef.current = rows;

  // retrieve() L378-402: ast.Ast06_Tr.selectTaxTr(시작·종료일, 회사, 거래코드 — 없으면 "%") → 첫 행 선택 → retrievePage()
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      const list = await astApi.searchTaxTrs((startDate ?? dayjs()).format(FORMAT), (closeDate ?? dayjs()).format(FORMAT), trCode);
      setRows(list);
      const first = list[0];
      if (first) {
        setTimeout(() => gridRef.current?.api?.getRowNode(String(first.trId))?.setSelected(true), 0);
        await journalRef.current?.retrieve(first.journalId);  // retrievePage() L404-407
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [startDate, closeDate, trCode]);

  // [E0] 화면 열림 (생성자 L80-97) → setting() L99-195: 마지막에 retrieve()
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E1] trName.TriggerClick (L116) → Ast05_Lookup_TrCodeWindow.open("Ast06_Tab_TrTax", null, …): 고른 거래유형이 있으면 코드·이름, 없으면(전체) "전체"·null
  const onTrCodeResult = (row: AstTrCodeByWindow | null) => {
    setTrCodeOpen(false);
    setTrName(row ? row.trName ?? '' : ALL_LABEL);
    setTrCode(row ? row.trCode : null);
    trAstClassTreeId.current = row ? row.astClassTreeId : null;
  };
  /** astClassTreeId(LongField) — 거래유형의 자산분류. 4대보험 등록이 새 거래에 넘긴다 */
  const trAstClassTreeId = useRef<number | null>(null);

  // [E3] insertButton[등록].Select (L160) → insertRow() L409-440: 거래유형이 없으면 안내, 5052(4대보험납부)는 4대보험 창, 그 밖은 세금 창 — 둘 다 NEW
  const insertRow = () => {
    if (trCode == null) { message.warning('거래유형을 선택하세요'); return; }
    if (trCode === '5052') setInsureTarget({ mode: 'NEW', trCode, trName, astClassTreeId: trAstClassTreeId.current });
    else setTaxTarget({ mode: 'NEW', trCode, trName });
  };

  /** 편집창이 서버에서 다시 읽은 거래를 그리드에 반영한다. 새 거래면 맨 아래에 넣고 그 행만 선택한 뒤 분개를 읽는다(callback.execute(trModel) → gridJournal.retrieve) */
  const onChanged = (tr: AstTr, created: boolean) => {
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
  const closeEdit = (modi: boolean) => {
    setTaxTarget(null);
    setInsureTarget(null);
    if (!modi) return;
    const row = rowsRef.current.find(r => r.trId === editRowId.current);
    if (row) void journalRef.current?.retrieve(row.journalId);
  };

  // [E8] 변경 아이콘 actionCell(ImageCell "Edit") (L199-224): 5052면 4대보험 창, 아니면 세금 창 — 둘 다 MODI
  const openModi = (row: AstTr) => {
    editRowId.current = row.trId;
    if (row.trCode === '5052') setInsureTarget({ mode: 'MODI', tr: row });
    else setTaxTarget({ mode: 'MODI', tr: row });
  };

  // searchDcr() L518-556: 거래유형별 Link 코드(5050 A66 · 5051 A67 · 5052 A68, 그 밖은 오류) → dcr.Dcr30_Link.selectByLinkCode → 없으면 안내, 있으면 insertLinkApproval() (다음 단계)
  const searchDcr = async (code: string | null) => {
    const linkCode = code === '5050' ? 'A66' : code === '5051' ? 'A67' : code === '5052' ? 'A68' : null;
    if (linkCode == null) { message.warning('거래코드 에러(관리자에게 문의하세요.)'); return; }
    try {
      const list = await dcrApi.searchClassTreeByLinkCode(linkCode);
      if (list.length === 0) { message.warning('문서분류가 지정되어있지 않습니다.'); return; }
      message.info(NEXT_STEP);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // 결재요청 아이콘 actionCell2 (L226-): apr.Apr01_Appr.selectById(apprId)의 상태 — 결재문서가 없으면 바로 searchDcr(), 있으면 상신·결재중·완료(10/20/30)는 막고,
  // 임시저장(99)은 원본이 상자를 만들고 보이지 않은 채 끝낸다(아무 일 없음), 그 밖(반려)은 확인 뒤 searchDcr(). 결재 상태는 거래와 함께 읽는 값(GET ast/trs/{id})을 쓴다
  const requestAppr = async (row: AstTr) => {
    try {
      const fresh = await astApi.getTr(row.trId);
      const status = fresh.apprId == null ? null : fresh.apprStatusCode;
      if (status == null) { await searchDcr(fresh.trCode); return; }
      if (status === '10' || status === '20' || status === '30') { message.warning('결재진행중/완료된 문서가 존재합니다'); return; }
      if (status === '99') return;
      // [E7] msgBox.DialogHide [YES] (L296) → searchDcr()
      Modal.confirm({
        title: '확인', content: '문서상신이 반려된 경우 재상신합니다. 진행하시겠습니까?', width: 550, okText: '예', cancelText: '아니오',
        onOk: () => searchDcr(fresh.trCode),
      });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // 상세보기 아이콘 viewCell (L289-): apprId가 없거나 문서가 없으면 안내, 있으면 Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false) (다음 단계)
  const viewAppr = async (row: AstTr) => {
    const noDoc = () => message.warning('해당 문서가 없습니다. 결재상태를 확인해주세요.');
    if (row.apprId == null) { noDoc(); return; }
    try {
      const fresh = await astApi.getTr(row.trId);
      if (fresh.apprId == null || fresh.apprStatusCode == null) { noDoc(); return; }
      message.info(NEXT_STEP);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E4] deleteButton[삭제].Select (L166) → deleteRow() L442-475: 미선택 안내 → 결재문서(상태 40이 아닌 것)가 있으면 안내 → 확인(300) → [E9] YES → delete() L477-516
  const deleteRow = () => {
    const checked = gridRef.current?.api.getSelectedRows() ?? [];
    if (checked.length === 0) { message.warning('삭제대상을 선택하여 주십시오.'); return; }
    if (checked.some(r => r.apprStatusCode != null && r.apprStatusCode !== '40')) { message.warning('결재문서가 존재합니다.'); return; }
    Modal.confirm({
      title: '확인', content: `${checked.length}건의 거래를 삭제하시겠습니까?`, width: 300, okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          // 회계마감 검사(act.Act04_GenLedger.checkClose)와 삭제(ast.Ast06_Tr.delete)는 서버가 한 트랜잭션으로 한다
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

  // buildGrid() L197-376
  const columnDefs = useMemo(() => [
    gb.date('date', 90, '일자'),  // L346
    gb.text('trName', 200, '거래유형'),  // L347
    gb.text('note', 300, '적요'),  // L348
    gb.long('amt', 150, '납부(환불)금액'),  // L349
    iconCell<AstTr>('edit', 'modiAction', 50, '변경', openModi),  // L350 actionCell
    iconCell<AstTr>('edit', 'apprAction', 70, '결재요청', row => void requestAppr(row)),  // L351 actionCell2
    gb.textCenter('apprStatusName', 100, '결재상태'),  // L352
    iconCell<AstTr>('view', 'viewAction', 80, '상세보기', row => void viewAppr(row)),  // L353 viewCell
    gb.textCenter('personName', 80, '등록자'),  // L354
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel min={120}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* [E2] retrieveButton[조회].Select (L154) → retrieve() */}
              <SearchBar onSearch={retrieve} loading={loading}
                extra={(
                  <>
                    <Button type="register" onClick={insertRow}>등록</Button>
                    <Button type="delete" onClick={deleteRow}>삭제</Button>
                    {/* [E5] dcrLinkButton[문서분류지정].Select (L173) → Dcr30_Lookup_Link.open("LinkCode0006", …) */}
                    <Button type="save" onClick={() => setLinkOpen(true)}>문서분류지정</Button>
                  </>
                )}>
                <SearchBar.Field label="조회기간">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
                    ~
                    <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
                  </span>
                </SearchBar.Field>
                <SearchBar.Field label="거래유형">
                  <LookupInput value={trName} placeholder={ALL_LABEL} onOpen={() => setTrCodeOpen(true)}
                    onClear={() => onTrCodeResult(null)} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                {/* [E6] grid.RowClick (L186) → retrievePage() L404-407: 고른 행의 분개를 다시 읽는다(같은 행을 다시 눌러도) */}
                <MultiGrid<AstTr> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.trId)}
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
      <Ast05_Lookup_TrCodeWindow open={trCodeOpen} windowClassName="Ast06_Tab_TrTax" onResult={onTrCodeResult} onClose={() => setTrCodeOpen(false)} />
      <Ast06_Lookup_TrTax target={taxTarget} onChanged={onChanged} onClose={() => closeEdit(taxTarget?.mode === 'MODI')} />
      <Ast06_Lookup_Tr4Insure target={insureTarget} onChanged={onChanged} onClose={() => closeEdit(insureTarget?.mode === 'MODI')} />
      <Dcr30_Lookup_Link open={linkOpen} linkCodeList="LinkCode0006" onClose={() => setLinkOpen(false)} />
    </div>
  );
};
