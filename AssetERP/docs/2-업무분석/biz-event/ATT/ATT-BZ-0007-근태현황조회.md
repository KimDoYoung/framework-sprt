# ATT-BZ-0007 근태현황을 본다(관리자 하루 전 직원 · 직원 본인 기간)

> **한 줄 요약** — 결과를 보는 쪽 이벤트(쓰기 없음). #1487 근태현황(관리자)은 **하루의 전 직원**(기록이 없으면 `미출근`)을, #1492 근태현황은 **로그인 직원 본인의 기간**을 날짜마다 한 줄(휴일 포함)로 보여 준다. 상태는 정책·달력·휴가·오후근무·연장근무 결재·보정 시각으로 조회 때 계산한다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리(#1487), 직원(#1492) |
| 언제 | 수시 |
| 먼저 있어야 하는 것 | ATT-BZ-0001·0002(·0005) |
| 다음 이벤트 | — |
| 실제 실행 | kalpa, 2026-11-12, API: 301 #1487 `2026-11-12` 7줄(AS-IS 7 = 7), 401 #1492 `2026-11-01~12` 12줄(AS-IS 12 = 12) |
| 메뉴 | #1487 경영관리 > 06. 근태관리 > 근태현황(관리자), #1492 같은 곳 > 근태현황. kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 경영관리 | #1487 | 근무일자·검색·사원 → [조회] | 재직 직원마다 한 줄: 상태(`미출근`·`지각`·`연장근무(미신청)` …)·출근·퇴근·보정 시각 |
| 2 | 직원 | #1492 | 기간 → [조회] | 날짜마다 한 줄(토·일은 구분 `휴일`) |
| 3 | 둘 다 | 〃 | 사유 아이콘 | 출근·퇴근 사유 창 |

## DB에 남는 것

없음(읽기만). 읽는 테이블: `att01`·`att02`·`att03`·`att04`·`att05_pm_work`·`emp01`·`emp03`·`emp20_leave`·`sys12_calendar`·`apr01_appr`.

## 업무 규칙 · 주의

- #1492는 서버가 로그인 사원으로 정한다(`getPersonStatus(user.getUserId())`). #1487은 회사 전 직원.
- 휴일 줄의 상태도 `미출근`으로 나온다(구분 열은 `휴일`). AS-IS SQL과 행 수가 같아 원본 동작으로 본다.
- #1487 API에 권한 검사가 없다 — 사원 402가 `GET /api/v1/att/commutes/status`로 전 직원 7줄을 받았다 → [의심 #62](../../보안_및_버그_의심.md).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ATT-BZ-0007
needs: [ATT-BZ-0002]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: GET /api/v1/att/commutes/status?baseDate=2026-11-12
    compare: att02_commute.getCommuteStatus   # 7 = 7
  - no: 2
    actor: { company: kalpa, user: "401", password: "1111" }
    api: GET /api/v1/att/commutes/person-status?startDate=2026-11-01&closeDate=2026-11-12
    compare: att02_commute.getPersonStatus    # 12 = 12
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Att02_Tab_CommuteStatus`(사유 창 L176), `Att02_Tab_PersonStatus`(L96), 서버 `Att02_Commute.getCommuteStatus`·`getPersonStatus`.
- TOBE: `AttCommuteStatusController`(`/api/v1/att/commutes/status`·`/person-status`), `AttCommuteStatusService`, `Att02_Tab_CommuteStatus.tsx`·`Att02_Tab_PersonStatus.tsx`.
</details>
