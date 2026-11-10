# ORG-BZ-0005 잘못 만든 조직·이력을 지운다

> **한 줄 요약** — 실수로 만든 조직이나 잘못 저장한 이력은 #1028 이력 창에서 [삭제]한다. **고른 행이 첫 이력(개설)이면 조직째 지우고**(하위 조직·소속 사원이 있으면 막힘), **나중 이력이면 그 한 줄만** 지운다. 실제로 있었던 조직은 지우지 않고 폐쇄(ORG-BZ-0004)한다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 고객사 관리자 — `kalpa/admin/1111` |
| 언제 | 잘못 입력했을 때 |
| 먼저 있어야 하는 것 | ORG-BZ-0001. 조직째 지우려면 하위 조직·소속 사원이 없어야 한다 |
| 다음 이벤트 | — |
| 실제 실행 | kalpa, 2026-11-10 — 시험 팀 `10210`의 잘못된 이력 1줄 삭제, 그 다음 조직째 삭제. kalpa는 처음(조직 3개, `org01_code` 540 · `org02_info` 557행)으로 돌아감 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 고객사 관리자 | **#1028** 조직정보 등록 | 조직 두 번 누름 | "조직정보 History" 창 |
| 2 | 〃 | 〃 (이력 한 줄) | 왼쪽에서 **나중 이력**(변경일 > 개설일) 행 선택 → [삭제] | 경고 "오래된 정보를 임의로 삭제 시 문제를 발생시킬 수 있습니다. 삭제하시겠습니까?" → [예] → 그 행만 없어진다 |
| 3 | 〃 | 〃 (조직째) | **첫 이력**(변경일 = 개설일) 행 선택 → [삭제] | "삭제전 체크중입니다" → 검사 통과면 "해당부서를 삭제하시겠습니까?" → [예] → "해당부서는 정상적으로 삭제되었습니다", 창이 닫히고 트리에서 빠진다 |
| 3-1 | 〃 | 〃 | 하위 조직이 있는 조직(예: `운용본부`) | "하위부서를 먼저 삭제 후 삭제가능합니다" |
| 3-2 | 〃 | 〃 | 하위 조직은 없고 사원이 발령된 조직(예: `경영지원본부`) | "해당부서에 사원이 존재합니다" |

## DB에 남는 것

| 단계 | 테이블 | 변화 |
|:---|:---|:---|
| 2 이력 한 줄 | `org02_info` | -1 (고른 행) |
| 3 조직째 | `org02_info` | 그 조직의 이력 전부 삭제(실행: -3) |
| 〃 | `org01_code` | -1 |

## 결과를 볼 수 있는 화면

- #1028 트리, "조직정보 History" 이력 목록.

## 업무 규칙 · 주의

- 첫 이력인지는 화면이 정한다: **개설일 ≥ 그 행의 변경일**이면 조직째 삭제 길(원본 `Org02_Lookup_OrgInfo.deleteCheck` L154).
- **하위 조직 검사는 이력 전체를 본다**(`org02_info.deleteOrgCheck`: 이 조직을 상위로 가진 이력이 하나라도 있으면). 그래서 하위 팀을 다른 본부로 **옮긴 뒤에도** 옛 이력이 남아 있으면 옛 본부를 지울 수 없다(실행: 시험 팀을 경영지원본부로 옮긴 뒤에도 운용본부 검사 -1). 원본 SQL과 같다.
- 사원 검사(`emp03_trans.deleteOrgCheck`)는 이 조직으로 발령된 기록이 있는지 본다.
- 이력 한 줄 삭제(단계 2)는 검사가 없다 — 경고만 띄운다.
- ⚠ **TOBE 부족 — 원본의 세 번째 검사 "사용중인 조직은 삭제할 수 없습니다"가 없다.** 원본은 2026-09-28(git `6d787c277` "조직정보 삭제시 사용여부 체크")에 `org01_code.checkUseOrgId`(`SELECT f_check_use_org_id(#{orgId})`)를 더해, 0이 아니면 -3과 서버 문구를 띄운다. TOBE `OrgInfoHistoryService.deleteCheck`는 -1·-2만 본다(변환 때 빠짐). 그런데 **`f_check_use_org_id` 함수가 로컬 asseterpdb에 없다**(`f_check_use_ast_id`·`corp_id`·`person_id`만 있음) — 원본도 이 DB에서는 삭제 검사가 DB 오류로 멈춘다. 함수 정의(무엇을 "사용중"으로 보는지)를 받아야 옮길 수 있다 → 사용자 결정 대기(함수 DDL 확보 / 그 전까지 지금처럼 두기).
- 원본 서버 `org.Org01_Code.delete`(TOBE `DELETE /api/v1/org/org-codes/{codeId}`)는 이 화면에서 부르는 곳이 없다(`Org01_Edit_OrgCode` 수정 모드·`Org02_Edit_Info.deleteCheck` 도달 불가).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ORG-BZ-0005
needs: [ORG-BZ-0001]
actor: { company: kalpa, user: admin, password: "1111" }
steps:
  - no: 2
    api: DELETE /api/v1/org/org-codes/{codeId}/infos
    body: ["<나중 이력 infoId>"]
    expect: { table: org02_info, delta: -1 }
  - no: 3-1
    api: GET /api/v1/org/org-codes/{운용본부 codeId}/delete-check
    expect: { data: -1 }
  - no: 3-2
    api: GET /api/v1/org/org-codes/{경영지원본부 codeId}/delete-check
    expect: { data: -2 }
  - no: 3
    api: GET /api/v1/org/org-codes/{codeId}/delete-check   # → 1
    then: DELETE /api/v1/org/org-codes/{codeId}/all
    expect: [{ table: org01_code, delta: -1 }, { table: org02_info, delta: "-(이력 수)" }]
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Org02_Lookup_OrgInfo` [삭제] E1 `deleteCheck` L151-194 → (첫 이력) `org.Org02_Info.deleteCheck` → `deleteMsg` L196-228 → `org.Org02_Info.deleteOrg` / (나중 이력) 경고 → `deleteRow` L244-252 → `org.Org02_Info.delete`
- AS-IS 서버: `Org02_Info.deleteCheck` L31-50(-1 하위 · -2 사원 · -3 사용중), `deleteOrg` L52-58(org02_info → org01_code)
- TOBE: `GET …/{codeId}/delete-check`, `DELETE …/{codeId}/all`, `DELETE …/{codeId}/infos`(`OrgInfoHistoryService`)
- TOBE 상태(2026-11-10): **실행** — 이력 1줄 삭제, 검사 -1·-2·1, 조직째 삭제. -3 검사는 없음(위 ⚠). 화면 눈 확인은 `대기`.
</details>
