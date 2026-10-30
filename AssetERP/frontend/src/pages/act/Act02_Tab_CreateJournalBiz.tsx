/**
 * [1180] 자금관리 > 20. 사업비관리 > 급여/카드 회계처리 (U10)
 * AS-IS: myApp/client/vi/act/Act02_Tab_CreateJournalBiz.java (383줄) + Act02_Grid_CreateJournalBiz (pages/act) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L58-77: BorderLayout 북쪽 50(여백 20,20,0,20) = 툴바(기준년월 70 · [조회] [전표발생] [전표삭제]), 가운데(여백 -2,20,-2,20) = 월 단위 그리드(체크 다중, 7열),
 *   남쪽 0.7(여백 0,20,20,20, 크기 조절) = Act02_Grid_CreateJournalBiz
 * 열 때 한 번 조회한다. 조회하면 첫 행을 고르고 그 행의 분개를 아래에 보여 준다. 행을 누르면 그 행의 분개를 다시 읽는다
 * 스타일: GG (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 * [다음 단계] 아래 그리드 [변경] 아이콘이 여는 Act02_Lookup_ModiJournal은 분개 수정 창이라 지금은 안내만 한다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Splitter, message } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { actApi } from '@/api/act';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { JournalBiz, JournalBizRow } from '@/types/act';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Act02_Grid_CreateJournalBiz } from './Act02_Grid_CreateJournalBiz';

const gb = gbFor<JournalBiz>();
const MONTH_FORMAT = /^(\d{4})[.-](\d{2})$/;

/** 서버가 읽는 행 속성만 */
const toRow = (r: JournalBiz): JournalBizRow => ({
  journalId: r.journalId, retireId: r.retireId, trCode: r.trCode, note: r.note, date: r.date, payMonthCode: r.payMonthCode,
});

