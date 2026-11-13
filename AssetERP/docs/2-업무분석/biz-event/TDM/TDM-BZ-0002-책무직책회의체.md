# TDM-BZ-0002 책무·관리의무·직책·회의체를 등록한다

> **한 줄 요약** — 책무구조도의 재료를 회사가 직접 만든다. **책무유형**(분류 1자리 + 순번 2자리, 예 `B01`)을 정하고, #1412에서 **책무**(분류 A 지정책임자·B 금융영업·C 경영관리)를 등록하며, 책무마다 **세부 책무**(`tdm12`)와 그 아래 **관리의무**(`tdm13`, #1413)를 단다. #1415에서 **회의체**(개최 주기·주요 심의 사항)를 등록하고, #1414에서 **직책**(대표이사·본부장…)을 만들어 직책별 **책무·회의체·담당 부서**를 붙인다. 직책에는 **보고 CEO(대표이사 직책)**가 필수인데, **회사의 첫 직책은 이 조건 때문에 화면·API로 만들 수 없다** → 의심 #130.

| 항목 | 내용 |
|:---|:---|
| 누가 | 책무 담당(kalpa 과장 301) |
| 언제 | 도입 때, 직제·법령이 바뀔 때 |
| 먼저 있어야 하는 것 | TDM-BZ-0001, 조직(ORG) |
| 다음 이벤트 | TDM-BZ-0003(담당자·승인선), 0004(임원별 직책배정) |
| 실제 실행 | kalpa, 2026-11-13. 책무유형 3개(`B01 집합투자`·`C01 자금관리`·`A01 준법감시`, 3자리가 아니면 "책무유형코드는 3자리로 입력하세요") → 책무 3개(`집합투자기구 운용 및 투자판단`(금융영업), `자금 집행 및 유동성 관리`(경영관리), `내부통제 및 준법감시 총괄`(지정책임자), 사용시작 2026-07-01) → 첫 책무에 세부 2개·관리의무 2개 → 회의체 `내부통제위원회`(분기) → 직책: 처음에는 `대표이사` 저장이 "보고CEO는 필수선택 항목입니다"로 막힘 → **시험용 SQL로 대표이사 직책 1줄을 직접 넣음**(자기 자신을 보고CEO로) → `경영지원본부장`·`운용본부장`(기타그룹) 저장 → 직책별 책무 지정(경영지원 2·운용 1), 대표이사 직책의 회의체 위원장 지정, 직책별 담당 부서(경영지원본부·운용본부) |
| 메뉴 | #1412 책무 등록, #1413 관리의무 등록, #1415 회의체 등록, #1414 직책별 책무 등록. kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|
| 1 | #1412 | 책무유형 관리 → [등록] 책무 → 분류·유형·책무명·시작일·사유 → [저장] | 책무 줄(변경 시 변경 이력 + 사유) |
| 2 | 〃 / #1413 | 책무 선택 → 세부 책무 → 관리의무 [저장] | 책무 > 세부 > 관리의무 |
| 3 | #1415 | [등록] → 회의체명·개최주기·주요 심의사항 | 회의체 줄 |
| 4 | #1414 | [등록] → 직책명·직책그룹·개요·시작일·**보고CEO** → [저장] | 직책 줄 |
| 5 | 〃 | 직책 선택 → 책무 지정·회의체 지정·부서 지정 | 직책별 책무·회의체·부서 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `tdm14_task_type` · `tdm10_task` | 책무유형 · 책무 | +3 · +3 |
| `tdm12_task_relate_detail` · `tdm13_task_relate_duty` | 세부 책무 · 관리의무 | +2 · +2 |
| `tdm05_cncl` · `tdm22_role_relate_cncl` | 회의체 · 직책-회의체 | +1 · +1 |
| `tdm20_role` · `tdm21_role_relate_task` · `tdm23_role_relate_org` | 직책 · 직책-책무 · 직책-부서 | +3(대표이사 1줄은 SQL) · +3 · +2 |

## 업무 규칙 · 주의

- **보고CEO 순환**: 직책 저장은 보고CEO(이 회사의 대표이사 직책) 선택이 필수이고, 서버(와 원본 화면)가 "그 직책이 이 회사에 이미 있어야" 한다고 본다. 새 회사의 첫 직책은 불가능하다. 다른 회사는 `ld_tdm_template`(KFS 운영 작업 — 기존 책무 데이터를 지우고 템플릿을 넣는 DB 함수)로 시작한 것으로 보인다 → [의심 #130](../../보안_및_버그_의심.md).
- 수정·삭제는 **변경사유**와 함께 이력이 남는다(`tdm95`). 보고CEO로 쓰인 직책의 직책그룹은 바꿀 수 없다.
- 책무유형 목록·책무 조회 API가 `yunhee biz-endpoints`에서 `⚠없음`으로 나오지만 서비스가 회사를 검사한다(다른 회사 책무 ID → 404/403) — 도구가 컨트롤러 인자의 `@AuthenticationPrincipal`만 보고 판정한다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: TDM-BZ-0002
needs: [TDM-BZ-0001]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: [PUT /api/v1/tdm/task-types, POST /api/v1/tdm/tasks, PUT /api/v1/tdm/task-details, PUT /api/v1/tdm/task-duties, PUT /api/v1/tdm/councils]
    body: [[{ taskTypeCode: B01, taskTypeName: 집합투자, useYn: "true" }, …], { taskClassCode: B, taskTypeCode: B01, taskName: …, startDate: "2026-07-01", reason: 신규 등록 }, …]
    expect: { track: { tdm14_task_type: +3, tdm10_task: +3, tdm12_task_relate_detail: +2, tdm13_task_relate_duty: +2, tdm05_cncl: +1 } }
  - no: 2
    precondition: 대표이사 직책 1줄(보고CEO=자기 자신)을 DB에 직접 넣어야 함 — 화면으로는 불가(의심 #130)
    api: [PUT /api/v1/tdm/roles, PUT /api/v1/tdm/roles/{id}/tasks, PUT /api/v1/tdm/roles/{id}/councils, PUT /api/v1/tdm/roles/{id}/orgs]
    body: [{ roleName: 경영지원본부장, roleType: E, roleTypeEtcName: 경영지원, overview: …, startDate: "2026-07-01", ceoRoleId: <대표이사> }, …]
    expect: { track: { tdm20_role: +2, tdm21_role_relate_task: +3, tdm22_role_relate_cncl: +1, tdm23_role_relate_org: +2 } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Tdm10_Tab_Task`(#1412 `Tdm10_Task.modelUpdate`·`Tdm14_TaskType`), `Tdm13_Tab_TaskDuty`(#1413), `Tdm05_Tab_Cncl`(#1415), `Tdm20_Tab_Role`·`Tdm20_Edit_Role`(#1414 `updateChk` L278-328 — 보고CEO 필수, `preUpdate` L330 — 수정 시 변경사유), `ld_tdm_template`(DB).
- TOBE: `TdmTaskController`·`TdmTaskTypeController`·`TdmTaskDetailController`·`TdmTaskDutyController`, `TdmRoleController`·`TdmRoleService.save` L66-130(`checkCeoRole` → `checkCompany`), `TdmCouncilController`.
</details>
