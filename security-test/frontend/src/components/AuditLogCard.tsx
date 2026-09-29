import React, { useEffect, useState } from 'react';
import { Button, Card, Table, Tag, Tooltip, Typography, message } from 'antd';
import { AuditOutlined, ReloadOutlined } from '@ant-design/icons';
import { auditApi } from '../api/audit';
import { errorMessage } from '../api/client';
import { AuditLogItem } from '../types/auth';

const { Text } = Typography;

const EVENT_COLORS: Record<string, string> = {
  LOGIN_SUCCESS: 'green',
  LOGOUT: 'default',
  LOGIN_FAIL: 'orange',
  LOGIN_LOCKED_ATTEMPT: 'orange',
  ACCOUNT_LOCKED: 'red',
  ACCOUNT_UNLOCKED: 'blue',
  MULTI_LOGIN_BLOCKED: 'volcano',
  TOKEN_REUSED: 'magenta',
  FILE_UPLOAD: 'cyan',
  FILE_UPLOAD_REJECTED: 'red',
  FILE_DOWNLOAD: 'geekblue'
};

/**
 * 관리자 전용: 최근 보안 감사 로그 조회 (sys71_security_audit_log)
 */
export const AuditLogCard: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await auditApi.list(100);
      if (res.success && res.data) {
        setLogs(res.data);
      }
    } catch (err: any) {
      // 401(세션 종료)은 axios 인터셉터가 처리
      if (err.response?.status !== 401) {
        message.error(errorMessage(err, '감사 로그 조회 실패'));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const columns = [
    {
      title: '일시',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: (v: string) => v?.replace('T', ' ').substring(0, 19)
    },
    {
      title: '이벤트',
      dataIndex: 'eventType',
      key: 'eventType',
      render: (v: string) => <Tag color={EVENT_COLORS[v] || 'default'}>{v}</Tag>
    },
    {
      title: '결과',
      dataIndex: 'result',
      key: 'result',
      width: 80,
      render: (v: string) => <Text type={v === 'FAIL' ? 'danger' : 'success'}>{v}</Text>
    },
    { title: '사용자', dataIndex: 'userId', key: 'userId', render: (v: string | null) => <Text strong>{v || '-'}</Text> },
    { title: '대상', dataIndex: 'targetId', key: 'targetId', ellipsis: true, render: (v: string | null) => v || '-' },
    { title: '상세', dataIndex: 'detail', key: 'detail', ellipsis: true, render: (v: string | null) => v || '-' },
    {
      title: 'IP',
      dataIndex: 'clientIp',
      key: 'clientIp',
      render: (v: string | null, record: AuditLogItem) => (
        <Tooltip title={record.userAgent}>{v || '-'}</Tooltip>
      )
    },
    {
      title: '추적ID',
      dataIndex: 'traceId',
      key: 'traceId',
      render: (v: string | null) => (v ? <Text code copyable>{v}</Text> : '-')
    }
  ];

  return (
    <Card
      title={<span><AuditOutlined style={{ marginRight: 8, color: '#722ed1' }} />보안 감사 로그 (관리자 전용)</span>}
      bordered={false}
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
      extra={<Button size="small" icon={<ReloadOutlined />} onClick={fetchLogs}>새로고침</Button>}
    >
      <div style={{ marginBottom: 12 }}>
        <Text type="secondary">
          * 최근 100건. 같은 이벤트가 서버의 <code>*-audit.log</code> 파일에도 기록되며,
          추적ID로 <code>*-info.log</code>에서 해당 요청의 전체 로그를 찾을 수 있습니다.
        </Text>
      </div>
      <Table columns={columns} dataSource={logs} rowKey="auditId" loading={loading} size="small"
             pagination={{ pageSize: 10, size: 'small' }} scroll={{ x: 1000 }} />
    </Card>
  );
};
