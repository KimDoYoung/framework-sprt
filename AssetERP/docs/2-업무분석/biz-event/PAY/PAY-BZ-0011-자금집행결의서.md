# PAY-BZ-0011 자금관리가 집행할 지출을 모아 자금집행결의서를 결재받고 조회한다

> **한 줄 요약** — 자금관리 담당이 #1386 자금집행결의서에서 **[자금집행 예정내역 가져오기]**로 집행할 것을 모은다. 대상은 지출결의서 결재가 끝난 사업비(PAY-BZ-0010)와 결재가 끝난 **급여·퇴직정산**(PAY-BZ-0004·0006), 복리후생·여비교통 등이다. 급여처럼 아직 지출 행이 없는 것은 이때 새 지출 행이 생긴다. 줄마다 **자금집행일·지급방법·출금계좌**를 넣어 [저장](또는 [일괄저장])하고, 여러 줄을 묶어 **[상신]**(링크 A64)한다. 결재가 끝나면 #1400 자금집행결의서 조회에서 집행일별 묶음과 상세를 본다. 다음은 회계처리·미지급반제(PAY-BZ-0012)다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 자금관리(kalpa 과장 301) → 결재자(대표 100) |
| 언제 | 지급일 전(급여일·사업비 지급예정일) |
| 먼저 있어야 하는 것 | PAY-BZ-0010(지출결의서 완료), PAY-BZ-0004·0006(급여·퇴직정산 결재 완료), #1386 [문서분류지정] A64 → `자금집행결의서`, 출금계좌(회사 계좌, `ast01`) |
| 다음 이벤트 | PAY-BZ-0012(회계처리·미지급반제) |
| 실제 실행 | kalpa, 2026-11-12, API: 예정내역 4줄(퇴직정산 이퇴직 3,974,679 · 급여 김사원 3,560,060 · 급여 최사원 2,782,820 · 사업비 고객 미팅 다과 55,000) 중 급여(김사원)·다과 2줄 가져옴(급여는 새 지출 `202611129140343`) → 집행일 2026-11-25 저장 → A64 상신 `202611129140344`(제목 `자금집행결의서-2026-11-25`) → 100 승인 **완료** → #1400 1묶음(2건, 3,615,060). AS-IS와 일치(#1400 목록 1 = 1, 상세 2 = 2) |
| 메뉴 | #1386 자금관리 > 20. 사업비관리 > 자금집행결의서, #1400 같은 곳 > 자금집행결의서 조회. kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 자금관리 | #1386 | [자금집행 예정내역 가져오기] 링크(건수 표시) → 예정내역 창 → 줄 선택 | 가져온 줄(자금집행자 = 나). 급여·퇴직정산 등은 새 지출 행, 세금·4대보험 발생회계가 있으면 그 거래에 지출 ID 연결 |
| 2 | 〃 | 〃 | 줄의 자금집행일·지급방법·출금계좌(계좌 조회창)·비고 → [저장] / 여러 줄 [일괄저장](집행일·출금계좌) | 저장. 상신 진행·완료 줄은 화면이 막는다 |
| 3 | 〃 | 〃 | 줄 체크 → [상신] → 문서분류(A64) → 결재문서 창 → 결재요청 | 집행일별 결의서 상신 |
| 4 | 결재자 | 결재문서 창 | [승인] | `완료` |
| 5 | 자금관리 | #1400 | 기간 → [조회] → 묶음 클릭 | 집행일·제목·건수·합계·상태, 아래에 상세 줄 |
| 6 | 〃 | #1386 | [삭제] / [엑셀다운로드] | 상신 진행·완료·미지급반제 줄은 거절. 사업비·화환·기타출금은 집행 값만 비우고, 급여 등은 지운다 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `pay50_expense` | 급여 지출 새 행 + 자금집행자·집행일·지급방법·`pay50_settle_appr_id` | +1, 2줄 갱신 |
| `apr01_appr`·`apr04_appr_step` | 자금집행결의서(A64) | +1(완료) |
| `dcr30_link` | kalpa A64 → `자금집행결의서` | 1줄 갱신 |

