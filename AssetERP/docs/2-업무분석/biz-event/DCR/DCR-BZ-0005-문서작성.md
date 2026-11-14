# DCR-BZ-0005 직원이 작성 권한이 있는 문서분류를 골라 새 결재문서를 쓴다

> **한 줄 요약** — 직원이 #1318 신규 문서작성에서 문서분류를 **대분류 → 중분류 → 문서종류(→ 세부분류) 콤보**로 고르거나 [불러오기](자주 쓰는 분류)로 채우고 [신규문서 작성]을 누르면 결재문서 창이 열린다(작성·상신은 APR-BZ-0001). 아래 목록에는 내가 올렸거나 결재선·권한자로 들어간 문서가 나온다. #1002 업무별 문서작성은 같은 일을 **작성 트리**로 하고, #1003 업무별 문서작성(관리자)은 회사의 전체 트리를 본다. 보이는 분류는 0002의 **조직 작성권한**(`dcr03_update_yn`)으로 정해진다 — 콤보는 각 단계 분류(C)마다, 트리는 문서종류(T)에 권한이 있어야 나온다. #1014 법규별 문서작성은 ICS-BZ-0010.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원(kalpa 사원 401, 경영지원본부), 관리자(#1003) |
| 언제 | 수시 |
| 먼저 있어야 하는 것 | DCR-BZ-0001 문서분류, **DCR-BZ-0002 조직 작성권한**(없으면 콤보·트리가 비어 아무것도 못 씀), DCR-BZ-0003 양식(문서종류에 지정돼 있으면 본문에 채워짐), 결재선에 넣을 사원 |
| 다음 이벤트 | APR-BZ-0001 기안·상신 → APR-BZ-0002 승인·반려 |
| 실제 실행 | kalpa, 2026-11-14, API. ① 사원 401·301·201·100 모두 작성 트리 0행, 콤보 0행 — kalpa 직원은 누구도 새 문서를 쓸 수 없는 상태였다. ② 관리자가 경영지원본부에 `기획/회의자료/경영전략회의`(T) 조회·작성 권한 → 401 작성 트리 3행(#1002), 그러나 #1318 대분류 콤보는 여전히 0행 → `기획`(C)·`회의자료`(C)에도 작성 권한을 주자 콤보 연쇄 `기획 → 회의자료 → 경영전략회의` 1·1·1행(세부분류 0). AS-IS 대조: 대분류 콤보 1 = 1, 작성 트리 3 = 3, 내 문서 목록 22 = 22(총건수 22 = 22), #1003 전체 트리 622 = 622. ③ [신규문서 작성] `GET /apr/apprs/new?classTreeId=경영전략회의` → 새 문서 틀. ④ **작성 권한 없는 `인사/증명서 발급/재직증명서`로도 새 문서 열기·임시저장이 됨(⚠#213)** → 지움. ⑤ [불러오기] `GET /dcr/often-uses` 0행 — TOBE는 사용 횟수를 기록하지 않음(⚠#214) |
| 메뉴 | #1318 문서작성 > 01. 문서작성 > 신규 문서작성, #1002 업무별 문서작성, #1003 관리자 > 03. 문서관리 > 업무별 문서작성(관리자). kalpa 메뉴 없음. 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | #1318 | 대분류 콤보(`GET /dcr/write-codes/classes?level=1`) → 중분류(`level=2&dcrParentId=`) → 문서종류(`level=3`) → 세부분류(`GET /dcr/write-codes/details?classTreeId=`) | 콤보 연쇄. 세부분류를 고르면 작성요령(?) 표시 |
| 2 | 〃 | 〃 | [불러오기] → 자주 쓰는 분류 고르기 (`GET /dcr/often-uses`) | 콤보가 그 분류로 채워짐 |
| 3 | 〃 | 〃 | [신규문서 작성] (`GET /apr/apprs/new?classTreeId=`) | 결재문서 창(분류 없으면 "상단 문서분류를 선택해주세요", 전용화면 세부분류는 안내만) → APR-BZ-0001 |
| 4 | 〃 | 〃 | 등록기간·검색·수신처 → [조회] (`GET /apr/apprs/dcr-write`) | 내가 올렸거나 결재선·권한자인 문서(페이지) |
| 5 | 직원 | #1002 | 작성 트리(`GET /dcr/class-trees/write`)에서 문서종류 → 문서 목록·새 문서 | 권한 있는 문서종류와 그 조상만 |
| 6 | 관리자 | #1003 | [조회] (`GET /dcr/class-trees?typeCode=%`) · 찾기 | 회사 전체 트리 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `dcr03_org_auth` | 경영지원본부의 `기획`·`회의자료`·`경영전략회의` 조회·작성 = true | 3행 갱신(행은 이미 있었음 — 남겨 둠, 0006·APR 시험용) |
| `apr01_appr`·`apr04_appr_step` | 권한 없는 분류 임시저장 시험 | +1·+2 → 삭제 −1·−2 |
| `dcr08_often_use` | 자주 쓰는 분류 | 변화 없음(TOBE는 쓰지 않음) |

## 업무 규칙 · 주의

- **콤보와 트리의 권한 기준이 다르다**: #1318 콤보(`sys09_code.selectByDcr01`)는 그 단계 분류 행 자체에 `dcr03_update_yn = 'true'`가 있어야 나온다. #1002 작성 트리는 문서종류(T)에 권한이 있으면 조상 분류까지 나온다. 문서종류에만 권한을 주면 트리엔 보이는데 #1318 콤보엔 안 보인다(원본 그대로).
- 0004의 저장(`updateDcrAuth`)이 링크 분류의 `dcr03_update_yn`을 false로 만들어, 업무 화면 전용 분류는 #1318·#1002에 안 나온다(전용 화면에서 쓰라는 뜻).
- 서버는 새 문서 열기·저장에서 작성 권한을 보지 않는다 → [의심 #213](../../보안_및_버그_의심.md).
- [불러오기] 목록을 채우는 사용 횟수 기록이 TOBE에 없다 → [의심 #214](../../보안_및_버그_의심.md)(변환 F01-2 미완).
- 문서 목록은 원본 새 SQL(`selectByDcrWritePaging`)을 옮겼다 — 옛 `selectByDcrWrite`(삭제문서 `apr99` 포함)와 비교하면 1건 차이가 난다(23 ≠ 22). 401의 삭제문서(`apr99_appr_del`)가 1건이라 그것으로 보인다(행 대조는 안 함).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: DCR-BZ-0005
needs: [DCR-BZ-0001, DCR-BZ-0002]
steps:
  - no: 1
    actor: { company: kalpa, user: admin, password: "1111" }
    api: PUT /api/v1/dcr/org-auths/by-org
    body: { orgCodeId: "{경영지원본부}", rows: [ { classTreeId: "{기획}", retrieveYn: "true", updateYn: "true" }, { classTreeId: "{회의자료}", retrieveYn: "true", updateYn: "true" }, { classTreeId: "{경영전략회의}", retrieveYn: "true", updateYn: "true" } ] }
  - no: 2
    actor: { company: kalpa, user: "401", password: "1111" }
    api: [GET /api/v1/dcr/write-codes/classes?level=1, GET /api/v1/dcr/write-codes/classes?level=2&dcrParentId={기획}, GET /api/v1/dcr/write-codes/classes?level=3&dcrParentId={회의자료}]
    expect: { names: [기획, 회의자료, 경영전략회의] }
  - no: 3
    api: GET /api/v1/apr/apprs/new?classTreeId={경영전략회의}
    expect: { fields: [apprId, classTreeFullName, content, steps] }
  - no: 4
    api: GET /api/v1/apr/apprs/dcr-write?startDate=2026-01-01&closeDate=2026-11-14
    expect: { total: "AS-IS selectByDcrWriteTotal과 같음" }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Dcr01_Tab_DcrWrite`(#1318 E0~E13: 콤보 `Sys09_Code.selectByDcrLv1~3`·`selectByDcrDetail`, [불러오기] `Dcr08_Lookup_SelectSingle`·`Dcr08_OftenUse.selectByPersonId`, [신규문서 작성] L387 → `insertApproval` L523-536 + `Dcr08_OftenUse.insertUpdate`(settings L197-210), 목록 `Apr01_Appr.selectByPaging` → `apr01_appr.selectByDcrWritePaging`), `Dcr01_Tab_DcrUser`(#1002 `Dcr01_ClassTree.selectByOrgIdRoleWrite` → `selectByOrgIdRoleWrite_1Bang`), `Dcr01_Tab_DcrManager`(#1003 `selectByCompanyId`, typeCode `%`), 서버 `Apr01_Appr`(저장에 작성권한 검사 없음).
- TOBE: `DcrWriteCodeController`(`/api/v1/dcr/write-codes/classes`·`/details`), `DcrOftenUseController`(`/api/v1/dcr/often-uses`, 조회만), `DcrClassTreeController`(`/class-trees/write`·`/class-trees`), `AprApprController` `GET /api/v1/apr/apprs/dcr-write`, `AprApprNewController`·`AprApprWriteController`, 프론트 `Dcr01_Tab_DcrWrite.tsx` L222-241·`Dcr01_Tab_DcrUser.tsx`·`Dcr01_Tab_DcrManager.tsx` L138.
</details>
