# BIZ-BZ-0008 KFS가 ICAM 최저보수를 계산해 청구한다

> **한 줄 요약** — KFS가 분기 말(청구일자 = 분기 마지막 날)마다 #1210 최저보수 청구에서 **ICAM 계약사별 최저보수 청구 자료**를 만든다. [자료일괄생성](전체)·[계약사별자료생성](한 곳)은 그 분기에 계약 중인 이력(0007)의 최저보수를 계산 구간·일수로 나눠 계산(`biz22_fee_charge_calc`)하고, 운용사(`biz13`)별 청구 행(`biz20_fee_charge` 발생보수·청구보수·세금)과 펀드별 상세(`biz21`, ICAM 펀드 자료)를 만든다. 금액을 고친 뒤 [확정]하고, 청구서 엑셀·PDF를 만들어 [통합상신]으로 결재받는다. [보수입금계좌](`biz29_account`)는 청구서에 찍히는 KFS 계좌다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 영업·정산 담당(회사 28000, 시험은 기본 계정 104) |
| 언제 | 분기 말(분기별 청구), 계약에 따라 월 |
| 먼저 있어야 하는 것 | BIZ-BZ-0007 계약 이력·최저보수·운용사, 보수입금계좌 |
| 다음 이벤트 | 결재(APR) — 통합상신 |
| 실제 실행 | 회사 28000, 2026-11-14, API. 2024-12-31 목록 AS-IS 10 = 10. [계약사별자료생성] 2025-03-31: 그 분기 계약 중 이력 11곳(TOBE·AS-IS `selectContCorp` 11 = 11) 중 `케이핀자산운용`(`202301050852727`) → 청구 2행(운용 2,285,714 · 일임 1,714,285 + 세금 171,428) + 구간계산 1행(운용 최저 4,000,000, 90일), 펀드 상세 0행(ICAM 펀드 자료 없음) → 목록 AS-IS 4 = 4. [확정] 2건 → kalpa 401의 확정취소 0건·결재 연결 404(회사 조건) → **확정된 행 삭제가 API로 됨**(⚠#238) → 나머지 확정취소·삭제, 구간계산 행은 `biz-db-write`로 지움. 엑셀·PDF·통합상신은 `대기(일괄)` |
| 메뉴 | #1210 KFS > 10. ICAM 계약사관리 > 최저보수 청구 (KFS 회사 메뉴). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS | #1210 | 연도·분기 콤보(청구일자 = 분기 말)·검색어 → [조회] (`GET /biz/fee-charges`) | 운용사별 전분기·당분기 발생보수·청구보수·세금·확정·결재상태 |
| 2 | 〃 | 〃 | [자료일괄생성] → 확인창 [예] (`POST /fee-charges/batch` contCorpId 없음) · [계약사별자료생성] → 계약사 조회창 (`batch` contCorpId) | 청구·구간계산·상세 생성(같은 분기는 지우고 다시) |
| 3 | 〃 | 〃 | 행의 [계산] 셀 (`GET /fee-charges/calcs`, 엑셀 `/calcs/excel`) | 구간별 최저보수 계산 근거 |
| 4 | 〃 | 〃 | [등록]·행 수정 → 편집 창 (`GET /fee-charges/next-id`·`/same-corp-count`, `POST /fee-charges`) | 수기 청구 행 |
| 5 | 〃 | 〃 | 체크 → [확정] / [확정취소] (`PUT /fee-charges/confirm`) | 확정 표시. 확정 행은 금액을 못 고친다(편집 창) |
| 6 | 〃 | 〃 | 행 파일 셀 → 청구서 엑셀·PDF (`POST /fee-charges/files/excel`·`/pdf`) · [파일 일괄 다운로드] (`GET /files/zip`) | 계약사별 청구서 |
| 7 | 〃 | 〃 | [통합상신] → 결재 ID (`GET /{id}/appr-check`, `PUT /{id}/appr-id`, 통합 엑셀 `/files/total-excel`) | 결재문서 연결 |
| 8 | 〃 | 〃 | [보수입금계좌] 창 (`GET`·`PUT`·`DELETE /biz/fee-accounts`) | KFS 입금 계좌 |
| 9 | 〃 | 〃 | 체크 → [삭제] → 확인창 [예] (`DELETE /fee-charges`, `realFeeChargeId`) | 당분기 청구 행 삭제 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `biz20_fee_charge` | 운용사·청구일별 발생보수·청구보수·세금·확정(`fix_yn`)·결재 ID | +2 → 확정 → 삭제 −2 |
| `biz22_fee_charge_calc` | 계약사·청구일별 구간 계산(최저보수·일수) | +1 → 청구 행 삭제 뒤 남음 → `biz-db-write`로 지움 |
| `biz21_fee_charge_dtl` | 펀드별 상세(ICAM 펀드 자료) | 0 |

## 업무 규칙 · 주의

- 생성 대상은 분기 시작일~청구일자에 계약 중인 이력(`selectContCorp` — 계약 종료가 지난 곳은 빠진다). 운용사 최초 시작일이 빈 곳은 생성 때 채운다(원본 `createFeeCharge` L17-40).
- 확정 행 삭제 금지는 화면에만 있다 → [의심 #238](../../보안_및_버그_의심.md).
- 다른 회사 사원의 확정·결재 연결·삭제는 회사 조건으로 막힌다(0건·404). 그러나 이 화면도 KFS 관리자 검사는 없다(0007 #236).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: BIZ-BZ-0008
company: 28000 (KFS)
steps:
  - no: 1
    api: POST /api/v1/biz/fee-charges/batch
    body: {chargeDate: 2025-03-31, contCorpId: 202301050852727}
    expect: { track: { biz20_fee_charge: "+2", biz22_fee_charge_calc: "+1" } }
  - no: 2
    api: GET /api/v1/biz/fee-charges?chargeDate=2025-03-31
    expect: rows 4
  - no: 3
    api: PUT /api/v1/biz/fee-charges/confirm
    body: {feeChargeIds: ["{id1}", "{id2}"], fixYn: "true"}
  - no: 4
    api: PUT /api/v1/biz/fee-charges/confirm
    body: {feeChargeIds: ["{id1}", "{id2}"], fixYn: "false"}
  - no: 5
    api: DELETE /api/v1/biz/fee-charges
    body: ["{id1}", "{id2}"]
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Biz20_Tab_FeeCharge`(#1210 E0~E22, `deleteList` L10-11 확정 검사), 서버 `Biz20_FeeCharge.createFeeCharge` L40~·`deleteList` L851-862, SQL `biz20_fee_charge.selectByChargeDate`, `biz11_cont_history.selectContCorp`.
- TOBE: `BizFeeChargeController`(`/api/v1/biz/fee-charges/**`), `BizFeeAccountController`, `Biz20_Tab_FeeCharge.tsx` L170-175.
- 확인: `compare GET /biz/fee-charges --sql biz20_fee_charge.selectByChargeDate --param 'searchText=%%' --grid Biz20_Tab_FeeCharge` 10=10·4=4(그리드 열 `fixYnName`은 TOBE `fixNm`), `mapper-run BizFeeChargeMapper.xml#selectContCorp --compare biz11_cont_history.selectContCorp` 11=11·8=8.
</details>
