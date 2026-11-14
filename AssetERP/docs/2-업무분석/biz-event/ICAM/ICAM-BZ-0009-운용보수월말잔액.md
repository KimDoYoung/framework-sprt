# ICAM-BZ-0009 운용사가 운용보수 월말잔액을 본다

> **한 줄 요약** — 운용사가 #1215 ICAM 운용보수 월말잔액에서 월·펀드(`Icam10_Lookup_FundCode`)로 ICAM 말일 보수 잔액(`icam12_fee_book`)을 본다. 조회만 있다. 대사 버튼은 없다(#1200에만 있다).

| 항목 | 내용 |
|:---|:---|
| 누가 | 운용사 자금 담당(시험은 KFS 28000의 104) |
| 언제 | 매월 말 |
| 먼저 있어야 하는 것 | ICAM 말일 잔액(0006 대사 또는 배치) |
| 다음 이벤트 | — |
| 실제 실행 | 2026-11-14, API(104). 2026-03-31 펀드 `19001A`(운용보수 펀드) AS-IS 3 = 3(total 3, 그리드 7열). 펀드 없이는 0006과 같은 774 |
| 메뉴 | #1215 관리회계 > 30. 펀드운용보수관리 > ICAM 운용보수 월말잔액 (10개 회사). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 운용사 | #1215 | 월·펀드(조회창)·검색어 → [조회] (`GET /icam/fee-books?stdDate=&fundCode=`) | 펀드·통화·말일 잔액(페이징) |

## DB에 남는 것

조회만.

## 업무 규칙 · 주의

- `icam12_fee_book`에 보수구분 열이 없다. 그래서 #1215는 #1200과 같은 행(사무관리보수 잔액 포함)을 보여 준다. 다른 점은 펀드 조건이 하나 더 있는 것뿐이다(원본도 같은 `icam12_fee_book.selectByStdDatePaging` — 원본 그대로).

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Icam12_Tab_FundMngFeeBook`(#1215 E2·E4, `retrieve` L73 `icam.Icam12_FeeBook.selectByStdDatePaging`).
- TOBE: `IcamFeeBookService.search` L31-36, `frontend/src/pages/icam/Icam12_Tab_FundMngFeeBook.tsx` L74.
- 확인: `compare GET /icam/fee-books -p fundCode=19001A --sql icam12_fee_book.selectByStdDatePaging --total-sql …Total --grid Icam12_Tab_FundMngFeeBook` 3=3(branch fundCode ON).
</details>
