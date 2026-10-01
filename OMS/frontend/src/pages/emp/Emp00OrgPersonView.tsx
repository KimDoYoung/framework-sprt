import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, DatePicker, Space, Splitter, Tree, Typography, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import dayjs, { Dayjs } from 'dayjs';
import { orgApi } from '../../api/org';
import { empApi } from '../../api/emp';
import { errorMessage } from '../../api/client';
import { OrgCode } from '../../types/org';
import { OrgPerson } from '../../types/emp';
import { toTreeData } from '../../components/common/flatTree';
import { OrgChartModal } from '../org/org01/OrgChartModal';

/**
 * 조직별 사원조회 (AS-IS Emp00_Tab_OrgPerson) / 조직별 사원조회(관리자) (Emp00_Tab_OrgEmpManager: 사원구분 컬럼 추가, 조직도 버튼 없음).
 * 왼쪽 기준일 조직 트리에서 조직을 고르면 하위 조직까지의 사원. 사진 컬럼은 파일 정책 결정 전이라 뺐다.
 */
const OrgPersonView: React.FC<{ manager?: boolean }> = ({ manager = false }) => {
  const [baseDate, setBaseDate] = useState<Dayjs>(dayjs());
  const [orgs, setOrgs] = useState<OrgCode[]>([]);
  const [rows, setRows] = useState<OrgPerson[]>([]);
  const [loading, setLoading] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);

  const retrieve = useCallback(async () => {
    try {
      setOrgs(await orgApi.searchOrgCodes(baseDate.format('YYYY-MM-DD')));
      setRows([]);
    } catch (err) {
      message.error(errorMessage(err, '조직 조회 실패'));
    }
  }, [baseDate]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  const selectOrg = async (orgCodeId: number) => {
    setLoading(true);
    try {
      setRows(await empApi.searchOrgPersons(orgCodeId, baseDate.format('YYYY-MM-DD')));
    } catch (err) {
      message.error(errorMessage(err, '사원 조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  const treeData = useMemo(() => toTreeData(orgs, o => o.codeId, o => o.parentCodeId, o => o.korNm), [orgs]);

  const columnDefs = useMemo<ColDef<OrgPerson>[]>(() => [
    { field: 'korNm', headerName: '성명', width: 100 },
    { field: 'posNm', headerName: '직위', width: 90 },
    { field: 'orgKorNm', headerName: '본부(부서)', width: 150 },
    { field: 'titleNm2', headerName: '직책', width: 100 },
    { field: 'hireDate', headerName: '입사일', width: 110 },
    { field: 'emailAddr', headerName: 'e-mail', width: 200 },
    { field: 'mobileTelno', headerName: 'H˙P', width: 130 },
    { field: 'officeTelno', headerName: '전화', width: 130 },
    ...(manager ? [{ field: 'kindNm', headerName: '사원구분', width: 90 } as ColDef<OrgPerson>] : []),
    { field: 'empNo', headerName: '사번', width: 90 },
  ], [manager]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <Space wrap style={{ padding: 12 }}>
        <Typography.Text strong>기준일</Typography.Text>
        <DatePicker value={baseDate} allowClear={false} onChange={d => d && setBaseDate(d)} />
        <Button type="primary" onClick={retrieve}>조회</Button>
        {!manager && <Button onClick={() => setChartOpen(true)}>조직도보기</Button>}
      </Space>
      <Splitter style={{ flex: 1, minHeight: 0 }}>
        <Splitter.Panel defaultSize="20%" min="12%" style={{ padding: '0 12px 12px', overflow: 'auto' }}>
          {treeData.length > 0 && (
            <Tree treeData={treeData} defaultExpandAll onSelect={keys => keys[0] != null && selectOrg(keys[0] as number)} />
          )}
        </Splitter.Panel>
        <Splitter.Panel style={{ padding: '0 12px 12px' }}>
          <AgGridReact<OrgPerson> rowData={rows} loading={loading} columnDefs={columnDefs} getRowId={p => String(p.data.personId)} />
        </Splitter.Panel>
      </Splitter>
      <OrgChartModal open={chartOpen} orgs={orgs} baseDate={baseDate.format('YYYY-MM-DD')} onClose={() => setChartOpen(false)} />
    </div>
  );
};

export const Emp00OrgPersonView: React.FC = () => <OrgPersonView />;
export const Emp00OrgEmpManagerView: React.FC = () => <OrgPersonView manager />;
