/**
 * [1292] 기초자료 > 30. 자산&경영 > 금감원 업무보고서 (E19)
 * AS-IS: myApp/client/vi/rpt/Rpt10_Tab_FssSubmit.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 settings() L75-122: 툴바(검색 250 빈칸 "보고서코드" · 조회 · 등록 · 삭제) + 체크박스 다중 그리드
 *   (보고서코드 100 · 보고서명 180 · 제출주기 100 · 작성대상 220 · 작성요령 500 · 개정연혁 400 · 수정 80[아이콘])
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 1개라 그리지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { rptApi } from '@/api/rpt';
import { errorMessage } from '@/api/client';
import { RptFssSubmit } from '@/types/rpt';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { Rpt10_Edit_WriteGuide } from './Rpt10_Edit_WriteGuide';

const gb = gbFor<RptFssSubmit>();

/** addTextLimitArea: 줄바꿈을 유지하고 높이 300에서 자른다 (읽기 전용) */
const textLimitArea = (field: keyof RptFssSubmit & string, width: number, header: string) => ({
  ...gb.text(field, width, header),
  autoHeight: true,
  cellRenderer: (p: { value?: string | null }) =>
    p.value ? <div style={{ maxHeight: 300, overflow: 'hidden', whiteSpace: 'pre-wrap', lineHeight: '20px', padding: '4px 0' }}>{p.value}</div> : ' ',
});

export const Rpt10_Tab_FssSubmit: React.FC = () => {
  const gridRef = useRef<AgGridReact<RptFssSubmit>>(null);
  const [rows, setRows] = useState<RptFssSubmit[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  /** view() = {}, edit(model) = 그 행 */
  const [editModel, setEditModel] = useState<Partial<RptFssSubmit> | null>(null);

  // retrieve() L155-168: rpt.Rpt10_FssSubmit.selectBySearchText("%검색어%")
  const retrieve = async (text = searchText) => {
    setLoading(true);  // grid.mask("Loading")
    try {
      setRows(await rptApi.searchFssSubmits(text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  };

  // [E0] 화면 열림 (생성자 L48-73) → settings(), retrieve()
  useEffect(() => { void retrieve(''); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // buildGrid() L124-153
  const columnDefs = useMemo(() => [
    gb.textCenter('reportCode', 100, '보고서코드'),  // L144
    gb.text('reportName', 180, '보고서명'),  // L145
    gb.textCenter('submitCycleName', 100, '제출주기'),  // L146
    gb.text('writeTarget', 220, '작성대상'),  // L147
    textLimitArea('writeGuide', 500, '작성요령'),  // L148 addTextLimitArea
    textLimitArea('reviseHistory', 400, '개정연혁'),  // L149 addTextLimitArea
    // L150 addCell(Edit) → Rpt10_Edit_WriteGuide.edit(고른 행, 닫히면 retrieve())
    iconCell<RptFssSubmit>('edit', 'actionCell', 80, '수정', row => setEditModel(row)),
  ], []);

  // [E4] deleteButton[삭제].Select [YES] (L99) → 확인창 "확인" "N건의 내용을 삭제하시겠습니까?"(310) → [E5] msgBox.DialogHide [YES] (L104) → deleteRow() L180-189
  //   (선택 없이 삭제하면 안내만 — 05 §8 사용자 결정 2026-10-12)
  const deleteRow = () => {
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) {
      message.warning('삭제할 행을 선택하세요.');
      return;
    }
    Modal.confirm({
      title: '확인',
      content: `${checked.length}건의 내용을 삭제하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 310,
      onOk: async () => {
        try {
          await rptApi.deleteFssSubmits(checked.map(r => r.submitId));
          setRows(prev => prev.filter(r => !checked.some(c => c.submitId === r.submitId)));
          message.success('삭제되었습니다.');
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E2] retrieveButton[조회].Select (L87), [E1] searchText.KeyPress [Enter] (L79) → retrieve() */}
      <SearchBar onSearch={() => retrieve()} loading={loading} extra={
        <>
          {/* [E3] insertButton[등록].Select (L93) → insertRow() L170-178: Rpt10_Edit_WriteGuide.view(닫히면 retrieve()) */}
          <Button type="register" onClick={() => setEditModel({})}>등록</Button>
          <Button type="delete" onClick={deleteRow}>삭제</Button>
        </>
      }>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 250 }} placeholder="보고서코드" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<RptFssSubmit> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} loading={loading} getRowId={p => String(p.data.submitId)} />
      </div>
      <Rpt10_Edit_WriteGuide model={editModel} onSaved={() => { void retrieve(); }} onClose={() => setEditModel(null)} />
    </div>
  );
};
