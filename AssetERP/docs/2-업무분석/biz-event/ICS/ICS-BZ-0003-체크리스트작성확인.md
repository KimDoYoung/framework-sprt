# ICS-BZ-0003 담당자가 내부통제 체크리스트를 작성·제출하고 확인자가 확인한다

> **한 줄 요약** — 회사는 공통 체크리스트(회사 0 마스터, 대분류 자산운용업무·경영관리업무 …)에서 쓸 항목을 고르고, #1228 체크리스트 관리에서 항목마다 **담당그룹**(작성할 사람들 + **확인자**)을 정한다. 담당그룹의 사원은 매 주기(월/분기, 회사 설정 `icsCheckCycleType`)에 #1229에서 항목마다 **예·아니오·해당없음**을 답하고 [제출]하면, 확인자(담당그룹 확인자 → 없으면 조직장 → 없으면 **준법감시인**)가 #1230에서 [확인]한다. 준법감시인은 #1231·#1235에서 월별 현황(답변/확인 건수)을 본다. 확인자·현황 목록은 회사에 **준법감시인(특정직 코드 120)**이 있어야 나온다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 담당자 301·401(경영지원)·302·402(운용), 확인자 박부장 201(= 준법감시인 지정), 현황 준법감시인 |
| 언제 | 매월(회사 설정) |
| 먼저 있어야 하는 것 | **회사 ICS 설정**(`sys01`: 체크리스트 주기·확인자 구분 등, KFS #1075), **준법감시인 지정**(EMP 발령의 특정직 120, EMP-BZ-0007), 담당그룹(`sch22`)·소속, 법규(ICS-BZ-0002)는 선택 |
| 다음 이벤트 | 준수점검(ICS-BZ-0004), 보고 상신 |
| 실제 실행 | kalpa, 2026-11-13. ⚠ 처음에는 설정이 비어 있어 **KFS 관리자가 `icsCheckCycleType=M`·`icsComplyCycleType=M`·확인자 구분 `1`(조직장)·준수상신자 `1`**을 넣었다(`biz-patch`). ① 담당그룹 `경영지원 작성그룹`(확인자 박부장, 직원 301·401)·`운용 작성그룹`(확인자 정부장, 직원 302·402) 등록(`PUT /sch/write-groups` + `/shares`) ② 체크리스트 5건에 담당그룹 지정(경영관리 2 → 경영지원, 자산운용 3 → 운용) — 회사 체크리스트 줄 `ics11` +5 ③ 301이 2026.11 답변(첫 항목 N, 둘째 X) → [제출] 2건 ④ 확인자 목록이 **0건** — 회사에 준법감시인이 없어서(상세 아래) → 박부장 발령에 특정직 `120 준법감시인` 부여(`PUT /emp/trans/grades`) → 확인자 201 목록 4건(301·401 × 2) → 301의 2건 [확인](확인자 201 기록) ⑤ 현황 `GET /ics/checklist-status?year=2026&cycleType=M` 월별 표(운용 그룹 3건은 과거 달 `X / X`). 확인 취소·재확인 되돌림 포함 |
| 메뉴 | #1228 체크리스트 관리, #1229 체크리스트 작성, #1230 내부통제내역 확인(부서장), #1231 내부통제내역 현황(준감인), #1235 상세(준감인). kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 준법감시 담당 | #1228 | [기본설정] → [담당그룹관리] → 그룹명·확인자·직원 | 담당그룹 |
| 2 | 〃 | #1228 | 항목 선택 → [담당그룹 지정] | 회사 체크리스트 줄(항목 ↔ 담당그룹 ↔ 사용여부) |
| 3 | 담당자 | #1229 | 기준일(월) → [조회] → 항목마다 예/아니오/해당없음 → (사유) → [제출] | 답변·제출 표시 |
| 4 | 확인자 | #1230 | 기준일 → [조회] → 줄 선택 → [확인] (또는 확인취소) | 확인자·확인 표시 |
| 5 | 준법감시인 | #1231·#1235 | 연도·주기 → [조회] | 항목별 월 현황(미작성·미확인 건수), 상세 목록 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `sch22_write_group` · `sch02_share` | 담당그룹(확인자) · 직원 공유 | +2 · +4 |
| `ics11_checklist_company` | 회사별 체크리스트 설정(담당그룹·사용여부) | +5 |
| `ics15_checklist_write` | 주기별 작성(답변·제출·확인) | +2 (+ 아래 형식 오류 시험 2줄 `202611`) |
| `sys01_company` | 회사 ICS 설정 | 주기 M·확인자 구분 1·준수 상신자 1 |
| `emp03_trans` | 박부장 특정직 120 | 갱신 |

## 업무 규칙 · 주의

- **작성 월 형식은 `YYYY.MM`**(예 `2026.11`)이다. 서버는 형식을 검사하지 않아 `202611`을 보내면 그대로 저장되고 목록에는 나오지 않는다(시험 중 2줄이 이렇게 남음) → [의심 #128](../../보안_및_버그_의심.md).
- 확인자 결정: 담당그룹 확인자 → 없으면 회사 설정(구분 `2` = 준법감시인, 그 밖 = 소속 조직장, 없으면 준법감시인). 그런데 SQL이 **준법감시인 한 사람을 항상 붙이는 구조**(`LIMIT 1` 교차조인)라서 회사에 준법감시인(`특정직 120`)이 없으면 **담당그룹 확인자가 지정돼 있어도 확인·현황 목록이 통째로 빈다**. 안내가 없다 → [의심 #127](../../보안_및_버그_의심.md)(원본 SQL도 같은 구조).
- 확인(`PUT /ics/checklist-confirms/confirm`)은 호출자가 그 줄의 확인자인지 보지 않는다 — **권한 없는 사원 401이 301의 확인을 취소**했다(되돌림) → [의심 #124](../../보안_및_버그_의심.md).
- 법규 마스터(회사 0)의 체크리스트 분류에 시험용 `영임TEST대분류`(4건)가 남아 있어 새 회사의 체크리스트 목록에도 나온다 → [의심 #129](../../보안_및_버그_의심.md).
- `trace-crud`가 "원본은 쓰지만 TOBE에 U 없음"으로 본 `sch05_relate_ics`(체크리스트·일정 연결)는 이번 시험 흐름(담당그룹 지정·작성·확인)에서 확인하지 못했다(미확인 — 체크리스트 [등록]의 `POST /sch/relate-ics`와 함께 다시 볼 것).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICS-BZ-0003
needs: [ICS-BZ-0001, EMP-BZ-0007]
steps:
  - no: 0
    actor: { company: admin, user: admin, password: "1111" }
    api: PUT /api/v1/sys/companies/{kalpa}/approval
    body: { icsCheckCycleType: M, icsComplyCycleType: M, icsNonStayYn: false, icsCheckConfirmerType: "1", complyApprRegEmpType: "1", … }
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: [PUT /api/v1/sch/write-groups, PUT /api/v1/sch/write-groups/{id}/shares, PUT /api/v1/ics/checklists/write-group]
    body: [[{ writeGroupName: 경영지원 작성그룹, confirmerId: <박부장> }], [{ shareCode: "1", personId: <301>, startDate: "2026-01-01" }, …], { writeGroupId: <그룹>, checklists: [{ checklistId, useYn: "true" }, …] }]
    expect: { track: { sch22_write_group: +2, ics11_checklist_company: +5 } }
  - no: 2
    api: [PUT /api/v1/ics/checklist-writes/answers, PUT /api/v1/ics/checklist-writes/fix]
    body: [{ checklistId, answerCode: "N", yyyymm: "2026.11", cycleType: M }, { fixYn: true, writeIds: [...] }]
    expect: { track: { ics15_checklist_write: +2 } }
  - no: 3
    actor: { company: kalpa, user: "201", password: "1111" }
    api: [GET /api/v1/ics/checklist-confirms?stdDate=2026-11-13&cycleType=M, PUT /api/v1/ics/checklist-confirms/confirm]
    precondition: 박부장 특정직 120(PUT /api/v1/emp/trans/grades) — 없으면 목록 0건
    body: { confirmYn: true, yyyymm: "2026.11", cycleType: M, rows: [{ checklistId, personId: <301> }] }
    expect: { list: 4, confirmed: 2 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ics10_Tab_Checklist`(#1228)·`Ics10_Tab_ChecklistAdmin`(KFS), `Ics15_Tab_ChecklistWrite`(#1229 `Ics15_ChecklistWrite.updateAnswerCode`·`updateFixYn`)·`Ics15_Tab_ChecklistConfirm`(#1230 `updateConfirmYn`, `ics11_checklist_company.xml chkList` L38 — 확인자·준법감시인 `emp00_grade_cd = '120'`)·`Ics15_Tab_ChecklistStatus`/`StatusDetail`(#1231·#1235).
- TOBE: `IcsChecklistController`·`IcsChecklistService`, `IcsChecklistWriteController`/`Service`(`selectByPersonId` — 월 형식 `TO_CHAR(stdDate,'YYYY.MM')`), `IcsChecklistConfirmController`/`Service`·`IcsChecklistConfirmMapper.xml` L37-102(chkList), `IcsChecklistStatusController`, `SchWriteGroupController`.
</details>
