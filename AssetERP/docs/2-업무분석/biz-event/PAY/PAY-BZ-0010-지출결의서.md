# PAY-BZ-0010 경영관리팀이 승인된 사업비 요청을 가져와 지출결의서를 결재받는다

> **한 줄 요약** — 경영관리팀이 #1385 지출결의서(경영관리)에서 **[지출요청내역 가져오기]**로 부서장이 승인한(20) 요청을 자기(결의자) 앞으로 가져온다(화환신청은 새 지출로 만든다). 줄을 골라 지출처·계정과목·지급방법 등을 다듬고 여러 줄을 묶어 **[상신]**(링크 A63 사업비 지출결의서)하면 결재가 끝난 지출이 자금집행(PAY-BZ-0011) 대상이 된다. 승인 없이 바로 넣을 때는 **[바로등록]**(PASS 80), 받지 않을 줄은 **[반려]**(사유·알림). 직원 쪽 #1407 지출결의서는 자기 PASS 건을 같은 방법으로 상신하는 화면이다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리팀(kalpa 과장 301) → 결재자(대표 100) |
| 언제 | 수시(요청이 승인될 때마다) |
| 먼저 있어야 하는 것 | PAY-BZ-0009(승인된 요청), #1385 [문서분류지정] A63 → `사업비 지출결의서` |
| 다음 이벤트 | PAY-BZ-0011(자금집행결의서) |
| 실제 실행 | kalpa, 2026-11-12, API: A63 → `사업비 지출결의서` → 301 [지출요청내역 가져오기]로 401 요청 `202611129140325`(55,000원) 가져옴 → A63 상신 `202611129140332`(제목 `지출결의서(고객 미팅 다과)`, 링크 시드) → 100 승인 **완료** → #1386 `new-settles`에 그 줄. #1385 목록 1행(AS-IS 불리언 분기라 `compare` 대조 못 함, 직원 분기는 직접 호출 0 = SQL 0) |
| 메뉴 | #1385 자금관리 > 20. 사업비관리 > 지출결의서(경영관리), #1407 신청 > 80. 사업비 신청 > 지출결의서. kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 경영관리 | #1385 | [지출요청내역 가져오기] 링크 → 요청 목록 창(부서장 승인 20·결의자 없음) → 줄 [선택] | 가져온 줄이 목록에(결의자 = 나). 화환신청은 새 지출 줄 |
| 2 | 〃 | 〃 | 줄 선택 → 오른쪽 편집(지출처·계정과목·지급방법·계좌·비고) → [저장] | 줄 갱신 |
| 3 | 〃 | 〃 | 줄 여러 개 체크 → [상신] → 문서분류(A63 기본) → 결재문서 창 → 결재요청 | 지출결의서 상신, 줄의 상신상태 `상신`. 완료/반려건 제외 체크 시 목록에서 빠짐 |
| 4 | 결재자 | 결재문서 창 | [승인] | `완료` → #1386 지출내역 가져오기 대상 |
| 5 | 경영관리 | #1385 | (받지 않을 줄) [반려] → 사유 / [반려건 일괄 알림발송] / [반려취소] | 요청자·확인자에게 알림 |
| 6 | 〃 | 〃 | [바로등록] → 등록창(`pass`) | 부서장 승인 없이 PASS(80) 줄 |
| 7 | 〃 | 〃 | [삭제] | 상신 진행·완료·회계처리 줄은 거절. 화환·PASS 줄은 지우고, 나머지는 결의자·반려·상신 연결만 비워 요청 상태로 돌린다 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `pay50_expense` | `pay50_appr_emp_id`(결의자)·`pay50_expense_appr_id`(지출결의서) | 1줄 갱신 |
| `apr01_appr`·`apr04_appr_step` | 사업비 지출결의서(A63) | +1(완료) |
| `sys11_relate_file` | 지출 첨부를 결재문서 첨부로 연결(첨부가 있을 때) | 0 |
| `dcr30_link` | kalpa A63 → `사업비 지출결의서` | 1줄 갱신 |

