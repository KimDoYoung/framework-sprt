# AST-BZ-0013 회계가 외화를 사고 외화 미수를 받고 월말에 외화예금을 환평가한다

> **한 줄 요약** — 외화예금 계좌(종목 소분류 101005, 통화 USD·EUR)에는 원화와 외화 금액이 함께 쌓인다. #1172 계좌이체(외화)로 원화 계좌에서 외화예금으로 환전 이체(외화금액 × 적용환율 = 원화금액)하고, #1171 고유자산 거래처리(외화)·#1365 금융상품 거래처리(외화)로 외화 수익 미수·외화 상품 매수를 등록하면, #1173 미수/미지급(외화)에서 결제할 때 **결제 환율과 장부 환율의 차이가 외환차익·차손** 분개가 된다. 결산 때 #1174 외화예금 환평가처리에서 평가환율(`ast24_fx_rate`, 유형 01)을 넣고 [평가처리]하면 **외화잔고 × 평가환율 − 원화잔고**가 환산손익(3700) 거래·분개가 되고, 다음 날 반제(3701)가 자동으로 생긴다. #1366 금융상품 보유내역(외화)에서 외화 자산 잔고를 본다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 회계·자금관리(kalpa 과장 301) |
| 언제 | 환전·외화 입출금 때 수시, 환평가는 월말(결산) |
| 먼저 있어야 하는 것 | AST-BZ-0002(외화예금 종목 — 통화코드), AST-BZ-0001(화면별 거래유형: `Ast06_Tab_TrForDeposit` 9005, `Ast06_Tab_FxEvalDeposit` 3700·3701, `TrForIntrinsic`·`AccruedForIntrinsic`·`TrForFinance` — 회사 0엔 일부 없음 #110), ACT 분개맵핑 |
| 다음 이벤트 | ACT 결산·재무제표 |
| 실제 실행 | kalpa, 2026-11-14, API. ⓪ 11-13에 이미 있던 것: USD 10,000 환전(@1,400), 외화 발행어음 USD 5,000 매수(3104), 외화예금 이자 USD 20 미수(3213, 11-13 결제 완료), 외화 사무관리보수 USD 100 미수(1001), 11-13 환평가 149,800·11-14 반제. ① 평가환율 USD 2026-11-14 1,435 등록. ② #1172 `신한은행#011` → `신한외화예금(USD)` USD 2,000 × 1,435 = 2,870,000 → 거래 `202611149149991`, 분개 차 외화예금(3101050000) / 대 보통예금(3101030000) 2,870,000, 원장 USD 5,020 → 7,020. ③ #1173 사무관리보수 미수 USD 100(장부 @1,430 = 143,000)을 @1,435로 결제 → 결제 `202611149150006`, 분개 차 외화예금 143,500 / 대 미수금 143,000 · **외화환차이익(0106010000) 500**. ④ #1174 [평가처리] → USD 7,120 × 1,435 = 10,217,200 − 원화잔고 10,042,300 = **환산이익 174,900**(거래 `202611149150015`, 분개 차 외화예금 / 대 외화환산이익 0106020000), 11-15 반제 `202611149150020` 자동. AS-IS 비교: 환평가 목록 1 = 1, 외화 보유내역 1 = 1, 외화 계좌이체 2 = 2 |
| 메뉴 | #1171 관리회계 > 12. 특수회계처리(외화) > 고유자산 거래처리(외화), #1172 계좌이체(외화), #1173 미수/미지급(외화), #1365 고유자산 > 20. 고유자산 거래처리 > 금융상품 거래처리(외화), #1366 30. 고유자산 현황 > 금융상품 보유내역(외화), #1174 관리회계 > 20. 결산 > 외화예금 환평가처리. kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 회계 | #1172 | [등록] → 일자·출금계좌(원화)·입금계좌(외화)·적용통화·적용환율·외화금액(원화금액 자동 = 외화 × 환율)·수수료·적요 → [저장] | 이체 거래·분개 자동 생성, 외화예금 원장 |
| 2 | 〃 | #1171 / #1365 | 외화 수익·비용 미수/미지급, 외화 금융상품 매수·매도 등록(통화·환율·외화금액) | 거래·분개 (11-13 기존 거래로 확인) |
| 3 | 〃 | #1173 | 미수/미지급 줄 → [결제] → 결제일·외화 결제금액·적용환율(원화 결제금액 자동)·입금계좌 → [저장] | 결제 내역, 분개(환율 차이는 외환차익·차손) |
| 4 | 〃 | #1174 | 평가년월(일) → [환율] 창에서 통화별 평가환율 [저장] → [조회] | 외화예금 계좌별 외화잔고·원화잔고·평가환율 |
| 5 | 〃 | 〃 | 줄 체크 → [평가처리] / [평가취소] | 환산손익 거래·분개, 다음 날 반제 거래·분개, 원장 환산손익 |

**순서 주의**: 환평가는 그날 외화 거래를 모두 넣은 **뒤** 한다. 평가 뒤 같은 날·이전 날짜 외화 거래를 넣으면 예금잔고정리가 막혀 원장이 틀어진다([의심 #118](../../보안_및_버그_의심.md)) — [평가취소] → 거래 → [평가처리] 순서로 다시 한다.

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ast24_fx_rate` | 평가환율(유형 01, USD, 2026-11-14 1,435) | +1 |
| `ast06_tr` | 이체 9005, 환평가 3700(11-14)·반제 3701(11-15) | +3 |
| `ast07_settle` | 외화 미수 결제(USD 100 @1,435) | +1 |
| `act02`·`act06`·`act03` | 이체·결제·환평가·반제 전표 4건 | +4 |
| `ast09_book` | 외화예금 11-14 원장: USD 7,120 · 원화 10,042,300 · 평가 10,217,200 · 환산손익 174,900 | 갱신 |

## 업무 규칙 · 주의

- 원화금액 = `(long)(외화금액 × 적용환율)`(소수 버림) — 이체·결제 창 모두 같다.
- 환산손익 = `(long)(외화잔고 × 평가환율) − 원화잔고`. 다음 날 같은 금액의 반제(3701) 거래·분개가 자동으로 생겨 다음 달 원장은 원래 원화잔고로 돌아간다. 처리일 이후 환평가가 있으면 "처리일 이후 환평가내역이 존재합니다. 취소 후 진행하세요".
- **TOBE에서 [평가처리]가 안 된다**: 조회가 미평가 줄의 거래 ID를 `f_create_seq()`로 만드는데 읽기 전용 트랜잭션이라 null이 오고, 처리가 "평가 대상이 올바르지 않습니다."로 거절한다. 이번 실행은 ID를 직접(`yunhee sql "select f_create_seq()" --rollback`) 넣어 처리했다 → [의심 #108 보강](../../보안_및_버그_의심.md).
- 평가 손익을 화면이 보낸 외화·원화 잔고로 계산하고 평가환율도 사원이 고칠 수 있다 → [의심 #117](../../보안_및_버그_의심.md)(#112와 같은 구조).
- **DB 상태 주의**: 11-12에 AST-BZ-0006·0010·0011로 만든 kalpa 거래(`202611129141725` 등)가 11-14에는 DB에 없다. kalpa 고유자산 분류·계좌도 11-13 ID(`20261113…`)로 바뀌어 있고 외화·펀드보수·선급 거래가 들어 있다 — 11-13에 DB가 바뀐 것으로 보인다(누가 넣었는지 기록 없음). 앞 이벤트 문서의 거래 ID는 지금 DB와 맞지 않는다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: AST-BZ-0013
needs: [AST-BZ-0002]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: [PUT /api/v1/ast/fx-rates]
    body: { items: [{ fxRateId: null, fxRateType: "01", curCode: USD, stdDate: "2026-11-14", applyFxRate: 1435, note: "11-14 매매기준율" }] }
  - no: 2
    api: [PUT /api/v1/ast/trs/deposits, POST /api/v1/ast/trs/deposits/{trId}/sell-book-amt, POST /api/v1/act/journals/create, POST /api/v1/ast/books/deposits/clean]
    body: [{ date: "2026-11-14", astClassTreeId: <신한은행#011>, depositId: <신한외화예금(USD)>, amt: 2870000, fee: 0, curCode: USD, fxRate: 1435, forAmt: 2000, note: "외화 환전 USD 2,000" },
           { actionName: NEW }, { trId: <거래>, trCode: "9005", procType: P, exceptYn: true }, { stdDate: "2026-11-14" }]
    expect: { journal: { D: { 3101050000: 2870000 }, C: { 3101030000: 2870000 } } }
  - no: 3
    api: [POST /api/v1/ast/settles, POST /api/v1/ast/books/deposits/clean]
    body: { trId: <외화 미수 USD 100 @1430>, settleDate: "2026-11-14", depositId: <신한외화예금(USD)>, trCode: "9002", settleAmt: 143500, forAmt: 100, forSettleAmt: 100, fxRate: 1435 }
    expect: { journal: { D: 143500, C: [143000, 500 외환차익] } }
  - no: 4
    api: [GET /api/v1/ast/fx-evals?closeDate=2026-11-14, POST /api/v1/ast/fx-evals/process]
    body: { items: [<조회 줄 — trId는 쓰기 트랜잭션의 f_create_seq() (#108)>] }
    expect: { amt: 174900, back: { date: "2026-11-15", trCode: "3701", amt: -174900 } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ast06_Tab_TrForDeposit`·`Ast06_Lookup_TrForDeposit`(#1172 preUpdate L325-373 → update L375 → createJournal L396-434 `updateDepositSellBookAmt` → `Act02_Journal.createJournal` → success L436 `updateDeposit`), `setKorAmt` L255-269. `Ast06_Tab_AccruedForIntrinsic`·`Ast07_Lookup_ForSettle`(#1173 `Ast07_Settle.update` L169, `updateDeposit` 결과 안 봄). `Ast06_Tab_FxEvalDeposit`(#1174 `Ast06_Tr.selectFxEvalList` L152·`updateFxEval` L1142, `Ast24_Lookup_FxRate`). `Ast09_Tab_FinanceForBook`(#1366 `ast09_book.selectByHoldDate`, abroType 2).
- TOBE: `AstTrDepositController`(`/api/v1/ast/trs/deposits`·`/{trId}/sell-book-amt`), `AstSettleController` `POST /api/v1/ast/settles`, `AstFxEvalController`(`/fx-evals`·`/process`·`/cancel`), `AstFxRateController`(`/fx-rates`), `AstFxEvalService.updateFxEval` L70-130, `AstFxEvalMapper.xml` `selectFxEvalList` L74(`COALESCE(ast06_tr_id, f_create_seq())` L76), 프론트 `Ast06_Lookup_TrForDeposit.tsx` L100-143·`Ast07_Lookup_ForSettle.tsx` L96-117.
</details>
