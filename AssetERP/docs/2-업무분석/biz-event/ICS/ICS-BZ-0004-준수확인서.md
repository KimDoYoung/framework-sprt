# ICS-BZ-0004 임직원이 내부통제 준수확인서를 쓰고, 준법감시인이 점검·보고한다

> **한 줄 요약** — 모든 임직원은 주기마다 #1310에서 **준수 확인 문항**(선물·접대 수령, 비밀정보 유출 등 5문항)에 예·아니오·해당없음으로 답하고 사유를 적어 **확인자(준법감시인 등)를 골라 [제출]**한다. 확인자는 #1311에서 제출한 사원의 답변을 점검·[확인]하고, #1312에서 **전 직원 준수 결과**(미작성 포함)를 보고서로 보고 결재에 올린다. 문항 자체는 #1309에서 **적용일별 버전**으로 관리하며, 확정된 가장 최근 버전만 임직원에게 보인다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 임직원 301(작성), 준법감시인 박부장 201(점검·보고) |
| 언제 | 매 주기(회사 설정 `icsComplyCycleType` M) |
| 먼저 있어야 하는 것 | 회사 ICS 설정(주기), 준법감시인 지정(ICS-BZ-0003), 확정된 문항 버전(회사 개설 때 기본 문항이 복사돼 있음) |
| 다음 이벤트 | 준수보고 결재 상신(#1312 → APR) |
| 실제 실행 | kalpa, 2026-11-13, API. 회사에는 문항 버전이 2개(2024-01-01 확정 · **2025-10-01 미확정**) 있었다 — 임직원 목록은 **확정된 최신 버전만** 쓰므로 처음에 301이 미확정 버전의 5문항에 답을 저장했을 때 목록에는 안 나왔다(서버는 저장을 받음) → 준수리스트 관리에서 2025-10-01을 **[확정]**(`PUT /ics/compliances/dates/fix`)하자 목록에 5문항이 나옴. ① 301이 2026.11 5문항 답변(Y·N·X·N·X) → [제출](확인자 박부장, 5건) ② 확인자 201 [점검] 미확인 5건 → [확인] 5건 ③ 보고서 `GET /ics/compliance-reports` — 임직원별 문항별 결과(작성 안 한 사람은 `미작성`). 결재 상신(보고 PDF·APR)은 시험하지 않음. ④ 401이 **본인을 확인자로** 지정해 제출 → 401의 점검 목록에 자기 제출이 나옴(시험 뒤 제출취소·삭제) |
| 메뉴 | #1309 내부통제 준수리스트 관리, #1310 준수확인서 작성, #1311 준수점검(준감인), #1312 준수보고(준감인). kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 준법감시 | #1309 | 적용일 선택 → 문항 [등록]·수정 → [저장] → 적용일 [확정] | 확정 버전만 임직원에게 보임 |
| 2 | 임직원 | #1310 | 기준일 → [조회] → 문항별 답·사유 → 확인자 선택 → [제출] | 제출됨 |
| 3 | 확인자 | #1311 | 기준일·작성자 → [조회] → [확인] | 확인됨(미확인 건수는 `unconfirmed-count`) |
| 4 | 〃 | #1312 | 기준일·주기 → [조회] → [상신] | 전 직원 결과표, 결재 문서(RD PDF) |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ics30_compliance` | 준수 문항(적용일 버전·확정 여부) | 2025-10-01 버전 확정으로 갱신 |
| `ics31_compliance_write` | 주기별 작성(답변·제출·확인자·확인) | +5 |

## 업무 규칙 · 주의

- 문항 버전: 임직원 화면은 `date_fix_yn = true` 중 시작일이 가장 늦은 버전만 읽는다. 서버는 **확정되지 않은 버전의 문항에도 답을 저장**하고(목록에는 안 나옴) 작성 월 형식(`YYYY.MM`)도 검사하지 않는다 → [의심 #128](../../보안_및_버그_의심.md).
- 제출 때 **확인자(`confirmerId`)를 작성자가 정한다**. 서버가 그 사람이 준법감시인(또는 지정 확인자)인지 보지 않아, 직원이 **자기 자신을 확인자로 지정**해 제출하고 자기 점검 목록에서 볼 수 있다. 확인(`compliance-confirms/confirm`)도 호출자가 지정 확인자인지 보지 않는다 → [의심 #126](../../보안_및_버그_의심.md).
- 제출·제출취소 때 서버가 결재 상태를 센다(`countApprStatus` 호출 확인) — 결재가 걸린 뒤의 동작은 시험하지 않았다.
- 보고서는 확인자가 아닌 사원도 읽는다(`/ics/compliance-reports` '회사' 검사) → [의심 #124](../../보안_및_버그_의심.md)와 같은 모양.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICS-BZ-0004
needs: [ICS-BZ-0003]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: [PUT /api/v1/ics/compliances/dates/fix, PUT /api/v1/ics/compliance-writes/answers ×5, PUT /api/v1/ics/compliance-writes/fix]
    body: [{ startDate: "2025-10-01", dateFixYn: "true" }, { complianceId, answerCode: Y|N|X, yyyymm: "2026.11", cycleType: M }, { fixYn: true, writeIds: [...], confirmerId: <박부장>, stdDate: "2026-11-13", cycleType: M }]
    expect: { track: { ics31_compliance_write: +5 } }
  - no: 2
    actor: { company: kalpa, user: "201", password: "1111" }
    api: [GET /api/v1/ics/compliance-confirms/unconfirmed-count, PUT /api/v1/ics/compliance-confirms/confirm, GET /api/v1/ics/compliance-reports]
    expect: { unconfirmed: 5, confirmed: 5, report_rows: ≥5 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ics30_Tab_Compliance`(#1309 `Ics30_Compliance.updateList`)·`Ics31_Tab_ComplianceWrite`(#1310 `ics30_compliance.selectByPersonId`·`Ics31_ComplianceWrite`)·`Ics31_Tab_ComplianceConfirm`(#1311 `updateConfirmYn`)·`Ics31_Tab_ComplianceReport`(#1312 `Sys99_Print.insertComplianceState` L324, `Ics32_RelateAppr`).
- TOBE: `IcsComplianceController`·`IcsComplianceWriteController`/`Service`(`selectByPersonId` — 확정 최신 버전·`YYYY.MM`)·`IcsComplianceConfirmController`·`IcsComplianceReportController`(RD PDF `IcsComplianceRdPdfService`).
</details>
