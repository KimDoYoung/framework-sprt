# SYS-BZ-0021 접속자에게 로그아웃 알림을 보낸다(배포 전)

> **한 줄 요약** — 배포 전에 KFS 관리자가 #1404에서 **지금 접속 중인 사원**을 보고, 알림("곧 배포합니다, 저장하세요")을 보낸 뒤 **강제 로그아웃**시킨다. 대상은 전 고객사다. 알림·로그아웃은 실시간(WebSocket)으로 가고, DB에는 보안 감사 로그만 남는다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 관리자 `admin/admin/1111` (받는 쪽: 접속 중인 고객사 사원) |
| 언제 | 배포 전, 긴급 점검 때 |
| 먼저 있어야 하는 것 | 받는 사원이 **로그인해서 화면을 열어 둔 상태**(WebSocket 연결) — 로그인만 하고 연결이 없으면 목록에 없다 |
| 실제 실행 | 2026-11-10 — 칼파테크 401 김사원·402 최사원을 시험 클라이언트로 접속시켜 개별전송·전체전송·개별로그아웃 확인. **전체로그아웃은 안 돌림**(아래 주의) |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 0 | 김사원(401)·최사원(402) | 로그인 → 아무 화면 | (로그인해 둔다) | 접속 중 |
| 1 | KFS 관리자 | **#1404** 관리자 > 01. 고객관리 > 로그아웃 알림 관리 | 고객사 `칼파테크` → [조회] | 2명(고객사·사원명·사번·직위·사무실·휴대폰). 고객사를 비우면 전 회사 접속자 |
| 2 | 〃 | 〃 | 김사원 체크 → [개별전송] → 메세지 작성 "10분 뒤 배포합니다…" → [전송] | 김사원 화면에 **알림**(제목 "알림"). 최사원은 안 받음 |
| 2-1 | 〃 | 〃 | 접속하지 않은 김사장도 함께 보내면 | "[ 김사장 ] 해당 사용자는 오프라인 상태입니다" — 접속한 사람에게만 간다 |
| 3 | 〃 | 〃 | [전체전송] → 내용 → [전송] | 접속한 **모두**(김사원·최사원)에게 **공지** |
| 4 | 〃 | 〃 | 메세지 작성의 [전송 및 로그아웃] → "알림발송 후, 5분뒤 자동 로그아웃됩니다…" [예] | 알림을 보내고 툴바에 **"300초 남았습니다"** 줄어듦 — **0초가 돼도 자동 로그아웃은 없다**(아래 주의) |
| 5 | 〃 | 〃 | 김사원 체크 → [개별로그아웃] → [예] | 김사원 화면: **"관리자가 접속을 종료했습니다. 다시 로그인해주세요."** → 로그인 화면. 최사원은 그대로. 다시 조회하면 1명 |
| 6 | 〃 | 〃 | [전체로그아웃] → [예] | 접속한 **모든** 사용자 로그아웃 — **누른 KFS 관리자 자신도**(이번엔 돌리지 않음) |

## DB에 남는 것

업무 테이블에는 아무것도 안 남는다. 알림·로그아웃은 실시간 전달이고, 기록은 보안 감사 로그뿐이다.

| 테이블 | 무엇 | 단계 | 이번 실행 |
|:---|:---|:---|---:|
| `sys71_security_audit_log` | `NOTIFICATION_SEND`(개별 알림) | 2 | 1 |
| 〃 | `NOTICE_BROADCAST`(전체 공지) | 3 | 1 |
| 〃 | `WS_FORCED_CLOSE`(강제 로그아웃으로 연결 끊음) | 5 | 1 |
| 〃 | `WS_CONNECT`·`WS_DISCONNECT`(접속·끊김) | 0·5 | 여러 건 |

## 업무 규칙 · 주의

