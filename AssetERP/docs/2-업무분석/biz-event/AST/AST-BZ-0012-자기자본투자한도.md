# AST-BZ-0012 경영관리가 자기자본과 투자한도를 등록한다

> **한 줄 요약** — 해마다(결산·반기) #1299 자기자본/투자한도 등록에서 **기준일별 자기자본금**(`ast40_owner_capital`)을 넣고, [투자한도/StopLoss 설정] 창에서 **적용일별로 자산구분(공통코드 `InvestAssetType`)마다 투자한도비율·StopLoss 비율**(`ast41_invest_limit`)을 정한다. 새 적용일은 [생성]으로 만드는데, 오늘 이전 가장 최근 적용일의 행을 그대로 복사한다(처음이면 `2040%` 채권 한 행). 이 값은 #1300 금융상품 운용내역의 투자한도 표에서 **한도금액 = 자기자본 × 한도비율**, 자기자본 대비 비율로 쓰인다. 전표·결재는 없다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리(kalpa 과장 301) |
| 언제 | 해마다(결산 자기자본 확정 때), 투자 정책이 바뀔 때 |
| 먼저 있어야 하는 것 | 공통코드 `InvestAssetType`(회사 0: 201010 상장주식·201011 IPO·201020 비상장주식·201099 주식(미분류)·2040% 채권·2050% 집합투자증권·2055% 단기자금·2070% 외화증권·2090% 기타자산 — 종목 소분류 코드에 `LIKE`로 맞춘다). 한도표가 보이려면 AST-BZ-0008의 보유 종목 |
| 다음 이벤트 | #1300 금융상품 운용내역(AST-BZ-0008) 투자한도 표 |
| 실제 실행 | kalpa, 2026-11-14, API. 11-13에 이미 있던 것: 자기자본 2025-12-31 10억·2026-06-30 12억, 투자한도 적용일 2026-01-01 3행(2040% 30/5·2050% 50/10·201010 20/15). ① 자기자본 2026-12-31 13억 등록 → +1. ② [생성] 2026-07-01 → 01-01의 3행 복사, [행 추가] 2055% 단기자금 40/10 [저장] → 4행. ③ #1300 한도 `GET /ast/finance-opr/limits?holdDate=2026-11-13` → 단기자금 한도 40% · 자기자본 12억(2026.06) · **한도금액 480,000,000** · 매입 7,150,000. AS-IS 비교: 자기자본 2 = 2, 적용일 2 = 2, 07-01 한도 4 = 4 |
| 메뉴 | #1299 고유자산 > 10. 고유자산 등록 > 자기자본/투자한도 등록. kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 경영관리 | #1299 | 기준연도(YYYY) → [조회] / Enter | 그 해 기준일·자기자본금·비고 |
| 2 | 〃 | 〃 | [등록] → 새 줄에 기준일·자기자본금·비고 → [저장] (줄 체크 → [삭제] → 확인) | 저장된 줄 |
| 3 | 〃 | 〃 → [투자한도/StopLoss 설정] | 창 왼쪽 적용일 목록 → 적용일 클릭 | 오른쪽에 자산구분·투자한도비율(%)·Stop Loss(%)·비고 |
| 4 | 〃 | 〃 → [생성] 창 | 적용일 → [생성] (빈 값이면 "적용일은 필수입력 항목입니다") | 가장 최근 적용일의 행이 새 적용일로 복사됨 |
| 5 | 〃 | 〃 | [행 추가] → 자산구분 고르기 → 비율 → [저장] / 줄 체크 → [행 삭제] / 적용일 고르고 [삭제] → 확인(그 날짜 전부) | 한도 행 |
| 6 | 운용 | #1300 | 기준일 → [조회] | 투자한도 표: 자산구분별 한도비율·한도금액·평가금액·자기자본 대비 비율 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ast40_owner_capital` | 기준일·자기자본금 | +1 (2026-12-31) |
| `ast41_invest_limit` | 적용일·자산구분·한도비율·StopLoss | +4 (2026-07-01). 중복 시험 +3 → 지움 |

