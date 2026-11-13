# FND-BZ-0011 운용현황·펀드자산을 본다 (조회)

> **한 줄 요약** — 펀드관리 메뉴의 나머지는 **보기 화면**이다. 펀드 목록·변경이력(#1049·#1327)은 우리 회사 펀드 데이터를 읽고, 펀드별 자산·자산별 펀드(#1123·#1124)·기준가(#1475)·발생보수(#1268)·운용현황(#1323)은 **ICAM(외부 펀드 시스템) 자료**를 읽는다. 펀드자산 종목(#1117·#1118)은 자산 분류 트리다. 이 이벤트는 앞선 0001~0010으로 만든 데이터가 이 화면들에 어떻게 보이는지, 비어 있는 이유가 무엇인지를 확인한다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 운용역·운용지원(조회) |
| 언제 | 수시 |
| 먼저 있어야 하는 것 | FND-BZ-0004(펀드), ICAM 자료(외부) |
| 다음 이벤트 | — |
| 실제 실행 | kalpa, 2026-11-13, API. 펀드 목록(`fund-codes/search`)·변경이력(`history`)에는 `KF001`이 보인다. 펀드별 자산(`relate`·`books/items`)·기준가(`icam/fund-prices`)는 빈 목록. 발생보수(`icam/current-fee-by-funds`)는 0값 한 줄. ICAM 가져오기(`funds/batch`·`sources/fetch`)는 모두 거절. 화면 눈 확인 `대기(일괄)` |
| 메뉴 | #1049 펀드 조회, #1327 펀드 조회(변경이력), #1123 펀드별 자산 조회(ICAM), #1124 자산별 펀드 조회(ICAM), #1475 펀드별 기준가 현황, #1268 펀드별 발생보수현황, #1323 펀드운용현황(펀드합계), #1117 펀드자산 종목기본, #1118 펀드자산 종목상세. kalpa 메뉴 없음 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 운용역 | #1049 | 펀드유형·검색어 조회 (`GET /fnd/fund-codes/search`) | KF001 등 펀드 목록 |
| 2 | 운용역 | #1327 | 조회 (`GET /fnd/fund-codes/history`) | 펀드 정보 변경 이력 |
| 3 | 운용역 | #1123·#1124 | 기준일 조회 (`GET /fnd/fund-codes/relate`, `/fnd/books/items`) | ICAM이 가져온 펀드·종목 보유 |
| 4 | 운용역 | #1475·#1268·#1323 | 기간·유형 조회 (`GET /icam/fund-prices`·`current-fee-by-funds`·`fund-operate-status`) | 기준가·발생보수·운용현황 |
| 5 | 관리자 | #1117·#1118 | 분류 트리·종목 상세 (`GET /ast/class-trees`) | 펀드자산 종목 |

## DB에 남는 것

이 이벤트는 읽기 위주라 남는 것이 없다. 아래는 ICAM 자료가 있어야 채워지는 테이블이다.

| 테이블 | 무엇 | kalpa |
|:---|:---|:---|
| `icam03_fund` · `icam06_fund_book` · `icam20_price` | ICAM 펀드·잔고·기준가 | 0 (가져오기 불가) |
| `icam10_fee` · `icam12_fee_book` | 발생보수·월말잔액 | 0 |
| `fnd10_book` | 펀드별 보유종목(ICAM) | 0 |

## 업무 규칙 · 주의

- **ICAM 자료는 TOBE에서 가져올 수 없다**: 가져오기 배치(`POST /icam/funds/batch`·`fees/batch`·`test/batch`·`sources/fetch`)가 모두 같은 `IcamBatchRunner`를 거치고, 구현이 `DisabledIcamBatchRunner`(항상 거절 — "ICAM 연동이 아직 없다")뿐이다. 시뮬레이터 모드(`asseterp.icam.mode=simulator`)가 켜져 있고 `data/icam-simulator/icam`에 CSV가 13종 있는데도 이 경로에서는 쓰지 않는다. 그래서 ICAM 의존 화면 5개(#1123·#1124·#1475·#1268·#1323)는 시험용 자료를 만들 방법이 없다 → [의심 #157(확장)·#179](../../보안_및_버그_의심.md).
- 펀드 조회(#1049)는 **펀드 권한(0005)을 보지 않는다**: 펀드 권한이 없는 경영지원본부 사원 401도 운용본부 권한 펀드 KF001을 본다. 원본도 같다(`trace-crud --screen 1049`: `fnd08_org_auth`를 읽지 않음). 펀드 권한은 펀드 선택 콤보에만 쓰인다.
- 타사무 보유주식(`GET /fnd/book-extrs`)도 메뉴 권한이 없는 사원에게 보인다(0007 참고).
- `yunhee biz-authz fnd`(GET): 이미 적은 #166(규약)·#171(참여계좌)·0007(보유주식) 외에 새로 걸리는 것은 없다. `consignments/company`·`office-works/company` 읽기는 코드표라 영향이 낮다.
- 펀드관리 메뉴에 있는 자산 분류 화면(#1117·#1118)은 AST 도메인과 같은 API(`/ast/class-trees`)를 쓴다. 이 API의 `move`·`item-class`·`DELETE`는 검사가 없다 → [의심 #180](../../보안_및_버그_의심.md).
- `yunhee biz-authz icam`은 `current-fee-by-funds`·`sources`를 `200 rows=1`·`200`으로 분류했지만 실제로는 **필수 파라미터 누락으로 400**이었다(도구가 400을 200으로 읽음 → `수정사항064` 추가 항목 후보).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: FND-BZ-0011
needs: [FND-BZ-0004]
steps:
  - no: 1
    actor: { company: kalpa, user: "401", password: "1111" }
    api: GET /api/v1/fnd/fund-codes/search?closeYn=false
    expect: { rows: ">=1", fundCodes: [KF001] }
  - no: 2
    api: GET /api/v1/fnd/fund-codes/history?closeYn=false
    expect: { rows: ">=1" }
  - no: 3
    api: GET /api/v1/icam/fund-prices?stdDate=2026-11-13
    expect: { rows: 0 }
  - no: 4
    actor: { user: admin }
    api: POST /api/v1/icam/funds/batch
    expect: { message: "ICAM 연동(외부 ICAM DB)이 아직 없어 펀드정보를 가져오지 않았습니다" }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Fnd01_Tab_FundSearch`(#1049)·`Fnd01_Tab_FundIcamHistory`(#1327)·`Fnd10_Tab_RelateAst`·`RelateFnd`·`Icam06_Tab_FundPrice`·`Icam10_Tab_CurrentFeeByFund`·`Icam06_Tab_FundOperateStatus`·`Ast01_Tab_ClassTreeManagement`·`Ast01_Tab_InfoManagement`.
- TOBE: `FndFundCodeController`, `IcamFundController`·`IcamFeeController`, `AstClassTreeController`, `IcamBatchRunner`(구현 `DisabledIcamBatchRunner`).
</details>
