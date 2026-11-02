/**
 * [1354] 커뮤니티 > 04. 업무보고 > 주간업무보고 (Z11)
 * AS-IS: myApp/client/vi/rpt/Rpt03_Tab_WeekWrite.java (774줄) + Rpt03_Page_WeekWrite (226줄, 건의사항 그리드) + Rpt03_Lookup_WeekWrite (215줄, 등록/수정 창)
 *   + Rpt05_Lookup_WeekBizClass (152줄, 업무구분 관리) + Sys09_Lookup_Code(공용 코드관리, 기존) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L83-119: center = 툴바 50(보고주간 연 45 + 월 콤보 60 + 주차 콤보 220 · [조회][직전 보고내용 가져오기][등록] · [출력/다운로드][제출][제출취소] · 확인 안내) + 업무 그리드(행번호 숨김),
 *   south 300 = Rpt03_Page_WeekWrite (건의사항 및 기타 요청사항)
 * 스타일: GG (견본 — docs/page-style.md, Est02_Tab_PfResultReport). 아래 크기는 원본이 300으로 정해서 defaultSize 300
 * RD: [출력/다운로드]는 `sys99_print`를 채워 `RdViewer`로 mrd Rpt03_Rd_WeekWrite를 띄운다(docs/RD-대책.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, Input, message, Modal, Select, Splitter } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { rptWeekApi } from '@/api/rpt';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { RptWeek, RptWeekCode } from '@/types/rpt';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { RdViewer } from '@/components/lookup/RdViewer';
import { SearchBar } from '@/components/search';
import { Rpt03_Lookup_WeekWrite, RptWeekEdit } from './Rpt03_Lookup_WeekWrite';
import { Rpt03_Page_WeekWrite } from './Rpt03_Page_WeekWrite';

/** AS-IS ImageCell("▲"/"▼") — 글자 버튼 열 */
const arrowCell = (colId: string, text: string, onClick: (row: RptWeek) => void) => ({
  ...iconCell<RptWeek>('add', colId, 40, ' ', onClick),
  cellRenderer: (p: { data?: RptWeek }) => (
    <AntButton type="text" size="small" onClick={e => { e.stopPropagation(); if (p.data) onClick(p.data); }}>{text}</AntButton>
  ),
});

const gb = gbFor<RptWeek>();
const DATE = 'YYYY-MM-DD';

