# AST-BZ-0012 경영관리가 자기자본과 자산별 투자한도·Stop Loss를 정한다

> **한 줄 요약** — 해마다(또는 결산 때) #1299 자기자본/투자한도 등록에서 **기준일별 자기자본금**을 입력한다. 같은 화면의 [투자한도/StopLoss 설정] 창에서 **적용일을 만들고**(이전 적용일의 한도를 통째로 복사) 자산구분(채권·집합투자증권·상장주식 …)마다 **투자한도비율(%)과 Stop Loss(%)**를 적는다. 이 두 값은 금융운용 현황(#1117~ 계열)이 "자기자본 대비 보유 비율·한도 금액"과 보유 종목의 "Stop Loss 도달" 표시를 만들 때 쓴다 — 보유일 기준으로 그날 이전의 가장 가까운 자기자본·적용일 값을 고른다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리(kalpa 과장 301) |
| 언제 | 해마다·결산 때, 투자 정책이 바뀔 때 |
| 먼저 있어야 하는 것 | 없음(회사 개설 뒤). 결과를 보려면 AST-BZ-0008 보유 종목 |
| 다음 이벤트 | 금융운용 현황·보유현황 조회(Stop Loss 표시) |
| 실제 실행 | kalpa, 2026-11-13, API(과장 301). ① 자기자본 2건 — 2025-12-31 10억, 2026-06-30 12억. ② 적용일 2026-01-01 [생성] → 복사할 행이 없어 "채권(2040%)" 한 줄만 생김 → 한도 30%·SL 5%로 고치고 집합투자증권(2050%) 50%·10%, 상장주식(201010) 20%·15% 추가. ③ 자산구분을 비우고 저장 → 400 "자산구분은 필수입력 항목입니다." ④ 적용일 2026-07-01 [생성] → 2026-01-01의 3줄이 그대로 복사됨 ⑤ 그 적용일 [삭제] → 3건 삭제. AS-IS 매퍼 대조(자기자본 조회·최근값, 적용일 목록·적용일별 한도) 모두 건수 일치 |
| 메뉴 | #1299 고유자산 > 10. 고유자산 등록 > 자기자본/투자한도 등록 (kalpa 메뉴 없음). 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 경영관리 | #1299 | 기준연도(YYYY) → [조회] | 그 해 자기자본 목록(기준일·자기자본금·비고) |
| 2 | 〃 | 〃 | [등록] → 기준일·자기자본금·비고 → [저장] | 줄 저장(기준일·금액은 필수) |
| 3 | 〃 | 〃 | 줄 체크 → [삭제] → 예 | 줄 삭제(미선택이면 "삭제할 항목을 선택해주세요") |
| 4 | 〃 | 〃 | [투자한도/StopLoss 설정] | 창: 왼쪽 적용일 목록, 오른쪽 그 적용일의 자산구분별 한도 |
| 5 | 〃 | 창 | [생성] → 새 적용일 | 가장 최근(오늘 이전) 적용일의 줄을 복사(없으면 채권 한 줄) |
| 6 | 〃 | 창 | 자산구분·투자한도비율·Stop Loss·비고 → [행 추가]·[저장] | 줄 저장(자산구분 필수) |
| 7 | 〃 | 창 | 적용일 선택 → [삭제] (또는 줄 체크 → [행 삭제]) | 그 적용일 전체 / 선택한 줄 삭제 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ast40_owner_capital` | 기준일별 자기자본금 | +2 (2025-12-31, 2026-06-30) |
| `ast41_invest_limit` | 적용일·자산구분별 투자한도비율·Stop Loss | 적용일 2026-01-01 3줄 남김(07-01 복사분 3줄은 [삭제]로 지움) |

## 이 값을 쓰는 곳

- `GET /ast/finance-opr/owner-capital?holdDate=` — 보유일 이전 가장 가까운 자기자본(회사 설정 `sys01_owner_capital_apply_cd`가 `20`이면 **전전월말** 기준). kalpa 2026-11-13 → 2026-06-30·12억.
- `GET /ast/finance-opr/limits?holdDate=` — 자산구분별 한도 금액 = 자기자본 × 한도비율, 보유 평가액 ÷ 자기자본(`ast41`과 보유 종목 소분류가 `LIKE`로 이어진다). kalpa는 보유 종목이 없어 0건(AST-BZ-0008의 종목을 사야 보임).
- 보유현황의 Stop Loss 표시(`AstBookMapper` L154-): 평가손익률이 −Stop Loss 이하이면 도달, 한도가 없으면 "정보없음".

## 업무 규칙 · 주의

- 자산구분 값은 공통코드 `InvestAssetType`(2040% 채권, 2050% 집합투자증권, 201010 상장주식 …). `%`가 든 값은 종목 소분류와 `LIKE`로 맞춘다.
- [생성]은 오늘 이전 가장 최근 적용일의 줄을 복사하므로, 미래 날짜로 만든 적용일은 아직 복사 원본이 되지 않는다.
- 기준일·자기자본금은 NOT NULL이라 서버도 막는다(AS-IS도 화면에서 막는다).
- 권한: 두 API 모두 로그인 회사만 보고 **메뉴 권한은 보지 않는다** — 메뉴가 없는 일반 사원(401)도 자기자본을 읽고 쓰고 지울 수 있다([의심 #115](../../보안_및_버그_의심.md)).
- 적용일 목록의 `investLimitId`는 행 순번(1, 2 …)으로 나온다 — AS-IS `selectByCompanyId`가 그렇게 만든다(차이 아님).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: AST-BZ-0012
needs: []
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: PUT /api/v1/ast/owner-capitals
    body: [{ stdDate: "2025-12-31", amt: 1000000000, note: 2025 결산 자기자본 }, { stdDate: "2026-06-30", amt: 1200000000, note: 2026 반기 자기자본 }]
    expect: { track: { ast40_owner_capital: +2 } }
  - no: 2
    api: [POST /api/v1/ast/invest-limits {startDate: "2026-01-01"}, PUT /api/v1/ast/invest-limits]
    body: [{ investLimitId: <생성된 채권 행>, startDate: "2026-01-01", investAssetType: "2040%", limitRate: 30, stopLossRate: 5 },
           { startDate: "2026-01-01", investAssetType: "2050%", limitRate: 50, stopLossRate: 10 },
           { startDate: "2026-01-01", investAssetType: "201010", limitRate: 20, stopLossRate: 15 }]
    expect: { track: { ast41_invest_limit: +3 } }
  - no: 3
    api: PUT /api/v1/ast/invest-limits
    body: [{ startDate: "2026-01-01", investAssetType: "", limitRate: 1 }]
    expect: { status: 400, message: 자산구분은 필수입력 항목입니다. }
  - no: 4
    api: [POST /api/v1/ast/invest-limits {startDate: "2026-07-01"}, DELETE /api/v1/ast/invest-limits/by-date?startDate=2026-07-01]
    expect: { copied: 3, deleted: 3 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ast40_Tab_OwnerCapital`(#1299 E0~E7, 서버 `Ast40_OwnerCapital.selectByDate` L34·`update` L44·`delete` L49), `Ast41_Lookup_InvestLimit`·`Ast41_Lookup_Insert`(서버 `Ast41_InvestLimit.selectByCompanyId` L26·`selectByDate` L38·`insert` L52 — `selectByMaxCompanyId` 복사·`"2040%"` 임시 행·`deleteByDate` L88·`update` L101·`delete` L106). 쓰는 곳: `ast09_book.selectInvestAssetLimit`·`selectFinanceByHoldDate`, `ast40_owner_capital.selectByMaxDate`.
- TOBE: `AstOwnerCapitalController`(`/api/v1/ast/owner-capitals`)·`AstOwnerCapitalService`, `AstInvestLimitController`(`/api/v1/ast/invest-limits`·`/dates`·`/by-date`)·`AstInvestLimitService`, 쓰는 곳 `AstFinanceOprMapper.xml`(`selectOwnerCapitalMax`·`selectInvestAssetLimit`)·`AstBookMapper.xml` L154-192, 화면 `Ast40_Tab_OwnerCapital.tsx`·`Ast41_Lookup_InvestLimit.tsx`·`Ast41_Lookup_Insert.tsx`.
</details>
