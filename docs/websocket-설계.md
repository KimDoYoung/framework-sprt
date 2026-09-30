# AssetERP 차세대 WebSocket(실시간 알림) 아키텍처 및 상세 설계서

> **프로젝트**: AssetERP 차세대 전환 보안 프로토타입 (`security-test`)  
> **기준 일자**: 2026-09-30  
> **대상 환경**: Java 21 / Spring Boot 3.4.3 (spring-boot-starter-websocket) / React 19 / @stomp/stompjs 7.x / Redis 7.x / Tomcat 10.1 (WAR)  
> **관련 문서**: `docs/security-설계.md`(인증·세션), `docs/log-설계.md`(MDC·감사 로그), `docs/asis-db-연동.md`(AS-IS 사용자·회사·권한 데이터)

---

## 1. 개요 및 목적

기존 구조에서는 멀티 로그인, 토큰 재사용, 계정 잠금으로 세션이 끊겨도 이전 화면은 **다음 HTTP 요청 때** 비로소 차단되었다(`security-설계.md` 9장 향후 과제).
본 설계는 **STOMP over WebSocket**을 도입해 서버가 먼저 클라이언트에 알리는 채널을 만들고, 이를 다음 네 가지 용도로 검증한다.

| # | 용도 | 목적지 | 발생 시점 |
|:--|:---|:---|:---|
| 1 | 세션 즉시 종료 알림 | `/user/queue/session` | 멀티 로그인, 로그아웃(다른 탭), 토큰 재사용, 계정 잠금, 세션 만료 |
| 2 | 사용자별 알림 push | `/user/queue/notifications` | 관리자 발송 (향후 결재 요청 등 업무 이벤트) |
| 3 | 전체 공지 broadcast | `/topic/notice` | 관리자 발송 |
| 4 | 접속자 현황(presence) | `/topic/presence` + `GET /api/push/presence` | WebSocket 연결·종료 |

### 1.1 핵심 요구사항

1. 모든 서버발 메시지는 **하나의 정형화된 envelope(`WsMessage`)** 를 따른다 (3.3).
2. handshake는 기존 JWT 쿠키 인증을 그대로 사용하고, 별도 토큰 전달 방식을 만들지 않는다.
3. 소켓의 유효성은 **Redis 활성 jti**에 묶는다. JWT(10초)가 만료되어도 소켓은 유지되지만, 세션이 끝나면 즉시 닫힌다.
4. **서버 여러 대**(인스턴스)에서도 동작한다. 어느 인스턴스에서 발생한 이벤트든 대상 사용자가 연결된 인스턴스로 전달된다.
5. 인증 도메인(`AuthService`)은 WebSocket을 알지 못한다 (이벤트로 분리).
6. 요청 추적ID(traceId)가 HTTP 요청 → Redis → 다른 인스턴스 → 클라이언트까지 이어진다.

---

## 2. 아키텍처

### 2.1 구성도

```
 Browser (React)                        Instance A (8080)                         Instance B (8083)
 ┌───────────────────┐   WS /ws    ┌──────────────────────────────┐         ┌──────────────────────────────┐
 │ realtime          │◀──STOMP───▶│ JwtHandshakeInterceptor      │         │  (동일 구성)                  │
 │ (stompClient.ts)  │  (쿠키)    │ StompAuthChannelInterceptor  │         │                              │
 │  ├ /user/queue/*  │            │ SimpleBroker (/topic,/queue) │         │ SimpleBroker                 │
 │  ├ /topic/notice  │            │ WsSessionRegistry (로컬 세션) │         │ WsSessionRegistry            │
 │  └ /topic/presence│            │        ▲                     │         │        ▲                     │
 └───────────────────┘            │  WsRedisSubscriber ◀─────────┼──┐   ┌──┼─▶ WsRedisSubscriber         │
                                  │        ▲                     │  │   │  │                              │
  POST /api/auth/login ──────────▶│ AuthService ─(event)─▶ PushService ─▶ WsPublisher ──PUBLISH──┐        │
  POST /api/push/notice ─────────▶│ PushController                │  │   │  │                    │        │
                                  └──────────────────────────────┘  │   │  └────────────────────┼────────┘
                                                                     │   │                       ▼
                                                             ┌───────┴───┴───────────────────────────────┐
                                                             │ Redis                                      │
                                                             │  channel  asseterp:ws:events  (Pub/Sub)    │
                                                             │  hash     security:ws:presence             │
                                                             │  key      security:ws:instance:{id} (TTL)  │
                                                             │  key      security:user:jti:{userId} (기존) │
                                                             └────────────────────────────────────────────┘
```

