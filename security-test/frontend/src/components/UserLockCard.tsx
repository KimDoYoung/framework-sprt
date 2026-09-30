import React, { useEffect, useState } from 'react';
import { Button, Card, Popconfirm, Table, Tag, Typography, message } from 'antd';
import { LockOutlined, ReloadOutlined, UnlockOutlined } from '@ant-design/icons';
import { errorMessage } from '../api/client';
import { userApi } from '../api/user';
import { UserItem } from '../types/auth';

const { Text } = Typography;

/** emp01_lock_yn 잠김 값 */
const LOCKED = 'true';

/**
 * 관리자 전용: 관리자 회사 사원의 계정 잠금 현황 조회 및 잠금 해제 (AS-IS emp01_lock_yn)
 */
export const UserLockCard: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userApi.list();
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (err: any) {
      // 401(세션 종료)은 axios 인터셉터가 처리
      if (err.response?.status !== 401) {
        message.error(errorMessage(err, '사용자 목록 조회 실패'));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUnlock = async (record: UserItem) => {
    try {
      const res = await userApi.unlock(record.userId);
      message.success(`${record.username}: ${res.message}`);
      fetchUsers();
    } catch (err: any) {
      if (err.response?.status !== 401) {
        message.error(errorMessage(err, '잠금 해제 실패'));
      }
    }
  };

  const columns = [
    { title: '사번', dataIndex: 'username', key: 'username', render: (v: string) => <Text strong>{v}</Text> },
    { title: '성명', dataIndex: 'fullName', key: 'fullName' },
    { title: '권한', dataIndex: 'role', key: 'role' },
    {
      title: '연속 실패',
      dataIndex: 'failureCount',
      key: 'failureCount',
      render: (count: number) => (count > 0 ? <Tag color="orange">{count}회</Tag> : <Text type="secondary">0</Text>)
    },
    {
      title: '잠금',
      dataIndex: 'lockYn',
      key: 'lockYn',
      render: (lockYn: string | null) =>
        lockYn === LOCKED ? <Tag color="red" icon={<LockOutlined />}>잠김</Tag> : <Tag color="green">정상</Tag>
    },
    {
      title: '해제',
      key: 'action',
      render: (_: unknown, record: UserItem) => (
        <Popconfirm
          title={`${record.username} 계정의 잠금을 해제할까요?`}
          onConfirm={() => handleUnlock(record)}
          okText="해제"
          cancelText="취소"
          disabled={record.lockYn !== LOCKED}
        >
          <Button size="small" icon={<UnlockOutlined />} disabled={record.lockYn !== LOCKED}>
            잠금 해제
          </Button>
        </Popconfirm>
      )
    }
  ];

  return (
    <Card
      title={<span><LockOutlined style={{ marginRight: 8, color: '#cf1322' }} />계정 잠금 관리 (관리자 전용)</span>}
      bordered={false}
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
      extra={<Button size="small" icon={<ReloadOutlined />} onClick={fetchUsers}>새로고침</Button>}
    >
      <div style={{ marginBottom: 12 }}>
        <Text type="secondary">
          * 로그인에 연속으로 실패하면 계정이 잠깁니다(허용 횟수: <code>asseterp.auth.login-lock.max-failures</code>).
          잠긴 계정은 관리자가 해제하기 전까지 로그인할 수 없습니다.
        </Text>
      </div>
      <Table columns={columns} dataSource={users} rowKey="userId" loading={loading} size="small"
             pagination={{ pageSize: 10, showSizeChanger: false, showTotal: total => `${total}명` }} />
    </Card>
  );
};
