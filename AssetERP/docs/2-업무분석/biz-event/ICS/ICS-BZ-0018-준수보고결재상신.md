# ICS-BZ-0018 준법감시인이 준수보고를 결재 상신한다(A32)

> **한 줄 요약** — #1312 내부통제 준수보고에서 준법감시인이 한 주기의 **전 직원 준수 결과**(ICS-BZ-0004)를 확인한 뒤 [상신]하면 보고 PDF(RD)를 만든 다음 **A32 결재문서**를 쓴다. 서버는 상신 전에 **회사·기간·주기·구분(1 회사 전체 / 2 본인)별 보고 행**(`ics32_relate_appr`)을 먼저 만들고, 결재문서가 만들어지면 그 행에 문서 ID를 연결한다. 화면에는 상신 상태(`상신→완료`)와 [문서보기]가 나온다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 준법감시인 박부장 201(상신), 결재자 김사장 100 |
| 언제 | 매 주기 준수확인을 마친 뒤 |
| 먼저 있어야 하는 것 | ICS-BZ-0004, 문서분류지정 A32, 결재 체계(APR) |
| 다음 이벤트 | 완료 문서 보관·감독 보고 |
| 실제 실행 | kalpa, 2026-11-13. 회사 관리자가 A32 문서분류를 `내부통제 체크리스트`로 지정(⚠ 시험 설정이 남음) → 201이 보고 행 생성(`2026.11`·M·구분 1, `ics32` +1) → 보고 `GET /ics/compliance-reports` 21행 → A32 결재문서(상신 201 → 결재 100) 작성·상신 → 보고 행에 연결 → 상태 `상신` → 100 승인 → `완료`. ⚠ 사원 401이 완료된 보고의 연결 문서를 임의 문서로 바꾸고 새 보고 행도 만듦(복원 후 행 1건 남음). RD(PDF) 확인 안 함 |
| 메뉴 | #1312 준법감시 > 20. 임직원 내부통제 준수 > 내부통제 준수보고(준감인). kalpa 메뉴 없음(API). 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 0 | 회사 관리자 | #1280 | A32 문서분류 지정 | 상신 양식 |
| 1 | 준법감시인 | #1312 | 연도·월 → [조회] | 직원별 준수 결과 |
| 2 | 〃 | #1312 | [상신] → (RD 생성) | 보고 행 생성, 결재문서 창 |
| 3 | 〃 | 결재문서 창 | 제목·본문·결재선 → [결재요청] | 상태 `상신` |
| 4 | 결재자 | 결재함 | [승인] | 상태 `완료` |
| 5 | 준법감시인 | #1312 | [문서보기] | 결재문서 창 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `dcr30_link` | A32 ↔ 문서분류 | 1줄 갱신(남음) |
| `ics32_relate_appr` | 기간·구분별 보고 ↔ 결재문서 | +1(보고 행, 남음)·+1(401 시험 행 ⚠ 남음) |
| `apr01_appr`·`apr04_appr_step` | 결재문서·결재선 | +1·+2 |

## 업무 규칙 · 주의

- 보고 구분은 `1`(회사 전체)·`2`(본인)뿐이고 `2`면 사원 ID가 붙는다(서버 검사).
- 상태는 `statusCode`(10 상신·30 완료 등)와 `statusName`으로 돌려준다.
- ⚠ 연결·행 생성 API가 `본인·회사`·`회사` 검사뿐이라 사원이 연결을 바꾸고 새 행을 만든다 → [의심 #149](../../보안_및_버그_의심.md).
- 보고서(`GET /ics/compliance-reports`)는 사원 401도 21행(전 직원) 받는다 — 같은 메뉴 권한 문제다([의심 #133](../../보안_및_버그_의심.md)과 같은 유형).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICS-BZ-0018
needs: [ICS-BZ-0004, APR-BZ-0001]
steps:
  - no: 0
    actor: { company: kalpa, user: admin, password: "1111" }
    api: PUT /api/v1/dcr/links
    body: [{ linkId: <A32>, classTreeId: <내부통제 체크리스트> }]
  - no: 1
    actor: { company: kalpa, user: "201", password: "1111" }
    api: POST /api/v1/ics/compliance-reports/relate-apprs
    body: { yyyymm: "2026.11", cycleType: M, apprType: "1" }
    expect: { track: { ics32_relate_appr: +1 } }
  - no: 2
    actor: { company: kalpa, user: "201", password: "1111" }
    api: [GET /api/v1/apr/apprs/new, PUT /api/v1/apr/apprs/{id}  # mode request, linkCode A32]
    expect: { appr_status: 10 }
  - no: 3
    actor: { company: kalpa, user: "201", password: "1111" }
    api: PUT /api/v1/ics/compliance-reports/relate-apprs/{1단계}/appr-id
    body: { apprId: <2단계>, rdGroupId: null, yyyy: "2026", cycleName: 11월 }
  - no: 4
    actor: { company: kalpa, user: "100", password: "1111" }
    api: POST /api/v1/apr/apprs/{id}/confirm
    body: { action: confirm, message: 확인 }
    expect: { appr_status: 30 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ics31_Tab_ComplianceReport`(#1312) — 서버 `Ics32_RelateAppr.insert·updateApprId·selectByCompanyId`, `Dcr30_Link.selectByLinkCode`(A32), `Sys99_Print.insertComplianceState`.
- TOBE: `IcsComplianceReportController`(`/compliance-reports`·`/relate-apprs`·`/relate-apprs/{id}/appr-id`·`/rd-state`)·`IcsComplianceReportService`.
</details>