- **브로커**: 인스턴스마다 in-memory `SimpleBroker`. 외부 브로커(RabbitMQ 등)를 두지 않는다.
- **인스턴스 간 전달**: 모든 서버발 메시지는 `WsPublisher` → Redis 채널 → **발행 인스턴스 포함** 모든 인스턴스의 `WsRedisSubscriber` → 로컬 브로커. 경로가 하나이므로 단일/다중 인스턴스 동작이 같다.
- **SockJS 미사용**: 사내망 브라우저는 native WebSocket을 지원하므로 fallback을 두지 않는다.

### 2.2 패키지 구성

| 패키지 | 클래스 | 역할 |
|:---|:---|:---|
| `common.websocket` | `WebSocketConfig` | 엔드포인트, Origin 검사, 브로커·heartbeat, 인터셉터·데코레이터 등록, `wsTaskScheduler` |
| | `JwtHandshakeInterceptor` | 인증된 `UserPrincipal` → 세션 attributes(`WsUser`) |
| | `StompAuthChannelInterceptor` | CONNECT/SUBSCRIBE/SEND 권한 및 jti 재검사, 프레임 MDC |
| | `StompErrorHandler` | 오류 → STOMP ERROR 프레임(`WsMessage` ERROR 본문) |
| | `WsSessionRegistry` | 로컬 WebSocket 세션 목록 (강제 종료용 `WebSocketSession` 참조) |
| | `WsSessionTerminator` | 세션 1개에 종료 메시지 전송 → close-delay 후 close(4001) → 감사 로그 |
| | `WsPublisher` / `WsRedisSubscriber` / `WsRedisConfig` | Redis Pub/Sub 발행·구독 |
| | `WsDestinations`, `WsMdc` | 목적지 상수, MDC 헬퍼 |
| | `dto.*` | `WsMessage`, `WsMessageType`, `WsCategory`, `WsLevel`, `WsSender`, `WsRoute`, `WsEnvelope`, `WsUser`, `ErrorPayload` |
| `biz.auth.dto` | `SessionTerminatedEvent`, `SessionTerminateReason` | 인증 → push 도메인 이벤트 |
| `biz.push` | `PushController` (`/api/push`) | 공지·개인 알림 발송, 접속자 조회 (관리자) |
| | `PushStompController` | `/app/echo` |
| | `PushService` | 공지·알림 발행, `SessionTerminatedEvent` 리스너 |
| | `PresenceService` | 접속자 HASH 관리, `PRESENCE_CHANGED` 발행, 인스턴스 생존 키 |
| | `WsSessionSweeper` | 주기 세션 재검증 (만료 감지) |

Frontend: `src/ws/stompClient.ts`(`realtime` 싱글턴), `src/types/ws.ts`, `src/api/push.ts`, `src/components/RealtimeCard.tsx`.

---

## 3. 세부 설계

### 3.1 연결과 인증

```
Browser                               Server
  │ GET /auth/me  (axios; 필요 시 silent refresh로 새 ACCESS_TOKEN 쿠키)
  │──────────────────────────────────▶│
  │ GET /ws  Upgrade  Cookie: ACCESS_TOKEN  Origin: …
  │──────────────────────────────────▶│ ① Security 필터 체인: JwtAuthenticationFilter (쿠키 → jti MATCH 검사)
  │                                   │    실패 시 401 (handshake 거부)
  │                                   │ ② Origin 검사: asseterp.cors.allowed-origins 외 403 (CSWSH 방어)
  │                                   │ ③ JwtHandshakeInterceptor: WsUser(userId, username, jti, roles, IP) 저장
  │ 101 Switching Protocols           │ ④ WsSessionRegistry 등록
  │◀──────────────────────────────────│
  │ CONNECT (heart-beat 10000,10000)  │ ⑤ StompAuthChannelInterceptor: WsUser 존재 확인
  │ SUBSCRIBE /user/queue/session …   │ ⑥ 목적지 허용 여부 + Redis jti 재검사
  │ CONNECTED                         │ ⑦ PresenceService: HASH 등록, WS_CONNECT 감사, PRESENCE_CHANGED(JOIN)
```

