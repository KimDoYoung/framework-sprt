# AST-BZ-0015 경영관리가 선급금·선급비용을 등록하고 잔액을 본다

> **한 줄 요약** — 보험료·회원권·선납 통신비처럼 미리 낸 돈은 고유자산 종목(소분류가 공통코드 묶음 `ItemSClassCode005`에 속한 것 — 903001 선급금·903002 선급비용 등)으로 두고, #1091 고유자산 거래처리에서 거래유형 **선급처리(9010)**로 등록한다. 분개는 차 선급비용(3804000000) / 대 보통예금(또는 미지급금). 저장 뒤 예금잔고정리가 원장(`ast09_book`)을 만들면 #1342 선급금/선급비용 조회에 보유일자 기준 **자산별 잔액**이 나오고, 줄을 누르면 아래에 그 자산의 분개 이력이 보인다. 비용으로 대체(상각)하는 거래유형은 고유자산에 없다 — 회사 28000에도 이 종목의 거래는 9010뿐이다(대체는 회계 수기전표로 보임, 미확인).

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리(kalpa 과장 301) |
| 언제 | 선급할 때, 월말 잔액 확인 |
| 먼저 있어야 하는 것 | AST-BZ-0002(선급금·선급비용 종목), AST-BZ-0001(#1091 화면별 거래유형 9010), ACT 분개맵핑 |
| 다음 이벤트 | ACT 결산(선급비용 → 비용 대체) |
| 실제 실행 | kalpa, 2026-11-14, API. ⓪ 11-13에 이미 있던 것: `선급비용-현대해상` 9010 1,200,000(11-12, 자동차보험료 1년), `SK브로드밴드` 9010 600,000(11-13, 미지급). #1342 11-14 조회 2행(AS-IS 2 = 2). ① #1091 [등록] 선급처리 9010 · `선급비용-현대해상` · 840,000 · 출금 `신한은행#011` · "자동차보험료 선급(차량 2호, 1년)" → 거래 `202611149150067`, 분개 차 선급비용 3804000000 / 대 보통예금 3101030000 840,000. ② 예금잔고정리 → **400 "처리(취소)일 이후 환평가내역이 존재합니다"**(AST-BZ-0013의 11-14 환평가 때문, 화면은 이 실패를 버림) → #1342 잔액이 1,200,000에 머묾. ③ #1174 환평가 취소 → 정리 → 재평가(174,900) → #1342 `선급비용-현대해상` **2,040,000**. ④ 줄 클릭 분개 이력 `GET /act/journals/history` 2행(AS-IS 2 = 2) |
| 메뉴 | #1342 관리회계 > 21. 회계장부 > 선급금/선급비용 조회, 등록은 #1091 관리회계 > 11. 특수회계처리 > 고유자산 거래처리. kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 경영관리 | #1091 | [등록] → 거래유형 선급처리 → 선급 종목 → 금액 → 출금계좌(또는 미수/미지급 체크) → 적요 → [저장] | 거래·분개 자동 생성(뒤에서 예금잔고정리) |
| 2 | 〃 | #1342 | 보유일자 → 검색(구분/자산명/거래처) → [조회] / Enter | 일자·구분·자산명·거래처·잔액 |
| 3 | 〃 | 〃 | 줄 클릭 | 아래에 그 자산의 분개 이력 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ast06_tr` | 선급처리 9010 | +1 |
| `act02`·`act06`·`act03` | 선급 전표 | +1 |
| `ast09_book` | 선급 종목·출금 계좌 11-14 원장 | 갱신(환평가 취소 뒤) |
| `ast06_tr`(3700·3701) | 환평가 취소 −2 → 재평가 +2 | 순 0 |

## 업무 규칙 · 주의

- #1342는 조회 전용이다. 대상은 고유자산(`ast01_asset_type = '1'`) 중 소분류가 `ItemSClassCode005` 묶음인 종목이고, 잔액은 보유일자의 원장 수량(`ast09_hold_qty`)이다. 원장이 정리되지 않으면 등록한 거래가 잔액에 안 나온다.
- **환평가가 고유자산 잔고정리를 회사 전체로 막는다**: 같은 날·이전 날짜에 외화예금 환평가가 있으면, 외화와 상관없는 원화 선급 거래도 저장·분개는 되는데 잔고정리가 실패하고 화면은 그 실패를 버린다 → [의심 #118 보강](../../보안_및_버그_의심.md). 업무 순서로는 **환평가를 월말 마지막**에 하고, 뒤에 거래를 넣어야 하면 [평가취소] → 거래 → [평가처리].
- 분개 이력 `GET /act/journals/history?astClassTreeId=`는 회사 조건이 있다 — 사원 401이 회사 28000 선급 자산 ID로 불러도 0행(남은 문제 없음).
- 사원도 #1091로 선급 거래를 등록할 수 있다(권한 검사 없음 — #105와 같은 모양, 이번엔 시험 안 함).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: AST-BZ-0015
needs: [AST-BZ-0002]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: [PUT /api/v1/ast/trs/intrinsic, POST /api/v1/act/journals/create, POST /api/v1/ast/books/deposits/clean]
    body: [{ trId: null, date: "2026-11-14", trCode: "9010", astClassTreeId: <선급비용-현대해상>, contAmt: 840000, amt: 840000, settleMngYn: false,
             depositId: <신한은행#011>, note: "자동차보험료 선급(차량 2호, 1년)", curCode: KRW, itemLClassCode: "90", itemSClassCode: "903002", selfPur: true },
           { trId: <거래>, trCode: "9010", procType: P, exceptYn: true }, { stdDate: "2026-11-14" }]
    expect: { journal: { D: { 3804000000: 840000 }, C: { 3101030000: 840000 } }, clean: "그날 이후 환평가가 없어야 200" }
  - no: 2
    api: [GET /api/v1/ast/books/pre-deposits?holdDate=2026-11-14&searchText=]
    expect: { row: { astClassTreeName: "선급비용-현대해상(24.04.25~25.04.24)", holdQty: 2040000 } }
  - no: 3
    api: [GET /api/v1/act/journals/history?astClassTreeId=<선급비용-현대해상>]
    expect: { rows: 2 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ast09_Tab_PreDepositBook`(#1342 E0~E3, `Ast09_Book.selectPreDepositByHoldDate` L52 → `ast09_book.selectPreDepositByHoldDate`(`ItemSClassCode005`)), `Act02_Grid_History`(`Act02_Journal.selectByAstClassTreeId` L55), 등록은 `Ast06_Tab_TrIntrinsic`·`Ast06_Lookup_TrIntrinsic`(#1091, AST-BZ-0007·0011과 같은 창).
- TOBE: `AstBookController` `GET /api/v1/ast/books/pre-deposits`, `ActJournalController` `GET /api/v1/act/journals/history`, 프론트 `Ast09_Tab_PreDepositBook.tsx`·`pages/act/Act02_Grid_History.tsx`, 등록 `Ast06_Lookup_TrIntrinsic.tsx` L201(잔고정리 `.catch(() => undefined)`)·L228-249.
</details>
