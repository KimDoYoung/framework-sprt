# ICAM-BZ-0002 ADMIN이 ICAM 연계 자료를 일괄로 가져온다

> **한 줄 요약** — ADMIN이 #1097 작업용 화면의 버튼으로 cron 배치를 손으로 돌린다: ICAM 종목정보(`icamItem`)·원장(`icamBook`, fnd10)·시세(`icamPrice`)·펀드원장(`icamFundBook`)·공모주 청약(`icamIpo`·공모주38 `crawlingIpo`·IPOStock `scrapingIpo`·미일치 `ipoMismatch`)·알람(`alarm`)·종목명 변경(`changedItemName`)·당일 종목(`icamTodayListItem`)·자문(`icamAdvice`)·파일 누락(`filemissing`)·타사무 보유종목(`extrFundHoldItem`)·경비 요청 메일(`sendExpenseRequest`). 회사 0이면 전체(`ALL`), 아니면 자기 회사. [조회]는 그 회사의 ICAM 연계정보(`icam02_data`).

| 항목 | 내용 |
|:---|:---|
| 누가 | ADMIN(회사 0) — 개발·운영 담당 |
| 언제 | cron이 실패했거나 다시 돌려야 할 때 |
| 먼저 있어야 하는 것 | 0001(펀드·종목), 고객사 ICAM 회사코드 |
| 다음 이벤트 | AST·FND 원장·시세 화면, 0010 운용현황 |
| 실제 실행 | 2026-11-14, API. [조회] `GET /icam/data`(회사 0) AS-IS 0 = 0(그리드 23열). **[ICAM 시세가져오기] `POST /icam/test/batch {actionCode:"icamPrice"}` → 400 "배치 연동(BatchMain)이 아직 없어…"**(⚠#179). **kalpa 사원 401의 `{actionCode:"alarm"}`도 관리자 검사 없이 실행기까지 들어가 같은 400**(⚠#242 — 연결되면 사원이 배치를 돌린다) |
| 메뉴 | #1097 I/F > 10. ICAM > 작업용 (ADMIN·DEMO·PTR·TWO·TEST). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | ADMIN | #1097 | [조회] (`GET /icam/data`) | 회사의 ICAM 연계정보(기일 등) |
| 2 | 〃 | 〃 | 기준일·기간·연도 → 작업 버튼(예: [ICAM 시세가져오기]) (`POST /icam/test/batch {actionCode, stdDate, startDate, closeDate, year}`) | 원본: "처리가 완료되었습니다." **TOBE: 400 안내** |

원본이 툴바에 올리지 않은 버튼(정보코드·연계정보·스케줄 당일미처리·청구보수 TEST·준수 현황표 — E2·E3·E4·E7·E11)은 TOBE도 만들지 않았다.

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| (작업별) `icam04_item`·`fnd10_*`·`icam20_price`·`icam06_fund_book`·`icam25_ipo` … | ICAM에서 읽은 자료 | 그대로 — 화면으로 못 돌림 |

## 업무 규칙 · 주의

- 받는 작업은 `IcamTestService.ACTIONS` 15개뿐(그 밖은 400 `INVALID_INPUT`).
- 회사 0이 아니면 자기 회사만 돌린다(L32). **그러나 ADMIN·KFS 관리자 검사가 없어** 메뉴 없는 고객사 사원도 부를 수 있다 → [의심 #242](../../보안_및_버그_의심.md). 지금은 실행기가 꺼져 있어(#179) 실제로 돌지 않는다.
- 배치 본체는 `/api/v1/batch/{actionCode}`(API key·IP 제한)로는 돈다(서블릿 변환 SB12~SB25).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICAM-BZ-0002
company: 0 (ADMIN)
steps:
  - no: 1
    api: GET /api/v1/icam/data
    expect: rows 0
  - no: 2
    api: POST /api/v1/icam/test/batch
    body: {actionCode: icamPrice, stdDate: 2026-11-13}
    expect: 400 (#179)
  - no: 3
    as: kalpa/401
    api: POST /api/v1/icam/test/batch
    body: {actionCode: alarm}
    expect: 403 이어야 함 (지금 400 — #242)
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Icam99_Tab_Test`(#1097 E1~E21, `batch` L343-479 → `/BatchMain`, `serviceCall` L481-535, `retrieve` L538-553 `icam.Icam02_Data.selectByCompanyId`).
- TOBE: `IcamTestController` L23, `IcamTestService` L20-34, `DisabledIcamBatchRunner.runTest` L48-51, `frontend/src/pages/icam/Icam99_Tab_Test.tsx` L101-130.
- 확인: `compare GET /icam/data --sql icam02_data.selectByCompanyId --grid Icam99_Tab_Test` 0=0.
</details>
