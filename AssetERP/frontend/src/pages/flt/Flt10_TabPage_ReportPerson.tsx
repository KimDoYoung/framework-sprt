/**
 * 매월신고대상임직원 (J08) — 책임자보고 `Flt10_Tab_CeoReport`의 두 번째 탭
 * AS-IS: myApp/client/vi/flt/Flt10_TabPage_ReportPerson.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L24-28: center = grid 하나(체크박스 다중). 부모가 retrieve(말일, 1일, 재직구분 코드)를 부른다.
 */
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { AgGridReact } from 'ag-grid-react';
import { fltApi } from '@/api/flt';
import { FltCeoReportPerson, FltCeoTabHandle } from '@/types/flt';
import { MultiGrid, gbFor } from '@/components/grid';

const gb = gbFor<FltCeoReportPerson>();

export const Flt10_TabPage_ReportPerson = forwardRef<FltCeoTabHandle>((_props, ref) => {
  const gridRef = useRef<AgGridReact<FltCeoReportPerson> | null>(null);
  const [rows, setRows] = useState<FltCeoReportPerson[]>([]);

  // [E0] 화면 열림 (생성자 L24-28) → 초기화

  // buildGrid01() L30-38
  const columnDefs = useMemo(() => [
    gb.textCenter('personName', 80, '이름'),  // L33
    gb.text('orgName', 150, '소속'),  // L34
    gb.date('apprEffectDate', 90, '신고일자'),  // L35 (원본 100 → UX-08)
  ], []);

  // retrieve() L40-64: 서비스 flt.Flt10_Tr.selectByStdDate(companyId, stdDate, startDate, transCode) → 끝나면 첫 행 선택
  useImperativeHandle(ref, () => ({
    retrieve: async (stdDate, startDate, transCode) => {
      setRows(await fltApi.searchCeoReportPersons(stdDate, startDate, transCode));
      setTimeout(() => gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
    },
  }), []);

  return (
    <MultiGrid<FltCeoReportPerson>
      gridRef={gridRef}
      rowData={rows}
      columnDefs={columnDefs}
      getRowId={p => String(p.data.trId)}
    />
  );
});
Flt10_TabPage_ReportPerson.displayName = 'Flt10_TabPage_ReportPerson';
