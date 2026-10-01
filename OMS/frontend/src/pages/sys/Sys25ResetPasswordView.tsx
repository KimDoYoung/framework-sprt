import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Modal, Space, Typography, message } from 'antd';
import { LockOutlined, SearchOutlined, UnlockOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { sysApi } from '../../api/sys';
import { errorMessage } from '../../api/client';
import { PasswordPerson } from '../../types/sys';
import { PersonLookup } from '../../components/lookup/PersonLookup';

/**
 * 비밀번호 초기화 (AS-IS client/vi/sys/Sys25_Tab_ResetPassword). 로그인 회사 사원의 잠금해제·비밀번호 초기화.
 * 초기화하면 비밀번호가 비워지고, 그 사원은 다음 로그인 때 비밀번호 변경을 요구받는다.
 */
export const Sys25ResetPasswordView: React.FC = () => {
  const [person, setPerson] = useState<{ personId: number; korNm: string }>();
  const [lookupOpen, setLookupOpen] = useState(false);
  const [rows, setRows] = useState<PasswordPerson[]>([]);
  const [loading, setLoading] = useState(false);

  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await sysApi.searchPasswordPersons(person?.personId));
    } catch (err) {
      message.error(errorMessage(err, '사원 조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [person]);

  useEffect(() => { retrieve(); }, [retrieve]);

  const confirm = useCallback((p: PasswordPerson, what: string, call: () => Promise<void>, done: string) => {
    Modal.confirm({
      title: '확인', content: `'${p.korNm}' ${what}를 진행하시겠습니까?`, okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          await call();
          message.success(done);
          retrieve();
        } catch (err) {
          message.error(errorMessage(err, `${what} 실패`));
        }
      },
    });
  }, [retrieve]);

  const columnDefs = useMemo<ColDef<PasswordPerson>[]>(() => [
    { field: 'empNo', headerName: '사번', width: 100, cellStyle: { textAlign: 'center' } },
    { field: 'orgNm', headerName: '본부(부서)', width: 300 },
    { field: 'korNm', headerName: '성명', width: 100, cellStyle: { textAlign: 'center' } },
    {
      field: 'lockYn', headerName: '상태', width: 100, cellStyle: { textAlign: 'center' },
      cellRenderer: (p: ICellRendererParams<PasswordPerson>) =>
        p.value ? <LockOutlined style={{ color: '#ff4d4f' }} /> : <UnlockOutlined style={{ color: '#52c41a' }} />,
    },
    {
      headerName: '잠금해제', width: 150, cellStyle: { textAlign: 'center' },
      cellRenderer: (p: ICellRendererParams<PasswordPerson>) => p.data && (
        <Button size="small" disabled={!p.data.lockYn}
          onClick={() => confirm(p.data!, '잠금해제', () => sysApi.unlockPerson(p.data!.personId), '잠금해제를 완료하였습니다')}>잠금해제</Button>
      ),
    },
    {
      headerName: '비밀번호 초기화', width: 150, cellStyle: { textAlign: 'center' },
      cellRenderer: (p: ICellRendererParams<PasswordPerson>) => p.data && (
        <Button size="small" danger
          onClick={() => confirm(p.data!, '비밀번호 초기화', () => sysApi.resetPassword(p.data!.personId), '비밀번호 초기화를 완료하였습니다.')}>초기화</Button>
      ),
    },
  ], [confirm]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 12, background: '#fff' }}>
      <Space wrap>
        <Typography.Text strong>성명</Typography.Text>
        <Input style={{ width: 160 }} readOnly placeholder="전체" value={person?.korNm ?? ''} suffix={<SearchOutlined />}
          allowClear onClick={() => setLookupOpen(true)} onChange={e => { if (!e.target.value) setPerson(undefined); }} />
        <Button type="primary" onClick={retrieve}>조회</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact<PasswordPerson> rowData={rows} loading={loading} columnDefs={columnDefs} getRowId={p => String(p.data.personId)} />
      </div>
      <PersonLookup
        open={lookupOpen}
        multiple={false}
        onCancel={() => setLookupOpen(false)}
        onOk={list => {
          setLookupOpen(false);
          if (list[0]) setPerson({ personId: list[0].personId, korNm: list[0].korNm });
        }}
      />
    </div>
  );
};
