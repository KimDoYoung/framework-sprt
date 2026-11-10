# ORG-BZ-0002 조직 이름·레벨·정보를 바꾼다 (조직 변경 이력)

> **한 줄 요약** — 팀 이름이 바뀌면 고객사 관리자가 #1028에서 그 조직을 열어 **변경일과 변경사유를 새로 적고** 저장한다. 변경일이 원래 이력과 **다르면 이력이 한 줄 더 생기고**(옛 이름은 옛 날짜에 남는다), **같으면 그 이력을 고쳐 쓴다.** 기준일을 바꿔 조회하면 그날의 이름이 보인다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 고객사 관리자 — 로그인 `kalpa/admin/1111` (http://kalpa.localhost:8082/AssetERP) |
| 언제 | 조직 이름·레벨·정렬순서·주요업무·문서코드·책무점검이 바뀔 때 |
| 먼저 있어야 하는 것 | ORG-BZ-0001(조직) |
| 다음 이벤트 | ORG-BZ-0003 상위조직 이동, ORG-BZ-0004 폐쇄 ([목록](../README.md)) |
| 실제 실행 | kalpa, 2026-11-10 — 시험 팀 `10210 운용지원팀`(운용본부 아래, 개설 2026-11-02)을 만들어 고친 뒤 ORG-BZ-0005로 지움 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 고객사 관리자 | **#1028** 경영관리 > 01. 조직 및 사원관리 > 조직정보 등록 | 트리에서 `운용지원팀` 행을 **두 번 누른다** | "조직정보 History" 창: 왼쪽 이력 목록(변경일 내림차순), 오른쪽 편집 폼(가장 최근 이력) |
| 2 | 〃 | 〃 (같은 날 고치기) | 변경일 `2026-11-02`는 그대로, 정렬순서 `3`, 주요업무 `펀드 운용 지원` → [저장] | 이력 목록은 그대로 1줄. 값만 바뀐다 |
| 3 | 〃 | 〃 (이름 바꾸기) | 변경일 `2026-11-10`, 변경사유 `명칭변경`, 조직명 `운용관리팀` → [저장] | 이력 목록이 2줄: `2026-11-10 운용관리팀 명칭변경` / `2026-11-02 운용지원팀 신설` |
| 4 | 〃 | #1028 | 기준일 `2026-11-05` → [조회] / 기준일 `2026-11-10` → [조회] | 11-05에는 `운용지원팀`, 11-10에는 `운용관리팀` |
| 5 | 〃 | "조직정보 History" | 변경일을 개설일보다 앞(`2026-11-01`)으로 → [저장] | "변경일은 개설일 이후여야 합니다" (저장 안 됨) |

- 왼쪽 이력 행을 누르면 오른쪽 폼이 그 이력으로 바뀐다. 옛 이력을 골라 고치면 그 이력이 바뀐다(변경일을 그대로 두면).

## DB에 남는 것

| 테이블 | 무엇 | 단계 2 | 단계 3 |
|:---|:---|:---|:---|
| `org02_info` | 조직 이력(이름·상위조직·레벨·정렬·변경일·사유) | 고쳐 씀(행 수 그대로) | **+1** (새 `org02_info_id`, 같은 `org02_code_id`) |
| `org01_code` | 조직 코드(개설·폐쇄) | 고쳐 씀 | 고쳐 씀 |

- `org02_info`는 `(org02_code_id, org02_mod_date)`가 유일하다 — 같은 조직에 같은 변경일 이력은 둘일 수 없다(TOBE는 "같은 변경일의 조직정보가 이미 있습니다"로 미리 막는다).
- 새 이력은 원래 이력에서 화면에 없는 값(`inner_type`·`eng_nm`·`mod_detail`·`tdm_yn`)을 그대로 옮겨 적는다.

## 결과를 볼 수 있는 화면

- #1028 트리(기준일별 이름), "조직정보 History" 이력 목록, 직원 화면의 소속 조직명(`f_org_nm`이 기준일의 이력을 읽는다).

## 업무 규칙 · 주의