- `/ws`는 `permit-all-paths`에 **넣지 않는다**. 쿠키 경로가 컨텍스트 경로라 handshake에 자동으로 실린다.
- Access Token 수명이 짧으므로(10초) 클라이언트는 `beforeConnect`에서 `/auth/me`를 호출해 토큰을 먼저 갱신시킨다. 401이면(세션 종료) 재연결을 중단한다.
- STOMP Principal 이름은 `username`이다 (`/user/**` 목적지 해석 기준).
- Spring Security messaging(`@EnableWebSocketSecurity`)은 CONNECT에 CSRF 토큰을 요구해 쿠키 인증 구조와 맞지 않으므로 사용하지 않고, `StompAuthChannelInterceptor`에서 명시적으로 검사한다.

### 3.2 STOMP 목적지 및 권한

| 목적지 | 방향 | 권한 | 메시지 유형 |
|:---|:---|:---|:---|
| `/user/queue/session` | S→C | 본인 | `SESSION_TERMINATED` |
| `/user/queue/notifications` | S→C | 본인 | `NOTIFICATION`, `ECHO` |
| `/topic/notice` | S→C | 인증 사용자 | `NOTICE` |
| `/topic/presence` | S→C | `ROLE_ADMIN` | `PRESENCE_CHANGED` |
| `/app/echo` | C→S | 인증 사용자 | 요청 `{text}` → 보낸 세션에만 `ECHO` |

- 표에 없는 목적지 SUBSCRIBE(예: `/user/admin/queue/notifications`, `/topic/other`)는 `WS_DESTINATION_DENIED`이다.
- SEND는 `/app/**`만 허용한다. 클라이언트가 `/topic/notice`로 직접 보내 공지를 위장할 수 없다.
- SUBSCRIBE/SEND마다 `RedisTokenService.checkJti`를 호출한다. `MISMATCH`면 `MULTI_LOGIN_DETECTED`, `NOT_FOUND`면 `SESSION_NOT_FOUND`이다.
- 거부 시 서버는 ERROR 프레임을 보내고 **연결을 닫는다** (STOMP 규약). 정상 클라이언트는 허용된 목적지만 구독하므로 영향이 없다.

### 3.3 메시지 envelope (`WsMessage<T>`)

서버 → 클라이언트의 모든 메시지와 STOMP ERROR 프레임 본문이 같은 형식을 따른다.

```json
{
  "id": "145857bc-8856-4da8-ba15-a9…",       // UUID. 클라이언트 중복 제거
  "type": "SESSION_TERMINATED",               // WsMessageType → payload 구조 결정
  "category": "SESSION",                      // type에서 자동 결정. UI 영역 라우팅
  "level": "ERROR",                           // INFO | WARN | ERROR
  "title": "동시 접속 차단",
  "message": "다른 기기/브라우저에서 로그인되어 현재 세션이 차단되었습니다.",
  "payload": { "reason": "MULTI_LOGIN", "errorCode": "MULTI_LOGIN_DETECTED" },
  "sender": { "username": "SYSTEM", "name": "시스템" },
  "sentAt": "2026-09-30T01:01:54.303Z",       // ISO-8601
  "traceId": "dccf2f558b53133c"               // 발생시킨 요청의 추적ID
}
```

| type | category | payload | 비고 |
|:---|:---|:---|:---|
| `SESSION_TERMINATED` | SESSION | `SessionTerminatedPayload{reason, errorCode}` | reason = 프론트 `SessionTerminateReason` |
| `NOTIFICATION` | NOTIFICATION | `NotificationPayload{link, refId}` | 업무 화면 이동·참조용 |
| `NOTICE` | NOTICE | 없음(null) | |
| `PRESENCE_CHANGED` | PRESENCE | `PresencePayload{event: JOIN/LEAVE, session: PresenceItem, count}` | |
| `ERROR` | SYSTEM | `ErrorPayload{code}` | ERROR 프레임 `message` 헤더에도 code |
| `ECHO` | SYSTEM | 없음 | |

