# AST-BZ-0011 경영관리가 비품을 사고 매달 감가상각한다

> **한 줄 요약** — 비품(PC·노트북·가구 …)을 사면 #1091 고유자산 거래처리에서 **유형자산(비품등) 구입**(5010)으로 등록한다. 종목 대분류가 비품(50)이면 저장할 때 **감가상각 원장**(`ast13_book_depn`) 첫 줄이 같이 생기고 분개는 차 비품·선급부가세 / 대 보통예금이다. 매월 말 #1175 감가상각처리에서 상각년월을 고르면 상각 대상이 나오고 **[처리]**하면 종목의 내용연수·상각방법(정액/정률)으로 당월 상각비를 계산해 거래(5012)·분개(차 감가상각비 / 대 감가상각누계액)·원장 줄을 만든다. #1181 감가상각대장·#1397 비품관리대장에서 취득가·누계·잔액을 본다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리(kalpa 과장 301) |
| 언제 | 구입 때, 매월 말 |
| 먼저 있어야 하는 것 | AST-BZ-0002(비품 종목 — 내용연수·상각방법이 있어야 함), AST-BZ-0001(화면별 거래유형 #1091·#1175), ACT 분개맵핑 |
| 다음 이벤트 | 비품 폐기(5013)·매각(5014) — #1091, ACT 결산 |
| 실제 실행 | kalpa, 2026-11-12, API. ① 노트북 구입 2026-10-15: 종목 `노트북-LG그램 17인치`(5년·정액법), 공급가 2,000,000·세액 200,000, 출금 우리은행 → 거래 `202611129141949`, 원장 +1, 분개 차 비품 2,000,000·선급부가세 200,000 / 대 보통예금 2,200,000. ② 10월 상각(10-31) [처리] → 33,333(= 2,000,000 ÷ 5년 × 1개월 ÷ 12) 거래·전표·원장 줄. ③ 11월 상각(11-30) [처리] → 33,333 거래·전표(차 감가상각비 / 대 감가상각누계액_비품). 상각 대상 AS-IS 1 = 1, 감가상각대장 AS-IS 1 = 1 |
| 메뉴 | #1091 관리회계 > 11. 특수회계처리 > 고유자산 거래처리, #1175 고유자산 > 20. 고유자산 거래처리 > 감가상각처리, #1181 30. 고유자산 현황 > 감가상각대장, #1397 비품관리대장. kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 경영관리 | #1091 | [등록] → 유형자산(비품등) 구입 → 비품 종목 → 공급가·세액 → 출금계좌 → [저장] | 분개·감가상각 원장 첫 줄 |
| 2 | 〃 | #1175 | 상각년월 → [조회] | 상각 대상(취득일·취득가·누계·당월 상각비·상태 미처리) |
| 3 | 〃 | 〃 | 줄 체크 → [처리] / [취소] / 줄 더블클릭 → 불공제세액 | 상각 거래·분개·원장 |
| 4 | 〃 | #1181·#1397 | 기준일 → [조회] | 취득가·당월상각·누계·잔액 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ast06_tr` | 구입(5010)·상각(5012) 10-31·11-30 | +3 |
| `ast13_book_depn` | 감가상각 원장(구입일·10-31) | +2 (11-30분은 아직 — 아래) |
| `act02`·`act06`·`act03` | 전표 3건 | +3 |

## 업무 규칙 · 주의

- 정액법 당월 상각비 = (취득가 + 불공제세액) ÷ 내용연수 × (계산시작월부터 개월 수) ÷ 12 − 누계. 잔액이 1,000원 이하가 되면 비망가액 1,000원을 남긴다.
- 원장(`f_create_depnBook`)은 예금잔고처럼 **오늘(`f_today()`)까지만** 만든다 — 11-30 상각은 거래·전표는 있지만 원장·대장에는 11-30이 지나야 들어간다(그래서 11-30 기준 대장이 누계 33,333으로 보임).
- 원본도 상각비를 서버에서 다시 계산하지만, 기준값(취득가·누계·내용연수·계산시작일)은 화면이 보낸 행 값을 쓴다 — 평가처리 [의심 #112](../../보안_및_버그_의심.md)와 같은 구조(이번엔 시험 안 함).
- 비품 폐기일 `PUT /ast/book-depns/{id}/retire-date`는 로그인 정보가 없는 API다 → [의심 #111](../../보안_및_버그_의심.md).
- 감가상각 상각 대상 조회에도 `COALESCE(ast06_tr_id, f_create_seq())`가 있지만 거래 ID가 정상으로 나왔다([의심 #108](../../보안_및_버그_의심.md)의 같은 모양 후보 — 감가상각은 문제없음).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: AST-BZ-0011
needs: [AST-BZ-0002]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: [PUT /api/v1/ast/trs/intrinsic, POST /api/v1/act/journals/create]
    body: [{ date: "2026-10-15", trCode: "5010", astClassTreeId: <노트북-LG그램 17인치>, contAmt: 2000000, tax: 200000, amt: 2200000, settleMngYn: false,
             depositId: <우리은행>, note: 개발팀 노트북 구입, curCode: KRW, itemLClassCode: "50", itemSClassCode: "505003", selfPur: true, foreign: false }, …]
    expect: { track: { ast06_tr: +1, ast13_book_depn: +1 } }
  - no: 2
    api: [GET /api/v1/ast/depns?depnDate=2026-10-31, POST /api/v1/ast/depns/process]
    body: { items: [<조회 줄: trId, astClassTreeId, date, purTrId, purDate, bookAmt, nonDeductTax, acmDepnCost, depnCost, depnType, depnYear, depnRate, calcStartDate, classTreeName>] }
    expect: { amt: 33333 }
  - no: 3
    api: [GET /api/v1/ast/depns?depnDate=2026-11-30, POST /api/v1/ast/depns/process]
    expect: { amt: 33333 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ast06_Tab_EvalDepn`(#1175 E0~E6, retrieve → `Ast06_Tr.selectDepn` L168, update → `Ast06_Tr.updateDepnEval` L659 — 상각비 계산 L59-150, `ast09_book.createDepnBook` L181, `act02_journal.createJournal` L193), `Ast16_Lookup_NonDeductTax`, `Ast13_Tab_DepnBook`(#1181 `selectByDepnDate2`), DB 함수 `f_create_depnBook`(L103 `ast06_date BETWEEN … AND f_today()`).
- TOBE: `AstDepnController`(`/api/v1/ast/depns`·`/process`·`/{trId}/cost`), `AstDepnService.process`·`calcDepnCost` L90-, `AstBookDepnController`(`/book-depns`·`/depn-books`).
</details>
