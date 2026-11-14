# BIZ-BZ-0006 준법감시인이 이익제공(수령) 상세현황을 본다

> **한 줄 요약** — 준법감시인이 #1136 이익제공 상세현황에서 기간·제공/수령 구분·거래처(MKT 업무활동처 조회창)·사원으로 **법인카드와 현금·물품 이익제공(수령)을 거래상대방 한 명당 한 줄**로 펼쳐 본다(제공일·부서·사용자·목적·내용·상대방 회사·이름·부서·1인당 금액·비고). [출력/다운로드]는 RD `Biz01_Rd_ProvideList`. 간소화 #1322는 거래상대방을 행에 적은 회사·인원수로 보여 준다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 준법감시인(kalpa는 과장 301로 실행) |
| 언제 | 수시, 감사·보고 때 |
| 먼저 있어야 하는 것 | BIZ-BZ-0002·0003 내역·인원 |
| 다음 이벤트 | (BIZ 이익제공 흐름 끝) |
| 실제 실행 | kalpa, 2026-11-14, API(조회). 2026-01-01~12-31 전체 5행 → AS-IS 5 = 5(그리드 11열), 거래처 `삼성` 3 = 3, 사원 402 0 = 0(사원 조건은 참여 직원이 아니라 카드 사용자·등록자), 간소화 4 = 4(그리드 9열). **402(사원)도 5행을 받음**(⚠#235 보강). RD는 `대기(일괄)` |
| 메뉴 | #1136 준법감시 > 40. 이익제공(수령)현황 > 이익제공 상세현황 · #1322 (s)이익제공 상세현황. kalpa 메뉴 없음. 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 준감인 | #1136 | 기간·제공/수령 콤보(바꾸면 바로 조회)·거래처 돋보기(MKT 조회창)·사원 돋보기 → [조회] (`GET /biz/promos/provide-list`) | 상대방 한 명당 한 줄 |
| 2 | 〃 | 〃 | [출력/다운로드] (`POST /promos/provide-list/rd-print`) | RD 뷰어 |
| 3 | 〃 | #1322 | 같은 조건 → [조회] (`GET /promos/provide-list-simple`) · 출력 (`/provide-list-simple/rd-print`) | 행에 적은 거래상대방·인원수 기준 |

## DB에 남는 것

조회만(RD 출력 때 `sys99_print`).

## 업무 규칙 · 주의

- 거래처 조건은 `상대방 이름 LIKE 거래처||'%'`(전체는 `%`), 사원 조건은 `person_id` — 카드 내역은 카드 사용자(실사용자), 현금·물품은 등록자다. 함께한 내부 직원으로는 찾을 수 없다.
- 사원도 이 API를 부를 수 있다 → [의심 #235](../../보안_및_버그_의심.md).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: BIZ-BZ-0006
company: kalpa
as: 301
steps:
  - no: 1
    api: GET /api/v1/biz/promos/provide-list?startDate=2026-01-01&endDate=2026-12-31
    expect: rows 5
  - no: 2
    api: GET /api/v1/biz/promos/provide-list?startDate=2026-01-01&endDate=2026-12-31&crmName=삼성
    expect: rows 3
  - no: 3
    api: GET /api/v1/biz/promos/provide-list-simple?startDate=2026-01-01&endDate=2026-12-31
    expect: rows 4
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Biz01_Tab_PriorApproval`(#1136 E0~E6, `retrieve` L217-236 — 전체 `%`), `Biz01_Tab_PriorApprovalSimple`(#1322), SQL `biz01_promo.selectProvideList` L12·L31-33·L123-126, `selectProvideListSimple`.
- TOBE: `BizPromoController` `/promos/provide-list`·`/provide-list-simple`·`…/rd-print`.
- 확인: `compare GET /biz/promos/provide-list --sql biz01_promo.selectProvideList --param 'provideRcvType=%' --param 'crmName=%' --grid Biz01_Tab_PriorApproval` 5=5·3=3·0=0, simple 4=4.
</details>