## 업무 규칙 · 주의

- #1385 목록은 승인(20)·PASS(80)이고 결의자가 있는 지출만, PASS는 내가 결의자거나 상신된 것만 보인다(`selectExpenseAppr`). #1407(직원)은 내가 결의자인 PASS 건만.
- 상신은 여러 지출을 한 문서로 묶는다(링크 시드 `ids`). 결재 ID 기록 때 지출 첨부를 결재문서 첨부로 복사한다(TOBE는 문서 ID가 정해질 때).
- ⚠ 결재 ID 연결 API가 아무 지출이나 완료된 결의서에 붙인다 — 사원이 미승인 33만원을 붙여 자금집행 대상에 올렸다 → [의심 #95](../../보안_및_버그_의심.md)(상).
- ⚠ [지출요청내역 가져오기]가 승인상태를 안 보고, 화환 경로로 화면 값만으로 "승인된" 지출을 만든다 → [의심 #96](../../보안_및_버그_의심.md)(상).
- ⚠ 결재 완료된 지출 금액을 사원이 바꿨다(55,000 → 5,500,000, 되돌림) → [의심 #97](../../보안_및_버그_의심.md)(상).
- ⚠ 자금집행 대상 목록에 직원 급여·퇴직금 실지급액이 들어 있고 사원도 받는다 → [의심 #98](../../보안_및_버그_의심.md)(상).
- yunhee: `biz-patch`로 금액 바꾸기·되돌리기를 1줄씩 했다. `compare`는 경로의 쿼리를 빼고 보내 틀린 ❌를 냈다(수정사항061 #8).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: PAY-BZ-0010
needs: [PAY-BZ-0009]
steps:
  - no: 0
    actor: { company: kalpa, user: admin, password: "1111" }
    api: PUT /api/v1/dcr/links
    body: [{ linkId: <A63>, classTreeId: <사업비 지출결의서> }]
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: [GET /api/v1/pay/expenses/requests, PUT /api/v1/pay/expenses/take-requests]
    body: [{ expenseId: <0009 요청>, expenseCode: "10", regEmpId: <401>, occDate: "2026-11-12", desc: 고객 미팅 다과 }]
    expect: { pay50_appr_emp_id: <301> }
  - no: 3
    api: [GET /api/v1/apr/apprs/new-id, GET /api/v1/apr/apprs/link-seed?linkCode=A63&refId=<id>&classTreeId=<분류>&ids=<id>,
          PUT /api/v1/apr/apprs/{apprId} (mode request, linkCode A63), PUT /api/v1/pay/expenses/appr-id]
    body_last: { ids: [<id>], apprId: <apprId> }
  - no: 4
    actor: { company: kalpa, user: "100", password: "1111" }
    api: POST /api/v1/apr/apprs/{apprId}/confirm
    body: { action: confirm, message: 승인 }
    expect: { statusCode: "30", newSettles: { contains: 고객 미팅 다과 } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Pay50_Tab_ExpenseManager`(#1385 E0~E16), `Pay50_Lookup_ExpenseRequestList`, `Pay50_Lookup_RejectReason`, `Pay51_Lookup_ExpenseForm`, `Pay50_Tab_Expense`(#1407 retrieve L291, apprCheck L362-458, updateExpenseApprId L518), 서버 `pay.Pay50_Expense`(selectExpenseAppr·updateApprEmpId L139-209·initExpense L301-349·updateExpenseApprId·rejectSendMessage L814-924).
- TOBE: `PayExpenseController`(`/api/v1/pay/expenses` GET·`/requests`·`/take-requests`·`/{id}` GET·PUT·`/init`·`/reject`·`/reject-notices`·`/appr-id`), `PayExpenseService` L55-149·L565-577, `PayExpenseMapper.xml`(selectExpenseAppr L100-125).
</details>
