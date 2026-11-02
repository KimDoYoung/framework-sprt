/**
 * [1195] 관리회계 > 20. 결산 > 회계마감 (X14)
 * AS-IS: myApp/client/vi/act/Act04_Tab_Close.java (260줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L54-92: BorderLayout 위 = 툴바 50(여백 20,20,-2,20: 회계년도 70 · [조회][마감검증][회계마감][마감취소] · 예금잔고 정리 ☑ · 계정원장 정리 ☑) /
 *   왼쪽 0.3(분할·여백 0,0,20,20) = 월 그리드(행번호·체크 단일·마감월 80·마감일 120·마감여부 150) / 가운데 0.7(여백 0,20,20,-1) = 마감현황 그리드(마감현황 900 TextArea). 열 때 retrieve("R")
 * 스타일: GGH (원본이 좌우 분할 — yunhee page-style은 GG로 판별한다. docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 회계년도 입력 폭 80(12 원칙 6, 원본 70). 왼쪽 폭은 원본 0.3을 그대로(견본 GGH는 680 고정)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, Input, message, Modal, Splitter } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { GenLedgerCloseNote, GenLedgerCloseStatus } from '@/types/act';
import { SingleGrid, gbFor } from '@/components/grid';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';

const gbMonth = gbFor<GenLedgerCloseStatus>();
const gbNote = gbFor<GenLedgerCloseNote>();

/** 단일 체크 선택 (setChecked(SINGLE)) */
const ROW_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

/** buildGrid() L138-146: setChecked(SINGLE), 행번호 있음 */
const buildGrid = () => [
  gbMonth.textCenter('monthName', 80, '마감월'),  // L142 SQL 계산 컬럼(f_cdnm MonthsCode)
  gbMonth.date('stdDate', 120, '마감일'),  // L143
  gbMonth.textCenter('closeName', 150, '마감여부'),  // L144
];

/** buildCheckGrid() L148-153: 마감현황 TextArea 900 (남은 폭을 채운다) */
const buildCheckGrid = () => [
  gbNote.textArea('note', 900, '마감현황', { flex: 1, minWidth: 300 }),  // L151
];

type ProcType = 'P' | 'C' | 'A';

