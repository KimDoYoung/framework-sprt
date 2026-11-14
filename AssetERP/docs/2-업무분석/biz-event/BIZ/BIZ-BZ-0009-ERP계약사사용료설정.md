# BIZ-BZ-0009 KFS가 AssetERP 기본설정·계약사·사용료 설정을 관리한다

> **한 줄 요약** — KFS가 #1402 AssetERP 계약사관리에서 AssetERP를 쓰는 **고객사 계약**(`biz51_erp_cont_corp` — 거래처·계약상태·서비스 종류·최초/(재)계약일·만료일·ERP 사용기간·고객사 회사·담당자·대표·주소)을 관리하고, 계약사별 **사용료 설정**(`biz52_erp_fee` — 적용기간·시스템 사용료·데이터 사용료·청구일·부가세·입금기한·SMS/서버/사용자 추가요금 기준)을 기간별로 둔다. [기본설정] 창은 모든 계약사의 기본 단가(SMS 기본 건수·추가 단가, 서버, 사용자, 청구일 — `biz50_erp_setup`)와 청구 안내 문구·청구 메일 양식을 관리한다. 0010 사용료 청구가 이 설정을 쓴다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 영업·계약 담당(회사 28000, 시험은 기본 계정 104) |
| 언제 | 고객사 계약·재계약·요금 변경 때 |
| 먼저 있어야 하는 것 | 고객사(회사 개설 SYS-BZ-0001), 거래처(`sys15_corp`) |
| 다음 이벤트 | BIZ-BZ-0010 사용료 청구 |
| 실제 실행 | 회사 28000, 2026-11-14, API. 목록 AS-IS 3 = 3(그리드 22열), 기본설정 2 = 2. **kalpa와의 시험 계약** `202611149150321`(2026-11-01 ~ 2027-10-31, 구독형, 거래처는 시험이라 기존 `브이엠자산운용(주)`) + 사용료 설정 1행(시스템 500,000·데이터 100,000, 청구일 20일, 입금 30일, SMS 2,000건 넘으면 건당 30원, 사용자 5명 넘으면 1인당 10,000원) → AS-IS 1 = 1, 기준일 사용료 조회 확인. **kalpa 사원 401이 KFS 계약사를 만들고 지움**(⚠#232 쓰기 재현) |
| 메뉴 | #1402 KFS > 11. ERP 계약사관리 > AssetERP 계약사관리 (KFS 회사 메뉴). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS | #1402 | 상태 콤보·검색어 → [조회] (`GET /biz/erp-cont-corps`) | 계약사·서비스·계약일·만료일·ERP 기간·고객사 회사(location)·사용료 요약·첨부 수 |
| 2 | 〃 | 〃 | [등록] 또는 행 편집 셀 → 편집 창 (`GET /erp-cont-corps/next-id`·`/{id}`, `POST /erp-cont-corps`) | 계약 저장 |
| 3 | 〃 | 〃 | 행 사용료 셀 → 사용료 창: 적용기간·요금·추가요금 기준 → [저장]·[삭제] (`GET`·`PUT`·`DELETE /biz/erp-fees`) | 기간별 사용료 |
| 4 | 〃 | 〃 | [기본설정] → 창: 시작일별 기본 단가 (`GET`·`PUT`·`DELETE /biz/erp-setups`) · 안내 문구 (`GET`·`PUT /erp-setups/note`) · 청구 메일 양식 (`GET`·`PUT /erp-setups/mail-form`) | 기본 단가·문구 |
| 5 | 〃 | #1402 | 체크 → [삭제] → 확인창 [예] (`DELETE /erp-cont-corps`) | 계약 삭제 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `biz51_erp_cont_corp` | 고객사 계약 | +1(`202611149150321` kalpa 시험 계약, 0010에서 씀). 401 위조 1행은 지움 |
| `biz52_erp_fee` | 계약사·기간별 사용료 | +1(`202611149150322`) |
| `biz50_erp_setup` | 기본 단가·문구·메일 양식(회사 구분 없음) | 그대로 |

## 업무 규칙 · 주의

- 사용료 조회 `erp-fees/current`는 기준일이 적용기간 안에 드는 행 하나다. 청구(0010)의 기본값이 된다.
- 모든 API가 KFS 관리자 검사 없이 열려 있어 **고객사 사원이 KFS 계약 자료를 보고 만들고 지운다** → [의심 #232](../../보안_및_버그_의심.md). ICAM 계약사(0007)와 달리 회사 조건도 없다(`biz50`·`biz51`은 KFS 한 벌뿐이라 조건이 없음).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: BIZ-BZ-0009
company: 28000 (KFS)
steps:
  - no: 1
    api: GET /api/v1/biz/erp-cont-corps
  - no: 2
    api: POST /api/v1/biz/erp-cont-corps
    body: {erpContCorpId: "{next-id}", corpId: 202208050325133, contStatusCd: "1", serviceType: "10", firstContDate: 2026-11-01, contDate: 2026-11-01, contEndDate: 2027-10-31, erpStartDate: 2026-11-01, erpEndDate: 2027-10-31, companyId: 202611109046432}
  - no: 3
    api: PUT /api/v1/biz/erp-fees
    body: [{erpContCorpId: "{id}", startDate: 2026-11-01, closeDate: 2027-10-31, erpFee: 500000, dataFee: 100000, chargeDay: "20", vatCd: "1", depositDueDay: "30", addFeeSmsYn: "true", smsBaseCount: 2000, smsAddPrice: 30, addFeeUserYn: "true", userBaseCount: 5, userAddPrice: 10000, userCountStdCd: "1", chargeCalcMonthType: "1"}]
  - no: 4
    api: GET /api/v1/biz/erp-fees/current?erpContCorpId={id}&stdDate=2026-11-30
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Biz51_Tab_ErpContCorp`(#1402 E0~E9), 사용료 창 `Biz52_*`, 기본설정 창 `Biz50_*`, 서버 `Biz51_ErpContCorp.selectByContStatusCode` L24-31(회사 조건 없음)·`insertUpdate`·`deleteList`, `Biz52_ErpFee`, `Biz50_ErpSetup`.
- TOBE: `BizErpContCorpController` L28-56, `BizErpFeeController`, `BizErpSetupController`(검사 `⚠없음`).
- 확인: `compare GET /biz/erp-cont-corps --sql biz51_erp_cont_corp.selectByContStatusCode --param 'searchText=%%' --grid Biz51_Tab_ErpContCorp` 3=3, `erp-fees` 1=1, `erp-setups` 2=2.
</details>
