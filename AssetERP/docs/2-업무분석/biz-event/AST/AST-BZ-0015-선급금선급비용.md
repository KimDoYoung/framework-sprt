# AST-BZ-0015 경영관리가 선급금·선급비용을 처리하고 잔액을 본다

> **한 줄 요약** — 보험료·통신비처럼 **미리 낸 돈**은 #1091 고유자산 거래처리에서 거래유형 **선급처리(9010)**로 등록한다. 종목은 고유자산 분류의 **선급금(903001)·선급비용(903002)** 소분류 종목(예: `선급비용-현대해상(…)`, `SK브로드밴드`)이고, 분개는 차 선급(자산계정) / 대 보통예금(바로 지급) 또는 미지급금(나중에 지급 — #1092 미수/미지급에서 결제)이다. #1342 선급금/선급비용 조회는 보유일자 기준으로 선급 종목별 **잔액**(예금원장 정리가 만드는 `ast09_book`)을 보여 주고 줄을 고르면 그 종목의 **분개 이력**을 아래에 보여 준다. 선급이 줄어드는(비용으로 넘어가는) 전용 거래유형은 없다 — 수동 분개로 한다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리(kalpa 과장 301) |
| 언제 | 보험료·통신비 등을 선납할 때, 월말 선급 잔액 확인 때 |
| 먼저 있어야 하는 것 | AST-BZ-0001(거래유형 9010 + 화면별 거래유형 `Ast06_Tab_TrIntrinsic`에 9010), AST-BZ-0002(선급 종목 — 회사 0 분류의 `선급금/선급비용` 분류), 회사 계좌, ACT 분개맵핑(9010 → 901001) |
| 다음 이벤트 | 선급의 비용 대체(수동 분개), ACT 결산 |
| 실제 실행 | kalpa, 2026-11-13, API(과장 301). 먼저 `Ast06_Tab_TrIntrinsic`에 9010이 없어(회사 0 기초에 없음 — 의심 #121) KFS 관리자가 넣었다. ① 선급처리 11-12 `선급비용-현대해상(24.04.25~25.04.24)` 1,200,000, 우리은행 즉시 지급 → 분개 차 3804000000(선급) / 대 보통예금 1,200,000 ② 선급처리 11-13 `SK브로드밴드` 600,000, 미지급(settleMng) → 분개 차 선급 / 대 미지급금 → #1092 목록에 나오고 [결제](9003, 우리은행 600,000) → 차 미지급금 / 대 보통예금 ③ 예금잔고정리 → #1342 11-13: 선급비용 2줄(현대해상 1,200,000·SK브로드밴드 600,000), 보유일자 11-11은 0줄, 검색어 `현대`는 1줄, 줄별 분개 이력(11-12 선급처리 1,200,000). AS-IS 대조: 선급 조회 1 = 1. 사원 401도 같은 조회를 받음(의심 #122) |
| 메뉴 | #1342 관리회계 > 21. 회계장부 > 선급금/선급비용 조회 (등록은 #1091 고유자산 거래처리, 결제는 #1092 미수/미지급). kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 경영관리 | #1091 | [등록] → 거래유형 선급처리 · 선급 종목 · 금액 · 출금계좌(또는 미지급 체크) → [저장] | 거래·분개(차 선급 / 대 보통예금 또는 미지급금) |
| 2 | 〃 | #1092 | (미지급으로 등록했다면) 줄 선택 → [결제등록] → 결제일 · 예금계좌 · 금액 | 결제 분개(차 미지급금 / 대 보통예금), 미지급 목록에서 사라짐 |
| 3 | 〃 | #1342 | 보유일자 → [조회] | 선급 종목별 잔액(일자·구분·자산명·거래처·잔액, 합계 "계") |
| 4 | 〃 | #1342 | 위 그리드의 줄 선택 | 아래에 그 종목의 분개 이력(일자·거래유형·금액·적요) |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ast06_tr` | 선급처리 9010 | +2 (1,200,000 / 600,000) |
| `ast07_settle` | 미지급 결제(9003) | +1 (600,000) |
| `act02_journal`·`act03_journal_dtl` | 거래·결제 전표 | 3건 |
| `ast09_book` | 선급 종목 원장(예금잔고정리가 같이 만든다) | 선급 종목 2개의 보유 줄 |

## 업무 규칙 · 주의

- 목록은 소분류가 공통코드 그룹 `ItemSClassCode005`(903001 선급금·903002 선급비용)인 **고유자산** 종목의 보유 원장이다. 보유수량(잔액)은 원화 금액과 같다. 거래처는 거래의 거래처가 아니라 **종목에 지정한 거래처**(`ast01_corp_id`)를 보여 준다.
- 선급 원장(`ast09_book`)은 **예금잔고정리**(`POST /ast/books/deposits/clean`)가 만든다 — 거래만 저장하면 #1342에 안 나오고, 화면은 저장 뒤 정리를 이어 부른다. **환평가(3700)가 정리 대상 날짜 이후에 있으면 정리가 막힌다**("처리(취소)일 이후 환평가내역이 존재합니다") — AST-BZ-0013의 규칙이 그대로 이어진다(이 시험에서도 환평가를 취소 → 정리 → 다시 환평가했다).
- 선급이 줄어드는 거래유형은 없다(차대 모두 자산계정을 대변에 두는 유형은 금융상품 매도·비품 폐기 등뿐). 월말에 선급을 비용으로 넘기려면 수동 분개를 해야 하고, 그러면 #1342 잔액은 줄지 않는다(원장은 거래 기준) — 업무 확인 필요.
- 회사 0 기초에는 `Ast06_Tab_TrIntrinsic`에 9010이 없다(회사 28000에는 있음) → [의심 #121](../../보안_및_버그_의심.md).
- #1092 미수/미지급 목록에 **이관(출) 9924의 미수보수**도 함께 나오는데 거래처 칸이 "EMP_NAME을 찾을 수 없습니다."로 보인다(AST-BZ-0014에서 만든 이관 거래) → [의심 #122](../../보안_및_버그_의심.md).
- #1342·분개 이력 API는 메뉴 권한을 보지 않는다(다른 회사 종목은 안 보임 — 회사 조건은 있음) → [의심 #123](../../보안_및_버그_의심.md).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: AST-BZ-0015
needs: [AST-BZ-0001, AST-BZ-0002]
steps:
  - no: 0
    actor: { company: admin, user: admin, password: "1111" }
    api: PUT /api/v1/ast/tr-code-windows
    body: { companyId: <kalpa>, className: Ast06_Tab_TrIntrinsic, items: [<기존 11개>, { trCode: "9010" }] }
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: [PUT /api/v1/ast/trs/intrinsic, POST /api/v1/act/journals/create, POST /api/v1/ast/books/deposits/clean]
    body: [{ date: "2026-11-12", trCode: "9010", astClassTreeId: <선급비용-현대해상>, contAmt: 1200000, amt: 1200000, settleMngYn: false, depositId: <우리은행>, note: 자동차보험료 선급(1년), curCode: KRW },
           { trId: <1>, trCode: "9010", procType: P, exceptYn: true }, { stdDate: "2026-11-12" }]
    expect: { journal: { 차 선급 1200000 / 대 보통예금 1200000 } }
  - no: 2
    api: [PUT /api/v1/ast/trs/intrinsic, POST /api/v1/act/journals/create, POST /api/v1/ast/settles, POST /api/v1/ast/books/deposits/clean]
    body: [{ date: "2026-11-13", trCode: "9010", astClassTreeId: <SK브로드밴드>, amt: 600000, settleMngYn: true, … },
           { trId: <2>, settleDate: "2026-11-13", depositId: <우리은행>, trCode: "9003", settleAmt: 600000 }]
    expect: { journal: { 결제: 차 미지급금 600000 / 대 보통예금 600000 } }
  - no: 3
    api: [GET /api/v1/ast/books/pre-deposits?holdDate=2026-11-13, GET /api/v1/act/journals/history?astClassTreeId=<현대해상>]
    expect: { rows: 2, items: { 현대해상: 1200000, SK브로드밴드: 600000 }, history: { rows: 1, trName: 선급처리, amt: 1200000 } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ast09_Tab_PreDepositBook`(#1342 E0~E3, 서버 `Ast09_Book.selectPreDepositByHoldDate` — `ast09_book.selectPreDepositByHoldDate`: 고유자산·`ItemSClassCode005` 소분류, 검색어는 구분·자산명·거래처 연결), `Act02_Grid_History`(`act02_journal.selectByAstClassTreeId`), 등록은 `Ast06_Tab_TrIntrinsic`(거래유형 9010 선급처리 → 분개그룹 901001: 차 자산계정 1100 / 대 미지급금 2200).
- TOBE: `AstBookController`(`GET /api/v1/ast/books/pre-deposits`)·`AstBookService.searchPreDeposits`, 매퍼 `AstBookMapper.xml#selectPreDepositByHoldDate`, `ActJournalController`(`GET /api/v1/act/journals/history`)·`ActJournalService.searchHistory`·`ActJournalMapper.xml#selectByAstClassTreeId`, 화면 `Ast09_Tab_PreDepositBook.tsx`·`Act02_Grid_History.tsx`.
</details>
