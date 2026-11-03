/**
 * [1317] KFS > 04. ICAM 사용자ID 관리 > 미사용ID 기록관리 (EE32)
 * AS-IS: myApp/client/vi/icam/Icam55_Tab_UserStopAuth.java (211줄) + Icam55_Lookup_UserStopAuth(159줄, 선택내역 일괄반영 창) + Icam55_Edit_UserStopAuth(160줄, [변경] 편집 창)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L51-81: 가운데 = 툴바(권한정지일 ~ · 검색 300 "회사명/사용자ID/사용자명/상태/비고" · 삭제대상만 조회 · [조회][일괄저장]) + 체크 다중 그리드(행번호, 12열)
 * 스타일: SGP (견본 Chk02_Tab_DailyList — docs/page-style.md). 행 [변경] 아이콘이 편집 창, [일괄저장]이 일괄반영 창을 연다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 날짜 열 폭 UX-08(읽기 90)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { icamUserApi } from '@/api/icam';
import { errorMessage } from '@/api/client';
import { IcamStopAuth } from '@/types/icam';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Icam55_Edit_UserStopAuth } from './Icam55_Edit_UserStopAuth';
import { Icam55_Lookup_UserStopAuth } from './Icam55_Lookup_UserStopAuth';

const gb = gbFor<IcamStopAuth>();
const FORMAT = 'YYYY-MM-DD';

export const Icam55_Tab_UserStopAuth: React.FC = () => {
  const gridRef = useRef<AgGridReact<IcamStopAuth>>(null);
  // settings() L83-117: 권한정지일 = 올해 1월 1일 ~ 오늘, 삭제대상만 조회 = false, 검색어 빈칸
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [searchText, setSearchText] = useState('');
  const [delTarget, setDelTarget] = useState(false);
  const [rows, setRows] = useState<IcamStopAuth[]>([]);
  const [editTarget, setEditTarget] = useState<IcamStopAuth | null>(null);
  const [batchIds, setBatchIds] = useState<number[] | null>(null);

  // retrieve() L155-179: icam.Icam55_IcamUser.selectByProcStateCode(searchText %글자%, companyId(서버), startDate, closeDate, delTarget, procStateCode "1")
  const retrieve = useCallback(async () => {
    try {
      setRows(await icamUserApi.searchStopAuths({
        searchText, startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), delTarget,
      }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [searchText, startDate, closeDate, delTarget]);

  // [E0] 화면 열림 (생성자 L51-81) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E3] allUpdateButton[일괄저장].Select (L111) → openLookupResult() L182-196: 선택 없으면 "선택된 내역이 없습니다.", 있으면 Icam55_Lookup_UserStopAuth.open(list, callback → retrieve())
  const openLookupResult = () => {
    const selected = gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) { message.warning('선택된 내역이 없습니다.'); return; }
    setBatchIds(selected.map(r => r.icamUserId));
  };

  // buildGrid() L119-153
  const columnDefs = useMemo(() => [
    gb.text('companyName', 300, '회사명'),  // L139
    gb.text('userId', 150, '사용자ID'),  // L140
    gb.text('userName', 150, '사용자'),  // L141
    gb.text('email', 150, '이메일'),  // L142
    gb.date('procDate', 90, '권한 정지일'),  // L143
    gb.text('stopMonthPeriod', 150, '권한 정지기간'),  // L144 SQL 계산 컬럼
    // L145 addIcamUserState: 삭제대상은 굵은 빨강, 정지해제는 굵은 파랑, 그 밖은 보통 — 가운데 정렬
    gb.textCenter('state', 150, '상태', {
      cellRenderer: (p: { value?: string | null }) => {
        const v = p.value ?? '';
        if (v === '삭제대상') return <b style={{ color: '#E95749' }}>{v}</b>;
        if (v === '정지해제') return <b style={{ color: '#0019F4' }}>{v}</b>;
        return <span>{v}</span>;
      },
    }),
    gb.date('delDate', 90, '삭제일자'),  // L146
    gb.date('unstopDate', 90, '권한정지<br>해제일자'),  // L147
    gb.text('mngEmpName', 80, '처리자'),  // L148 SQL 계산 컬럼(f_emp_kor_nm)
    gb.text('note', 150, '비고'),  // L149
    // [E4] actionCell (ImageCell "Edit").callbackOnCreate (L126) → Icam55_Edit_UserStopAuth.open(선택 행, callback → retrieve())
    iconCell<IcamStopAuth>('edit', 'actionCell', 50, '변경', row => setEditTarget(row)),  // L150 addCell
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E2] retrieveButton[조회].Select (L104) → retrieve(), [E1] searchText.KeyPress [Enter] (L95) → retrieve() */}
      <SearchBar
        onSearch={() => retrieve()}
        extra={<Button type="save" onClick={openLookupResult}>일괄저장</Button>}
      >
        <SearchBar.Field label="권한정지일">
          <>
            <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
            <span style={{ margin: '0 6px' }}>~</span>
            <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
          </>
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 300 }} placeholder="회사명/사용자ID/사용자명/상태/비고" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
        <Checkbox checked={delTarget} onChange={e => setDelTarget(e.target.checked)}>삭제대상만 조회</Checkbox>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<IcamStopAuth>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.icamUserId)}
        />
      </div>
      <Icam55_Edit_UserStopAuth model={editTarget} onDone={() => { void retrieve(); }} onClose={() => setEditTarget(null)} />
      <Icam55_Lookup_UserStopAuth ids={batchIds} onDone={() => { void retrieve(); }} onClose={() => setBatchIds(null)} />
    </div>
  );
};
