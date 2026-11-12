# AST-BZ-0009 운용·회계담당이 금융상품 시세를 넣고 월말 평가를 한다

> **한 줄 요약** — 월말에 보유 금융상품을 시가로 평가한다. 운용담당이 #1295 금융상품 시세관리(또는 평가 화면의 [시세입력])에서 종목별 **기준일·평가단가**(수익증권은 1,000좌 기준가)를 넣는다. 회계담당이 #1167 금융상품 평가처리에서 평가일자를 고르면 보유원장 수량 × 단가 ÷ 거래단위로 **평가금액·평가손익**이 계산되어 보이고, 줄을 골라 **[평가처리]**하면 평가 거래(3600)와 분개(차 금융자산 / 대 평가이익)가 생기고, **다음 영업일에 같은 금액의 평가반제(3601)** 거래·역분개가 함께 생긴다. [평가취소]는 둘 다 지운다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 운용(시세) → 회계(평가, kalpa 과장 301) |
| 언제 | 월말 |
| 먼저 있어야 하는 것 | AST-BZ-0008(보유 금융상품), 종목의 종목코드(ISIN)·종목유형, ACT 분개맵핑 |
| 다음 이벤트 | ACT 결산·마감 |
| 실제 실행 | kalpa, 2026-11-12, API: 보유 `PIM서밋전문투자형사모혼합2호 2종 C1` 600,000좌(장부 600,000) → 시세 2026-11-30 단가 **1,080**(처음 1.08로 넣어 평가금액 648원 — 거래단위 1,000좌라 기준가로 넣어야 함, 고쳐 저장) → 평가 목록 평가금액 648,000·손익 48,000(AS-IS 1 = 1) → [평가처리] → 평가 `202611129141879`(3600, 11-30, 648,000)·평가반제 `202611129141885`(3601, 12-01, −648,000), 전표 2건(차 집합투자증권 48,000 / 대 평가이익 48,000, 반제는 반대). 사원 401의 위조 평가 시험 뒤 취소·재처리(아래 ⚠) |
| 메뉴 | #1295 고유자산 > 20. 고유자산 거래처리 > 금융상품 시세관리, #1167 같은 곳 > 금융상품 평가처리. kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 운용 | #1295 (또는 #1167 [시세입력]) | 기준일 → 보유종목 불러오기 → 평가단가 → [저장] | 종목코드·종목유형별 시세(`ast25_price`) |
| 2 | 회계 | #1167 | 평가일자(평가년월) → 탭(시가평가·이자평가) → [조회] | 종목별 보유수량·장부금액·단가·평가금액·평가손익, 평가여부 |
| 3 | 〃 | 〃 | 줄 체크 → [평가처리] → 확인 | 평가 + 다음 영업일 평가반제, 분개 |
| 4 | 〃 | 〃 | 줄 체크 → [평가취소] | 둘 다 지움 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ast25_price` | 시세(기준일·종목코드·단가) | +1 |
| `ast06_tr`·`ast08_tr_finance` | 평가(3600)·평가반제(3601, `ast06_org_tr_id` = 평가) | +2·+2 |
| `act02`·`act03` | 평가 전표·반제 전표 | +2·+2 |

## 업무 규칙 · 주의

- 평가단가는 **거래단위 기준**이다(수익증권 1,000좌). 단가 = 평가금액 ÷ 보유수량 × 거래단위.
- 평가 목록의 거래 ID는 조회 때 `COALESCE(ast06_tr_id, f_create_seq())`로 미리 만든다 — 이 조회는 읽기 전용이 아니어서 ID가 나온다(의심 #108의 같은 모양 후보 중 평가는 문제없음).
- ⚠ [평가처리]가 화면이 보낸 **평가금액·장부금액**을 그대로 써서 손익을 만든다. 사원 401이 평가금액을 99,000,000으로 보내자 평가이익 98,400,000 전표가 생겼다(취소하고 바른 값으로 다시 처리) → [의심 #112](../../보안_및_버그_의심.md)(상).
- `compare` 주의: 원본 서버 `Ast06_Tr.selectEvalList`가 `closeDate` → `holdDate`, `accountId` → `keepAccountId`, `classTreeId` → `astClassTreeId`로 이름을 바꿔 SQL에 넘긴다(yunhee 수정사항062 #1 사례).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: AST-BZ-0009
needs: [AST-BZ-0008]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: PUT /api/v1/ast/prices
    body: { rows: [{ stdDate: "2026-11-30", itemType: "2050", itemCode: KRZ502409562, itemName: PIM서밋전문투자형사모혼합2호 2종 C1, evalPrice: 1080, note: 운용사 기준가 }] }
    expect: { track: { ast25_price: +1 } }
  - no: 2
    api: GET /api/v1/ast/evals?closeDate=2026-11-30&evalType=1
    expect: { rows: 1, first: { price: 1080, amt: 648000 } }
  - no: 3
    api: POST /api/v1/ast/evals/process
    body: { items: [<2의 줄: trId, astClassTreeId, date, trCode 3600, evalType 1, amt 648000, curCode KRW, accountId, qty 600000, trUnit 1000, bookAmt(=financeBookAmt) 600000, forBookAmt>] }
    expect: { track: { ast06_tr: +2, act02_journal: +2 }, pl: 48000 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ast25_Tab_Price`(#1295), `Ast25_Lookup_Price`(selectHoldItem·insert), `Ast06_Tab_EvalFinance`(#1167 E0~E11), `Ast06_TabPage_MarketEval`·`Ast06_TabPage_InterestEval`(retrieve → `Ast06_Tr.selectEvalList` L121 — 파라미터 이름 바꿈), 서버 `Ast06_Tr.updateEval` L920.
- TOBE: `AstPriceController`(`/api/v1/ast/prices`·`/upsert`·`/hold-items`), `AstEvalController`(`/api/v1/ast/evals`·`/process`·`/cancel`), `AstEvalService.process` L65-(금액은 요청 값), `AstEvalMapper.xml` L123·`existsTr` L243(회사 조건 없음)·`updateTr` L254(회사 조건 있음).
</details>
