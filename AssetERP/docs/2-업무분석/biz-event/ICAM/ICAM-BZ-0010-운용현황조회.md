# ICAM-BZ-0010 운용현황(펀드합계·기준가·발생보수)을 본다

> **한 줄 요약** — 운용사·사무관리사가 ICAM 자료로 운용현황을 본다. ① #1323 펀드운용현황(펀드합계)은 기간·펀드구분(1 운용 / 2 판매)으로 일자별 원본·순자산·총자산 합계와 평균을 보여 준다(`icam06_fund_book`, ICAM TR 9985). 행을 고르면 그 날의 펀드별 내역이 나온다. ② #1475 펀드별 기준가 현황은 기준일의 펀드별 원본·기준가·과표·순자산과 전일 대비를 보여 준다(`icam06`). ③ #1268 펀드별 발생보수현황(#1494 월별 펀드보수현황도 같은 화면)은 연도별·월별 펀드 발생보수다(`icam10_fee`). 셋 다 [출력/다운로드]·[엑셀다운로드]가 RD 출력 자료(`sys99_print`)를 만든다. **FND-BZ-0011에서 kalpa로 조회만 해 본 화면**이다. 여기서는 자료가 있는 회사로 AS-IS와 맞춰 본다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 운용사 운용·경영관리, 사무관리사 |
| 언제 | 수시, 월말 보고 |
| 먼저 있어야 하는 것 | ICAM 펀드원장(배치 `icamFundBook` — 0002), 발생보수(0003), 회사의 ICAM 회사코드(`icam06`은 `sys01_icam_company_cd`로 JOIN) |
| 다음 이벤트 | — |
| 실제 실행 | 2026-11-14. **펀드원장은 ICAM 회사코드 1921·2111·2218·2292 자료뿐이고, 회사에 연결된 것은 2111(회사 100 "(ICAM연계테스트) 한채투")뿐**이다. 그래서 #1323·#1475는 TOBE 매퍼를 회사 100으로 DB에서 돌려 맞췄다(`mapper-run --compare`). 펀드합계 2025-02-21~03-11 운용·판매 AS-IS 6 = 6, 일자별 내역 2025-03-11 4 = 4, 기준가 2025-03-11 4 = 4. #1268은 KFS 28000(104) API로 2026년 AS-IS 716 = 716(그리드 27열). [엑셀다운로드] `POST /icam/current-fee-by-funds/rd-download` → 출력 묶음, `sys99_print` 716행. 28000의 기준가·펀드합계 출력은 자료가 없어 0행. RD 화면 내용 확인 `대기(일괄)` |
| 메뉴 | #1323 펀드관리 > 20. 운용현황 > 펀드운용현황(펀드합계) · #1475 펀드별 기준가 현황 · #1268 펀드별 발생보수현황 (6개 회사) · #1494 관리회계 > 30. 펀드운용보수관리 > 월별 펀드보수현황 (연결 회사 없음). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 운용사 | #1323 | 기간·펀드구분·검색어 → [조회] (`GET /icam/fund-operate-status?startDate=&closeDate=&fundType=&searchText=`) | 일자별 원본·순자산·총자산·평균 |
| 2 | 〃 | 〃 | 행 선택 (`GET /icam/fund-operate-status/details?stdDate=&fundType=`) | 그날 펀드별 원본·순자산·설정좌수·기준가 |
| 3 | 〃 | 〃 | [출력/다운로드] (`POST /icam/fund-operate-status/rd-print`) | RD |
| 4 | 〃 | #1475 | 기준일 → [조회] (`GET /icam/fund-prices?stdDate=`) · [엑셀다운로드] (`POST /icam/fund-prices/rd-download`) | 펀드별 기준가·과표·순자산과 전일 대비 |
| 5 | 〃 | #1268 | 연도 → [조회] (`GET /icam/current-fee-by-funds?yearText=&preYearText=`) · [엑셀다운로드] (`POST …/rd-download`) | 펀드별 전년·월별 발생보수 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `sys99_print` | 출력 자료 | #1268 716행(같은 사람의 `%Icam10%` 출력 자료를 먼저 지움) |

## 업무 규칙 · 주의

- `icam06_fund_book`에는 회사 ID 열이 없다. 그래서 회사의 ICAM 회사코드로 JOIN한다. **kalpa에는 AST-BZ-0014 때 KFS와 같은 코드 `2018`을 넣어 두었다.** 그래서 ICAM 회사코드로 고르는 자료(펀드원장·기준가 등)는 kalpa와 KFS가 같은 것을 본다(시험 자료 설정, 코드 문제 아님).
- #1268 출력은 원본도 화면 이름을 `"%Icam10%"`(LIKE 무늬)로 넘긴다. 그래서 같은 사람의 #1214 운용보수 출력 자료(`Icam10_Tab_FundMngFee`)까지 지운다(원본 그대로, 임시 출력 자료라 영향 작음).
- 펀드구분 `fundType`은 `1`·`2` 중 하나가 있어야 행이 나온다(SQL `WHERE (:fundType='1' AND …) OR (:fundType='2' AND …)`).
- ICAM 자료를 새로 가져오는 길은 #179.

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICAM-BZ-0010
company: 100 (매퍼 DB 실행) / 28000 (API)
steps:
  - no: 1
    mapper: IcamFundOperateStatusMapper.xml#selectFundBookAvg
    param: {companyId: 100, startDate: 2025-02-21, closeDate: 2025-03-11, fundType: "1", searchText: "%%"}
    expect: rows 6
  - no: 2
    mapper: IcamFundOperateStatusMapper.xml#selectByStdDate
    param: {companyId: 100, stdDate: 2025-03-11, fundType: "1", searchText: "%%"}
    expect: rows 4
  - no: 3
    mapper: IcamFundPriceMapper.xml#selectFundPrice
    param: {companyId: 100, stdDate: 2025-03-11}
    expect: rows 4
  - no: 4
    api: GET /api/v1/icam/current-fee-by-funds?yearText=2026&preYearText=2025
    expect: rows 716
  - no: 5
    api: POST /api/v1/icam/current-fee-by-funds/rd-download
    body: {yearText: "2026", preYearText: "2025"}
    expect: sys99_print 716 (groupId)
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Icam06_Tab_FundOperateStatus`(#1323 E3·E4, L197 `selectFundBookAvg`, L219 `insertRdFundOperateStatus`), `Icam06_Grid_FundOperateStatus` L57, `Icam06_Tab_FundPrice`(#1475 L113·L124), `Icam10_Tab_CurrentFeeByFund`(#1268 L176·L188, `createRdExcel` `windowClassName "%Icam10%"`).
- TOBE: `IcamFundOperateStatusController` L29-50, `IcamFundPriceController` L29-36, `IcamCurrentFeeByFundController` L27-35, `IcamCurrentFeeByFundService` L18.
- 확인: `mapper-run "IcamFundOperateStatusMapper.xml#selectFundBookAvg" --compare icam06_fund_book.selectFundBookAvg` 6=6(운용·판매), `…#selectByStdDate --compare icam06_fund_book.selectByStdDate` 4=4, `IcamFundPriceMapper.xml#selectFundPrice --compare icam06_fund_book.selectFundPrice` 4=4, `compare GET /icam/current-fee-by-funds --sql icam10_fee.getCurrentFeeByFund --grid Icam10_Tab_CurrentFeeByFund` 716=716.
</details>