## 업무 규칙 · 주의

- 예정내역(`new-settles`)은 지출결의서 완료 사업비 + 결재 완료 급여·퇴직정산(사원별 차감지급액) 등을 합친 목록이다. 급여 줄은 가짜 ID로 오고 가져올 때 지출 행이 된다.
- 출금계좌(`depositId`)는 회사 계좌(`ast01_class_tree`)다. 이번에는 출금계좌 없이 진행했다(서버 [저장]은 막지 않음, kalpa 회사 계좌 등록 여부는 확인 안 함).
- ⚠ 예정내역을 가져올 때 화면 값(금액)을 그대로 넣는다 — 사원이 급여 2,782,820원을 9,999,999원으로 넣었다 → [의심 #99](../../보안_및_버그_의심.md)(상).
- ⚠ 결재가 끝난 집행 줄의 지급계좌를 사원이 바꿨다(되돌림) → [의심 #100](../../보안_및_버그_의심.md)(상). 결재 ID 연결도 #95와 같다.
- ⚠ 사원이 예정내역(급여 실지급액)을 조회한다 → [의심 #98](../../보안_및_버그_의심.md).
- 결재는 이번에도 손으로 했다(A64 `settle-appr-id` 본문 `{ids, apprId}`) — 수정사항061 #9.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: PAY-BZ-0011
needs: [PAY-BZ-0010, PAY-BZ-0004]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: [GET /api/v1/pay/expenses/new-settles, PUT /api/v1/pay/expenses/take-settles]
    body: [<new-settles 줄 그대로: 급여(김사원) 6000001, 고객 미팅 다과>]
    expect: { track: { pay50_expense: +1 } }
  - no: 2
    api: PUT /api/v1/pay/expenses/settles
    body: [{ expenseId: <급여>, payMethodCode: "10", settleDate: "2026-11-25", settleNote: 11월 급여 },
           { expenseId: <다과>, payMethodCode: "1", settleDate: "2026-11-25", settleNote: 다과비 }]
  - no: 3
    api: [PUT /api/v1/dcr/links (admin, A64 → 자금집행결의서), GET /api/v1/apr/apprs/new-id,
          GET /api/v1/apr/apprs/link-seed?linkCode=A64&refId=<급여>&classTreeId=<분류>&ids=<급여>,<다과>,
          PUT /api/v1/apr/apprs/{apprId} (mode request, linkCode A64), PUT /api/v1/pay/expenses/settle-appr-id { ids, apprId }]
  - no: 4
    actor: { company: kalpa, user: "100", password: "1111" }
    api: POST /api/v1/apr/apprs/{apprId}/confirm
    body: { action: confirm, message: 승인 }
  - no: 5
    actor: { company: kalpa, user: "301", password: "1111" }
    api: [GET /api/v1/pay/expenses/settle-apprs?startDate=2026-11-01&closeDate=2026-11-30, GET /api/v1/pay/expenses/settle-apprs/{apprId}]
    expect: { rows: 1, first: { count: 2건, settleAmt: 3615060, settleApprStatusName: 완료 }, detailRows: 2 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Pay50_Tab_ExpensePayWrite`(#1386 E0~E17, lookupNewExpenseAppr L336-361, preUpdate L513-553, preDelete L560, apprCheck L629-697, updateExpenseApprId L750, checkApprStatus L764-782), `Pay50_Lookup_NewExpenseApprList`, `Pay50_Lookup_UpdateDeposit`, `Pay50_Tab_ExpensePay`(#1400), 서버 `pay.Pay50_Expense`(selectNewExpenseAppr·updateSettleEmpId L241-299·updateDeposit L456-472·initExpenseSettle L351-392·updatesSttleApprId·selectBySettleDate·selectBySettleApprId).
- TOBE: `PayExpenseController`(`/new-settles`·`/take-settles`·`/settles` GET·PUT·`/settle-deposit`·`/init-settle`·`/settle-appr-id`·`/settle-apprs`·`/settle-apprs/{id}`), `PayExpenseService` L315-387·L579-587.
</details>