- 생성은 `WsMessage.of(type, level, title, message, payload, sender)`로만 한다. `id`, `category`, `sentAt`, `traceId`(현재 MDC, 없으면 새로 발급)가 자동으로 채워져 누락되지 않는다.
- 새 유형을 추가할 때는 `WsMessageType`(category 지정), payload record, 프론트 `types/ws.ts`를 함께 바꾼다.
- `SessionTerminateReason` 매핑: `MULTI_LOGIN→MULTI_LOGIN_DETECTED`, `TOKEN_REUSED→REFRESH_TOKEN_REUSED`, `ACCOUNT_LOCKED→ACCOUNT_LOCKED`, `EXPIRED→REFRESH_EXPIRED`, `LOGOUT→(없음)`.

### 3.4 인스턴스 간 전달 (`WsRoute`, `WsEnvelope`)

Redis 채널 `asseterp:ws:events`에 `WsEnvelope{instanceId, route, message}` JSON을 발행한다.

| `route.target` | 필드 | 각 인스턴스의 처리 |
|:---|:---|:---|
| `USER` | username, destination | `convertAndSendToUser` (해당 사용자가 이 인스턴스에 없으면 무시) |
| `ALL` | destination | `convertAndSend` |
| `SESSION_CONTROL` | userId, keepJti | 로컬 세션 중 `userId` 일치 && `jti ≠ keepJti`(null이면 전부) → `WsSessionTerminator` |

`WsSessionTerminator`:
1. `closing` 플래그 CAS로 한 번만 처리한다 (이벤트와 주기 검사가 겹쳐도 중복 없음).
2. `simpSessionId` 헤더를 붙여 **그 세션 하나에만** `/user/queue/session`으로 전송한다.
3. `WS_FORCED_CLOSE` 감사 로그를 남긴다.
4. `close-delay`(1초) 뒤 `CloseStatus(4001, reason)`으로 닫는다. 메시지 전송이 비동기라 바로 닫으면 유실될 수 있기 때문이다. 정상 클라이언트는 메시지를 받자마자 스스로 끊는다.

### 3.5 세션 종료 이벤트

`AuthService`는 `ApplicationEventPublisher`로 `SessionTerminatedEvent(userId, keepJti, reason)`만 발행한다. `PushService.onSessionTerminated`가 `SESSION_CONTROL`로 발행한다. Redis 장애로 발행이 실패해도 로그인·로그아웃은 막지 않는다 (남은 소켓은 3.6의 주기 검사가 정리).

| 발생 지점 | reason | keepJti | 효과 |
|:---|:---|:---|:---|
| `login` 성공 | `MULTI_LOGIN` | 새 jti | 이전 브라우저 화면이 **즉시** 로그인 화면으로 |
| `login` 실패로 계정 잠금 | `ACCOUNT_LOCKED` | null | 다른 곳에 살아 있는 세션도 즉시 종료 |
| `refresh` 재사용 탐지 | `TOKEN_REUSED` | null | 전체 세션 종료 |
| `refresh` 중 잠긴 계정 | `ACCOUNT_LOCKED` | null | |
| `logout` (jti MATCH) | `LOGOUT` | null | 같은 브라우저의 다른 탭도 로그인 화면으로. 로그아웃한 탭은 먼저 소켓을 끊어 자기 알림을 받지 않음 |

### 3.6 주기 재검증 (`WsSessionSweeper`)

`asseterp.ws.sweep-interval`(10초)마다 다음을 수행한다.
1. `PresenceService.heartbeat()`: 인스턴스 생존 키 갱신, 이 인스턴스 항목 중 실제 연결이 없는 것 정리.
2. 로컬 세션마다 `checkJti`:
   - `NOT_FOUND`면 `EXPIRED`로 종료한다. 유휴 60초가 지나 Redis 세션 키가 사라진 경우이며, Redis `notify-keyspace-events` 설정 없이 동작한다.
   - `MISMATCH`면 `MULTI_LOGIN`으로 종료한다. 이벤트가 유실된 경우를 보정한다.
3. Redis 장애 시 해당 주기는 건너뛴다. 판정할 수 없으므로 연결은 유지된다.