export const Act04_Tab_Close: React.FC = () => {
  const gridRef = useRef<AgGridReact<GenLedgerCloseStatus>>(null);
  // [E0] 화면 열림 (생성자 L54-92) → settings() L94-136: 회계년도 = 오늘의 연도, 예금잔고 정리·계정원장 정리 = 체크 → retrieve("R")
  const [year, setYear] = useState(String(dayjs().year()));
  const [depositUpdateYn, setDepositUpdateYn] = useState(true);
  const [genLedgerUpdateYn, setGenLedgerUpdateYn] = useState(true);
  const [rows, setRows] = useState<GenLedgerCloseStatus[]>([]);
  const [notes, setNotes] = useState<GenLedgerCloseNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [noteLoading, setNoteLoading] = useState(false);
  const retrieveSeq = useRef(0);

  // retrieve() L155-175: act.Act04_GenLedger.selectCloseStatus(companyId, year) → 끝나면 첫 행을 고른다(onRowDataUpdated).
  //   procType "R"(조회 단추·Enter·열 때)이면 checkGrid를 비운다. 마감·취소 뒤의 재조회는 마감현황을 남긴다
  const retrieve = useCallback(async (procType: string = 'R') => {
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    if (procType === 'R') setNotes([]);
    try {
      const list = await actApi.searchGenLedgerCloses(year);
      if (my === retrieveSeq.current) setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);
    }
  }, [year]);

  useEffect(() => { void retrieve('R'); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // update() L217-251: act.Act04_GenLedger.insertClose(companyId, closeDate, procType, depositUpdateYn, genLedgerUpdateYn)
  //   → checkGrid.replaceAll(결과). status 1이면 P "회계마감 처리가 완료되었습니다." · C "회계마감 취소가 완료되었습니다." (+ retrieve) · A "마감검증이 완료되었습니다.", 아니면 서버 메시지
  const update = async (procType: ProcType, stdDate: string) => {
    setNoteLoading(true);  // checkGrid.mask("Loading")
    try {
      const res = await actApi.processGenLedgerClose({ closeDate: stdDate, procType, depositUpdateYn, genLedgerUpdateYn });
      setNotes(res.notes ?? []);
      if (res.status === 1) {
        if (procType === 'P') { message.info('회계마감 처리가 완료되었습니다.'); await retrieve(procType); }
        else if (procType === 'C') { message.info('회계마감 취소가 완료되었습니다.'); await retrieve(procType); }
        else message.info('마감검증이 완료되었습니다.');
      } else {
        message.warning(res.message);
      }
    } catch (err) {
      message.error(errorMessage(err, '처리 실패'));
    } finally {
      setNoteLoading(false);
    }
  };

  // [E3] closeCheckButton[마감검증] (L118) "A" / [E4] accountCloseButton[회계마감] (L124) "P" / [E5] accountCancelButton[마감취소] (L130) "C" → preUpdate() L177-215:
  //   선택 없음 "선택된 월이 없습니다." → 확인창(400) → [E6] msgBox.DialogHide [YES] (L198) → update()
  const preUpdate = (procType: ProcType) => {
    const sel = gridRef.current?.api.getSelectedRows()[0];
    if (!sel) { message.info('선택된 월이 없습니다.'); return; }
    const head = `${year}년도 ${sel.monthName}의 `;
    const content = procType === 'P'
      ? <>{head}회계마감 처리를 하시겠습니까?<br />(계정원장 정리포함시 작업시간 1분이상 소요됩니다)</>
      : procType === 'C'
        ? <>{head}회계마감 취소를 하시겠습니까?</>
        : <>{head}마감검증을 하시겠습니까?<br />(계정원장 정리포함시 작업시간 1분이상 소요됩니다)</>;
    Modal.confirm({
      title: '확인', width: 400, okText: '예', cancelText: '아니오', content,
      onOk: () => update(procType, sel.stdDate),
    });
  };

  const columnDefs = useMemo(buildGrid, []);
  const noteColumnDefs = useMemo(buildCheckGrid, []);

  return (
    <div style={{ height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 'none', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
        {/* [E1] yearField.KeyPress [Enter] (L97) / [E2] retrieveButton[조회].Select (L112) → retrieve("R") */}
        <SearchBar
          onSearch={() => retrieve('R')}
          loading={loading}
          extra={<>
            <Button type="view" onClick={() => preUpdate('A')}>마감검증</Button>
            <Button type="save" onClick={() => preUpdate('P')}>회계마감</Button>
            <Button type="cancel" onClick={() => preUpdate('C')}>마감취소</Button>
            <Checkbox checked={depositUpdateYn} onChange={e => setDepositUpdateYn(e.target.checked)}>예금잔고 정리</Checkbox>
            <Checkbox checked={genLedgerUpdateYn} onChange={e => setGenLedgerUpdateYn(e.target.checked)}>계정원장 정리</Checkbox>
          </>}
        >
          <SearchBar.Field label="회계년도">
            <Input style={{ width: 80 }} value={year} onChange={e => setYear(e.target.value)} onPressEnter={() => void retrieve('R')} />
          </SearchBar.Field>
        </SearchBar>
      </div>
      <Splitter style={{ flex: 1, minHeight: 0 }}>
        <Splitter.Panel defaultSize="30%" min={300}>
          <div style={{ height: '100%', boxSizing: 'border-box', padding: '8px 10px 20px 20px' }}>
            <SingleGrid<GenLedgerCloseStatus>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              rowSelection={ROW_SELECTION}
              getRowId={p => String(p.data.genLedgerId)}
              loading={loading}
              onRowDataUpdated={e => { e.api.getDisplayedRowAtIndex(0)?.setSelected(true); }}
            />
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ height: '100%', boxSizing: 'border-box', padding: '8px 20px 20px 10px' }}>
            <SingleGrid<GenLedgerCloseNote>
              rowData={notes}
              columnDefs={noteColumnDefs}
              getRowId={p => String(p.data.genLedgerId)}
              loading={noteLoading}
            />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
