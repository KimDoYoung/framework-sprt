/**
 * [1287] 경영관리 > 20. 대외보고서 > 기간별 입퇴사현황 (T18)
 * AS-IS: myApp/client/vi/emp/Emp01_Tab_InoutState.java (126줄, 새 원본 IDMS-IC) + Emp01_Rd_InoutState(RD 영역) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 생성자 L32-101: north(높이 50, 여백 20/20/0/20) = 툴바(조회기간 시작 ~ 끝 [조회]), center(여백 0/22/20/20) = RD 영역. 조회기간 기본 = 오늘 -3개월 ~ 오늘.
 * 스타일: SR (견본 — docs/page-style.md) UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useEffect, useRef, useState } from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { SearchBar } from '@/components/search';
import { Emp01_Rd_InoutState, InoutStateRdHandle } from './Emp01_Rd_InoutState';

const DATE = 'YYYY-MM-DD';

export const Emp01_Tab_InoutState: React.FC = () => {
  // 최근 3개월 조회 (L52-56)
  const [startDate, setStartDate] = useState(() => dayjs().subtract(3, 'month'));
  const [closeDate, setCloseDate] = useState(() => dayjs());
  const rdRef = useRef<InoutStateRdHandle>(null);

  // retrieve() L103-110: companyId + getStartDate()·getCloseDate()(yyyy-MM-dd) → rdForm.retrieve(param)
  const retrieve = () => rdRef.current?.retrieve({ startDate: startDate.format(DATE), closeDate: closeDate.format(DATE) });

  // [E0] 화면 열림 (생성자 L32-101) → retrieve() — 열 때 한 번 조회한다
  useEffect(() => { void retrieve(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, background: '#fff', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E1] retrieveButton[조회].Select (L45) → retrieve() */}
      <SearchBar onSearch={() => void retrieve()}>
        <SearchBar.Field label="조회기간">
          <DatePicker style={{ width: 110 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
          <span style={{ margin: '0 6px' }}>~</span>
          <DatePicker style={{ width: 110 }} allowClear={false} value={closeDate} onChange={d => d && setCloseDate(d)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Emp01_Rd_InoutState ref={rdRef} />
      </div>
    </div>
  );
};