@Scheduled 대신 `wsTaskScheduler`(`ThreadPoolTaskScheduler`, 2 스레드)로 `ApplicationReadyEvent` 이후 등록한다. WebSocket 설정이 `TaskScheduler` 빈을 추가로 만들어 `@EnableScheduling`의 스케줄러 선택이 모호해지는 것을 피하기 위해서다. 이 스케줄러는 STOMP heartbeat, 지연 종료에도 쓰인다.

### 3.7 접속자 현황 (Presence)

| Redis 키 | 타입 | 내용 |
|:---|:---|:---|
| `security:ws:presence` | HASH | field `{instanceId}:{sessionId}` → `PresenceItem` JSON (`sessionId, userId, username, name, instanceId, clientIp, connectedAt`) |
| `security:ws:instance:{instanceId}` | STRING (TTL 30s) | 인스턴스 생존 표시. sweep 주기마다 갱신 |

- `SessionConnectedEvent`가 오면 HSET, `WS_CONNECT`, `PRESENCE_CHANGED(JOIN)`을 처리한다.
- `SessionDisconnectEvent`가 오면 HDEL을 하고, 삭제된 경우에만 `WS_DISCONNECT`와 `PRESENCE_CHANGED(LEAVE)`를 처리한다(중복 방지).
- 조회(`GET /api/push/presence`) 시 생존 키가 없는 인스턴스의 항목은 제외하고 삭제한다. `kill -9` 같은 비정상 종료에 대비한 것이다.
- 정상 종료 시 `ContextClosedEvent`에서 자기 항목과 생존 키를 삭제한다. `@PreDestroy`는 Redis 연결이 먼저 멈춘 뒤 호출되어 쓸 수 없다.
- 한 사용자가 탭 여러 개로 접속하면 세션마다 항목이 생긴다 (소켓 단위).

### 3.8 로깅·감사

- WebSocket 프레임은 `MdcLoggingFilter`를 거치지 않는다. 그래서 `StompAuthChannelInterceptor`가 `preSend`와 `beforeHandle`(`@MessageMapping` 스레드)에서 traceId(신규), userId, clientIp를 넣고 처리 후 지운다.
- `WsRedisSubscriber`는 envelope의 traceId를 MDC에 복원한다. 그 결과 로그인 요청(`POST /api/auth/login`, 인스턴스 A)과 이전 세션 강제 종료(`WS_FORCED_CLOSE`, 인스턴스 B)가 **같은 추적ID**로 검색된다.
- 감사 이벤트는 `WS_CONNECT`, `WS_DISCONNECT`, `WS_FORCED_CLOSE`, `NOTICE_BROADCAST`, `NOTIFICATION_SEND`이다 (`log-설계.md` 5.2).
- 클라이언트 화면(RealtimeCard)은 메시지마다 traceId를 표시하고 복사할 수 있게 한다.

### 3.9 Frontend (`realtime` 클라이언트)

- `App.tsx`: 로그인 상태(`userId`, `jti`)가 바뀌면 `realtime.connect(isAdmin)`, 로그아웃·종료 시 `disconnect()`한다.
- URL은 `new URL('ws', document.baseURI)`로 만든다. WAR(`/security-test/ws`)와 Vite 개발 서버(`/ws` → `vite.config.ts` 프록시 `ws: true`)에서 모두 동작한다.
- 재연결은 지수 백오프(1초에서 최대 30초)로 한다.
- `SESSION_TERMINATED`와 ERROR(`MULTI_LOGIN_DETECTED`/`SESSION_NOT_FOUND`)를 받으면 연결을 끊고, 기존 `notifySessionTerminated(reason)` 흐름으로 로그인 화면과 사유 안내를 보여 준다(`LOGOUT` 안내 추가).
- 메시지 `id`로 중복 수신을 제거한다(최근 200건).
- `NOTICE`와 `NOTIFICATION`은 antd `notification`으로 표시하고, 전체 메시지는 RealtimeCard 로그 표에 쌓는다.

---

## 4. API

| Method | URL | 권한 | 요청 | 응답 `data` |
|:---|:---|:---|:---|:---|
| POST | `/api/push/notice` | ADMIN | `{title, message, level?}` | 메시지 ID |
| POST | `/api/push/notification` | ADMIN | `{username, title, message, level?, link?, refId?}` | 메시지 ID (없는 사용자: 404 `USER_NOT_FOUND`) |
| GET | `/api/push/presence` | ADMIN | - | `PresenceItem[]` (연결 시각 순) |
| WS | `/ws` | 인증 | STOMP 1.2 | - |

