# FLT-BZ-0005 직원이 신고 계좌의 초기 보유종목을 등록한다

> **한 줄 요약** — 계좌신고(0004)를 마친 직원은 #1369 사용순서 ③ [초기보유](또는 #1125 [최초원장 등록])에서 기준일 현재 계좌별 보유종목(종목유형·종목명·종목코드·보유수량·보유금액)을 등록한다(`flt13_book_init`). 저장하면 같은 종목의 보유원장(`flt11_book`)을 지우고 기준일 원장을 만든 뒤, DB 함수(`flt10_tr.insertFloorTrBook`)로 **기준일 다음 날부터 오늘까지** 영업일 원장을 이어 만든다. 엑셀 템플릿 업로드도 된다. 이후 매도 사전신고(0007)·정기보고(0008)는 이 원장을 기준으로 잔고를 본다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원(kalpa 사원 401) |
| 언제 | 대상자가 된 뒤 한 번(계좌를 새로 신고했을 때 그 계좌분) |
| 먼저 있어야 하는 것 | FLT-BZ-0004 신고 계좌, FLT-BZ-0001 종목유형(신고대상·주식시세 적용 여부) |
| 다음 이벤트 | FLT-BZ-0006 매수 사전신고, 0007 매도 사전신고, 0011 보유내역 |
| 실제 실행 | kalpa, 2026-11-14(토), API. 초기보유 기준일 없음(`GET /flt/book-inits/init-date` → null), `GET …/check?stdDate=2026-11-13` → ok. 401 `PUT /flt/book-inits` 기준일 2026-11-13 · 키움 주계좌: 삼성전자 `005930` 100주 7,000,000(종목명 뒤 공백은 서버가 지움) · 카카오 `035720` 50주 2,000,000 → `flt13` +2·`flt11` +2(매입단가 70,000·40,000). AS-IS 대조: 초기보유 2 = 2, #1143 보유내역 11-13 2 = 2, 11-14 0 = 0(토요일이라 영업일 원장 없음). **다른 회사 계좌 ID로도 초기보유가 저장됨(⚠#222)** → 지움 |
| 메뉴 | #1369 준법감시 > 10. 임직원매매 > 임직원매매 사용순서 → ③ 초기보유 창, #1125 [최초원장 등록], 결과는 #1143 임직원매매 보유내역. kalpa 메뉴 없음. 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | #1369 ③ | 창 열기 (`GET /flt/book-inits`, `…/init-date`) | 등록한 초기보유, 기준일(처음이면 비어 있음) |
| 2 | 〃 | 초기보유 창 | 기준일 → 확인(`GET …/check?stdDate=` — 그 날 이후 매매가 있거나 결재 중이면 막힘) | |
| 3 | 〃 | 〃 | [행 추가] → 계좌·종목유형·종목(종목 창)·수량·금액 → [저장] (`PUT /flt/book-inits`) | "계좌를 선택하세요"·"종목유형을 선택하세요"·"종목명을 입력하세요"·"보유수량을 입력하세요"·"보유금액을 입력하세요"(예치금 99는 금액 없어도 됨) |
| 4 | 〃 | 〃 | [엑셀 템플릿] (`GET …/template`) → 채워서 [업로드] (`POST …/excel?stdDate=`) | 한꺼번에 등록 |
| 5 | 〃 | #1143 | 기준일 → [조회] (`GET /flt/books/list?baseDate=`) | 계좌·종목별 보유수량·금액 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `flt13_book_init` | 401 초기보유 2종목(2026-11-13) | +2 (남겨 둠) |
| `flt11_book` | 2026-11-13 보유원장 2행(매입단가 = 금액 ÷ 수량) | +2 (남겨 둠) |

## 업무 규칙 · 주의

- 저장할 때 **같은 계좌·종목의 보유원장을 먼저 지우고** 다시 만든다(`flt11_book.deleteByItemName` → `insertByFlt13` → `insertFloorTrBook`). 기준일 뒤 매매가 있으면 원장이 다시 계산된다 — 그래서 `check`가 기준일 이후 매매·결재를 막는다.
- 영업일 원장만 만든다. 토·일 기준일로 #1143을 보면 0행이다(원본 화면은 직전 영업일 `getBizDate`를 기본값으로 쓴다).
- 계좌 ID가 내 신고 계좌인지 서버가 보지 않는다 → [의심 #222](../../보안_및_버그_의심.md).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: FLT-BZ-0005
needs: [FLT-BZ-0004]
steps:
  - no: 1
    actor: { company: kalpa, user: "401", password: "1111" }
    api: GET /api/v1/flt/book-inits/check?stdDate=2026-11-13
    expect: { ok: true }
  - no: 2
    api: PUT /api/v1/flt/book-inits
    body: [ { bookInitId: null, bookDate: "2026-11-13", accountId: "{401 주계좌}", itemType: "10", itemName: "삼성전자", itemCode: "005930", bookQty: 100, bookAmt: 7000000 } ]
    expect: { track: { flt13_book_init: +1, flt11_book: +1 } }
  - no: 3
    api: GET /api/v1/flt/books/list?baseDate=2026-11-13
    expect: { rows: "AS-IS flt11_book.selectByBookList과 같음" }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Flt00_Tab_Info`(#1369) → `Flt13_Lookup_BookInit`(`Flt13_BookInit.getInitDate` L56·`selectByPersonId` L31·`update` L67-129·`delete` L131, `Flt10_Tr.countByTrDate` L368), `Flt11_Tab_BookList`(#1143 `Flt11_Book.selectByBookList` L35, `Flt10_Tr.getBizDate`·`insertFloorTrBook` L394).
- TOBE: `FltBookInitController`(`/api/v1/flt/book-inits`·`/init-date`·`/check`·`/template`·`/excel`), `FltBookInitService` L106·L187(`insertFloorTrBook(…, bookDate + 1)`), `FltBookController` `GET /api/v1/flt/books/list`, 프론트 `Flt13_Lookup_BookInit.tsx` L151-159.
</details>
