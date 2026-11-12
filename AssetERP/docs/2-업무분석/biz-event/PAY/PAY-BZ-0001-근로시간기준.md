# PAY-BZ-0001 KFS가 근로시간 기준(주 최대 연장·야간시간·가산 배수)을 정한다

> **한 줄 요약** — #1489 근로시간기준관리는 **모든 고객사가 같이 쓰는 표**(회사 0)다. 적용시작일별로 일일 법정근로시간·주 최대 추가근로시간·야간근로 시작/종료 시각·가산 배수(연장·야간·휴일 이내/초과)를 둔다. 근태 연장근무 신청 창(주 한도·야간 시각, ATT-BZ-0003)과 #1486 주 연장근로 누계(ATT-BZ-0006), 급여의 연장근로수당 계산이 이 표를 읽는다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 관리자(`admin/admin/1111`) |
| 언제 | 근로기준법·회사 규정이 바뀔 때 |
| 먼저 있어야 하는 것 | — |
| 다음 이벤트 | ATT-BZ-0003·0006, PAY-BZ-0004(연장근로수당) |
| 실제 실행 | 2026-11-12, API: KFS가 `2027-01-01` 시험 행 저장(야간 `"22"`·`"06"`) → 연장근무 창에 바로 반영 확인 → 삭제. kalpa 관리자·사원 401 저장 → `ACCESS_DENIED` |
| 메뉴 | #1489 기초자료 > 30. 자산&경영 > 근로시간기준관리(KFS 관리자 메뉴). 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS 관리자 | #1489 | [조회] | 회사 0의 기준 줄(지금 `2026-01-01` 8시간·주 12시간·22:00~06:00·연장 1.5·야간 2.0·휴일 1.5/2.0) |
| 2 | 〃 | 〃 | [등록] → 적용시작일·값 → [저장] | 새 줄 |
| 3 | 〃 | 〃 | 줄 체크 → [삭제] → [예] | 줄 삭제 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `pay34_work_time_config` | 회사 0의 기준 줄 | +1 → −1(시험 뒤 지움) |

## 업무 규칙 · 주의

- 화면은 회사 0을 고정으로 조회한다. TOBE 서버는 저장·삭제를 **KFS 관리자만** 허용한다(`requireSysAdmin`, 원본은 검사 없음 — 보안 보강). 회사별 행(`pay34_company_id` = 고객사)을 만드는 화면은 없지만, 읽는 쪽 SQL은 "회사 행이 있으면 회사 행, 없으면 회사 0"을 쓴다.
- ⚠ **근태 연장근무 창은 적용시작일을 보지 않는다.** 원본 `pay34_work_time_config.getModel`(TOBE `AttMyOvertimeReqMapper.selectTimeConfig`)이 날짜 조건 없이 가장 최근 적용시작일 줄을 고른다. 실행: `2027-01-01` 줄을 넣자 **2026-11-12** 연장근무 창의 야간 시각이 바로 `22`·`06`(새 줄 값)으로 바뀌었다. #1486 목록 SQL은 근무일 기준으로 줄을 골라 두 화면이 서로 다른 기준을 쓴다 → [의심 #73](../../보안_및_버그_의심.md).
- 야간 시작·종료 칸은 글자 칸(빈칸 안내 `00:00`)이고 형식 검사가 없다. `"22"`도 저장되는데, #1486 목록 SQL은 `pay34_nt_start_time::time`으로 바꾸므로 `22`는 오류가 난다(`'22'::time` → invalid input) → [의심 #73].

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: PAY-BZ-0001
steps:
  - no: 1
    actor: { company: admin, user: admin, password: "1111" }
    api: GET /api/v1/pay/work-times
    expect: { rows: 1, first: { startDate: "2026-01-01", weekMaxAddHours: 12, ntStartTime: "22:00" } }
  - no: 2
    api: PUT /api/v1/pay/work-times
    body: [{ startDate: "2027-01-01", dayWorkHours: 8, weekMaxAddHours: 12, ntStartTime: "22:00", ntEndTime: "06:00", otMultRate: 1.5, ntMultRate: 2.0, holiStdMultRate: 1.5, holiOverMultRate: 2.0 }]
    expect: { track: { pay34_work_time_config: +1 } }
  - no: 2b
    actor: { company: kalpa, user: "401", password: "1111" }
    api: PUT /api/v1/pay/work-times
    expect: { error: ACCESS_DENIED }
  - no: 3
    actor: { company: admin, user: admin, password: "1111" }
    api: DELETE /api/v1/pay/work-times
    body: [<id>]
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Pay34_Tab_WorkTimeConfig`(E0~E5, buildGrid L102-127 — 야간 칸 TextField), 서버 `pay.Pay34_WorkTimeConfig.selectByCompanyId` L24·`getModel` L34(SQL `getModel` L33-43, 날짜 조건 없음)·`update` L44·`delete` L49.
- TOBE: `PayWorkTimeController`(`/api/v1/pay/work-times` GET·PUT·DELETE), `PayWorkTimeService`, `AttMyOvertimeReqMapper.xml` `selectTimeConfig` L200-209, `AttOvertimeReqMapper.xml` L103-111.
</details>
