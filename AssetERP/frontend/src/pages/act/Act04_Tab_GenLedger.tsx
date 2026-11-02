/**
 * [1151] 관리회계 > 21. 회계장부 > 계정과목집계표 (X18)
 * AS-IS: myApp/client/vi/act/Act04_Tab_GenLedger.java (353줄) + Act04_Lookup_GenLedger (pages/act, 하위계정정보) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L64-96: 가운데(여백 20, 테두리) = 툴바 50(기준일자 100 · 증감구분 콤보 100 · 계정코드/명 200 · [조회][출력/다운로드][계정원장 정리]) + 계정 그리드(행번호 + 계정코드 120 · 계정과목 300 · 차변 3열 · 대변 3열 · 당일잔고액). 열 때는 조회하지 않는다
 * 원본은 [회계마감](accountCloseButton, 회계마감 창 Act04_Lookup_AccountClose)을 만들어 두고 툴바에 넣지 않았다(L84 주석) — 화면에서 열 수 없는 창이라 옮기지 않았다(결과확인 5)
 * 스타일: SG (견본 Tdm01_Tab_Hr — docs/page-style.md). 원본의 바깥 테두리(vlc.setBorders)는 SG 규칙대로 두지 않는다
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { actApi } from '@/api/act';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { GenLedger } from '@/types/act';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { RdViewer } from '@/components/lookup/RdViewer';
import { Act04_Lookup_GenLedger } from './Act04_Lookup_GenLedger';

const gb = gbFor<GenLedger>();
const FORMAT = 'YYYY-MM-DD';
const WINDOW_CLASS_NAME = 'Act04_Tab_GenLedger';
const DR = { color: '#456EA6', fontWeight: 'bold' };
const CR = { color: '#DD5E5E', fontWeight: 'bold' };
/** 조회가 끝나면 증감구분에 따라 증감액·전잔고 열 제목이 바뀐다 (retrieve() L270-285) — 1 월별 · 2 일별 · 3 분기별 */
const UNIT: Record<string, string> = { '1': '월', '2': '일', '3': '분기' };

