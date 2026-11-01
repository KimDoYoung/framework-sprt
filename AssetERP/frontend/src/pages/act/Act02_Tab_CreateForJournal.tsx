/**
 * [1176] 관리회계 > 12. 특수회계처리(외화) > 전표입력(외화) (X07)
 * AS-IS: myApp/client/vi/act/Act02_Tab_CreateForJournal.java (370줄) + Act02_Grid_CreateForJournal·Act02_Lookup_CreateForJournal (pages/act)
 *   + Act80_Lookup_RelateAppr (pages/act) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L66-104: BorderLayout 북쪽 0.5(여백 20,20,-1,20, 크기 조절 · 최소 150) = 툴바 50(조회기간 100~100 · 검색 200 "적요/거래처" · [조회][등록][삭제])
 *   + 전표 그리드(체크 다중, 12열, 합계 행 "계"), 가운데(여백 0,20,20,20) = 분개 그리드 Act02_Grid_CreateForJournal
 * 전표입력(Act02_Tab_CreateJournal, X01)의 외화 판: 국외(abroType 2) 전표만 읽고, 통화 열이 더해졌으며, 템플릿·엑셀업로드는 없다
 * 열 때 한 번 조회한다(오늘~오늘). 조회하면 첫 행을 고르고 그 전표의 분개를 아래에 보여 준다. 행을 고르면 분개를 다시 읽는다
 * 스타일: GG (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { actApi } from '@/api/act';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { Journal } from '@/types/act';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { Act02_Grid_CreateForJournal } from './Act02_Grid_CreateForJournal';
import { Act02_Lookup_CreateForJournal, CreateForJournalTarget } from './Act02_Lookup_CreateForJournal';
import { Act80_Lookup_RelateAppr, ActRelateApprTarget } from './Act80_Lookup_RelateAppr';

const gb = gbFor<Journal>();
const FORMAT = 'YYYY-MM-DD';
const SUM_ROW = { labelField: 'journalNoStr', label: '계', sum: ['journalAmt'] };

export const Act02_Tab_CreateForJournal: React.FC = () => {
  // [E0] 화면 열림 (생성자 L66-104) → settings() L106-149: 조회기간 = 오늘 ~ 오늘, 검색칸 "적요/거래처", retrieve()
  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const [closeDate, setCloseDate] = useState<Dayjs>(dayjs());
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(false);
  const [journalId, setJournalId] = useState<number | null>(null);
  const [nonce, setNonce] = useState(0);
  const [editTarget, setEditTarget] = useState<CreateForJournalTarget | null>(null);
  const [relateTarget, setRelateTarget] = useState<ActRelateApprTarget | null>(null);
  const gridRef = useRef<AgGridReact<Journal>>(null);
  const relateId = useRef<number | null>(null);

  /** retrieve()가 읽는 조건 */
  const condRef = useRef({ startDate, closeDate, searchText });
  condRef.current = { startDate, closeDate, searchText };

  // [E2] grid.RowClick (L124) → journalDtlGrid.retrieve(고른 전표 ID) — 분개 그리드를 읽는다
  const showJournal = (id: number) => { setJournalId(id); setNonce(n => n + 1); };

  // retrieve() L226-254: act.Act02_Journal.selectByDate(companyId, startDate, closeDate, abroType "2", "%검색어%") → 첫 행 선택 → 그 전표의 분개
  const retrieve = useCallback(async () => {
    const c = condRef.current;
    setLoading(true);
    try {
      const list = await actApi.searchJournals(c.startDate.format(FORMAT), c.closeDate.format(FORMAT), c.searchText, '2');
      setRows(list);
      if (list[0]) setTimeout(() => gridRef.current?.api?.getRowNode(String(list[0].journalId))?.setSelected(true), 0);
      else setJournalId(null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  /** 한 행을 다시 읽어 바꾼다 (grid.getStore().update(...)) */
  const refreshRow = async (id: number) => {
    try {
      const fresh = await actApi.getJournal(id);
      setRows(prev => prev.map(r => (r.journalId === id ? fresh : r)));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E4] insertButton[등록].Select (L137) → insertRow() L291-302: Act02_Lookup_CreateForJournal.openNew(…) — 저장하면 새 전표를 목록 끝에 넣고 고른다
  const insertRow = () => setEditTarget({ mode: 'NEW' });
  const afterSaved = async (id: number) => {
    try {
      const fresh = await actApi.getJournal(id);
      setRows(prev => (prev.some(r => r.journalId === id) ? prev.map(r => (r.journalId === id ? fresh : r)) : [...prev, fresh]));
      setTimeout(() => {
        const node = gridRef.current?.api?.getRowNode(String(id));
        if (node) { node.setSelected(true); gridRef.current?.api.ensureNodeVisible(node); }
      }, 0);
      showJournal(id);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // updateDepositBook() L352-364: ast.Ast06_Tr.updateDeposit(companyId, stdDate) — 결과는 보지 않는다(예금원장 정리)
  const updateDepositBook = (date: string) => { void astApi.cleanDepositBook(date).catch(() => undefined); };

  // checkClose() L256-289: 고른 전표마다 승인완료면 막고, act.Act04_GenLedger.checkClose(companyId, 전표일자) — 하나라도 실패하면 그 메시지
  const checkClose = async (list: Journal[]): Promise<boolean> => {
    for (const r of list) {
      if (r.fixYn) { message.info('승인완료 전표가 존재합니다.'); return false; }
    }
    for (const r of list) {
      try {
        await actApi.checkLedgerClose(r.date);
      } catch (err) {
        message.info(errorMessage(err, '회계마감 확인 실패'));
        return false;
      }
    }
    return true;
  };

  // [E7] msgBox.DialogHide [YES] (L312) → checkClose(), 지운 뒤 updateDepositBook() — 전표일자가 바뀔 때마다 그 날짜의 예금원장을 정리한다
  const doDelete = async (list: Journal[]) => {
    if (!(await checkClose(list))) return;
    try {
      await actApi.deleteJournals(list.map(r => r.journalId));
    } catch (err) {
      message.info(errorMessage(err, '삭제 실패'));
      return;
    }
    const ids = new Set(list.map(r => r.journalId));
    setRows(prev => prev.filter(r => !ids.has(r.journalId)));
    if (journalId != null && ids.has(journalId)) setJournalId(null);
    let checkDate: string | null = null;
    for (const m of list) {
      if (checkDate == null) { checkDate = m.date; updateDepositBook(checkDate); }
      if (checkDate !== m.date) { checkDate = m.date; updateDepositBook(checkDate); }
    }
  };

  // [E5] deleteButton[삭제].Select (L143) → deleteRow() L304-350: 미선택이면 안내 → "n건의 분개내역을 삭제하시겠습니까?"(400)
  const deleteRow = () => {
    const list = gridRef.current?.api.getSelectedRows() ?? [];
    if (list.length === 0) { message.warning('삭제할 내역을 선택해주세요'); return; }
    Modal.confirm({
      title: '확인', content: `${list.length}건의 분개내역을 삭제하시겠습니까?`, width: 400, okText: '예', cancelText: '아니오',
      onOk: () => doDelete(list),
    });
  };

  // buildGrid() L151-224: setChecked(MULTI), 합계 행 "계"(전표번호 열, 금액 합)
  const columnDefs = useMemo(() => [
    gb.date('date', 100, '일자'),  // L210
    gb.textCenter('journalNoStr', 85, '전표번호'),  // L211
    gb.text('corpName', 200, '거래처'),  // L212
    gb.textArea('note', 400, '적요'),  // L213
    gb.textCenter('curCode', 80, '통화'),  // L214
    gb.long('journalAmt', 120, '금액'),  // L215
    gb.textCenter('personName', 100, '등록자'),  // L216
    // [E3] actionCell (ImageCell "Edit").callbackOnCreate (L155-170) — Act02_Lookup_CreateForJournal.open(고른 전표, "MODI", …) — 저장하면 그 전표의 분개를 다시 읽는다
    iconCell<Journal>('edit', 'modiAction', 50, '변경', row => setEditTarget({ mode: 'MODI', journalId: row.journalId })),  // L217
    gb.textCenter('dcrCountStr', 55, '연관문서'),  // L218
    // [E6] actionCell (ImageCell "View").callbackOnCreate (L172-207) → Act80_Lookup_RelateAppr.open(제목, "journalId", journalId, …) — 제목 = 일자 + " 거래처" + " 적요", 닫으면 selectById로 그 행을 갱신
    iconCell<Journal>('view', 'viewAction', 25, '', row => {
      relateId.current = row.journalId;
      setRelateTarget({
        title: `${row.date}${row.corpName ? ' ' + row.corpName : ''}${row.note ? ' ' + row.note : ''}`,
        code: 'journalId', relateId: row.journalId,
      });
    }),  // L219
    gb.textCenter('fixYnName', 100, '승인여부'),  // L220
    gb.textCenter('closeName', 100, '마감여부'),  // L221
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel defaultSize="50%" min={120}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* [E3] retrieveButton[조회].Select (L131) / [E1] searchText.KeyPress [Enter] (L115) → retrieve() */}
              <SearchBar onSearch={retrieve} loading={loading} extra={<>
                <Button type="register" onClick={insertRow}>등록</Button>
                <Button type="delete" onClick={deleteRow}>삭제</Button>
              </>}>
                <SearchBar.Field label="조회기간">
                  <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
                  <span style={{ margin: '0 4px' }}>~</span>
                  <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
                </SearchBar.Field>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 200 }} placeholder="적요/거래처" value={searchText} onChange={e => setSearchText(e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0 }}>
                <MultiGrid<Journal>
                  gridRef={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.journalId)}
                  sumRow={SUM_ROW}
                  onRowSelected={e => { if (e.node.isSelected() && e.data) showJournal(e.data.journalId); }}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize="50%" min={200}>
          <div style={{ height: '100%', padding: '0 20px 20px 20px', boxSizing: 'border-box' }}>
            <Act02_Grid_CreateForJournal journalId={journalId} nonce={nonce} />
          </div>
        </Splitter.Panel>
      </Splitter>
      <Act02_Lookup_CreateForJournal target={editTarget} onSaved={id => void afterSaved(id)} onClose={() => setEditTarget(null)} />
      <Act80_Lookup_RelateAppr target={relateTarget}
        onClosed={() => { if (relateId.current != null) void refreshRow(relateId.current); }}
        onClose={() => setRelateTarget(null)} />
    </div>
  );
};
