# ICAM-BZ-0008 운용사가 ICAM 운용보수 발생내역을 가져오고 본다

> **한 줄 요약** — 운용사가 #1214 ICAM 운용보수 발생내역에서 기간·펀드(`Icam10_Lookup_FundCode`)로 운용보수(20402) 발생내역(`icam10_fee`)을 본다. 행을 더블클릭하면 금액을 고친다. [출력/다운로드]는 RD 출력 자료(`sys99_print`)를 만든다. [ICAM발생내역 가져오기] 창은 0005와 같다(보수발생내역 가져오기·보수원장 재생성·보수인출거래 재생성, 운용보수는 늘 회사 전체 함수 `f_create_fundFeeRcvTr`).

| 항목 | 내용 |
|:---|:---|
| 누가 | 운용사 자금·회계 담당(시험은 KFS 28000의 104) |
| 언제 | 매일 확인, 월말 출력 |
| 먼저 있어야 하는 것 | 0003(운용보수), 0007(입금계좌) |
| 다음 이벤트 | 0009 월말잔액 |
| 실제 실행 | 2026-11-14, API(104). 2025-01-01~2026-01-02 운용보수 AS-IS total 215 = 215(첫 100행, 그리드 9열). 펀드 조회창(2026-01-02) AS-IS 703 = 703. [출력/다운로드] `POST /icam/fees/rd` → 출력 묶음 ID, `sys99_print` **+215**(조회 건수와 같음). 가져오기 창은 0005와 같음(가져오기 400 ⚠#179). RD 화면 내용 확인은 `대기(일괄)` |
| 메뉴 | #1214 관리회계 > 30. 펀드운용보수관리 > ICAM 운용보수 발생내역 (10개 회사). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 운용사 | #1214 | 기간·펀드(조회창 `GET /icam/fees/funds?stdDate=&searchText=`)·검색어 → [조회] (`GET /icam/fees?feeType=20402&…`) | 기준일·펀드·적요·금액·보수인출일(페이징) |
| 2 | 〃 | 〃 | 행 더블클릭 → 금액 [저장] (`PUT /icam/fees/{feeId}`) | 0005 2단계와 같음 |
| 3 | 〃 | 〃 | [ICAM발생내역 가져오기] → 창 | 0005 3~5단계와 같음 |
| 4 | 〃 | 〃 | [출력/다운로드] (`POST /icam/fees/rd {feeType, startDate, closeDate, fundCode, searchText}`) → RD 보기 | 출력물 |

원본 [BATCH 재실행](E6)은 원본 툴바에서 빠져 있어 TOBE도 그리지 않는다.

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `sys99_print` | 출력 자료(내 것만 지우고 다시 넣음) | +215 |

## 업무 규칙 · 주의

- 출력은 같은 화면·같은 사람의 지난 출력 자료를 지우고 넣는다(원본 `Sys99_Print.insertRdFundMngFee` L3856-3903과 같음).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICAM-BZ-0008
company: 28000 (KFS)
steps:
  - no: 1
    api: GET /api/v1/icam/fees?companyId=28000&feeType=20402&startDate=2025-01-01&closeDate=2026-01-02&limit=100
    expect: total 215
  - no: 2
    api: GET /api/v1/icam/fees/funds?stdDate=2026-01-02
    expect: rows 703
  - no: 3
    api: POST /api/v1/icam/fees/rd
    body: {feeType: "20402", startDate: 2025-01-01, closeDate: 2026-01-02, fundCode: "", searchText: ""}
    expect: sys99_print +215
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Icam10_Tab_FundMngFee`(#1214 E1~E7, `retrieve` L111, [출력/다운로드] L204 `sys.Sys99_Print.insertRdFundMngFee`), `Icam10_Lookup_FundCode`(`icam10_fee.selectFundList`).
- TOBE: `IcamFeeController` L52·L60, `IcamFeeService.searchFunds` L46-51·`insertRdFundMngFee` L58-68, `frontend/src/pages/icam/Icam10_Tab_FundMngFee.tsx` L86·L115.
- 확인: `compare GET /icam/fees … --grid Icam10_Tab_FundMngFee` 215=215, `compare GET /icam/fees/funds --sql icam10_fee.selectFundList --grid Icam10_Lookup_FundCode` 703=703, `api POST /icam/fees/rd --track sys99_print`.
</details>
