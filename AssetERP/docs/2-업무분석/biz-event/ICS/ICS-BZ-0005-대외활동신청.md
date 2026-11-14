# ICS-BZ-0005 임직원이 대외활동(외부 강연·기고 등)을 신청하고 결재받는다

> **한 줄 요약** — 임직원이 외부 강연·교육·기고 같은 **대외활동**을 하려면 #1431 대외활동신청에서 활동처·구분·기간·내용·사례금을 등록하고 [상신]하면 **전자결재 문서(B15 임직원 대외활동 승인신고서)**가 만들어져 결재선이 승인하면 신청이 승인된다. 활동이 끝나면 같은 화면에서 **결과보고(B16)**를 상신한다. 상신하려면 회사 관리자가 #1280에서 B15·B16에 **문서분류(양식)**를 지정해 두어야 한다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 임직원 401(신청), 결재자 301 |
| 언제 | 대외활동 전, 후 |
| 먼저 있어야 하는 것 | 회사 관리자의 문서분류지정(`dcr30_link` B15·B16 → 분류 — #1280), 결재 체계(APR) |
| 다음 이벤트 | 결과보고 결재(B16), 대외활동 현황 조회(`Ics35_Tab_ExtrActivityList`) |
| 실제 실행 | kalpa, 2026-11-13. 401이 신청 등록(한국금융연수원, 외부 강연, 2026-12-05, 사례금 300,000) → `ics35_extr_activity` +1. **B15·B16에 분류가 지정돼 있지 않아**(`dcr30_link.dcr30_class_tree_id` 비어 있음) 상신이 거절됨("회사 관리자가 #1280 문서분류지정에서 B15 분류를 지정해야 합니다") → 회사 관리자가 B15 → `임직원 대외활동 승인신고서`, B16 → `임직원 대외활동 결과보고서`로 지정 → `yunhee biz-appr B15`로 상신(401) → 결재자 301 승인 → 문서 상태 30 완료, 신청의 `apprId` 연결(`PUT /ics/extr-activities/{id}/appr-id`) |
| 메뉴 | #1431 준법감시 > 12. 대외활동 > 대외활동신청 (현황 화면 `Ics35_Tab_ExtrActivityList`). kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 0 | 회사 관리자 | #1280 | B15·B16 문서분류 지정 | 상신할 양식 |
| 1 | 임직원 | #1431 | [등록] → 활동처·구분·기간·내용·사례금 → [저장] | 신청 줄 |
| 2 | 〃 | #1431 | 줄 선택 → [상신] → 분류 선택 | 결재 문서, 결재선 |
| 3 | 결재자 | 결재함 | [승인] | 완료(30), 신청에 결재 상태 표시 |
| 4 | 임직원 | #1431 | (활동 후) [결과보고 상신] | B16 문서 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ics35_extr_activity` | 대외활동 신청(결재 ID 연결) | +1 |
| `apr01_appr` 외 | 결재 문서·결재선 | +1 문서 |
| `dcr30_link` | B15·B16 분류 지정 | 2줄 갱신 |

## 업무 규칙 · 주의

- 신청 저장은 **본인 것만**(저장 때 사번이 서버에서 채워짐)이고 현황 조회(`/extr-activities/company`)는 회사 전체다. 결재 ID 연결(`appr-id`·`result-appr-id`) API는 '회사' 검사뿐이다.
- 회사 개설 때 B15·B16 분류가 비어 있어, 회사 관리자가 지정하기 전에는 상신이 안 된다(안내 문구는 있음).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICS-BZ-0005
needs: [APR-BZ-0001, SYS-BZ-0022]
steps:
  - no: 0
    actor: { company: kalpa, user: admin, password: "1111" }
    api: PUT /api/v1/dcr/links
    body: [{ linkId: <B15>, classTreeId: <임직원 대외활동 승인신고서> }, { linkId: <B16>, classTreeId: <임직원 대외활동 결과보고서> }]
  - no: 1
    actor: { company: kalpa, user: "401", password: "1111" }
    api: PUT /api/v1/ics/extr-activities
    body: { extrActivityId: null, regDate: "2026-11-13", activityCorp: 한국금융연수원, activityTgtCd: "10", activityPeriod: "2026-12-05 ~ 2026-12-05", activityDesc: 자산운용 실무 외부 강의, activityPay: 300000 }
    expect: { track: { ics35_extr_activity: +1 } }
  - no: 2
    api: biz-appr B15 --ref <신청> -u 401 --approver 301 --link-path /api/v1/ics/extr-activities/{ref}/appr-id --link-style body --confirm
    expect: { appr_status: 30 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ics35_Tab_ExtrActivity`(#1431 — `dcrChk(linkCode B15|B16)` L294-335, `insertLinkApproval` L337-353), `Ics35_Tab_ExtrActivityList`(현황).
- TOBE: `IcsExtrActivityController`(`/api/v1/ics/extr-activities`·`/appr-id`·`/result-appr-id`), `Ics35_Tab_ExtrActivity.tsx`.
</details>
