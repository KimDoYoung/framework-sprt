import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, Select, Space, Splitter, Typography, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { CellValueChangedEvent, ColDef } from 'ag-grid-community';
import { sysApi } from '../../api/sys';
import { empApi } from '../../api/emp';
import { errorMessage } from '../../api/client';
import { RoleUser } from '../../types/sys';
import { TransInfo } from '../../types/emp';

// AS-IS 재직구분 콤보 → transCode
const WORK_TYPES = [
  { label: '전체', value: '000' },
  { label: '재직', value: '100' },
  { label: '겸직', value: '800' },
  { label: '퇴직', value: '900' },
];

/** 사용자별 권한그룹 맵핑 (AS-IS client/vi/sys/Sys05_Tab_PersonRole). 위: 사원 목록, 아래: 회사 권한그룹 + 권한 체크 */
export const Sys05PersonRoleView: React.FC = () => {
  const roleGridRef = useRef<AgGridReact<RoleUser>>(null);
  const [searchText, setSearchText] = useState('');
  const [transCode, setTransCode] = useState('100');
  const [people, setPeople] = useState<TransInfo[]>([]);
  const [person, setPerson] = useState<TransInfo>();
  const [roles, setRoles] = useState<RoleUser[]>([]);
  const [loading, setLoading] = useState(false);
  const dirty = useRef(new Set<number>());

  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setPeople(await empApi.searchTransInfos({ searchText, transCode }));
    } catch (err) {
      message.error(errorMessage(err, '사원 조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [searchText, transCode]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  // 사원을 고르면 권한그룹 조회
  useEffect(() => {
    dirty.current.clear();
    if (!person) {
      setRoles([]);
      return;
    }
    sysApi.searchRolesByUser(person.personId)
      .then(setRoles)
      .catch(err => message.error(errorMessage(err, '권한그룹 조회 실패')));
  }, [person]);

  const save = async () => {
    if (!person) {
      message.warning('선택된 사원이 없습니다');
      return;
    }
    roleGridRef.current?.api?.stopEditing();
    const changed = roles.filter(r => dirty.current.has(r.roleId));
    if (changed.length === 0) {
      message.info('저장할 내용이 없습니다.');
      return;
    }
    try {
      setRoles(await sysApi.updateRolesByUser(person.personId, changed));
      dirty.current.clear();
      message.success(`${changed.length}건 저장되었습니다.`);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  const personCols = useMemo<ColDef<TransInfo>[]>(() => [
    { field: 'orgKorNm', headerName: '부서명', width: 200 },
    { field: 'titleNm', headerName: '직책', width: 100 },
    { field: 'empNo', headerName: '사번', width: 80 },
    { field: 'korNm', headerName: '성명', width: 100 },
    { field: 'posNm', headerName: '직위', width: 100 },
    { field: 'kindNm', headerName: '사원구분', width: 90 },
    { field: 'mobileTelno', headerName: '핸드폰번호', width: 130 },
    { field: 'emailAddr', headerName: '이메일주소', flex: 1, minWidth: 200 },
  ], []);

  const roleCols = useMemo<ColDef<RoleUser>[]>(() => [
    { field: 'roleNm', headerName: '권한명', width: 200 },
    { field: 'userRoleYn', headerName: '권한', width: 70, editable: true, cellDataType: 'boolean' },
    { field: 'seq', headerName: '순서', width: 80 },
    { field: 'note', headerName: '비고', flex: 1, minWidth: 200 },
  ], []);

  return (
    <Splitter layout="vertical" style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space wrap>
          <Typography.Text strong>사원검색</Typography.Text>
          <Input style={{ width: 180 }} value={searchText} allowClear onChange={e => setSearchText(e.target.value)} onPressEnter={retrieve} />
          <Typography.Text strong>재직구분</Typography.Text>
          <Select style={{ width: 120 }} value={transCode} options={WORK_TYPES} onChange={setTransCode} />
          <Button type="primary" onClick={retrieve}>조회</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <AgGridReact<TransInfo>
            rowData={people}
            loading={loading}
            columnDefs={personCols}
            getRowId={p => String(p.data.personId)}
            rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
            onRowDataUpdated={e => {
              const first = e.api.getDisplayedRowAtIndex(0);
              if (first) first.setSelected(true);
              else setPerson(undefined);
            }}
            onSelectionChanged={e => setPerson(e.api.getSelectedRows()[0])}
          />
        </div>
      </Splitter.Panel>
      <Splitter.Panel defaultSize="40%" min="20%" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Typography.Text strong>{person ? `${person.korNm}(${person.empNo})의 권한그룹` : '권한그룹'}</Typography.Text>
        <div style={{ flex: 1, minHeight: 0 }}>
          <AgGridReact<RoleUser>
            ref={roleGridRef}
            rowData={roles}
            columnDefs={roleCols}
            getRowId={p => String(p.data.roleId)}
            onCellValueChanged={(e: CellValueChangedEvent<RoleUser>) => e.data && dirty.current.add(e.data.roleId)}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={save}>저장</Button>
        </div>
      </Splitter.Panel>
    </Splitter>
  );
};
