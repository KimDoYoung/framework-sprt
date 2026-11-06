import React, { useEffect, useRef, useState } from 'react';
import { ConfigProvider, Spin } from 'antd';
import koKR from 'antd/locale/ko_KR';
import { LoginPage, LoginNotice } from './pages/LoginPage';
import MainFrame from './MainFrame';
import { authApi } from './api/auth';
import { onSessionTerminated, SessionTerminateReason } from './api/client';
import { User } from './types/auth';
import { realtime } from './ws/stompClient';
import { appSettingsStorage } from './utils/storage';
import { sysSecondaryAuthApi } from './api/sys';
import { Sys83_Lookup_TempPassword } from './pages/sys/Sys83_Lookup_TempPassword';
import { Emp04_Lookup_AddTitleList } from './pages/emp/Emp04_Lookup_AddTitleList';
import { empAddTitleApi } from './api/emp';
import { LoginUserContext } from './hooks/useLoginUser';
import { loginGates } from './utils/loginGates';

/**
 * 2차 인증 문 (EE64, AS-IS LoginPage.checkExt L594-606): 회사가 2차 인증을 쓰면(회사 설정, 회사관리자 제외) 인증번호를 확인한 뒤에야 화면을 연다.
 * 닫으면(X) AS-IS처럼 화면이 열리지 않는다 → 로그아웃. 새로고침은 같은 로그인(jti) 안에서는 다시 묻지 않는다.
 * ※ AS-IS와 같게 화면에서만 막는다(서버가 API를 막지는 않는다).
 */
const SecondaryAuthGate: React.FC<{ user: User; onLogout: () => void; children: React.ReactNode }> = ({ user, onLogout, children }) => {
  const [state, setState] = useState<'checking' | 'need' | 'ok'>(loginGates.isPassed('secondaryAuth', user.jti) ? 'ok' : 'checking');

  useEffect(() => {
    if (state !== 'checking') return;
    let alive = true;
    sysSecondaryAuthApi.isRequired()
      .then(required => { if (alive) setState(required ? 'need' : 'ok'); })
      .catch(() => { if (alive) setState('ok'); }); // 확인 실패는 막지 않는다(서버는 어차피 API를 막지 않는다)
    return () => { alive = false; };
  }, [state]);

  if (state === 'ok') return <>{children}</>;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      {state === 'checking' && <Spin size="large" />}
      <Sys83_Lookup_TempPassword
        open={state === 'need'}
        onVerified={() => { loginGates.pass('secondaryAuth', user.jti); setState('ok'); }}
        onClose={async () => { try { await authApi.logout(); } finally { onLogout(); } }}
      />
    </div>
  );
};

/**
 * 로그인 선택 문 (AS-IS LoginPage.openFrame3 L741-766): 회사관리자가 아니면 emp.Emp04_AddTitle.getAddTitleList(본업무 + 유효한 겸직)를 읽어
 * 1건이 아니면 '로그인 선택' 창(Emp04_Lookup_AddTitleList.login)을 띄운다. 닫기(X)가 없어 하나를 골라야 MainFrame이 열린다.
 * 다른 사원(겸직)을 고르면 /auth/switch-title 로 새 토큰을 받고 그 사용자로 연다. 새로고침은 같은 로그인(jti) 안에서 다시 묻지 않는다.
 */
const AddTitleGate: React.FC<{ user: User; onSwitched: (u: User) => void; children: React.ReactNode }> = ({ user, onSwitched, children }) => {
  const isManager = user.userId <= 0; // AS-IS LoginUser.getIsManager() — 회사관리자 (userId = -sys02_user_id)
  const [state, setState] = useState<'checking' | 'need' | 'ok'>(
    isManager || loginGates.isPassed('addTitle', user.jti) ? 'ok' : 'checking');

  useEffect(() => {
    if (state !== 'checking') return;
    let alive = true;
    empAddTitleApi.getLoginList()
      .then(rows => {
        if (!alive) return;
        if (rows.length === 1) { loginGates.pass('addTitle', user.jti); setState('ok'); } // result.getStatus() == 1 → openMainFrame()
        else setState('need');
      })
      .catch(() => { if (alive) setState('ok'); }); // 목록을 못 읽으면 본업무로 연다
    return () => { alive = false; };
  }, [state, user.jti]);

  if (state === 'ok') return <>{children}</>;
  return (
    <LoginUserContext.Provider value={user}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
        {state === 'checking' && <Spin size="large" />}
        <Emp04_Lookup_AddTitleList
          open={state === 'need'}
          mode="login"
          onChanged={(switched) => {
            if (switched) {
              loginGates.passAll(switched.jti); // 2차 인증은 이미 지났다
              onSwitched(switched);
            } else {
              loginGates.pass('addTitle', user.jti);
              setState('ok');
            }
          }}
        />
      </div>
    </LoginUserContext.Provider>
  );
};

