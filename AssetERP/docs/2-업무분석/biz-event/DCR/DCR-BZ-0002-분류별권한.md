# DCR-BZ-0002 문서분류별 조직·사원 권한을 준다

> **한 줄 요약** — 고객사 관리자가 **어느 조직이 어느 문서분류를 조회·작성할 수 있는지**(조직별 문서분류 맵핑 #1074 / 문서분류별 조직 맵핑 #1073), 그리고 조직 권한과 별개로 **예외로 특정 사원에게 조회를 주는 것**(#1491)을 정한다. 직원의 문서작성 화면(작성 트리)·문서검색 화면(조회 트리)에 무엇이 보이는지가 여기서 결정된다. 문서분류(0001)가 먼저 있어야 한다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 고객사 관리자 |
| 언제 | 도입 때, 조직·업무가 바뀔 때 |
| 먼저 있어야 하는 것 | DCR-BZ-0001 문서분류(문서종류 T 포함), ORG 조직, EMP 사원 |
| 다음 이벤트 | DCR-BZ-0005 문서 작성 |
| 실제 실행 | kalpa, 2026-11-13, API. 시험 분류(`BZ권한분류` C·`BZ권한문서` T) → 운용본부에 조회·작성 부여(`dcr03_org_auth` +1) → 운용본부 소속 사원 402의 작성 트리(`/class-trees/write`)에 **두 분류가 보이고**, 경영지원본부 사원 401에는 안 보임 → 사원별 예외(`dcr04_emp_auth` +1, 김사원)를 줘도 401의 작성 트리에는 안 보임(조회 예외라서) → **조직 권한 복사**(운용→경영지원)로 `dcr03_org_auth` +625행, 401에 보임 → 조회 트리(`/research`)는 어느 경우도 안 보임 → 타사 분류 ID는 DATA_NOT_FOUND → 사원 402가 조직 권한 저장(⚠#204) → 시험 분류 삭제 뒤 권한 행이 남음(⚠#205). 사원 예외의 조회 효과·문서분류별 조직 맵핑(#1073 화면의 `by-class-tree` 저장)·#1073 문서세부분류 사용 회사 분기는 안 함. 화면 눈 확인 `대기(일괄)` |
| 메뉴 | #1074 관리자 > 02. 문서권한관리 > 조직별 문서분류 맵핑, #1073 문서분류별 조직 맵핑, #1491 조회권한 예외사원 등록. kalpa 메뉴 없음 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 관리자 | #1074 | 조직 선택 (`GET /dcr/org-auths/by-org?orgCodeId=`) | 그 조직의 분류별 조회·작성 여부(전체 분류 622행) |
| 2 | 〃 | #1074 | 분류 행의 조회·작성 체크 → [저장] (`PUT /dcr/org-auths/by-org`) | `dcr03_org_auth` upsert(체크 안 한 분류는 보낸 행만 갱신) |
| 3 | 〃 | #1073 | 분류 선택 → 조직별 체크 → [저장] (`PUT /dcr/org-auths/by-class-tree`) | 같은 테이블, 반대 방향 |
| 4 | 〃 | #1074 | [권한복사] 시작 조직 → 대상 조직들 (`POST /dcr/org-auths/copy`) | 대상 조직에 시작 조직의 권한을 모든 분류에 대해 씀 |
| 5 | 〃 | #1491 | 분류 선택 → 사원 추가 (`PUT /dcr/emp-auths`) / 삭제 (`DELETE`) | `dcr04_emp_auth` |
| 6 | 직원 | 문서작성·검색 화면 | 작성 트리 `GET /dcr/class-trees/write`, 조회 트리 `GET …/research` | 권한 있는 분류만 보임 |

## DB에 남는 것

| 테이블 | 무엇 | kalpa 실행 |
|:---|:---|:---|
| `dcr03_org_auth` | 조직·분류별 조회·작성 여부 | 부여 +1·+1, 복사로 +625(`false/false` 622행+`true/true` 3행) |
| `dcr04_emp_auth` | 예외 사원의 분류별 조회 | +1 (김사원) |

## 업무 규칙 · 주의

- 작성 트리는 **문서종류(T)**에 작성 권한이 있어야 그 조상 분류와 함께 보인다. 분류(C)만 만든 행에 권한을 줘도 작성 트리에 안 나온다. 문서종류는 #1001 편집이 아니라 문서종류 저장(`PUT /dcr/class-trees/doc-types`, 새 행 `classTreeId 0`)으로 T가 만들어진다.
- 조직 권한 복사는 시작 조직의 **모든 분류**에 대해 행을 만든다(권한 없는 분류도 `false/false` 행). 한 번 복사하면 대상 조직에 622+행이 생기고, **API로는 이 행들을 지울 방법이 없다**(`by-org`는 보낸 행만 upsert, 빈 목록은 아무것도 안 함).
- 타사 분류·조직 ID는 거절된다(`requireClassTree`·`requireOrg`, 보안 보강).
- 조회 트리(`research`)가 비는 이유는 이번에 확인하지 못했다(루트는 사원 권한을, 아래 단계는 조직 권한을 보는 로직 — 문서분류에 양식·리서치사용 설정이 더 필요한 것으로 추정). 다음 DCR 이벤트(작성·검색)에서 이어서 본다.
- **사원이 조직 권한을 저장한다** → [의심 #204](../../보안_및_버그_의심.md). **분류를 지워도 권한 행이 남는다** → [의심 #205](../../보안_및_버그_의심.md).
- 시험 뒤 kalpa에 남은 것: `dcr03_org_auth` 628행(경영지원본부 625·운용본부 3), `dcr04_emp_auth` 1행 — 정리 SQL은 아래 근거 뒤에 둔다(사용자 실행).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: DCR-BZ-0002
needs: [DCR-BZ-0001]
steps:
  - no: 1
    actor: { company: kalpa, user: admin, password: "1111" }
    api: PUT /api/v1/dcr/class-trees/doc-types
    body: [ { classTreeId: 0, parentTreeId: "{분류ID}", classTreeName: "BZ권한문서", classTreeCode: "BZA2", seq: "991", approvalTypeCode: "1", compYn: "false", mngmYn: "false", printFundYn: "false" } ]
  - no: 2
    api: PUT /api/v1/dcr/org-auths/by-org
    body: { orgCodeId: "{운용본부}", rows: [ { classTreeId: "{문서종류ID}", retrieveYn: "true", updateYn: "true" } ] }
    expect: { track: { dcr03_org_auth: +1 } }
  - no: 3
    actor: { company: kalpa, user: "402", password: "1111" }
    api: GET /api/v1/dcr/class-trees/write
    expect: { contains: "BZ권한문서" }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Dcr03_Tab_OrgAuth`(#1074)·`Dcr03_Tab_DcrAuth`(#1073)·`Dcr04_Tab_EmpAuth`(#1491), 서버 `Dcr03_OrgAuth`·`Dcr04_EmpAuth`, `Dcr01_ClassTree.deleteAll`(권한 행은 안 지움).
- TOBE: `DcrOrgAuthController`·`DcrOrgAuthService.updateByOrg/updateByClassTree/copy`, `DcrEmpAuthController`, `DcrClassTreeService.searchWriteTree`.
</details>

<details>
<summary>정리 SQL (사용자 실행 — 먼저 tools/db_dump_backup.sh)</summary>

`yunhee sql -f … --rollback`으로 628행·1행이 지워지는 것을 확인했다(모두 이 시험이 만든 행).

```sql
delete from dcr03_org_auth where dcr03_org_code_id in (202611109048610, 202611109048612);
delete from dcr04_emp_auth where dcr04_emp_auth_id = 202611139996912;
```
</details>
