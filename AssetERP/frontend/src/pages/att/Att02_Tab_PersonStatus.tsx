/**
 * [1492] 경영관리 > 06. 근태관리 > 근태현황 (T09)
 * AS-IS: myApp/client/vi/att/Att02_Tab_PersonStatus.java (154줄) + Att02_Edit_InOutReason(T06) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L46-70: 가운데(여백 20, 테두리) = 툴바(근무일자 {시작=이달 1일} ~ {종료=오늘} · [조회]) + 내 근태현황 그리드(SingleGrid, 12열). 로그인 사원 본인의 기간 근태
 * 스타일: SGP (견본 docs/page-style/SGP/Chk02_Tab_DailyList.tsx — 사유 아이콘이 읽기 전용 창을 연다)
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import { attApi } from '@/api/att';
import { errorMessage } from '@/api/client';
import { AttCommuteStatus } from '@/types/att';
import { SingleGrid, gbFor } from '@/components/grid';
import { dynamicIconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { Att02_Edit_InOutReason } from './Att02_Edit_InOutReason';

const gb = gbFor<AttCommuteStatus>();
const DATE = 'YYYY-MM-DD';

export const Att02_Tab_PersonStatus: React.FC = () => {
  // settings() L72-90: 시작 = 이달 1일, 종료 = 오늘
  const [startDate, setStartDate] = useState(() => dayjs().startOf('month').format(DATE));
  const [closeDate, setCloseDate] = useState(() => dayjs().format(DATE));
  const [rows, setRows] = useState<AttCommuteStatus[]>([]);
  const [reasonTarget, setReasonTarget] = useState<AttCommuteStatus | null>(null);

  // retrieve() L120-135: att.Att02_Commute.getPersonStatus(companyId·personId(로그인 사원)는 서버, startDate, closeDate)
  const retrieve = useCallback(async (over?: { closeDate?: string }) => {
    try {
      setRows(await attApi.searchPersonStatus({ startDate, closeDate: over?.closeDate ?? closeDate }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [startDate, closeDate]);

  // [E0] 화면 열림 (생성자 L46-70) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  // buildGrid() L92-118
  const columnDefs = useMemo(() => [
    gb.date('workDate', 100, '근무일자'),
    gb.textCenter('dayOfWeek', 50, '요일'),
    gb.textCenter('dateInfo', 100, '구분'),
    gb.textCenter('statusName', 150, '상태'),
    // addDynamicCell: 출퇴근 사유가 있는 행만 보기 아이콘 → Att02_Edit_InOutReason(읽기 전용)
    dynamicIconCell<AttCommuteStatus>('view', 'inOutReason', 35, '', row => setReasonTarget(row), row => row.inOutReasonYnStr != null),
    gb.textCenter('checkInTimeStr', 100, '출근시간'),
    gb.textCenter('checkOutTimeStr', 100, '퇴근시간'),
    gb.textCenter('calcCheckInTimeStr', 100, '출근시간'),
    gb.textCenter('calcCheckOutTimeStr', 100, '퇴근시간'),
    gb.textCenter('baseWorkTimeStr', 120, '기본근로'),
    gb.textCenter('overtimeWorkTimeStr', 120, '연장근무'),
    gb.textCenter('nightWorkTimeStr', 120, '야간근무'),
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E2] retrieveButton[조회].Select (L84) → retrieve() */}
      <SearchBar onSearch={() => retrieve()}>
        <SearchBar.Field label="근무일자">
          <DatePicker style={{ width: 125 }} allowClear={false} format={DATE} value={dayjs(startDate)} onChange={d => d && setStartDate(d.format(DATE))} />
          <span style={{ margin: '0 6px' }}>~</span>
          {/* [E1] closeDate.ValueChange (L78) → retrieve() */}
          <DatePicker style={{ width: 125 }} allowClear={false} format={DATE} value={dayjs(closeDate)}
            onChange={d => { if (d) { const v = d.format(DATE); setCloseDate(v); void retrieve({ closeDate: v }); } }} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<AttCommuteStatus> rowData={rows} columnDefs={columnDefs} getRowId={p => p.data.workDate ?? String(p.data.commuteId)} />
      </div>
      <Att02_Edit_InOutReason target={reasonTarget} onClose={() => setReasonTarget(null)} />
    </div>
  );
};