const SESSION_NOTICES: Record<SessionTerminateReason, LoginNotice> = {
  MULTI_LOGIN: {
    type: 'error',
    message: '동시 접속 차단 안내',
    description: '다른 기기 또는 브라우저에서 동일한 계정으로 새로 로그인되어 현재 세션이 즉시 종료되었습니다.'
  },
  TOKEN_REUSED: {
    type: 'error',
    message: '보안 경고: 인증 토큰 재사용 감지',
    description: '이미 사용된 인증 토큰이 다시 사용되어 탈취가 의심됩니다. 보안을 위해 세션을 종료했습니다. 다시 로그인해주세요.'
  },
  ACCOUNT_LOCKED: {
    type: 'error',
    message: '계정 잠금 안내',
    description: '계정이 잠겨 세션이 종료되었습니다. 관리자에게 잠금 해제를 요청하세요.'
  },
  LOGOUT: {
    type: 'info',
    message: '로그아웃 안내',
    description: '같은 브라우저의 다른 탭에서 로그아웃되어 현재 화면의 세션도 종료되었습니다.'
  },
  FORCED_LOGOUT: {
    type: 'warning',
    message: '강제 로그아웃 안내',
    description: '관리자가 접속을 종료했습니다. 다시 로그인해주세요.'
  },
  EXPIRED: {
    type: 'warning',
    message: '세션 만료 안내',
    description: '세션 유효시간(리프레시 토큰)이 모두 만료되었습니다. 안전을 위해 다시 로그인해주세요.'
  }
};

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [sessionNotice, setSessionNotice] = useState<LoginNotice | null>(null);
  const userRef = useRef<User | null>(null);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    // 세션 종료(중복 로그인 차단 또는 리프레시 토큰 완전 만료) 이벤트 리스너
    const unsubscribe = onSessionTerminated((reason: SessionTerminateReason) => {
      // 로그인 상태가 아니면 무시 (첫 방문 시 세션 복원 실패에 "세션 만료" 안내가 뜨지 않도록)
      if (!userRef.current) return;
      userRef.current = null;
      setUser(null); // 로그인 페이지로 즉시 이동

      setSessionNotice(SESSION_NOTICES[reason]);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // 로그인 상태 동안 WebSocket 연결 유지 (세션 즉시 종료 알림, 공지, 개인 알림, 접속자 현황)
    if (!user) return;
    realtime.connect(user.roles?.includes('ROLE_ADMIN') ?? false);
    return () => {
      realtime.disconnect();
    };
  }, [user?.userId, user?.jti]);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // 앱 진입 시 기존 쿠키를 통한 세션 복원 시도
    const checkSession = async () => {
      try {
        const res = await authApi.getMe();
        if (res.success && res.data) {
          setUser(res.data);
        }
      } catch {
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
        <SecondaryAuthGate user={user} onLogout={() => { setSessionNotice(null); setUser(null); }}>
          <AddTitleGate key={user.jti} user={user} onSwitched={setUser}>
            <MainFrame
              user={user}
              onLogout={() => {
                setSessionNotice(null);
                setUser(null);
              }}
            />
          </AddTitleGate>
        </SecondaryAuthGate>
      ) : (
        <LoginPage
          notice={sessionNotice}
          onClearNotice={() => setSessionNotice(null)}
          onLoginSuccess={(u) => {
            // 로그인할 때마다 열린 탭을 비우고 MyPage만 남긴다(다른 계정·권한의 탭이 남지 않도록).
            // 추후 변환 완료 후에는 사용자별 탭 유지로 바꿀 예정. 새로고침(세션 복원)은 탭을 유지한다.
            appSettingsStorage.remove('flexlayout_model');
            setSessionNotice(null);
            setUser(u);
          }}
        />
      )}
    </ConfigProvider>
  );
};

export default App;
