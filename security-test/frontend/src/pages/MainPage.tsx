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
  Tooltip
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
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { authApi } from '../api/auth';
import { fileApi } from '../api/file';
import { User, FileItem } from '../types/auth';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

interface MainPageProps {
  user: User;
  onLogout: () => void;
}

export const MainPage: React.FC<MainPageProps> = ({ user, onLogout }) => {
  const [currentUser, setCurrentUser] = useState<User>(user);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [fileLoading, setFileLoading] = useState(false);
  const [sessionCheckLoading, setSessionCheckLoading] = useState(false);
  const [sessionAlert, setSessionAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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
    const errorMsg = err.response?.data?.message || err.message || '요청 처리 실패';
    if (err.response?.status === 401) {
      message.error(errorMsg);
      setSessionAlert({
        type: 'error',
        message: `세션이 차단되었습니다: ${errorMsg}`
      });
    } else {
      message.error(errorMsg);
    }
  };

  const handleSessionCheck = async () => {
    setSessionCheckLoading(true);
    setSessionAlert(null);
    try {
      const res = await authApi.getMe();
      if (res.success && res.data) {
        setCurrentUser(res.data);
        message.success('현재 세션이 유효합니다.');
        setSessionAlert({
          type: 'success',
          message: `정상 세션 유지 중 (JTI: ${res.data.jti})`
        });
      }
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setSessionCheckLoading(false);
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
      render: (mime: string) => (
        <Tag color="cyan">{mime}</Tag>
      )
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
          href={fileApi.getDownloadUrl(record.fileId)}
          target="_blank"
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
        {sessionAlert && (
          <Alert
            type={sessionAlert.type}
            message={sessionAlert.message}
            showIcon
            closable
            style={{ marginBottom: 20 }}
          />
        )}

        <Row gutter={[20, 20]}>
          {/* 1. JWT 및 세션 정보 카드 */}
          <Col xs={24} lg={12}>
            <Card
              title={<span><SafetyCertificateOutlined style={{ marginRight: 8, color: '#1677ff' }} />JWT 세션 상세 (Payload & JTI)</span>}
              bordered={false}
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: '100%' }}
              extra={
                <Tooltip title="Redis JTI 및 토큰 검증">
                  <Button
                    icon={<SyncOutlined spin={sessionCheckLoading} />}
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
                <Text type="secondary" style={{ fontSize: 12 }}>
                  * JWT 토큰은 HttpOnly 쿠키(ACCESS_TOKEN)로 관리되며, 브라우저 스크립트 탈취(XSS)를 원천 방지합니다.
                </Text>
              </div>
            </Card>
          </Col>

          {/* 2. 중복 로그인 차단 테스트 안내 */}
          <Col xs={24} lg={12}>
            <Card
              title={<span><ExclamationCircleOutlined style={{ marginRight: 8, color: '#fa8c16' }} />멀티 로그인(동시 접속) 즉시 차단 테스트</span>}
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
                      1. 로그인 시마다 새로운 고유 <b>JTI(UUID)</b>가 생성되어 Redis에 등록됩니다.<br />
                      2. <b>다른 브라우저나 시크릿 창</b>에서 동일 계정(<code>{currentUser.username}</code>)으로 새로 로그인하면 Redis의 JTI가 갱신됩니다.<br />
                      3. 이전 브라우저(현재 창)에서 아래 <b>[세션 확인 / 새로고침]</b> 버튼을 누르면 즉시 <b>401 Unauthorized (차단)</b> 처리됩니다!
                    </Paragraph>
                  </div>
                }
              />

              <div style={{ marginTop: 20, textAlign: 'center' }}>
                <Space>
                  <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    loading={sessionCheckLoading}
                    onClick={handleSessionCheck}
                  >
                    현재 창 세션 유효성 검사 (API 호출)
                  </Button>
                </Space>
              </div>
            </Card>
          </Col>

          {/* 3. 파일 업로드 및 Apache Tika Magic Number 검사 */}
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
                  * 업로드 시 <b>Apache Tika</b> 라이브러리가 파일 바이너리의 Magic Number를 읽어 실제 MIME 타입을 검증하고 로그/목록에 기록합니다. (위장 확장자 방지)
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
