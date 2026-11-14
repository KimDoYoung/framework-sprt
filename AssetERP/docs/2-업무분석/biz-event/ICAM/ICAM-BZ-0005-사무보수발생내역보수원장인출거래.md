# ICAM-BZ-0005 사무관리사가 ICAM 사무보수 발생내역을 가져오고 보수원장·인출거래를 만든다

> **한 줄 요약** — 사무관리사(KFS 28000)가 #1199 ICAM 펀드보수 발생내역에서 기간·운용사·펀드로 사무관리보수(20407) 발생내역(`icam10_fee`)을 보고, 행을 더블클릭해 금액을 고친다. **[ICAM발생내역 가져오기]** 창(`Icam10_Lookup_getICAM`)에는 버튼이 셋 있다. ① [보수발생내역 가져오기]는 ICAM을 읽어 `icam10_fee`를 다시 넣는다. ② [보수원장 재생성]은 DB 함수 `f_create_fundFeeBook(2)`가 시작일부터 어제까지 날마다 **펀드보수 미수 원장**(`ast30_book_fund_fee`)을 다시 만든다. ③ [보수인출거래 재생성]은 `f_create_fundFeeRcvTr(_officeMng)`가 보수인출일에 **입금 거래·결제·분개**(`ast06_tr`·`ast07_settle`·`act02_journal`)를 0004의 입금계좌로 만든다. [BATCH 재실행]은 0003과 같은 배치다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS(28000) 자금·회계 담당(시험은 104) |
| 언제 | 매일 확인, ICAM 보수가 바뀌었을 때 재생성 |
| 먼저 있어야 하는 것 | 0003(`icam10_fee`), 0004(입금계좌), 운용사(`sys15_corp`)와 사무관리 계약(`biz13_with_corp`) |
| 다음 이벤트 | 0006 월말잔액·대사, AST 미수 보수 화면(`Ast30_Lookup_FeeDetail`), ACT 전표 |
| 실제 실행 | 2026-11-14, API(104). 2026-04-19 사무관리보수 AS-IS total 754 = 754(첫 100행, 그리드 13열). 금액 수정 10,562 → 10,563 → 되돌림(kalpa 401은 404). **[보수발생내역 가져오기] → 400**(⚠#241). [보수원장 재생성] 운용사 `202208050325133`·펀드 `18001A`·시작 2026-04-19 → `ast30` **+208**(2026-04-19~2026-11-13 날마다 1행, 04-19 이후 발생 0이라 잔액 −419,419 이월). [보수인출거래 재생성] 같은 조건 → 달력 209일 함수 호출, `ast06`·`ast07`·`act02` 변화 없음(그 사이 인출일 없음). kalpa 401의 같은 요청은 자기 회사라 0행 |
| 메뉴 | #1199 관리회계 > 30. 사무보수관리 > ICAM 펀드보수 발생내역 (10개 회사). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS | #1199 | 기간·검색어 → [조회] (`GET /icam/fees?companyId=&feeType=20407&startDate=&closeDate=`) | 기준일·운용사·펀드·적요·차대·금액·통화·보수인출일·수탁사(페이징) |
| 2 | 〃 | 〃 | 행 더블클릭 → `Icam10_Lookup_FundFee`에서 금액 → [저장] (`PUT /icam/fees/{feeId} {fee}`) | 금액 바뀜 |
| 3 | 〃 | 〃 | [ICAM발생내역 가져오기] → 기간·운용사(`Sys15_Lookup_Corp`)·펀드 → [보수발생내역 가져오기] (`POST /icam/fees/icam-fund-fee`) | 원본: "정상정으로 수행되었습니다." **TOBE: 400** |
| 4 | 〃 | 〃 | 같은 창 [보수원장 재생성] (`POST /icam/fees/fee-books {feeType, startDate, corpId, corpCode, fundCode}`) | "정상정으로 수행되었습니다." |
| 5 | 〃 | 〃 | 같은 창 [보수인출거래 재생성] (`POST /icam/fees/rcv-trs`) | 〃 |
| 6 | 〃 | 〃 | [BATCH 재실행] (`POST /icam/fees/batch {actionCode:"icamOfficeMngFee"}`) | **TOBE: 400**(#241) |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `icam10_fee` | 발생보수 금액 | 1행 10,562 → 10,563 → 10,562 |
| `ast30_book_fund_fee` | 날짜별 펀드보수 미수 원장(당일 발생·누계·미수·확정) | **+208**(18001A 2026-04-19~11-13, 남겨 둠 — 원본 함수 결과 그대로) |
| `ast06_tr`·`ast07_settle`·`act02_journal`·`act03_journal_dtl` | 보수인출 입금 거래·결제·분개 | 변화 없음 |

## 업무 규칙 · 주의

- 보수원장은 **어제까지 날마다** 한 줄씩 만든다. 발생내역이 끊긴 날 뒤로도 잔액을 이월한 줄이 생긴다(함수 동작, 원본도 같음).
- 운용사를 비우면(`corpCode` `%`) 회사 전체 함수(`f_create_fundFeeBook`·`f_create_fundFeeRcvTr`), 고르면 운용사 함수(`…2`·`_officeMng`). 운용보수(20402)는 늘 회사 전체(원본 `Icam10_Fee.createFeeRcvTr` L220-229와 같음).
- 함수가 `Y`가 아니면 그 메시지를 보이고 멈춘다(예: "기준일이후 펀드보수 결산자료가 존재합니다"). TOBE는 한 트랜잭션이라 앞서 끝난 날도 되돌린다(원본은 날마다 커밋되지 않고 같은 세션 — 차이 없음으로 봄).
- 금액 수정은 생성자·생성일시를 바꾸지 않는다(원본 `icam10_fee.updateFee`도 `fee`만).
- 회사 조건: 조회·수정·재생성 모두 로그인 회사. `corpId`(운용사)가 내 회사 운용사인지는 함수가 `p_company_id`로 걸러 다른 회사 자료는 안 바뀐다.

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICAM-BZ-0005
company: 28000 (KFS)
steps:
  - no: 1
    api: GET /api/v1/icam/fees?companyId=28000&feeType=20407&startDate=2026-04-19&closeDate=2026-04-19&limit=100
    expect: total 754
  - no: 2
    api: PUT /api/v1/icam/fees/202604200004141334
    body: {fee: 10563}     # 되돌림 10562
  - no: 3
    api: POST /api/v1/icam/fees/icam-fund-fee
    expect: 400 (#241)
  - no: 4
    api: POST /api/v1/icam/fees/fee-books
    body: {feeType: "20407", startDate: 2026-04-19, closeDate: 2026-04-19, corpId: 202208050325133, corpCode: "1806", fundCode: 18001A}
    expect: ast30_book_fund_fee 18001A 행이 어제까지
  - no: 5
    api: POST /api/v1/icam/fees/rcv-trs
    body: (4와 같음)
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Icam10_Tab_OfficeMngFee`(#1199 E1~E5), `Icam10_Lookup_getICAM`(E2~E4, `serviceCall` L177-213), `Icam10_Lookup_FundFee` L133, 서버 `Icam10_Fee.getICAMFundFee` L50·`updateFee` L165·`createFeeBook` L176-204·`createFeeRcvTr` L206-249, DB 함수 `f_create_fundfeebook(2)`·`f_create_fundfeercvtr(_officemng)`.
- TOBE: `IcamFeeController` L83-104, `IcamFeeService.updateFee` L99-106·`runFundFee` L109-112·`createFeeBook` L116-124·`createFeeRcvTr` L131-139.
- 확인: `compare GET /icam/fees --sql icam10_fee.selectByFeeTypePaging --total-sql …Total --grid Icam10_Tab_OfficeMngFee` 754=754, `api POST /icam/fees/fee-books --track ast30_book_fund_fee` +208(trace `e80cbb9ef84b5c15`), `…/rcv-trs --track ast06_tr,ast07_settle,act02_journal`(trace `91edd63286a19f52`).
</details>