export const Rpt03_Tab_WeekWrite: React.FC = () => {
  const gridRef = useRef<AgGridReact<RptWeek>>(null);
  const [rows, setRows] = useState<RptWeek[]>([]);
  const [editTarget, setEditTarget] = useState<RptWeekEdit | null>(null);
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  const [pageNonce, setPageNonce] = useState(0);
  const [confirmLabel, setConfirmLabel] = useState('');

  // settings() L121-138: 보고주간 연 = 올해(45) · 월 = 이번 달(60) · 주차 콤보 = 이번 달 목록
  const [year, setYear] = useState(() => dayjs().format('YYYY'));
  const [month, setMonth] = useState<string>(() => dayjs().format('MM'));
  const [weeks, setWeeks] = useState<RptWeekCode[]>([]);
  /** 고른 주차 "시작일|종료일" */
  const [weekCode, setWeekCode] = useState<string | undefined>(undefined);
  const [weekText, setWeekText] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [closeDate, setCloseDate] = useState<string | null>(null);

  // confirmRetrieve() L384-407: 서비스 rpt.Rpt04_WeekConfirm.selectByCompanyId — 확인자가 있으면 안내
  const confirmRetrieve = useCallback(async (s: string, c: string) => {
    try {
      const st = await rptWeekApi.getState(s, c);
      setConfirmLabel(st.confirmerId != null ? `※ 주간업무보고 확인 완료(확인자  ${st.confirmerName ?? ''})` : '');
    } catch {
      setConfirmLabel('');
    }
  }, []);

  // retrieve(startDate, closeDate) L348-382: 서비스 rpt.Rpt03_Week.selectByStartDate(…, weekBizTypeCode null) → confirmRetrieve(), weekWritePage.retrieve()
  const retrieveWeek = useCallback(async (s: string | null, c: string | null) => {
    if (!s || !c) return;
    try {
      setRows(await rptWeekApi.search(s, c, false));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    void confirmRetrieve(s, c);
    setPageNonce(n => n + 1);
  }, [confirmRetrieve]);
  const retrieve = () => retrieveWeek(startDate, closeDate);

  // 월 콤보 목록 → 주차 콤보 (selectWeekListByMonth)
  const loadWeeks = useCallback(async (y: string, m: string) => {
    try {
      setWeeks(await rptWeekApi.getWeekList(y, m));
    } catch (err) {
      message.error(errorMessage(err, '주차 조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L83-119) → settings(), getWeekDays(오늘) L597-623: 이번 주 월~금과 주차 글자를 채우고 retrieve(startDate, closeDate)
  useEffect(() => {
    void (async () => {
      await loadWeeks(year, month);
      try {
        const days = await rptWeekApi.getWeekDays(dayjs().format(DATE));
        setStartDate(days.startDate);
        setCloseDate(days.closeDate);
        setWeekCode(`${days.startDate}|${days.closeDate}`);
        setWeekText(`${days.weekNumber}주차 (${days.startDate} ~ ${days.closeDate})`);
        await retrieveWeek(days.startDate, days.closeDate);
      } catch {
        message.warning('날짜를 가져올 수 없습니다.');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E1] monthComboBox[MonthsCode].Collapse (L139) → 주차 콤보를 비우고 연·월로 다시 읽는다
  const onMonthChange = (code: string) => {
    setMonth(code);
    setWeekCode(undefined);
    setWeekText(undefined);
    void loadWeeks(year, code);
  };
  // [E2] weekComboBox.Collapse (L153) → startDate·closeDate = "시작일|종료일", retrieve()
  const onWeekChange = (code: string) => {
    const [s, c] = code.split('|');
    setWeekCode(code);
    setStartDate(s);
    setCloseDate(c);
    void retrieveWeek(s, c);
  };

  // fixCheck(action) L709-737 → confirmCheck(action) L739-765
  const confirmCheck = async (action: () => void | Promise<void>) => {
    if (!startDate || !closeDate) return;
    try {
      const st = await rptWeekApi.getState(startDate, closeDate);
      if (st.confirmerId == null) {
        await action();
      } else {
        message.warning('확인 처리된 보고입니다. 수정이 불가합니다.');
        void confirmRetrieve(startDate, closeDate);
      }
    } catch (err) {
      message.error(errorMessage(err, '상태 확인 실패'));
    }
  };
  const fixCheck = async (action: () => void | Promise<void>) => {
    if (!startDate || !closeDate) return;
    try {
      const st = await rptWeekApi.getState(startDate, closeDate);
      if (!st.fixYn) {
        await confirmCheck(action);
      } else {
        message.warning('제출 처리된 보고입니다. 수정이 불가합니다.');
        void retrieve();
      }
    } catch (err) {
      message.error(errorMessage(err, '상태 확인 실패'));
    }
  };

  // [E4] insertButton[등록].Select (L171) → fixCheck(), insertRow() L409-424: 순번 = (행 수 + 1) × 100, 고른 행이 있으면 그 순번 + 1
  const insertRow = () => {
    const selected = gridRef.current?.api?.getSelectedRows()[0];
    const seq = selected?.seq != null ? selected.seq + 1 : (rows.length + 1) * 100;
    setEditTarget({ weekStartDate: startDate, weekCloseDate: closeDate, seq });
  };

  // [E5] lastWeekGetButton[직전 보고내용 가져오기].Select (L178) → fixCheck(), lastWeekCheck() L527-578
  const lastWeekCheck = async () => {
    if (rows.length > 0) {
      Modal.info({ title: '확인', content: '현재 주차에 데이터가 있어서 가져올 수 없습니다. 데이터를 비우고 다시 시도해주시길 바랍니다.', width: 400, okText: '확인' });
      return;
    }
    try {
      const before = await rptWeekApi.getBeforeWeek(startDate!);
      if (!before) {
        Modal.info({ title: '확인', content: '직전 보고내용이 없습니다.', width: 300, okText: '확인' });
        return;
      }
      // [E11] msgBox.DialogHide [YES] (L559) → insertBeforeWeek() L580-595
      Modal.confirm({
        title: '확인',
        content: '직전 보고내용을 가져오시겠습니까?',
        okText: '예',
        cancelText: '아니오',
        width: 350,
        onOk: async () => {
          try {
            await rptWeekApi.copyBeforeWeek(startDate!, closeDate!, before.weekStartDate!);
          } catch (err) {
            message.error(errorMessage(err, '가져오기 실패'));
            return;
          }
          await retrieve();
        },
      });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E6]·[E7] fixButton[제출]·cancleButton[제출취소].Select (L185·L192) → confirmCheck(), updateFix(true|false) L625-658
  const updateFix = async (fixYn: boolean) => {
    for (const r of rows) {
      if (r.fixYn == null) continue;
      if (r.fixYn && fixYn) { message.warning('이미 제출되었습니다.'); return; }
      if (!r.fixYn && !fixYn) { message.warning('이미 취소되었습니다.'); return; }
    }
    try {
      await rptWeekApi.fix(startDate!, closeDate!, fixYn);
    } catch (err) {
      message.error(errorMessage(err, fixYn ? '제출 실패' : '제출취소 실패'));
      return;
    }
    await retrieve();
    message.success(`${fixYn ? '제출' : '제출취소'} 처리 되었습니다.`);
  };

  // [E8] downLoadButton[출력/다운로드].Select (L200) → 데이터가 없으면 "현재 주차의 데이터가 없습니다.", getLastWeek → sys.Sys99_Print.insertRdWeekWrite
  //   → RDViewer.viewer(dns admin · CommonViewer.html · mrd Rpt03_Rd_WeekWrite · options "/rhtmlimportopt [2]" · rv rdGroupId·orgName·personName·startDate·closeDate·lastStartDate·lastCloseDate)
  const downLoad = async () => {
    if (rows.length <= 0) { message.warning('현재 주차의 데이터가 없습니다.'); return; }
    try {
      const print = await rptWeekApi.rdPrint(startDate!);
      const md = (d: string) => dayjs(d).format('MM/DD');
      const res = await rdApi.buildUrl({
        kind: 'viewer',
        mrd: 'Rpt03_Rd_WeekWrite',
        options: '/rhtmlimportopt [2]',
        rv: {
          rdGroupId: print.groupId,
          orgName: rows[0].orgName ?? '',
          personName: rows[0].personName ?? '',
          startDate: md(startDate!),
          closeDate: md(closeDate!),
          lastStartDate: print.lastStartDate ? md(print.lastStartDate) : '0/0',
          lastCloseDate: print.lastCloseDate ? md(print.lastCloseDate) : '0/0',
        },
      });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    }
  };

  // changeRow(actionCode) L455-490: ▲▼는 한 칸 옮기고 순번을 (i+1)×100으로 다시 매겨 저장(inUpdateData), 삭제는 deleteChk()
  const changeRow = async (row: RptWeek, action: 'up' | 'down' | 'delete') => {
    if (action === 'delete') { deleteChk(row); return; }
    const i = rows.findIndex(r => r.weekId === row.weekId);
    if (action === 'down' && (i < 0 || i + 1 >= rows.length)) return;
    if (action === 'up' && i <= 0) return;
    const next = [...rows];
    const [moved] = next.splice(i, 1);
    next.splice(action === 'down' ? i + 1 : i - 1, 0, moved);
    const reseq = next.map((r, idx) => ({ ...r, seq: (idx + 1) * 100 }));  // getSeq() L519-525
    setRows(reseq);
    setTimeout(() => gridRef.current?.api?.getRowNode(String(row.weekId))?.setSelected(true), 0);
    try {
      await rptWeekApi.saveSeq(reseq.map(r => ({ weekId: r.weekId, seq: r.seq! })));
    } catch (err) {
      message.error(errorMessage(err, '순서 저장 실패'));
      void retrieve();
    }
  };

  // [E10] msgBox.DialogHide [YES] (L495) → delete() L513-517
  const deleteChk = (row: RptWeek) => {
    Modal.confirm({
      title: '확인',
      content: '해당 내용을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 350,
      onOk: async () => {
        try {
          await rptWeekApi.delete([row.weekId]);
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
          return;
        }
        await retrieve();
      },
    });
  };

  // [E9] grid.getStore().StoreRecordChange (L291) → fixCheck(), boldSetting() L671-707: 굵게를 바꾸면 업무내용 앞에 <b>를 붙이거나 떼고 rpt.Rpt03_Week.boldUpdate
  const onBoldChanged = (row: RptWeek) => {
    void fixCheck(async () => {
      const html = (row.htmlContent ?? '').replace('<b>', '');
      const updated = { ...row, htmlContent: row.bold ? `<b>${html}` : html };
      setRows(prev => prev.map(r => (r.weekId === row.weekId ? updated : r)));
      try {
        await rptWeekApi.bold(row.weekId, row.bold === true);
      } catch (err) {
        message.error(errorMessage(err, '굵게 저장 실패'));
        void retrieve();
      }
    });
  };

  // buildGrid() L300-346 (setRowNumHidden(true))
  const columnDefs = useMemo(() => [
    gb.textCenter('bizTypeName', 150, '구분'),  // L334 addTextFixCenter
    gb.textHtml('htmlContent', 500, '업무내용'),  // L335 addTextAreaHtml
    gb.text('dueDate', 150, '완료예정일 및 진행상태'),  // L336
    // L303-309 editCell → fixCheck(), dataEdit() L660-669: Rpt03_Lookup_WeekWrite.update(선택 행, callback → retrieve())
    iconCell<RptWeek>('edit', 'actionCell', 60, '수정', row => void fixCheck(() => setEditTarget(row))),  // L337
    arrowCell('actionCell01', '▲', row => void fixCheck(() => changeRow(row, 'up'))),  // L338 upButton ▲
    arrowCell('actionCell02', '▼', row => void fixCheck(() => changeRow(row, 'down'))),  // L339 downButton ▼
    iconCell<RptWeek>('delete', 'actionCell03', 40, '삭제', row => void fixCheck(() => changeRow(row, 'delete'))),  // L340
    gb.boolean('bold', 60, '굵게', { editable: true }),  // L341 addBoolean
    gb.textArea('note', 450, '비고'),  // L342 addTextArea
    gb.textCenter('fixYnStr', 60, '제출여부'),  // L343 addTextFixCenter
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [rows, startDate, closeDate]);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel min={120}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* [E3] retrieveButton[조회].Select (L165) → retrieve() */}
              <SearchBar
                onSearch={() => retrieve()}
                extra={
                  <>
                    <Button type="register" onClick={() => fixCheck(lastWeekCheck)}>직전 보고내용 가져오기</Button>
                    <Button type="register" onClick={() => fixCheck(insertRow)}>등록</Button>
                    <Button type="download" onClick={downLoad}>출력/다운로드</Button>
                    <Button type="save" onClick={() => confirmCheck(() => updateFix(true))}>제출</Button>
                    <Button type="cancel" onClick={() => confirmCheck(() => updateFix(false))}>제출취소</Button>
                    {confirmLabel && <span style={{ color: '#456EA6', fontSize: 13 }}>{confirmLabel}</span>}
                  </>
                }
              >
                <SearchBar.Field label="보고주간">
                  <Input style={{ width: 60 }} maxLength={4} value={year} onChange={e => setYear(e.target.value)} />
                  <SystemCodeComboBox kindCd="MonthsCode" allowClear={false} style={{ width: 80 }} value={month} onChange={c => { if (c) onMonthChange(c); }} />
                  <Select
                    style={{ width: 220 }}
                    value={weekCode}
                    placeholder={weekText}
                    options={[...(weekCode && !weeks.some(w => w.code === weekCode) ? [{ value: weekCode, label: weekText }] : []), ...weeks.map(w => ({ value: w.code, label: w.name }))]}
                    onChange={onWeekChange}
                  />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                <SingleGrid<RptWeek>
                  gridRef={gridRef}
                  rowNumber={false}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.weekId)}
                  onCellValueChanged={e => { if (e.colDef.field === 'bold' && e.data) onBoldChanged(e.data); }}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={300} min={200}>
          <div style={{ height: '100%', padding: '0 20px 20px 20px', boxSizing: 'border-box' }}>
            <Rpt03_Page_WeekWrite startDate={startDate} closeDate={closeDate} nonce={pageNonce} />
          </div>
        </Splitter.Panel>
      </Splitter>
      <Rpt03_Lookup_WeekWrite model={editTarget} onClose={() => setEditTarget(null)} onDone={() => { void retrieve(); }} />
      <RdViewer url={rdUrl} title="주간업무보고" onClose={() => setRdUrl(null)} />
    </div>
  );
};
