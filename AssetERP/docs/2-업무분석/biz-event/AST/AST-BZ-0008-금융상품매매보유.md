# AST-BZ-0008 운용담당이 금융상품을 사고팔고 보유내역을 본다

> **한 줄 요약** — 회사 돈으로 주식·채권·펀드(수익증권)·RP 등을 사고팔면 운용담당이 #1158 금융상품 거래처리에서 **거래유형**(3101 매수 · 3201 매도 · 3210 상환 · 3211 이자수령 …)·**종목**·**보관계좌**(증권사 예치금 계좌와 그 거래처)·수량·단가·거래금액·출금(입금)계좌를 넣어 [저장]한다. 화면이 이어서 분개와 예금잔고 정리를 부른다. 매수는 차 금융자산 / 대 보통예금, 매도는 장부금액을 줄이고 차액을 처분손익으로 잡는다. 보유 수량·장부금액은 **보유원장**(`ast09_book`, 금융자산 astType 2)에 바로 반영되어 #1160 금융상품 보유내역에 나온다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 운용·자금관리(kalpa 과장 301) |
| 언제 | 수시 |
| 먼저 있어야 하는 것 | AST-BZ-0002(종목 — 금융상품 분류·종목, 보관계좌(예치금 종목)·출금계좌), AST-BZ-0001(화면별 거래유형 11개), ACT 분개맵핑 |
| 다음 이벤트 | AST-BZ-0009(시세·평가), AST-BZ-0004(예금잔고) |
| 실제 실행 | kalpa, 2026-11-12, API. ① 매수 3101: 종목 `PIM서밋전문투자형사모혼합2호 2종 C1`(수익증권) 1,000,000좌 × 1 = 1,000,000, 보관 `미래에셋증권163`, 출금 우리은행 → 거래 `202611129141854`(`ast08_tr_finance` +1, 보유원장 +1) → 분개 차 당기손익-공정가치측정증권_기타집합투자증권 1,000,000 / 대 보통예금 1,000,000 → #1160 보유 1줄(AS-IS 1 = 1). ② 매도 3201: 400,000좌 × 1.05 = 420,000 → 거래 `202611129141865` → 분개 차 보통예금 420,000 / 대 집합투자증권 400,000·처분이익 20,000 → 보유 600,000좌·장부 600,000. #1208 계좌대체·#1239 기간조회·#1300 운용내역은 `대기` |
| 메뉴 | #1158 고유자산 > 20. 고유자산 거래처리 > 금융상품 거래처리, #1160 30. 고유자산 현황 > 금융상품 보유내역. kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 운용 | #1158 | 거래유형 칸 → 금융상품 매수 → [등록] | 거래 창 |
| 2 | 〃 | 거래 창 | 종목(매도는 보유원장 조회창에서 — 보유수량·장부금액이 채워짐) → 보관계좌(계좌 조회창, 거래처가 같이 들어옴) → 수량·단가·거래금액·수수료·세금 → 출금(입금)계좌 또는 미수/미지급 → [저장] | 분개 자동 생성·예금잔고 정리 |
| 3 | 〃 | #1158 | 줄 선택 → 아래 결제·분개 / [변경]·[분개재생성]·[삭제] / [엑셀다운로드] | |
| 4 | 〃 | #1160 | 보유일자 → [조회] | 종목·보관계좌별 수량·장부금액(·평가) |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ast06_tr` | 매수·매도 거래 | +2 |
| `ast08_tr_finance` | 수량·단가·보관계좌·세금·이자 | +2 |
| `ast09_book` | 금융자산 보유원장(종목 × 보관계좌) | +1(매도 뒤 600,000) |
| `act02`·`act06`·`act03` | 전표 2건 | +2 |

## 업무 규칙 · 주의

- 필수: 일자·거래유형·종목·거래처(보관계좌의 거래처)·(미수/미지급이 아니면) 예금계좌.
- 매도의 경과이자는 보유 경과이자를 보유수량 대비 거래수량으로 안분해 보낸다(화면 계산, AS-IS preUpdate2 L849-874).
- 보관계좌 `미래에셋증권163`의 거래처는 [가져오기]로 복사된 회사 28000의 거래처다([의심 #106](../../보안_및_버그_의심.md)).
- 도메인 시작 점검(`yunhee biz-endpoints ast`): 로그인 정보 인자가 아예 없는 API가 16개 — 그중 거래 적요 수정 `PUT /ast/trs/{trId}/note`로 kalpa 사원이 회사 28000 거래를 고칠 수 있었다(같은 값) → [의심 #111](../../보안_및_버그_의심.md)(상).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: AST-BZ-0008
needs: [AST-BZ-0002]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: [PUT /api/v1/ast/trs/finance, POST /api/v1/act/journals/create, POST /api/v1/ast/books/deposits/clean]
    body: [{ date: "2026-11-12", trCode: "3101", astClassTreeId: <PIM서밋…C1>, corpId: <미래에셋 거래처>, accountId: <미래에셋증권163>, depositId: <우리은행>,
             settleMngYn: false, qty: 1000000, price: 1, trAmt: 1000000, amt: 1000000, fee: 0, note: 사모펀드 가입, curCode: KRW, detail: true }, …]
    expect: { track: { ast06_tr: +1, ast08_tr_finance: +1, ast09_book: +1 } }
  - no: 2
    api: GET /api/v1/ast/books/finance?holdDate=2026-11-12
    expect: { rows: 1, first: { holdQty: 1000000, bookAmt: 1000000 } }
  - no: 3
    api: [PUT /api/v1/ast/trs/finance, POST /api/v1/act/journals/create]
    body: [{ trCode: "3201", qty: 400000, price: 1.05, trAmt: 420000, amt: 420000, note: 사모펀드 일부 환매, … }, …]
    expect: { journal: { 처분이익: 20000 }, holdQty: 600000 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ast06_Tab_TrFinance`(#1158 E0~E10), `Ast06_Lookup_TrFinance`(preUpdate L786-847, preUpdate2 L849-874, update L876-897), `Ast09_Lookup_Book`, 서버 `Ast06_Tr.updateFinance`, `Ast09_Tab_FinanceBook`(#1160 retrieve → `ast09_book.selectByHoldDate` astType 2).
- TOBE: `AstTrFinanceController`(`PUT /api/v1/ast/trs/finance`), `AstBookController`(`GET /api/v1/ast/books/finance`), `AstTrController` L127-131(`PUT /trs/{trId}/note`, `UserPrincipal` 없음).
</details>