개인 알림은 받는 사용자가 오프라인이면 전달되지 않는다(저장하지 않음). 알림함이 필요하면 6장을 참고한다.

---

## 5. 설정 항목 (`application.properties`)

| 키 | 기본값 | 설명 |
|:---|:---|:---|
| `asseterp.ws.endpoint` | `/ws` | STOMP 엔드포인트 |
| `asseterp.ws.instance-id` | (빈 값 → 무작위 8자리) | 인스턴스 식별자. presence와 로그에 표시 |
| `asseterp.ws.redis-channel` | `asseterp:ws:events` | 인스턴스 간 Pub/Sub 채널 |
| `asseterp.ws.presence-key` | `security:ws:presence` | 접속자 HASH |
| `asseterp.ws.instance-key-prefix` | `security:ws:instance:` | 생존 키 prefix |
| `asseterp.ws.instance-ttl` | `30s` | 생존 키 TTL (sweep-interval의 3배 권장) |
| `asseterp.ws.sweep-interval` | `10s` | 세션 재검증 주기 = 만료 감지 최대 지연 |
| `asseterp.ws.heartbeat` | `10s` | STOMP heartbeat |
| `asseterp.ws.close-delay` | `1s` | 종료 메시지 후 소켓 close까지 대기 |

Origin 허용 목록은 `asseterp.cors.allowed-origins`를 재사용한다. 리버스 프록시(nginx) 뒤에 둘 때는 `/ws` 경로에 `Upgrade`/`Connection` 헤더 전달과 60초 이상의 read timeout(heartbeat보다 길게)을 설정한다.

---

## 6. 운영 및 테스트

### 6.1 검증 결과 (2026-09-30)

Node(@stomp/stompjs) 스크립트로 실제 서버에 연결해 확인했다.

| 시나리오 | 결과 |
|:---|:---|
| 쿠키 없이 handshake / 허용되지 않은 Origin | 거부 (연결 실패) |
| 일반 사용자 `/topic/presence` 구독 | ERROR `WS_DESTINATION_DENIED`(envelope 본문) 후 연결 종료 |
| `/app/echo` | 보낸 세션에만 `ECHO` |
| 관리자 공지 | 관리자·user1 모두 `NOTICE` 수신 |
| 개인 알림 → user1 | user1만 수신. 없는 사용자는 404, 일반 사용자 발송은 403 |
| user1 재로그인 | 이전 소켓에 12ms 안에 `SESSION_TERMINATED(MULTI_LOGIN)`, 1초 뒤 close 4001. 새 세션은 정상 연결 |
| 로그아웃 | 같은 세션 소켓에 `LOGOUT` 후 4001 |
| 유휴 60초 | sweep이 `EXPIRED` 전달 후 4001 |
| 2 인스턴스(8080 + 8083) | 8080 공지·알림이 8083 사용자에게 전달. 8080 재로그인이 8083 이전 세션 종료. presence에 두 인스턴스 표시 |
| 인스턴스 `kill -9` | 생존 키 만료(≤30초) 후 presence에서 제외, HASH 정리 |
| 인스턴스 정상 종료(SIGTERM) | 자기 presence 항목과 생존 키 즉시 삭제 |
| 추적ID | 로그인 요청 → 발행 → Redis 수신 → `WS_FORCED_CLOSE` 감사까지 같은 traceId |

### 6.2 화면 테스트 절차

1. `./bm.sh run`, `./fm.sh run`을 실행한 뒤 http://localhost:5173 에 접속한다.
2. 브라우저 A에서 user1로 로그인하고, RealtimeCard 배지가 "연결됨"인지 확인한다.
3. 브라우저 B(시크릿 창)에서 user1로 로그인한다. A가 **아무 조작 없이** 로그인 화면으로 가고 "동시 접속 차단 안내"가 뜨는지 확인한다.
4. 같은 브라우저에 탭 2개를 띄우고 한쪽에서 로그아웃한다. 다른 탭이 "로그아웃 안내"로 전환되는지 확인한다.
5. admin으로 로그인해 공지와 개인 알림(user1)을 발송한다. 수신 측 우하단 알림과 로그 표를 확인하고, 접속자 현황이 실시간으로 갱신되는지 확인한다.

