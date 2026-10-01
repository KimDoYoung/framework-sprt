import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, DatePicker, Input, Space, Tabs, Typography, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import dayjs, { Dayjs } from 'dayjs';
import { empApi } from '../../api/emp';
import { errorMessage } from '../../api/client';
import { TransHistory } from '../../types/emp';
import { PendingScreenView } from '../../components/PendingScreenView';

/**
 * 사원정보 변경조회 (AS-IS Emp00_Tab_ChangeHistory). 일반발령 탭만 변환 —
 * 자격사항(Emp08_License)·상벌내역(Emp11_Reward)은 AS-IS에도 서버 메서드가 없다.
 */
export const Emp00ChangeHistoryView: React.FC = () => {
  const [range, setRange] = useState<[Dayjs, Dayjs]>([dayjs().subtract(12, 'month'), dayjs()]);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<TransHistory[]>([]);
  const [loading, setLoading] = useState(false);

  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await empApi.searchTransHistory(range[0].format('YYYY-MM-DD'), range[1].format('YYYY-MM-DD'), searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [range, searchText]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  const columnDefs = useMemo<ColDef<TransHistory>[]>(() => [
    { field: 'transDate', headerName: '발령일', width: 110 },
    { field: 'korNm', headerName: '성명', width: 100, cellStyle: { textAlign: 'center' } },
    { field: 'transNm', headerName: '발령구분', width: 90, cellStyle: { textAlign: 'center' } },
    { field: 'kindNm', headerName: '사원구분', width: 90, cellStyle: { textAlign: 'center' } },
    { field: 'orgNm', headerName: '발령조직', width: 200 },
    { field: 'titleNm', headerName: '발령직책', width: 100 },
    { field: 'posNm', headerName: '발령직위', width: 100 },
    { field: 'gradeNm', headerName: '특정직위', width: 100 },
    { field: 'orgHeadYn', headerName: '조직장', width: 80, valueFormatter: p => (p.value ? 'Y' : 'N'), cellStyle: { textAlign: 'center' } },
    { field: 'transReason', headerName: '비고', flex: 1, minWidth: 200 },
  ], []);

  const trans = (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Space wrap>
        <Typography.Text strong>조회기간</Typography.Text>
        <DatePicker.RangePicker value={range} allowClear={false} onChange={v => v && v[0] && v[1] && setRange([v[0], v[1]])} />
        <Typography.Text strong>검색</Typography.Text>
        <Input style={{ width: 150 }} placeholder="성명" value={searchText} allowClear onChange={e => setSearchText(e.target.value)} onPressEnter={retrieve} />
        <Button type="primary" onClick={retrieve}>조회</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact<TransHistory> rowData={rows} loading={loading} columnDefs={columnDefs} getRowId={p => String(p.data.transId)} />
      </div>
    </div>
  );

  return (
    <div style={{ height: '100%', padding: 12, background: '#fff' }}>
      <Tabs
        style={{ height: '100%' }}
        items={[
          { key: 'trans', label: '일반발령', children: <div style={{ height: 'calc(100vh - 260px)' }}>{trans}</div> },
          { key: 'license', label: '자격사항', children: <PendingScreenView title="자격사항" classNm="Emp08_License (AS-IS 서버 없음)" /> },
          { key: 'reward', label: '상벌내역', children: <PendingScreenView title="상벌내역" classNm="Emp11_Reward (AS-IS 서버 없음)" /> },
        ]}
      />
    </div>
  );
};
