/**
 * [1306] 관리자 > 01. 고객관리 > 고객별 서버사용량 (A16)
 * AS-IS: myApp/client/vi/sys/Sys10_Tab_TotalSize.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L37-64: 왼쪽 center(여백 20, 최대 1000) = 툴바(조회 · 사용고객만 보기) + 고객 그리드, 오른쪽 east(폭 500) = Sys10_TabPage_Detail
 * 스타일: GDP (docs/page-style.md)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, message, Splitter } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { FileTotal } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { Sys10_TabPage_Detail, Sys10_TabPage_DetailHandle } from './Sys10_TabPage_Detail';

const gb = gbFor<FileTotal>();

/** AS-IS buildGrid() */
const buildGrid = () => [
  gb.text('companyNm', 250, '회사'),
  gb.text('locNm', 80, '서브도메인'),
  gb.double('runningTotalSize', 200, '누적사용용량(MB)'),
];

export const Sys10_Tab_TotalSize: React.FC = () => {
  const [useYn, setUseYn] = useState(true);  // settings(): useYnBox = true("사용고객만 보기")
  const [rows, setRows] = useState<FileTotal[]>([]);
  const gridRef = useRef<AgGridReact<FileTotal>>(null);
  const detailRef = useRef<Sys10_TabPage_DetailHandle>(null);
  const columnDefs = useMemo(buildGrid, []);

  // retrieveTabPage() L112-119: 선택 행이 있으면 tabPage.retrieve(locName), 없으면 retrieve(null)
  const retrieveTabPage = () => {
    detailRef.current?.retrieve(gridRef.current?.api.getSelectedRows()[0]?.locNm ?? null);
  };

  // retrieve() L94-110: 서비스 sys.Sys10_File.selectByTotalSize(useYn) → 첫 행 선택 → retrieveTabPage()
  const retrieve = useCallback(async () => {
    try {
      const list = await sysApi.searchFileTotals(useYn);
      setRows(list);
      // 콜백: grid.getStore().get(0)이 있으면 select(0)
      setTimeout(() => {
        gridRef.current?.api.getDisplayedRowAtIndex(0)?.setSelected(true, true);
        retrieveTabPage();
      });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [useYn]);

  // [E0] 화면 열림 (생성자 L37-64) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  return (
    <Splitter style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel max={1000} min={300}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 20, boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 50, flex: 'none' }}>
            {/* [E1] retrieveButton[조회].Select (L70) → retrieve() */}
            <Button type="search" onClick={retrieve}>조회</Button>
            <Checkbox checked={useYn} onChange={e => setUseYn(e.target.checked)}>사용고객만 보기</Checkbox>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            {/* [E2] grid.RowClick (L76) → retrieveTabPage() */}
            <SingleGrid<FileTotal>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.fileId)}
              rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
              onRowClicked={retrieveTabPage}
            />
          </div>
        </div>
      </Splitter.Panel>
      <Splitter.Panel defaultSize={540} min={300}>
        <div style={{ height: '100%', padding: '20px 20px 20px 0', boxSizing: 'border-box' }}>
          <Sys10_TabPage_Detail ref={detailRef} />
        </div>
      </Splitter.Panel>
    </Splitter>
  );
};