### 6.3 자동 테스트

| 테스트 | 검증 내용 |
|:---|:---|
| `WsMessageTest` | envelope 필드 순서·분류·ISO 시각·traceId, Redis 전달 단위 직렬화 왕복 |
| `StompAuthChannelInterceptorTest` | 허용·거부 목적지, 관리자 전용 presence, `/topic` 직접 SEND 거부, jti MISMATCH/NOT_FOUND 거부 |
| `WsRedisSubscriberTest` | `keepJti` 선별(멀티 로그인), 전체 종료, USER/ALL 전달 |
| `WsSessionTerminatorTest` | 단일 세션 한정 헤더, 중복 종료 방지, 지연 close(4001), 감사 로그 |
| `AuthServiceTest` | 로그인·재사용·잠금 시 `SessionTerminatedEvent` 발행 |

---

## 7. 알려진 제약 및 향후 과제

| 구분 | 현재 상태 | 개선 방향 |
|:---|:---|:---|
| 오프라인 알림 | 저장하지 않음 (접속 중인 세션만 수신) | 알림 테이블 + 미확인 건수, 재접속 시 조회 (알림함) |
| 전달 보장 | Redis Pub/Sub은 at-most-once (구독 중이 아니면 유실) | 중요 알림은 DB 저장 후 push, 또는 Redis Streams |
| 만료 감지 지연 | 최대 sweep-interval(10초) | 필요 시 Redis 키 만료 이벤트(`notify-keyspace-events Ex`) 병행 |
| 브로커 확장 | 인스턴스별 SimpleBroker + Redis 중계 | 대규모·구독 다양화 시 외부 STOMP 브로커(RabbitMQ) relay |
| 클라이언트 → 서버 메시지 | `/app/echo`만 존재 | 읽음 처리(ACK) 등 추가 시 `@MessageMapping` + 권한 검사 확장 |
| 메인 셸 연동 | security-test 단독 화면 | `antdesign` StatusBar의 "EventBus / Push" 표시·공지 영역에 `realtime` 연결 |
| 회사·조직 단위 발송 | 미구현. "전체 공지"가 회사 구분 없이 전체에 전달됨 | 8장 (AS-IS DB 연동 후) |

---

## 8. 추후 개발: 회사·조직 단위 메시지

> **상태**: 설계만 정리함. `docs/asis-db-연동.md`의 AS-IS DB 전환(특히 로그인 ID, 역할 매핑)을 먼저 해야 한다.

### 8.1 요구사항

예) **회사 A의 대표이사가 회사 A 전 직원에게** 메시지를 보낸다. 다른 회사 사용자는 받지 못하고, 다른 회사로 보낼 수도 없어야 한다.

### 8.2 현재 구현의 한계

| 항목 | 현재 | 문제 |
|:---|:---|:---|
| 전체 공지 `/topic/notice` | 접속한 **모든 회사** 사용자에게 전달 | 회사 A 관리자의 공지가 회사 B에도 간다 (멀티 테넌트 격리 위반) |
| 발송 권한 | `ROLE_ADMIN` 하나 | "회사 대표", "부서장" 같은 구분이 없다 |
| 연결 사용자 정보 `WsUser` | userId, username, jti, roles | `companyId`, 부서가 없어 대상 필터링이 불가능하다 |
| 저장 | 저장하지 않음 | 오프라인 직원은 공지를 영영 받지 못한다 |

`app_user`에는 `company_id`만 있고 직위·직책·부서가 없다. 이 요구사항은 AS-IS 데이터(`sys01_company`, `emp03_trans`, `sys04_role`/`sys05_user_role`)가 있어야 제대로 설계된다.

### 8.3 설계 방향

**① 대상 범위와 목적지**

| 범위 | 목적지 | 구독 허용 조건 (`StompAuthChannelInterceptor`) | AS-IS 근거 |
|:---|:---|:---|:---|
| 회사 | `/topic/company/{companyId}` | `WsUser.companyId == {companyId}` | `emp01_company_id` |
| 조직(부서) | `/topic/org/{orgCodeId}` | 본인 소속(겸직 포함) 조직 | 최신 유효 `emp03_trans.emp03_org_code_id` |
| 지정 사원 | `/user/queue/notifications` (기존) | 본인 | `bbs03_target.bbs03_person_id` |
| 전체 고객사 | `/topic/notice` (기존) | 인증 사용자 | `bbs02_public_company_yn` (운영사 공지) |

