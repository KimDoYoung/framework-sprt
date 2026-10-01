import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Checkbox, Input, Pagination, Space, Typography, message } from 'antd';
import { CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { empApi } from '../../api/emp';
import { errorMessage } from '../../api/client';
import { UserInfo } from '../../types/emp';
import { SysCompany } from '../../types/sys';
import { CompanyLookup } from '../../components/lookup/CompanyLookup';

const PAGE_SIZE = 50;

/**
 * 사용자정보 조회 (AS-IS Emp01_Tab_UserInfo, 전 고객사 — KFS 관리자). 서버 페이징(AS-IS GridPagingLoader).
 * 셀을 더블클릭하면 값을 복사한다. AS-IS 비고 편집(Emp02_Edit_Note)은 AS-IS에서도 주석 처리되어 뺐다.
 */
export const Emp01UserInfoView: React.FC = () => {
  const [company, setCompany] = useState<SysCompany>();
  const [searchText, setSearchText] = useState('');
  const [useOnly, setUseOnly] = useState(true);
  const [excludeRetired, setExcludeRetired] = useState(true);
  const [page, setPage] = useState(0);
  const [data, setData] = useState<{ total: number; rows: UserInfo[] }>({ total: 0, rows: [] });
  const [loading, setLoading] = useState(false);
  const [lookupOpen, setLookupOpen] = useState(false);

  const retrieve = useCallback(async (p = 0) => {
    setLoading(true);
    setPage(p);
    try {
      setData(await empApi.searchUserInfos({ companyId: company?.companyId, searchText, useOnly, excludeRetired, page: p, size: PAGE_SIZE }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [company, searchText, useOnly, excludeRetired]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(0); }, [company]);

  const columnDefs = useMemo<ColDef<UserInfo>[]>(() => [
    { field: 'companyNm', headerName: '고객사', width: 200 },
    { field: 'korNm', headerName: '사원명', width: 90, cellStyle: { textAlign: 'center' } },
    { field: 'empNo', headerName: '사번', width: 110 },
    { field: 'posNm', headerName: '직위', width: 90, cellStyle: { textAlign: 'center' } },
    { field: 'orgNm', headerName: '부서명', width: 200 },
    { field: 'officeTelno', headerName: '사무실', width: 120, cellStyle: { textAlign: 'center' } },
    { field: 'mobileTelno', headerName: '휴대폰', width: 120, cellStyle: { textAlign: 'center' } },
    { field: 'emailAddr', headerName: '이메일', width: 200 },
    { field: 'hireDate', headerName: '입사일', width: 110 },
    { field: 'note', headerName: '비고', flex: 1, minWidth: 160 },
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 12, background: '#fff' }}>
      <Space wrap>
        <Typography.Text strong>고객사</Typography.Text>
        <Input style={{ width: 180 }} readOnly value={company?.companyNm ?? '전체'}
          suffix={<Space size={4}>
            {company && <CloseCircleOutlined style={{ cursor: 'pointer', color: '#bfbfbf' }} onClick={() => setCompany(undefined)} />}
            <SearchOutlined style={{ cursor: 'pointer' }} onClick={() => setLookupOpen(true)} />
          </Space>} />
        <Typography.Text strong>검색</Typography.Text>
        <Input style={{ width: 260 }} placeholder="고객사명/부서명/사원명/사무실/휴대폰" value={searchText} allowClear
          onChange={e => setSearchText(e.target.value)} onPressEnter={() => retrieve(0)} />
        <Checkbox checked={useOnly} onChange={e => setUseOnly(e.target.checked)}>사용고객만 보기</Checkbox>
        <Checkbox checked={excludeRetired} onChange={e => setExcludeRetired(e.target.checked)}>퇴사자 제외</Checkbox>
        <Button type="primary" onClick={() => retrieve(0)}>조회</Button>
        <Typography.Text type="secondary">※ 셀을 더블클릭하면 복사됩니다.</Typography.Text>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact<UserInfo> rowData={data.rows} loading={loading} columnDefs={columnDefs} getRowId={p => String(p.data.personId)}
          onCellDoubleClicked={e => {
            const v = e.value == null ? '' : String(e.value);
            if (v) navigator.clipboard.writeText(v).then(() => message.success(`복사 완료: ${v}`, 0.8));
          }} />
      </div>
      <Pagination size="small" align="center" current={page + 1} pageSize={PAGE_SIZE} total={data.total} showSizeChanger={false}
        showTotal={t => `총 ${t}건`} onChange={p => retrieve(p - 1)} />
      <CompanyLookup open={lookupOpen} onCancel={() => setLookupOpen(false)} onOk={list => { setCompany(list[0]); setLookupOpen(false); }} />
    </div>
  );
};
