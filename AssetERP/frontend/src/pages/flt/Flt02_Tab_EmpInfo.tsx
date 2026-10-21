/**
 * 임직원매매현황 (J07) — 준법감시 > 11. 임직원매매(준감인) > 임직원매매현황 #1351
 * AS-IS: myApp/client/vi/flt/Flt02_Tab_EmpInfo.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L61-91: center = vlc = 툴바(기준일 · 검색 · [조회][엑셀다운로드]) / 읽기 전용 그리드(단일 선택). 열릴 때 조회(L90).
 * 그리드의 가족동의서·계좌건수·위반건수 칸을 누르면 각 조회창(Flt07_Lookup_FamilyConsent·Flt03_Lookup_AccountView·Flt10_Lookup_ViolateView),
 * 맨 오른쪽 편집 아이콘은 메모 창(Flt15_Lookup_Note). 위반건수 조회창은 I10 위반내역조회 API를 재사용한다.
 * 원본 엑셀은 RD 리포트 서버(Flt02_Rd_EmpInfo / 연간투자한도 숨김이면 Flt02_Rd_EmpInfo2) → TOBE는 서버가 조회 결과를 xlsx로 만든다
 * UX보강(10): 툴바 = SearchBar(UX-01), 날짜 열 90(UX-08)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import type { CellClickedEvent } from 'ag-grid-community';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltEmpInfo } from '@/types/flt';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { Flt15_Lookup_Note } from './Flt15_Lookup_Note';
import { Flt10_Lookup_ViolateView } from './Flt10_Lookup_ViolateView';
import { Flt07_Lookup_FamilyConsent } from './Flt07_Lookup_FamilyConsent';
import { Flt03_Lookup_AccountView } from './Flt03_Lookup_AccountView';

const gb = gbFor<FltEmpInfo>();
const DATE_FORMAT = 'YYYY-MM-DD';
const CURSOR = { cursor: 'pointer' } as const;  // addTextCenterCursor

export const Flt02_Tab_EmpInfo: React.FC = () => {
  const gridRef = useRef<AgGridReact<FltEmpInfo> | null>(null);
  // settings() L93-151: 기준일 = 이번 달 1일의 전날(전월 말일)
  const [stdDate, setStdDate] = useState<Dayjs>(() => dayjs().startOf('month').subtract(1, 'day'));
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<FltEmpInfo[]>([]);
  const [limitHidden, setLimitHidden] = useState(false);
  const [noteEmp, setNoteEmp] = useState<FltEmpInfo | null>(null);
  const [familyPersonId, setFamilyPersonId] = useState<number | null>(null);
  const [accountPersonId, setAccountPersonId] = useState<number | null>(null);
  const [violatePersonId, setViolatePersonId] = useState<number | null>(null);
  const paramRef = useRef({ stdDate, searchText });
  paramRef.current = { stdDate, searchText };

  // retrieve() L217-230: 서비스 flt.Flt02_Emp.selectByCompanyId(companyId, stdDate, searchText "%…%")
  const retrieve = useCallback(async () => {
    const p = paramRef.current;
    try {
      setRows(await fltApi.searchEmpInfos(p.stdDate.format(DATE_FORMAT), p.searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L61-91) → settings(), retrieve()
  // setGridHidden() L153-174: 서비스 flt.Flt01_CompanyStd.selectByDate(companyId, toDay=기준일) → 연간투자한도 숨김이면 8번 열을 가린다(열릴 때 한 번)
  useEffect(() => {
    fltApi.getEmpInfoSetting(paramRef.current.stdDate.format(DATE_FORMAT))
      .then(s => setLimitHidden(s.investLimitUnvisibleYn))
      .catch(() => undefined);
    void retrieve();
  }, [retrieve]);

  // [E2] grid.CellClick (L115): 값이 비어 있지 않을 때만 — 4 가족동의서 → lookupFamily(), 5 계좌건수 → lookupAccount(), 13 위반건수 → lookupViolate()
  const onCellLink = (open: (personId: number) => void) => (e: CellClickedEvent<FltEmpInfo>) => {
    if (e.data && e.value != null && e.value !== '') open(e.data.personId);
  };

  // buildGrid() L176-204
  const columnDefs = useMemo(() => [
    gb.text('orgName', 200, '본부(부서)'),
    gb.textCenter('personName', 80, '사원명'),
    gb.textCenter('oathYnName', 80, '서약서<br>서명유무'),
    gb.textCenter('familyYnName', 100, '가족동의서', { cellStyle: CURSOR, onCellClicked: onCellLink(setFamilyPersonId) }),
    gb.textCenter('accountCntStr', 80, '계좌건수', { cellStyle: CURSOR, onCellClicked: onCellLink(setAccountPersonId) }),
    gb.textCenter('checkCycleName', 80, '보고주기'),
    gb.date('rcntReportDate', 90, '최근보고일'),  // 원본 100 → UX-08
    gb.long('yearInvestLimit', 120, '연간투자한도', { hide: limitHidden }),
    gb.long('yearInvestAmt', 120, '연간투자금액'),
    gb.long('totalInvestAmt', 120, '누적투자금액'),
    gb.double('turnoverRate', 120, '월매매회전율(%)'),
    gb.long('dailyAvg', 120, '월간<br>일평균잔고'),
    gb.textCenter('violateCntStr', 80, '위반건수', { cellStyle: CURSOR, onCellClicked: onCellLink(setViolatePersonId) }),
    gb.textCenter('note', 80, '준감인의견'),
    // 편집 아이콘 → lookupNote() L206-215: Flt15_Lookup_Note.open(선택 행, 저장하면 그 행의 note 갱신)
    iconCell<FltEmpInfo>('edit', 'actionCell', 40, ' ', row => setNoteEmp(row)),
  ], [limitHidden]);

  // lookupNote() 콜백: grid.getStore().update(model) — 메모 있음/없음만 그 행에 반영한다
  const onNoteSaved = (personId: number, note: string) => {
    setRows(prev => prev.map(r => (r.personId === personId ? { ...r, note } : r)));
  };

  // [E4] downloadButton[엑셀다운로드].Select (L145) → createRdExcel() L232-303 (RD 대신 서버 xlsx)
  const createRdExcel = async () => {
    const p = paramRef.current;
    const date = p.stdDate.format(DATE_FORMAT);
    try {
      await fltApi.downloadEmpInfoExcel(date, p.searchText, `임직원매매현황(${date}).xlsx`);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  const baseDate = stdDate.format(DATE_FORMAT);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L138) → retrieve(). [E1] searchText.KeyPress [Enter] (L104) → retrieve() */}
        <SearchBar onSearch={retrieve} extra={<Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 130 }} allowClear={false} value={stdDate} format={DATE_FORMAT} onChange={d => d && setStdDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="본부(부서)/사원명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<FltEmpInfo>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.empId)}
          />
        </div>
      </div>
      <Flt15_Lookup_Note emp={noteEmp} onSaved={onNoteSaved} onClose={() => setNoteEmp(null)} />
      <Flt07_Lookup_FamilyConsent personId={familyPersonId} onClose={() => setFamilyPersonId(null)} />
      <Flt03_Lookup_AccountView personId={accountPersonId} baseDate={baseDate} onClose={() => setAccountPersonId(null)} />
      <Flt10_Lookup_ViolateView personId={violatePersonId} baseDate={baseDate} onClose={() => setViolatePersonId(null)} />
    </div>
  );
};
