import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// 상대 경로: WAR 컨텍스트(/security-test/) 하위 배포와 Vite 개발 서버(/) 모두에서 동작
export const API_BASE_URL = 'api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 쿠키 자동 전송 (요구사항 1)
  headers: {
    'Content-Type': 'application/json'
  }
});

// 인터셉터를 거치지 않는 토큰 갱신 전용 클라이언트 (갱신 실패가 다시 갱신을 유발하지 않도록)
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

// 토큰 갱신 이벤트 리스너 (UI 상태 업데이트용)
type RefreshListener = (data: any) => void;
const refreshListeners: RefreshListener[] = [];

export const onTokenRefresh = (listener: RefreshListener) => {
  refreshListeners.push(listener);
  return () => {
    const idx = refreshListeners.indexOf(listener);
    if (idx !== -1) refreshListeners.splice(idx, 1);
  };
};

// 세션 종료 이벤트 리스너 (로그인 페이지 이동 및 메시지 표시용)
export type SessionTerminateReason = 'MULTI_LOGIN' | 'TOKEN_REUSED' | 'ACCOUNT_LOCKED' | 'EXPIRED';
type SessionTerminateListener = (reason: SessionTerminateReason) => void;
const sessionTerminateListeners: SessionTerminateListener[] = [];

export const onSessionTerminated = (listener: SessionTerminateListener) => {
  sessionTerminateListeners.push(listener);
  return () => {
    const idx = sessionTerminateListeners.indexOf(listener);
    if (idx !== -1) sessionTerminateListeners.splice(idx, 1);
  };
};

export const notifySessionTerminated = (reason: SessionTerminateReason) => {
  sessionTerminateListeners.forEach(listener => listener(reason));
};

/**
 * 화면에 표시할 오류 메시지. 서버 오류(5xx)에는 추적ID(X-Trace-Id)를 붙여
 * 사용자가 알려준 ID로 운영자가 서버 로그에서 해당 요청을 바로 찾을 수 있게 한다.
 */
export const errorMessage = (err: any, fallback = '요청 처리 실패'): string => {
  const message: string = err?.response?.data?.message || err?.message || fallback;
  const traceId: string | undefined = err?.response?.headers?.['x-trace-id'];
  const isServerError = (err?.response?.status ?? 0) >= 500;
  return isServerError && traceId && !message.includes(traceId) ? `${message} (추적ID: ${traceId})` : message;
};

/** 서버 에러 코드: X-Auth-Error 헤더 우선, 없으면 ApiResponse.code */
const getErrorCode = (error: AxiosError<any>): string | undefined =>
  error.response?.headers?.['x-auth-error'] || error.response?.data?.code;

const TERMINATE_REASON_BY_CODE: Record<string, SessionTerminateReason> = {
  MULTI_LOGIN_DETECTED: 'MULTI_LOGIN',
  REFRESH_TOKEN_REUSED: 'TOKEN_REUSED',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED'
};

const notifyByErrorCode = (code: string | undefined) => {
  notifySessionTerminated((code && TERMINATE_REASON_BY_CODE[code]) || 'EXPIRED');
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
  config: InternalAxiosRequestConfig;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(apiClient(prom.config));
    }
  });
  failedQueue = [];
};

// Response Interceptor: 401(토큰 만료) 감지 시 자동 토큰 갱신 (Silent Refresh)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 401 에러가 아니거나 원래 요청 정보가 없으면 그대로 reject
    if (!error.response || error.response.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    const authError = getErrorCode(error);
    const requestUrl = originalRequest.url || '';

    // 1. 중복 로그인 차단된 경우 (MULTI_LOGIN_DETECTED): 재발급하지 않고 즉시 로그인 페이지로 유도
    if (authError === 'MULTI_LOGIN_DETECTED') {
      notifySessionTerminated('MULTI_LOGIN');
      return Promise.reject(error);
    }

    // 2. 수동 리프레시 요청 자체가 401인 경우: 세션 종료 통지 (무한 루프 방지)
    if (requestUrl.includes('/auth/refresh')) {
      notifyByErrorCode(authError);
      return Promise.reject(error);
    }

    // 3. 로그인/로그아웃의 401은 호출한 화면에서 처리 (예: LOGIN_FAILED 메시지 표시)
    if (requestUrl.includes('/auth/login') || requestUrl.includes('/auth/logout')) {
      return Promise.reject(error);
    }

    // 4. 이미 재시도한 요청이면 중복 시도 방지
    if (originalRequest._retry) {
      notifySessionTerminated('EXPIRED');
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // 이미 다른 요청에 의해 리프레시가 진행 중이면 큐에 대기
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    isRefreshing = true;

    try {
      // Refresh Token으로 새 Access/Refresh Token 쿠키 재발급 요청
      const refreshResponse = await refreshClient.post('auth/refresh');

      if (refreshResponse.data?.success) {
        // 리스너 호출 (UI에 자동 갱신 알림)
        refreshListeners.forEach(listener => listener(refreshResponse.data.data));

        processQueue(null);
        return apiClient(originalRequest);
      } else {
        processQueue(error);
        notifySessionTerminated('EXPIRED');
        return Promise.reject(error);
      }
    } catch (refreshErr: any) {
      processQueue(refreshErr);
      notifyByErrorCode(getErrorCode(refreshErr));
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);
