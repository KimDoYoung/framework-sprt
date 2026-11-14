# FND-BZ-0010 펀드회계 일일점검을 작성하고 확인한다

> **한 줄 요약** — 펀드회계 담당이 매일 해야 할 점검(예: 전일 기준가 확정, NAV 대사 완료)을 **점검항목**으로 정해 두고(#1240), 항목마다 **작성그룹**(작성자 묶음 + 확인자)을 지정하면, 그 그룹의 직원이 매일 **예(Y)·아니오(N)·해당없음(X)** 로 답한다(#1241). 답이 N이면 **사유**를 적는다. 확인자(조직장)가 **확인**(#1242)하고, 모든 직원이 **현황**(#1243)을 본다. 점검 분류 트리는 KFS 공통(회사 0, `운용지원` 아래 업무시작·보고 등)이고, 회사는 그 분류 밑에 자기 항목을 만든다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 회계 관리자(항목), 작성그룹 직원(작성), 확인자 박부장(확인), 전 직원(현황 조회) |
| 언제 | 항목은 도입 때·수시, 작성·확인은 매일 |
| 먼저 있어야 하는 것 | FND-BZ-0004(펀드), 작성그룹(`sch22` — #1228 체크리스트 작성그룹과 같은 곳, `PUT /sch/write-groups`) |
| 다음 이벤트 | — |
| 실제 실행 | kalpa, 2026-11-13, API. 점검항목 2건(`업무시작`: 전일 기준가 확정 여부 확인 09:00 · 펀드 NAV 대사 완료 확인 11:00) → 작성그룹 `펀드회계 일일점검팀`(확인자 박부장, 구성원 김사원) 만들어 두 항목에 지정 → 김사원이 2026-11-13에 작성(1번 Y, 2번 N + 사유 "대사 차이 확인 중 — 오후 재점검" + 비고) → 박부장(201)이 확인(2건, `confirmYn`·확인자 기록). 그룹 밖 사원 402는 목록이 비어 보인다. 화면 눈 확인 `대기(일괄)` |
| 메뉴 | #1240 일일점검내역 관리, #1241 일일점검내역 작성, #1242 일일점검내역 확인, #1243 일일점검내역(현황). kalpa 메뉴 없음 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 회계 관리자 | #1240 | 분류 선택 → [등록] 점검내용·설명·Cut-Off·화면번호·순서 → [저장] (`POST /chk/daily-lists`) | 점검항목 |
| 2 | 회계 관리자 | #1240 / #1228 | 작성그룹 만들기·구성원 지정 (`PUT /sch/write-groups`·`…/shares`) → 항목 선택 → [작성그룹 지정] (`PUT /chk/daily-lists/write-group`) | 항목 ↔ 그룹 |
| 3 | 작성자 | #1241 | 분류·일자 조회 → 행에서 예/아니오/해당없음 선택(`PUT …/answers`), 사유(`…/{id}/reason`)·비고(`…/note`) | 점검 작성 |
| 4 | 확인자 | #1242 | 일자 조회 → 체크 → [확인] (`PUT /chk/daily-list-writes/confirm`) | `confirmYn` true·확인자 |
| 5 | 전 직원 | #1243 | 일자·미작성·미확인 조건 조회 (`GET …/status-list`) | 현황 |

## DB에 남는 것

| 테이블 | 무엇 | kalpa 실행 |
|:---|:---|:---|
| `chk02_daily_list` | 점검항목(분류·내용·Cut-Off·작성그룹) | +2 |
| `sch22_write_group` · 공유자 | 작성그룹·구성원 | +1 · +1 |
| `chk03_daily_list_write` | 일자별 작성(답·사유·비고·확인) | 401 2건(확인 완료) + 402 1건(그룹 밖, 아래) |

## 업무 규칙 · 주의

- 작성 화면 목록(`GET …/daily-list-writes`)은 **작성그룹 구성원에게만** 항목을 보인다(그룹 지정 전엔 사원 401도 빈 목록, 그룹 밖 402도 빈 목록).
- 확인자 목록(`confirm-list`)은 그룹의 확인자(박부장)에게만 보인다.
- **답 코드(Y/N/X) 검사가 없다**: `Z`도 저장된다 → [의심 #176](../../보안_및_버그_의심.md).
- **서버가 작성그룹 소속을 보지 않는다**: 그룹 밖 사원 402가 `answers`를 부르면 점검 행이 만들어진다(화면 목록에 안 보일 뿐). 그 행은 지울 API가 없어 kalpa에 1건 남아 있다 → [의심 #177](../../보안_및_버그_의심.md).
- **확인자가 아닌 사람도 확인한다**: 작성자 401이 자기 답을 직접 확인(확인자=본인)했고, 확인한 뒤에도 답을 바꿀 수 있었다(X로 바꿨다가 Y로 되돌림) → [의심 #178](../../보안_및_버그_의심.md).
- 현황(`status-list`)은 로그인한 모든 직원에게 회사 전체 점검 현황이 보인다(#1243 화면의 성격상 정상으로 보이나, 메뉴 권한 없는 사원에게도 열려 있다 — `yunhee biz-authz chk`가 ⚠로 표시).
- `yunhee trace-crud --screen 1241`: `chk03_daily_list_write` AS-IS CRU / TOBE RU("등록·수정 공용 UDM", 정상). #1243·#1242에 `emp04_add_title` 읽기가 다른 화면(결재 조회)으로 빠져 있다(표시일 뿐).
- 점검항목 복사(`POST /chk/daily-lists/copy`)를 kalpa 관리자가 다른 회사 ID(28000)로 호출하면 `1`을 돌려주지만 그 회사에 행이 생기지는 않았다(조건 불일치로 보임, 원본 동작 — 코드 주석 참고). 다른 회사에 쓰는 문제는 확인되지 않았다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: FND-BZ-0010
needs: [FND-BZ-0004]
steps:
  - no: 1
    actor: { company: kalpa, user: admin, password: "1111" }
    api: POST /api/v1/chk/daily-lists
    body: { classTreeId: "{업무시작}", content: "전일 기준가 확정 여부 확인", cutoff: "09:00", windowNo: "1243", seq: 1, useYn: "true" }
    expect: { track: { chk02_daily_list: +1 } }
  - no: 2
    api: [PUT /api/v1/sch/write-groups, PUT /api/v1/sch/write-groups/{id}/shares, PUT /api/v1/chk/daily-lists/write-group]
  - no: 3
    actor: { user: "401" }
    api: [POST /api/v1/chk/daily-list-writes, PUT /api/v1/chk/daily-list-writes/answers, PUT …/{id}/reason]
    expect: { track: { chk03_daily_list_write: +2 } }
  - no: 4
    actor: { user: "201" }
    api: PUT /api/v1/chk/daily-list-writes/confirm
    expect: { confirmYn: true }
  - no: 5
    actor: { user: "402" }
    api: GET /api/v1/chk/daily-list-writes
    expect: { rows: 0 }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Chk02_Tab_DailyList`(#1240)·`Chk03_Tab_DailyListWrite`(#1241)·`Chk03_Tab_DailyListConfirm`(#1242)·`Chk03_Tab_DailyListStatus`(#1243), 서버 `Chk02_DailyList`·`Chk03_DailyListWrite`.
- TOBE: `ChkDailyListController`·`ChkDailyListWriteController`, `ChkClassTreeController`, `SchWriteGroupController`.
</details>
