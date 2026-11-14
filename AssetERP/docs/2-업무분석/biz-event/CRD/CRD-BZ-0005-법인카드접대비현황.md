# CRD-BZ-0005 법인카드·접대비 현황을 본다

> **한 줄 요약** — 법인카드 내역(CRD-BZ-0003)에 붙인 **계정과목·접대 대상자**로 **월별 접대비 현황**(#1335, 관리자 기준/실사용자 기준)·**1인당 한도를 넘은 내역**·**거래처별 접대비**를 본다. 카드사용 현황표(#1333)는 계정 **맵핑**(사용항목 ↔ 계정과목)을 바탕으로 RD 보고서로 뽑는다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리·준법감시 담당 |
| 언제 | 매월·분기 점검 때 |
| 먼저 있어야 하는 것 | CRD-BZ-0003(계정과목 붙은 내역), 이익제공 한도(`PUT /biz/limits`), 계정 맵핑(`account-maps`) |
| 다음 이벤트 | CRD-BZ-0006 |
| 실제 실행 | kalpa, 2026-11-13, API. 계정 맵핑 접대비(01) 등록 → 한도 없이 월별 현황 0 → 1인당 한도 30,000 등록 → 80,000원 내역에 대상자 2명(김사원·최사원) 지정 → 월별(관리자·실사용자 기준) 11월 **260,000**(AS-IS `selectByMonthEntertmExpense` 1=1 ✅) → 내역 보기 2줄(1인당 40,000·220,000) → 거래처별 `미지정거래처` 260,000. RD 출력(#1333 [출력])·외부 대상자·거래처 지정은 안 함. 화면 눈 확인 `대기(일괄)` |
| 메뉴 | #1335 접대비 현황, #1333 법인카드 현황(RD), (한도는 #1409 계열 이익제공 한도 설정 화면). kalpa 메뉴 없음 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 경영관리 | #1333 [계정 맵핑] 창 | 사용항목(`접대비` 01 등 11종) → 계정과목 선택 → [저장] (`PUT /biz/account-maps`) | `biz03_account_map` +1 |
| 2 | 경영관리 | 한도 설정 화면 | 적용일·이익제공(1)·1인당 한도(`saleRuleLimit1`) → [저장] (`PUT /biz/limits`) | `biz90_limit` +1 |
| 3 | 경영관리·사원 | #1335 내부/외부 대상자 창 | 내역 선택 → 대상자(사원) 추가 (`POST /biz/people/internal`, 외부는 `…/external`) | `biz02_person` +2 |
| 4 | 경영관리 | #1335 월별 탭 | 연·월·기준(관리자/실사용자) → [조회] (`GET /biz/entertm-expenses/monthly`) | 사원별 월 합계 |
| 5 | 〃 | #1335 내역 탭 | 선택한 사원·월의 내역 (`…/history`) | 한도 초과 내역(금액·1인당 금액·인원·메모) |
| 6 | 〃 | #1335 거래처별 탭 | (`…/companies`, `…/company-history`) | 거래처별 접대비 합 |
| 7 | 경영관리 | #1333 | [출력] (`POST /biz/card-reports/rd-print`) | RD 보고서(이번엔 안 함) |

## DB에 남는 것

| 테이블 | 무엇 | kalpa 실행 |
|:---|:---|:---|
| `biz03_account_map` | 사용항목 ↔ 계정과목 맵핑(접대비) | +1 |
| `biz90_limit` | 이익제공 1인당 한도(30,000/50,000) | +1 |
| `biz02_person` | 접대 대상자(내부 사원) | +2(80,000원 내역) |

## 업무 규칙 · 주의

- **현황은 "한도를 넘은" 내역만 보인다.** 한도(`biz90_limit`)가 없으면 접대비가 있어도 0이다(한도가 없으면 서브쿼리가 NULL). 계정과목명이 정확히 `접대비`인 내역만 센다(`act01_account_nm = '접대비'`).
- 1인당 금액 = 금액 ÷ (대상자 수 — 없으면 1). 내부 직원(`biz02_emp_yn`=true)을 합계 계산에서 빼는 식이 원본 SQL에 있어 대상자가 모두 직원이면 월 합계가 1인당 금액으로 잡힌다(80,000원 → 40,000).
- 월별 현황의 기준 `cardRealUserType`은 `관리자`(카드 사용자 기준)·`실사용자`(배분 기준)이고 그 외 값(`%`)은 일부 행이 비거나 달라진다.
- 계정 맵핑이 없으면 #1333 RD 보고서가 비는 것으로 보인다(RD 확인은 `대기`).
- **사원(402)이 한도를 바꿔 현황을 숨기거나 마감 내역의 대상자를 바꿀 수 있다** → [의심 #191](../../보안_및_버그_의심.md)·[#190](../../보안_및_버그_의심.md).
- `yunhee trace-crud -s 1335`: 대상 테이블 `biz01_promo`·`biz02_person`(CRUD 같음), `compare`는 월별 AS-IS 1=1.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: CRD-BZ-0005
needs: [CRD-BZ-0003]
steps:
  - no: 1
    actor: { company: kalpa, user: admin, password: "1111" }
    api: PUT /api/v1/biz/account-maps
    body: [{ useItemCode: "01", accountCodeId: "{접대비}" }]
  - no: 2
    api: PUT /api/v1/biz/limits
    body: [{ startDate: "2026-01-01", provideRcvType: "1", saleRuleLimit1: 30000, saleRuleLimit2: 50000, companyLimit1: 0, companyLimit2: 0, companyLimit3: 0 }]
  - no: 3
    api: POST /api/v1/biz/people/internal
    body: { promoId: "{80000원 내역}", empIds: ["{401}", "{402}"] }
  - no: 4
    api: GET /api/v1/biz/entertm-expenses/monthly?year=2026&month=11&cardRealUserType=관리자
    expect: { novSum: 260000 }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Biz01_Tab_EntertmExpenseReport`(#1335)·`Biz01_TabPage_MonthEntertmExpense`·`Biz02_Grid_InternalList`, `Biz01_Tab_CardReport`(#1333)·`Biz03_Lookup_AccountMap`, 서버 `Biz01_Promo.selectByMonthEntertmExpense`·`Biz02_Person`.
- TOBE: `BizEntertmExpenseController`·`BizAccountMapController`·`BizPersonController`·`BizLimitController`·`BizCardReportController`.
</details>
