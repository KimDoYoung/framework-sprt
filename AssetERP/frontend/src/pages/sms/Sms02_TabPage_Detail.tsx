/**
 * 서브도메인 연도·월별 사용량 (C05) — Sms02_Tab_TotalCount 오른쪽 탭
 * AS-IS: myApp/client/vi/sms/Sms02_TabPage_Detail.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L27-45: 위 연도 그리드 30% / 아래 월 그리드 70% (세로)
 * 부모(Sms02_Tab_TotalCount)가 선택 행이 바뀔 때마다 ref.retrieve(locName)을 부른다 (AS-IS tabPage.retrieve(locName))
 */
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { smsApi } from '@/api/sms';
import { errorMessage } from '@/api/client';
import { SmsHistoryMonth, SmsHistoryYear } from '@/types/sms';
import { SingleGrid, gbFor } from '@/components/grid';

const gbYear = gbFor<SmsHistoryYear>();
const gbMonth = gbFor<SmsHistoryMonth>();

/** AS-IS buildGridYear() L47-54 */
const buildGridYear = () => [
  gbYear.textCenter('year', 100, '사용연도'),  // L49
  gbYear.long('totalCount', 100, '사용건수'),  // L50
  gbYear.long('totalPayCount', 100, '사용금액'),  // L51
];

/** AS-IS buildGridMonth() L56-63 */
const buildGridMonth = () => [
  gbMonth.textCenter('month', 100, '사용월'),  // L58
  gbMonth.long('totalCount', 100, '사용건수'),  // L59
  gbMonth.long('totalPayCount', 100, '사용금액'),  // L60
];

export interface Sms02_TabPage_DetailHandle {
  /** AS-IS retrieve(locName) L65-87 — null이면 연도 그리드를 비운다 */
  retrieve: (locName: string | null) => void;
}

// [E0] 화면 열림 (생성자 L27-45) → 초기화 (위 연도 30% / 아래 월 70%, 연도 RowClick 연결)
export const Sms02_TabPage_Detail = forwardRef<Sms02_TabPage_DetailHandle>((_props, ref) => {
  const [years, setYears] = useState<SmsHistoryYear[]>([]);
  const [months, setMonths] = useState<SmsHistoryMonth[]>([]);
  const yearGridRef = useRef<AgGridReact<SmsHistoryYear>>(null);
  const locNameRef = useRef<string | null>(null);
  const yearColumns = useMemo(buildGridYear, []);
  const monthColumns = useMemo(buildGridMonth, []);

  // retrieveMonth() L89-104: locName이 없거나 선택된 연도가 없으면 월 그리드를 비운다
  const retrieveMonth = async (locName: string | null, year: string | null | undefined) => {
    if (locName == null || !year) {
      setMonths([]);
      return;
    }
    try {
      setMonths(await smsApi.searchHistoryMonths(locName, year));
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
      const list = await smsApi.searchHistoryYears(locName);
      setYears(list);
      // 콜백 L77-84: 첫 행 선택(onRowDataUpdated) → retrieveMonth(locName)
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
        <SingleGrid<SmsHistoryYear>
          gridRef={yearGridRef}
          rowData={years}
          columnDefs={yearColumns}
          getRowId={p => String(p.data.historyId)}
          onRowDataUpdated={e => e.api.getDisplayedRowAtIndex(0)?.setSelected(true, true)}
          onRowClicked={e => retrieveMonth(locNameRef.current, e.data?.year)}
        />
      </div>
      <div style={{ flex: 7, minHeight: 0 }}>
        <SingleGrid<SmsHistoryMonth>
          rowData={months}
          columnDefs={monthColumns}
          getRowId={p => String(p.data.historyId)}
        />
      </div>
    </div>
  );
});
Sms02_TabPage_Detail.displayName = 'Sms02_TabPage_Detail';
