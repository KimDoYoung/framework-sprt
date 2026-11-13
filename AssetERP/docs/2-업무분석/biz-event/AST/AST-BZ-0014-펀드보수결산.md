# AST-BZ-0014 운용사가 펀드 운용보수를 쌓아 두고, 결산 때 미수보수로 회계처리한다

> **한 줄 요약** — 운용사(회사)는 펀드마다 ICAM에서 매일 **보수 발생(P00)·보수 인출(D20)** 내역을 받는다(`icam10_fee`). 이 내역을 DB 함수 `f_create_fundfeebook(2)`가 날짜별 **펀드보수원장**(`ast30`, #1216 보수원장·#1401 펀드보수현황)으로 정리한다. 결산일에 #1218 운용보수 회계처리에서 원장의 **미수보수(누적 − 인출)**를 [결산처리]하면 **펀드운용보수 미수처리(9910)** 거래·분개(차 미수수수료 / 대 수수료수익)와 **다음 날 미수반제(9911)**가 생기고 결산 원장(`ast31`)이 남는다. 펀드가 다른 운용사로 넘어가면 #1252 이관펀드 등록에서 **이관(출)**(미수보수 포함) 또는 **이관(입)**을 등록한다. 사무관리보수 쪽(#1201·#1202·#1249·#1251)은 같은 구조이지만 DB 함수가 사무관리사를 회사 ID `1`로 박아 두어(이 DB의 KFS는 28000) kalpa에서는 시험하지 못했다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 운용사 경영관리(kalpa 과장 301). ICAM 회사코드·보수 데이터는 KFS가 설정·수신 |
| 언제 | 보수는 매일(ICAM), 결산·이관은 월말·분기말·이관 때 |
| 먼저 있어야 하는 것 | 회사의 **ICAM 회사코드**(`sys01_icam_company_cd`, #1075), 거래유형 9910·9911·9924와 그 **연결 자산**(펀드운용보수 902001 종목), ACT 분개맵핑(9910 → 991001, 9924 → 100101), 영업일 달력(SYS-BZ-0008), 고유자산 분류(AST-BZ-0002 — 펀드운용보수·펀드사무관리보수 종목) |
| 다음 이벤트 | 보수 인출 수령(미수 반제 — 사무관리 쪽 #1218처럼 `f_create_fundfeercvtr`), ACT 결산 |
| 실제 실행 | kalpa, 2026-11-13. ⚠ **TOBE에는 ICAM에서 보수를 가져오는 연동이 없다**(`DisabledIcamBatchRunner` — `POST /icam/fees/icam-fund-fee` → 400 "ICAM 연동(외부 ICAM DB)이 아직 없어…") → ICAM 배치가 하는 일을 대신해 `icam10_fee`에 시험 행을 `biz-db-write`로 넣음(KLP001 칼파 1호 사모펀드, 운용보수 20402, 11-09~11-12 매일 P00 500,000(대변), 11-12 D20 인출 1,000,000(차변)), kalpa ICAM 회사코드 `2018` 설정(KFS 관리자 `biz-patch`). ① `POST /icam/fees/fee-books`(보수원장 재생성) → `ast30` 4줄: 11-09 누적 500,000 · 11-10 1,000,000 · 11-11 1,500,000 · 11-12 1,000,000(인출 반영) ② #1401 월 현황 11-12: 발생 2,000,000·인출 1,000,000·잔액 1,000,000 ③ #1218 11-12 [결산처리] → 9910 `…71021` 1,000,000(차 미수투자신탁위탁자보수 3802010700 / 대 수수료수익_운용보수 0101060100) + 11-13 9911 반제 −1,000,000(차 수수료수익 / 대 미수), 결산원장 `ast31` +1, 복구원장 `ast32` 줄 생성 → [결산취소]로 거래·분개·원장 모두 되돌고 → 다시 처리 ④ #1252 이관(출) 11-13 KLP001 미수보수 1,000,000 → 이관거래 9924 + 분개 + 보수원장 11-13 누적 0(다음 날부터 원장 이월 안 됨) → [삭제]로 원장 1,000,000 복구 → 다시 등록. AS-IS 매퍼 대조: 보수현황(월)·이관펀드 목록·결산 대상 모두 1 = 1 |
| 메뉴 | #1216 펀드보수원장, #1401 펀드보수현황, #1218 운용보수 회계처리, #1252 이관펀드 등록 · (사무관리) #1201 보수원장, #1249 보수원장(기간조회), #1202 펀드보수 결산처리, #1251 이관펀드 등록(사무관리). kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 0 | KFS 관리자 | #1075 | 고객사의 ICAM 회사코드 저장 | 그 회사가 ICAM 보수 내역을 받을 수 있음 |
| 1 | (ICAM 배치 / KFS) | — | 보수 발생(P00)·인출(D20) 내역 수신 → [보수원장 재생성] | 날짜별 펀드보수원장 |
| 2 | 운용사 | #1216 | 조회기간·펀드 → [조회] | 날짜별 이전 보수·증감·누적·발생·인출·유보 |
| 3 | 〃 | #1401 | 기준일 → [조회] | 펀드별 전월말 보수·당월 발생·인출·잔액 |
| 4 | 〃 | #1218 | 결산년월 → [조회] → 줄 선택 → [결산처리] (잘못이면 [결산취소], 원장이 어긋나면 [보수원장정리]) | 9910 미수처리 거래·분개, 다음 날 9911 반제, 결산 표시 |
| 5 | 〃 | #1252 | 조회기간·구분 → [등록] → 이관(출)/이관(입)·이관일·운용사·펀드코드·(출이면) 미수보수 → [저장] | (출)이면 9924 거래·분개, 보수원장이 이관일에 맞게 다시 만들어짐 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `icam10_fee` | ICAM 보수 발생·인출 내역(시험으로 직접 넣음) | +5 |
| `ast30_book_fund_fee` | 날짜별 펀드보수원장 | 11-09~11-13, 5줄(11-13은 이관(출)로 누적 0) |
| `ast31_book_fund_fee_close` · `ast32_book_fund_fee_recovery` | 결산원장 · 복구용 원장(취소 때 되돌리는 데 씀) | 결산 1줄 · 복구 줄(건수는 안 셈) |
| `ast06_tr` | 9910 미수처리(11-12) · 9911 반제(11-13) · 9924 이관(출) | 3줄 |
| `act02_journal`·`act03_journal_dtl` | 거래마다 전표 | 3건 |
| `ast33_fund_trans` | 이관펀드정보 | +1 (이관(출) 11-13) |

## 업무 규칙 · 주의

- 원장은 **어제까지만** 만든다(`f_today() − 1`, 회기결산일이 더 빠르면 그날까지). 결산일 이후에 만든 원장·결산이 있으면 그 이전 날짜로 원장을 다시 만들 수 없다("기준일이후 펀드보수 결산자료가 존재합니다"). 회계마감된 날 이후도 막힌다("회계마감 되었습니다").
- 보수원장 한 줄에서 **당일 보수**는 같은 날 P00(발생)과 D20(인출)이 같이 오면 나중에 읽은 적요가 덮어쓴다(11-12 `fee_today` 0 — 누적은 맞다). 화면 "당일 발생"이 0으로 보일 수 있다 — DB 함수(AS-IS 공통) 동작.
- 결산처리(9910)는 그 날의 **누적 보수 − 인출**만큼 미수로 잡는다. 미래일 결산은 막히고, 결산한 줄은 [결산처리]가 막힌다("결산처리가 완료된 내역이 존재합니다."). 결산일이 회기결산일이면 확정미수보수(`fix_fee`)도 같이 정리된다.
- 이관(출)은 **거래유형 9924**에 연결된 자산(회사 설정)으로 분개 계정을 찾는다. 연결 자산이 비어 있으면 분개 대변 계정이 비어서 저장된다 → [의심 #119](../../보안_및_버그_의심.md). kalpa는 `#1090`(거래유형 등록)에서 9924에 펀드운용보수를 연결한 뒤 다시 등록했다.
- 이관(출) 이후 날짜의 보수원장에는 그 펀드가 안 이월된다. 이관(입)은 이관일 이전의 보수원장을 지운다(코드로 확인, 시험은 안 함).
- 결산·이관·보수현황 API는 모두 **메뉴 권한을 보지 않는다** — 메뉴 없는 사원(401)이 결산을 취소했다(되돌림) → [의심 #120](../../보안_및_버그_의심.md).
- ICAM 가져오기가 TOBE에 없다는 것은 변환 범위의 알려진 공백이다(`DisabledIcamBatchRunner`만 있다 — 시뮬레이터 CSV `icam10_fee.*.csv`는 있지만 배치 쪽에서 읽지 않는다). 이 이벤트의 입력은 시험용으로 직접 넣었다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: AST-BZ-0014
needs: [AST-BZ-0002, SYS-BZ-0008]
steps:
  - no: 0
    actor: { company: admin, user: admin, password: "1111" }
    api: PUT /api/v1/sys/companies/{kalpa}/manage
    body: { icamCompanyCd: "2018", … }
    expect: { db: { sys01_icam_company_cd: "2018" } }
  - no: 1
    db_write: icam10_fee(company: kalpa, 20402, KLP001, P00 C 500000 × 2026-11-09~12, D20 D 1000000 × 2026-11-12)
    actor: { company: kalpa, user: "301", password: "1111" }
    api: POST /api/v1/icam/fees/fee-books
    body: { feeType: "20402", startDate: "2026-11-09", closeDate: "2026-11-12", corpId: null, corpCode: "%", fundCode: "%" }
    expect: { track: { ast30_book_fund_fee: +4 }, fee_by_date: { 2026-11-09: 500000, 2026-11-10: 1000000, 2026-11-11: 1500000, 2026-11-12: 1000000 } }
  - no: 2
    api: [GET /api/v1/ast/book-fund-fees/month-fees?stdDate=2026-11-12, GET /api/v1/ast/book-fund-fees/fund-fee-books?startDate=2026-11-09&closeDate=2026-11-12]
    expect: { month: { occFee: 2000000, drawFee: 1000000, fee: 1000000 } }
  - no: 3
    api: [GET /api/v1/ast/fund-fee-closes?holdDate=2026-11-12, POST /api/v1/ast/fund-fee-closes/process, POST /api/v1/ast/fund-fee-closes/cancel]
    body: { items: [{ corpId: <kalpa>, astClassTreeId: <펀드운용보수>, holdDate: "2026-11-12", curCode: KRW, trCode: "9910", forFee: 1000000, fee: 1000000, fxRate: 1, closeYnName: "", trId: null }] }
    expect: { track: { ast06_tr: +2 (9910, 9911 다음 날), ast31_book_fund_fee_close: +1 }, journal: { 차 미수수수료 1000000 / 대 수수료수익 1000000 } }
  - no: 4
    api: PUT /api/v1/ast/tr-codes/intrinsic
    body: [{ trCodeId: <9924>, astClassTreeId: <펀드운용보수>, … }]
  - no: 5
    api: [PUT /api/v1/ast/fund-trans, DELETE /api/v1/ast/fund-trans/{id}]
    body: { items: [{ fundTransCode: "1", date: "2026-11-13", corpId: <kalpa>, fundCode: KLP001, fundName: 칼파 1호 사모펀드, fee: 1000000, forFee: 1000000, curCode: KRW, note: 타 운용사로 이관 }] }
    expect: { track: { ast06_tr: +1 (9924), ast33_fund_trans: +1 }, ledger_20261113_fee: 0, after_delete: { ledger_20261113_fee: 1000000 } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ast30_Tab_FundMngFeeState`·`Ast30_Tab_FundMngFee`(#1216·#1401, `ast30_book_fund_fee.selectByStdDate`·`selectByCorpId`·`selectByPreHoldDate`), `Ast30_Tab_FundMngFeeClose`(#1218, 서버 `Ast30_BookFundFee.selectEvalFundFee`·`updateEvalFundFee`·`reprocFundFee`, `ast31`·`ast32`), `Ast33_Tab_FundMngTrans`(#1252, `Ast33_FundTrans.update` — 9924 이관(출) 거래·분개), `Ast30_Tab_OfficeMng*`·`Ast33_Tab_OfficeMngFundTrans`(사무관리 판). DB 함수 `f_create_fundfeebook`(421줄 — `icam10_fee` P00/D20/D31/D32 적요별 누적·유보, `v_KFS_CORP_CD := 1`), `f_create_fundfeebook2`, `f_create_fundfeercvtr`(_officemng), `f_calc_dual_fund_fee`.
- TOBE: `AstBookFundFeeController`(`/api/v1/ast/book-fund-fees`, `/month-fees`, `/fund-fee-books`, `/pre-hold`), `AstFundFeeCloseController`·`AstFundFeeCloseService.process`·`cancel`(`processItem` L89-114: 거래생성 → `ActJournalService.createJournal` → `createBackJournal` → 복구원장 → 결산원장), `AstFundTransController`·`AstFundTransService.save`(L49-97)·`delete`, `IcamFeeController`(`/api/v1/icam/fees/fee-books`·`/rcv-trs`·`/icam-fund-fee`)·`IcamFeeService`, 매퍼 `AstBookFundFeeMapper.xml`·`AstFundFeeCloseMapper.xml`·`AstFundTransMapper.xml`, 화면 `Ast30_Tab_FundMngFeeState.tsx`·`Ast30_Tab_FundMngFee.tsx`·`Ast30_Tab_FundMngFeeClose.tsx`·`Ast33_Tab_FundMngTrans.tsx`.
</details>