export const Act02_Tab_CreateJournalBiz: React.FC = () => {
  // [E0] 화면 열림 (생성자 L58-77) → setting() L79-131: 기준년월 = 지난달(이번 달 1일 - 1일) "yyyy.MM", 폭 70
  const [stdMonth, setStdMonth] = useState(() => dayjs().startOf('month').subtract(1, 'day').format('YYYY.MM'));
  const [rows, setRows] = useState<JournalBiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState<JournalBizRow | null>(null);
  const [nonce, setNonce] = useState(0);
  const gridRef = useRef<AgGridReact<JournalBiz>>(null);

  /** getYYYYMM() L368-370 — 입력의 '-'는 '.'로 읽는다. 형식이 틀리면 null(AS-IS는 예외) */
  const getYYYYMM = (): string | null => {
    const m = MONTH_FORMAT.exec(stdMonth.trim());
    if (!m || +m[2] < 1 || +m[2] > 12) { message.warning('기준년월을 yyyy.MM 형식으로 입력하세요.'); return null; }
    return `${m[1]}.${m[2]}`;
  };

  // retrievePage() L169-172: 고른 행의 분개를 아래 그리드에 (gridJournal.retrieve(selectModel, getStdDate()))
  const retrievePage = (row: JournalBiz, ym: string) => {
    setTarget(toRow(row));
    setStdMonthOfPage(ym);
    setNonce(n => n + 1);
  };
  /** 아래 그리드가 읽는 기준년월 — 조회한 시점의 값 (입력칸을 고치기만 해서는 바뀌지 않는다) */
  const [stdMonthOfPage, setStdMonthOfPage] = useState(stdMonth);

  // retrieve() L150-167: act.Act02_Journal.selectMonthBiz(companyId, stdMonth) → 첫 행 선택 → retrievePage()
  const retrieve = useCallback(async () => {
    const ym = getYYYYMM();
    if (ym == null) return;
    setLoading(true);
    try {
      const list = await actApi.searchJournalBizs(ym);
      setRows(list);
      if (list[0]) {
        setTimeout(() => gridRef.current?.api?.getRowNode(String(list[0].rowKey))?.setSelected(true), 0);
        retrievePage(list[0], ym);
      } else {
        setTarget(null);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [stdMonth]);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // updateDepositBook() L317-332: ast.Ast06_Tr.updateDeposit(companyId, stdDate = 기준월 1일) — 결과는 보지 않는다(예금원장 정리)
  const updateDepositBook = (ym: string) => {
    const [y, m] = ym.split('.');
    void astApi.cleanDepositBook(`${y}-${m}-01`).catch(() => undefined);
  };

  // checkClose() L334-358: 선택이 없으면 안내 → act.Act04_GenLedger.checkClose(companyId, 기준월 말일) 성공이면 callBack
  const checkClose = async (ym: string, list: JournalBiz[]): Promise<boolean> => {
    if (list.length === 0) { message.info('선택한 내역이 없습니다.'); return false; }
    const [y, m] = ym.split('.');
    try {
      await actApi.checkLedgerClose(dayjs(`${y}-${m}-01`).endOf('month').format('YYYY-MM-DD'));
      return true;
    } catch (err) {
      message.info(errorMessage(err, '회계마감 확인 실패'));
      return false;
    }
  };

  // [E6] msgBox.DialogHide [YES] (L177) → createJournal() L194-244
  const createJournal = async () => {
    const ym = getYYYYMM();
    if (ym == null) return;
    const list = gridRef.current?.api.getSelectedRows() ?? [];
    if (!(await checkClose(ym, list))) return;
    if (list.some(r => r.journalYn === '생성완료')) { message.info('이미 전표가 생성되어있는 내역이 선택되어 있습니다.'); return; }
    if (list.some(r => (r.bizCloseYn ?? '') === '')) { message.info('내역확정 데이터만 전표생성이 가능합니다.'); return; }
    setLoading(true);
    try {
      await actApi.createJournalBizs(ym, list.map(toRow));
      updateDepositBook(ym);
      await retrieve();
    } catch (err) {
      message.info(errorMessage(err, '전표 생성 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E7] msgBox.DialogHide [YES] (L249) → deleteJournal() L266-315
  const deleteJournal = async () => {
    const ym = getYYYYMM();
    if (ym == null) return;
    const list = gridRef.current?.api.getSelectedRows() ?? [];
    if (!(await checkClose(ym, list))) return;
    if (list.some(r => r.journalYn === '미생성')) { message.info('전표가 생성되지 않은 내역이 선택되어 있습니다.'); return; }
    if (list.some(r => r.fixYnName === '승인')) { message.info('승인완료된 전표가 선택되어 있습니다.'); return; }
    setLoading(true);
    try {
      await actApi.deleteJournalBizs(ym, list.map(toRow));
      updateDepositBook(ym);
      await retrieve();
    } catch (err) {
      message.info(errorMessage(err, '전표 삭제 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E3] createButton[전표발생].Select (L110) → createJournalChk() L174-192: "n건의 전표를 생성하시겠습니까?"(300)
  const createJournalChk = () => {
    const n = gridRef.current?.api.getSelectedRows().length ?? 0;
    Modal.confirm({ title: '생성', content: `${n}건의 전표를 생성하시겠습니까?`, width: 300, okText: '예', cancelText: '아니오', onOk: createJournal });
  };

  // [E4] deleteButton[전표삭제].Select (L116) → deleteJournalChk() L246-264: "n건의 전표를 삭제하시겠습니까?"(300)
  const deleteJournalChk = () => {
    const n = gridRef.current?.api.getSelectedRows().length ?? 0;
    Modal.confirm({ title: '삭제', content: `${n}건의 전표를 삭제하시겠습니까?`, width: 300, okText: '예', cancelText: '아니오', onOk: deleteJournal });
  };

  // buildGrid(): setChecked(MULTI)
  const columnDefs = useMemo(() => [
    gb.text('note', 300, '구분'),
    gb.long('trCount', 100, '건수'),
    gb.long('journalAmt', 150, '발생금액'),
    gb.textCenter('bizCloseYn', 120, '확정구분'),
    gb.textCenter('journalYn', 120, '전표발생'),
    gb.textCenter('fixYnName', 120, '전표승인'),
    gb.textCenter('accountCloseYn', 120, '회계마감'),
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel defaultSize="30%" min={120}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* [E2] retrieveButton[조회].Select (L104) / [E1] stdMonth.KeyPress [Enter] (L86) → retrieve() */}
              <SearchBar onSearch={retrieve} loading={loading} extra={<>
                <Button type="save" onClick={createJournalChk}>전표발생</Button>
                <Button type="delete" onClick={deleteJournalChk}>전표삭제</Button>
              </>}>
                <SearchBar.Field label="기준년월">
                  <SearchBar.Input style={{ width: 70 }} value={stdMonth} onChange={e => setStdMonth(e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                {/* [E5] grid.RowClick (L123) → retrievePage() */}
                <MultiGrid<JournalBiz>
                  gridRef={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.rowKey)}
                  onRowClicked={e => { const ym = getYYYYMM(); if (e.data && ym) retrievePage(e.data, ym); }}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize="70%" min={200}>
          <div style={{ height: '100%', padding: '0 20px 20px 20px', boxSizing: 'border-box' }}>
            <Act02_Grid_CreateJournalBiz target={target} stdMonth={stdMonthOfPage} nonce={nonce} />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
