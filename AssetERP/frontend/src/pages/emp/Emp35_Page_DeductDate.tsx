/**
 * 급여공제 날짜 목록 + 편집 폼 (C01-3 → S28에서 파일 분리) — AS-IS: myApp/client/vi/emp/Emp35_Page_DeductDate.java (175줄) = Emp35_TabPage_DeductDate.java와 같은 본문
 * 레이아웃(settings() L43-95): 위 툴바 50(조회·등록) / 왼쪽 날짜 목록 15% + 오른쪽 Emp35_TabPage_DeductInsert 85%
 * C01 하위 탭(`Emp35_TabPage_DeductDate`: 사원정보 선택 행의 personId)·급여공제정보 화면(`Emp35_Tab_DeductPerson`: 위 그리드 선택 행의 personId)이 같이 쓴다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { empApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { Deduct } from '@/types/emp';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { Emp35_Popup_DeductCreate } from './Emp35_Popup_DeductCreate';
import { Emp35_TabPage_DeductInsert } from './Emp35_TabPage_DeductInsert';

const gb = gbFor<Deduct>();

/** settings() L53-64: grid.addColumn(startDate) — buildGrid() L97-102 */
const buildGrid = () => [
  gb.date('startDate', 190, '적용시작일'),
];

export const Emp35_Page_DeductDate: React.FC<{ personId: number | null | undefined }> = ({ personId }) => {
  const gridRef = useRef<AgGridReact<Deduct>>(null);
  const [rows, setRows] = useState<Deduct[]>([]);
  const [selectedDeduct, setSelectedDeduct] = useState<Deduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const columnDefs = useMemo(buildGrid, []);

  // [E0] 생성자 → settings(), retrieve() → 첫 행 선택
  // [E1] retrieveButton[조회].Select (L52) → retrieve() L116-130
  const retrieve = useCallback(async () => {
    if (!personId) { setRows([]); setSelectedDeduct(null); return; }
    setLoading(true);
    try {
      const list = await empApi.getDeducts(personId);
      setRows(list);
      setSelectedDeduct(list.length > 0 ? list[0] : null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [personId]);

  useEffect(() => { retrieve(); }, [retrieve]);

  // [E3] grid.SelectionChanged (L88) → retrievePage() L132-140: 선택 행을 폼에 전달
  const onSelect = (deduct: Deduct | undefined) => setSelectedDeduct(deduct ?? null);

  // [E2] insertButton[등록].Select (L58) → insert() L142-150: 팝업 열기
  const insert = () => setCreateOpen(true);

  // Emp35_Popup_DeductCreate 콜백: 목록 갱신
  const onCreated = () => retrieve();

  // DeductInsertForm 콜백: 저장 후 그리드 행 갱신
  const onDeductSaved = (saved: Deduct) => {
    setRows(prev => prev.map(r => (r.deductId === saved.deductId ? saved : r)));
    setSelectedDeduct(saved);
  };

  // DeductInsertForm 콜백: 삭제 후 그리드에서 제거
  const onDeductDeleted = () => {
    if (!selectedDeduct) return;
    setRows(prev => prev.filter(r => r.deductId !== selectedDeduct.deductId));
    setSelectedDeduct(null);
  };

  return (
    // AS-IS settings() L44-96: HorizontalLayoutContainer 0.15 / 0.85 — 고정 비율(분할 아님. 화면은 2단까지 — 05 §6)
    <div style={{ height: '100%', display: 'flex' }}>
      {/* 좌 15%: 날짜 목록 */}
      <div style={{ width: '15%', minWidth: 120, flex: 'none' }}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 4, padding: '8px 4px', boxSizing: 'border-box' }}>
          <Space size="small">
            {/* [E1] */}
            <Button type="search" onClick={retrieve}>조회</Button>
            {/* [E2] */}
            <Button type="register" onClick={insert} disabled={!personId}>등록</Button>
          </Space>
          <div style={{ flex: 1, minHeight: 0 }}>
            <SingleGrid<Deduct>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              loading={loading}
              getRowId={p => String(p.data.deductId)}
              onSelect={onSelect}
            />
          </div>
        </div>
      </div>

      {/* 우 85%: DeductInsert 폼 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Emp35_TabPage_DeductInsert
          deduct={selectedDeduct}
          onSaved={onDeductSaved}
          onDeleted={onDeductDeleted}
        />
      </div>

      <Emp35_Popup_DeductCreate
        open={createOpen}
        personId={personId ?? undefined}
        onClose={() => setCreateOpen(false)}
        onCreated={onCreated}
      />
    </div>
  );
};
