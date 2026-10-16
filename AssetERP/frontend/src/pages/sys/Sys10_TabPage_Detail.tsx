/**
 * 서브도메인 연도·월별 사용용량 (A16) — Sys10_Tab_TotalSize 오른쪽 탭
 * AS-IS: myApp/client/vi/sys/Sys10_TabPage_Detail.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L27-45: 위 연도 그리드 30% / 아래 월 그리드 70% (세로)
 * 부모(Sys10_Tab_TotalSize)가 선택 행이 바뀔 때마다 ref.retrieve(locName)을 부른다 (AS-IS tabPage.retrieve(locName))
 */
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { FileTotalMonth, FileTotalYear } from '@/types/sys';
import { SingleGrid, gbFor } from '@/components/grid';

const gbYear = gbFor<FileTotalYear>();
const gbMonth = gbFor<FileTotalMonth>();

/** AS-IS buildGridYear() */
const buildGridYear = () => [
  gbYear.textCenter('year', 100, '사용연도'),
  gbYear.double('totalSize', 150, '사용용량(MB)'),
];

/** AS-IS buildGridMonth() */
const buildGridMonth = () => [
  gbMonth.textCenter('month', 100, '사용월'),
  gbMonth.double('totalSize', 150, '사용용량(MB)'),
];

export interface Sys10_TabPage_DetailHandle {
  /** AS-IS retrieve(locName) L63-85 — null이면 연도 그리드를 비운다 */
  retrieve: (locName: string | null) => void;
}

// [E0] 화면 열림 (생성자 L27-45) → 초기화 (위 연도 30% / 아래 월 70%, 연도 RowClick 연결)
export const Sys10_TabPage_Detail = forwardRef<Sys10_TabPage_DetailHandle>((_props, ref) => {
  const [years, setYears] = useState<FileTotalYear[]>([]);
  const [months, setMonths] = useState<FileTotalMonth[]>([]);
  const locNameRef = useRef<string | null>(null);
  const yearGridRef = useRef<AgGridReact<FileTotalYear>>(null);
  const yearColumns = useMemo(buildGridYear, []);
  const monthColumns = useMemo(buildGridMonth, []);

  // retrieveMonth() L87-102: locName이 없거나 선택된 연도가 없으면 월 그리드를 비운다
  const retrieveMonth = async (locName: string | null, year: string | null | undefined) => {
    if (locName == null || !year) {
      setMonths([]);
      return;
    }
    try {
      setMonths(await sysApi.searchFileTotalMonths(locName, year));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  const retrieve = async (locName: string | null) => {
    locNameRef.current = locName;
    if (locName == null) {
      setYears([]);
      setMonths([]);
      return;
    }
    try {
      const list = await sysApi.searchFileTotalYears(locName);
      setYears(list);
      // 콜백 L75-82: 첫 행 선택(onRowDataUpdated) → retrieveMonth(locName)
      await retrieveMonth(locName, list[0]?.year);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  useImperativeHandle(ref, () => ({ retrieve }));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9' }}>
      <div style={{ flex: 3, minHeight: 0 }}>
        {/* [E1] gridYear.RowClick (L39) → retrieveMonth() */}
        <SingleGrid<FileTotalYear>
          gridRef={yearGridRef}
          rowData={years}
          columnDefs={yearColumns}
          getRowId={p => String(p.data.fileId)}
          onRowDataUpdated={e => e.api.getDisplayedRowAtIndex(0)?.setSelected(true, true)}
          onRowClicked={e => retrieveMonth(locNameRef.current, e.data?.year)}
        />
      </div>
      <div style={{ flex: 7, minHeight: 0 }}>
        <SingleGrid<FileTotalMonth>
          rowData={months}
          columnDefs={monthColumns}
          getRowId={p => String(p.data.fileId)}
        />
      </div>
    </div>
  );
});
Sys10_TabPage_Detail.displayName = 'Sys10_TabPage_Detail';