- **insert냐 update냐는 변경일로 정한다**(원본 `Org01_Code.update` L117-130): 원래 이력의 변경일과 같으면 UPDATE, 다르면 새 ID로 INSERT.
- 필수: 변경일·변경사유(빨간 글씨). 변경일 < 개설일이면 거부.
- 문서코드(`dcrIdWord`)는 회사의 문서번호 체계(`sys01_dcr_numbering_code`)가 `2`일 때만 입력할 수 있다.
- ⚠ **TOBE 부족 — 책무점검(`org02_tdm_yn`) 체크박스가 없다.** 원본 편집 폼(`Org02_Edit_Info` L150 "책무점검", 신규 창 `Org01_Edit_OrgCode` L224 "책무이행")에 있는 체크박스가 TOBE `Org02_Edit_Info.tsx`·`Org01_Edit_OrgCode.tsx`에 없고, 저장 요청(`OrgCodeSaveReq`)·조회 응답에도 없다. 그래서 TOBE에서는 조직을 책무점검 부서로 지정할 수 없다(새 이력은 옛 값을 복사하므로 기존 값은 유지). asseterpdb에서 557행 중 39행이 `true`이고, 책무 대상 조직 조회(`GET /api/v1/org/org-infos/tdm`, 책무 대상 조직 선택 `Org00_Lookup_SelectTdm`)가 이 값을 쓴다. 원본은 2026-04-15에 추가(git `459d7b5ca`)했다. 변환 때 빠진 것이다(`yunhee drift` 기준보다 앞이라 drift에 안 걸림). → 고칠 대상.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ORG-BZ-0002
needs: [ORG-BZ-0001]
actor: { company: kalpa, user: admin, password: "1111" }
setup:
  - api: POST /api/v1/org/org-codes
    body: { orgCd: "10210", openDate: "2026-11-02", openReason: "신설", korNm: "운용지원팀",
            parentCodeId: "<운용본부 codeId>", levelCd: "0030", sortOrder: "1" }
steps:
  - no: 2
    api: PUT /api/v1/org/org-codes/{codeId}
    body: { infoId: "<첫 이력>", modDate: "2026-11-02", modReason: "신설", korNm: "운용지원팀", sortOrder: "3", note: "펀드 운용 지원", ... }
    expect: { table: org02_info, delta: 0 }
  - no: 3
    api: PUT /api/v1/org/org-codes/{codeId}
    body: { infoId: "<첫 이력>", modDate: "2026-11-10", modReason: "명칭변경", korNm: "운용관리팀", ... }
    expect: { table: org02_info, delta: +1 }
  - no: 5
    api: PUT /api/v1/org/org-codes/{codeId}
    body: { modDate: "2026-11-01", ... }
    expect: { http: 400, message: "변경일은 개설일 이후여야 합니다" }
```
</details>

<details>
<summary>확인 SQL</summary>

```sql
select i.org02_info_id, i.org02_mod_date, i.org02_kor_nm, i.org02_mod_reason, i.org02_parent_code_id
  from org02_info i where i.org02_code_id = :codeId order by i.org02_mod_date desc;
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Org01_Tab_OrgCode`(#1028) 트리 두 번 누름 → `editOrgCode` L229-240 → `Org02_Lookup_OrgInfo`(이력 목록 + 편집 폼 `Org02_Edit_Info`), [저장] E2 `updateCheck` L230-242 → `Org02_Edit_Info.update` L236-252(개설일 > 변경일이면 거부)
- AS-IS 서버: `org.Org01_Code.update` L106-167(변경일 비교 → INSERT/UPDATE, org02_info 먼저 → org01_code)
- `Org01_Edit_OrgCode`의 수정 모드(`editData`)는 호출처가 없다(도달 불가) — 수정은 History 창에서만 한다.
- TOBE: `PUT /api/v1/org/org-codes/{codeId}`(`OrgCodeService.updateOrgCode` L139-168), 이력 `GET /api/v1/org/org-codes/{codeId}/infos`
- TOBE 상태(2026-11-10): **실행** — 같은 날 수정(행 그대로)·새 날짜(+1)·개설일 이전 거부, 기준일 조회(`yunhee compare` AS-IS `org01_code.selectByParentId_1Bang`과 행 수 같음). 화면 눈 확인은 `대기`.
</details>
