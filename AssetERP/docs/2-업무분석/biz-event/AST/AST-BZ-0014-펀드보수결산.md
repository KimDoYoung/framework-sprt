# AST-BZ-0014 회계가 펀드 운용·사무관리 보수를 원장에 쌓고 결산한다

> **한 줄 요약** — 운용사(또는 사무관리회사)는 펀드에서 날마다 보수를 받을 권리가 생긴다. 펀드 회계 시스템 **ICAM**의 보수 발생·인출 내역을 #1214 ICAM 운용보수 발생내역(사무관리는 #1199)에서 **가져와**(`icam10_fee`) [보수원장 재생성]하면 펀드별 일별 **보수원장**(`ast30_book_fund_fee`: 당일보수·누적 미수보수)이 생긴다. 결산일에 #1218 운용보수 회계처리(사무관리는 #1202 펀드보수 결산처리)에서 [결산처리]하면 누적 미수보수가 **미수수익 거래(9910)·분개**(차 미수수수료 / 대 운용보수 수익)가 되고 다음 날 반제(9911)가 자동으로 생긴다. 펀드가 다른 운용사로 넘어가면 #1252 이관펀드 등록(사무관리 #1251)에 이관 거래(9924)를 남긴다. #1216 펀드보수원장·#1401 펀드보수현황(사무관리 #1201·#1249)에서 본다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 회계(kalpa 과장 301) |
| 언제 | 보수 가져오기는 매일(원래 ICAM 배치), 결산은 월말·분기말 |
| 먼저 있어야 하는 것 | 펀드 종목(AST-BZ-0002 — 펀드 보수 자산), 회사의 ICAM 회사코드(`sys01_icam_company_cd`, kalpa 2018), ICAM 보수 발생내역, 화면별 거래유형 9910·9911·9924, ACT 분개맵핑 |
| 다음 이벤트 | 보수 인출(현금 수령)은 보수인출거래(#1214 [보수인출거래 재생성]) → AST-BZ-0003 미수 결제, ACT 결산 |
| 실제 실행 | kalpa, 2026-11-14, API. ⓪ 11-13에 이미 있던 것: `icam10_fee` KLP001(칼파 1호 사모펀드) 11-09~11-12 하루 500,000 발생 4건 + 11-12 인출 1,000,000(작업자 없음 — DB에 직접 넣음), 보수원장 11-09~11-13, 11-12 결산(9910 1,000,000·9911), 11-13 이관(출) 9924 1,000,000. ① #1214 [보수발생내역 가져오기] → 400 "ICAM 연동(외부 ICAM DB)이 아직 없어 펀드보수 발생내역을 가져오지 않았습니다"(아래). ② 2026-10-30 [보수원장 재생성] → 400 "기준일이후 펀드보수 결산자료가 존재합니다"(11-12 결산이 있어 막힘 — 바른 동작). ③ #1218 기준일 2026-11-12 [조회] → KLP001 미수 1,000,000 "결산" → [결산취소] → 거래 −2·전표 −2·결산 −1 → [결산처리] → 9910 1,000,000(차 3802010700 미수수수료_미수투자신탁위탁자보수 / 대 0101060100 수수료수익_집합투자기구운용보수) + 11-13 반제 9911 자동. AS-IS 비교: 보수원장 5 = 5, 펀드보수현황 1 = 1, 결산 대상 1 = 1, 이관펀드 1 = 1 |
| 메뉴 | #1216 관리회계 > 30. 펀드운용보수관리 > 펀드보수원장, #1401 펀드보수현황, #1218 운용보수 회계처리, #1252 이관펀드 등록, #1201 관리회계 > 30. 사무보수관리 > 보수원장, #1249 보수원장(기간조회), #1202 관리회계 > 20. 결산 > 펀드보수 결산처리, #1251 이관펀드 등록(사무관리). (가져오기 #1214·#1199는 ICAM 도메인.) kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기 (운용보수 — 사무보수는 괄호의 화면)

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 회계 | #1214 (#1199) | 기간 → [ICAM발생내역 가져오기] 창 → [보수발생내역 가져오기] → [보수원장 재생성] (→ [보수인출거래 재생성]) | ICAM 보수 발생·인출 줄, 보수원장 |
| 2 | 〃 | #1216 (#1201·#1249) | 기간·펀드 → [조회] | 일자·펀드별 당일보수·누적보수·전일보수·발생·인출·차이 |
| 3 | 〃 | #1401 | 기준일 → [조회] / [엑셀다운로드] | 펀드별 당월 보수 증감 |
| 4 | 〃 | #1218 (#1202) | 기준일 → [조회] | 결산 대상(펀드별 미수보수, 결산 여부) |
| 5 | 〃 | 〃 | 줄 체크 → [결산처리](확인 [예]) / [결산취소] / [보수원장정리] | 9910 거래·분개, 다음 날 9911 반제 |
| 6 | 〃 | #1252 (#1251) | 기간 → [조회] → [등록] → 펀드·이관구분(출·입)·보수 → [저장] / [삭제] | 이관 거래(9924)·분개 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ast31_book_fund_fee_close` | 결산 행(기준일·펀드·미수보수) | 취소 −1 → 처리 +1 (시험 포함 3번) |
| `ast06_tr` | 9910 미수처리(11-12)·9911 반제(11-13) | 취소 −2 → 처리 +2 |
| `act02`·`act06`·`act03` | 결산·반제 전표 | 취소 −2 → 처리 +2 |
| `icam10_fee`·`ast30_book_fund_fee` | ICAM 보수·보수원장 | 변화 없음(가져오기·재생성 막힘) |

## 업무 규칙 · 주의

- **TOBE는 ICAM 가져오기를 하지 않는다**: `IcamBatchRunner`가 `DisabledIcamBatchRunner`로 묶여 [보수발생내역 가져오기]·[보수원장 재생성]의 가져오기 단계가 "ICAM 연동(외부 ICAM DB)이 아직 없어 …"로 끝난다. ICAM 시뮬레이터 CSV(`data/icam-simulator/icam/icam10_fee.selectFundMngFeeIcamData.csv`)는 이 경로가 읽지 않는다. 그래서 가상 회사에서는 `icam10_fee`를 DB에 직접 넣어야 보수원장·결산을 시험할 수 있다(11-13 자료가 그렇게 들어가 있음, 작업자 칸 빈칸).
- 결산 뒤 이전 날짜의 원장 재생성은 "기준일이후 펀드보수 결산자료가 존재합니다"로 막힌다 → 먼저 그 결산을 취소한다.
- 결산 대상 조회의 거래 ID는 null로 오지만(#108과 같은 조회 모양) 처리 서비스가 새 ID를 만든다 — 환평가(#108)와 달리 [결산처리]는 된다.
- 결산 금액을 화면이 보낸 값으로 쓰고 사원도 결산을 취소·처리할 수 있다 → [의심 #119](../../보안_및_버그_의심.md).
- 11-13 자료의 보수원장 거래처(`ast30_corp_id`)가 거래처(`sys15_corp`)가 아니라 **회사 ID**라 #1218 운용사 이름이 빈다(시험 자료 문제로 보임 — ICAM 가져오기가 정하는 값).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: AST-BZ-0014
needs: [AST-BZ-0002]
pre: "icam10_fee에 펀드 보수 발생·인출 행(ICAM 연동이 없어 DB 직접)"
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: [POST /api/v1/icam/fees/icam-fund-fee]
    body: { feeType: "20402", startDate: "2026-10-30", closeDate: "2026-10-30", corpId: null, corpCode: "%", fundCode: "%" }
    expect: { status: 400, message: "ICAM 연동(외부 ICAM DB)이 아직 없어 펀드보수 발생내역을 가져오지 않았습니다" }
  - no: 2
    api: [GET /api/v1/ast/fund-fee-closes?holdDate=2026-11-12, POST /api/v1/ast/fund-fee-closes/cancel]
    body: { items: [<조회 줄 그대로>] }
    expect: { track: { ast06_tr: -2, act02_journal: -2, ast31_book_fund_fee_close: -1 } }
  - no: 3
    api: [GET /api/v1/ast/fund-fee-closes?holdDate=2026-11-12, POST /api/v1/ast/fund-fee-closes/process]
    body: { items: [<조회 줄 그대로>] }
    expect: { tr: { 9910: 1000000, 9911: -1000000 }, journal: { D: 3802010700, C: 0101060100 } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Icam10_Tab_FundMngFee`(#1214 E5 → `Icam10_Lookup_getICAM` — `icam.Icam10_Fee.getICAMFundFee`·`createFeeBook`·`createFeeRcvTr`), `Ast30_Tab_FundMngFeeState`(#1216 `Ast30_BookFundFee.selectFundFeeBook` L54), `Ast30_Tab_FundMngFee`(#1401 `selectByStdDate` L66), `Ast30_Tab_FundMngFeeClose`(#1218 E0~E9, `selectEvalFundFee` L72·`updateEvalFundFee` L88(화면 모델 `getFee()`로 거래)·`reprocFundFee` L301), `Ast33_Tab_FundMngTrans`(#1252 `Ast33_FundTrans.selectByDate` L28·`update` L34·`delete` L145), 사무보수 `Ast30_Tab_OfficeMngFeeState`·`OfficeMngFeeStatePeriod`·`OfficeMngFeeClose`·`Ast33_Tab_OfficeMngFundTrans`.
- TOBE: `IcamFeeController`(`/api/v1/icam/fees/icam-fund-fee`·`/fee-books`·`/rcv-trs`) → `DisabledIcamBatchRunner.runFundFee` L29-33, `AstBookFundFeeController`(`/api/v1/ast/book-fund-fees`·`/fund-fee-books`·`/month-fees`·`/period`), `AstFundFeeCloseController`(`/api/v1/ast/fund-fee-closes`·`/process`·`/cancel`·`/reproc`), `AstFundTransController`(`/api/v1/ast/fund-trans`). 문서 뼈대는 `yunhee biz-event-new`로 만들었다.
</details>
