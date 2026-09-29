import React, { useEffect, useState } from 'react';
import { ConfigProvider, Spin } from 'antd';
import koKR from 'antd/locale/ko_KR';
import { LoginPage } from './pages/LoginPage';
import { MainPage } from './pages/MainPage';
import { authApi } from './api/auth';
import { User } from './types/auth';

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // 앱 진입 시 기존 쿠키를 통한 세션 복원 시도
    const checkSession = async () => {
      try {
        const res = await authApi.getMe();
        if (res.success && res.data) {
          setUser(res.data);
        }
      } catch (err) {
        // 인증되지 않은 상태면 로그인 화면으로 이동
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    checkSession();
  }, []);

  if (initializing) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f0f2f5'
      }}>
        <Spin size="large" tip="세션 확인 중..." />
      </div>
    );
  }

  return (
    <ConfigProvider locale={koKR} theme={{
      token: {
        colorPrimary: '#1677ff',
        borderRadius: 6
      }
    }}>
      {user ? (
        <MainPage user={user} onLogout={() => setUser(null)} />
      ) : (
        <LoginPage onLoginSuccess={(u) => setUser(u)} />
      )}
    </ConfigProvider>
  );
};

export default App;
