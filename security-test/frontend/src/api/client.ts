import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true, // 쿠키 자동 전송 (요구사항 1)
  headers: {
    'Content-Type': 'application/json'
  }
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
export type SessionTerminateReason = 'MULTI_LOGIN' | 'EXPIRED';
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

    const authError = error.response.headers?.['x-auth-error'] || error.response.data?.data;
    const requestUrl = originalRequest.url || '';

    // 1. 중복 로그인 차단된 경우 (MULTI_LOGIN_DETECTED): 재발급하지 않고 즉시 로그인 페이지로 유도
    if (authError === 'MULTI_LOGIN_DETECTED') {
      notifySessionTerminated('MULTI_LOGIN');
      return Promise.reject(error);
    }

    // 2. 로그인 또는 리프레시 요청 자체가 401인 경우: 무한 루프 방지 및 세션 만료 통지
    if (requestUrl.includes('/auth/login') || requestUrl.includes('/auth/refresh')) {
      if (requestUrl.includes('/auth/refresh')) {
        notifySessionTerminated('EXPIRED');
      }
      return Promise.reject(error);
    }

    // 3. 이미 재시도한 요청이면 중복 시도 방지
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
      // Refresh Token으로 새 Access Token 쿠키 재발급 요청
      const refreshResponse = await axios.post('/api/auth/refresh', {}, { withCredentials: true });

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
      const refreshAuthError = refreshErr.response?.headers?.['x-auth-error'] || refreshErr.response?.data?.data;
      if (refreshAuthError === 'MULTI_LOGIN_DETECTED') {
        notifySessionTerminated('MULTI_LOGIN');
      } else {
        notifySessionTerminated('EXPIRED');
      }
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);
