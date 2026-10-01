import React, { useCallback, useEffect, useState } from 'react';
import { Button, DatePicker, Select, Space, Typography, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import dayjs, { Dayjs } from 'dayjs';
import { sysApi } from '../../api/sys';
import { errorMessage } from '../../api/client';
import { LoginHistory, SysCompany } from '../../types/sys';
import { CodeSelect } from '../../components/common/CodeSelect';

const cols: ColDef<LoginHistory>[] = [
  { field: 'openDate', headerName: '접속일시', width: 180, cellStyle: { textAlign: 'center' } },
  { field: 'companyNm', headerName: '회사명', width: 200 },
  { field: 'personNm', headerName: '성명', width: 150 },
  { field: 'statusNm', headerName: '상태구분', width: 150 },
  { field: 'loginModeNm', headerName: '접속경로', width: 90, cellStyle: { textAlign: 'center' } },
  { field: 'ipAddress', headerName: 'IP 주소', width: 150 },
  { field: 'os', headerName: 'OS', width: 150 },
  { field: 'browser', headerName: 'Browser', flex: 1, minWidth: 200 },
];

/** 로그인내역 조회 (AS-IS client/vi/sys/Sys26_Tab_LoginHistory). KFS 관리자 전용, 읽기 전용 (AS-IS 삭제 버튼은 화면에 붙어 있지 않았다) */
export const Sys26LoginHistoryView: React.FC = () => {
  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const [closeDate, setCloseDate] = useState<Dayjs>(dayjs());
  const [loginMode, setLoginMode] = useState<string>();
  const [companyId, setCompanyId] = useState(0); // 0 = 전체
  const [companies, setCompanies] = useState<SysCompany[]>([]);
  const [rows, setRows] = useState<LoginHistory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sysApi.searchCompanies(undefined, 'true').then(setCompanies).catch(err => message.error(errorMessage(err, '회사 조회 실패')));
  }, []);

  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await sysApi.searchLoginHistories({
        startDate: startDate.format('YYYY-MM-DD'), closeDate: closeDate.format('YYYY-MM-DD'),
        companyId: companyId === 0 ? undefined : companyId, loginMode,
      }));
    } catch (err) {
      message.error(errorMessage(err, '로그인내역 조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [startDate, closeDate, companyId, loginMode]);

  // 탭 진입 시 오늘 조회
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 12, background: '#fff' }}>
      <Space wrap>
        <Typography.Text strong>조회기간</Typography.Text>
        <DatePicker value={startDate} allowClear={false} onChange={d => d && setStartDate(d)} />
        <span>~</span>
        <DatePicker value={closeDate} allowClear={false} onChange={d => d && setCloseDate(d)} />
        <Typography.Text strong>접속구분</Typography.Text>
        <CodeSelect kindCd="LoginModeCode" style={{ width: 110 }} placeholder="전체" allowClear value={loginMode} onChange={v => setLoginMode(v ?? undefined)} />
        <Typography.Text strong>회사명</Typography.Text>
        <Select<number> style={{ width: 200 }} showSearch optionFilterProp="label" value={companyId} onChange={setCompanyId}
          options={[{ value: 0, label: '전체' }, ...companies.map(c => ({ value: c.companyId, label: c.companyNm }))]} />
        <Button type="primary" onClick={retrieve}>조회</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact<LoginHistory> rowData={rows} loading={loading} columnDefs={cols} getRowId={p => String(p.data.loginId)} />
      </div>
    </div>
  );
};
