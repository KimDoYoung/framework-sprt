# ICS-BZ-0013 준법감시인이 준수확인 문항을 새 버전으로 고쳐 확정한다

> **한 줄 요약** — 임직원 준수확인서(ICS-BZ-0004)의 문항은 **적용일별 버전**이다. 준법감시인은 #1309 내부통제 준수리스트 관리에서 [등록]으로 **새 기준 적용일**을 만든다(가장 최근 버전의 문항·답변 선택지가 통째로 복사된다). 문항을 추가·수정·미사용 처리하고 [확정]하면 그날부터 임직원 작성 목록에 **확정된 최신 버전**이 쓰인다. 확정 전 버전은 직원에게 안 보이고, 작성이 시작된 버전은 지울 수 없다(화면 검사). 예외 사원은 [예외사원 등록]으로 정한다. (#1313은 같은 화면의 KFS용 메뉴로 회사 0 자료를 본다.)

| 항목 | 내용 |
|:---|:---|
| 누가 | 준법감시인 박부장 201 |
| 언제 | 내부통제 기준·문항이 바뀔 때 |
| 먼저 있어야 하는 것 | 기존 버전(회사 개설 때 복사됨), 준법감시인 지정 |
| 다음 이벤트 | 임직원이 새 버전으로 준수확인서 작성(ICS-BZ-0004) |
| 실제 실행 | kalpa, 2026-11-13. 201이 새 기준일 `2026-12-01` 등록 → 기존 5문항·답변 5건 복사(`ics30` +5·`ics33` +5) → 새 문항 `02-3` 추가·`02-2` 미사용 처리 후 저장 → 확정 전 301 작성 목록은 이전 버전 5문항 → [확정] 뒤 301 목록 6문항(신규 포함) → 사원 401이 확정 취소·문항 수정·**버전 삭제**까지 함(⚠) → 시험 버전 삭제(`ics30`·`ics33` 원래 수로 돌아옴). 사용 중인 `2025-10-01`의 `has-write`는 true. 예외사원 등록은 시험하지 않음 |
| 메뉴 | #1309 준법감시 > 20. 임직원 내부통제 준수 > 내부통제 준수리스트 관리(#1313 기초자료는 KFS용). kalpa 메뉴 없음(API). 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 준법감시인 | #1309 | [등록] → 기준 적용일 → [확인] | 위쪽 버전 목록에 새 줄(확정 안 됨), 아래에 복사된 문항 |
| 2 | 〃 | #1309 | 버전 선택 → [행 추가] 또는 문항 고침 → [저장] | 문항 변경 |
| 3 | 〃 | #1309 | 문항 [미사용] 체크 → 미사용 적용일자 → [저장] | 그 날부터 미사용 |
| 4 | 〃 | #1309 | 답변(예·아니오·해당없음) 탭에서 선택지 고침 | 답변 선택지 |
| 5 | 〃 | #1309 | 버전 선택 → [확정] → 확인 | 확정 표시 |
| 6 | 임직원 | #1310 | 작성 화면 | 확정된 최신 버전 문항 |
| 7 | 준법감시인 | #1309 | 확정 전 버전 → [삭제] | 버전·문항·답변 삭제 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ics30_compliance` | 문항(적용일·준수항목·내부번호·내용·해당없음 사용·사용·미사용 적용일자) | +5(복사)·+1(추가) → 삭제로 −6 |
| `ics33_compliance_answer` | 문항 유형별 답변 선택지 | +5(복사) → 삭제로 −5 |

## 업무 규칙 · 주의

- 새 버전은 **가장 최근 버전을 통째로 복사**한다(`selectLatest`). 확정 전 버전은 직원 목록에 안 나온다(`dateFixYn`).
- 직원 목록은 기준월에 맞는 **확정된 최신 버전**을 쓴다. 이미 작성된 달의 문항은 그 시점 버전을 따른다.
- ⚠ 일반 사원이 확정 취소·문항 수정·버전 삭제를 할 수 있다 → [의심 #144](../../보안_및_버그_의심.md). 미사용 적용일자 없이 미사용 저장 → 계속 보인다 → [의심 #145](../../보안_및_버그_의심.md).
- 서버는 사용 중인 버전 삭제를 막는지 시험하지 않았다(원본은 화면이 `has-write`로 막음).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICS-BZ-0013
needs: [ICS-BZ-0004]
steps:
  - no: 1
    actor: { company: kalpa, user: "201", password: "1111" }
    api: POST /api/v1/ics/compliances/dates
    body: { startDate: "2026-12-01", dateFixYn: "false" }
    expect: { track: { ics30_compliance: +5, ics33_compliance_answer: +5 } }
  - no: 2
    actor: { company: kalpa, user: "201", password: "1111" }
    api: PUT /api/v1/ics/compliances
    body: { rows: [{ complianceId: 0, startDate: "2026-12-01", complianceType: "020", subNum: "02-3", content: "[시험] 신규 문항", naUseYn: "false", useYn: "true" }], deleteIds: [] }
    expect: { track: { ics30_compliance: +1 } }
  - no: 3
    actor: { company: kalpa, user: "201", password: "1111" }
    api: PUT /api/v1/ics/compliances/dates/fix
    body: { startDate: "2026-12-01", dateFixYn: "true" }
  - no: 4
    actor: { company: kalpa, user: "301", password: "1111" }
    api: GET /api/v1/ics/compliance-writes?stdDate=2026-12-01&cycleType=M&checkBox=false
    expect: { rows: 6 }
  - no: 5
    actor: { company: kalpa, user: "201", password: "1111" }
    api: DELETE /api/v1/ics/compliances/dates?startDate=2026-12-01
    expect: { track: { ics30_compliance: -6, ics33_compliance_answer: -5 } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ics30_Tab_Compliance`(#1309·#1313)·`Ics30_Lookup_Insert`·`Ics33_TabPage_ComplianceAnswer` — 서버 `Ics30_Compliance.insert·updateList·updateDateFixYn·deleteByDate`, `Ics33_ComplianceAnswer`.
- TOBE: `IcsComplianceController`(`/compliances`·`/compliances/dates`·`/dates/fix`·`/dates/has-write`·`/compliance-answers`).
</details>
