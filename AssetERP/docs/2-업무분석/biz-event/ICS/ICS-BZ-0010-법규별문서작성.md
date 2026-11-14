# ICS-BZ-0010 법규별로 쓴 문서를 찾고 새 문서를 작성·상신한다

> **한 줄 요약** — 내부통제 보고 문서를 쓸 때 문서에 **연관법규**(어느 법규에 따른 보고인가)를 붙인다. #1014 법규별 문서작성은 왼쪽 **법규 분류 트리**에서 법규를 고르면 그 법규에 연결된 **회사의 결재문서 목록**(등록일·시행일·등록자·제목·상세보기)을 보여주고, [신규문서 작성]으로 문서분류를 고른 뒤 결재문서 창을 열어 바로 그 법규를 연관법규로 한 문서를 쓴다. 연관법규는 결재문서 창의 연관 탭에서 붙이며, 결재가 **완료된 문서는 바꿀 수 없다**. 연관법규를 붙일 때는 **마감일이 필수**다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 임직원(작성자), 결재자 |
| 언제 | 법규에 따라 보고 문서를 쓸 때 수시 |
| 먼저 있어야 하는 것 | 법규(ICS-BZ-0002에서 회사가 선택·관리그룹), APR 결재 체계(APR-BZ-0001), 문서분류지정 |
| 다음 이벤트 | 결재 완료 후 #1014 목록에서 확인, 보고·점검 이벤트 |
| 실제 실행 | kalpa, 2026-11-13. 301이 법규 분류 트리(회사 법규 245줄)를 받고, 401의 상신 문서(`이익수령 사전승인 신청서`)에 연관법규 `투자업 폐지공고`를 붙임 → 301이 #1014 목록(법규 24691)에서 그 문서를 확인 → 연관법규 삭제로 되돌림. 완료 문서(30)에 붙이면 "결재가 완료된 문서는 연관법규 추가/삭제가 불가능합니다". 마감일 없이 붙이면 "마감일을 입력해주세요". ⚠ 상신자가 아닌 301도 401의 상신 문서에 법규를 붙였다. 목록 AS-IS 대조 0 = 0(자료 0건 시점)·1건 확인은 API |
| 메뉴 | #1014 문서작성 > 01. 문서작성 > 법규별 문서작성. kalpa 메뉴 없음(API). 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 임직원 | #1014 | 법규분류 검색(찾기) → 트리에서 법규 선택 | 오른쪽에 그 법규의 문서 목록 |
| 2 | 〃 | #1014 | 기간·검색어 → [검색] | 문서 줄(등록일·시행일·등록자·제목) |
| 3 | 〃 | #1014 | [신규문서 작성] → 문서분류 → 결재문서 창 | 연관법규에 선택한 법규가 들어간 새 문서 |
| 4 | 〃 | 결재문서 창 | 연관 탭 → 법규·기준일·마감일 → [저장]/[결재요청] | 문서에 연관법규 행 |
| 5 | 〃 | #1014 | 줄의 [상세보기] | 결재문서 창(열람 권한 있을 때) |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `apr20_relate_ics` | 결재문서 ↔ 법규 연결(기준일·마감일) | +1 → 지움 |
| `apr01_appr` 외 | 결재문서(새로 쓸 때) | 이번에는 기존 문서에 붙임 |

## 업무 규칙 · 주의

- 목록(`GET /apr/apprs/ics-list`)은 **로그인 회사의 문서** 중 그 법규에 연결된 것이다. 펀드가 묶인 문서는 사용자의 펀드 권한(`fnd08_org_auth`)으로 걸러진다(원본 `admin == false` 분기 그대로). 문서 열람 권한은 [상세보기]에서 따로 본다.
- 연관법규 저장 검사: 마감일 필수, 결재 완료 문서는 불가(둘 다 서버 검사).
- AS-IS 대조: `selectByIcsClassTreeId` 0 = 0(그리드 4열 컬럼), 연결 1건 확인은 API 응답(상신자 401 문서 → 301이 봄).
- ⚠ 연관법규 저장(`PUT /apr/apprs/{id}/relate-ics`)은 검사가 '회사'뿐이라 **다른 사원이 남의 진행 중 문서에 법규를 붙이고 뗄 수** 있다 → [의심 #142](../../보안_및_버그_의심.md).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICS-BZ-0010
needs: [APR-BZ-0001, ICS-BZ-0002]
steps:
  - no: 1
    actor: { company: kalpa, user: "401", password: "1111" }
    api: PUT /api/v1/apr/apprs/{상신 문서}/relate-ics
    body: { rows: [{ classTreeId: 24691, deadlineId: null, standCode: "1", standDate: "2026-11-01", closeDate: "2026-12-31" }], deleteIds: [] }
    expect: { track: { apr20_relate_ics: +1 } }
  - no: 2
    actor: { company: kalpa, user: "301", password: "1111" }
    api: GET /api/v1/apr/apprs/ics-list?classTreeId=24691&startDate=2026-01-01&endDate=2026-12-31
    expect: { rows: 1 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ics01_Tab_ApprList`(#1014)·`Ics01_Grid_ApprList` — 서버 `Ics01_ClassTree.selectByCompanyId`·`Apr03_RelateFund.selectByIcsClassTreeId` → `ics01_class_tree`·`apr01_appr`·`apr20_relate_ics`·`apr03_relate_fund`.
- TOBE: `IcsClassTreeController`(`/class-trees/write`)·`AprApprController.searchIcsDocList`(`/apr/apprs/ics-list`)·`AprRelateEditController`(`/apr/apprs/{id}/relate-ics`).
</details>
