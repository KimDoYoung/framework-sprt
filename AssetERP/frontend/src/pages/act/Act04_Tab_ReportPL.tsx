/**
 * [1178] 관리회계 > 22. 재무제표 > 손익계산서 (X20)
 * AS-IS: myApp/client/vi/act/Act04_Tab_ReportPL.java (307줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L58-88: 가운데(여백 20) = 툴바 50(기준일자 100 · 비교기준 콤보 100 + 비교일자 100 · 0원 제외 · [조회][출력/다운로드]) + 손익계산서 그리드(행번호 30 + 과목 450 · 당기금액 250 · 전기금액 250). 열 때는 조회하지 않는다
 * 스타일: SG (견본 Tdm01_Tab_Hr — docs/page-style.md). 원본의 바깥 테두리(vlc.setBorders)는 SG 규칙대로 두지 않는다
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 * X21 재무상태표(Act04_Tab_ReportBS)가 같은 API를 reportType '1'로 쓴다
 */
import React, { useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { actApi } from '@/api/act';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { GenLedgerReport } from '@/types/act';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { RdViewer } from '@/components/lookup/RdViewer';

const gb = gbFor<GenLedgerReport>();
const FORMAT = 'YYYY-MM-DD';
const WINDOW_CLASS_NAME = 'Act04_Tab_ReportPL';
const REPORT_TYPE = '2';   // (1:재무상태표 / 2:손익계산서)

export const Act04_Tab_ReportPL: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<GenLedgerReport>>(null);
  // [E0] 화면 열림 (생성자 L58-88) → settings() L90-182: 기준일자 = 오늘, 비교기준 "전기말"(1), 비교일자는 쓸 수 없음 + setCompareDate(). 열 때는 조회하지 않는다
  const [stdDate, setStdDate] = useState<Dayjs>(dayjs());
  const [compareCode, setCompareCode] = useState('1');
  const [compareName, setCompareName] = useState('전기말');
  const [compareDate, setCompareDate] = useState<Dayjs | null>(null);
  const [exceptZero, setExceptZero] = useState(false);
  const [rows, setRows] = useState<GenLedgerReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [rdUrl, setRdUrl] = useState<string | null>(null);

  // setCompareDate() L216-265: 특정일(9)은 그대로 · 전년동기(4)는 기준일자 -12개월 · 전기말(1)/반기(2)/분기(3)는 Sys00_Common 서비스
  const refreshCompareDate = async (std: Dayjs, code: string) => {
    if (code === '9') return;
    if (code === '4') { setCompareDate(std.subtract(12, 'month')); return; }
    try {
      const d = await actApi.getGenLedgerReportCompareDate(std.format(FORMAT), code);
      setCompareDate(d ? dayjs(d) : null);
    } catch (err) {
      message.error(errorMessage(err, '비교일자 조회 실패'));
    }
  };

  React.useEffect(() => { void refreshCompareDate(stdDate, compareCode); }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  // retrieve() L195-214: act.Act04_GenLedger.selectBSPL (companyId, stdDate, compareDate, exceptZeroYn, reportType "2") → 첫 행 선택
  const retrieve = async () => {
    if (!compareDate) { message.info('비교일자를 선택해주세요'); return; }
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await actApi.searchGenLedgerReport(stdDate.format(FORMAT), compareDate.format(FORMAT), exceptZero, REPORT_TYPE);
      setRows(list);
      if (list[0]) setTimeout(() => gridRef.current?.api?.getRowNode(String(list[0].genLedgerId))?.setSelected(true), 0);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E4] downLoadButton[출력/다운로드].Select (L134) → sys.Sys99_Print.insertRdReportPL(companyId, personId, windowClassName, stdDate, compareDate, exceptZeroYn, reportType "2")
  //   → status 1이면 RDViewer(mrd Act04_Rd_ReportPL, rv rdGroupId·companyId·personId·stdDate·stdDateStr·beforeDate·beforeDateStr·compareStr), 아니면 서버 메시지
  const download = async () => {
    if (!compareDate) { message.info('비교일자를 선택해주세요'); return; }
    setLoading(true);
    try {
      const groupId = await actApi.insertGenLedgerReportRd({
        windowClassName: WINDOW_CLASS_NAME, stdDate: stdDate.format(FORMAT), compareDate: compareDate.format(FORMAT),
        exceptZeroYn: exceptZero, reportType: REPORT_TYPE,
      });
      const res = await rdApi.buildUrl({
        kind: 'viewer', mrd: 'Act04_Rd_ReportPL', options: '/rhtmlimportopt [2]',
        rv: {
          rdGroupId: String(groupId), companyId: String(user.companyId), personId: String(user.userId),
          stdDate: stdDate.format(FORMAT), stdDateStr: stdDate.format('YYYY년 MM월 DD일'),
          beforeDate: compareDate.format(FORMAT), beforeDateStr: compareDate.format('YYYY년 MM월 DD일'),
          compareStr: compareName,
        },
      });
      setRdUrl(res.url);
    } catch (err) {
      message.warning(errorMessage(err, '출력 실패'));
    } finally {
      setLoading(false);
    }
  };

  // buildGrid() L184-193: 과목 450(TextArea) · 당기금액 250 · 전기금액 250 (행번호 30)
  const columnDefs = useMemo(() => [
    gb.textArea('accountName2', 450, '과목'),  // L188
    gb.long('curBalAmt', 250, '당기금액'),  // L189
    gb.long('preBalAmt', 250, '전기금액'),  // L190
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L127) → retrieve() */}
        <SearchBar
          onSearch={retrieve}
          loading={loading}
          extra={<Button type="download" onClick={download}>출력/다운로드</Button>}
        >
          {/* [E1] stdDate.ValueChange (L93) → setCompareDate() */}
          <SearchBar.Field label="기준일자">
            <DatePicker style={{ width: 130 }} allowClear={false} value={stdDate} format={FORMAT}
              onChange={d => { if (d) { setStdDate(d); void refreshCompareDate(d, compareCode); } }} />
          </SearchBar.Field>
          {/* [E2] compareComboBox[BsplCompareCode].Collapse (L111) → 특정일(9)이면 비교일자를 쓸 수 있게, 아니면 쓸 수 없게 하고 setCompareDate() */}
          <SearchBar.Field label="비교기준">
            <SystemCodeComboBox kindCd="BsplCompareCode" style={{ width: 100 }} value={compareCode}
              onChange={(c, name) => {
                const v = c ?? '1';
                setCompareCode(v);
                setCompareName(name ?? '');
                void refreshCompareDate(stdDate, v);
              }} />
          </SearchBar.Field>
          <DatePicker style={{ width: 130 }} allowClear={false} disabled={compareCode !== '9'} value={compareDate} format={FORMAT}
            onChange={d => d && setCompareDate(d)} />
          <Checkbox checked={exceptZero} onChange={e => setExceptZero(e.target.checked)}>0원 제외</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<GenLedgerReport>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.genLedgerId)}
            loading={loading}
          />
        </div>
      </div>
      <RdViewer url={rdUrl} title="손익계산서" onClose={() => setRdUrl(null)} />
    </div>
  );
};
