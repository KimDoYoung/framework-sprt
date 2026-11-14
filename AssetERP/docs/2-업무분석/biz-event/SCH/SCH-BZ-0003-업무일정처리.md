# SCH-BZ-0003 기한이 된 업무일정을 처리한다

> **한 줄 요약** — 직원이 #1043 업무일정 처리에서 기준일(◀ ▶)을 고르면 그날이 마감일인 **내 일정과 공유받은 일정**이 나온다(조회 SQL이 기한일·지정일에서 만들어 보여 주는 가상 행 — 아직 `sch04_list`에 없음). 처리여부(미처리 0 · 완료 1 · 해당없음 5)·비고를 고치고 **[저장]**하면 처음엔 `sch04_list`에 새 행이 생기고, 그 뒤엔 그 행의 처리여부·처리일·처리자·비고만 바뀐다. 완료·해당없음인데 처리일이 비면 오늘로 채운다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 일정 담당자(시험 401) |
| 언제 | 기한일마다 |
| 먼저 있어야 하는 것 | 0001(기한일) |
| 다음 이벤트 | 0005 조회 |
| 실제 실행 | 2026-11-14, kalpa API. `GET /sch/lists/todo?startDate=2026-11-10` 1행(월별 10일, `listId` 1 = 가상) · 11-20 1행(지정일) — AS-IS `sch04_list.selectByManagerId` 1 = 1 · 1 = 1. 11-10 행 완료·비고 `10월분 제출` 저장 → `sch04` +1(`202611149151548`), 다시 조회하면 실제 ID·처리일 2026-11-14 |
| 메뉴 | #1043 스케줄 > 01. 업무일정 > 업무일정 처리 (9곳). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | #1043 | (●)마감일 · 기준일 2026-11-10 · 분류·처리여부 → [조회] (`GET /sch/lists/todo?startDate=&manageCheck=false&statusCode=%`) | 그날 마감 일정 |
| 2 | 〃 | 〃 | 처리여부 `완료`·비고 → [저장] (`PUT /sch/lists/todo [{listId, closeDate, manageDate, infoId, statusCode:"1", note, …}]`) | 처리일 = 오늘 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `sch04_list` | 처리 결과(마감일·처리일·처리여부·처리자·비고, `schedule_cd` 1) | +1 |

## 업무 규칙 · 주의

- 저장 전 행은 `listId`가 1, 2 …(가상)다. 서버는 `selectById`가 없으면 새로 넣는다.
- **같은 회사 직원이 남의 처리결과를 바꾸고 처리자를 자기로 바꾼다**(처리자 `personId`는 요청 값). 원본은 회사 조건도 없다 → [#249](../../보안_및_버그_의심.md).
- 처리한 일정은 삭제할 수 없다(0001 [삭제] → "이미 발생한 스케줄이므로 삭제할 수 없는 정보입니다" — 확인함).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: SCH-BZ-0003
company: kalpa
user: 401
pre: [SCH-BZ-0001]
steps:
  - {no: 1, api: GET /api/v1/sch/lists/todo?startDate=2026-11-10, expect: "rows 1, listId 1"}
  - {no: 2, api: PUT /api/v1/sch/lists/todo, body: [{listId: 1, closeDate: 2026-11-10, manageDate: 2026-11-14, infoId: "{infoId}", scheduleCode: "1", cycleCode: "03", managerId: 401, personId: 401, statusCode: "1", note: "10월분 제출", deadlineId: "{월별}", mngOrgId: "{경영지원본부}"}], expect: sch04_list +1}
  - {no: 3, api: "DELETE /api/v1/sch/infos", body: ["{infoId}"], expect: "400 이미 발생한 스케줄"}
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Sch04_Tab_ToDoList`, `Sch04_List.insertCheck` L207-252, SQL `sch04_list.selectByManagerId`·`confirmUpdate`.
- TOBE: `SchListService.searchTodo` L91-96·`saveTodo` L112-122, 화면 `pages/sch/Sch04_Tab_ToDoList.tsx`(완료 코드 1·2·5면 처리일 채움).
- 확인: `compare GET /sch/lists/todo --sql sch04_list.selectByManagerId`(shareType 1, manageCheck false) 11-10 1 = 1, 11-20 1 = 1.
</details>
