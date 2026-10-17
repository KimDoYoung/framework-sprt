/**
 * [1257] 기초자료 > 00. 내부통제 > 법규개정내역 등록 (E03)
 * AS-IS: myApp/client/vi/ics/Ics20_Tab_RevisionHistoryAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L70-120: center = 툴바(등록일·시행일 선택 · 기간 · 소관부처 120 · 통합검색 300 · 조문검색 200 · [조회][등록]) + 그리드(행번호, 체크박스 단일),
 *   south = Ics20_Edit_RevisionHistoryAdmin (편집 폼)
 * UX보강(10): 툴바 = SearchBar(UX-01·04, 초기화 UX-02는 줄바꿈이 늘어 넣지 않는다)
 */
import React, { useEffect, useRef, useState } from 'react';
import { DatePicker, message, Radio } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import dayjs from 'dayjs';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsRevisionHistoryAdmin } from '@/types/ics';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Ics20_Edit_RevisionHistoryAdmin } from './Ics20_Edit_RevisionHistoryAdmin';

const gb = gbFor<IcsRevisionHistoryAdmin>();
const ALL = '%';  // financeAgencyComboBox: "전체" 또는 "%"

/** AS-IS buildGrid() L182-198 (사전예고일·내용 열은 주석 처리되어 없다) */
const columnDefs = [
  gb.date('regDate', 90, '등록일'),  // L185
  gb.date('submissionDate', 90, '의견제출일'),  // L187
  gb.date('effectDate', 90, '시행일'),  // L188
  gb.date('reflectionDate', 90, '법규반영일'),  // L189
  gb.text('financeAgencyName', 100, '소관부처'),  // L190
  gb.text('title', 470, '법규명'),  // L191
  gb.text('relatedLaw', 470, '조문'),  // L192
  gb.longCenter('icsCount', 60, '연결법규'),  // L194
  gb.longCenter('fileCount', 60, '첨부파일'),  // L195
];