export const Act04_Tab_GenLedger: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<GenLedger>>(null);
  // [E0] 화면 열림 (생성자 L64-96) → settings() L98-206: 기준일자 = 오늘, 증감구분 "분기별"(3). 열 때는 조회하지 않는다
  const [stdDate, setStdDate] = useState<Dayjs>(dayjs());
  const [diffType, setDiffType] = useState('3');
  const [unit, setUnit] = useState('일');   // 처음 열 때 제목은 "당일…/전일…" (buildGrid) — 조회 뒤 증감구분 단위로 바뀐다
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<GenLedger[]>([]);
  const [loading, setLoading] = useState(false);
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  const [lookup, setLookup] = useState<{ accountCode: string; stdDate: string } | null>(null);

  // retrieve() L227-289: 월별(1)·분기별(3)은 act.Act04_GenLedger.selectByStdDate1, 일별(2)은 selectByStdDate2 (companyId, stdDate, diffType, "%검색어%") → 첫 행 선택 → 열 제목 바꿈
  const retrieve = async (type = diffType) => {
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await actApi.searchGenLedgers(stdDate.format(FORMAT), type, searchText);
      setRows(list);
      setUnit(UNIT[type] ?? '일');
      if (list[0]) setTimeout(() => gridRef.current?.api?.getRowNode(String(list[0].genLedgerId))?.setSelected(true), 0);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E4] downLoadButton[출력/다운로드].Select (L128) → sys.Sys99_Print.insertRdGenLedger(companyId, personId, windowClassName, stdDate, diffType, "%검색어%") → RDViewer(mrd Act04_Rd_GenLedger, rv rdGroupId·companyId·personId·stdDate·diffType)
  const download = async () => {
    setLoading(true);
    try {
      const groupId = await actApi.insertGenLedgerRd({ windowClassName: WINDOW_CLASS_NAME, stdDate: stdDate.format(FORMAT), diffType, searchText });
      const res = await rdApi.buildUrl({
        kind: 'viewer', mrd: 'Act04_Rd_GenLedger', options: '/rhtmlimportopt [2]',
        rv: { rdGroupId: String(groupId), companyId: String(user.companyId), personId: String(user.userId), stdDate: stdDate.format(FORMAT), diffType },
      });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E5] updateButton[계정원장 정리].Select (L176) → summaryGenLedger() L291-338: 확인(400) "계정원장 정리를 시작하시겠습니까? (정리기간 : 기준일자의 월 1일 ~ 기준일자)"
  //   → [E8] msgBox.DialogHide [YES] (L303) → act.Act04_GenLedger.summaryGenLedger(companyId, startDate, closeDate) → "계정원장 정리가 완료되었습니다." + retrieve(), 실패면 서버 메시지
  const summaryGenLedger = () => {
    const start = stdDate.startOf('month').format(FORMAT);
    const close = stdDate.format(FORMAT);
    Modal.confirm({
      title: '확인', width: 400, okText: '예', cancelText: '아니오',
      content: <>계정원장 정리를 시작하시겠습니까? <br />(정리기간 : {start} ~ {close})</>,
      onOk: async () => {
        setLoading(true);
        try {
          await actApi.summaryGenLedger(start, close);
          message.info('계정원장 정리가 완료되었습니다.');
          await retrieve();
        } catch (err) {
          message.warning(errorMessage(err, '계정원장 정리 실패'));
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // [E6 생략] accountCloseButton[회계마감].Select (L182) → Act04_Lookup_AccountClose.open(): 원본이 단추를 만들고도 툴바에 넣지 않아(L84 주석) 화면에서 열 수 없는 창이다 — 사용자 결정(2026-11-02)으로 옮기지 않음
  // [E7] grid.CellDoubleClick (L189) → 기준일자가 없으면 "기준일자를 선택해주세요", 계정코드가 없으면 "계정코드가 없습니다", 있으면 Act04_Lookup_GenLedger.open(계정코드, 기준일자)
  const openLookup = (row: GenLedger | undefined) => {
    if (!stdDate) { message.info('기준일자를 선택해주세요'); return; }
    if (!row?.accountCode) { message.info('계정코드가 없습니다'); return; }
    setLookup({ accountCode: row.accountCode, stdDate: stdDate.format(FORMAT) });
  };

  // buildGrid() L208-225 (setSortable(false)): 계정코드 120 · 계정과목 300 · 차변 당일잔고액/증감액/전잔고액(456EA6) · 대변 같은 3열(DD5E5E) · 당일잔고액 150
  const columnDefs = useMemo(() => [
    gb.textCenter('accountCode', 120, '계정코드'),  // L214
    gb.textArea('accountName2', 300, '계정과목'),  // L215
    gb.long('drTodayBalAmt', 150, '차변당일잔고액', { headerStyle: DR }),  // L216
    gb.long('drTodayDiffAmt', 150, `차변당${unit}증감액`, { headerStyle: DR }),  // L217
    gb.long('drPredayBalAmt', 150, `차변전${unit}잔고액`, { headerStyle: DR }),  // L218
    gb.long('crTodayBalAmt', 150, '대변당일잔고액', { headerStyle: CR }),  // L219
    gb.long('crTodayDiffAmt', 150, `대변당${unit}증감액`, { headerStyle: CR }),  // L220
    gb.long('crPredayBalAmt', 150, `대변전${unit}잔고액`, { headerStyle: CR }),  // L221
    gb.long('todayBalAmt', 150, '당일잔고액'),  // L222
  ], [unit]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L122) / [E2] searchText.KeyPress [Enter] (L113) → retrieve() */}
        <SearchBar
          onSearch={() => retrieve()}
          loading={loading}
          extra={<>
            <Button type="download" onClick={download}>출력/다운로드</Button>
            <Button type="view" onClick={summaryGenLedger}>계정원장 정리</Button>
          </>}
        >
          <SearchBar.Field label="기준일자">
            <DatePicker style={{ width: 130 }} allowClear={false} value={stdDate} format={FORMAT} onChange={d => d && setStdDate(d)} />
          </SearchBar.Field>
          {/* [E1] comboBoxDiffType[GenLedgerDiffType].Collapse (L104) → retrieve() — 고르고 나면 바로 조회 */}
          <SearchBar.Field label="증감구분">
            <SystemCodeComboBox kindCd="GenLedgerDiffType" style={{ width: 100 }} value={diffType}
              onChange={c => { const v = c ?? '3'; setDiffType(v); void retrieve(v); }} />
          </SearchBar.Field>
          <SearchBar.Field label="계정코드/명">
            <SearchBar.Input style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<GenLedger>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.genLedgerId)}
            loading={loading}
            onCellDoubleClicked={e => openLookup(e.data)}
          />
        </div>
      </div>
      <Act04_Lookup_GenLedger target={lookup} onClose={() => setLookup(null)} />
      <RdViewer url={rdUrl} title="계정과목집계표" onClose={() => setRdUrl(null)} />
    </div>
  );
};
