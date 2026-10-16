/**
 * [1198] 관리자 > 02. 시스템관리 > Admin 로그인내역 조회 (A23)
 * AS-IS: myApp/client/vi/sys/Sys81_Tab_AdminUserHistory.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L38-67: 툴바(조회일자 시작일 ~ 종료일 · 조회) + 그리드(행번호, 체크박스 다중)
 * UX보강(10): 툴바 = SearchBar(UX-01). 조건이 날짜 둘(한 묶음)이라 초기화(UX-02) 없음
 */
import React, { useCallback, useState } from 'react';
import { DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { AdminUserHistory } from '@/types/sys';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<AdminUserHistory>();

/** AS-IS buildGrid() L77-86 */
const columnDefs = [
  gb.date('regDate', 100, '로그인 일자'),  // L80
  gb.textCenter('regTime', 100, '로그인 시간'),  // L81 SQL 계산 컬럼(TO_CHAR(sys81_reg_date, 'HH24:MI'))
  gb.textCenter('user', 200, '사용자 정보'),  // L82
  gb.text('smsContent', 500, 'SMS 수신내용'),  // L83
];

export const Sys81_Tab_AdminUserHistory: React.FC = () => {
  // settings() L69-75: 조회일자 = 올해 1월 1일 ~ 오늘
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [rows, setRows] = useState<AdminUserHistory[]>([]);

  // retrieve() L88-99: 서비스 sys.Sys81_AdminUserHistory.selectByDate(startDate, closeDate)
  const retrieve = useCallback(async () => {
    try {
      setRows(await sysApi.searchAdminUserHistories({ startDate: startDate.format('YYYY-MM-DD'), closeDate: closeDate.format('YYYY-MM-DD') }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [startDate, closeDate]);

  // [E0] 화면 열림 (생성자 L38-67) → settings() — 위 초기값. 원본은 열 때 조회하지 않는다(조회 버튼)

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 20, gap: 8, background: '#fff', boxSizing: 'border-box' }}>
      {/* [E1] retrieveButton[조회].Select (L50) → retrieve() */}
      <SearchBar onSearch={retrieve}>
        <SearchBar.Field label="조회일자">
          <DatePicker style={{ width: 140 }} allowClear={false} value={startDate} onChange={setStartDate} format="YYYY-MM-DD" />
          ~
          <DatePicker style={{ width: 140 }} allowClear={false} value={closeDate} onChange={setCloseDate} format="YYYY-MM-DD" />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<AdminUserHistory>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.adminUserHistoryId)}
        />
      </div>
    </div>
  );
};
