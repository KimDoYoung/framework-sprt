# ICS-BZ-0021 준법감시인이 체크리스트 현황을 보고, 회사 자체 점검항목을 더하고 법규에 연결한다

> **한 줄 요약** — 준법감시인은 #1231 내부통제내역 현황(준감인)에서 **항목 × 월 제출·확인 현황**을 보고, #1235 상세에서 미제출·미확인 건을 추려 내려받는다. 또 #1228 체크리스트 관리에서 KFS가 준 **공통 항목**의 사용 여부를 정하고 **회사 자체 항목**을 더하며, 항목 편집창에서 그 항목이 **어느 법규·마감과 연결**되는지(`sch05_relate_ics`) 정한다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 준법감시인 박부장 201 |
| 언제 | 점검 주기마다(현황), 기준이 바뀔 때(항목) |
| 먼저 있어야 하는 것 | ICS-BZ-0003(작성·확인 자료), ICS-BZ-0012(공통 체크리스트) |
| 다음 이벤트 | ICS-BZ-0017(결재 상신) |
| 실제 실행 | kalpa, 2026-11-13. 201: #1231 요약 5행(월별 칸 `X / X`) · #1235 상세 10행(담당그룹 정부장·박과장·최사원 등)·엑셀 내려받기. 자체 항목 저장(`ics10` +1) → 법규 연결(`sch05` +1) → 사용안함(`ics10`·`ics11` 갱신, `ics11` +1) → 공통 항목 사용안함→켜기 복원 → 연결·항목 삭제(`ics11` 고아 1행 남음 ⚠). 402가 KFS 공통 항목에 법규 연결을 넣음(⚠#153, 지움). RD 출력(`rd-print`)은 확인 안 함 |
| 메뉴 | #1231 준법감시 > 30. 내부통제 체크리스트 > 내부통제내역 현황(준감인), #1235 상세(준감인), #1228 관리. kalpa 메뉴 없음(API). 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 준법감시인 | #1231 | 연도·주기(월/분기) 고르고 조회 | 항목별로 월마다 제출·확인 상태 칸(`X / X` 꼴) |
| 2 | 〃 | #1235 | 기준월·대분류·중분류·검색어·[미제출 보기]·[미확인 보기] → [조회] | 항목별 담당자·담당부서·확인자·제출·확인 상태 |
| 3 | 〃 | #1235 | [엑셀다운로드]·[출력/다운로드] | 엑셀 / RD |
| 4 | 〃 | #1228 | 대·중분류 → [등록] → 항목 편집창(중분류·체크대상·판단기준·사용) | 회사 자체 항목 |
| 5 | 〃 | 항목 편집창 | [행 추가] → 법규 선택(조회창) → [저장] | 이 항목과 연결된 법규·마감 목록 |
| 6 | 〃 | #1228 | 사용여부 창 → 공통 항목을 `사용안함`/`사용` | 우리 회사 목록에서 숨김/표시 |
| 7 | 〃 | #1228 | [삭제] | 작성 내역이 있으면 못 지움(`check-delete`), 없으면 삭제 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ics10_checklist` | 회사 자체 항목(회사 ID가 우리 회사) | +1 → 삭제 후 0 |
| `ics11_checklist_company` | 회사별 사용 여부(공통·자체 항목 공통) | +1(사용안함 저장 때 생김) — ⚠ 삭제 뒤에도 남음(고아 1행) |
| `sch05_relate_ics` | 체크리스트 ↔ 법규·마감 연결 | +1 → 삭제 |

## 업무 규칙 · 주의

- 회사 ID 0(KFS 공통) 항목은 회사가 고칠 수 없다 — 저장·삭제는 로그인 회사 행만 바꾼다. 사용 여부만 회사별(`ics11`)로 정한다.
- 항목 저장은 중분류·체크대상이 필수이고, 회사 항목이면 `ics11`의 사용 여부도 함께 고친다.
- 항목을 지울 때 작성 내역이 있으면 지울 수 없게 서버가 센다(`check-delete`). 작성 기록 자체는 지워지지 않는다.
- AS-IS 상세 조회 SQL(`selectChecklistStatusPaging`)은 현재 로컬 DB에서 `sch22_confirmer_id` 열이 없어 `sql-check`가 실패한다 — 원본과 DB 스키마의 어긋남이라 TOBE 결과를 원본 SQL로 직접 대조하지 못했다.
- ⚠ `/sch/relate-ics` API가 로그인·소유 검사가 없어 일반 사원이 **KFS 공통 항목의 법규 연결**을 바꾼다 → [의심 #153](../../보안_및_버그_의심.md). ⚠ 항목 삭제 뒤 `ics11`·연결이 남고 사원도 항목을 고친다 → [의심 #154](../../보안_및_버그_의심.md).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICS-BZ-0021
needs: [ICS-BZ-0003, ICS-BZ-0012]
steps:
  - no: 1
    actor: { company: kalpa, user: "201", password: "1111" }
    api: GET /api/v1/ics/checklist-status
    query: { year: 2026, cycleType: M }
    expect: { rows: 5 }
  - no: 2
    actor: { company: kalpa, user: "201", password: "1111" }
    api: GET /api/v1/ics/checklist-status/details
    query: { stdDate: "2026-11-01", cycleType: M, unCheckYn: false, unConfirmYn: false, offset: 0, limit: 50 }
    expect: { total: 10 }
  - no: 3
    actor: { company: kalpa, user: "201", password: "1111" }
    api: [GET /api/v1/ics/checklists/next-id, PUT /api/v1/ics/checklists]
    body: { content: "[시험] 자체 점검항목", criterion: 내부통제기준 제15조, useYn: true, checklistMClassId: 202309159433561, seq: 99 }
    expect: { track: { ics10_checklist: +1 } }
  - no: 4
    actor: { company: kalpa, user: "201", password: "1111" }
    api: POST /api/v1/sch/relate-ics?infoId={3단계 항목}
    body: [{ icsClassTreeId: 24762, deadlineId: 31670 }]
    expect: { track: { sch05_relate_ics: +1 } }
  - no: 5
    actor: { company: kalpa, user: "201", password: "1111" }
    api: PUT /api/v1/ics/checklists/use-yn
    body: [{ checklistId: <항목>, useYn: false }]
  - no: 6
    actor: { company: kalpa, user: "201", password: "1111" }
    api: [DELETE /api/v1/sch/relate-ics, DELETE /api/v1/ics/checklists]
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ics15_Tab_ChecklistStatus`(#1231)·`Ics15_Tab_ChecklistStatusDetail`(#1235), 편집창 `Ics10_Edit_Checklist`(L233 [행 추가]·L308 `update`), 서버 `Ics10_Checklist.modelUpdate` L58-78(ics11 사용여부 동시 갱신)·`Sch05_RelateIcs.modelUpdate`.
- TOBE: `IcsChecklistStatusController`(`/checklist-status`·`/details`·`/details/excel`·`/details/rd-print`)·`IcsChecklistController`(`/checklists`·`/use-yn`·`/check-delete`)·`SchRelateIcsController`(`/sch/relate-ics`).
</details>
