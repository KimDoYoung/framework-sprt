import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, DatePicker, Input, Modal, Space, Splitter, Tree, Typography, message } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import dayjs, { Dayjs } from 'dayjs';
import { empApi } from '../../api/emp';
import { sysApi } from '../../api/sys';
import { errorMessage } from '../../api/client';
import { TransInfo } from '../../types/emp';
import { PersonMenu, RoleUser } from '../../types/sys';
import { toTreeData } from '../../components/common/flatTree';

/** 사원별 메뉴권한(View) (AS-IS Emp00_Tab_RoleMenu + Sys07_Tree_PersonRoleMenu + Sys05_Lookup_PersonRole). 읽기 전용 */
export const Emp00RoleMenuView: React.FC = () => {
  const [baseDate, setBaseDate] = useState<Dayjs>(dayjs());
  const [findText, setFindText] = useState('');
  const [people, setPeople] = useState<TransInfo[]>([]);
  const [menus, setMenus] = useState<PersonMenu[]>([]);
  const [roles, setRoles] = useState<RoleUser[]>();
  const [loading, setLoading] = useState(false);

  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setPeople(await empApi.searchTransInfos({ searchText: findText, transCode: '100', transDate: baseDate.format('YYYY-MM-DD') }));
    } catch (err) {
      message.error(errorMessage(err, '사원 조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [findText, baseDate]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  const selectPerson = (p?: TransInfo) => {
    if (!p) { setMenus([]); return; }
    sysApi.searchPersonMenus(p.personId).then(setMenus).catch(err => message.error(errorMessage(err, '메뉴 조회 실패')));
  };

  const openRoles = (p: TransInfo) => {
    sysApi.searchRolesByUser(p.personId).then(r => setRoles(r.filter(x => x.userRoleYn)))
      .catch(err => message.error(errorMessage(err, '권한그룹 조회 실패')));
  };

  const GroupCell = useCallback((p: ICellRendererParams<TransInfo>) => (
    p.data ? <TeamOutlined style={{ color: '#1677ff', cursor: 'pointer' }} onClick={() => openRoles(p.data!)} /> : null
  ), []);

  const columnDefs = useMemo<ColDef<TransInfo>[]>(() => [
    { field: 'parentFullNm', headerName: '조직', flex: 1, minWidth: 200 },
    { field: 'titleNm', headerName: '직책', width: 110 },
    { field: 'empNo', headerName: '사번', width: 90, cellStyle: { textAlign: 'center' } },
    { field: 'korNm', headerName: '성명', width: 100, cellStyle: { textAlign: 'center' } },
    { headerName: '그룹', width: 70, cellRenderer: GroupCell, cellStyle: { textAlign: 'center' } },
  ], [GroupCell]);

  const treeData = useMemo(() => toTreeData(menus, m => m.menuId, m => m.parentId, m => m.menuNoPlusNm), [menus]);

  return (
    <Splitter style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel defaultSize="55%" min="30%" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space wrap>
          <Typography.Text strong>기준일</Typography.Text>
          <DatePicker value={baseDate} allowClear={false} onChange={d => d && setBaseDate(d)} />
          <Typography.Text strong>조직/직무/성명</Typography.Text>
          <Input style={{ width: 150 }} value={findText} allowClear onChange={e => setFindText(e.target.value)} onPressEnter={retrieve} />
          <Button type="primary" onClick={retrieve}>조회</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <AgGridReact<TransInfo> rowData={people} loading={loading} columnDefs={columnDefs} getRowId={p => String(p.data.personId)}
            rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
            onSelectionChanged={e => selectPerson(e.api.getSelectedRows()[0])} />
        </div>
      </Splitter.Panel>
      <Splitter.Panel style={{ padding: 12, overflow: 'auto' }}>
        <Typography.Text strong>사용 가능 메뉴</Typography.Text>
        {treeData.length > 0 && <Tree key={menus.length} treeData={treeData} defaultExpandAll selectable={false} />}
      </Splitter.Panel>
      <Modal open={roles != null} title="사용자별 권한그룹" width={640} footer={null} onCancel={() => setRoles(undefined)}>
        <div style={{ height: 360 }}>
          <AgGridReact<RoleUser> rowData={roles ?? []} getRowId={p => String(p.data.roleId)} columnDefs={[
            { field: 'roleNm', headerName: '권한명', width: 200 },
            { field: 'seq', headerName: '순서', width: 80 },
            { field: 'note', headerName: '비고', flex: 1 },
          ]} />
        </div>
      </Modal>
    </Splitter>
  );
};
