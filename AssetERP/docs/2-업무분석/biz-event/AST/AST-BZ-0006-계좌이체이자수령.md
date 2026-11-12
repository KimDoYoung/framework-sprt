# AST-BZ-0006 자금관리가 회사 계좌끼리 이체하고 예금 이자를 받는다

> **한 줄 요약** — 자금관리 담당이 #1166 계좌이체에서 [등록] → **출금계좌·입금계좌·금액·수수료**를 넣어 [저장]하면 거래(`ast06_tr`, 거래유형 9005)가 생기고, 화면이 이어서 **분개**(차 보통예금(입금) / 대 보통예금(출금))와 **예금잔고 정리**를 부른다. 예금 이자는 #1472(#1205) 예금/예치금 이자수령에서 계좌·이자·법인세·지방세를 넣으면 실수령액(이자 − 세금)이 계산되고(거래유형 3212) 분개(차 보통예금·선급법인세·선급지방세 / 대 이자수익)가 생긴다. 둘 다 예금잔고(AST-BZ-0004)에 바로 반영된다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 자금관리(kalpa 과장 301) |
| 언제 | 수시(이체), 결산일(이자) |
| 먼저 있어야 하는 것 | AST-BZ-0002(회사 계좌 둘 이상), AST-BZ-0001(거래유형 9005·3212), ACT 분개맵핑 |
| 다음 이벤트 | AST-BZ-0004(예금잔고) |
| 실제 실행 | kalpa, 2026-11-12, API. ① 이체: `신한은행#011` → `우리은행 1002-555-000111(칼파 운영)` 5,000,000(수수료 0, 적요 "운영자금 이체") → 거래 `202611129141725` → 분개 생성(임시 2·분개 1) → [예금잔고정리] `ast09_book` +2. ② 이자: 우리은행 이자 12,000·법인세 1,680·지방세 160 → 거래 `202611129141751`(실수령 10,160) → 분개 임시 4줄(8888 보통예금 D 10,160 · 1900 선급법인세 D 1,680 · 1901 선급지방세 D 160 · 4700 이자수익 C 12,000)·분개 3줄 |
| 메뉴 | #1166 관리회계 > 11. 특수회계처리 > 계좌이체, #1472 고유자산 > 40. 예금관리 > 예금/예치금 이자수령(#1205 같은 화면). kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 자금관리 | #1166 | [등록] → 일자·출금계좌·입금계좌(계좌 조회창)·금액·수수료·적요 → [저장] | 저장 → 분개 생성 → 예금잔고 정리가 이어서 돈다. 아래 분개 그리드 |
| 2 | 〃 | 〃 | 줄의 [변경] → 고쳐 [저장] / [분개재생성] / 체크 → [삭제] | 승인된 전표면 저장·삭제 거절, 회계마감일 이전도 거절 |
| 3 | 〃 | #1472 | [등록] → 일자·계좌·이자·법인세·지방세 → [저장] | 실수령액 = 이자 − 법인세 − 지방세. 분개·예금잔고 정리 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ast06_tr` | 이체(9005)·이자(3212) 거래 | +2 |
| `ast08_tr_finance` | 이자 거래의 금융 정보 | +1 |
| `act02_journal`·`act06_journal_tmp`·`act03_journal_dtl` | 거래 전표(`act02_tr_id` = 거래 ID) | +2·+6·+4 |
| `ast09_book` | 예금잔고(두 계좌, 오늘) | +2(이후 다시 정리) |

## 업무 규칙 · 주의

- 저장(`PUT /ast/trs/deposits`) · 분개(`POST /act/journals/create` procType P) · 예금잔고 정리(`POST /ast/books/deposits/clean`)는 **화면이 차례로 부르는 세 API**다. API를 하나만 부르면 분개나 잔고가 빠진다(TOBE 서비스 주석과 같음).
- 출금 장부금액 = 금액 + 수수료. 외화 계좌이체는 #1172(AST-BZ-0013).
- 계좌이체 목록은 그 계좌의 담당자·담당 부서만 본다. kalpa는 [가져오기]가 모든 부서를 담당으로 넣어 사원 401도 본다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: AST-BZ-0006
needs: [AST-BZ-0002]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: [PUT /api/v1/ast/trs/deposits, POST /api/v1/act/journals/create, POST /api/v1/ast/books/deposits/clean]
    body: [{ date: "2026-11-12", astClassTreeId: <신한은행#011>, depositId: <우리은행>, amt: 5000000, fee: 0, note: 운영자금 이체 },
           { trId: <1>, trCode: "9005", procType: P, exceptYn: true }, { stdDate: "2026-11-12" }]
    expect: { track: { ast06_tr: +1, act03_journal_dtl: +1, ast09_book: +2 } }
  - no: 2
    api: [PUT /api/v1/ast/trs/finance/deposit-int, POST /api/v1/act/journals/create, POST /api/v1/ast/books/deposits/clean]
    body: [{ date: "2026-11-12", astClassTreeId: <우리은행>, intAmt: 12000, corpTax: 1680, localTax: 160, note: 11월 보통예금 결산이자 },
           { trId: <2>, trCode: "3212", procType: P, exceptYn: true }, { stdDate: "2026-11-12" }]
    expect: { db: { ast06_amt: 10160 }, track: { act06_journal_tmp: +4, act03_journal_dtl: +3 } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ast06_Tab_TrDeposit`(#1166 E0~E7), `Ast06_Lookup_TrDeposit`(preUpdate L306-346, update L348-367, createJournal L369-390, success L392-426 → `Ast06_Tr.updateDeposit` → `createDepositBook`), `Ast06_Tab_TrDepositInt`(#1472·#1205), 서버 `Ast06_Tr.update` L333·`updateDeposit` L491·`deleteTrDeposit` L1391, `Act02_Journal.createJournal` L73.
- TOBE: `AstTrDepositController`(`/api/v1/ast/trs/deposits`), `AstTrDepositService.save` L55-79, `AstTrFinanceController` `PUT /api/v1/ast/trs/finance/deposit-int`, `ActJournalController` `POST /api/v1/act/journals/create`, `AstBookController` `POST /deposits/clean`.
</details>
