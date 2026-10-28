/**
 * [1503] 펀드관리 > 02. 펀드관리 > 펀드규약 등록 (P12)
 * AS-IS: myApp/client/vi/fnd/Fnd25_Tab_FundTermsManager.java (239줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L56-87: 왼쪽(45%, 분할, 최소 590·최대 1000) = 툴바(50: 구분 콤보 100 · 검색 220 "펀드규약명/펀드명/예탁원코드" · [조회][등록]) + 규약 그리드(행번호, 체크 없음),
 *   가운데 = 개정 목록(Fnd25_Grid_FundTermsDetail). 규약을 고르면 그 개정을 오른쪽에 보인다
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Splitter } from 'antd';
import type { GridApi } from 'ag-grid-community';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { Terms, TermsRevision } from '@/types/fnd';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Fnd25_Edit_FundTermsManager, TermsEditTarget } from './Fnd25_Edit_FundTermsManager';
import { Fnd25_Grid_FundTermsDetail } from './Fnd25_Grid_FundTermsDetail';
import { Fnd25_Lookup_FundTermsManager } from './Fnd25_Lookup_FundTermsManager';

const gb = gbFor<Terms>();
/** setChecked 주석 처리(L127) → 단일 선택(체크 열 없음). 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_ROW = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

export const Fnd25_Tab_FundTermsManager: React.FC = () => {
  // [E0] 화면 열림 (생성자 L56-87) → settings() L89-123, retrieve()
  const [termsType, setTermsType] = useState('%');   // ComboBoxField("FundTermsType", "%", "전체", "전체")
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<Terms[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Terms | null>(null);
  const [detailTarget, setDetailTarget] = useState<{ terms: Terms; nonce: number } | null>(null);
  const [lookupTarget, setLookupTarget] = useState<Terms | null>(null);
  const [editTarget, setEditTarget] = useState<TermsEditTarget | null>(null);
  const retrieveSeq = useRef(0);
  const nonce = useRef(0);
  /** retrieve() L155-219: 조회 전에 고른 규약(termsId)을 기억했다가 조회 뒤 다시 고른다 — 없으면 첫 행 */
  const savedTermsId = useRef<number | null>(null);
  const termsTypeRef = useRef(termsType);
  termsTypeRef.current = termsType;
  const searchTextRef = useRef(searchText);
  searchTextRef.current = searchText;
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  // [E5] retrieveButton[조회].Select (L111), [E3] searchTextField.KeyPress [Enter] (L93), [E2] fundTermsName 콤보 → retrieve() L155-219: fnd.Fnd26_TermsDetail.selectBySearchText
  const retrieve = useCallback(async (over?: { termsType?: string }) => {
    const my = ++retrieveSeq.current;
    savedTermsId.current = selectedRef.current?.termsId ?? null;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await fndApi.searchTerms({ termsType: over?.termsType ?? termsTypeRef.current, searchText: searchTextRef.current });
      if (my === retrieveSeq.current) setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);
    }
  }, []);

  // [E1] detailGrid (Fnd25_Grid_FundTermsDetail).callbackOnCreate (L37) → retrieve() — 오른쪽 개정 목록이 만들어지면 한 번 조회한다(우리는 열 때 한 번)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, []);

  // 조회가 끝나면(onRowDataUpdated) 기억한 규약을 다시 고르고 없으면 첫 행을 고른다(선택이 바뀌면 아래 onSelectionChanged가 오른쪽을 읽는다) — 목록이 비면 오른쪽도 비운다
  const afterRetrieve = (api: GridApi<Terms>) => {
    api.deselectAll();
    if (api.getDisplayedRowCount() === 0) {
      setSelected(null);
      setDetailTarget(null);
      return;
    }
    let found = false;
    if (savedTermsId.current != null) {
      api.forEachNode(node => {
        if (!found && node.data?.termsId === savedTermsId.current) { node.setSelected(true); found = true; }
      });
    }
    if (!found) api.getDisplayedRowAtIndex(0)?.setSelected(true);
  };

  // [E4] grid.SelectionChanged [선택>0] (L102) → retrieveTabPage() L221-224: detailGrid.retrieve(selectModel)
  const onSelectionChanged = (sel: Terms[]) => {
    if (sel.length === 0) return;
    setSelected(sel[0]);
    setDetailTarget({ terms: sel[0], nonce: ++nonce.current });
  };

  // [E6] insertButton[등록].Select (L117) → insert() L226-234: Fnd25_Edit_FundTermsManager.insertFundTerms() L262-286 — 새 규약: 사용, 새 ID
  const insert = async () => {
    try {
      const termsDetailId = await fndApi.getTermsNextId();
      const model: TermsRevision = { termsDetailId, termsType: null, termsName: null, content: '', note: '', seq: null, useYn: true };
      setEditTarget({ mode: 'insert', model });
    } catch (err) {
      message.error(errorMessage(err, '새 ID를 받지 못했습니다'));
    }
  };

  // buildGrid() L125-153
  const columnDefs = useMemo(() => [
    // [E7] editCell (ImageCell, L132) → Fnd25_Lookup_FundTermsManager.edit(): 고른 규약의 예탁원코드 창
    iconCell<Terms>('edit', 'actionCell', 55, '수정', row => setLookupTarget(row)),
    gb.text('termsTypeName', 80, '구분', {pinned: 'left'}),
    gb.text('termsName', 180, '펀드규약명', {pinned: 'left'}),
    gb.text('ksdFundCode', 120, '예탁원코드'),
    gb.text('fundName', 320, '펀드명'),
    gb.text('trustBankName', 120, '수탁은행'),
    gb.date('fundStartDate', 100, '최초설정일'),
    gb.date('revisionDate', 90, '최종<br>제개정일'),
    gb.longCenter('revisionNo', 70, '최종<br>개정회차'),
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel defaultSize="45%" min={590} max={1000}>
          <div style={{ height: '100%',  boxSizing: 'border-box', display: 'flex', flexDirection: 'column', marginRight: 4 }}>
            <SearchBar
              onSearch={() => retrieve()}
              loading={loading}
              extra={<Button type="register" onClick={insert}>등록</Button>}
            >
              <SearchBar.Field label="구분">
                <SystemCodeComboBox kindCd="FundTermsType" altCode={['%', '전체']} style={{ width: 100 }} value={termsType}
                  onChange={code => { const v = code ?? '%'; setTermsType(v); void retrieve({ termsType: v }); }} />
              </SearchBar.Field>
              <SearchBar.Field label="검색">
                <SearchBar.Input style={{ width: 220 }} placeholder="펀드규약명/펀드명/예탁원코드" value={searchText} onChange={e => setSearchText(e.target.value)} />
              </SearchBar.Field>
            </SearchBar>
            <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
              <SingleGrid<Terms>
                rowData={rows}
                columnDefs={columnDefs}
                getRowId={p => String(p.data.termsId)}
                loading={loading}
                rowSelection={SINGLE_ROW}
                onRowDataUpdated={e => afterRetrieve(e.api)}
                onSelectionChanged={e => onSelectionChanged(e.api.getSelectedRows())}
              />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <Fnd25_Grid_FundTermsDetail target={detailTarget} onChanged={() => void retrieve()} />
        </Splitter.Panel>
      </Splitter>
      <Fnd25_Lookup_FundTermsManager target={lookupTarget} onDone={() => void retrieve()} onClose={() => setLookupTarget(null)} />
      <Fnd25_Edit_FundTermsManager target={editTarget} onDone={() => void retrieve()} onClose={() => setEditTarget(null)} />
    </div>
  );
};
