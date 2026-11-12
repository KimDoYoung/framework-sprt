# ATT-BZ-0002 직원이 출근·퇴근을 기록한다(지각·조기퇴근 사유, 외근 후 퇴근, 빠진 퇴근시간 제출)

> **한 줄 요약** — 근태팝업을 켠 회사의 직원은 로그인하면 **출퇴근 창**이 뜬다(오늘 출근 기록이 없거나 마지막 기록이 오늘이 아니면). [출근]은 서버 시각으로 오늘 행을 만들고, [퇴근]·[외근 후 퇴근]은 퇴근 시각을 적는다. 정책보다 늦거나 이르면 사유 창이 뜨고, 지난 근무일의 퇴근을 빠뜨렸으면 퇴근시간을 직접 적어 내며 그 행은 **관리자 확인필요**가 된다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원 본인(kalpa 401 김사원·402 최사원) |
| 언제 | 매일 |
| 먼저 있어야 하는 것 | ATT-BZ-0001(근태팝업사용·정책), SYS-BZ-0012(로그인) |
| 다음 이벤트 | ATT-BZ-0003·0004(연장·오후근무 — 출퇴근 창의 단추로 연다), 0005(관리자 확인), 0007(현황) |
| 실제 실행 | kalpa, 2026-11-12, API: 401 출근→지각 사유→중복 출근(−1)→퇴근→조기퇴근 사유→지난 11-05 퇴근시간 21:00 제출, 402 출근→외근 후 퇴근 |
| 메뉴 | 메뉴 없음 — 로그인 직후 창(`Att02_Lookup_Commute`, `MainFrame.checkCommute`·`JSCaller`). 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | 로그인 | 로그인 | 회사가 근태팝업사용이고 오늘 출근 기록이 없으면 출퇴근 창 |
| 2 | 〃 | 출퇴근 창 | [출근] | 오늘 행이 생기고 출근시각이 보인다. 이미 출근했으면 거절(−1) |
| 3 | 〃 | 〃 | (정책 출근시각 + 지각 유예보다 늦으면) 사유 창 → 사유 → [저장] | 출근사유 저장, 상태 `지각` |
| 4 | 〃 | 〃 | [퇴근] 또는 [외근 후 퇴근] | 퇴근시각 기록(외근 후 퇴근은 표시 `true`). 출근 기록이 없으면 거절(−2). 다시 누르면 **퇴근시각을 덮어쓴다** |
| 5 | 〃 | 〃 | (정책 퇴근시각 − 조기 유예보다 이르면) 사유 창 → [저장] | 퇴근사유 저장 |
| 6 | 〃 | 〃 | 지난 근무일 퇴근이 비어 있으면 퇴근시간 창 → `HH:mm` → [저장] | 그 행 퇴근시각이 적은 값이 되고 상태 `관리자 확인필요`(ATT-BZ-0005에서 해제) |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `att02_commute` | 출근 행(`check_in_time` = 서버 `NOW()`), 퇴근시각·외근표시, 출근/퇴근 사유, 퇴근시간 제출 시 `admin_check_yn=true` | kalpa 401·402 오늘 행 +2 |

## 결과를 볼 수 있는 화면

- #1492 근태현황(본인), #1485·#1487(관리자).

## 업무 규칙 · 주의

- 상태는 저장하지 않고 조회 때 계산한다(정책·달력·휴가·연장근무 결재와 비교): `정상근무`·`지각`·`조기퇴근`·`연장근무(미신청)`·`관리자 확인필요(99)`·`미출근` 등.
- TOBE 서버는 근무일자를 **오늘 또는 본인 마지막 근무일**만 받는다(원본은 화면이 보낸 날짜를 그대로 씀 — 보안 보강). 실행: 402가 `baseDate 2026-11-05`로 출근 → "근무일자가 올바르지 않습니다".
- 사유·퇴근시간 제출은 **본인 행만**(TOBE `countMine`). 402가 401 행에 사유 → `DATA_NOT_FOUND`. 원본은 행 ID만 보고 고친다.
- 퇴근시간 제출은 시각 형식만 본다(`25:00` → "퇴근시간 형식은 HH:mm 입니다."). 날짜는 그 행의 날짜이고 값 범위(출근보다 이른 퇴근 등)는 보지 않는다 — 관리자 확인으로 거른다.
- ⚠ 실행 환경: 로컬 DB 시간대가 `Etc/UTC`라 `NOW()`가 9시간 이르게 찍힌다(20:04 출근이 `11:04`). 원본도 `NOW()`를 쓰므로 DB 시간대가 KST인 운영에서는 맞다. 이 문서의 지각·조기퇴근 판정은 그 시각 기준이다.
- 근태잠금(`commuteLockYn`)은 원본에서 동작하지 않는다 → [이상한점 #224](../../../원본-이상한점.md).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ATT-BZ-0002
needs: [ATT-BZ-0001]
steps:
  - no: 1
    actor: { company: kalpa, user: "401", password: "1111" }
    api: GET /api/v1/att/commutes/me/last-info
    expect: { popupYn: true, last: null }
  - no: 2
    api: POST /api/v1/att/commutes/me/check
    body: { on: true }
    expect: { data: 1, track: { att02_commute: +1 } }
  - no: 2b
    api: POST /api/v1/att/commutes/me/check
    body: { on: true }
    expect: { data: -1 }
  - no: 3
    api: PUT /api/v1/att/commutes/me/{commuteId}/reason
    body: { actionCode: in, reason: "병원 진료 후 출근" }
  - no: 4
    api: POST /api/v1/att/commutes/me/check
    body: { on: false }
    expect: { data: 1 }
  - no: 6
    api: PUT /api/v1/att/commutes/me/{11-05 행}/check-out-time
    body: { checkOutTime: "2026-11-05", checkOutTimeStr: "21:00" }
    expect: { statusName: "관리자 확인필요" }
  - no: 4b
    actor: { company: kalpa, user: "402", password: "1111" }
    api: POST /api/v1/att/commutes/me/off-work
    expect: { data: 1 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `MainFrame.checkCommute` L336-374, `Att02_Lookup_Commute`(getLastInfo L147, selectByDate L276, insert L378, insertOffWork L423, 사유 창 L364, 퇴근시간 창 L168), `Att02_Edit_Reason`(updateReason), `Att02_Edit_CheckOutTime`(updateCheckOutTime), 서버 `att.Att02_Commute`·SQL `att02_commute.insert`·`updateOff`·`updateOffWork`·`updateReason`·`updateCheckOutTime`.
- TOBE: `AttCommuteController` `/me/last-info`·`/me`·`/me/check`·`/me/off-work`·`/me/{id}/reason`·`/me/{id}/check-out-time`, `AttCommuteService.checkInOut` L78-90·`checkBaseDate` L128-134, `Att02_Lookup_Commute.tsx`·`Att02_Edit_Reason.tsx`·`Att02_Edit_CheckOutTime.tsx`, `MainFrame.tsx`.
</details>