- 목적지 경로의 ID는 서버가 **구독 시 본인 정보와 대조**한다. 클라이언트가 다른 회사 ID로 구독하면 `WS_DESTINATION_DENIED`를 받는다.
- 발송 API는 대상 회사를 요청으로 받지 않고 **발송자 토큰의 `companyId`** 를 쓴다. 그래서 회사 A 사용자는 구조적으로 회사 B에 보낼 수 없다.
- 기존 `WsRoute.all(destination)`으로 Redis 중계를 타므로 다중 인스턴스에서도 추가 작업 없이 동작한다.
- `/topic/notice`(전체 고객사)는 운영사(시스템 관리자) 전용으로 제한한다.

**② 발송 권한**

직위·직책(`EmpPosCode` 100 사장, `EmpTitleCode` 100 대표이사)이 아니라 **역할(`sys04_role`/`sys05_user_role`)** 로 판단하는 것을 권장한다.
- AS-IS의 권한 체계 자체가 역할 기반이다(메뉴 권한 `sys07_role_menu`). 발령 때마다 직위 코드를 권한에 연동하면 관리가 어렵다.
- "대표이사가 보낸다"는 조건은 해당 회사에서 대표이사에게 "회사 공지 발송" 역할을 부여하는 것으로 표현한다.
- 역할명 → Spring 권한 매핑(`asis-db-연동.md` Q6)이 정해지면 예를 들어 `COMPANY_NOTICE` 권한으로 검사한다.

**③ 저장 + 실시간 push (AS-IS 공지 테이블 연계)**

AS-IS에는 이미 공지와 대상 모델이 있다: `bbs02_notice`(공지), `bbs04_target_company`(대상 회사), `bbs03_target`(대상 사원).
WebSocket은 공지를 **저장하는 수단이 아니라 "새 공지가 있다"는 실시간 트리거**로 쓰는 것이 맞다.

```
발송 → bbs02_notice (+ bbs03/bbs04 대상) INSERT → 커밋 후 WsPublisher.publish(회사/조직/사원 목적지, NOTICE{noticeId})
                                                         │
접속 중 사용자: 즉시 알림 표시 ◀───────────────────────────┘
오프라인 사용자: 다음 로그인 시 MyPage 공지 목록(bbs02 조회)에서 확인
```

- 커밋 후 발행(`@TransactionalEventListener(AFTER_COMMIT)`)한다. 롤백된 공지가 push되지 않게 하기 위해서다.
- `NOTICE` payload에 `noticeId`를 넣는다. 클라이언트는 알림을 클릭하면 공지 상세로 이동한다.
- 7장의 "오프라인 알림 미저장" 제약이 함께 해결된다.

**④ UI**

- 발송 폼: 대상 범위(우리 회사 전체 / 조직 선택 / 사원 선택)를 고르고, 수준, 제목, 내용을 입력한다. 권한이 있는 사용자에게만 표시한다.
- 조직 선택은 `org02_info` 트리(`org02_parent_code_id`)를 쓴다.
- 수신: 우하단 알림에 `[회사 공지]`, `[부서 공지]` 구분을 표시하고, MyPage 공지 영역을 갱신한다.

### 8.4 작업 목록

1. (선행) AS-IS DB 연동: 로그인 ID, 역할 매핑 (`asis-db-연동.md` 6장 1~3단계)
2. `WsUser`에 `companyId`, `orgCodeIds`, 권한 목록을 추가하고, 핸드셰이크 시 채운다.
3. `WsDestinations`에 회사·조직 목적지 패턴을 추가하고, `StompAuthChannelInterceptor`에 소속 검사를 추가한다(+ 테스트: 타 회사 구독 거부).
4. `PushService`: `bbs02_notice` 저장 → 커밋 후 발행. 발송 API는 `/api/push/company-notice` 또는 AS-IS 공지 API와 통합한다.
5. `RealtimeCard`(또는 MyPage)에 발송 폼과 수신 표시를 추가한다.
6. 검증: 서로 다른 회사 사원 2명 이상으로 격리 테스트를 하고, 다중 인스턴스 전달을 확인한다.
