import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Modal, Select, Space, Typography, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { sysApi } from '../../api/sys';
import { OnlineUser, pushApi } from '../../api/push';
import { errorMessage } from '../../api/client';
import { SysCompany } from '../../types/sys';

const cols: ColDef<OnlineUser>[] = [
  { field: 'companyNm', headerName: '고객사', width: 260 },
  { field: 'korNm', headerName: '사원명', width: 100, cellStyle: { textAlign: 'center' } },
  { field: 'empNo', headerName: '사번', width: 120, cellStyle: { textAlign: 'center' } },
  { field: 'posNm', headerName: '직위', width: 100, cellStyle: { textAlign: 'center' } },
  { field: 'officeTelNo', headerName: '사무실', width: 130 },
  { field: 'mobileTelNo', headerName: '휴대폰', width: 130 },
  { field: 'sessions', headerName: '접속수', width: 80, type: 'rightAligned' },
];

/**
 * 로그아웃 알림 관리 (AS-IS client/vi/sys/Sys86_Tab_Websocket). KFS 관리자 전용.
 * 접속 중 사원(TOBE presence)에게 개별·전체 알림을 보내거나 강제 로그아웃한다. 목록은 접속자만 나온다.
 */
export const Sys86WebsocketView: React.FC = () => {
  const gridRef = useRef<AgGridReact<OnlineUser>>(null);
  const [companies, setCompanies] = useState<SysCompany[]>([]);
  const [companyId, setCompanyId] = useState(0); // 0 = 전체
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<OnlineUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendTarget, setSendTarget] = useState<OnlineUser[] | 'all'>();
  const [form] = Form.useForm<{ title: string; message: string }>();

  useEffect(() => {
    sysApi.searchCompanies(undefined, 'true').then(setCompanies).catch(err => message.error(errorMessage(err, '고객사 조회 실패')));
  }, []);

  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await pushApi.searchOnlineUsers(companyId === 0 ? undefined : companyId, searchText));
    } catch (err) {
      message.error(errorMessage(err, '접속자 조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [companyId, searchText]);

  // 탭 진입·고객사 선택 시 조회
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, [companyId]);

  const checked = () => gridRef.current?.api.getSelectedRows() ?? [];

  const openSend = (all: boolean) => {
    if (!all && checked().length === 0) {
      message.warning('선택된 사원이 없습니다');
      return;
    }
    form.resetFields();
    setSendTarget(all ? 'all' : checked());
  };

  const send = async () => {
    const { title, message: text } = await form.validateFields();
    try {
      if (sendTarget === 'all') {
        await pushApi.sendNotice(title, text);
        message.success('전체알림이 발송되었습니다');
      } else if (sendTarget) {
        await Promise.all(sendTarget.map(u => pushApi.sendNotification(u.username, title, text)));
        message.success('알림이 발송되었습니다');
      }
      setSendTarget(undefined);
    } catch (err) {
      message.error(errorMessage(err, '알림 발송 실패'));
    }
  };

  const logout = (all: boolean) => {
    const targets = checked();
    if (!all && targets.length === 0) {
      message.warning('선택된 사원이 없습니다');
      return;
    }
    Modal.confirm({
      title: '확인',
      content: all ? '모든 사용자들이 즉시 로그아웃됩니다. 진행하시겠습니까?' : '선택된 사용자들은 즉시 로그아웃됩니다. 진행하시겠습니까?',
      okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          const n = all ? await pushApi.forceLogoutAll() : await pushApi.forceLogout(targets.map(u => u.userId));
          message.success(`${all ? '전체 로그아웃' : '강제 로그아웃'}처리되었습니다 (${n}명)`);
          retrieve();
        } catch (err) {
          message.error(errorMessage(err, '로그아웃 처리 실패'));
        }
      },
    });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 12, background: '#fff' }}>
      <Space wrap>
        <Typography.Text strong>고객사</Typography.Text>
        <Select<number> style={{ width: 200 }} showSearch optionFilterProp="label" value={companyId} onChange={setCompanyId}
          options={[{ value: 0, label: '전체' }, ...companies.map(c => ({ value: c.companyId, label: c.companyNm }))]} />
        <Typography.Text strong>검색</Typography.Text>
        <Input style={{ width: 200 }} placeholder="고객사명/사원명/휴대폰" value={searchText} allowClear
          onChange={e => setSearchText(e.target.value)} onPressEnter={retrieve} />
        <Button type="primary" onClick={retrieve}>조회</Button>
        <Button onClick={() => openSend(false)}>개별전송</Button>
        <Button onClick={() => openSend(true)}>전체전송</Button>
        <Button danger onClick={() => logout(false)}>개별로그아웃</Button>
        <Button danger onClick={() => logout(true)}>전체로그아웃</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact<OnlineUser> ref={gridRef} rowData={rows} loading={loading} columnDefs={cols} getRowId={p => String(p.data.userId)}
          rowSelection={{ mode: 'multiRow', checkboxes: true, headerCheckbox: true, enableClickSelection: false }} />
      </div>
      <Modal open={sendTarget != null} title={sendTarget === 'all' ? '전체 알림' : `알림 (${Array.isArray(sendTarget) ? sendTarget.length : 0}명)`}
        okText="전송" cancelText="닫기" onOk={send} onCancel={() => setSendTarget(undefined)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="제목" rules={[{ required: true, max: 100 }]}><Input /></Form.Item>
          <Form.Item name="message" label="내용" rules={[{ required: true, max: 1000 }]}><Input.TextArea rows={4} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