export const Ics20_Tab_RevisionHistoryAdmin: React.FC = () => {
  const gridRef = useRef<AgGridReact<IcsRevisionHistoryAdmin>>(null);
  /** 조회 뒤 그리드가 행을 채우면 선택할 개정내역 */
  const keepId = useRef<number | null>(null);
  const tempSeq = useRef(0);
  // settings() L122-180: 등록일 선택, 기간 = (올해 1월 1일 − 24개월) ~ 오늘, 소관부처 전체, 검색어 빈칸
  const [dateType, setDateType] = useState<'reg' | 'effect'>('reg');
  const [startDate, setStartDate] = useState(() => dayjs().startOf('year').subtract(24, 'month'));
  const [closeDate, setCloseDate] = useState(() => dayjs());
  const [financeAgencyCode, setFinanceAgencyCode] = useState(ALL);
  const [searchText, setSearchText] = useState('');
  const [relatedLawSearchText, setRelatedLawSearchText] = useState('');
  const [rows, setRows] = useState<IcsRevisionHistoryAdmin[]>([]);
  const [selected, setSelected] = useState<IcsRevisionHistoryAdmin | null>(null);
  /** 선택·조회마다 편집 폼을 다시 만든다 (AS-IS retrieveEditPage → editDriver.edit(model)) */
  const [formSeq, setFormSeq] = useState(0);

  // [E1] grid.SelectionChanged [선택>0] (L112) → retrieveEditPage() L200-211: 선택 행이 있으면 editPage.retrieve(model)
  const retrieveEditPage = (row: IcsRevisionHistoryAdmin | undefined) => {
    if (!row) return;
    setSelected(row);
    setFormSeq(n => n + 1);
  };

  // retrieve() L220-245: 서비스 ics.Ics20_RevisionHistory.selectByDate (소관부처 전체는 %, 검색어·조문은 서버가 %…%로 만든다) → 콜백: 첫 행 선택
  const retrieve = async () => {
    try {
      const list = await icsApi.searchRevisionHistoryAdmin({
        startDate: startDate.format('YYYY-MM-DD'),
        closeDate: closeDate.format('YYYY-MM-DD'),
        financeAgencyCode,
        searchText,
        relatedLawSearchText,
        dateType,
      });
      keepId.current = list[0]?.revisionHistoryId ?? null;
      gridRef.current?.api?.deselectAll();  // 같은 행이 다시 선택돼도 편집 폼을 다시 읽도록
      setRows(list);
      if (list.length === 0) setSelected(null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L70-120) → settings(). 소관부처 콤보가 코드를 다 읽으면 callback → retrieve()
  const retrieveRef = useRef(retrieve);
  retrieveRef.current = retrieve;
  useEffect(() => { void retrieveRef.current(); }, []);

  // [E4] insertButton[등록].Select (L168) → insertRow() L213-218: 등록일이 오늘인 새 행을 그리드에 넣고(저장 안 함) 선택한다. 새 id는 서버가 저장할 때 채번(임시 음수)
  const insertRow = () => {
    const row: IcsRevisionHistoryAdmin = { revisionHistoryId: --tempSeq.current, regDate: dayjs().format('YYYY-MM-DD') };
    keepId.current = row.revisionHistoryId;
    setRows(prev => [row, ...prev]);
  };

  // [E6 생략] messageBox.DialogHide (L250) → deleteSelectedRow() L262-273: 이 탭의 deleteRow()(L247)는 어디서도 부르지 않는다(탭에 삭제 버튼이 없고 삭제는 편집 폼의 [삭제]) — 죽은 코드

  // Ics20_Edit_RevisionHistoryAdmin.updateRow → GridUpdate: 저장한 행으로 그리드 행을 바꾸고 선택한다
  const onSaved = (saved: IcsRevisionHistoryAdmin, prevId: number) => {
    keepId.current = saved.revisionHistoryId;
    setRows(prev => prev.map(r => (r.revisionHistoryId === prevId ? saved : r)));
    setSelected(saved);
    if (saved.revisionHistoryId === prevId) gridRef.current?.api?.getRowNode(String(prevId))?.setSelected(true, true);
  };

  // Ics20_Edit_RevisionHistoryAdmin.delete(): 폼을 비우고 그리드에서 행을 뺀다
  const onDeleted = (revisionHistoryId: number) => {
    keepId.current = null;
    setRows(prev => prev.filter(r => r.revisionHistoryId !== revisionHistoryId));
    setSelected(null);
    setFormSeq(n => n + 1);
  };

  // Ics20_Lookup_Content 콜백: note.setValue(model.getNote()); grid.getStore().update(model)
  const onNoteSaved = (revisionHistoryId: number, note: string) => {
    setRows(prev => prev.map(r => (r.revisionHistoryId === revisionHistoryId ? { ...r, note } : r)));
    setSelected(prev => (prev && prev.revisionHistoryId === revisionHistoryId ? { ...prev, note } : prev));
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '20px 20px 8px', gap: 8 }}>
        {/* [E5] retrieveButton[조회].Select (L174) → retrieve(). 초기화(UX-02)는 조건 5개가 한 줄을 넘겨 넣지 않는다 */}
        <SearchBar
          onSearch={retrieve}
          extra={
            <>
              {/* [E4] insertButton[등록].Select (L168) → insertRow() */}
              <Button type="register" onClick={insertRow}>등록</Button>
            </>
          }
        >
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
            {/* [E2] searchText.KeyPress [Enter] (L150) → retrieve() */}
            <SearchBar.Input style={{ width: 300 }} placeholder="소관부처/법규명/비고" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="조문검색">
            {/* [E3] relatedLawSearchText.KeyPress [Enter] (L160) → retrieve() */}
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
      <div style={{ flex: 'none', height: 400, borderTop: '1px solid #d9d9d9' }}>
        <Ics20_Edit_RevisionHistoryAdmin
          key={`${selected?.revisionHistoryId ?? 'none'}-${formSeq}`}
          model={selected}
          onSaved={onSaved}
          onDeleted={onDeleted}
          onNoteSaved={onNoteSaved}
        />
      </div>
    </div>
  );
};
