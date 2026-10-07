import { SessionTerminateReason } from '../api/client';

/** 서버 WsMessageType - 유형마다 category와 payload 구조가 정해져 있다 */
export type WsMessageType = 'SESSION_TERMINATED' | 'NOTIFICATION' | 'NOTICE' | 'PRESENCE_CHANGED' | 'ERROR' | 'ECHO';
export type WsCategory = 'SESSION' | 'NOTIFICATION' | 'NOTICE' | 'PRESENCE' | 'SYSTEM';
export type WsLevel = 'INFO' | 'WARN' | 'ERROR';

export interface WsSender {
  /** 로그인 아이디 (시스템 발신이면 'SYSTEM') */
  username: string;
  name: string;
}

/** 서버 → 클라이언트 WebSocket 메시지 공통 envelope (backend: common/websocket/dto/WsMessage) */
export interface WsMessage<T = unknown> {
  /** 메시지 ID (UUID) - 중복 수신 제거용 */
  id: string;
  type: WsMessageType;
  category: WsCategory;
  level: WsLevel;
  title: string;
  message: string;
  payload: T | null;
  sender: WsSender;
  /** ISO-8601 */
  sentAt: string;
  /** 메시지를 발생시킨 요청의 추적ID (서버 로그 검색 키) */
  traceId: string;
}

/** SESSION_TERMINATED payload */
export interface SessionTerminatedPayload {
  reason: SessionTerminateReason;
  /** 대응하는 서버 ErrorCode (없으면 null) */
  errorCode: string | null;
}

/** NOTIFICATION payload */
export interface NotificationPayload {
  link: string | null;
  refId: string | null;
}

/** 접속자 현황 항목 (WebSocket 세션 1개) */
export interface PresenceItem {
  sessionId: string;
  userId: number;
  username: string;
  name: string;
  instanceId: string;
  clientIp: string | null;
  connectedAt: string;
}

/** PRESENCE_CHANGED payload */
export interface PresencePayload {
  event: 'JOIN' | 'LEAVE';
  session: PresenceItem;
  /** 변경 후 전체 접속 세션 수 */
  count: number;
}

/** ERROR payload (STOMP ERROR 프레임 본문) */
export interface ErrorPayload {
  code: string;
}
