import React, { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message as antMessage,
  notification
} from 'antd';
import { ApiOutlined, NotificationOutlined, ReloadOutlined, SendOutlined, TeamOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { errorMessage } from '../api/client';
import { pushApi } from '../api/push';
import { User } from '../types/auth';
import { PresenceItem, PresencePayload, WsLevel, WsMessage, WsMessageType } from '../types/ws';
import { realtime, WsStatus } from '../ws/stompClient';

const { Text } = Typography;

const MAX_LOG = 50;

const STATUS_BADGE: Record<WsStatus, { status: 'success' | 'processing' | 'default'; text: string }> = {
  CONNECTED: { status: 'success', text: '연결됨' },
  CONNECTING: { status: 'processing', text: '연결 중' },
  DISCONNECTED: { status: 'default', text: '연결 끊김' }
};

const TYPE_COLOR: Record<WsMessageType, string> = {
  SESSION_TERMINATED: 'red',
  NOTIFICATION: 'blue',
  NOTICE: 'purple',
  PRESENCE_CHANGED: 'cyan',
  ERROR: 'volcano',
  ECHO: 'default'
};

const LEVEL_COLOR: Record<WsLevel, string> = { INFO: 'green', WARN: 'orange', ERROR: 'red' };

const LEVEL_OPTIONS = (['INFO', 'WARN', 'ERROR'] as WsLevel[]).map(level => ({ value: level, label: level }));

const toast = (msg: WsMessage) => {
  const open = msg.level === 'ERROR' ? notification.error : msg.level === 'WARN' ? notification.warning : notification.info;
  open({
    message: `${msg.type === 'NOTICE' ? '[공지] ' : ''}${msg.title}`,
    description: `${msg.message} — ${msg.sender.name}`,
    placement: 'bottomRight'
  });
};

/**
 * WebSocket(STOMP) 실시간 알림 테스트: 연결 상태, 수신 메시지 로그, echo,
 * 관리자 전용 공지·개인 알림 발송과 접속자 현황
 */
export const RealtimeCard: React.FC<{ user: User }> = ({ user }) => {
  const isAdmin = user.roles?.includes('ROLE_ADMIN') ?? false;
  const [status, setStatus] = useState<WsStatus>(realtime.getStatus());
  const [logs, setLogs] = useState<WsMessage[]>([]);
  const [echoText, setEchoText] = useState('hello');
  const [presence, setPresence] = useState<PresenceItem[]>([]);
  const [presenceLoading, setPresenceLoading] = useState(false);
  const [noticeForm] = Form.useForm();
  const [notificationForm] = Form.useForm();

  const fetchPresence = async () => {
    setPresenceLoading(true);
    try {
      const res = await pushApi.presence();
      if (res.success && res.data) setPresence(res.data);
    } catch (err: any) {
      if (err.response?.status !== 401) antMessage.error(errorMessage(err, '접속자 조회 실패'));
    } finally {
      setPresenceLoading(false);
    }
  };

  useEffect(() => realtime.onStatus(setStatus), []);

  useEffect(() => {
    if (isAdmin) fetchPresence();
    return realtime.onMessage(msg => {
      setLogs(prev => [msg, ...prev].slice(0, MAX_LOG));
      if (msg.type === 'NOTICE' || msg.type === 'NOTIFICATION') toast(msg);
      if (msg.type === 'PRESENCE_CHANGED' && isAdmin) {
        const payload = msg.payload as PresencePayload | null;
        if (payload) {
          setPresence(prev => payload.event === 'JOIN'
            ? [...prev.filter(p => p.sessionId !== payload.session.sessionId), payload.session]
            : prev.filter(p => p.sessionId !== payload.session.sessionId));
        }
      }
    });
  }, [isAdmin]);

  const handleEcho = () => {
    if (!realtime.sendEcho(echoText)) antMessage.warning('WebSocket이 연결되어 있지 않습니다.');
  };

  const handleNotice = async (values: { title: string; message: string; level: WsLevel }) => {
    try {
      const res = await pushApi.notice(values);
      antMessage.success(`${res.message} (id: ${res.data.slice(0, 8)})`);
      noticeForm.resetFields(['title', 'message']);
    } catch (err: any) {
      if (err.response?.status !== 401) antMessage.error(errorMessage(err, '공지 발송 실패'));
    }
  };

  const handleNotification = async (values: { username: string; title: string; message: string; level: WsLevel }) => {
    try {
      const res = await pushApi.notification(values);
      antMessage.success(`${res.message} (id: ${res.data.slice(0, 8)})`);
      notificationForm.resetFields(['title', 'message']);
    } catch (err: any) {
      if (err.response?.status !== 401) antMessage.error(errorMessage(err, '알림 발송 실패'));
    }
  };

  const logColumns = [
    {
      title: '시각', dataIndex: 'sentAt', key: 'sentAt', width: 90,
      render: (v: string) => dayjs(v).format('HH:mm:ss')
    },
    {
      title: '유형', dataIndex: 'type', key: 'type', width: 170,
      render: (v: WsMessageType) => <Tag color={TYPE_COLOR[v]}>{v}</Tag>
    },
    {
      title: '수준', dataIndex: 'level', key: 'level', width: 70,
      render: (v: WsLevel) => <Tag color={LEVEL_COLOR[v]}>{v}</Tag>
    },
    {
      title: '내용', key: 'content',
      render: (_: unknown, m: WsMessage) => (
        <span><Text strong>{m.title}</Text> <Text type="secondary">{m.message}</Text></span>
      )
    },
    { title: '발신', key: 'sender', width: 90, render: (_: unknown, m: WsMessage) => m.sender.name },
    {
      title: '추적ID', dataIndex: 'traceId', key: 'traceId', width: 150,
      render: (v: string) => <Text code copyable>{v}</Text>
    }
  ];

  const presenceColumns = [
    { title: '아이디', dataIndex: 'username', key: 'username', render: (v: string) => <Text strong>{v}</Text> },
    { title: '성명', dataIndex: 'name', key: 'name' },
    { title: '인스턴스', dataIndex: 'instanceId', key: 'instanceId', render: (v: string) => <Tag>{v}</Tag> },
    { title: 'IP', dataIndex: 'clientIp', key: 'clientIp' },
    {
      title: '접속 시각', dataIndex: 'connectedAt', key: 'connectedAt',
      render: (v: string) => dayjs(v).format('HH:mm:ss')
    }
  ];

  const badge = STATUS_BADGE[status];

  return (
    <Card
      title={<span><ApiOutlined style={{ marginRight: 8, color: '#722ed1' }} />WebSocket 실시간 알림 (STOMP)</span>}
      bordered={false}
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
      extra={<Badge status={badge.status} text={badge.text} />}
    >
      <div style={{ marginBottom: 12 }}>
        <Text type="secondary">
          * 다른 브라우저에서 같은 계정으로 로그인하면 이 화면은 <b>다음 요청을 기다리지 않고 즉시</b> 로그인 화면으로 이동합니다.
          같은 브라우저의 다른 탭에서 로그아웃해도 함께 종료되고, 세션이 만료되면 서버 주기 검사가 연결을 닫습니다.
        </Text>
      </div>

      <Row gutter={[20, 20]}>
        <Col xs={24} lg={isAdmin ? 14 : 24}>
          <Space.Compact style={{ width: '100%', marginBottom: 12 }}>
            <Input
              addonBefore="/app/echo"
              value={echoText}
              onChange={e => setEchoText(e.target.value)}
              onPressEnter={handleEcho}
            />
            <Button icon={<SendOutlined />} onClick={handleEcho} disabled={status !== 'CONNECTED'}>Echo</Button>
            <Button onClick={() => setLogs([])}>로그 지우기</Button>
          </Space.Compact>
          <Table
            columns={logColumns}
            dataSource={logs}
            rowKey="id"
            size="small"
            pagination={{ pageSize: 8 }}
            locale={{ emptyText: '수신한 메시지가 없습니다.' }}
          />
        </Col>

        {isAdmin && (
          <Col xs={24} lg={10}>
            <Card size="small" title={<span><NotificationOutlined style={{ marginRight: 6 }} />전체 공지</span>}
                  style={{ marginBottom: 16 }}>
              <Form form={noticeForm} layout="vertical" size="small" initialValues={{ level: 'INFO' }}
                    onFinish={handleNotice}>
                <Row gutter={8}>
                  <Col span={16}>
                    <Form.Item name="title" label="제목" rules={[{ required: true, message: '제목을 입력하세요' }]}>
                      <Input maxLength={100} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="level" label="수준"><Select options={LEVEL_OPTIONS} /></Form.Item>
                  </Col>
                </Row>
                <Form.Item name="message" label="내용" rules={[{ required: true, message: '내용을 입력하세요' }]}>
                  <Input.TextArea rows={2} maxLength={1000} />
                </Form.Item>
                <Button type="primary" htmlType="submit" icon={<SendOutlined />}>공지 발송</Button>
              </Form>
            </Card>

            <Card size="small" title={<span><SendOutlined style={{ marginRight: 6 }} />개인 알림</span>}
                  style={{ marginBottom: 16 }}>
              <Form form={notificationForm} layout="vertical" size="small" initialValues={{ level: 'INFO' }}
                    onFinish={handleNotification}>
                <Row gutter={8}>
                  <Col span={8}>
                    <Form.Item name="username" label="받는 사람" rules={[{ required: true, message: '아이디' }]}>
                      <Input placeholder="user1" />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item name="title" label="제목" rules={[{ required: true, message: '제목을 입력하세요' }]}>
                      <Input maxLength={100} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="level" label="수준"><Select options={LEVEL_OPTIONS} /></Form.Item>
                  </Col>
                </Row>
                <Form.Item name="message" label="내용" rules={[{ required: true, message: '내용을 입력하세요' }]}>
                  <Input.TextArea rows={2} maxLength={1000} />
                </Form.Item>
                <Button type="primary" htmlType="submit" icon={<SendOutlined />}>알림 발송</Button>
              </Form>
            </Card>

            <Card
              size="small"
              title={<span><TeamOutlined style={{ marginRight: 6 }} />접속자 현황 ({presence.length})</span>}
              extra={<Button size="small" icon={<ReloadOutlined />} onClick={fetchPresence}>새로고침</Button>}
            >
              <Table
                columns={presenceColumns}
                dataSource={presence}
                rowKey="sessionId"
                loading={presenceLoading}
                size="small"
                pagination={false}
                locale={{ emptyText: '접속자가 없습니다.' }}
              />
            </Card>
          </Col>
        )}
      </Row>
    </Card>
  );
};
