/**
 * [1411] 책무 > 01. 기본정보 > 임원 등록 (N04)
 * AS-IS: myApp/client/vi/tdm/Tdm01_Tab_Hr.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L40-65: 가운데(여백 20, 테두리) = 툴바(검색 임원명/직위/조직명 200 · 퇴사자 제외 · [조회] · [인사정보 가져오기]) + 임원 그리드(SingleGrid)
 * 함께: Tdm01_Lookup_HrChangeInfo(인사정보 가져오기 창), Tdm03_Lookup_AddTitle(직무겸직 창, 그리드의 편집 아이콘)
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Checkbox, message } from 'antd';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmHr } from '@/types/tdm';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Tdm01_Lookup_HrChangeInfo } from './Tdm01_Lookup_HrChangeInfo';
import { Tdm03_Lookup_AddTitle } from './Tdm03_Lookup_AddTitle';

const gb = gbFor<TdmHr>();

export const Tdm01_Tab_Hr: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [exceptRetire, setExceptRetire] = useState(true);   // settings() L68-69: 퇴사자 제외 기본 체크
  const [rows, setRows] = useState<TdmHr[]>([]);
  const [lookupChange, setLookupChange] = useState(false);
  const [addTitlePerson, setAddTitlePerson] = useState<TdmHr | null>(null);

  // retrieve() L121-135: tdm.Tdm01_Hr.selectByCompanyId (companyId는 서버, exceptRetireYn, searchText = '%' + 글자 + '%' — 서버가 감싼다)
  const retrieve = async () => {
    try {
      setRows(await tdmApi.searchHrs(exceptRetire, searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L40-65) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  // buildGrid() L96-119
  const columnDefs = useMemo(() => [
    gb.textCenter('personName', 150, '임원명'),  // L107
    gb.text('posName', 150, '직위'),  // L108
    gb.text('orgName', 250, '본부(부서)'),  // L109
    gb.date('hireDate', 100, '입사일'),  // L110
    gb.date('retireDate', 100, '퇴사일'),  // L111
    gb.date('endDate', 100, '책무대상<br>종료일'),  // L112
    gb.text('addTitle', 250, '직무겸직'),  // L113
    // L114 addCell(ImageCell("Edit")) → lookupAddTitle() L147-157: 선택한 임원의 직무겸직 창
    iconCell<TdmHr>('edit', 'addTitleEdit', 40, '', row => setAddTitlePerson(row)),
    gb.textCenter('updName', 100, '등록(변경)자'),  // L115
    gb.textCenter('updDateStr', 150, '등록(변경)일시'),  // L116
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L82) → retrieve() */}
        <SearchBar
          onSearch={retrieve}
          extra={
            // [E3] getHrButton[인사정보 가져오기].Select (L88) → lookupChangeHr() L137-145
            <Button type="register" onClick={() => setLookupChange(true)}>인사정보 가져오기</Button>
          }
        >
          <SearchBar.Field label="검색">
            {/* [E1] searchText.KeyPress [Enter] (L73) → retrieve() */}
            <SearchBar.Input style={{ width: 200 }} placeholder="임원명/직위/조직명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <Checkbox checked={exceptRetire} onChange={e => setExceptRetire(e.target.checked)}>퇴사자 제외</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<TdmHr> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.hrId)} />
        </div>
      </div>
      {/* 적용·창 닫기 뒤 retrieve() (lookup.open(callback) → retrieve()) */}
      <Tdm01_Lookup_HrChangeInfo open={lookupChange} onApplied={() => void retrieve()} onClose={() => setLookupChange(false)} />
      <Tdm03_Lookup_AddTitle person={addTitlePerson} onClose={() => { setAddTitlePerson(null); void retrieve(); }} />
    </div>
  );
};
