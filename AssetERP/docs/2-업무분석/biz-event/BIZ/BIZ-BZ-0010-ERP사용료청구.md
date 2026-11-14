# BIZ-BZ-0010 KFS가 AssetERP 사용료를 청구한다

> **한 줄 요약** — KFS가 매월 #1403 AssetERP 사용료청구에서 청구월(`yyyy.mm`)의 청구 대상 계약사를 골라 [생성]하면, 계약사별 사용료 설정(0009)에 고객사 **전월 SMS 발송 건수**(`sms02_history`)·**기준월 재직 인원**(`emp01_person`·`emp03_trans`)·서버 사용량(`sys10_file`)을 붙여 추가요금·합계·부가세·청구액을 계산한 청구 행(`biz55_erp_fee_charge`)을 만든다. 금액을 고치고 [확정]한 뒤 결재(문서분류 연결)·[일괄메일발송](청구 메일 양식, 발신 기록 `dcr10_mail_history`)으로 고객사에 보낸다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 정산 담당(회사 28000, 시험은 기본 계정 104) |
| 언제 | 매월 청구일(사용료 설정의 청구일) |
| 먼저 있어야 하는 것 | BIZ-BZ-0009 계약·사용료 설정, 고객사의 SMS 발송·인사 자료 |
| 다음 이벤트 | 결재(APR), 메일 발송(DCR-BZ-0006과 같은 발신 기록) |
| 실제 실행 | 회사 28000, 2026-11-14, API. 2026.11 청구 대상 3곳(KFS·한채투TEST·0009의 kalpa 시험 계약). kalpa 시험 계약 [생성] → 청구 1행(청구일 2026-11-20, 시스템 500,000 + 데이터 100,000 + 사용자 추가 30,000(8명 − 기본 5명 = 3명 × 10,000) = 630,000, 부가세 63,000, 청구액 693,000, 전월 SMS 0건) → AS-IS 1 = 1(그리드 16열). 편집 창 기본값 조회(`erp-fees/default`)는 같은 기간 SMS 266건·7명으로 생성 값과 다르다 — 원본도 기본값 SQL(`biz52_erp_fee.selectDefaultData`)과 생성 SQL(전월 `sms02_history`, `emp01_person.getPersonCount`)이 달라 같게 옮김(`mapper-run --compare` 1 = 1). [확정] → **kalpa 사원 401이 자기 회사 청구를 확정취소하고 0원으로 고침**(⚠#239) → KFS가 되돌려 다시 확정 → 시험 자료 정리(확정취소·청구·사용료·계약 삭제). 메일 발송·결재는 `대기(일괄)` |
| 메뉴 | #1403 KFS > 11. ERP 계약사관리 > AssetERP 사용료청구 (KFS 회사 메뉴). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS | #1403 | 청구월·검색어 → [조회] (`GET /biz/erp-fee-charges?stdDate=`) | 계약사별 청구일·기간·사용료·SMS·서버·사용자 추가요금·기타·합계·부가세·청구액·확정·결재·메일 |
| 2 | 〃 | 〃 | [생성] → 대상 계약사 창(`GET /erp-fee-charges/companies`) → 체크 → [확인] (`POST /erp-fee-charges` `{dataYm, erpContCorpIds}`) | 계약사별 청구 행 |
| 3 | 〃 | 〃 | 행 편집 셀 → 창(기본값 `GET /erp-fee-charges/default`) → 금액·기타 조정 → [저장] (`PUT /erp-fee-charges`) | 금액 수정 |
| 4 | 〃 | 〃 | 체크 → [확정] / [확정취소] (`PUT /erp-fee-charges/confirm`) | 확정 표시 |
| 5 | 〃 | 〃 | 확정 행 [상신] → 문서분류 → 결재 ID (`PUT /erp-fee-charges/appr-id`) | 결재 연결 |
| 6 | 〃 | 〃 | 체크 → [일괄메일발송] → 메일 양식(0009) 치환(계약사명·청구일·청구금액) → 발송 | 고객사에 청구서 메일, 발신 기록 |
| 7 | 〃 | 〃 | 체크 → [삭제] → 확인창 [예] (`DELETE /erp-fee-charges`) | 청구 행 삭제 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `biz55_erp_fee_charge` | 계약사·월별 청구(사용료·추가요금·합계·부가세·청구액·확정·결재 ID) | +1(`202611149150323`) → 401이 0원으로 → 되돌림 → 시험 끝에 지움 |
| `dcr10_mail_history` | 청구 메일 발신 기록 | 안 함 |

## 업무 규칙 · 주의

- 계산 기간: 사용료 설정의 `chargeCalcMonthType` = 1이면 청구월, 아니면 전월. SMS·서버는 **전월** 사용량, 사용자는 `userCountStdCd`(1 전월말 · 2 전년말) 직전 인사발령 기준 재직자(퇴사 800·900 제외).
- 추가요금 = (사용량 − 기본) × 단가, 사용량이 기본 이하거나 추가요금을 안 쓰면 0. 합계 = 시스템 + 데이터 + 추가요금 + 기타, 부가세 10%.
- 모든 API에 검사가 없어 **고객사가 자기 청구서를 0원으로 바꿀 수 있다** → [의심 #239](../../보안_및_버그_의심.md)(#232의 쓰기 쪽).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: BIZ-BZ-0010
company: 28000 (KFS)
steps:
  - no: 1
    api: GET /api/v1/biz/erp-fee-charges/companies?stdDate=2026-11-30
  - no: 2
    api: POST /api/v1/biz/erp-fee-charges
    body: {dataYm: "2026.11", erpContCorpIds: ["{erpContCorpId}"]}
    expect: { track: { biz55_erp_fee_charge: "+1" } }
  - no: 3
    api: PUT /api/v1/biz/erp-fee-charges/confirm
    body: {erpFeeChargeIds: ["{id}"], fixYn: "true"}
  - no: 4
    api: GET /api/v1/biz/erp-fee-charges?stdDate=2026-11-30
    expect: rows 1, chargeAmt 693000
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Biz55_Tab_ErpFeeCharge_new`(#1403 E0~E15), 창 `Biz55_Lookup_ErpFeeCharge`(L390 `insertUpdate`, L406 `selectDefaultData`), 서버 `Biz55_ErpFeeCharge.updateErpCompany` L64~(L17-26 계산 기간, L62-92 SMS·서버·인원, L107-125 추가요금), `confirmUpdate` L49, `delete` L279, SQL `biz55_erp_fee_charge.selectByStdDate`, `emp01_person.getPersonCount` L730.
- TOBE: `BizErpFeeChargeController` L35-81, `BizErpFeeChargeService` L67·L99, `BizErpFeeChargeMapper.xml` `selectPersonCount` L293·`selectDefaultData`.
- 확인: `compare GET /biz/erp-fee-charges --sql biz55_erp_fee_charge.selectByStdDate --grid Biz55_Tab_ErpFeeCharge_new` 1=1, `mapper-run …#selectPersonCount --compare emp01_person.getPersonCount`·`#selectDefaultData --compare biz52_erp_fee.selectDefaultData` 1=1.
</details>
