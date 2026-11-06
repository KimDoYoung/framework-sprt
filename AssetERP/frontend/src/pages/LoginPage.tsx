import React, { useCallback, useEffect, useState } from 'react';
import { Card, Form, Input, Button, Typography, Alert, Spin, Modal, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined, BankOutlined, WarningOutlined, SearchOutlined } from '@ant-design/icons';
import { authApi } from '../api/auth';
import { errorCode, errorMessage } from '../api/client';
import { CompanyItem, TenantInfo, User } from '../types/auth';
import { Sys25_Lookup_Password } from './sys/Sys25_Lookup_Password';
import { Sys25_Lookup_Reset } from './sys/Sys25_Lookup_Reset';
import { Sys01_Lookup_SelectSingle } from './sys/Sys01_Lookup_SelectSingle';
import { Company } from '../types/sys';

const { Title, Text, Paragraph } = Typography;

interface LoginFormValues {
  companyCode?: string;
  username: string;
  password?: string;
  rememberMe?: boolean;
}

/** 로그인 상태유지로 기억한 로그인 ID (AS-IS SessionCookies pc_save 의 loginId) */
const REMEMBER_ID_KEY = 'asseterp_remember_login_id';
const readRememberedId = (): string | null => { try { return localStorage.getItem(REMEMBER_ID_KEY); } catch { return null; } };
const writeRememberedId = (id: string | null) => {
  try { if (id) localStorage.setItem(REMEMBER_ID_KEY, id); else localStorage.removeItem(REMEMBER_ID_KEY); } catch { /* 기억 못 해도 로그인은 된다 */ }
};

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
  // 비밀번호 변경 창 (EE59, AS-IS LoginPage.changePassword L790-795) · 비밀번호 재설정 창 (EE60, AS-IS resetPassword L797-800)
  const [pwdTarget, setPwdTarget] = useState<{ companyCode: string; loginId: string; statusType: 'init' | 'modi'; noExtension: boolean } | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  // admin 서브도메인 회사 칸 (AS-IS subDomain TriggerField L218-241): 누르면 고객사 조회창, 칸에는 "코드 (회사명)"
  const [companyLookupOpen, setCompanyLookupOpen] = useState(false);
  const [companyLabel, setCompanyLabel] = useState<string | null>(null);
  /** 고객사 조회창의 조회 — 로그인 전이라 공개 회사 목록(/public/companies)에서 이름으로 거른다 (AS-IS selectByName '%이름%', 사용 중인 회사) */
  const searchPublicCompanies = useCallback(async (name: string): Promise<Company[]> => {
    const key = name.trim();
    return companies
      .filter(c => !key || c.companyName.includes(key))
      .map((c): Company => ({ companyId: c.companyId, locNm: c.companyCode, companyNm: c.companyName }));
  }, [companies]);
  // AS-IS checkCapsLock() L250-270: Caps Lock이 켜져 있으면 안내
  const [capsLock, setCapsLock] = useState(false);
  const onKeyCaps = (e: React.KeyboardEvent) => setCapsLock(e.getModifierState?.('CapsLock') ?? false);
  const remembered = readRememberedId();

  useEffect(() => {
    const loadTenant = async () => {
      try {
        const res = await authApi.getTenant();
        setTenant(res.data);
        if (res.data?.valid && res.data.admin) {
          const list = await authApi.getCompanies();
          setCompanies(list.data ?? []);
        }
      } catch (err) {
        setTenantError(errorMessage(err, '회사 정보 조회 실패'));
      }
    };
    loadTenant();
  }, []);

  /** AS-IS LoginPage.companyCode: 일반 회사는 접속한 서브도메인, admin에서는 고른 회사(안 고르면 admin) */
  const companyCodeOf = (values: { companyCode?: string }) => (tenant?.admin && values.companyCode ? values.companyCode : tenant?.companyCode ?? '');

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setLoginError(null);
    try {
      // AS-IS는 admin 서브도메인에서 "로그인 상태유지"를 감춘다(L114-137)
      const rememberMe = !tenant?.admin && values.rememberMe === true;
      const res = await authApi.login(values.username, values.password ?? '', values.companyCode, rememberMe);
      if (res.success && res.data) {
        writeRememberedId(tenant?.admin ? readRememberedId() : rememberMe ? values.username : null);
        const user = res.data;
        const proceed = () => {
          onClearNotice?.();
          onLoginSuccess(user);
        };
        // AS-IS getServiceResult() L487-514: 경과 80~89일 → "N일 남았습니다. 지금 변경하시겠습니까?" 예 = 비밀번호 변경(modi), 아니오 = 그대로 로그인
        if (user.passwordWarnDays != null) {
          Modal.confirm({
            title: '확인', width: 550, okText: '예', cancelText: '아니오',
            content: `비밀번호를 변경해 주세요. ${user.passwordWarnDays}일 남았습니다. 지금 변경하시겠습니까?`,
            onOk: async () => {
              // AS-IS는 이 질문 뒤에야 세션을 만든다 → TOBE는 받은 세션을 닫고 비밀번호 변경 창을 연다
              try { await authApi.logout(); } catch { /* 이미 끊겼어도 변경 창은 연다 */ }
              form.setFieldValue('password', undefined);
              setPwdTarget({ companyCode: companyCodeOf(values), loginId: values.username, statusType: 'modi', noExtension: false });
            },
            onCancel: proceed,
          });
        } else {
          proceed();
        }
      } else {
        setLoginError(res.message || '로그인에 실패했습니다.');
      }
    } catch (err) {
      const msg = errorMessage(err, '로그인 요청 중 오류가 발생했습니다.');
      setLoginError(msg);
      // AS-IS getServiceResult() L538-561: status 99 최초로그인/초기화 후 → init, 98 비밀번호 만료 → modi. 안내 확인 뒤 비밀번호 변경 창
      const code = errorCode(err);
      if (code === 'PASSWORD_INIT_REQUIRED' || code === 'PASSWORD_CHANGE_REQUIRED') {
        const statusType = code === 'PASSWORD_INIT_REQUIRED' ? 'init' : 'modi';
        Modal.confirm({
          title: '확인', content: msg, okText: '예', cancelButtonProps: { style: { display: 'none' } }, width: 450,
          onOk: () => {
            form.setFieldValue('password', undefined);   // changePassword() L791 passWordStr.setText(null)
            setPwdTarget({ companyCode: companyCodeOf(values), loginId: values.username, statusType, noExtension: false });
          },
        });
      }
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
          <Title level={3} style={{ margin: 0, letterSpacing: 6 }}>LOGIN</Title>
          {tenantValid && (
            <Text strong style={{ fontSize: 15 }}>
              <BankOutlined style={{ marginRight: 6 }} />
              {tenant!.admin ? 'AssetERP 관리자 (한국펀드서비스)' : tenant!.companyName}
            </Text>
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
          initialValues={{ username: remembered ?? undefined, rememberMe: remembered != null }}
        >
          {/* admin 서브도메인: 로그인할 회사 선택 (미선택 시 admin 회사 = KFS 관리자) */}
          {tenant?.admin && (
            <>
              <Form.Item name="companyCode" hidden><Input /></Form.Item>
              <Form.Item label="회사">
                {/* AS-IS subDomain: 직접 입력 못 함(setEditable(false)), 트리거를 누르면 Sys01_Lookup_SelectSingle */}
                <Input
                  size="large"
                  readOnly
                  value={companyLabel ?? undefined}
                  placeholder="admin (관리자)"
                  prefix={<BankOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  suffix={<SearchOutlined />}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setCompanyLookupOpen(true)}
                />
              </Form.Item>
            </>
          )}

          <Form.Item
            name="username"
            label="로그인 ID"
            rules={[{ required: true, message: '로그인 ID를 입력해주세요.' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="로그인 ID"
              size="large"
              autoFocus
              onKeyDown={onKeyCaps}
              onKeyUp={onKeyCaps}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="비밀번호"
          >
            {/* AS-IS memoDesc L293: 신규 사용자·초기화 사용자는 ID만 넣고 [로그인] → 서버가 비밀번호 등록 창으로 보낸다 (그래서 필수 아님) */}
            <Input.Password
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="비밀번호"
              size="large"
              onKeyDown={onKeyCaps}
              onKeyUp={onKeyCaps}
            />
          </Form.Item>
          {capsLock && (
            <Text type="warning" style={{ display: 'block', marginTop: -12, marginBottom: 12 }}>
              <WarningOutlined /> Caps Lock이 켜져 있습니다
            </Text>
          )}

          {/* AS-IS autoLoginCBox "로그인 상태유지" L289, L325 — admin 서브도메인에서는 감춘다 */}
          {!tenant?.admin && (
            <Form.Item name="rememberMe" valuePropName="checked" style={{ marginBottom: 0 }}>
              <Checkbox>로그인 상태유지</Checkbox>
            </Form.Item>
          )}

          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              로그인
            </Button>
          </Form.Item>
        </Form>

        {/* AS-IS 로그인 화면의 [비밀번호 재설정] (L307 resetPassword()) */}
        <div style={{ textAlign: 'center' }}>
          <Button type="link" disabled={!tenantValid} onClick={() => setResetOpen(true)}>비밀번호 재설정</Button>
        </div>

        {/* AS-IS 안내 문구 L290-295 (chromeDesc·loginDesc·memoDesc·alarmDesc) */}
        <div style={{ marginTop: 8 }}>
          <Paragraph type="secondary" style={{ fontSize: 12, margin: 0 }}>
            ※ Login ID는 사원번호(예:000)를 사용 바랍니다.
            <br />※ 신규사용자 및 비밀번호 초기화를 진행한 사용자는 Login ID만 입력 후 [로그인] 버튼을 클릭바랍니다.
            <br />※ 매일 20시~익일 8시까지 시스템 점검이 진행되며, 서비스 이용이 제한될 수 있습니다.
          </Paragraph>
        </div>
      </Card>
      {/* [EE60] 비밀번호 재설정 → 인증번호 확인 뒤 비밀번호 변경(init, 3개월 연장 없음 = openNoExtension L58-65) */}
      <Sys25_Lookup_Reset
        open={resetOpen}
        companyCode={companyCodeOf(form.getFieldsValue())}
        onVerified={empNo => setPwdTarget({ companyCode: companyCodeOf(form.getFieldsValue()), loginId: empNo, statusType: 'init', noExtension: true })}
        onClose={() => setResetOpen(false)}
      />
      {/* AS-IS L225-238: 고르면 "코드 (회사명)", 취소하면 "admin (관리자)"로 되돌린다 */}
      <Sys01_Lookup_SelectSingle
        open={companyLookupOpen}
        search={searchPublicCompanies}
        onResult={company => {
          setCompanyLookupOpen(false);
          if (company) {
            form.setFieldValue('companyCode', company.locNm);
            setCompanyLabel(`${company.locNm} (${company.companyNm})`);
          } else {
            form.setFieldValue('companyCode', undefined);
            setCompanyLabel(null);
          }
        }}
      />
      <Sys25_Lookup_Password
        open={pwdTarget != null}
        companyCode={pwdTarget?.companyCode ?? ''}
        loginId={pwdTarget?.loginId ?? ''}
        statusType={pwdTarget?.statusType ?? 'modi'}
        noExtension={pwdTarget?.noExtension}
        onClose={() => setPwdTarget(null)}
      />
    </div>
  );
};
