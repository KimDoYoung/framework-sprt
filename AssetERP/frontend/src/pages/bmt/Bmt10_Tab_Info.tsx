/**
 * [1161] 고유자산 > 30. 고유자산 현황 > 전산장비관리 (W18)
 * AS-IS: myApp/client/vi/bmt/Bmt10_Tab_Info.java (258줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L56-85: 가운데(여백 20) = 툴바 50(기준일자 100 · 구분 150 · 검색 200 "장비명/취득정보/세부사양/비고" · ☑폐기건 포함 · [조회][등록]) + 그리드(SingleGrid, 행번호)
 *   그리드 L186-200: 장비명 200 · 매입일자 90 · 폐기일자 90(빨강) · 취득금액 100 · 취득정보 180 · 세부사양 350 · 비고 300 · 사용자 100 · 수정 40 · History 60 · 연관문서 60 (아이콘 3개)
 * 하위 창: 편집창 Bmt10_Edit_Info · 상세이력 Bmt10_Lookup_History(+ Bmt11_TabPage_History·Bmt12_Edit_PcHistory·Bmt10_Lookup_InfoList) · 연관문서 Bmt20_Lookup_RelateAppr
 * 스타일: SGP (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 조건 4개라 초기화(UX-02) 포함
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import dayjs from 'dayjs';
import { bmtInfoApi } from '@/api/bmt';
import { errorMessage } from '@/api/client';
import { BmtInfo } from '@/types/bmt';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { BmtItemClassCombo } from './bmtItemClassCombo';
import { Bmt10_Edit_Info, BmtInfoEditTarget } from './Bmt10_Edit_Info';
import { Bmt10_Lookup_History, BmtHistoryTarget } from './Bmt10_Lookup_History';
import { Bmt20_Lookup_RelateAppr } from './Bmt20_Lookup_RelateAppr';

const gb = gbFor<BmtInfo>();
const DATE = 'YYYY-MM-DD';

export const Bmt10_Tab_Info: React.FC = () => {
  const gridRef = useRef<AgGridReact<BmtInfo>>(null);
  // settings() L87-137: 기준일자 = 오늘, 구분 = 전체, 검색 빈칸, "폐기건 포함" 켜짐 (초기화 UX-02도 이 값으로)
  const sp = useSearchParams(() => ({ baseDate: dayjs(), itemClass: undefined as string | undefined, searchText: '', checkYn: true }));
  const { baseDate, itemClass, searchText, checkYn } = sp.values;
  const [rows, setRows] = useState<BmtInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<BmtInfoEditTarget | null>(null);
  const [historyTarget, setHistoryTarget] = useState<BmtHistoryTarget | null>(null);
  const [relateInfoId, setRelateInfoId] = useState<number | null>(null);

  // retrieve() L202-225: bmt.Bmt10_Info.selectByCompanyId(companyId는 서버, itemClassCode(없으면 "%"), baseDate, checkYn, searchText = "%" + 글자 + "%" — 서버가 감싼다)
  const retrieve = useCallback(async (over?: { itemClass?: string }) => {
    const v = sp.current.current;
    setLoading(true);
    try {
      setRows(await bmtInfoApi.search({
        itemClassCode: over && 'itemClass' in over ? over.itemClass : v.itemClass,
        baseDate: v.baseDate.format(DATE), checkYn: v.checkYn, searchText: v.searchText,
      }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [sp.current]);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E0] 화면 열림 (생성자 L56-85) → settings(): 구분 콤보를 읽은 뒤 retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, []);

  // selectRetrieve(infoId) L227-239: bmt.Bmt10_Info.selectByBaseDate(infoId, baseDate) → 그 행만 갈아 끼운다(수정·이력 창을 닫은 뒤)
  const selectRetrieve = async (infoId: number) => {
    try {
      const row = await bmtInfoApi.get(infoId, sp.current.current.baseDate.format(DATE));
      setRows(prev => prev.map(r => (r.infoId === infoId ? row : r)));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E4] insertButton[등록].Select (L131) → insert() L241-249: Bmt10_Edit_Info.insert(callback → retrieve())
  const insert = () => setEditTarget({ row: null });

  // Bmt10_Edit_Info callback.execute(): 새로 등록하면 retrieve(), 수정하면 selectRetrieve(infoId) — 삭제하면 그 행을 목록에서 뺀다
  const onEditDone = (infoId: number, kind: 'save' | 'delete', isNew: boolean) => {
    if (kind === 'delete') { setRows(prev => prev.filter(r => r.infoId !== infoId)); return; }
    if (isNew) void retrieve();
    else void selectRetrieve(infoId);
  };

  // buildGrid() L140-200
  const columnDefs = useMemo(() => [
    gb.text('astClassTreeName', 200, '장비명'),  // L187
    gb.date('applyDate', 90, '매입일자'),  // L188
    gb.date('retireDate', 90, '폐기일자', { cellStyle: { color: '#CE4242' } }),  // L189 (글자색 CE4242)
    gb.long('acqAmount', 100, '취득금액'),  // L190
    gb.textArea('acqInfo', 180, '취득정보'),  // L191
    gb.textArea('spec', 350, '세부사양'),  // L192
    gb.textArea('note', 300, '비고'),  // L193
    gb.textCenter('personName', 100, '사용자'),  // L194
    // [E6] editCell (ImageCell "Edit").callbackOnCreate (L176) → Bmt10_Edit_Info.open(고른 행, callback → selectRetrieve(infoId))
    iconCell<BmtInfo>('edit', 'editAction', 40, '수정', row => setEditTarget({ row })),  // L195
    // [E5] historyCell (ImageCell "Detail").callbackOnCreate (L153) → Bmt10_Lookup_History.open(infoId, 장비명, callback → selectRetrieve(infoId))
    iconCell<BmtInfo>('view', 'historyAction', 60, 'History', row => setHistoryTarget({ infoId: row.infoId, astClassTreeName: row.astClassTreeName })),  // L196
    // relateAprCell (ImageCell "Detail") → Bmt20_Lookup_RelateAppr.open(infoId)
    iconCell<BmtInfo>('view', 'relateAction', 60, '연관문서', row => setRelateInfoId(row.infoId)),  // L197
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E3] retrieveButton[조회].Select (L125) → retrieve(), [E2] searchText.KeyPress [Enter] (L116) → retrieve() */}
      <SearchBar
        onSearch={() => retrieve()}
        onReset={sp.reset}
        loading={loading}
        extra={<Button type="register" onClick={insert}>등록</Button>}
      >
        <SearchBar.Field label="기준일자">
          <DatePicker style={{ width: 120 }} allowClear={false} value={baseDate} onChange={d => d && sp.set('baseDate', d)} />
        </SearchBar.Field>
        <SearchBar.Field label="구분">
          {/* [E1] itemClassName[sys.Sys00_Common.selectByKindCode].Collapse (L107) → retrieve() */}
          <BmtItemClassCombo value={itemClass} onChange={code => { sp.set('itemClass', code); void retrieve({ itemClass: code }); }} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 200 }} placeholder="장비명/취득정보/세부사양/비고" value={searchText} onChange={e => sp.set('searchText', e.target.value)} />
        </SearchBar.Field>
        <Checkbox checked={checkYn} onChange={e => sp.set('checkYn', e.target.checked)}>폐기건 포함</Checkbox>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<BmtInfo> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.infoId)} />
      </div>
      <Bmt10_Edit_Info target={editTarget} onClose={() => setEditTarget(null)} onDone={onEditDone} />
      <Bmt10_Lookup_History
        target={historyTarget}
        onClosed={() => { if (historyTarget) void selectRetrieve(historyTarget.infoId); }}
        onClose={() => setHistoryTarget(null)}
      />
      <Bmt20_Lookup_RelateAppr infoId={relateInfoId} onClose={() => setRelateInfoId(null)} />
    </div>
  );
};
