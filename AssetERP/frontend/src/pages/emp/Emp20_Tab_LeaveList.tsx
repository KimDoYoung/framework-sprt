/**
 * [1034] 신청 > 01. 외출/출장/휴가 > 휴가신청조회 (Y02)
 * AS-IS: myApp/client/vi/emp/Emp20_Tab_LeaveList.java (265줄) + components/lookup/Emp00_Lookup_SelectSingle — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃(생성자 L65-84, 스타일 SG 견본 Tdm01_Tab_Hr): 툴바(조회기간 ~ · 사원명 · [조회][출력/다운로드]) + 휴가 그리드(체크 단일, 8열). 테두리 없음
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 * 다음 단계: [상세보기]의 열람권한 확인(apr.Apr01_Appr.permissionsCheck — TOBE에 아직 없음)은 결재창이 문서를 읽을 때의 검사에 맡긴다
 * 스타일: SG (yunhee page-style 판별 — docs/page-style.md)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { empLeaveListApi } from '@/api/emp';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { LeaveListRow, TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { RdViewer } from '@/components/lookup/RdViewer';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';

const gb = gbFor<LeaveListRow>();
const FORMAT = 'YYYY-MM-DD';
/** setChecked(SINGLE) — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const ROW_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

export const Emp20_Tab_LeaveList: React.FC = () => {
  const gridRef = useRef<AgGridReact<LeaveListRow>>(null);
  // buttonBarSetting() L86-112: 조회기간 = 이번 달 1일 ~ 두 달 뒤 말일(오늘 월 1일 + 2개월 - 1일)
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().startOf('month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(dayjs().startOf('month').add(2, 'month').subtract(1, 'day'));
  const [personName, setPersonName] = useState('');
  const [personOpen, setPersonOpen] = useState(false);
  const [rows, setRows] = useState<LeaveListRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  const range = useRef({ startDate, closeDate, personName });
  range.current = { startDate, closeDate, personName };

  // retrieve() L251-260: emp.Emp20_Leave.selectByPersonName(personName, startDate, closeDate, companyId)
  const retrieve = async () => {
    const r = range.current;
    setLoading(true);
    try {
      setRows(await empLeaveListApi.search(r.personName, r.startDate.format(FORMAT), r.closeDate.format(FORMAT)));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L65-84) → buttonBarSetting(), retrieve()
  useEffect(() => { void retrieve(); }, []);

  // [E1] personName.TriggerClick (L114) → 인라인 L114-128: Emp00_Lookup_SelectSingle.open(오늘, true, callback) → 이름(과 ID)을 칸에 넣는다
  const onPickPerson = (t: TransInfo | null) => {
    setPersonOpen(false);
    if (t) setPersonName(t.korNm ?? '');
  };

  // [E3] rdButton[출력/다운로드].Select (L135) → 서비스 sys.Sys99_Print.insertRdLeaveList(companyId, personId, "Emp20_Tab_LeaveList", personName, startDate, closeDate)
  //   → 성공이면 RDViewer.viewer(dns admin · CommonViewer.html · mrd Emp20_Rd_LeaveList · options "/rpdflinebreak [1]" · rv rdGroupId·companyId·personId·startDate·closeDate)
  const download = async () => {
    const r = range.current;
    setLoading(true);   // grid.mask("Loading")
    try {
      const groupId = await empLeaveListApi.rdDownload(r.personName, r.startDate.format(FORMAT), r.closeDate.format(FORMAT));
      const res = await rdApi.buildUrl({
        kind: 'viewer',
        mrd: 'Emp20_Rd_LeaveList',
        options: '/rpdflinebreak [1]',
        rv: { rdGroupId: groupId, startDate: r.startDate.format(FORMAT), closeDate: r.closeDate.format(FORMAT) },
      });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    } finally {
      setLoading(false);
    }
  };

  // buildGrid() L178-248 (setChecked SINGLE)
  const columnDefs = useMemo(() => [
    gb.date('startDate', 100, '휴가시작일'),   // L237
    gb.date('closeDate', 100, '휴가종료일'),   // L238
    gb.textCenter('personName', 120, '성명'),   // L239
    gb.double('leaveCount', 60, '휴가기간'),   // L240
    gb.text('leaveName', 150, '휴가구분'),   // L241
    // [E4] actionCell (ImageCell).callbackOnCreate (L193) → 인라인 L193-198: ApprCallbackResult(apprId) → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, …)
    iconCell<LeaveListRow>('view', 'apprView', 50, '상세보기', row => {   // L243
      if (row.apprId == null) { message.warning('해당문서의 열람권한이 없습니다'); return; }
      setViewApprId(row.apprId);
    }),
    gb.text('managerName', 150, '대직자'),   // L244
    gb.text('emergencyTelno', 150, '비상망'),   // L245
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L129) → retrieve() */}
        <SearchBar
          onSearch={() => void retrieve()}
          loading={loading}
          extra={<Button type="download" onClick={download}>출력/다운로드</Button>}
        >
          <SearchBar.Field label="조회기간">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
              ~
              <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
            </span>
          </SearchBar.Field>
          <SearchBar.Field label="사원명">
            <LookupInput value={personName} width={100} onOpen={() => setPersonOpen(true)} onClear={() => setPersonName('')} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<LeaveListRow>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            rowSelection={ROW_SELECTION}
            getRowId={p => String(p.data.leaveId)}
            loading={loading}
          />
        </div>
      </div>
      <Emp00_Lookup_SelectSingle open={personOpen} separateAddTitle noneLabel={null} transDate={dayjs().format(FORMAT)} onResult={onPickPerson} onClose={() => setPersonOpen(false)} />
      <RdViewer url={rdUrl} title="휴가신청조회" onClose={() => setRdUrl(null)} />
      <Apr01_Edit_ApprDoc apprId={viewApprId} onClose={() => setViewApprId(null)} />
    </div>
  );
};
