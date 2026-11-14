# ICS-BZ-0022 대외활동을 마치고 결과보고를 결재받는다(B16)

> **한 줄 요약** — ICS-BZ-0005에서 승인(B15)받은 대외활동이 끝나면, 임직원이 #1431 대외활동신청에서 그 건의 **[결과보고 상신]**을 눌러 **B16 임직원 대외활동 결과보고서**를 결재 상신한다. 결재선이 승인하면 신청에 결과보고 결재 ID가 연결되고 #1432 신청내역에 결과 상태가 나온다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 신청자 김사원 401, 결재자 김과장 301 |
| 언제 | 대외활동을 마친 뒤 |
| 먼저 있어야 하는 것 | ICS-BZ-0005(승인 30 완료된 신청), 문서분류지정 B16 |
| 다음 이벤트 | 대외활동 현황 조회(ICS-BZ-0014) |
| 실제 실행 | kalpa, 2026-11-13. 승인 완료된 신청(한국금융연수원 외부 강연)에 `yunhee biz-appr B16`으로 결과보고 상신(401, `임직원 대외활동 결과보고서 - 김사원(한국금융연수원)`, 상태 10) → `PUT /ics/extr-activities/{id}/result-appr-id` 연결 → 301 승인 → 30 완료. `ics35_result_appr_id`가 채워짐. ⚠ 402가 남의 신청의 결과보고 연결을 없는 ID(1)로 바꿈(401이 되돌림) |
| 메뉴 | #1431 준법감시 > 12. 대외활동 > 대외활동신청 (현황 #1432). kalpa 메뉴 없음(API). 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 0 | 회사 관리자 | #1280 | B16 문서분류 지정(ICS-BZ-0005에서 해 둠) | 상신 양식 |
| 1 | 신청자 | #1431 | 승인된 신청 행 선택 → [결과보고 상신] | 결재문서 창(B16) |
| 2 | 〃 | 결재문서 창 | 제목·본문·결재선 → [결재요청] | 신청 행에 결과보고 상태 `상신` |
| 3 | 결재자 | 결재함 | [승인] | 결과보고 `완료` |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `apr01_appr`·`apr04_appr_step` | B16 결재문서·결재선 | +1·+결재선 |
| `ics35_extr_activity` | `result_appr_id`(결과보고 결재 ID) | 1줄 갱신 |

## 업무 규칙 · 주의

- 결과보고는 신청 승인(`appr_id`)이 끝난 건에 하는 것이 업무 순서지만, 서버는 그 순서·신청자 본인·결재문서 종류(B16)를 검사하지 않는다.
- ⚠ `result-appr-id`·`appr-id` 연결 API가 '회사' 검사뿐이라 사원이 남의 연결을 바꾼다(원본도 같음) → [의심 #155](../../보안_및_버그_의심.md).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICS-BZ-0022
needs: [ICS-BZ-0005, APR-BZ-0001]
steps:
  - no: 1
    actor: { company: kalpa, user: "401", password: "1111" }
    api: biz-appr B16 --ref <승인된 신청> -u 401 --approver 301 --link-path /api/v1/ics/extr-activities/{ref}/result-appr-id --link-style body --confirm
    expect: { appr_status: 30, ics35_result_appr_id: not null }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ics35_Tab_ExtrActivity`(#1431) 결과보고 상신 버튼, 서버 `Ics35_ExtrActivity.updateResultApprId` L61-68(검사 없음).
- TOBE: `IcsExtrActivityController` `PUT /extr-activities/{id}/result-appr-id`·`IcsExtrActivityService.updateResultApprId`.
</details>
