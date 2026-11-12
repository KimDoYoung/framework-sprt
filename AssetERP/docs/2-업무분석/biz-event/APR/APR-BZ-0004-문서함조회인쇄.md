# APR-BZ-0004 내 문서함에서 상신·결재·참조·공람 문서를 찾아 인쇄한다

> **한 줄 요약** — 직원은 메뉴 4개에서 "내가 올린 문서(#1019) · 내가 결재선에 있는 문서(#1018) · 참조로 받은 문서(#1093) · 공람으로 받은 문서(#1428)"를 기간·분류·결재상태·글자로 찾고 [출력/다운로드]로 목록을 뽑는다. 조회는 **로그인한 사원 기준**(서버가 세션의 사원 ID를 씀)이고 새로 쓰는 것은 없다. 단 문서를 **열면**(문서 ID를 아는 같은 회사 사원 누구나 열림 — 의심 #27) 열람 기록만 남는다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원(kalpa `301` 과장 · `201` 부장 · `401` 사원, 비밀번호 `Kalpa1234!`) |
| 언제 | 매일 |
| 먼저 있어야 하는 것 | APR-BZ-0001(상신된 문서). 공람 문서는 문서창 [공람설정]으로 지정한 것만 나온다(공람은 이 4개 화면에서 지정하지 않는다) |
| 다음 이벤트 | 문서를 열어 결재(APR-BZ-0002), 반려·회수·폐기(APR-BZ-0003) |
| 실제 실행 | kalpa, 2026-11-12, API(T3600 DB). 4개 목록·기간·상태·글자 조건·엑셀 내려받기·공람 지정 뒤 공람내역 확인 |
| 메뉴 | #1018 결재내역 조회 · #1019 상신내역 조회 · #1093 참조내역 조회 · #1428 공람내역 조회 (문서작성 > 04. 전자결재, 화면 눈 확인 `대기(일괄)`) |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 과장 | **#1019** 상신내역 조회 | 기간(올해 1/1~12/31)·결재상태·문서분류·글자 → [검색] | 내가 상신한 문서(상태·분류·제목·최근 결재자·메일발송·사전확인). 301은 17건 |
| 2 | 부장 | **#1018** 결재내역 조회 | 기간·기준일(상신일/시행일)·결재상태·글자 → [검색] | 내가 결재선(결재·합의·후결·대결 포함)에 든 문서와 내가 결재한 날짜(`myApprovalDate`)·최종결재일 |
| 3 | 부장·사원 | **#1093** 참조내역 조회 | 같은 조건 → [검색] | 내가 "참조"로 받은 문서(상신자 표시). 잔여 연차 통지서 같은 통보 문서가 여기 쌓인다 |
| 4 | 사원 | **#1428** 공람내역 조회 | 같은 조건 → [검색] | 문서창 [공람설정]에서 내가 지정된 문서만. 지정이 없으면 "조회된 내용이 없습니다" |
| 5 | 〃 | 4개 모두 | [출력/다운로드] | 조회 조건에 맞는 목록 파일(TOBE는 `상신내역 조회(2026-01-01 ~ 2026-12-31).xlsx`). 원본은 RD 리포트 |
| 6 | 〃 | 4개 모두 | 행 더블클릭 | 결재문서 창(APR-BZ-0001·0002) |

## DB에 남는 것

조회는 읽기만 한다. 원본 [출력/다운로드]는 `sys99_print`에 조회 조건 행을 넣었다 지우는데(`insertRd…List`), TOBE는 파일을 바로 만들어 줘서 `sys99_print`를 쓰지 않는다(변환 때 정한 차이, `yunhee trace-crud`의 "TOBE에 없는 쓰기: sys99_print"). 문서 열람 기록(`open-history`)은 APR-BZ-0001·0002에서 본다.

| 테이블 | 무엇 | 단계 |
|:---|:---|:---|
| `apr01_appr` · `apr04_appr_step` | 문서·결재선(읽기) | 1~4 |
| `apr13_person_auth` | 공람 지정(문서창 [공람설정]이 +1, [공람삭제] −1) | 4 |
| `dcr10_mail_history` · `apr10_stamp` · `ics40_dcr_preconfirm` | 메일발송 칸·인감·사전확인 칸(읽기) | 1~4 |

## 결과를 볼 수 있는 화면

- 이 4개 화면 자체. 문서 하나의 결재 흐름은 결재문서 창의 결재선 탭.

## 업무 규칙 · 주의

- **"내 것"은 서버가 정한다**: 4개 조회 API(`GET /api/v1/apr/apprs/my-request`·`my-approve`·`my-reference`·`my-auth`)에는 사원 ID 파라미터가 없고 로그인 세션의 사원 ID를 쓴다. 다른 사원의 문서함을 볼 길은 없다(확인).
- 실행 결과(2026-11-12): 301 상신 17건 = DB `apr01_reg_emp_id`로 센 17건과 같음, 201 상신 1, 401 상신 14. 결재상태 `30`(완료)+글자 `여비`로 거르면 2건, 상태 `10`(진행)은 1건.
- **공람내역은 결재선 칸 수만큼 중복된다**: 301이 완료 문서(결재선 2줄)를 401의 공람으로 지정하니 401의 공람내역에 **같은 문서 2줄**이 나왔다(`apr13` 행은 1개). 원본 SQL(`selectByAuthEmpId`)도 `apr04_appr_step`을 붙이므로 같을 수 있다 → 의심 #28.
- **공람 지정·삭제를 문서 당사자가 아닌 사원도 할 수 있다**: `PUT /api/v1/apr/apprs/{id}/person-auths`는 문서가 같은 회사인지만 본다. 상신자도 결재자도 아닌 사원 401이 301의 문서에 사원 402를 공람으로 넣었다(지움). 같은 문서 ID로 다른 문서의 결재선(`/steps`)·본문(`/detail`)도 읽혔다 → 의심 #27·#C.
- **문서 열람에 권한 검사가 없다**: `AprApprDetailService.getDetail`은 "로그인 회사의 문서"인지만 본다(주석: 원본은 회사 조건도 없었다). 사원 401(결재선에 없음)이 301이 올린 진행 중 문서(`202611129069413`)의 `/detail`·`/steps`를 200으로 읽었다. 문서 ID는 시각 기반 숫자라 이웃 번호를 짐작하기 쉽다 → 의심 #27.
- 공람은 이 4개 화면에서 만들지 않는다. 원본의 공람 지정 화면 `Apr13_Tab_PersonDcrAuth`(메뉴 없음)는 TOBE에 없고, 문서창의 [공람설정]이 그 역할을 한다.
- 안 한 것: 화면 눈 확인, 문서분류 트리로 거르기(`classTreeId`), 시행일 기준(`dateType=effect`), 메일발송 칸·사전확인 칸 내용, 원본 RD 리포트와 엑셀 모양 비교.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: APR-BZ-0004
needs: [APR-BZ-0001]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "Kalpa1234!" }
    api: GET /api/v1/apr/apprs/my-request?startDate=2026-01-01&closeDate=2026-12-31&searchText=
    expect: { rows: "= apr01_appr 중 reg_emp = 301 (status ≠ 99)" }
  - no: 2
    actor: { user: "201" }
    api: GET /api/v1/apr/apprs/my-approve?startDate=2026-01-01&closeDate=2026-12-31&searchText=
  - no: 3
    api: GET /api/v1/apr/apprs/my-reference?startDate=2026-01-01&closeDate=2026-12-31&searchText=
  - no: 4
    actor: { user: "301" }
    api: PUT /api/v1/apr/apprs/{apprId}/person-auths   # { addPersonIds: [<401>], deleteIds: [] }
    expect: { table: apr13_person_auth, delta: +1 }
  - no: 4
    actor: { user: "401" }
    api: GET /api/v1/apr/apprs/my-auth?startDate=2026-01-01&closeDate=2026-12-31&searchText=
    expect: { rows: 2, note: "apr13 1행인데 결재선 2줄이라 2줄(의심 #28)" }
  - no: 5
    api: GET /api/v1/apr/apprs/my-request/excel?startDate=2026-01-01&closeDate=2026-12-31&searchText=   # 200, xlsx
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Apr01_Tab_MyApproveList`(#1018) · `Apr01_Tab_MyRequestList`(#1019, 이벤트 E0~E10) · `Apr01_Tab_MyReferenceList`(#1093) · `Apr01_Tab_MyAuthList`(#1428).
- AS-IS 서버: `apr.Apr01_Appr.selectApprListByEmpId`·`selectByRequestEmpId`·`selectByReferenceEmpId`·`selectByAuthEmpId`, 인쇄 `sys.Sys99_Print.insertRd{Approve,Request,Reference}List`.
- TOBE: `AprApprController` `GET /api/v1/apr/apprs/my-approve`·`my-request`·`my-reference`·`my-auth`와 `…/excel`, `AprApprDetailController` `/detail`·`/steps`, `AprApprExtraController` `/person-auths`(`AprApprMarkService`).
- TOBE 상태(2026-11-12): 실행(API). 화면 눈 확인 `대기(일괄)`.
</details>
