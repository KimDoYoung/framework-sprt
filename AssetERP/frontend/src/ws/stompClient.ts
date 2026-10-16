import { Client, IFrame, IMessage, ReconnectionTimeMode } from '@stomp/stompjs';
import { authApi } from '../api/auth';
import { notifySessionTerminated, SessionTerminateReason } from '../api/client';
import { ErrorPayload, SessionTerminatedPayload, WsMessage } from '../types/ws';

/** 서버 목적지 (backend: common/websocket/WsDestinations) */
export const WS_DESTINATIONS = {
  session: '/user/queue/session',
  notifications: '/user/queue/notifications',
  notice: '/topic/notice',
  presence: '/topic/presence',
  echo: '/app/echo'
} as const;

export type WsStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED';

type StatusListener = (status: WsStatus) => void;
type MessageListener = (message: WsMessage) => void;

/** STOMP ERROR 코드 중 세션 종료로 처리할 것 */
const TERMINATE_REASON_BY_ERROR: Record<string, SessionTerminateReason> = {
  MULTI_LOGIN_DETECTED: 'MULTI_LOGIN',
  SESSION_NOT_FOUND: 'EXPIRED'
};

/**
 * 상대 경로로 WebSocket URL 계산: WAR 컨텍스트(/OMS/ws)와 Vite 개발 서버(/ws → 프록시) 모두에서 동작
 */
const wsUrl = (): string => {
  const url = new URL('ws', document.baseURI);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  return url.toString();
};

/**
 * 앱 전체에서 하나만 쓰는 STOMP 연결.
 * - 인증: handshake 때 브라우저가 ACCESS_TOKEN 쿠키를 보낸다. 토큰 수명이 짧으므로 연결 직전에 /auth/me를 호출해
 *   필요하면 axios 인터셉터가 먼저 갱신(silent refresh)하게 한다.
 * - 재연결: 지수 백오프 (네트워크 단절, 서버 재기동)
 * - SESSION_TERMINATED 수신 시 기존 세션 종료 흐름(notifySessionTerminated)으로 로그인 화면 이동
 */
class RealtimeClient {
  private client: Client | null = null;
  private status: WsStatus = 'DISCONNECTED';
  private statusListeners: StatusListener[] = [];
  private messageListeners: MessageListener[] = [];
  private recentIds: string[] = [];

  connect(isAdmin: boolean) {
    if (this.client?.active) return;

    const client = new Client({
      brokerURL: wsUrl(),
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      reconnectDelay: 1000,
      maxReconnectDelay: 30000,
      reconnectTimeMode: ReconnectionTimeMode.EXPONENTIAL,
      beforeConnect: async () => {
        if (!isCurrent()) return;
        this.setStatus('CONNECTING');
        try {
          await authApi.getMe();
        } catch (err: any) {
          // 401: 인터셉터가 세션 종료를 통지함 → 재연결 중단. 그 밖의 오류는 연결 시도 후 백오프 재시도
          if (err?.response?.status === 401) {
            await client.deactivate();
          }
        }
      },
      onConnect: () => {
        if (!isCurrent()) return;
        this.setStatus('CONNECTED');
        client.subscribe(WS_DESTINATIONS.session, this.handleFrame);
        client.subscribe(WS_DESTINATIONS.notifications, this.handleFrame);
        client.subscribe(WS_DESTINATIONS.notice, this.handleFrame);
        if (isAdmin) {
          client.subscribe(WS_DESTINATIONS.presence, this.handleFrame);
        }
      },
      onStompError: (frame: IFrame) => {
        const message = this.parse(frame.body);
        if (message) {
          this.dispatch(message);
          const reason = TERMINATE_REASON_BY_ERROR[(message.payload as ErrorPayload | null)?.code ?? ''];
          if (reason) this.terminate(reason);
        }
      },
      onWebSocketClose: () => {
        if (isCurrent() && client.active) this.setStatus('CONNECTING');
      }
    });
    // 이전 연결(React StrictMode 재실행, 재로그인)의 늦은 콜백이 현재 상태를 덮어쓰지 않도록
    const isCurrent = () => this.client === client;

    this.client = client;
    client.activate();
  }

  async disconnect() {
    const client = this.client;
    this.client = null;
    this.recentIds = [];
    this.setStatus('DISCONNECTED');
    if (client) await client.deactivate();
  }

  /** 양방향 통신 확인: 서버가 이 세션에만 ECHO로 돌려준다 */
  sendEcho(text: string): boolean {
    if (!this.client?.connected) return false;
    this.client.publish({ destination: WS_DESTINATIONS.echo, body: JSON.stringify({ text }) });
    return true;
  }

  getStatus(): WsStatus {
    return this.status;
  }

  onStatus(listener: StatusListener) {
    this.statusListeners.push(listener);
    listener(this.status);
    return () => {
      this.statusListeners = this.statusListeners.filter(l => l !== listener);
    };
  }

  onMessage(listener: MessageListener) {
    this.messageListeners.push(listener);
    return () => {
      this.messageListeners = this.messageListeners.filter(l => l !== listener);
    };
  }

  private handleFrame = (frame: IMessage) => {
    const message = this.parse(frame.body);
    if (!message || this.isDuplicate(message.id)) return;
    this.dispatch(message);

    if (message.type === 'SESSION_TERMINATED') {
      this.terminate((message.payload as SessionTerminatedPayload | null)?.reason ?? 'EXPIRED');
    }
  };

  private terminate(reason: SessionTerminateReason) {
    this.disconnect();
    notifySessionTerminated(reason);
  }

  private dispatch(message: WsMessage) {
    this.messageListeners.forEach(listener => listener(message));
  }

  private parse(body: string): WsMessage | null {
    try {
      return JSON.parse(body) as WsMessage;
    } catch {
      return null;
    }
  }

  private isDuplicate(id: string): boolean {
    if (this.recentIds.includes(id)) return true;
    this.recentIds.push(id);
    if (this.recentIds.length > 200) this.recentIds.shift();
    return false;
  }

  private setStatus(status: WsStatus) {
    if (this.status === status) return;
    this.status = status;
    this.statusListeners.forEach(listener => listener(status));
  }
}

export const realtime = new RealtimeClient();
