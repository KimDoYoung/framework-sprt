# AST-BZ-0007 회계담당이 고유자산 거래를 등록하고 미수/미지급을 결제한다

> **한 줄 요약** — 사업비 결의를 거치지 않는 회사 비용·자산 거래(임대료·관리비·통신비·수수료 납부, 비품·무형자산 구입, 비품 폐기·매각 …)는 #1091 고유자산 거래처리에서 **거래유형·종목·금액(공급가·세액)**을 넣어 등록한다. 바로 낸 것은 출금계좌를, 나중에 낼 것은 **미수/미지급**을 고른다. 분개는 거래유형별 맵대로(예: 차 통신비·선급부가세 / 대 미지급비용) 자동으로 생긴다. 미지급 거래는 #1092 미수/미지급(또는 #1390)에 나오고, 지급하면 [결제등록](9003)으로 정리한다(차 미지급비용 / 대 보통예금).

| 항목 | 내용 |
|:---|:---|
| 누가 | 회계·자금관리(kalpa 과장 301) |
| 언제 | 수시 |
| 먼저 있어야 하는 것 | AST-BZ-0002(종목 — 비용 종목 `통신비` 등은 [가져오기]로 들어옴, 출금계좌), AST-BZ-0001(거래유형·화면별 11개), ACT 분개맵핑 |
| 다음 이벤트 | AST-BZ-0004(예금잔고), AST-BZ-0011(비품 → 감가상각) |
| 실제 실행 | kalpa, 2026-11-12, API: 통신비 납부(5004) 종목 `통신비`, 공급가 100,000·세액 10,000·금액 110,000, 일자 2026-11-10, **미지급** → 거래 `202611129141836` → 분개(차 통신비 100,000·선급부가세 10,000 / 대 미지급비용 110,000) → 미수/미지급 목록 1행(AS-IS 1 = 1) → [결제등록] 9003 2026-11-12 우리은행 110,000 → 결제 `202611129141845`·전표 1 → 목록 0행, 우리은행 장부 4,279,960 → 4,169,960. #1091 목록 AS-IS 1 = 1 |
| 메뉴 | #1091 관리회계 > 11. 특수회계처리 > 고유자산 거래처리, #1092 미수/미지급. kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 회계 | #1091 | [등록] → 거래유형(화면별 11개) → 종목 → 거래처 → 공급가·세액 → 미수/미지급 또는 출금계좌 → [저장] | 분개 자동 생성. 비품·무형자산이면 비품원장도 |
| 2 | 〃 | 〃 | 줄 선택 → 아래 결제·분개 그리드 | 결제 내역(`settles/by-tr`)·분개 |
| 3 | 자금관리 | #1092 | [조회] → 미지급 줄 → [결제등록] → 결제일·금액·계좌 | 미지급액 0이면 목록에서 빠짐 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ast06_tr` | 통신비 납부(미수/미지급 관리 `true`) | +1 |
| `act02`·`act06`·`act03` | 발생 전표(통신비) + 결제 전표 | +2 |
| `ast07_settle` | 결제(거래 ID, 9003) | +1 |

## 업무 규칙 · 주의

- 미수/미지급이 아니면 출금계좌가 필수("미수/미지급 거래가 아닌 경우 예금계좌는 필수선택 항목입니다.").
- 목록은 거래의 등록자·담당자·담당 부서만 본다(`ast10_manager`, AS-IS 같은 SQL).
- 목록 조건의 종목·거래유형·거래처를 안 고르면 원본 화면은 0을 보내고 서버가 null로 바꾼다(`Ast06_Tr.selectByPayCode` L43-) — TOBE도 같은 결과(AS-IS 1 = 1).
- ⚠ 거래별 결제 내역 `GET /ast/settles/by-tr?trId=`가 로그인·회사를 보지 않는다 — kalpa 사원이 회사 28000의 결제(2022-04-11 2,991,082원 "통합정보관리시스템 유지보수")를 읽었다 → [의심 #109](../../보안_및_버그_의심.md)(상).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: AST-BZ-0007
needs: [AST-BZ-0002]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: [PUT /api/v1/ast/trs/intrinsic, POST /api/v1/act/journals/create]
    body: [{ date: "2026-11-10", trCode: "5004", astClassTreeId: <통신비>, contAmt: 100000, tax: 10000, amt: 110000, settleMngYn: true,
             note: 10월 인터넷·전화요금, curCode: KRW, itemLClassCode: "95", itemSClassCode: "955001", selfPur: true, foreign: false },
           { trId: <1>, trCode: "5004", procType: P, exceptYn: true }]
  - no: 2
    api: GET /api/v1/ast/settles/accrueds
    expect: { rows: 1, first: { trCode: "5004", accruedAmt: 110000 } }
  - no: 3
    api: [POST /api/v1/ast/settles, POST /api/v1/ast/books/deposits/clean]
    body: [{ trId: <1>, settleDate: "2026-11-12", note: 10월 통신비 지급, depositId: <우리은행>, trCode: "9003", amt: 110000, settleAmt: 110000 }, { stdDate: "2026-11-10" }]
    expect: { track: { ast07_settle: +1 }, accrueds: 0 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ast06_Tab_TrIntrinsic`(#1091, retrieve L389-437 → `Ast06_Tr.selectByPayCode` L43-107 — 0 → null), `Ast06_Lookup_TrIntrinsic`(preUpdate L528-577, update L579-606), `Ast06_Tab_AccruedIntrinsic`(#1092), `Ast07_Grid_Settle`·`Ast07_Lookup_Settle`.
- TOBE: `AstTrIntrinsicController`(`/api/v1/ast/trs/intrinsic` GET·PUT, `GET /api/v1/ast/settles/by-tr` L78-79 — `UserPrincipal` 없음), `AstSettleController`(`/accrueds`·POST).
</details>
