# APR-BZ-0006 자주 쓰는 결재선을 "문서결재선 그룹"으로 만든다

> **한 줄 요약** — 회사가 쓰는 결재선(누가 결재·합의·참조인지, 순서)을 이름 붙인 그룹으로 미리 만들어 두는 관리자 화면(#1282)이다. 문서분류(#1110)에서 그 그룹을 지정하면 그 분류로 상신할 때 기본 결재선에 **추가로** 들어간다. 그룹과 멤버는 한 화면에서 위(그룹) → 아래(멤버)로 나뉜다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 고객사 관리자(메뉴는 관리자 > 03. 문서관리 — 이번 실행은 API라 kalpa `301`로 호출) |
| 언제 | 도입 때, 결재 구조가 바뀔 때 |
| 먼저 있어야 하는 것 | EMP-BZ-0001(직원), 결재 구분 코드(결재·합의·참조·후결 등 `AprStepTypeCode`) |
| 다음 이벤트 | 문서분류에 그룹 지정(#1110 문서분류) → 직원이 그 분류로 상신(APR-BZ-0001) |
| 실제 실행 | kalpa, 2026-11-12, API(T3600 DB). 그룹 등록·멤버 저장(필수·중복 검사·순서 번호)·그룹 삭제 |
| 메뉴 | #1282 문서결재선 그룹관리 (관리자 > 03. 문서관리, 화면 눈 확인 `대기(일괄)`) |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 관리자 | **#1282** 위 그리드 | [조회] | 회사의 그룹 목록(그룹명·비고). 처음엔 0건 |
| 2 | 〃 | 〃 | [등록] → 문서결재선 그룹명 `업무분석 결재선`·비고 → [저장] | 한 줄 저장 |
| 3 | 〃 | 아래 멤버 그리드 | 그룹 행 선택 → [등록] → 사원찾기(여러 명)에서 `박부장`·`정부장`·`김사원` → 구분(결재·합의·참조) → [저장] | 순서대로 `001`·`002`·`003` 번호가 붙고 부서·직책·성명이 나옴. 구분이 비면 "구분값은 필수 입력항목입니다", 같은 사원이 둘이면 "결재선에 중복된 사원이 존재합니다" |
| 4 | 〃 | 위 그리드 | 그룹 행 선택 → [삭제] → "해당 문서결재 그룹을 삭제하시겠습니까?" [예] | 그룹 행이 지워짐(멤버는 남는다 — 아래) |

## DB에 남는 것

| 테이블 | 무엇 | 단계 |
|:---|:---|:---|
| `apr30_appr_step_group` | 그룹(이름 최대 20자·비고) | 2 +1, 4 −1 |
| `apr31_appr_step_group_member` | 멤버(구분 코드·순서 `001`~·사원·비고) | 3 +멤버 수 |

## 결과를 볼 수 있는 화면

- #1282 자체, 문서분류(#1110)의 결재선 그룹 지정, 해당 분류로 상신할 때의 결재문서 창 결재선 탭.

## 업무 규칙 · 주의

- 실행 결과(2026-11-12): 그룹 `업무분석 결재선` 등록 → 멤버 저장에서 구분 비면 "구분값은 필수 입력항목입니다", 같은 사원 2번이면 "결재선에 중복된 사원이 존재합니다". 정상 저장은 박부장 `10`·정부장 `20`·김사원 `30`이 `001`·`002`·`003`.
- 멤버 [저장]은 **요청에 담긴 행만 넣거나 고친다**(빠진 행은 지우지 않는다 — 지우기는 [삭제]). 순서 번호는 요청 순서로 매겨서, 일부만 보내면 번호가 겹칠 수 있다(`001`이 둘). 화면은 그리드 전체를 보내므로 정상 화면에서는 안 생긴다.
- **그룹을 지워도 멤버는 남고 API로는 못 지운다**: 그룹 [삭제]는 `apr30`만 지운다(원본도 같음). 멤버 삭제는 "그룹이 이 회사 것인지"를 그룹 행으로 확인해서, 그룹을 먼저 지우면 멤버 삭제가 0건이다. 시험 그룹의 멤버 5행이 고아로 남았다 → 의심 #33.
- **서버가 안 막는 것**: ① 다른 회사 사원이 멤버로 저장된다(`202404051678081`), ② 구분 코드에 아무 값(`ZZ`)이나 저장된다, ③ 그룹 이름이 20자를 넘으면 "서버 내부 오류"(500, DB 열 길이) — 화면 길이 제한에만 의존. 모두 원본에서도 같은 구조로 보인다 → 의심 #34(하).
- **메뉴 권한을 서버가 보지 않는다**: 관리자 화면인데 직원(사원 401)이 `PUT /api/v1/apr/appr-step-groups`로 그룹 이름을 바꿀 수 있었다(되돌림). 문서분류에 걸린 그룹이면 상신자들의 기본 결재선이 바뀐다 → 의심 #35(중).
- 안 한 것: 화면 눈 확인, 문서분류(#1110)에 그룹을 지정한 뒤 상신할 때 결재선에 추가 반영(`AprApprNewMapper`)되는지, 사원찾기 팝업 동작.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: APR-BZ-0006
needs: [EMP-BZ-0001]
steps:
  - no: 2
    actor: { company: kalpa, user: "301", password: "Kalpa1234!" }
    api: PUT /api/v1/apr/appr-step-groups
    body: [{ apprStepGroupId: 0, apprStepGroupName: "업무분석 결재선", note: "시험" }]
    expect: { table: apr30_appr_step_group, delta: +1 }
  - no: 3
    api: PUT /api/v1/apr/appr-step-group-members?apprStepGroupId=<group>
    body:
      - { apprStepGroupMemberId: 0, stepTypeCode: "10", stepEmpId: "<201>", note: "1차" }
      - { apprStepGroupMemberId: 0, stepTypeCode: "20", stepEmpId: "<202>" }
      - { apprStepGroupMemberId: 0, stepTypeCode: "30", stepEmpId: "<401>" }
    expect: { table: apr31_appr_step_group_member, delta: +3, seq: ["001","002","003"] }
  - no: 3
    api: PUT /api/v1/apr/appr-step-group-members?apprStepGroupId=<group>   # 구분 비움 / 같은 사원 2번
    expect: { status: 400, messages: ["구분값은 필수 입력항목입니다", "결재선에 중복된 사원이 존재합니다"] }
  - no: 4
    api: DELETE /api/v1/apr/appr-step-groups   # [<group>]
    expect: { table: apr30_appr_step_group, delta: -1, apr31_orphans: 3 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Apr30_Tab_ApprStepGroup`(#1282, 이벤트 E0~E6, 삭제 확인 L176-195) + `Apr31_Page_ApprStepGroupMember`(멤버 그리드, `update()` L316-374: 구분 필수 → 사원 중복 → 순번 `000` 포맷) + 사원찾기 `Emp00_Lookup_SelectMulti`.
- AS-IS 서버: `apr.Apr30_ApprStepGroup.selectByCompanyId`·`update`·`delete`, `apr.Apr31_ApprStepGroupMember.selectByApprStepGroupId`·`update`·`delete`(모두 UpdateDataModel).
- TOBE: `/api/v1/apr/appr-step-groups`(`AprApprStepGroupService`), `/api/v1/apr/appr-step-group-members`(`AprApprStepGroupMemberService` — `save` L34-52, `delete` L55-58). 그룹을 상신에 쓰는 곳은 `AprApprNewMapper`·`DcrClassTreeMapper`.
- TOBE 상태(2026-11-12): 실행(API). 화면 눈 확인 `대기(일괄)`.
</details>
