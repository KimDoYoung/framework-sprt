/**
 * [1305] 관리자 > 01. 고객관리 > 고객별 문자사용량 (C05)
 * AS-IS: myApp/client/vi/sms/Sms02_Tab_TotalCount.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L39-66: 왼쪽 center(여백 20, 최대 1000) = 툴바(조회 · 사용고객만 보기) + 고객 그리드, 오른쪽 east(폭 500) = Sms02_TabPage_Detail
 * 스타일: GDP (견본 — docs/page-style.md)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, message, Splitter } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { smsApi } from '@/api/sms';
import { errorMessage } from '@/api/client';
import { SmsHistoryTotal } from '@/types/sms';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Sms02_TabPage_Detail, Sms02_TabPage_DetailHandle } from './Sms02_TabPage_Detail';
import { Sms02_Lookup_History } from './Sms02_Lookup_History';

const gb = gbFor<SmsHistoryTotal>();

/** AS-IS buildGrid() L86-104 */
const buildGrid = (openHistory: (r: SmsHistoryTotal) => void) => [
  gb.text('companyNm', 250, '회사'),  // L98
  gb.text('locNm', 80, '서브도메인'),  // L99
  gb.long('runningTotalCount', 200, '누적사용건수'),  // L100
  // L101 addCell(actionCell, 80, "발신기록", ImageCell("View")) → Sms02_Lookup_History.open(companyId)
  iconCell<SmsHistoryTotal>('view', 'actionCell', 80, '발신기록', openHistory),
];

export const Sms02_Tab_TotalCount: React.FC = () => {
  const [useYn, setUseYn] = useState(true);  // settings() L68-84: useYnBox = true("사용고객만 보기")
  const [rows, setRows] = useState<SmsHistoryTotal[]>([]);
  const [historyCompanyId, setHistoryCompanyId] = useState<number>();
  const gridRef = useRef<AgGridReact<SmsHistoryTotal>>(null);
  const detailRef = useRef<Sms02_TabPage_DetailHandle>(null);
  const columnDefs = useMemo(() => buildGrid(r => setHistoryCompanyId(r.companyId)), []);

  // retrieveTabPage() L124-131: 선택 행이 있으면 tabPage.retrieve(locName), 없으면 retrieve(null)
  const retrieveTabPage = () => {
    detailRef.current?.retrieve(gridRef.current?.api.getSelectedRows()[0]?.locNm ?? null);
  };

  // retrieve() L106-122: 서비스 sms.Sms02_History.selectByTotalCount(useYn) → 첫 행 선택 → retrieveTabPage()
  const retrieve = useCallback(async () => {
    try {
      const list = await smsApi.searchHistoryTotals(useYn);
      setRows(list);
      // 콜백 L115-119: grid.getStore().get(0)이 있으면 select(0)
      setTimeout(() => {
        gridRef.current?.api.getDisplayedRowAtIndex(0)?.setSelected(true, true);
        retrieveTabPage();
      });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [useYn]);

  // [E0] 화면 열림 (생성자 L39-66) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  return (
    <>
    <Splitter style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel max={1000} min={300}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 20, boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 50, flex: 'none' }}>
            {/* [E1] retrieveButton[조회].Select (L72) → retrieve() */}
            <Button type="search" onClick={retrieve}>조회</Button>
            <Checkbox checked={useYn} onChange={e => setUseYn(e.target.checked)}>사용고객만 보기</Checkbox>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            {/* [E2] grid.RowClick (L78) → retrieveTabPage() */}
            <SingleGrid<SmsHistoryTotal>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.companyId)}
              rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
              onRowClicked={retrieveTabPage}
            />
          </div>
        </div>
      </Splitter.Panel>
      <Splitter.Panel defaultSize={540} min={300}>
        <div style={{ height: '100%', padding: '20px 20px 20px 0', boxSizing: 'border-box' }}>
          <Sms02_TabPage_Detail ref={detailRef} />
        </div>
      </Splitter.Panel>
    </Splitter>
    {/* 발신기록 아이콘(buildGrid L86-96) → Sms02_Lookup_History.open(companyId) */}
    <Sms02_Lookup_History open={historyCompanyId != null} companyId={historyCompanyId} onClose={() => setHistoryCompanyId(undefined)} />
    </>
  );
};
