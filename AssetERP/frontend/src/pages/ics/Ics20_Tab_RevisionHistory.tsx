/**
 * [1256] 준법감시 > 00. 법규정보 > 법규개정내역 (H05)
 * AS-IS: myApp/client/vi/ics/Ics20_Tab_RevisionHistory.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L68-117: 위 = 툴바(등록일·시행일 선택 · 기간 · 소관부처 120 · 통합검색 300 · 조문검색 200 · [조회]) + 그리드(행번호, 체크박스 단일),
 *   아래 = Ics20_Edit_RevisionHistory (보기 폼). 관리자용 짝(Ics20_Tab_RevisionHistoryAdmin)과 달리 [등록]이 없다
 * UX보강(10): 툴바 = SearchBar(UX-01·04, 초기화 UX-02는 줄바꿈이 늘어 넣지 않는다)
 * 스타일: SGEF (docs/page-style.md) — 폼 안에 보조 그리드가 있는 변형
 */
import React, { useEffect, useRef, useState } from 'react';
import { DatePicker, message, Radio, Splitter } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import dayjs from 'dayjs';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsRevisionHistoryAdmin } from '@/types/ics';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Ics20_Edit_RevisionHistory } from './Ics20_Edit_RevisionHistory';

const gb = gbFor<IcsRevisionHistoryAdmin>();
const ALL = '%';  // financeAgencyComboBox: "전체" 또는 "%"

/** AS-IS buildGrid() 그리드: 등록일·의견제출일·시행일 90 · 법규명 470 · 조문 470 · 소관부처 100 · 법규반영일 90 · 연결법규 60 · 첨부파일 60 */
const columnDefs = [
  gb.date('regDate', 90, '등록일'),
  gb.date('submissionDate', 90, '의견제출일'),
  gb.date('effectDate', 90, '시행일'),
  gb.text('title', 470, '법규명'),
  gb.text('relatedLaw', 470, '조문'),
  gb.text('financeAgencyName', 100, '소관부처'),
  gb.date('reflectionDate', 90, '법규반영일'),
  gb.longCenter('icsCount', 60, '연결법규'),
  gb.longCenter('fileCount', 60, '첨부파일'),
];

export const Ics20_Tab_RevisionHistory: React.FC = () => {
  const gridRef = useRef<AgGridReact<IcsRevisionHistoryAdmin>>(null);
  /** 조회 뒤 그리드가 행을 채우면 선택할 개정내역 */
  const keepId = useRef<number | null>(null);
  // [E0] 화면 열림 (생성자 L68-117) → settings() L119-172: 등록일 선택, 기간 = (올해 1월 1일 − 24개월) ~ 오늘, 소관부처 전체, 검색어 빈칸
  const [dateType, setDateType] = useState<'reg' | 'effect'>('reg');
  const [startDate, setStartDate] = useState(() => dayjs().startOf('year').subtract(24, 'month'));
  const [closeDate, setCloseDate] = useState(() => dayjs());
  const [financeAgencyCode, setFinanceAgencyCode] = useState(ALL);
  const [searchText, setSearchText] = useState('');
  const [relatedLawSearchText, setRelatedLawSearchText] = useState('');
  const [rows, setRows] = useState<IcsRevisionHistoryAdmin[]>([]);
  const [selected, setSelected] = useState<IcsRevisionHistoryAdmin | null>(null);
  /** 조회마다 보기 폼을 다시 만든다 (AS-IS retrieveEditPage → editPage.retrieve(model)) */
  const [formSeq, setFormSeq] = useState(0);

  // [E1] grid.SelectionChanged [선택>0] (L109) → retrieveEditPage() L193-204: 선택 행이 있으면 editPage.retrieve(model)
  const retrieveEditPage = (row: IcsRevisionHistoryAdmin | undefined) => {
    if (!row) return;
    setSelected(row);
    setFormSeq(n => n + 1);
  };

  // retrieve() L206-231: 서비스 ics.Ics20_RevisionHistory.selectByDate (소관부처 전체는 %, 검색어·조문은 서버가 %…%로 만든다) → 콜백: 첫 행 선택
  const retrieve = async () => {
    try {
      const list = await icsApi.searchRevisionPeriod({
        startDate: startDate.format('YYYY-MM-DD'),
        closeDate: closeDate.format('YYYY-MM-DD'),
        financeAgencyCode,
        searchText,
        relatedLawSearchText,
        dateType,
      });
      keepId.current = list[0]?.revisionHistoryId ?? null;
      gridRef.current?.api?.deselectAll();  // 같은 행이 다시 선택돼도 보기 폼을 다시 읽도록
      setRows(list);
      if (list.length === 0) setSelected(null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  const retrieveRef = useRef(retrieve);
  retrieveRef.current = retrieve;
  useEffect(() => { void retrieveRef.current(); }, []);

  // [E5 생략] messageBox.DialogHide (L236) → deleteSelectedRow(): 이 탭의 deleteRow()는 어디서도 부르지 않는다(삭제 버튼 없음) — 죽은 코드

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
      <Splitter.Panel min={200}>
      <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', padding: '20px 20px 8px', gap: 8 }}>
        {/* [E4] retrieveButton[조회].Select (L166) → retrieve() */}
        <SearchBar onSearch={retrieve}>
          <Radio.Group value={dateType} onChange={e => setDateType(e.target.value)}>
            <Radio value="reg">등록일</Radio>
            <Radio value="effect">시행일</Radio>
          </Radio.Group>
          <DatePicker style={{ width: 140 }} allowClear={false} value={startDate} onChange={setStartDate} format="YYYY-MM-DD" />
          ~
          <DatePicker style={{ width: 140 }} allowClear={false} value={closeDate} onChange={setCloseDate} format="YYYY-MM-DD" />
          <SearchBar.Field label="소관부처">
            <SystemCodeComboBox kindCd="FinanceAgencyCode" altCode={[ALL, '전체']} style={{ width: 120 }} value={financeAgencyCode} onChange={c => setFinanceAgencyCode(c ?? ALL)} />
          </SearchBar.Field>
          <SearchBar.Field label="통합검색">
            {/* [E2] searchText.KeyPress [Enter] (L147) → retrieve() */}
            <SearchBar.Input style={{ width: 300 }} placeholder="소관부처/법규명/비고" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="조문검색">
            {/* [E3] relatedLawSearchText.KeyPress [Enter] (L158) → retrieve() */}
            <SearchBar.Input style={{ width: 200 }} placeholder="관련조문" value={relatedLawSearchText} onChange={e => setRelatedLawSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<IcsRevisionHistoryAdmin>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.revisionHistoryId)}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            onSelect={retrieveEditPage}
            onRowDataUpdated={e => {
              if (keepId.current != null) e.api.getRowNode(String(keepId.current))?.setSelected(true, true);
            }}
          />
        </div>
      </div>
      </Splitter.Panel>
      {/* 보기 폼 높이 400(Ics20_Edit_RevisionHistory). 이보다 작으면 아래가 가려진다 */}
      <Splitter.Panel defaultSize={400} min={400}>
        <Ics20_Edit_RevisionHistory key={`${selected?.revisionHistoryId ?? 'none'}-${formSeq}`} model={selected} />
      </Splitter.Panel>
      </Splitter>
    </div>
  );
};
