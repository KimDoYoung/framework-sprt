# ICS-BZ-0012 KFS가 공통 체크리스트(분류·항목)를 관리한다

> **한 줄 요약** — 회사가 월·분기마다 답하는 내부통제 체크리스트의 **공통 항목**(회사 0)은 KFS 관리자가 #1232 내부통제 체크리스트(관리자)에서 **대분류 → 중분류 → 항목**(체크대상·근거·사용·순서)으로 만든다. 회사는 #1228에서 공통 항목 중 쓸 것을 고르고 담당그룹을 정한다(ICS-BZ-0003). 회사가 자기 항목을 더 만들 수도 있다(회사 ID가 붙음).

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 관리자(공통 분류·항목), 회사(자기 항목·사용 설정) |
| 언제 | 법규·점검 기준이 바뀔 때 |
| 먼저 있어야 하는 것 | — |
| 다음 이벤트 | 회사가 항목을 선택·담당그룹 지정(ICS-BZ-0003) |
| 실제 실행 | KFS·kalpa, 2026-11-13. KFS가 대분류 `[업무분석 시험] 대분류`·중분류·항목 1건 등록(`ics21`·`ics23`·`ics10` +1씩) → 새 항목 ID 발급(`next-id`) → kalpa 301의 회사용 목록(`checklists/company`)·대분류 코드(`l-codes`)에 나타남 → 삭제 전 `check-delete`(작성된 건수 0) → 항목·중분류·대분류 삭제. **시험 자료는 지움**(단 회사 설정 행 1건은 고아로 남음 ⚠) |
| 메뉴 | #1232 기초자료 > 00. 내부통제 > 내부통제 체크리스트(관리자), 회사 쪽 #1228. kalpa 메뉴 없음(API). 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS 관리자 | #1232 → [분류관리] | 대분류 [등록] → 이름·순서·비고·사용 → [저장] | 대분류 콤보에 나옴 |
| 2 | 〃 | 분류관리 창 | 중분류 탭 [등록] → [저장] | 중분류 콤보 |
| 3 | 〃 | #1232 | [등록] → 대·중분류·체크대상·근거·사용 → [저장] | 항목 줄 |
| 4 | 회사 | #1228 | [조회] | 공통 항목(새 항목 포함) |
| 5 | KFS 관리자 | #1232·분류관리 | 선택 → [삭제](작성된 건 있으면 사용 확인) | 삭제 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ics21_checklist_l_class` | 대분류(회사 0) | +1 → 지움 |
| `ics23_checklist_m_class` | 중분류 | +1 → 지움 |
| `ics10_checklist` | 항목(회사 0 또는 회사 것) | +1(KFS)·+1(401) → 지움 |
| `ics22_checklist_l_class_company` | 회사별 대분류 사용·비고 설정 | 301 저장 때 +1(고아로 남음 ⚠) |

## 업무 규칙 · 주의

- 공통 항목의 `companyId`는 0이고 회사 항목은 그 회사 ID다. 회사 항목은 회사 사용자가 만든다 — **메뉴 권한뿐이라 일반 사원(401)도 만들고 지운다**.
- 회사가 공통 항목을 고치려 하면 서버가 회사 것이 아니라서 갱신 0행 → 같은 ID로 넣으려다 **500 오류**가 난다. 공통 대분류를 사원이 저장하면 회사별 설정 행이 써진다. KFS가 대분류를 지워도 회사별 설정 행이 남는다 → [의심 #143](../../보안_및_버그_의심.md).
- 삭제 전 확인 `check-delete`는 작성된 체크리스트 건수(0)를 돌려준다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICS-BZ-0012
needs: []
steps:
  - no: 1
    actor: { company: admin, user: admin, password: "1111" }
    api: PUT /api/v1/ics/checklist-classes/l
    body: [{ checklistLClassName: "[업무분석 시험] 대분류", note: "99", seq: 99, useYn: "true" }]
    expect: { track: { ics21_checklist_l_class: +1 } }
  - no: 2
    actor: { company: admin, user: admin, password: "1111" }
    api: PUT /api/v1/ics/checklist-classes/m
    body: [{ checklistLClassId: <1단계>, checklistMClassName: "[업무분석 시험] 중분류", note: "99", seq: 1, useYn: "true" }]
    expect: { track: { ics23_checklist_m_class: +1 } }
  - no: 3
    actor: { company: admin, user: admin, password: "1111" }
    api: PUT /api/v1/ics/checklists
    body: { checklistId: null, content: "[시험] 신규 점검 항목입니까?", criterion: 시험법 제1조, useYn: "true", checklistMClassId: <2단계>, seq: 1 }
    expect: { track: { ics10_checklist: +1 } }
  - no: 4
    actor: { company: kalpa, user: "301", password: "1111" }
    api: GET /api/v1/ics/checklists/company
    expect: { contains: "[시험] 신규 점검 항목입니까?" }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ics10_Tab_ChecklistAdmin`(#1232)·`Ics10_Edit_Checklist`·`Ics21_Lookup_CheckList`·`Ics23_TabPage_CheckList` — 서버 `Ics10_Checklist.selectByAdmin·modelUpdate·delete`, `Ics21_ChecklistLClass`·`Ics23_ChecklistMClass`.
- TOBE: `IcsChecklistController`(`/checklists`)·`IcsChecklistClassController`(`/checklist-classes/l·m`).
</details>
