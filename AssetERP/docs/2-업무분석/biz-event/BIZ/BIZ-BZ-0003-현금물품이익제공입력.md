# BIZ-BZ-0003 직원이 현금·물품 이익제공(수령)을 입력한다

> **한 줄 요약** — 법인카드가 아닌 **현금·물품**으로 거래상대방에게 주거나(이익제공 1) 받은(이익수령 2) 편익을 직원이 #1132 이익제공 입력(현금,물품)에 직접 등록한다(`biz01_promo`, 등록자 = 나). 행마다 제공일·목적·내용·금액·비고를 적고, 아래 그리드에 함께한 직원·거래상대방을 넣는다(`biz02_person`, 0002와 같은 API). 간소화 화면 #1320은 거래상대방 회사·인원수를 행에 직접 적는다. 결재는 없다 — 준법감시인이 0005·0006 현황으로 본다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원 |
| 언제 | 현금·물품을 제공·수령했을 때 |
| 먼저 있어야 하는 것 | BIZ-BZ-0001 한도기준. 목적 콤보는 제공/수령 구분에 따라 `GET /biz/promos/provide-purposes?rcvType=` |
| 다음 이벤트 | BIZ-BZ-0005 한도초과 현황, 0006 상세현황 |
| 실제 실행 | kalpa, 2026-11-14, API. 401 이익수령 2026-11-12 운용(일반)·선물 50,000 "미래에셋증권 명절 선물 수령"(`202611149150294`, 거래처 미래에셋증권 김철수) · 이익제공 2026-11-13 판매(경조)·조의금 100,000(`202611149150295`, 거래처 삼성증권 홍길동) → 목록 AS-IS 전체 2 = 2 · 제공 1 = 1 · 수령 1 = 1(그리드 8열). 간소화 #1320 이익제공 2026-11-14 판매(일반)·선물 30,000 한국투자증권 2명(`202611149150302`). 402 목록 0건(본인 등록분만). **402가 401의 조의금 금액을 1원으로 고침**, 삭제 API는 카드 내역도 지움(⚠#234) → 되돌림 |
| 메뉴 | #1132 준법감시 > 40. 이익제공(수령)현황 > 이익제공 입력(현금,물품) · #1320 (s)이익제공입력(현금,물품). kalpa 메뉴 없음. 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | #1132 | 기간·제공/수령 콤보(전체 `%`) → [조회] (`GET /biz/promos/others`) | 내가 등록한 현금·물품 내역(구분·제공일·목적·내용·금액·인원·비고) |
| 2 | 〃 | 〃 | [등록] → 구분·제공일·목적(구분별 콤보)·내용·금액·비고 → 행 저장 (`POST /promos/others`, 수정은 `PUT /promos/others/{id}`) | 새 행 |
| 3 | 〃 | 아래 인원 그리드 | [직원 추가]·[거래처 추가]·[삭제] (`/biz/people/*`, 0002와 같음) | 인원 수 반영 |
| 4 | 〃 | #1132 | 행 체크 → [삭제] → 확인창 [예] (`DELETE /promos/others`) | 인원까지 지워짐 |
| 5 | 〃 | 〃 | [거래처 관리 바로가기] | MKT 업무활동처 화면으로 이동(거래처 등록) |
| 6 | 〃 | #1320 | [등록] → 구분·제공일·목적·내용·금액·**거래상대방 회사·인원수**·비고 → 저장 (`POST`·`PUT /promos/others/simple`) | 인원 그리드 없이 행에 저장 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `biz01_promo` | 현금·물품 내역(구분 `provide_rcv_type`·제공일·목적·내용·금액·등록자 `reg_emp_id`·거래상대방·인원수) | +3(`…294`·`…295`·`…302`) |
| `biz02_person` | 내역별 인원 | +2(김철수·홍길동) |

## 업무 규칙 · 주의

- 목록은 **등록자 = 나**인 행만 보인다(원본 "로그인한 사용자가 등록한 건만 조회"). 그러나 수정·삭제 API는 등록자를 보지 않는다 → [의심 #234](../../보안_및_버그_의심.md). 삭제는 정산구분도 안 봐서 카드 내역 ID를 주면 카드 사용내역이 지워진다(원본은 회사 조건도 없음).
- 저장 때 한도 점검은 없다. 한도 초과는 0005 현황에서만 드러난다.

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: BIZ-BZ-0003
company: kalpa
as: 401
steps:
  - no: 1
    api: POST /api/v1/biz/promos/others
    body: {provideRcvType: "2", provideDate: 2026-11-12, providePurCode: "20", provideContentCode: "2003", provideAmt: 50000, note: 미래에셋증권 명절 선물 수령}
  - no: 2
    api: POST /api/v1/biz/people/external
    body: {promoId: "{promoId}", targets: [{targetCompanyName: 미래에셋증권, targetEmpName: 김철수, targetOrgName: 리테일본부}]}
  - no: 3
    api: GET /api/v1/biz/promos/others?startDate=2026-11-01&closeDate=2026-11-30
  - no: 4
    api: POST /api/v1/biz/promos/others/simple
    body: {provideRcvType: "1", provideDate: 2026-11-14, providePurCode: "10", provideContentCode: "1003", provideAmt: 30000, provideCompany: 한국투자증권, pepleCount: 2}
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Biz01_Tab_Other`(#1132 E0~E6, `retrieve` L205-219 — `provideRcvType` 전체는 `%`), `Biz01_Tab_OtherSimple`(#1320), 서버 `Biz01_Promo.delete`, SQL `biz01_promo.selectByOther`.
- TOBE: `BizPromoController`(`/promos/others` GET·POST·PUT·DELETE, `/others/simple`, `/provide-purposes`), `BizPromoService.deleteOthers` L190, `BizPromoMapper.xml` `deletePromos` L398.
- 확인: `compare GET /biz/promos/others --sql biz01_promo.selectByOther --grid Biz01_Tab_Other` 전체 2=2(`provideRcvType=%`)·1=1·1=1.
</details>
