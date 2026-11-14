# SCH-BZ-0004 데일리 체크리스트를 체크하고 결재(A31)받는다

> **한 줄 요약** — 직원이 #1308 데일리 체크리스트에서 기준일을 고르면 **'데일리'로 등록한 내 일정**과 **나에게 공유된 공모주 일정**(`[수요예측] 종목명` 등, 0007)이 나온다. 행마다 **처리완료·해당없음**을 체크하면 바로 저장되고(`sch04_list`, 처리자 = 나), **[상신]** → 결재문서 창(링크코드 **A31**) → 결재선 → 상신하면 그리드 전체 행에 결재문서 ID가 붙는다. 상신·결재 중·완료 행은 화면이 고치지 못하게 막는다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원 → 결재자(팀장) |
| 언제 | 매일 |
| 먼저 있어야 하는 것 | 0001(데일리 일정), **A31 문서분류 지정**(DCR-BZ-0004 — kalpa는 비어 있었음) |
| 다음 이벤트 | 0005 체크내역 |
| 실제 실행 | 2026-11-14, kalpa API. 401 매일 일정 `출근 후 메일·결재함 확인`(`…552`, 매일 `cycleCode 01`·`cycleCalcType 03` — `sch09` 안 생김) → `GET /sch/lists/daily-check` 11-13(금) 1행·11-14(토) 0행·11-16(월) 2행(매일 일정 + FND-BZ-0008 공모주 `[수요예측] 칼파바이오(시험)`), AS-IS 1 = 1 · 2 = 2. 11-16 두 행 처리완료·해당없음 → `sch04` +2. kalpa A31 → `보고 및 공시/업무보고서/업무보고서`(회사 0과 같은 자리, 회사 관리자 `PUT /dcr/links`) → `yunhee biz-appr A31` 상신 `202611149151559` → `PUT /sch/lists/appr-id` 연결 → 301 승인 30 |
| 메뉴 | #1308 스케줄 > 02. 업무일정 체크 > 데일리 체크리스트(상신) (5곳). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | #1308 | 기준일·분류·검색어 → [조회] (`GET /sch/lists/daily-check?startDate=`) | 데일리 일정 + 공유 공모주 |
| 2 | 〃 | 〃 | 처리완료(또는 해당없음) 체크 (`PUT /sch/lists/daily-check/status` — 같은 일정·담당자·마감일 행이 있으면 갱신, 없으면 새로) | 처리일·처리자 |
| 3 | 〃 | 〃 | [상신] → [예] → 결재문서 창(A31) → 결재선 → [상신] → 연결 (`PUT /sch/lists/appr-id {ids, apprId}`) | 결재 상태 열 |
| 4 | 결재자 | 결재문서 창 | [승인] | 완료(30) — 행 잠김(화면) |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `sch04_list` | 데일리 체크 행(처리여부·처리일·처리자·결재 ID `sch04_appr_id`) | +2 |
| `apr01_appr` 등 | A31 결재문서 | +1(완료) |
| `dcr30_link` | kalpa A31 문서분류 | 1행 갱신(남겨 둠) |

## 업무 규칙 · 주의

- 매일(01) 일정은 영업일만 나온다(토요일 0행).
- 공모주 행은 `scheduleCode` 5, 기한 ID 없음.
- **결재 완료 뒤에도 서버가 처리여부를 바꿔 준다**(잠금은 화면만) — 결재받은 내용과 DB가 달라진다 → [#250](../../보안_및_버그_의심.md). 원본도 같다.

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: SCH-BZ-0004
company: kalpa
user: 401
pre: [SCH-BZ-0001, "A31 문서분류 지정"]
steps:
  - {no: 1, api: "PUT /api/v1/sch/infos/{daily}", body: {title: "출근 후 메일·결재함 확인", dailyYn: true, privateYn: false, useYn: true}}
  - {no: 2, api: PUT /api/v1/sch/deadlines, body: {infoId: "{daily}", scheduleCode: "1", cycleCode: "01", cycleCalcType: "03", holidayCode: "0"}}
  - {no: 3, api: GET /api/v1/sch/lists/daily-check?startDate=2026-11-16, expect: rows 2}
  - {no: 4, api: PUT /api/v1/sch/lists/daily-check/status, body: {listId: 2, closeDate: 2026-11-16, manageDate: 2026-11-16, infoId: "{daily}", scheduleCode: "1", cycleCode: "01", managerId: 401, statusCode: "1"}, expect: sch04_list +1}
  - {no: 5, tool: "yunhee biz-appr A31 --ref {ids} --link-path /api/v1/sch/lists/appr-id --link-body '{\"ids\":[…],\"apprId\":{apprId}}' -u 401 -c kalpa --approver 301 --confirm", expect: "apr 30, sch04_appr_id"}
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Sch04_Tab_DailyCheckList`(retrieve L335-373, E11 상신 L521, updateApprId L551-571, settings L205-215 잠금), `Sch04_List.statusUpdateCheck` L254-316·`updateApprId`.
- TOBE: `SchListService.searchDailyCheck` L129-133·`updateStatus` L140-151·`updateApprId` L155-164, 화면 `pages/sch/Sch04_Tab_DailyCheckList.tsx`(`isApprBusy`).
- 확인: `compare GET /sch/lists/daily-check --sql sch04_list.selectByManagerId`(dailyChkYn true, manageCheck true, cancelYn true) 11-13 1 = 1, 11-16 2 = 2.
</details>
