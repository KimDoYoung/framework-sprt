# BIZ-BZ-0004 준법감시인이 법인카드 사용내역(이익제공 입력 여부)을 본다

> **한 줄 요약** — 준법감시인이 #1138 법인카드 사용내역 조회에서 기준년월(`yyyy.mm`)·카드 관리자·제공 목적·검색어로 **전 직원의 법인카드 내역**과 직원이 0002에서 붙인 목적·내용·인원·결재상태를 페이지로 보고, 월 합계 금액을 본다. [출력/다운로드]·[엑셀다운로드]는 RD 출력(`sys99_print`)을 만든다. #1321은 같은 내용의 간소화 출력이다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 준법감시인(kalpa는 과장 301로 실행) |
| 언제 | 매월, 카드 내역 마감 뒤 |
| 먼저 있어야 하는 것 | BIZ-BZ-0002(직원 입력·상신), CRD-BZ-0002·0003(카드 내역·관리자) |
| 다음 이벤트 | BIZ-BZ-0005 한도초과 현황 |
| 실제 실행 | kalpa, 2026-11-14, API(조회). 301 `GET /biz/promos/card-contents?dataYm=2026.11` total 2(김사원 주유소 80,000·호텔 220,000) → AS-IS `selectCardContentsPaging` 2 = 2(그리드 12열). 월 합계 300,000. 카드 관리자 콤보 `공통`·`김사원`. **402(사원)도 같은 목록을 받음**(⚠#235). RD 출력은 `대기(일괄)` |
| 메뉴 | #1138 준법감시 > 40. 이익제공(수령)현황 > 법인카드 사용내역 조회 · #1321 (s)법인카드사용내역. kalpa 메뉴 없음. 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 준감인 | #1138 | 화면 열림 — 관리자 콤보(`GET /promos/card-managers?stdYm=`)·목적 콤보 | 기준년월은 이번 달 |
| 2 | 〃 | 〃 | 기준년월(`2026.11`)·관리자·목적·검색어 → [조회] 또는 Enter (`GET /promos/card-contents`, 페이지 `offset`·`limit`) | 마감·카드명·사용자·승인일·가맹점·업종·금액·목적·내용·인원·결재상태 |
| 3 | 〃 | 〃 | (같이) 월 합계 (`GET /promos/card-contents/total-amount`) | 합계 금액 |
| 4 | 〃 | 〃 | 행 클릭 | 아래 인원(직원·거래처) |
| 5 | 〃 | 〃 | [출력/다운로드] (`POST /card-contents/rd-print`) · [엑셀다운로드] (`POST /card-contents/rd-download`) · #1321 (`rd-download-simple`) | RD 뷰어 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| (조회만) | | |
| `sys99_print` | RD 출력 때만 사용자별 임시 행 | 안 함 |

## 업무 규칙 · 주의

- 기준년월은 `biz01_std_ym`(`yyyy.mm`, 카드 내역 확정 월) — 승인일 월이 아니다. API에 `2026-11`을 주면 0건이다.
- 관리자 조건은 `f_get_crdManagerId(카드, 제공일) LIKE 관리자||'%'` — 빈 값이면 전체.
- 사원도 이 API를 부를 수 있다 → [의심 #235](../../보안_및_버그_의심.md).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: BIZ-BZ-0004
company: kalpa
as: 301
steps:
  - no: 1
    api: GET /api/v1/biz/promos/card-managers?stdYm=2026.11
  - no: 2
    api: GET /api/v1/biz/promos/card-contents?dataYm=2026.11
    expect: total 2
  - no: 3
    api: GET /api/v1/biz/promos/card-contents/total-amount?dataYm=2026.11
    expect: 300000
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Biz01_Tab_CardContents`(#1138 E0~E8), `Biz01_Tab_CardContentsSimple`(#1321), SQL `biz01_promo.selectCardContentsPaging` L42-44·`selectCardContentsTotal`·`selectByAmt`, `sys00_common.selectBizCardManager`.
- TOBE: `BizPromoController`(`/promos/card-contents`·`/total-amount`·`/card-managers`·`/card-contents/rd-print`·`rd-download`·`rd-download-simple`).
- 확인: `compare GET /biz/promos/card-contents -p dataYm=2026.11 --sql biz01_promo.selectCardContentsPaging --param 'providePurCode=%' --param offset=0 --param limit=100 --grid Biz01_Tab_CardContents` 2=2.
</details>
