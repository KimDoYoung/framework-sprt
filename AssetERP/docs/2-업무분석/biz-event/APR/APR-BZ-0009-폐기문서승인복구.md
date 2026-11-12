# APR-BZ-0009 폐기문서를 승인(반려)하고 복구한다

> **한 줄 요약** — 직원이 [문서폐기 신청](APR-BZ-0003-회수재상신폐기.md)한 완료·반려 문서를 **지정된 승인자가 #1490에서 승인(폐기)하거나 반려**한다. 승인하면 문서가 결재문서 테이블에서 **폐기문서 보관(`apr99_appr_del`)으로 옮겨져** 문서함·검색에서 사라진다. 고객사 관리자는 #1253에서 회사 전체 폐기 신청을 보고, #1098에서 **폐기된 문서를 복구**한다(복구하면 결재문서로 되돌아오고 폐기 신청은 지워진다).

| 항목 | 내용 |
|:---|:---|
| 누가 | 승인자(지정된 조직장, 부장 `kalpa/201/Kalpa1234!`) · 신청자(`301`·`401`, [0003](APR-BZ-0003-회수재상신폐기.md)) · 고객사 관리자(`kalpa/admin/1111`, #1253·#1098) |
| 언제 | 폐기 신청이 올라왔을 때(승인자), 잘못 폐기했을 때(복구) |
| 먼저 있어야 하는 것 | [APR-BZ-0003](APR-BZ-0003-회수재상신폐기.md)(폐기 신청 — 반려·완료 문서의 상신자가 신청) |
| 다음 이벤트 | 복구한 문서는 다시 문서함에 나온다(반려 문서는 새 문서로 다시 쓰는 것이 원칙, 0003). 폐기 문서는 문서검색·#1443에서 안 보인다 |
| 실제 실행 | kalpa, 2026-11-12, API(T3600 DB). 0003에서 만든 신청 2건(401의 반려 문서·301의 합의반려 문서) → 비지정자가 반려 → 부장 승인 → 재승인·승인 뒤 반려 → 비관리자·관리자가 복구 |
| 메뉴 | #1490 문서작성 > 02. 문서검색 > 폐기문서 승인 · #1253 관리자 > 03. 문서관리 > 폐기문서 승인(관리자) · #1098 관리자 > 03. 문서관리 > 폐기문서 복구. **kalpa에는 세 메뉴가 모두 없다** — API로만 실행, 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 승인자(부장) | **#1490** | 조회기간(올해 1/1~오늘)·처리상태(전체/폐기신청/폐기/반려) → [조회] | **나를 승인자로 지정한 신청만** 나온다(처리상태·신청일·신청자·문서명·문서상태·사유·승인여부·승인(반려)자·일). 다른 사원이 열면 0건 |
| 2 | 〃 | 〃 | 행(여러 줄 가능) 체크 → [승인] → "N건의 문서를 '폐기승인' 하시겠습니까?" [예] | 처리상태 `폐기`·승인여부 ✓·승인자·승인일. 문서는 폐기문서로 옮겨진다 |
| 3 | 〃 | 〃 | 행 체크 → [반려] → [예] | 처리상태 `반려`·승인여부 ✗. 선택한 줄 중 이미 `폐기`된 것이 있으면 "선택한 문서 중 폐기처리가 완료된 문서가 포함되어있습니다"(화면 검사) |
| 4 | 관리자 | **#1253** | 같은 조회·[승인]·[반려] | 승인자 구분 없이 **회사 전체** 폐기 신청이 나온다 |
| 5 | 관리자 | **#1098** | 조회기간·담당부서·담당자·상신제목 → [조회] | 폐기된 문서 목록(등록일·시행일·문서분류·상신제목·상세보기·담당부서·담당자·폐기일·폐기진행) |
| 6 | 〃 | 〃 | 행 선택 → [복구] → "선택한 문서를 복구하시겠습니까?" [예] | 목록에서 사라지고 문서가 결재문서로 돌아온다(상태는 폐기 전 그대로 — 반려 문서는 `반려`). 신청자의 문서함에 다시 보인다 |

## DB에 남는 것

| 테이블 | 무엇 | 단계 |
|:---|:---|:---|
| `apr90_disposal_list` | 폐기 신청 행의 `disposal_cd`(10 → 20 승인 / 99 반려)·`confirm_emp_id`·`confirm_date`·`confirm_yn` | 2·3 |
| `apr91_disposal_history` | 처리 이력 1행씩(10 신청·20 승인·99 반려·30 복구, 누가·언제) | 2·3·6 +1 |
| `apr99_appr_del` | 승인하면 결재문서 본문·제목·분류·상신자를 **복사해 보관**(폐기일·폐기자) | 2 +1 |
| `apr01_appr` | 승인하면 **삭제**(결재선 `apr04_appr_step`은 그대로 남는다), 복구하면 다시 +1 | 2 −1, 6 +1 |
| `opr01_create`·`pln02_plan`·`apr11_advert_book` | 그 결재문서와의 연결을 푼다(광고도서는 삭제) | 2 |
| `apr90_disposal_list` | 복구하면 그 문서의 폐기 신청 행을 **삭제**, `apr99_appr_del` 행도 삭제 | 6 |

## 결과를 볼 수 있는 화면

- #1443 폐기문서 신청현황(신청자: 승인 전·후 상태), #1490·#1253(승인자·관리자), #1098(폐기된 문서), 문서함(#1018·#1019 — 폐기되면 사라지고 복구하면 돌아온다).

## 업무 규칙 · 주의

- **실행 결과(2026-11-12)**: 승인자 201의 #1490 목록은 신청 2건(401 `APR0003 시험 문서(수정)`, 301 `APR0002 시험 합의반려`)이었고 301은 0건이었다. 201이 [승인]하자 두 문서가 `apr01_appr`에서 사라지고 `apr99_appr_del`에 2행(삭제자 박부장)이 생겼다. 관리자가 복구하자 `apr01_appr`에 상태 `40`(반려) 그대로 돌아왔고 `apr99_appr_del`·`apr90_disposal_list` 행은 사라졌으며 이력에 `30`이 남았다. 이미 복구한 문서를 다시 복구하면 `DATA_NOT_FOUND`("데이터를 찾을 수 없습니다")다(원본은 `update`가 0건이어도 성공 처리).
- **지정된 승인자만 목록에 보인다**: #1490은 로그인 사원 ID를 승인자로 걸러 보여준다(`searchByCompany`, 원본은 화면이 `confirmEmpId`를 보내 같은 결과). #1253만 회사 전체.
- **승인하면 결재선은 남고 문서는 옮겨진다**: 폐기 승인 뒤에도 `apr04_appr_step` 행이 그대로 있어 복구하면 결재선이 같이 돌아온다. 문서의 연관(작성·계획·광고도서) 연결은 승인 때 풀리고 복구해도 **되돌아오지 않는다**(원본도 같음).
- **서버가 막지 않아서 생기는 일**(보안·버그 의심 후보, 아래 "의심"): 승인자가 아닌 사원도 승인·반려를 부를 수 있고, 이미 폐기 처리된(20) 신청을 다시 승인하거나 반려로 바꿀 수 있으며, 메뉴 권한 없는 직원이 관리자용 목록·복구 API를 부를 수 있다.
- 빈 목록은 입력 검증 400(실행 확인). 승인(20)·반려(99) 외 값과 존재하지 않는 폐기 신청 ID는 `INVALID_INPUT`(코드로 확인, 실행은 안 함).
- 안 한 것: 화면 눈 확인, #1253 화면 자체 동작, 자금집행결의서·증빙으로 연결된 문서 폐기 막기(0003 쪽 검사), 광고도서(`apr11`)·작성(`opr01`)·계획(`pln02`) 연결이 있는 문서의 승인·복구, 복구 때 같은 번호 문서가 이미 있는 경우.

### 의심 (보고용)

1. 승인자가 아닌 사원이 폐기 신청을 승인·반려할 수 있다 — 반려 시 `confirm_emp_id`가 그 사원으로 덮인다. 승인자로 지정되지도 신청자도 아닌 사원 401이 301의 신청을 반려했다(200, 부장 승인 전에).
2. 이미 승인된(20) 신청을 다시 [승인]하거나 [반려](99)해도 200이다 — 문서는 이미 폐기됐는데 신청 상태는 `반려`·승인여부 ✗로 남는다. "폐기 완료 후 반려 금지"는 화면 검사뿐(`update` L170-190).
3. 메뉴 권한 없는 직원 401이 `GET /disposal-lists/admin`(회사 전체 신청)과 `GET /appr-dels`(회사 전체 폐기 문서)를 읽고, `POST /appr-dels/restore`로 폐기 문서를 복구했다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: APR-BZ-0009
needs: [APR-BZ-0003]
steps:
  - no: 1
    actor: { company: kalpa, user: "201", password: "Kalpa1234!" }
    api: GET /api/v1/apr/disposal-lists/approvals?startDate=2026-01-01&closeDate=2026-12-31&disposalCode=%
    expect: { rows: 2, other_user_301_rows: 0 }
  - no: 2
    api: PUT /api/v1/apr/disposal-lists/disposal-code   # { disposalCode: "20", disposalListIds: [...] }
    expect: { tables: { apr99_appr_del: +2, apr01_appr: -2, apr91_disposal_history: +2 } }
  - no: 3
    api: PUT /api/v1/apr/disposal-lists/disposal-code   # { disposalCode: "99", disposalListIds: [...] }, 폐기 전 신청에서
    expect: { apr90_disposal_list: { disposal_cd: "99", confirm_yn: false } }
  - no: 5~6
    actor: { user: admin, password: "1111" }
    api:
      - GET /api/v1/apr/appr-dels?startDate=2026-11-01&closeDate=2026-11-30
      - POST /api/v1/apr/appr-dels/restore   # { apprId }
    expect: { tables: { apr01_appr: +1, apr99_appr_del: -1, apr90_disposal_list: -1, apr91_disposal_history: +1 }, again: "DATA_NOT_FOUND" }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Apr90_Tab_DisposalAppr`(#1490, E0~E5, `update` L170-229 — 승인 20·반려 99, 반려는 "폐기처리가 완료된 문서가 포함되어있습니다" 화면 검사), `Apr90_Tab_DisposalListAdmin`(#1253, 같은 모양·회사 전체), `Apr01_Tab_Restore`(#1098, E0~E7, `restoreChk` L246-264·`restore` L266-286).
- AS-IS 서버: `apr.Apr90_DisposalList.updateAppr` L72-112(`confirmEmpId`·`companyId`를 클라이언트에서 받음, 20이면 `apr01_appr.insertApprDel`→`deleteAppr`→`opr01_create`·`pln02_plan` 연결 해제→`apr11_advert_book.deleteByApprId`), `apr.Apr90_DisposalList.selectByCompanyId` L29, `apr.Apr99_ApprDel.restore` L43-62(`restore`→`deleteApprId`→`apr90_disposal_list.deleteByApprId`→`apr91_disposal_history.insert` 코드 `30`), `apr.Apr99_ApprDel.selectByCompanyId` L27.
- TOBE: `AprDisposalListController` `/api/v1/apr/disposal-lists`(`GET /mine`·`/approvals`·`/admin`·`PUT /disposal-code`), `AprDisposalListService.updateDisposalCode` L45-67(회사·승인자는 세션에서, 신청의 승인자 지정은 안 봄), `AprApprDelController` `/api/v1/apr/appr-dels`(`GET`·`POST /restore`), `AprApprDelService.restore` L36-49(0건이면 `DATA_NOT_FOUND`).
- TOBE 상태(2026-11-12): 실행(API). 화면 눈 확인 `대기`.
</details>
