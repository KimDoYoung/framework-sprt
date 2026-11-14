# ICAM-BZ-0006 사무관리사가 사무보수 월말잔액을 보고 ICAM과 대사한다

> **한 줄 요약** — 사무관리사(KFS 28000)가 #1200 ICAM 펀드보수 월말잔액에서 월을 골라 ICAM이 계산한 펀드별 말일 보수 잔액(`icam12_fee_book`)을 본다. **[ICAM 월말잔액 대사]** 창(`Icam13_Lookup_FeeBookCheck`)에서 [대사]를 누르면 기준일의 ICAM 잔액·대사 결과를 지운다. 이어 ICAM 말일 잔액(`icam12_fee_book.selectLastDayFeeIcamData`)을 다시 읽는데, 사무관리 계약(`biz13_with_corp` 관리유형 1)·이관 펀드(`ast33_fund_trans`)는 빼고 넣는다. 그다음 AssetERP 보수원장(`ast30_book_fund_fee`, 0005)과 맞춰 본다. 차이가 없으면 "차이금액이 없습니다" 한 줄, 있으면 펀드마다 한 줄(`icam13_fee_book_check`)을 남긴다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS(28000) 자금·회계 담당(시험은 104) |
| 언제 | 매월 말 결산 |
| 먼저 있어야 하는 것 | 0005(보수원장), ICAM 말일 잔액 |
| 다음 이벤트 | ACT 결산 |
| 실제 실행 | 2026-11-14, API(104). 2026-03-31 월말잔액 AS-IS total 774 = 774(첫 100행, 그리드 11열). 대사 결과 2023-02-28 AS-IS 46 = 46(그리드 5열). **[대사] `POST /icam/fee-books/checks {stdDate:2026-03-31}` → 400 "ICAM 연동…월말잔액을 가져오지 않았습니다"**(⚠#241). 앞서 지운 `icam12`·`icam13`은 같은 트랜잭션이라 되돌아감(4,491·47 그대로) |
| 메뉴 | #1200 관리회계 > 30. 사무보수관리 > ICAM 펀드보수 월말잔액 (10개 회사). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS | #1200 | 월(`yyyy.mm` → 말일)·검색어 → [조회] (`GET /icam/fee-books?stdDate=`) | 운용사·펀드·통화·말일 잔액·미수·확정(페이징) |
| 2 | 〃 | 〃 | [ICAM 월말잔액 대사] → 창 열림 (`GET /icam/fee-books/checks?stdDate=`) | 그 날의 지난 대사 결과 |
| 3 | 〃 | 창 | [대사] (`POST /icam/fee-books/checks {stdDate}`) | 원본: 대사 결과 다시 조회. **TOBE: 400** |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `icam12_fee_book` | ICAM 말일 보수 잔액 | 그대로(지웠다 되돌아감) |
| `icam13_fee_book_check` | 대사 결과(결과 문장·차이금액) | 그대로 |

## 업무 규칙 · 주의

- 대사는 "지우고 다시 넣기"다. TOBE는 ICAM 읽기가 실패하면 지운 것도 되돌린다(한 트랜잭션).
- ICAM 읽기와 계약·이관 펀드 거르기(원본 L24-50)는 TOBE에서 `IcamBatchRunner.runLastDayFeeBook`에 들어 있다. 이것이 꺼져 있어 대사가 안 된다 → [#241](../../보안_및_버그_의심.md). 배치 쪽에는 `icam12_fee_book.selectLastDayFeeIcamData.csv` 시뮬레이터 자료가 있다.
- 회사는 로그인 회사로 고정.

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICAM-BZ-0006
company: 28000 (KFS)
steps:
  - no: 1
    api: GET /api/v1/icam/fee-books?stdDate=2026-03-31&limit=100
    expect: total 774
  - no: 2
    api: GET /api/v1/icam/fee-books/checks?stdDate=2023-02-28
    expect: rows 46
  - no: 3
    api: POST /api/v1/icam/fee-books/checks
    body: {stdDate: 2026-03-31}
    expect: 400 (#241), icam12·icam13 그대로
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Icam12_Tab_OfficeMngFeeBook`(#1200 E1~E4), `Icam13_Lookup_FeeBookCheck` L117·L128, 서버 `Icam12_FeeBook.selectByStdDatePaging` L20, `Icam13_FeeBookCheck.checkFeeBook` L36-119.
- TOBE: `IcamFeeBookController` L33-51, `IcamFeeBookService` L31-67, `DisabledIcamBatchRunner.runLastDayFeeBook` L36-39.
- 확인: `compare GET /icam/fee-books --sql icam12_fee_book.selectByStdDatePaging --total-sql …Total --grid Icam12_Tab_OfficeMngFeeBook` 774=774, `compare GET /icam/fee-books/checks --sql icam13_fee_book_check.selectByStdDate --grid Icam13_Lookup_FeeBookCheck` 46=46, `api POST … --track icam12_fee_book,icam13_fee_book_check`.
</details>