## 업무 규칙 · 주의

- #1300은 기준일 **이전 가장 최근** 자기자본·적용일을 쓴다. 회사 설정 `sys01_owner_capital_apply_cd`가 `20`(전전월말)이면 기준일의 전전월 말일 이전 자기자본을 쓴다(kalpa는 NULL → 기준일 그대로). 그래서 미래 기준일 2026-12-31 행은 지금 조회에 안 쓰인다.
- 한도 표는 보유 종목의 소분류 코드가 자산구분에 `LIKE`로 맞는 것만 나온다. 실행 처음에 kalpa 보유는 단기자금(205520)뿐이고 한도 행에 2055%가 없어 #1300 한도 표가 **비어** 있었다 — 자산구분을 빠뜨리면 그 자산은 한도 관리에서 빠진다.
- [생성]이 처음(복사할 행 없음)이면 원본이 "임시"라고 적은 `2040%`(채권) 한 행을 만든다(TOBE도 같음).
- 이미 있는 적용일로 [생성]하면 같은 행이 두 벌 생긴다 → [의심 #116](../../보안_및_버그_의심.md).
- 사원도 자기자본·투자한도를 고칠 수 있다(원본도 메뉴 권한뿐) → [의심 #115](../../보안_및_버그_의심.md).
- 다른 회사 ID를 넣은 저장·삭제는 회사 조건으로 걸러진다(매퍼 `ast40_company_id`·`ast41_company_id`) — 없는 ID는 내 회사 새 행으로 들어간다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: AST-BZ-0012
needs: []
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: [PUT /api/v1/ast/owner-capitals]
    body: [{ ownerCapitalId: null, stdDate: "2026-12-31", amt: 1300000000, note: "2026 결산 자기자본(예상)" }]
    expect: { track: { ast40_owner_capital: +1 } }
  - no: 2
    api: [POST /api/v1/ast/invest-limits]
    body: { startDate: "2026-07-01" }
    expect: { copiedFrom: <오늘 이전 최근 적용일>, track: { ast41_invest_limit: +<그 날 행 수, 없으면 1> } }
  - no: 3
    api: [PUT /api/v1/ast/invest-limits]
    body: [{ investLimitId: null, startDate: "2026-07-01", investAssetType: "2055%", limitRate: 40, stopLossRate: 10, note: "단기자금(MMF 등)" }]
    expect: { track: { ast41_invest_limit: +1 } }
  - no: 4
    api: [GET /api/v1/ast/finance-opr/limits?holdDate=2026-11-13]
    expect: { row: { investAssetTypeName: 단기자금, limitRate: 40, ownerCapital: 1200000000, limitAmt: 480000000 } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ast40_Tab_OwnerCapital`(#1299 E0~E7, `Ast40_OwnerCapital.selectByDate` L34·`update` L44·`delete` L49), `Ast41_Lookup_InvestLimit`(E0~E10, `Ast41_InvestLimit.selectByCompanyId` L26·`selectByDate` L38·`update` L101·`delete` L106·`deleteByDate` L88), `Ast41_Lookup_Insert.update` L68-86 → `Ast41_InvestLimit.insert` L52-84(`selectByMaxCompanyId` 복사, 없으면 `2040%`). #1300 `ast40_owner_capital.selectByMaxDate`·`ast09_book.selectInvestAssetLimit`.
- TOBE: `AstOwnerCapitalController`(`/api/v1/ast/owner-capitals`), `AstInvestLimitController`(`/api/v1/ast/invest-limits`·`/dates`·`/by-date`), `AstInvestLimitService.create` L39-51·`save` L59-81, `AstFinanceOprMapper.xml` `selectOwnerCapitalMax` L65·`selectInvestAssetLimit` L80.
</details>
