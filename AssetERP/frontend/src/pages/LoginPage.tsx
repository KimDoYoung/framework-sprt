import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, Typography, Alert, Select, Spin, message } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined, BankOutlined } from '@ant-design/icons';
import { authApi } from '../api/auth';
import { errorMessage } from '../api/client';
import { CompanyItem, TenantInfo, User } from '../types/auth';

const { Title, Text, Paragraph } = Typography;

interface LoginFormValues {
  companyCode?: string;
  username: string;
  password: string;
}

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
  const [loginError, setLoginError] = useState<string | null>(null);
  // 접속한 서브도메인의 회사 (AS-IS LoginPage: URL에서 회사 코드를 떼어 sys01_company 조회)
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [tenantError, setTenantError] = useState<string | null>(null);
  // admin 서브도메인에서만: 로그인할 회사 선택 목록 (AS-IS Sys01_Lookup_SelectSingle)
  const [companies, setCompanies] = useState<CompanyItem[]>([]);

  useEffect(() => {
    const loadTenant = async () => {
      try {
        const res = await authApi.getTenant();
        setTenant(res.data);
        if (res.data?.valid && res.data.admin) {
          const list = await authApi.getCompanies();
          setCompanies(list.data ?? []);
        }
      } catch (err: any) {
        setTenantError(errorMessage(err, '회사 정보 조회 실패'));
      }
    };
    loadTenant();
  }, []);

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setLoginError(null);
    try {
      const res = await authApi.login(values.username, values.password, values.companyCode);
      if (res.success && res.data) {
        message.success(`환영합니다, ${res.data.name}님!`);
        onClearNotice?.();
        onLoginSuccess(res.data);
      } else {
        setLoginError(res.message || '로그인에 실패했습니다.');
      }
    } catch (err: any) {
      setLoginError(errorMessage(err, '로그인 요청 중 오류가 발생했습니다.'));
    } finally {
      setLoading(false);
    }
  };

  const tenantValid = tenant?.valid === true;

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
          {tenantValid ? (
            <Text strong style={{ fontSize: 15 }}>
              <BankOutlined style={{ marginRight: 6 }} />
              {tenant!.admin ? 'AssetERP 관리자 (한국펀드서비스)' : tenant!.companyName}
            </Text>
          ) : (
            <Text type="secondary">JWT · 쿠키 인증 · 중복 로그인 차단 프로토타입</Text>
          )}
        </div>

        {/* 0. 서브도메인 판별 결과: 조회 중 / 조회 실패 / 등록되지 않은 회사 */}
        {!tenant && !tenantError && (
          <div style={{ textAlign: 'center', marginBottom: 20 }}><Spin tip="회사 정보 확인 중..." /></div>
        )}
        {tenantError && (
          <Alert message={tenantError} type="error" showIcon style={{ marginBottom: 20 }} />
        )}
        {tenant && !tenant.valid && (
          <Alert
            message="유효하지 않은 고객정보"
            description={<>
              <Text code>{tenant.host}</Text> 에 해당하는 회사(<Text code>{tenant.companyCode}</Text>)가 없거나 사용 중지되었습니다.
              <br />예) <Text code>kfstest.localhost</Text>, <Text code>admin.localhost</Text> 로 접속하세요.
            </>}
            type="error"
            showIcon
            style={{ marginBottom: 20 }}
          />
        )}

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
        {loginError && (
          <Alert
            message={loginError}
            type="error"
            showIcon
            closable
            onClose={() => setLoginError(null)}
            style={{ marginBottom: 20 }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={!tenantValid}
        >
          {/* admin 서브도메인: 로그인할 회사 선택 (미선택 시 admin 회사 = KFS 관리자) */}
          {tenant?.admin && (
            <Form.Item name="companyCode" label="회사">
              <Select
                size="large"
                allowClear
                showSearch
                placeholder="admin (관리자)"
                optionFilterProp="label"
                options={companies.map(c => ({ value: c.companyCode, label: `${c.companyCode} (${c.companyName})` }))}
              />
            </Form.Item>
          )}

          <Form.Item
            name="username"
            label="로그인 ID"
            rules={[{ required: true, message: '로그인 ID를 입력해주세요.' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="사번 (예: 000) 또는 관리자 ID"
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
              placeholder="비밀번호"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              로그인
            </Button>
          </Form.Item>
        </Form>

        <div style={{ marginTop: 8, textAlign: 'center' }}>
          <Paragraph type="secondary" style={{ fontSize: 12, margin: 0 }}>
            * 회사는 접속한 서브도메인(<Text code>{tenant?.companyCode ?? '-'}</Text>)으로 정해집니다.
            <br />* 사원(emp01_person)을 먼저 찾고, 없으면 회사관리자(sys02_user)로 로그인합니다.
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};
