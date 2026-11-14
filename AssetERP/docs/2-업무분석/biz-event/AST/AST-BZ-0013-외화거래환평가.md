# AST-BZ-0013 경영관리가 외화 거래를 하고 월말에 외화예금을 환평가한다

> **한 줄 요약** — 외화예금(USD)을 가진 회사가 ① 원화 계좌에서 외화 계좌로 **환전 이체**하고(#1172, 원화 14,000,000 → USD 10,000, 환율 1,400) ② 외화 금융상품을 사고(#1365, 외화 발행어음 USD 5,000) ③ 외화 이자·보수의 **미수/미지급**을 만들어 받는다(#1171 → #1173, 결제 때 환율이 다르면 **외화환차손익**이 분개에 붙는다). 월말(또는 결산일)에 #1174에서 **평가환율**을 넣고 [평가처리]하면 `외화잔고 × 평가환율 − 원화 장부`만큼 **환산손익**(거래 3700)이 분개되고 **다음 날 반제분개**(3701)가 자동으로 생긴다. #1366은 외화 금융상품 보유내역이다. 어느 줄에서든 외화 거래는 `curCode`(통화)·`fxRate`(적용환율)·`forAmt`(외화금액)·`amt`(원화금액)를 같이 저장한다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리(kalpa 과장 301). 거래유형·회계 기초는 KFS 관리자 |
| 언제 | 외화 거래 때, 월말·결산일 환평가 |
| 먼저 있어야 하는 것 | AST-BZ-0001(거래유형·화면별 거래유형), AST-BZ-0002(외화예금 계좌 — 회사 0 분류에 `신한외화예금(USD)` 포함), ACT 회계 기초(대표계정·실계정맵·분개맵핑 — PAY-BZ-0012의 0단계), #1174 환율(`ast24_fx_rate`) |
| 다음 이벤트 | 결산(ACT), 외화 금융상품 매도·상환(#1365 3204·3209) |
| 실제 실행 | kalpa, 2026-11-13, API(과장 301). ⚠ **kalpa의 AST·ACT 기초가 DB 복원으로 모두 사라져 있어(거래유형·분류·분개맵핑·거래 0건) 먼저 다시 만들었다** — KFS 관리자로 거래유형 89·화면별 거래유형 46·대표계정 65·실계정맵 214·분개맵핑 82를 회사 0에서 복사, 회사 관리자 [가져오기]로 분류 176, 301이 `우리은행 1002-555-000111(칼파 운영)` 등록. 그 위에서 ① 환율 USD 1,430(11-13) ② 환전 이체 `202611139070920`(우리은행 → 신한외화예금(USD), 14,000,000 = USD 10,000 × 1,400) → 분개 차 외화예금 / 대 보통예금, 예금원장 USD 10,000(장부 14,000,000) ③ 환평가 11-13 USD 10,000 × 1,430 → 3700 +300,000(차 외화예금 / 대 외화환산이익 0106020000), 11-14 3701 −300,000 반제 → [평가취소]로 거래·분개·원장 환산손익이 모두 되돌아감 → 다시 처리 ④ 외화 발행어음 매수(3104) USD 5,000 × 1,430 = 7,150,000 `202611139070957` → 외화예금 잔고 USD 5,000(장부 7,000,000 = 평균 1,400) → 환평가 +150,000 ⑤ 외화예금 이자(3213) USD 20 미수 `…70973`, 사무관리보수(1001) USD 100 미수 `…70978` → #1173 목록 2줄 → 이자를 환율 1,440에 **결제** → 분개 차 외화예금 28,800 / 대 미수금 28,600 + 외화환차이익 200 → 예금원장 USD 5,020(장부 7,028,800) ⑥ 최종 환평가 5,020 × 1,430 − 7,028,800 = **+149,800**. AS-IS 매퍼 대조: 환평가 목록(계좌 조건 유·무) 1 = 1, 금융상품 보유(외화) 1 = 1, 미수/미지급(외화) 2 = 2 |
| 메뉴 | #1171 관리회계 > 12. 특수회계처리(외화) > 고유자산 거래처리(외화), #1172 계좌이체(외화), #1173 미수/미지급(외화), #1365 고유자산 > 20. 고유자산 거래처리 > 금융상품 거래처리(외화), #1366 30. 고유자산 현황 > 금융상품 보유내역(외화), #1174 외화예금 환평가처리. kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 0 | KFS 관리자 | #1165 등 | 회사 거래유형·화면별 거래유형·회계 기초 복사(회사마다 한 번) | 거래유형 조회창에 외화 유형(3104 해외금융상품 매수 …)이 나옴 |
| 1 | 경영관리 | #1174 [환율입력] | 기준일·통화(USD)·적용환율 → 저장 | `ast24_fx_rate` 줄 |
| 2 | 〃 | #1172 | [등록] → 출금계좌(원화) · 입금계좌(외화) · 적용통화 · 환율 · 외화이체금액 → [저장] | 원화금액 자동 계산, 거래·분개(차 외화예금 / 대 보통예금), 예금잔고 정리 |
| 3 | 〃 | #1365 | [등록] → 해외금융상품 매수(3104) · 종목 · 보관계좌 · 출금(외화)계좌 · 수량·단가 · 적용환율 · 외화 거래금액 → [저장] | 거래·분개·외화 금융 보유원장 |
| 4 | 〃 | #1171 | [등록] → 거래유형(외화예금 이자수령 등) · 통화 · 환율 · 외화금액 · [미수/미지급] 선택 | 거래·분개, 미수/미지급이면 #1173에 나옴 |
| 5 | 〃 | #1173 | 줄 선택 → [결제등록] → 결제일 · 예금계좌 · 외화 결제금액 · 적용환율 | 결제 분개(환율이 다르면 외화환차손익 줄) |
| 6 | 〃 | #1174 | 평가년월·보관처 → [조회] → 평가환율 → [평가처리] (또는 [평가취소]) | 환산손익 거래(3700)·분개, 다음 날 반제(3701) |
| 7 | 〃 | #1366 | 보유일자 → [조회] | 외화 금융상품 보유(외화 장부금액·수량·원화 장부금액) |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ast24_fx_rate` | 평가환율 | +1 (USD 11-13 1,430) |
| `ast06_tr` | 환전 9005 · 해외금융상품 매수 3104 · 외화이자 3213 · 보수 1001 · 환평가 3700(+3701 다음 날 반제) | 최종 6줄(평가 취소·재처리한 줄은 사라짐) |
| `ast07_settle` | 외화 이자 결제(외화 20, 원화 28,800, 환율 1,440) | +1 (원거래 원화 28,600 → 환차익 200) |
| `ast08_tr_finance` | 외화 금융상품 거래(통화·외화금액) | +1 |
| `ast09_book` | 예금원장(외화 수량·원화 장부·`fx_pl` 환산손익), 금융 보유원장 | USD 예금 5,020 / 장부 7,028,800 / 환산손익 149,800, 어음 5,000 / 7,150,000 |
| `act02_journal`·`act03_journal_dtl` | 거래마다 전표 | 환전 1줄, 매수 1줄, 이자 1줄, 결제 2줄(차 28,800 / 대 28,600 + 환차익 200), 환평가 1줄 + 반제 1줄 |

## 업무 규칙 · 주의

- **평가손익 = (long)(외화잔고 × 평가환율) − 예금 원화장부.** 예금 장부는 외화 계좌의 평균 장부단가(원화 ÷ 외화)로 흐른다 — 환전 시 1,400으로 들어왔으니 USD 5,000을 쓰면 장부 7,000,000이 나가고(매수 분개는 거래 환율 1,430 × 5,000 = 7,150,000으로 잡힌다) 그 차이 150,000은 **평가 때** 환산이익으로 인식된다.
- **환평가 뒤에는 그날 이후의 예금 거래를 정리할 수 없다.** 평가(3700)가 있으면 예금잔고정리가 "처리(취소)일 이후 환평가내역이 존재합니다. 환평가취소 후 진행하세요"로 막히고(예금원장 정리 `POST /ast/books/deposits/clean`), 평가 뒤에 같은 날 거래를 넣으려면 [평가취소] → 거래 → [평가처리]를 다시 해야 한다. 월말에 **맨 마지막**에 평가하는 이유다. 반제(3701)는 다음 날짜로 들어가므로 환평가일이 오늘이어도 `내일 날짜` 거래가 생긴다.
- (코드로 확인, 시험은 안 함) 미래일 평가는 막힌다("평가일이 미래일입니다."). 이미 평가한 줄을 다시 평가하면 "선택한 내역중 평가완료된 내역이 존재합니다.", 취소는 미평가 줄이면 "선택한 내역중 미평가 내역이 존재합니다." — 서버도 같다.
- #1173 미수/미지급(외화)은 **수령/지급 콤보 값을 보내야** 한다. 서버 기본은 지급(02) 고정이라 수령(01) 미수를 보려면 `payCode`(전체 `%`)를 보내야 줄이 나온다(화면은 보낸다). 또 목록에는 분개에 **대표계정 12·22(미수금·미지급금 계열)**가 들어간 거래만 나온다 — 외화이자 3213은 분개가 미수금(3801610000, 대표 1200)을 써서 나오고, 분개맵핑이 없으면 거래는 있는데 목록에 안 나온다.
- #1365·#1171에서 거래유형을 고르려면 화면별 거래유형(`ast15`)에 `Ast06_Tab_TrForFinance`·`Ast06_Tab_TrForIntrinsic`이 있어야 하는데 **회사 0 기초에는 이 두 화면이 없다** → [의심 #117](../../보안_및_버그_의심.md). kalpa에는 회사 28000 기준(해외금융상품 매수·매도·상환 등)으로 KFS 관리자가 넣었다.
- ⚠ 환평가 목록의 `trId`가 **null**로 나와 [평가처리]가 400 "평가 대상이 올바르지 않습니다."가 된다 → [의심 #116](../../보안_및_버그_의심.md) (#108과 같은 원인). 이 시험은 `trId`를 직접 정해 보내서 이었다.
- 환율·환평가 API는 메뉴 권한을 보지 않는다 → [의심 #118](../../보안_및_버그_의심.md).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: AST-BZ-0013
needs: [AST-BZ-0001, AST-BZ-0002]
steps:
  - no: 0
    actor: { company: admin, user: admin, password: "1111" }
    api: [POST /api/v1/ast/tr-codes/init-data, PUT /api/v1/ast/tr-code-windows, POST /api/v1/act/repr-accounts/init-data, POST /api/v1/act/real-account-maps/init-data, POST /api/v1/act/tr-maps/init-data]
    body: { companyIds: [<kalpa>], <회사 0 기준 전부>, windows: [Ast06_Tab_TrForFinance: [3104, 3204, 3209], Ast06_Tab_TrForIntrinsic: [1001, 1002, 1003, 3213, 9922, 9923]] }
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: PUT /api/v1/ast/fx-rates
    body: { items: [{ stdDate: "2026-11-13", curCode: USD, applyFxRate: 1430, note: 11월 평가환율 }] }
    expect: { track: { ast24_fx_rate: +1 } }
  - no: 2
    api: [PUT /api/v1/ast/trs/deposits, POST /api/v1/ast/trs/deposits/{trId}/sell-book-amt, POST /api/v1/act/journals/create, POST /api/v1/ast/books/deposits/clean]
    body: [{ date: "2026-11-13", astClassTreeId: <우리은행>, depositId: <신한외화예금(USD)>, amt: 14000000, fee: 0, curCode: USD, fxRate: 1400, forAmt: 10000 },
           { actionName: NEW }, { trId: <1>, trCode: "9005", procType: P, exceptYn: true }, { stdDate: "2026-11-13" }]
    expect: { journal: { 차 외화예금 14000000 / 대 보통예금 14000000 }, book: { 외화예금: { holdQty: 10000, bookAmt: 14000000 } } }
  - no: 3
    api: [PUT /api/v1/ast/trs/finance, POST /api/v1/act/journals/create, POST /api/v1/ast/books/deposits/clean]
    body: [{ date: "2026-11-13", trCode: "3104", astClassTreeId: <퍼스트 외화 발행어음 수시(USD)>, corpId: <한국투자증권>, accountId: <한투#2688(USD)>, depositId: <신한외화예금(USD)>,
             settleMngYn: false, qty: 5000, price: 1, trAmt: 7150000, amt: 7150000, fee: 0, curCode: USD, detail: false, foreign: true, fxRate: 1430, forTrAmt: 5000 }, …]
    expect: { book: { 외화예금: { holdQty: 5000, bookAmt: 7000000 }, 어음: { holdQty: 5000, bookAmt: 7150000 } } }
  - no: 4
    api: [PUT /api/v1/ast/trs/intrinsic, POST /api/v1/act/journals/create, GET /api/v1/ast/settles/accrueds?abroType=2&payCode=%, POST /api/v1/ast/settles, POST /api/v1/ast/books/deposits/clean]
    body: [{ date: "2026-11-13", trCode: "3213", corpId: <신한은행>, astClassTreeId: <신한외화예금(USD)>, contAmt: 28600, amt: 28600, settleMngYn: true, curCode: USD, foreign: true, fxRate: 1430, forAmt: 20 }, …,
           { trId: <3213 거래>, settleDate: "2026-11-13", depositId: <신한외화예금(USD)>, trCode: "9002", settleAmt: 28800, forAmt: 20, forSettleAmt: 20, fxRate: 1440 }]
    expect: { accrueds: 2, journal: { 차 외화예금 28800 / 대 미수금 28600, 외화환차이익 200 }, book: { 외화예금: { holdQty: 5020, bookAmt: 7028800 } } }
  - no: 5
    api: [GET /api/v1/ast/fx-evals?closeDate=2026-11-13, POST /api/v1/ast/fx-evals/process, POST /api/v1/ast/fx-evals/cancel]
    body: { items: [{ trId: <직접 정한 ID — 조회의 trId는 null(의심 #116)>, astClassTreeId: <외화예금>, depositId: <외화예금>, date: "2026-11-13", trCode: "3700", curCode: USD, fxRate: 1430, forAmt: 5020, depositBookAmt: 7028800, corpId: <신한은행>, evalYnName: "" }] }
    expect: { amt: 149800, next_day: { trCode: "3701", amt: -149800 } }
  - no: 6
    api: GET /api/v1/ast/books/finance?holdDate=2026-11-13&abroType=2
    expect: { rows: 1, first: { curCode: USD, holdQty: 5000, bookAmt: 7150000 } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ast06_Tab_FxEvalDeposit`(#1174, 서버 `Ast06_Tr.selectFxEvalList` L152·`updateFxEval` L1142 — 평가거래 3700 생성, 평가분개 `act02_journal.createJournal`, 반제분개 `createBackJournal`(3701), 예금원장 `ast09_book` 환산손익), `Ast24_Lookup_FxRate`(`ast24_fx_rate`), `Ast06_Lookup_TrForDeposit`(#1172 X10, `Ast06_Tr.updateDepositSellBookAmt`), `Ast06_Tab_TrForFinance`·`Ast06_Lookup_TrForFinance`(#1365 W07 `updateFinance`), `Ast06_Tab_TrForIntrinsic`·`Ast06_Lookup_TrForIntrinsic`(#1171 X08), `Ast06_Tab_AccruedForIntrinsic`·`Ast07_Lookup_ForSettle`(#1173 X04·X09, `Ast06_Tr.selectByAccrued`·`Ast07_Settle.insert`), `Ast09_Tab_FinanceForBook`(#1366 `ast09_book.selectByHoldDate`).
- TOBE: `AstFxEvalController`·`AstFxEvalService`(`process`·`cancel`·`updateFxEval` L70-130, 환율 `AstFxRateController`), `AstTrDepositService.saveForeign`·`updateSellBookAmt` L85-145, `AstTrFinanceService`(`foreign`·`forTrAmt`), `AstTrIntrinsicService`(`foreign`), `AstSettleService.searchAccrueds`·`createSettle`, `AstBookController`(`/books/finance?abroType=2`), 매퍼 `AstFxEvalMapper.xml`(L76 `COALESCE(ast06_tr_id, f_create_seq())`)·`AstSettleMapper.xml`·`AstBookMapper.xml`, 화면 `Ast06_Tab_FxEvalDeposit.tsx`·`Ast06_Lookup_TrForDeposit.tsx`·`Ast06_Tab_TrForFinance.tsx`·`Ast06_Lookup_TrForIntrinsic.tsx`·`Ast07_Lookup_ForSettle.tsx`·`Ast09_Tab_FinanceForBook`.
</details>
