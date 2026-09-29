import React, { useEffect, useState } from 'react';
import { ConfigProvider, Spin } from 'antd';
import koKR from 'antd/locale/ko_KR';
import { LoginPage, LoginNotice } from './pages/LoginPage';
import { MainPage } from './pages/MainPage';
import { authApi } from './api/auth';
import { onSessionTerminated, SessionTerminateReason } from './api/client';
import { User } from './types/auth';

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [sessionNotice, setSessionNotice] = useState<LoginNotice | null>(null);

  useEffect(() => {
    // 세션 종료(중복 로그인 차단 또는 리프레시 토큰 완전 만료) 이벤트 리스너
    const unsubscribe = onSessionTerminated((reason: SessionTerminateReason) => {
      setUser(null); // 로그인 페이지로 즉시 이동

      if (reason === 'MULTI_LOGIN') {
        setSessionNotice({
          type: 'error',
          message: '동시 접속 차단 안내',
          description: '다른 기기 또는 브라우저에서 동일한 계정으로 새로 로그인되어 현재 세션이 즉시 종료되었습니다.'
        });
      } else {
        setSessionNotice({
          type: 'warning',
          message: '세션 만료 안내',
          description: '세션 유효시간(리프레시 토큰 1분)이 모두 만료되었습니다. 안전을 위해 다시 로그인해주세요.'
        });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // 앱 진입 시 기존 쿠키를 통한 세션 복원 시도
    const checkSession = async () => {
      try {
        const res = await authApi.getMe();
        if (res.success && res.data) {
          setUser(res.data);
        }
      } catch (err) {
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
        <MainPage
          user={user}
          onLogout={() => {
            setSessionNotice(null);
            setUser(null);
          }}
        />
      ) : (
        <LoginPage
          notice={sessionNotice}
          onClearNotice={() => setSessionNotice(null)}
          onLoginSuccess={(u) => {
            setSessionNotice(null);
            setUser(u);
          }}
        />
      )}
    </ConfigProvider>
  );
};

export default App;
