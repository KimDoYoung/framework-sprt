import React, { useEffect, useState } from 'react';
import {
  Layout,
  Card,
  Typography,
  Button,
  Tag,
  Descriptions,
  Table,
  Upload,
  message,
  Space,
  Row,
  Col,
  Alert,
  Tooltip,
  Progress,
  List
} from 'antd';
import {
  LogoutOutlined,
  UploadOutlined,
  DownloadOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  FileDoneOutlined,
  SyncOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  ApiOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { authApi } from '../api/auth';
import { fileApi } from '../api/file';
import { testApi } from '../api/test';
import { onTokenRefresh, notifySessionTerminated } from '../api/client';
import { User, FileItem } from '../types/auth';
import { UserLockCard } from '../components/UserLockCard';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

interface MainPageProps {
  user: User;
  onLogout: () => void;
}

interface TokenExpiry {
  accessAt: number;
  refreshAt: number;
}

// 서버가 내려준 "남은 시간(ms)"을 클라이언트 시계 기준 만료 시각으로 변환 (서버와의 시계 오차 영향 없음)
const toExpiry = (u: User): TokenExpiry => {
  const now = Date.now();
  return { accessAt: now + u.accessTokenExpiresIn, refreshAt: now + u.refreshTokenExpiresIn };
};

const remainSec = (at: number, now: number) => Math.max(0, Math.ceil((at - now) / 1000));

interface PingLogItem {
  id: number;
  time: string;
  status: 'SUCCESS' | 'FAIL';
  detail: string;
  wasRefreshed: boolean;
  durationMs: number;
}

export const MainPage: React.FC<MainPageProps> = ({ user, onLogout }) => {
  const [currentUser, setCurrentUser] = useState<User>(user);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [fileLoading, setFileLoading] = useState(false);
  const [sessionCheckLoading, setSessionCheckLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [sessionAlert, setSessionAlert] = useState<{ type: 'success' | 'info' | 'warning' | 'error'; message: string; description?: string } | null>(null);

  // 토큰 타이머: 서버 응답 기준 만료 시각에서 매초 남은 시간을 계산
  const [expiry, setExpiry] = useState<TokenExpiry>(() => toExpiry(user));
  const [now, setNow] = useState<number>(Date.now());
  const accessRemainSec = remainSec(expiry.accessAt, now);
  const refreshRemainSec = remainSec(expiry.refreshAt, now);
  // 서버 설정 수명 (jwt.access-token-expiration / jwt.refresh-token-expiration)
  const accessLifetimeSec = Math.round(currentUser.accessTokenLifetime / 1000);
  const refreshLifetimeSec = Math.round(currentUser.refreshTokenLifetime / 1000);

  // 서버 통신 테스트 상태
  const [pingLoading, setPingLoading] = useState(false);
  const [lastPingResult, setLastPingResult] = useState<{
    callSeq: number;
    time: string;
    serverTime: string;
    message: string;
    wasRefreshed: boolean;
    durationMs: number;
  } | null>(null);
  const [pingLogs, setPingLogs] = useState<PingLogItem[]>([]);

  const applySession = (u: User) => {
    setCurrentUser(u);
    setExpiry(toExpiry(u));
    setNow(Date.now());
  };

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 세션(Refresh Token) 수명이 모두 경과하면 자동 세션 만료 처리 -> 로그인 화면 이동
    if (refreshRemainSec === 0) {
      notifySessionTerminated('EXPIRED');
    }
  }, [refreshRemainSec]);

  useEffect(() => {
    // Axios Silent Refresh 발생 시 리스너
    const unsubscribe = onTokenRefresh((refreshedData: User) => {
      if (!refreshedData) return;
      applySession(refreshedData);
      const accessSec = Math.round(refreshedData.accessTokenLifetime / 1000);
      const refreshSec = Math.round(refreshedData.refreshTokenLifetime / 1000);
      message.info(`🔄 Access Token(${accessSec}초) 만료 -> Refresh Token으로 자동 갱신되었습니다!`);
      setSessionAlert({
        type: 'info',
        message: '자동 토큰 갱신 (Silent Refresh) 완료',
        description: `Access Token이 만료되었으나, Refresh Token으로 새 토큰을 자동 재발급받아 세션이 ${refreshSec}초 연장되었습니다.`
      });
    });

    return () => unsubscribe();
  }, []);

  const fetchFiles = async () => {
    setFileLoading(true);
    try {
      const res = await fileApi.list();
      if (res.success && res.data) {
        setFiles(res.data);
      }
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setFileLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleApiError = (err: any) => {
    // 401(세션 종료)은 axios 인터셉터가 이미 로그인 화면 전환을 처리함
    if (err.response?.status === 401) return;
    message.error(err.response?.data?.message || err.message || '요청 처리 실패');
  };

  const handleDownload = async (record: FileItem) => {
    try {
      await fileApi.download(record.fileId, record.originalFilename);
    } catch (err: any) {
      handleApiError(err);
    }
  };

  // 사용자가 요청한 핵심 기능: 서버로 자유롭게 통신하는 테스트 버튼
  const handlePing = async () => {
    setPingLoading(true);
    const startTime = performance.now();
    let refreshedDuringThisCall = false;

    // 이번 호출 중에 silent refresh가 일어났는지 감지
    const unsub = onTokenRefresh(() => {
      refreshedDuringThisCall = true;
    });

    try {
      const res = await testApi.ping();
      const durationMs = Math.round(performance.now() - startTime);

      if (res.success && res.data) {
        const clientTime = new Date().toLocaleTimeString();
        setLastPingResult({
          callSeq: res.data.callSeq,
          time: clientTime,
          serverTime: res.data.serverTime,
          message: res.data.message,
          wasRefreshed: refreshedDuringThisCall,
          durationMs
        });

        setPingLogs(prev => [
          {
            id: Date.now(),
            time: clientTime,
            status: 'SUCCESS',
            detail: `호출 #${res.data.callSeq} - 서버 시간: ${res.data.serverTime}`,
            wasRefreshed: refreshedDuringThisCall,
            durationMs
          },
          ...prev.slice(0, 9) // 최근 10개 보관
        ]);

        if (refreshedDuringThisCall) {
          message.success(`[자동 갱신] Access Token(${accessLifetimeSec}초) 만료 후 Refresh Token으로 자동 복구되어 정상 통신 성공! (${durationMs}ms)`);
        } else {
          message.success(`[통신 성공] 세션 유효 - 서버 응답 수신 (${durationMs}ms)`);
        }
      }
    } catch (err: any) {
      const durationMs = Math.round(performance.now() - startTime);
      const clientTime = new Date().toLocaleTimeString();
      const errorMsg = err.response?.data?.message || err.message || '통신 실패';

      setPingLogs(prev => [
        {
          id: Date.now(),
          time: clientTime,
          status: 'FAIL',
          detail: `실패: ${errorMsg}`,
          wasRefreshed: false,
          durationMs
        },
        ...prev.slice(0, 9)
      ]);

      handleApiError(err);
    } finally {
      unsub();
      setPingLoading(false);
    }
  };

  const handleSessionCheck = async () => {
    setSessionCheckLoading(true);
    try {
      const res = await authApi.getMe();
      if (res.success && res.data) {
        applySession(res.data);
        message.success('현재 세션이 정상 유지 중입니다.');
        setSessionAlert({
          type: 'success',
          message: '정상 세션 유지 중',
          description: `사용자: ${res.data.name} (JTI: ${res.data.jti})`
        });
      }
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setSessionCheckLoading(false);
    }
  };

  const handleManualRefresh = async () => {
    setRefreshLoading(true);
    try {
      const res = await authApi.refresh();
      if (res.success && res.data) {
        applySession(res.data);
        message.success(`수동 토큰 갱신(Refresh) 성공! (Access Token ${accessLifetimeSec}초 리셋)`);
        setSessionAlert({
          type: 'success',
          message: '토큰 수동 갱신 성공',
          description: `Refresh Token을 사용하여 새 Access Token(${accessLifetimeSec}초)을 재발급받았습니다.`
        });
      }
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setRefreshLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      message.info('로그아웃되었습니다.');
    } catch (err) {
      console.error(err);
    } finally {
      onLogout();
    }
  };

  const fileColumns = [
    {
      title: '파일명',
      dataIndex: 'originalFilename',
      key: 'originalFilename',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Tika 감지 MIME Type (Magic Number)',
      dataIndex: 'detectedMimeType',
      key: 'detectedMimeType',
      render: (mime: string) => <Tag color="cyan">{mime}</Tag>
    },
    {
      title: '선언된 Content-Type',
      dataIndex: 'declaredContentType',
      key: 'declaredContentType',
      render: (type: string) => <Text type="secondary">{type || '-'}</Text>
    },
    {
      title: '파일 크기',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
      }
    },
    {
      title: '업로더',
      dataIndex: 'uploadedBy',
      key: 'uploadedBy',
      render: (uploader: string) => <Tag color="blue">{uploader}</Tag>
    },
    {
      title: '업로드 일시',
      dataIndex: 'uploadedAt',
      key: 'uploadedAt',
      render: (dt: string) => (dt ? dt.replace('T', ' ').substring(0, 19) : '-')
    },
    {
      title: '다운로드',
      key: 'action',
      render: (_: any, record: FileItem) => (
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          size="small"
          onClick={() => handleDownload(record)}
        >
          다운로드
        </Button>
      )
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Header style={{
        background: '#001529',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <SafetyCertificateOutlined style={{ color: '#1890ff', fontSize: 24 }} />
          <Title level={4} style={{ color: '#fff', margin: 0 }}>
            AssetERP 차세대 보안 테스트 (Security Test)
          </Title>
        </div>
        <Space size="middle">
          <Text style={{ color: '#fff' }}>
            <UserOutlined style={{ marginRight: 6 }} />
            {currentUser.name} ({currentUser.username})
          </Text>
          {currentUser.roles?.map(r => (
            <Tag color={r === 'ROLE_ADMIN' ? 'red' : 'green'} key={r}>{r}</Tag>
          ))}
          <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
            로그아웃
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: '24px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        {/* 1. 토큰 만료 상태 배너 카드 */}
        <Card style={{ marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <Row gutter={[24, 16]} align="middle">
            <Col xs={24} md={10}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <ClockCircleOutlined style={{ fontSize: 24, color: accessRemainSec > 0 ? '#1890ff' : '#ff4d4f' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text strong>Access Token (수명: {accessLifetimeSec}초)</Text>
                    <Text type={accessRemainSec > 0 ? 'secondary' : 'danger'}>
                      {accessRemainSec > 0 ? `${accessRemainSec}초 남음` : '만료됨 (Refresh로 즉시 유지)'}
                    </Text>
                  </div>
                  <Progress
                    percent={Math.round((accessRemainSec / accessLifetimeSec) * 100)}
                    status={accessRemainSec > 0 ? 'active' : 'exception'}
                    showInfo={false}
                    strokeColor={accessRemainSec > 3 ? '#1890ff' : '#faad14'}
                  />
                </div>
              </div>
            </Col>

            <Col xs={24} md={10}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <ThunderboltOutlined style={{ fontSize: 24, color: refreshRemainSec > 0 ? '#52c41a' : '#ff4d4f' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text strong>Refresh Token (유휴 유지: {refreshLifetimeSec}초)</Text>
                    <Text type={refreshRemainSec > 0 ? 'secondary' : 'danger'}>
                      {refreshRemainSec > 0 ? `${refreshRemainSec}초 남음` : '완전 만료'}
                    </Text>
                  </div>
                  <Progress
                    percent={Math.round((refreshRemainSec / refreshLifetimeSec) * 100)}
                    status={refreshRemainSec > 0 ? 'normal' : 'exception'}
                    showInfo={false}
                    strokeColor="#52c41a"
                  />
                </div>
              </div>
            </Col>

            <Col xs={24} md={4} style={{ textAlign: 'right' }}>
              <Button
                type="default"
                icon={<SyncOutlined spin={refreshLoading} />}
                onClick={handleManualRefresh}
                loading={refreshLoading}
              >
                수동 갱신
              </Button>
            </Col>
          </Row>
        </Card>

        {/* 2. 핵심 요구사항: 서버 통신 테스트 전용 인터랙티브 카드 */}
        <Card
          style={{
            marginBottom: 20,
            boxShadow: '0 4px 14px rgba(22, 119, 255, 0.12)',
            border: '2px solid #91caff',
            background: 'linear-gradient(to right, #f6faff, #ffffff)'
          }}
        >
          <Row gutter={[24, 20]} align="middle">
            <Col xs={24} md={14}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <ApiOutlined style={{ fontSize: 36, color: '#1677ff', marginTop: 4 }} />
                <div>
                  <Title level={4} style={{ margin: '0 0 6px 0', color: '#0958d9' }}>
                    서버 자유 통신 테스트 ({refreshLifetimeSec}초 세션 유지 검증)
                  </Title>
                  <Paragraph style={{ margin: 0, color: '#4b5563', fontSize: 13 }}>
                    로그인 후 <b>{accessLifetimeSec}초가 지나 Access Token이 만료되어도</b>, {refreshLifetimeSec}초의 Refresh Token 기간 안에는 아래 버튼을 클릭하면
                    <b> 백그라운드 자동 갱신(Silent Refresh)</b>이 동작하여 끊김 없이 <b>정상 200 OK 통신</b>이 이루어집니다!
                  </Paragraph>
                </div>
              </div>
            </Col>

            <Col xs={24} md={10} style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                size="large"
                icon={<ThunderboltOutlined />}
                loading={pingLoading}
                onClick={handlePing}
                style={{
                  height: 48,
                  padding: '0 28px',
                  fontSize: 16,
                  fontWeight: 600,
                  boxShadow: '0 4px 10px rgba(22, 119, 255, 0.3)'
                }}
              >
                서버 통신 테스트 (Ping)
              </Button>
            </Col>
          </Row>

          {/* 최근 통신 결과 요약 */}
          {lastPingResult && (
            <div style={{
              marginTop: 16,
              padding: '12px 16px',
              borderRadius: 8,
              background: lastPingResult.wasRefreshed ? '#f6ffed' : '#e6f4ff',
              border: `1px solid ${lastPingResult.wasRefreshed ? '#b7eb8f' : '#91caff'}`
            }}>
              <Row justify="space-between" align="middle">
                <Space size="middle">
                  {lastPingResult.wasRefreshed ? (
                    <Tag color="green" icon={<CheckCircleOutlined />}>토큰 자동 갱신 후 성공 (Silent Refresh)</Tag>
                  ) : (
                    <Tag color="blue" icon={<CheckCircleOutlined />}>기존 세션 유지 성공</Tag>
                  )}
                  <Text strong>{lastPingResult.message}</Text>
                </Space>
                <Space>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    서버 시간: <b>{lastPingResult.serverTime}</b> | 소요시간: <b>{lastPingResult.durationMs}ms</b>
                  </Text>
                </Space>
              </Row>
            </div>
          )}

          {/* 통신 이력 로그 (최근 10건) */}
          {pingLogs.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <Text strong style={{ fontSize: 12, color: '#6b7280' }}>실시간 통신 로그 이력:</Text>
              <List
                size="small"
                bordered
                style={{ marginTop: 8, background: '#fff', maxHeight: 160, overflowY: 'auto' }}
                dataSource={pingLogs}
                renderItem={item => (
                  <List.Item style={{ padding: '6px 12px' }}>
                    <Row justify="space-between" align="middle" style={{ width: '100%' }}>
                      <Space size="small">
                        {item.status === 'SUCCESS' ? (
                          <CheckCircleOutlined style={{ color: '#52c41a' }} />
                        ) : (
                          <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                        )}
                        <Text code style={{ fontSize: 11 }}>{item.time}</Text>
                        <Text style={{ fontSize: 12 }}>{item.detail}</Text>
                        {item.wasRefreshed && (
                          <Tag color="cyan" style={{ fontSize: 10, padding: '0 4px' }}>Silent Refreshed</Tag>
                        )}
                      </Space>
                      <Text type="secondary" style={{ fontSize: 11 }}>{item.durationMs}ms</Text>
                    </Row>
                  </List.Item>
                )}
              />
            </div>
          )}
        </Card>

        {sessionAlert && (
          <Alert
            type={sessionAlert.type}
            message={sessionAlert.message}
            description={sessionAlert.description}
            showIcon
            closable
            onClose={() => setSessionAlert(null)}
            style={{ marginBottom: 20 }}
          />
        )}

        <Row gutter={[20, 20]}>
          {/* 3. JWT 및 세션 정보 카드 */}
          <Col xs={24} lg={12}>
            <Card
              title={<span><SafetyCertificateOutlined style={{ marginRight: 8, color: '#1677ff' }} />JWT 세션 상세 (Payload & JTI)</span>}
              bordered={false}
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: '100%' }}
              extra={
                <Tooltip title="API 호출을 통해 Redis JTI 및 토큰 검증">
                  <Button
                    icon={<ReloadOutlined spin={sessionCheckLoading} />}
                    size="small"
                    onClick={handleSessionCheck}
                  >
                    세션 확인
                  </Button>
                </Tooltip>
              }
            >
              <Descriptions size="small" column={1} bordered>
                <Descriptions.Item label="User ID (sub)">{currentUser.userId}</Descriptions.Item>
                <Descriptions.Item label="아이디 (username)">{currentUser.username}</Descriptions.Item>
                <Descriptions.Item label="성명 (name)">{currentUser.name}</Descriptions.Item>
                <Descriptions.Item label="회사 ID (company_id)">{currentUser.companyId}</Descriptions.Item>
                <Descriptions.Item label="부서 ID (dept_id)">{currentUser.deptId || 'D101'}</Descriptions.Item>
                <Descriptions.Item label="권한 (roles)">
                  {currentUser.roles?.join(', ')}
                </Descriptions.Item>
                <Descriptions.Item label="세션 고유키 (jti)">
                  <Text code copyable>{currentUser.jti}</Text>
                </Descriptions.Item>
              </Descriptions>

              <div style={{ marginTop: 16 }}>
                <Paragraph type="secondary" style={{ fontSize: 12, margin: 0 }}>
                  💡 <b>이중 토큰 및 자동 갱신 동작 원리:</b><br />
                  - <b>{accessLifetimeSec}초 경과</b>: Access Token이 만료되어도 <b>[서버 통신 테스트]</b>를 누르면 백엔드의 <code>/api/auth/refresh</code>를 자동 호출하여 <b>새 Access Token으로 투명하게 갱신</b>되고 세션이 {refreshLifetimeSec}초 연장됩니다.<br />
                  - <b>{refreshLifetimeSec}초 경과</b>: 아무런 요청 없이 {refreshLifetimeSec}초가 지나면 Refresh Token까지 만료되어 완전한 재로그인이 요구됩니다.
                </Paragraph>
              </div>
            </Card>
          </Col>

          {/* 4. 중복 로그인 차단 테스트 안내 */}
          <Col xs={24} lg={12}>
            <Card
              title={<span><ExclamationCircleOutlined style={{ marginRight: 8, color: '#fa8c16' }} />동시 접속(멀티 로그인) 즉시 차단 테스트</span>}
              bordered={false}
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: '100%' }}
            >
              <Alert
                type="info"
                showIcon
                message="JTI 기반 동시 접속 제어 원리"
                description={
                  <div>
                    <Paragraph style={{ margin: 0, fontSize: 13 }}>
                      1. 로그인 시마다 고유한 <b>JTI</b>가 Redis에 활성 세션으로 등록됩니다.<br />
                      2. <b>시크릿 창</b>에서 동일 계정(<code>{currentUser.username}</code>)으로 새로 로그인하면 Redis의 JTI가 갱신됩니다.<br />
                      3. 이전 창(현재 창)에서 상단 <b>[서버 통신 테스트]</b> 버튼을 누르면, 만료 여부와 무관하게 <b>즉시 401 차단(MULTI_LOGIN_DETECTED)</b>되며 Refresh조차 거부됩니다!
                    </Paragraph>
                  </div>
                }
              />

              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <Space>
                  <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    loading={sessionCheckLoading}
                    onClick={handleSessionCheck}
                  >
                    현재 세션 유효성 검사 (API 호출)
                  </Button>
                </Space>
              </div>
            </Card>
          </Col>

          {/* 5. 계정 잠금 관리 (관리자 전용) */}
          {currentUser.roles?.includes('ROLE_ADMIN') && (
            <Col span={24}>
              <UserLockCard />
            </Col>
          )}

          {/* 6. 파일 업로드 및 Apache Tika Magic Number 검사 */}
          <Col span={24}>
            <Card
              title={<span><FileDoneOutlined style={{ marginRight: 8, color: '#52c41a' }} />파일 업로드 & Apache Tika Magic Number MIME 검사</span>}
              bordered={false}
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              extra={
                <Upload
                  showUploadList={false}
                  customRequest={async (options) => {
                    const { file, onSuccess, onError } = options;
                    try {
                      const res = await fileApi.upload(file as File);
                      if (res.success && res.data) {
                        message.success(`업로드 성공! [Tika 감지 MIME: ${res.data.detectedMimeType}]`);
                        onSuccess?.(res.data);
                        fetchFiles();
                      } else {
                        message.error(res.message);
                        onError?.(new Error(res.message));
                      }
                    } catch (err: any) {
                      handleApiError(err);
                      onError?.(err);
                    }
                  }}
                >
                  <Button type="primary" icon={<UploadOutlined />}>
                    파일 업로드 (최대 500MB)
                  </Button>
                </Upload>
              }
            >
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">
                  * {accessLifetimeSec}초가 지난 후에도 파일을 업로드하면 <b>자동 토큰 갱신(Silent Refresh)</b> 후 정상 업로드됩니다.
                </Text>
              </div>

              <Table
                columns={fileColumns}
                dataSource={files}
                rowKey="fileId"
                loading={fileLoading}
                pagination={{ pageSize: 5 }}
                locale={{ emptyText: '업로드된 파일이 없습니다. 상단 [파일 업로드] 버튼을 눌러 테스트해보세요.' }}
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};
