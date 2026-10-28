/**
 * [1504] 펀드관리 > 02. 펀드관리 > 펀드규약 (P13)
 * AS-IS: myApp/client/vi/fnd/Fnd25_Tab_FundTerms.java (154줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L49-72: 여백 20 안의 테두리 박스 = 툴바(50: 구분 콤보 150 · 검색 230 "펀드규약명" · [조회]) + 규약 그리드(행번호, 체크 없음 — 보기 전용)
 * 내용보기 아이콘(viewContent L145-149)은 Fnd25_Lookup_Content(P07, 본문 + 개정 목록 + 첨부)를 연다
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { TermsView } from '@/types/fnd';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Fnd25_Lookup_Content } from '@/components/lookup/Fnd25_Lookup_Content';
import { SearchBar } from '@/components/search';

const gb = gbFor<TermsView>();
/** setChecked 없음 → 단일 선택(체크 열 없음). 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_ROW = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

export const Fnd25_Tab_FundTerms: React.FC = () => {
  // [E0] 화면 열림 (생성자 L49-72) → settings() L74-101, retrieve()
  const [termsType, setTermsType] = useState('%');   // ComboBoxField("FundTermsType", "%", "전체", "전체"), 직접 입력 불가(setEditable(false))
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<TermsView[]>([]);
  const [loading, setLoading] = useState(false);
  const [contentTermsId, setContentTermsId] = useState<number | null>(null);
  const retrieveSeq = useRef(0);
  const searchTextRef = useRef(searchText);
  searchTextRef.current = searchText;

  // [E4] retrieveButton[조회].Select (L95), [E2] searchTextField.KeyPress [Enter] (L77), [E3] fundTermsName[FundTermsType].Collapse (L88) → retrieve() L130-143: fnd.Fnd25_Terms.selectBySearchTextManager (회사, 구분, "%검색어%")
  const retrieve = useCallback(async (over?: { termsType?: string }) => {
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await fndApi.searchTermsView({ termsType: over?.termsType ?? termsType, searchText: searchTextRef.current });
      if (my === retrieveSeq.current) setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);
    }
  }, [termsType]);

  // [E1] fundTermsName (ComboBoxField).callbackOnCreate (L41) → retrieve() — 콤보 코드를 불러오면 조회한다(우리는 열 때 한 번)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, []);

  // buildGrid() L103-128
  const columnDefs = useMemo(() => [
    gb.text('termsTypeName', 150, '구분'),
    gb.text('termsName', 250, '펀드규약명'),
    // viewCell (ImageCell "view") → viewContent() L145-149: Fnd25_Lookup_Content.open(termsId)
    iconCell<TermsView>('view', 'actionCell', 55, '내용보기', row => setContentTermsId(row.termsId)),
    gb.text('ksdFundCode', 120, '예탁원코드'),
    gb.text('fundName', 320, '펀드명'),
    gb.text('trustBankName', 120, '수탁은행'),
    gb.date('fundStartDate', 100, '최초설정일'),
    gb.text('kofiaFundTypeName', 150, '펀드유형'),
    gb.date('revisionDate', 90, '최종<br>제개정일'),
    gb.longCenter('revisionNo', 70, '최종<br>개정회차'),
    gb.date('endExpectDate', 90, '만기일'),
    // L124-125: 비고(350)·첨부파일 갯수(80)는 주석 처리 → 만들지 않음
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%',  boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        <SearchBar onSearch={() => retrieve()} loading={loading}>
          <SearchBar.Field label="구분">
            <SystemCodeComboBox kindCd="FundTermsType" altCode={['%', '전체']} style={{ width: 150 }} value={termsType}
              onChange={code => { const v = code ?? '%'; setTermsType(v); void retrieve({ termsType: v }); }} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 230 }} placeholder="펀드규약명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
          <SingleGrid<TermsView>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.termsId)}
            loading={loading}
            rowSelection={SINGLE_ROW}
          />
        </div>
      </div>
      <Fnd25_Lookup_Content termsId={contentTermsId} onClose={() => setContentTermsId(null)} />
    </div>
  );
};