- **"접속 중" = 화면을 열어 둔 사원**(WebSocket 연결). 목록에는 **사원만** 나온다 — 회사 관리자(`admin` 계정)와 KFS 관리자는 목록에 없다. 그러나 **전체로그아웃은 그들까지 모두** 끊는다.
- **전체로그아웃은 누른 KFS 관리자 자신도 로그아웃된다**(AS-IS 그대로, TOBE 주석에도 적음). 이번 시험에서 돌리지 않은 이유: 사용자가 열어 둔 다른 브라우저 세션까지 끊기 때문. 화면 확인 때 사용자가 직접 눌러 본다.
- **"5분뒤 자동 로그아웃" 문구와 달리 자동 로그아웃은 없다.** 300초 표시는 KFS 화면의 카운트다운일 뿐이고, 0초가 되면 관리자가 직접 [개별로그아웃]·[전체로그아웃]을 눌러야 한다(AS-IS `startTimer()` L279-299도 표시만 한다 — TOBE 그대로).
- 알림 제목은 늘 **"알림"**이다. AS-IS 알림에는 제목이 없었고 TOBE 알림 부품은 제목이 필요해 고정 문구를 넣었다(TOBE에서 정한 것).
- 내용이 비면 "알림내용을 입력해주세요". 고객사 관리자가 이 API를 부르면 403.
- 같은 사번으로 다시 로그인하면 먼저 연결된 쪽이 끊긴다(동시 접속 차단 — 감사 로그 `MULTI_LOGIN_BLOCKED`). 시험 중 여러 번 로그인해서 생긴 기록이다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: SYS-BZ-0021
setup:
  # 받는 쪽은 STOMP 연결이 있어야 "접속 중" — 시험 클라이언트(@stomp/stompjs, 쿠키 로그인 후 ws://kalpa.localhost:8082/AssetERP/ws, /user/queue/session·/user/queue/notifications·/topic/notice 구독)
  - { company: kalpa, user: "401", password: "Kalpa1234!" }   # 김사원 202611109048654
  - { company: kalpa, user: "402", password: "Kalpa1234!" }   # 최사원
steps:
  - no: 1
    actor: { company: admin, user: admin, password: "1111" }
    screen: 1404
    api: GET /api/v1/sys/websocket/persons?companyId=202611109046432
    expect: { total: 2 }
  - no: 2
    api: POST /api/v1/sys/websocket/alarms
    body: { personIds: [202611109048654, 202611109048614], message: "[시험] 10분 뒤 배포합니다 (SYS-BZ-0021)" }
    expect: { processed: 1, offlineNames: [김사장], "401 수신": "/user/queue/notifications NOTIFICATION", "402 수신": 없음 }
  - no: 3
    api: POST /api/v1/sys/websocket/alarms/all
    body: { personIds: [], message: "[시험] 전체 공지" }
    expect: { processed: 2, "401·402 수신": "/topic/notice NOTICE" }
  - no: 5
    api: POST /api/v1/sys/websocket/force-logouts
    body: { personIds: [202611109048654] }
    expect: { processed: 1, "401 수신": "/user/queue/session SESSION_TERMINATED(FORCED_LOGOUT) → close 4001", "목록": 1 }
  - actor: { company: kalpa, user: admin }
    api: POST /api/v1/sys/websocket/alarms/all
    expect: { status: 403 }
```
</details>

<details>
<summary>근거 (yunhee · AS-IS · TOBE)</summary>

- 조사: `yunhee screen-desc 1404 -s`, `yunhee analysis screen Sys86_Tab_Websocket --section events`, `yunhee analysis method Sys86_Tab_Websocket.startTimer`·`sendMessage -o code`, `yunhee api`, `yunhee sql`(감사 로그). 받는 쪽은 yunhee로 WebSocket을 열 수 없어 스크래치패드의 Node 시험 클라이언트(`@stomp/stompjs` 7.3, Node 24 내장 WebSocket + 쿠키 헤더)로 접속시켰다 — `docs/websocket-설계.md` 6.1과 같은 방식.
- AS-IS: `Sys86_Tab_Websocket`(#1404, L65-392 — 조회 `emp.Emp01_Person.selectByLoginUserPaging`, 전송·로그아웃은 클라이언트 JSNI `sendWebSocketAlarmMessage`·`sendWebSocketForce`, 접속자는 `Frm01_List.getWebsocketList`), `utils/SendMessage`(메세지 작성, 전송 및 로그아웃 L81-106)
- TOBE: `SysWebsocketController` `GET /api/v1/sys/websocket/persons`, `POST …/alarms`·`…/alarms/all`·`…/force-logouts`·`…/force-logouts/all`; `SysWebsocketService`(접속자 = `PresenceService`, 알림 = `PushService`, 로그아웃 = `AuthService.forceLogout`, 모두 `requireSysAdmin`); 화면 `Sys86_Tab_Websocket.tsx`, `utils/SendMessage.tsx`
- TOBE 상태(2026-11-10): **실행** — 접속자 목록·개별전송(오프라인 이름)·전체전송·개별로그아웃(4001 FORCED_LOGOUT, 다른 사원 유지)·고객사 403·빈 내용. 전체로그아웃은 안 돌림. 화면 눈 확인(받는 쪽 알림 모양·로그인 화면 이동)·자동 시험은 아직.
</details>
