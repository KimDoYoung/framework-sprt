/**
 * [1487] 경영관리 > 06. 근태관리 > 근태현황(관리자) (T08)
 * AS-IS: myApp/client/vi/att/Att02_Tab_CommuteStatus.java (224줄) + Att02_Edit_InOutReason(T06) + Emp00_Lookup_SelectSingle(공용) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L58-113: 가운데(여백 20, 테두리) = 툴바(근무일자 ◀ {날짜} ▶ · 검색 200 "사원번호/사원명/본부(부서)" · 사원 100 "전체" · [조회]) + 근태현황 그리드(SingleGrid, 11열)
 * 스타일: SGP (견본 docs/page-style/SGP/Chk02_Tab_DailyList.tsx — 편집 버튼은 없고 사유 아이콘이 읽기 전용 창을 연다)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건 3개이나 [조회] 외 버튼이 없어도 공간이 모자라 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { attApi } from '@/api/att';
import { errorMessage } from '@/api/client';
import { AttCommuteStatus } from '@/types/att';
import { SingleGrid, gbFor } from '@/components/grid';
import { dynamicIconCell } from '@/components/grid/iconCell';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { SearchBar } from '@/components/search';
import { Att02_Edit_InOutReason } from './Att02_Edit_InOutReason';

const gb = gbFor<AttCommuteStatus>();
const DATE = 'YYYY-MM-DD';

export const Att02_Tab_CommuteStatus: React.FC = () => {
  // settings() L115-170: 근무일자 = 오늘, 검색어·사원 빈칸("전체")
  const [baseDate, setBaseDate] = useState(() => dayjs().format(DATE));
  const [searchText, setSearchText] = useState('');
  const [empName, setEmpName] = useState('');
  const [personId, setPersonId] = useState<number | null>(null);
  const [rows, setRows] = useState<AttCommuteStatus[]>([]);
  const [empOpen, setEmpOpen] = useState(false);
  const [reasonTarget, setReasonTarget] = useState<AttCommuteStatus | null>(null);

  // retrieve() L200-215: att.Att02_Commute.getCommuteStatus(searchText "%…%"(서버), companyId(서버), personId, baseDate)
  const retrieve = useCallback(async (over?: { baseDate?: string }) => {
    try {
      setRows(await attApi.searchCommuteStatus({ baseDate: over?.baseDate ?? baseDate, searchText, personId }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [baseDate, searchText, personId]);

  // [E0] 화면 열림 (생성자 L58-113) → settings(), setIconStyle(), retrieve()
  useEffect(() => { void retrieve(); }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  // [E1]·[E2] anchor01(◀)·anchor02(▶).MouseDown (L64·L76) → 근무일자 -1일/+1일 → retrieve()
  const moveDay = (days: number) => {
    const next = dayjs(baseDate).add(days, 'day').format(DATE);
    setBaseDate(next);
    void retrieve({ baseDate: next });
  };

  // buildGrid() L172-198
  const columnDefs = useMemo(() => [
    gb.textCenter('statusName', 150, '상태'),
    // addDynamicCell: 출퇴근 사유가 있는 행만 보기 아이콘 → Att02_Edit_InOutReason(읽기 전용)
    dynamicIconCell<AttCommuteStatus>('view', 'inOutReason', 35, '', row => setReasonTarget(row), row => row.inOutReasonYnStr != null),
    gb.textCenter('personNo', 100, '사원번호'),
    gb.textCenter('personName', 100, '사원명'),
    gb.text('orgName', 160, '본부(부서)'),
    gb.textCenter('posName', 80, '직위'),
    gb.textCenter('calcCheckInTimeStr', 100, '출근시간'),
    gb.textCenter('calcCheckOutTimeStr', 100, '퇴근시간'),
    gb.textCenter('baseWorkTimeStr', 120, '기본근로'),
    gb.textCenter('overtimeWorkTimeStr', 120, '연장근무'),
    gb.textCenter('nightWorkTimeStr', 120, '야간근무'),
  ], []);

  const arrow: React.CSSProperties = { cursor: 'pointer', userSelect: 'none', color: 'inherit', textDecoration: 'none' };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E7] retrieveButton[조회].Select (L164) → retrieve(), [E4] searchText.KeyPress [Enter] (L126) → retrieve() */}
      <SearchBar onSearch={() => retrieve()}>
        <SearchBar.Field label="근무일자">
          <a style={arrow} onMouseDown={() => moveDay(-1)}>◀</a>
          {/* [E3] baseDate.ValueChange (L118) → retrieve() */}
          <DatePicker style={{ width: 125, margin: '0 6px' }} allowClear={false} format={DATE} value={dayjs(baseDate)}
            onChange={d => { if (d) { const v = d.format(DATE); setBaseDate(v); void retrieve({ baseDate: v }); } }} />
          <a style={arrow} onMouseDown={() => moveDay(1)}>▶</a>
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 200 }} placeholder="사원번호/사원명/본부(부서)" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
        <SearchBar.Field label="사원">
          {/* [E5] empKorName.TriggerClick (L137) → Emp00_Lookup_SelectSingle.open([전체]=null) · [E6] empKorName.Change (L156) → 비면 personId null (읽기 전용 칸이라 x 단추로 지운다) */}
          <LookupInput width={100} value={empName} placeholder="전체" onOpen={() => setEmpOpen(true)} onClear={() => { setEmpName(''); setPersonId(null); }} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<AttCommuteStatus> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.commuteId)} />
      </div>
      <Att02_Edit_InOutReason target={reasonTarget} onClose={() => setReasonTarget(null)} />
      <Emp00_Lookup_SelectSingle
        open={empOpen}
        transDate={dayjs().format(DATE)}
        onResult={row => {
          setEmpOpen(false);
          if (row) { setEmpName(row.korNm ?? ''); setPersonId(row.personId); } else { setEmpName(''); setPersonId(null); }
        }}
        onClose={() => setEmpOpen(false)}
      />
    </div>
  );
};
