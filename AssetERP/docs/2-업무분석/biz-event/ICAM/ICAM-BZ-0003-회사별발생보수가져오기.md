# ICAM-BZ-0003 ADMIN이 회사별 ICAM 발생보수를 가져온다

> **한 줄 요약** — ADMIN이 #1203 ICAM 보수(관리자용)에서 기간·보수구분(`FundFeeType` 20407 사무관리보수 / 20402 운용보수)·ICAM 운용사(고객사, 비우면 전체)를 골라 **[ICAM 발생보수 가져오기]**를 누르면 배치 `icamOfficeMngFee`·`icamFundMngFee`가 ICAM에서 날짜별 펀드보수 발생내역을 읽어 `icam10_fee`(적요·금액·다음/전 보수인출일)에 넣는다. 고객사 화면 #1199·#1214(0005·0008)는 이 자료를 본다.

| 항목 | 내용 |
|:---|:---|
| 누가 | ADMIN(회사 0) |
| 언제 | 매일(cron), 빠진 날을 다시 가져올 때 |
| 먼저 있어야 하는 것 | 0001(ICAM 펀드), 고객사 ICAM 회사코드 |
| 다음 이벤트 | 0005·0008 발생내역, 0006·0009 월말잔액, 0010 발생보수현황 |
| 실제 실행 | 2026-11-14, API. 회사 28000 사무관리보수 2026-04-01~04-19 AS-IS total 14,669 = 14,669(첫 100행 일치, 그리드 10열). **[ICAM 발생보수 가져오기] `POST /icam/fees/batch` → 400 "ICAM 연동…발생보수를 가져오지 않았습니다"**(⚠#241). kalpa 401의 28000 조회·가져오기는 403 |
| 메뉴 | #1203 I/F > 10. ICAM > ICAM 보수(관리자용) (ADMIN만). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | ADMIN | #1203 | 기간·구분·ICAM 운용사(`Sys01_Lookup_Company`)·검색어 → [조회] (`GET /icam/fees?companyId=&feeType=&startDate=&closeDate=`) | 기준일·운용사·펀드·적요·금액·다음/전 보수인출일·생성일시·생성자(페이징) |
| 2 | 〃 | 〃 | [ICAM 발생보수 가져오기] → 확인 [예] (`POST /icam/fees/batch {actionCode, companyId|ALL, startDate, closeDate}`) | 원본: 배치 결과. **TOBE: 400 안내** |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `icam10_fee` | 날짜·펀드·적요별 발생보수(20열) | 그대로(107,057행 — 28000 대부분) |

## 업무 규칙 · 주의

- 보수구분 콤보를 바꾸면 배치 actionCode가 바뀐다(20407 → `icamOfficeMngFee`, 20402 → `icamFundMngFee`, E1 L129-140).
- 전체(`ALL`)는 ADMIN만, 그 밖은 자기 회사만(`IcamFeeService.runBatch` L83-95). 조회도 자기 회사만(`allowedCompany`).
- 배치 본체 `IcamOfficeMngFeeAction`·`IcamFundMngFeeAction`은 있다(서블릿 변환). 화면 버튼은 [#241](../../보안_및_버그_의심.md).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICAM-BZ-0003
company: 0 (ADMIN)
steps:
  - no: 1
    api: GET /api/v1/icam/fees?companyId=28000&feeType=20407&startDate=2026-04-01&closeDate=2026-04-19&limit=100
    expect: total 14669
  - no: 2
    api: POST /api/v1/icam/fees/batch
    body: {actionCode: icamOfficeMngFee, companyId: "28000", startDate: 2026-04-18, closeDate: 2026-04-19}
    expect: 400 (#241)
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Icam10_Tab_FeeAdmin`(#1203 E1~E6, `batch`·`batchRun` → `/BatchMain`), SQL `icam10_fee.selectByFeeTypePaging`·`…Total`(include `whereCondition` L97).
- TOBE: `IcamFeeController` L38·L76, `IcamFeeService.search` L38-43·`runBatch` L83-95, `DisabledIcamBatchRunner.runFee` L23-26.
- 확인: `compare GET /icam/fees --sql icam10_fee.selectByFeeTypePaging --total-sql …Total --grid Icam10_Tab_FeeAdmin` 100=100·14,669=14,669.
</details>
