/**
 * 연관 내부통제 목록 (E04) — Ics10_Tab_ChecklistAdmin 오른쪽·Ics10_Edit_Checklist의 "내부통제" 칸. ics·sch 도메인이 쓰는 공통 부품(IM-02)
 * AS-IS: myApp/client/vi/sch/Sch05_Page_RelateIcs.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 그리드 buildGrid() L31-46: 단순 그리드(행번호), 법규명 410 · 주기 80 · 상세보기 아이콘 60. 행을 눌러 고른 뒤 부르는 쪽이 delete()를 부른다
 */
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { Sch05RelateIcs } from '@/types/sch';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Ics01_Lookup_Info } from './Ics01_Lookup_Info';

const gb = gbFor<Sch05RelateIcs>();
/** 행을 눌러 고른다. 렌더마다 새 객체를 주면 AG Grid가 선택을 지우므로 한 번만 만든다 */
const ROW_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

export interface Sch05_Page_RelateIcsHandle {
  /** retrieve(infoId) L48-58: 없으면 비운다 */
  retrieve: (infoId: number | null) => Promise<void>;
  /** delete() L60-64: 고른 행을 지운다(확인 창 없음) */
  delete: () => Promise<void>;
}

export const Sch05_Page_RelateIcs = forwardRef<Sch05_Page_RelateIcsHandle>((_props, ref) => {
  const [rows, setRows] = useState<Sch05RelateIcs[]>([]);
  const [infoRelate, setInfoRelate] = useState<Sch05RelateIcs | null>(null);
  const gridRef = useRef<AgGridReact<Sch05RelateIcs>>(null);

  // retrieve(infoId) L48-58: 서비스 sch.Sch05_RelateIcs.selectByInfoId
  const retrieve = useCallback(async (infoId: number | null) => {
    if (infoId == null) {
      setRows([]);
      return;
    }
    try {
      setRows(await schApi.searchRelateIcs(infoId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // delete() L60-64: 서비스 sch.Sch05_RelateIcs.delete(고른 행들) → 목록에서 뺀다
  const remove = useCallback(async () => {
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) return;
    try {
      await schApi.deleteRelateIcs(checked.map(r => r.relateIcsId));
      setRows(prev => prev.filter(r => !checked.some(c => c.relateIcsId === r.relateIcsId)));
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  }, []);

  useImperativeHandle(ref, () => ({ retrieve, delete: remove }), [retrieve, remove]);

  const columnDefs = useMemo(() => [
    gb.textArea('icsClassTreeFullName', 410, '법규명'),  // L41
    gb.textArea('cycleName', 80, '주기'),  // L42
    // L43 actionCell(View) → Ics01_Lookup_Info.view(선택한 행)
    iconCell<Sch05RelateIcs>('view', 'actionCell', 60, '상세보기', row => setInfoRelate(row)),
  ], []);

  return (
    <>
      <SingleGrid<Sch05RelateIcs>
        gridRef={gridRef}
        rowData={rows}
        columnDefs={columnDefs}
        getRowId={p => String(p.data.relateIcsId)}
        rowSelection={ROW_SELECTION}
      />
      <Ics01_Lookup_Info relate={infoRelate} onClose={() => setInfoRelate(null)} />
    </>
  );
});
Sch05_Page_RelateIcs.displayName = 'Sch05_Page_RelateIcs';
