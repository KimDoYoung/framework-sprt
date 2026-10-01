import React, { useCallback, useEffect, useState } from 'react';
import { Button, Checkbox, Space, Splitter, Typography, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { sysApi } from '../../api/sys';
import { errorMessage } from '../../api/client';
import { FileUsage, FileUsagePeriod } from '../../types/sys';

const mb = { type: 'rightAligned', valueFormatter: (p: { value: number | null }) => (p.value == null ? '' : p.value.toLocaleString()) };
const usageCols: ColDef<FileUsage>[] = [
  { field: 'companyNm', headerName: '회사', flex: 1, minWidth: 200 },
  { field: 'locNm', headerName: '서브도메인', width: 110 },
  { field: 'totalSize', headerName: '누적사용용량(MB)', width: 170, ...mb },
];
const yearCols: ColDef<FileUsagePeriod>[] = [
  { field: 'period', headerName: '사용연도', width: 100, cellStyle: { textAlign: 'center' } },
  { field: 'totalSize', headerName: '사용용량(MB)', flex: 1, ...mb },
];
const monthCols: ColDef<FileUsagePeriod>[] = [
  { field: 'period', headerName: '사용월', width: 100, cellStyle: { textAlign: 'center' } },
  { field: 'totalSize', headerName: '사용용량(MB)', flex: 1, ...mb },
];

/** 고객별 서버사용량 (AS-IS client/vi/sys/Sys10_Tab_TotalSize + Sys10_TabPage_Detail). 읽기 전용, KFS 관리자 전용 */
export const Sys10TotalSizeView: React.FC = () => {
  const [useYn, setUseYn] = useState(true);
  const [usages, setUsages] = useState<FileUsage[]>([]);
  const [usage, setUsage] = useState<FileUsage>();
  const [years, setYears] = useState<FileUsagePeriod[]>([]);
  const [months, setMonths] = useState<FileUsagePeriod[]>([]);
  const [loading, setLoading] = useState(false);

  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setUsages(await sysApi.searchFileUsage(useYn));
    } catch (err) {
      message.error(errorMessage(err, '사용량 조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [useYn]);

  useEffect(() => { retrieve(); }, [retrieve]);

  // 회사를 고르면 연도별, 연도를 고르면 월별 (AS-IS: 첫 연도 자동 선택)
  useEffect(() => {
    setMonths([]);
    if (!usage) { setYears([]); return; }
    sysApi.searchFileUsageByYear(usage.locNm).then(setYears).catch(err => message.error(errorMessage(err, '연도별 조회 실패')));
  }, [usage]);

  const selectYear = (year?: FileUsagePeriod) => {
    if (!usage || !year) { setMonths([]); return; }
    sysApi.searchFileUsageByMonth(usage.locNm, year.period).then(setMonths)
      .catch(err => message.error(errorMessage(err, '월별 조회 실패')));
  };

  return (
    <Splitter style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel min="40%" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space wrap>
          <Button type="primary" onClick={retrieve}>조회</Button>
          <Checkbox checked={useYn} onChange={e => setUseYn(e.target.checked)}>사용고객만 보기</Checkbox>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <AgGridReact<FileUsage> rowData={usages} loading={loading} columnDefs={usageCols} getRowId={p => p.data.locNm}
            rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
            onRowDataUpdated={e => e.api.getDisplayedRowAtIndex(0)?.setSelected(true)}
            onSelectionChanged={e => setUsage(e.api.getSelectedRows()[0])} />
        </div>
      </Splitter.Panel>
      <Splitter.Panel defaultSize={320} min={240} style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Typography.Text strong>{usage ? `${usage.companyNm} 사용량` : '사용량'}</Typography.Text>
        <div style={{ flex: 1, minHeight: 0 }}>
          <AgGridReact<FileUsagePeriod> rowData={years} columnDefs={yearCols} getRowId={p => p.data.period}
            rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
            onRowDataUpdated={e => e.api.getDisplayedRowAtIndex(0)?.setSelected(true)}
            onSelectionChanged={e => selectYear(e.api.getSelectedRows()[0])} />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <AgGridReact<FileUsagePeriod> rowData={months} columnDefs={monthCols} getRowId={p => p.data.period} />
        </div>
      </Splitter.Panel>
    </Splitter>
  );
};
