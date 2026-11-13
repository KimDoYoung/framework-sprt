# TDM-BZ-0004 임원에게 직책을 배정하고 책무 동의서를 결재받는다

> **한 줄 요약** — #1417 임원별 직책배정에서 임원(`tdm01_hr`)에게 **직책**을 붙이면 배정(`tdm30`)이 생기고, 배정마다 **책무배분일**(`tdm34`) 이력이 쌓인다. 배분일 이력의 **확정 책무**(`tdm35` — 그날 그 직책이 맡는 책무의 스냅샷)를 [책무 불러오기](`tasks/rebuild`)로 채운 뒤 **임원 책무 동의서(결재 A90)**를 상신·승인받아야 그 배분이 "유효(결재 완료)"가 된다. 책무기술서·체계도·매뉴얼 작업은 **결재 완료된 배정**만 본다(`getTdm30RoleAllc(…, true)`).

| 항목 | 내용 |
|:---|:---|
| 누가 | 책무 담당(301), 결재자 박부장(201, 준법감시인) |
| 언제 | 임원 선임·직책 변경·직제 변경 때 |
| 먼저 있어야 하는 것 | TDM-BZ-0001(임원), 0002(직책·직책별 책무), 회사 관리자의 문서분류지정(A90 → 책무 임원동의서, #1280) |
| 다음 이벤트 | TDM-BZ-0005(기술서·체계도), 0006(매뉴얼) |
| 실제 실행 | kalpa, 2026-11-13. 배정 3건: 김사장→대표이사, 박부장→경영지원본부장, 정부장→운용본부장(배분일 2026-07-01, 사유 `D03 임원선임 및 변경`; 첫 건은 사유 `10`을 줬는데 코드 검사 없이 저장됨). A90 분류를 회사 관리자가 지정한 뒤 결재 3건 상신·승인(상신 301 → 승인 201). ⚠ **확정 책무(`tdm35`)를 채우기 전에 결재를 마쳐 버려서** 이후 `tasks/rebuild`가 "상신 전(99·40)만 다시 만든다"로 동작하지 않아 정부장 배정의 책무가 0건이었다 → 정부장에게 **새 책무배분일(2026-08-01, 사유 `D04`)**을 추가해 [불러오기]한 뒤(책무 1건 채워짐) 다시 결재 → 이 배분일부터 운용본부 매뉴얼 작업이 가능 |
| 메뉴 | #1417 책무 > 02. 책무구조도 > 임원별 직책배정(배분일 상세는 같은 화면의 하위 탭). kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 책무 담당 | #1417 | [등록] → 임원·직책·시작일·책무배분일·사유 → [저장] | 배정 줄 + 배분일 1건 |
| 2 | 〃 | 하위 탭 | 배분일 선택 → [책무 불러오기] | 그날의 확정 책무(`tdm35`) 목록 |
| 3 | 〃 | 하위 탭 | [상신] → 문서분류(책무 임원동의서) | 결재 문서(A90) |
| 4 | 결재자 | 결재함 | [승인] | 배분일 결재 완료 → 이후 단계에 쓸 수 있음 |
| 5 | 〃 | 하위 탭 | (직제 변경 때) 새 배분일 추가 → 2~4 반복 | 배분일 이력 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `tdm30_role_allc` · `tdm34_role_allc_detail` | 임원-직책 배정 · 책무배분일 | +3 · +4 |
| `tdm35_role_allc_task` | 확정 책무 | +1 (정부장 2026-08-01) |
| `apr01_appr` 외 · `dcr30_link` | 임원 동의서 결재 문서 4건 · A90 분류 | +4 · 1줄 갱신 |

## 업무 규칙 · 주의

- 배분일 상세의 `tasks/rebuild`는 **결재 전(임시 99·반려 40)인 것만** 확정 책무를 다시 만든다. 이 순서를 어기고 결재부터 마치면 책무가 비어 있는 채로 "유효한 배정"이 되고, 그 배정으로는 책무기술서·매뉴얼 책무가 하나도 안 만들어진다. 서버는 상신·승인 때 확정 책무가 비어 있는지 보지 않는다 → [의심 #132](../../보안_및_버그_의심.md).
- 사유 코드(`TdmDescRegReason`: D01~D04)를 검사하지 않는다(`10` 저장됨) → [의심 #131](../../보안_및_버그_의심.md).
- 직책배정 쓰기·결재 연결(`/tdm/role-allc-details/{id}/appr-id`) API는 '회사' 검사뿐이다 → [의심 #133](../../보안_및_버그_의심.md). 메뉴 권한 없는 사원 401이 **빈 본문으로 직책배정을 만들었다**(모든 칸이 빈 행이 생김 — 시험 뒤 삭제).
- 상신은 `yunhee biz-appr`가 A90 양식 시드가 없어 중단되어(`seed_data` None) 같은 순서의 API(`GET /apr/apprs/new` → `PUT /apr/apprs/{id}` → 연결 → 승인)를 직접 호출했다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: TDM-BZ-0004
needs: [TDM-BZ-0002, SYS-BZ-0022]
steps:
  - no: 0
    actor: { company: kalpa, user: admin, password: "1111" }
    api: PUT /api/v1/dcr/links
    body: [{ linkId: <A90>, classTreeId: <책무 임원동의서> }, { A91 → 임원별 책무기술서 }, { A92 → 책무체계도 }, { A93 → 책무매뉴얼 }]
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: [POST /api/v1/tdm/role-allcs, POST /api/v1/tdm/role-allcs/details/{detailId}/tasks/rebuild]
    body: { roleId: <대표이사>, personId: <김사장>, addTitleYn: false, startDate: "2026-07-01", roleAllcDate: "2026-07-01", regReason: D03 }
    expect: { track: { tdm30_role_allc: +1, tdm34_role_allc_detail: +1, tdm35_role_allc_task: +n } }
  - no: 2
    api: [GET /api/v1/apr/apprs/new, PUT /api/v1/apr/apprs/{id}, PUT /api/v1/tdm/role-allc-details/{id}/appr-id, POST /api/v1/apr/apprs/{id}/confirm]
    actor: { submit: "301", approve: "201" }
    expect: { appr_status: 30, getTdm30RoleAllc(appr_yn=true): 포함 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Tdm30_Tab_RoleAllc`(#1417 `Tdm30_RoleAllc`·`gettdm30roleallc` — `p_appr_yn`이면 `apr01_status_cd = '30'`만), `Tdm34_TabPage_RoleAllcDetail`(링크 A90, `Tdm35_RoleAllcTask.deleteInsert`), `Tdm36_*`.
- TOBE: `TdmRoleAllcController`(`/api/v1/tdm/role-allcs`·`/details`·`/tasks/rebuild`)·`TdmRoleAllcService.rebuildTasks` L123-, `TdmApprLinkController`(`/role-allc-details/{id}/appr-id`), `Tdm30_Tab_RoleAllc.tsx`·`Tdm34_TabPage_RoleAllcDetail.tsx`(`LINK_CODE = 'A90'`).
</details>
