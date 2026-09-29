import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Alert, Space, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { authApi } from '../api/auth';
import { User } from '../types/auth';

const { Title, Text, Paragraph } = Typography;

export interface LoginNotice {
  type: 'warning' | 'error' | 'info';
  message: string;
  description: string;
}

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  notice?: LoginNotice | null;
  onClearNotice?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, notice, onClearNotice }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (values: { username: string; password: string }) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await authApi.login(values.username, values.password);
      if (res.success && res.data) {
        message.success(`환영합니다, ${res.data.name}님!`);
        onClearNotice?.();
        onLoginSuccess(res.data);
      } else {
        setErrorMessage(res.message || '로그인에 실패했습니다.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || '로그인 요청 중 오류가 발생했습니다.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (username: string) => {
    form.setFieldsValue({
      username,
      password: '1111'
    });
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      padding: '20px'
    }}>
      <Card
        style={{ width: '100%', maxWidth: 440, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
        bordered={false}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <SafetyCertificateOutlined style={{ fontSize: 44, color: '#1677ff', marginBottom: 8 }} />
          <Title level={3} style={{ margin: 0 }}>AssetERP 보안 테스트</Title>
          <Text type="secondary">JWT · 쿠키 인증 · 중복 로그인 차단 프로토타입</Text>
        </div>

        {/* 1. 세션 만료 또는 중복 로그인 차단으로 튕겨져 나왔을 때의 안내 메시지 */}
        {notice && (
          <Alert
            message={<b>{notice.message}</b>}
            description={notice.description}
            type={notice.type}
            showIcon
            closable
            onClose={onClearNotice}
            style={{ marginBottom: 20 }}
          />
        )}

        {/* 2. 로그인 실패 에러 메시지 */}
        {errorMessage && (
          <Alert
            message={errorMessage}
            type="error"
            showIcon
            closable
            onClose={() => setErrorMessage(null)}
            style={{ marginBottom: 20 }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ username: 'admin', password: '1111' }}
        >
          <Form.Item
            name="username"
            label="아이디"
            rules={[{ required: true, message: '아이디를 입력해주세요.' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="admin / user1"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="비밀번호"
            rules={[{ required: true, message: '비밀번호를 입력해주세요.' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="1111"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              로그인
            </Button>
          </Form.Item>
        </Form>

        <Divider plain><Text type="secondary" style={{ fontSize: 12 }}>빠른 테스트 계정</Text></Divider>

        <Space direction="vertical" style={{ width: '100%' }}>
          <Button block onClick={() => handleQuickFill('admin')}>
            관리자 계정 (admin / 1111 - ROLE_ADMIN)
          </Button>
          <Button block onClick={() => handleQuickFill('user1')}>
            일반 계정 (user1 / 1111 - ROLE_USER)
          </Button>
        </Space>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Paragraph type="secondary" style={{ fontSize: 12, margin: 0 }}>
            * 패스워드는 테스트 환경 특성에 따라 평문 비교됩니다.
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};
