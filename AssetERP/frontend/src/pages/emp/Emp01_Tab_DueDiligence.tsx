/**
 * [1324] 경영관리 > 20. 대외보고서 > 인력현황 (T19)
 * AS-IS: myApp/client/vi/emp/Emp01_Tab_DueDiligence.java (79줄, 새 원본 IDMS-IC) + Emp01_Rd_DueDiligence(RD 영역) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 생성자 L29-60: north(높이 50, 여백 20/20/0/20) = 툴바(기준일자 [조회]), center(여백 0/22/20/20) = RD 영역. 기준일자 기본 = 올해 1월 1일.
 * 스타일: SR (page-style.md, T18에서 등록) UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useEffect, useRef, useState } from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { SearchBar } from '@/components/search';
import { Emp01_Rd_DueDiligence, DueDiligenceRdHandle } from './Emp01_Rd_DueDiligence';

const DATE = 'YYYY-MM-DD';

export const Emp01_Tab_DueDiligence: React.FC = () => {
  // 기준일자 기본 = 올해 yyyy-01-01 (L46)
  const [stdDate, setStdDate] = useState(() => dayjs().startOf('year'));
  const rdRef = useRef<DueDiligenceRdHandle>(null);

  // retrieve() L62-68: companyId + getstdDate()(yyyy-MM-dd) → rdForm.retrieve(param)
  const retrieve = () => rdRef.current?.retrieve({ stdDate: stdDate.format(DATE) });

  // [E0] 화면 열림 (생성자 L29-60) → retrieve() — 열 때 한 번 조회한다 (L59)
  useEffect(() => { void retrieve(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, background: '#fff', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E1] retrieveButton[조회].Select (L39) → retrieve() */}
      <SearchBar onSearch={() => void retrieve()}>
        <SearchBar.Field label="기준일자">
          <DatePicker style={{ width: 110 }} allowClear={false} value={stdDate} onChange={d => d && setStdDate(d)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Emp01_Rd_DueDiligence ref={rdRef} />
      </div>
    </div>
  );
};
