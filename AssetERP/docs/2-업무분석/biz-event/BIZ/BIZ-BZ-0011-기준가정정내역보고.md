# BIZ-BZ-0011 KFS가 펀드 기준가 정정내역을 보고한다

> **한 줄 요약** — KFS(펀드 사무관리)가 펀드 기준가격을 정정하면 #1505 기준가 정정내역 보고에 **정정 건**(보고 구분·운용사·펀드·기준가 기준일·정정일·해지 여부·정정 전/후 기준가·과표·수정기준가·최초 인지자·발견 경위·정정 사유·재발 방지책·예탁원/금투협 공시 여부·보상액, 첨부 — `biz60_fund_price_modi`)을 등록하고, 건마다 보고 결재(링크코드 **A75** 기준가 정정 보고 / **A76** 기준가격 변경 발생 보고서)를 올린다. 매월 그 달 정정 건을 묶어 **월 보고(A77)**를 상신한다(`biz61_modi_rpt_relate_appr`).

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 사무관리 담당(회사 28000, 시험은 기본 계정 104 천영임) → 결재자 |
| 언제 | 기준가 정정 때마다, 매월 말 월 보고 |
| 먼저 있어야 하는 것 | 회사 28000의 A75·A76·A77 문서분류 지정(있음. 회사 0에는 없음) |
| 다음 이벤트 | 결재(APR) |
| 실제 실행 | 회사 28000, 2026-11-14, API. 2026.09 목록 AS-IS 3 = 3(그리드 11열), 월 보고 A77 상신(10) 1건. [등록] 번호 받기 `GET /fund-price-modis/new-id` → **늘 500**(⚠#240) → 다른 채번 API 번호로 `ZZ시험펀드1호` 정정 건 저장(+1) → 2026.11 AS-IS 1 = 1 → A76 결재문서 상신(결재 박동진) → 연결(`PUT /{id}/appr-id`) → 목록 결재상태 `상신`. kalpa 401의 결재 연결은 404(회사 조건). 회수(문서 삭제)·정정 건 삭제로 정리. 첨부·월 보고 상신은 `대기(일괄)` |
| 메뉴 | #1505 KFS > 20. 기타 > 기준가 정정내역 보고 (KFS 회사 메뉴). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS | #1505 | 월 이동(`yyyy.mm`)·검색어(운용사·펀드) → [조회] (`GET /biz/fund-price-modis`, 월 보고 `GET /fund-price-modis/month`) | 정정 건 목록(보고 구분·운용사·펀드·기준일·정정일·결재상태·첨부·수정자) + 그 달 월 보고 결재 상태 |
| 2 | 〃 | 〃 | [등록] 또는 행 편집 셀 → 편집 창(번호 `GET /new-id`, 첨부) → [저장] (`PUT /fund-price-modis`) | 정정 건 |
| 3 | 〃 | 〃 | 행 체크 → [상신] → 보고 구분에 따라 A75/A76 결재문서 → 상신 → 연결 (`PUT /fund-price-modis/{id}/appr-id`) | 행 결재상태 |
| 4 | 〃 | 〃 | 문서분류 칸 → [상신](월 보고 A77) → 연결 (`PUT /fund-price-modis/month` `{yyyymm, apprId}`) · [문서보기] | 그 달 월 보고 |
| 5 | 〃 | 〃 | 체크 → [삭제] → "N건을 삭제하시겠습니까?" [예] (`DELETE /fund-price-modis`) | 삭제(결재 상태는 보지 않음 — 원본도 같음) |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `biz60_fund_price_modi` | 정정 건(34열)·결재 ID | +1 → 삭제 |
| `biz61_modi_rpt_relate_appr` | 월(`yyyy.mm`)별 월 보고 결재 | 그대로(2026.09 1건) |
| `apr01_appr` | A76 결재문서 | +1 → 회수로 지워짐 |

## 업무 규칙 · 주의

- 링크코드: 보고 구분에 따라 A75·A76(행별), 월 보고는 A77. 회사 0에는 문서분류가 없어 KFS 회사(28000)에만 지정돼 있다.
- [등록]이 번호 받기에서 막힌다 → [의심 #240](../../보안_및_버그_의심.md)(TOBE만).
- 상신·완료된 정정 건도 지울 수 있다(원본 `deleteChk`도 확인창뿐).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: BIZ-BZ-0011
company: 28000 (KFS)
steps:
  - no: 1
    api: GET /api/v1/biz/fund-price-modis?yyyymm=2026.09
    expect: rows 3
  - no: 2
    api: GET /api/v1/biz/fund-price-modis/new-id     # 지금은 500 (#240)
  - no: 3
    api: PUT /api/v1/biz/fund-price-modis
    body: {fundPriceModiId: "{new-id}", reportType: "2", amCorpName: ZZ칼파자산운용, fundName: ZZ시험펀드1호, priceStdDate: 2026-11-12, modiDate: 2026-11-13, befPrice: 1000.12, aftPrice: 1000.21, modiReason: 배당 반영 누락}
  - no: 4
    api: PUT /api/v1/biz/fund-price-modis/{id}/appr-id
    body: {apprId: "{A76 apprId}"}
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Biz60_Tab_FundPriceModiReport`(#1505 E0~E12, 링크코드 L382-393·L447-479·L566), 편집 창 `Biz60_Edit_FundPriceModi` L136-153(`getSeq`), SQL `biz60_fund_price_modi.selectByText`.
- TOBE: `BizFundPriceModiController` L34-72, `BizFundPriceModiService` L20-33, `BizFundPriceModiMapper.xml` L119.
- 확인: `compare GET /biz/fund-price-modis --sql biz60_fund_price_modi.selectByText --param 'searchText=%%' --grid Biz60_Tab_FundPriceModiReport` 3=3·1=1.
</details>
