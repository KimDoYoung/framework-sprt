# ORG-BZ-0001 본부·팀을 만든다 (조직 입력)

> **한 줄 요약** — 칼파테크는 지금 `(주)칼파테크` 한 줄뿐이다. 고객사 관리자가 그 아래에 **경영지원본부**와 **운용본부**를 만든다. 직원은 이 조직 중 한 곳에 소속된다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 고객사 관리자 — 로그인 `kalpa/admin/1111` (http://kalpa.localhost:8082/AssetERP) |
| 언제 | 도입 때, 조직이 바뀔 때 |
| 먼저 있어야 하는 것 | SYS-BZ-0001(루트 조직 자동 생성), SYS-BZ-0003(메뉴) |
| 다음 이벤트 | EMP-BZ-0001 직원 등록 ([목록](../README.md)) |
| 실제 실행 | kalpa, 2026-11-09 (경영지원본부 10100, 운용본부 10200) |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 고객사 관리자 | **#1028** 경영관리 > 01. 조직 및 사원관리 > 조직정보 등록 | 화면이 열리면 기준일 오늘로 조직 트리가 조회된다 | `(주)칼파테크`(회사) 한 줄 |
| 2 | 〃 | #1028 | `(주)칼파테크` 행 선택 → [하위조직등록] | "조직 등록" 창 |
| 3 | 〃 | 〃 | 조직코드 `10100`, 조직명 `경영지원본부`, 조직레벨 `본부(실)`, 개설일 `2020-03-02`, 개설사유 `신설`, 조회순서 `1` → [저장] | 창이 닫히고 트리에 `경영지원본부`가 생긴다 |
| 4 | 〃 | 〃 | 단계 2~3 반복: 조직코드 `10200`, 조직명 `운용본부`, 조회순서 `2` | 트리: 칼파테크 → 경영지원본부, 운용본부 |

가상 회사 기준 조직(kalpa·kova·igo 같은 모양): 회사 1 + 본부 2. 팀은 만들지 않는다(직원 7명은 본부에 바로 소속).

## DB에 남는 것

| 테이블 | 무엇 | 추가 | 행 |
|:---|:---|:---|---:|
| `org02_info` | 조직 이력(조직명·변경일·사유) | 단계 3·4마다 1 | 2 (루트 포함 3) |
| `org01_code` | 조직 코드(상위 조직·레벨·조직코드·개설일) | 단계 3·4마다 1 | 2 (루트 포함 3) |

- 조직은 **이력(`org02_info`) + 코드(`org01_code`)** 두 줄이 한 쌍이다. 이름이나 소속이 바뀌면 이력 행이 하나 더 생긴다.

## 결과를 볼 수 있는 화면

- #1028 트리, 직원 등록 창의 조직 선택, #1030 조직별 사원조회(직원 등록 뒤).

## 업무 규칙 · 주의

- 필수: 개설일·개설사유·조직코드·조직레벨·조직명. 빠지면 "○○은 필수입력 항목입니다".
- 상위 조직이 이 회사에 없으면 데이터 없음 오류.
- **조직 안에 직원이 있으면 지울 수 없다**(`deleteCheck`: 소속 발령·하위 조직 검사).
- 조직코드는 사람이 정한다(가상 회사: 루트 10000, 본부 10100·10200).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ORG-BZ-0001
needs: [SYS-BZ-0001, SYS-BZ-0003]
actor: { company: kalpa, user: admin, password: "1111" }
steps:
  - no: 3
    screen: 1028
    action: '루트 선택 → [하위조직등록] → 값 입력 → [저장]'
    api: POST /api/v1/org/org-codes
    body: { orgCd: "10100", openDate: "2020-03-02", openReason: "신설", korNm: "경영지원본부",
            parentCodeId: "<루트 codeId>", levelCd: "0020", sortOrder: "1" }
  - no: 4
    api: POST /api/v1/org/org-codes
    body: { orgCd: "10200", korNm: "운용본부", levelCd: "0020", sortOrder: "2", ... }
expect:
  - { table: org01_code, rows: 3 }
  - { table: org02_info, rows: 3 }
```
</details>

<details>
<summary>확인 SQL</summary>

```sql
select c.org01_code_id, c.org01_org_cd, i.org02_kor_nm
  from org01_code c join org02_info i on i.org02_code_id = c.org01_code_id
 where c.org01_company_id = :cid order by 2;
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Org01_Tab_OrgCode`(#1028, [하위조직등록] E2 `insertChild`, [조직도보기] E3), 등록·수정 창 `Org01_Edit_OrgCode`(`update` L284-327), 조직 이력 `Org02_Lookup_OrgInfo`·`Org02_Edit_Info`
- AS-IS 서버: `org.Org01_Code.update` L106-167, `delete` L169
- TOBE: `POST /api/v1/org/org-codes`(`OrgCodeController.createOrgCode`), `OrgCodeService.createOrgCode`(필수 검사)
- TOBE 상태(2026-11-09): **실행** — kalpa에서 API로 2건 생성, 오류 없음. 자동 시험·화면 눈 확인은 아직(`대기`).
- 조직등급 코드(`0010`/`0020`/`0030`)는 `sys09_code` 조직등급 종류에서 온다.
</details>
