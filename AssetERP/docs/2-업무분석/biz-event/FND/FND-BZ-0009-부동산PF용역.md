# FND-BZ-0009 부동산PF 용역을 계약·수행·승인·결과보고한다

> **한 줄 요약** — 부동산PF 주선 등 용역 업무를 다루는 흐름이다. ① 회사가 **수수료 항목**(주선·자문 …, #1375)을 정하고 ② **용역계약**(#1376)을 맺는다(차주·사업장·수수료 항목·기간·담당자·수행계획). 계약 체결은 **전자결재 A60(용역계약체결)** 으로 마무리한다. ③ 담당 직원이 **수행내역**(#1377)을 등록하고(번호·기간·내용·확인자) ④ 확인자(조직장)가 **승인**(#1382)하면 상태가 신청(10) → 승인(20)이 된다. ⑤ 용역이 끝나면 **결과보고서**(#1378)를 **전자결재 A61(용역결과보고서)** 로 올린다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 관리자(수수료 항목), 계약 담당 과장(계약·결재), 직원(수행내역), 조직장(승인) |
| 언제 | PF 용역 계약 때, 수행할 때마다 |
| 먼저 있어야 하는 것 | SYS-BZ-0007 공통코드(EstPfFeeCode), 문서분류지정 A60·A61(#1280), APR 결재 |
| 다음 이벤트 | — |
| 실제 실행 | kalpa, 2026-11-13, API. 수수료 항목 `010 주선수수료`·`020 자문수수료` 등록(010은 아래 삭제 시험에서 지워짐 — 020만 남음). 계약 `(주)칼파개발 / 칼파 송도 물류센터`(2026-11-13~2027-05-31, 담당 김과장) 등록 → 수행내역 1건(401, 확인자 지정) → 승인 → 관리자가 #1280에서 A60·A61 문서분류 지정 → 계획서 **A60 결재 완료**(301 상신 → 201 → 100) → 결과보고서 **A61 결재 완료**. 이후 삭제 검사 시험으로 계약·수행내역을 지움(결재 문서 2건만 남음). 화면 눈 확인 `대기(일괄)` |
| 메뉴 | #1375 부동산PF 수수료, #1376 용역계약체결, #1377 용역수행내역 등록, #1382 용역수행내역 승인, #1378 용역결과보고서. kalpa 메뉴 없음 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 관리자 | #1375 | 수수료 코드·순서·사용기간 → [저장] (`PUT /est/pf-fee-types`) | 수수료 항목 |
| 2 | 계약 담당 | #1376 | [등록] → 차주·사업장·수수료 항목·기간·담당자·수행계획 → [저장] (`PUT /est/pf-contracts`) | 계약 줄 |
| 3 | 계약 담당 | #1376 | [계획서 결재] → 문서분류(A60) → 상신 (`PUT …/{id}/plan-appr-id`) | 결재 문서 연결 |
| 4 | 직원 | #1377 | 계약 선택 → 수행번호·기간·내용·확인자·증빙 → [저장] (`PUT /est/pf-histories`) | 수행내역(신청 10) |
| 5 | 확인자 | #1382 | 신청 건 선택 → [승인] (`PUT …/{id}/confirm?confirm=true`) | 상태 20(승인) |
| 6 | 계약 담당 | #1378 | [결과보고서 결재] → 문서분류(A61) → 상신 (`PUT …/{id}/result-appr-id`) | 결과보고 결재 |

## DB에 남는 것

| 테이블 | 무엇 | kalpa 실행 |
|:---|:---|:---|
| `est01_pf_fee_type` | 수수료 항목 | +1 (`020`) |
| `est02_pf_contract` | 용역계약 | +1 → 삭제 시험으로 0 |
| `est03_pf_history` | 수행내역 | +1 → 삭제 시험으로 0 |
| `apr01_appr` 외 | A60 계획서 · A61 결과보고서(완료 30) | +2 (남음) |
| `dcr30_link` | A60·A61 문서분류 지정 | 2줄 갱신 |

## 업무 규칙 · 주의

- 수행번호는 계약 안에서 중복 불가("이미 사용중인 수행번호입니다"). 승인자 기본값은 로그인 사원의 조직장(`confirmer-parent` → 박부장), 확인자는 저장 때 직접 정한다.
- 결재 상신은 `yunhee biz-appr A60 --ref <계약ID> --link-path '/api/v1/est/pf-contracts/{ref}/plan-appr-id' --link-style body --confirm`로 한 번에 됐다(먼저 #1280에서 A60 분류 지정 필요).
- 같은 수수료 코드를 두 번 저장해도 막지 않는다 → [의심 #172](../../보안_및_버그_의심.md).
- 수행내역 승인은 **지정된 확인자가 아닌 사원도** 누를 수 있다(402가 401의 수행내역을 승인·취소) → [의심 #173](../../보안_및_버그_의심.md).
- 계획서·결과보고서 결재 ID 연결은 없는 문서 ID(`999`)도 받는다 → [의심 #174](../../보안_및_버그_의심.md).
- 계약·수수료 삭제는 서버가 사용 여부를 보지 않는다(수행내역·결재가 있는 계약, 계약이 쓰는 수수료 항목이 그대로 지워짐). 사용 검사(`history-count`·`in-use`)는 화면이 따로 부르는 API뿐이다 → [의심 #175](../../보안_및_버그_의심.md).
- ⚠ 이 이벤트의 삭제 검사 시험(계약·수수료 삭제)은 시험 자료를 직접 지워 이후 이벤트에서 계약을 다시 만들어야 한다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: FND-BZ-0009
needs: [SYS-BZ-0007, APR-BZ-0001]
steps:
  - no: 1
    actor: { company: kalpa, user: admin, password: "1111" }
    api: PUT /api/v1/est/pf-fee-types
    body: [{ feeCode: "010", seq: 1, startDate: "2026-01-01" }, { feeCode: "020", seq: 2, startDate: "2026-01-01" }]
  - no: 2
    api: PUT /api/v1/est/pf-contracts
    body: { borrower: "(주)칼파개발", projectSiteName: "칼파 송도 물류센터", pfFeeTypeId: "{010}", startDate: "2026-11-13", closeDate: "2027-05-31", managerId: "{301}", plan: "…" }
  - no: 3
    actor: { user: "401" }
    api: PUT /api/v1/est/pf-histories
    body: { pfContractId: "{계약}", no: 1, startDate: "2026-11-16", content: "…", personId: "{401}", statusCode: "10", confirmerId: "{301}" }
  - no: 4
    actor: { user: "301" }
    api: PUT /api/v1/est/pf-histories/{id}/confirm?confirm=true
    expect: { status: "20" }
  - no: 5
    api: yunhee biz-appr A60 / A61 --ref {계약} --confirm
    expect: { doc: 30 }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Est01_Tab_PfFeeType`(#1375)·`Est02_Tab_PfContract`(#1376, 결재 A60 `insertLinkApproval`)·`Est03_Tab_PfHistory`(#1377)·`Est03_Tab_PfHistoryConfirm`(#1382)·`Est02_Tab_PfResultReport`(#1378, A61).
- TOBE: `EstPfFeeTypeController`·`EstPfContractController`·`EstPfHistoryController`/`EstPfHistoryService`(save L53-82, updateConfirm L104-107).
</details>
