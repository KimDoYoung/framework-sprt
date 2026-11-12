# PAY-BZ-0009 직원이 사업비 지출을 요청하고 부서장이 승인한다

> **한 줄 요약** — 직원이 #1383 사업비 지출요청에서 **[등록]** 창에 지출구분(사업비요청·화환신청…)·발생일·적요·내용·지출처·공급가액/세액·지급예정일·지급방법·**승인자**를 넣어 저장하고(증빙 결재문서 연결·첨부 가능) **[요청하기]**로 신청(10)한다. 승인자(부서장)는 #1384 사업비 지출승인(부서장)에서 자기에게 온 요청을 **승인(20)·반려(30)**하고, 반려건은 [알림발송]으로 요청자에게 알린다. 승인된 요청은 경영관리팀의 지출결의서(PAY-BZ-0010)로 넘어간다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원(kalpa 사원 401) → 부서장(과장 301) |
| 언제 | 수시 |
| 먼저 있어야 하는 것 | EMP-BZ-0001(직원), 거래처(SYS-BZ-0010, 지출처 고를 때), 계정과목(경영관리) |
| 다음 이벤트 | PAY-BZ-0010(지출결의서) |
| 실제 실행 | kalpa, 2026-11-12, API: 401 등록(사업비요청, 고객 미팅 다과, 공급가 50,000·세액 5,000·합계 55,000, 승인자 301) `202611129140325` → [요청하기] 10 → 301 #1384에 1건 → 승인 20. 목록 AS-IS와 일치(#1383 1 = 1, #1384 1 = 1) |
| 메뉴 | #1383 신청 > 80. 사업비 신청 > 사업비 지출요청, #1384 같은 곳 > 사업비 지출승인(부서장). kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | #1383 | [등록] → 지출구분·발생일·적요·내용(편집기)·지출처·면세구분·공급가액·세액·지급예정일·지급방법·지급계좌·[승인자] → [저장] (증빙: [불러오기]·[신규문서 작성]으로 결재문서 연결, [파일업로드]) | 요청 줄(승인상태 빈칸). 등록창이 열릴 때 번호(`next-id`)를 먼저 받아 첨부·증빙을 그 번호에 붙인다 |
| 2 | 〃 | 〃 | 줄 체크 → [요청하기] → 확인창 [예] | 승인상태 `신청`(10). 이미 신청·승인·반려된 줄은 "이미 … 건이 있습니다"(화면 검사) |
| 3 | 부서장 | #1384 | 기간 · 미처리만 체크 → [조회] | 자기에게 온 요청만(승인자 = 로그인 사원) |
| 4 | 〃 | 〃 | 줄 체크 → [승인] / [반려](사유) | `승인`(20, 승인일 오늘) / `반려`(30) |
| 5 | 〃 | 〃 | [반려건 알림발송] | 요청자별로 묶어 알림(앱·메일), 보낸 표시 |
| 6 | 직원 | #1383 | (신청 상태에서) [요청취소] | 상태 빈칸 → 수정·삭제 가능 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `pay50_expense` | 요청 줄(요청자·승인자·승인상태·승인일·사유·금액) | +1 (`202611129140325`, 승인 20) |
| `com01_relate_appr`·`sys10_file` | 증빙 결재문서 연결(`com01_key_table_id` = 요청 ID)·첨부(쓴 경우) | 0 |

## 업무 규칙 · 주의

- 승인상태 코드는 `StatusCode`: 10 신청 · 15 대기 · 20 승인 · 30 반려 · **80 PASS**(경영관리 바로등록). (`ConfirmStatusCode`의 10 승인·20 반려와 다르니 헷갈리지 말 것.)
- 등록창의 기본 승인자는 `f_get_confirmer_parent(사원, 오늘)`인데 kalpa에서는 비어 나온다(조직장 미지정으로 보임) — 화면에서 [승인자]로 직접 골랐다.
- 요청자·등록일은 서버가 정하고, 수정은 본인 요청·승인상태 빈칸일 때만 된다(TOBE 추가).
- ⚠ 승인 API가 승인자 본인인지 보지 않는다 — 401이 자기 99만원 요청을 직접 승인했다 → [의심 #92](../../보안_및_버그_의심.md)(상).
- ⚠ 승인·반려된 요청도 요청자가 [요청취소]로 상태를 비울 수 있다 → [의심 #93](../../보안_및_버그_의심.md)(중).
- ⚠ 등록 본문 `pass:true`로 부서장 승인을 건너뛴다(PASS 80) → [의심 #94](../../보안_및_버그_의심.md)(상).
- 이번에 쓴 yunhee: `biz-event-new`(뼈대 — 따라 하기 57줄이 위젯 이름이라 버튼만 골라 다시 씀, 수정사항061 #7), `biz-endpoints pay --path expenses`(API 40개 한 표), `biz-code ExpenseType`·`StatusCode`·`--like`.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: PAY-BZ-0009
needs: [EMP-BZ-0001]
steps:
  - no: 1
    actor: { company: kalpa, user: "401", password: "1111" }
    api: [GET /api/v1/pay/expenses/next-id, PUT /api/v1/pay/expenses/mine/{expenseId}]
    body: { expenseCode: "10", occDate: "2026-11-12", desc: 고객 미팅 다과, content: "<p>11월 고객사 미팅 다과 구입</p>", taxType: "3",
            amt: 50000, tax: 5000, settleAmt: 55000, dueDate: "2026-11-30", payMethodCode: "1", confirmerId: <301>, pass: false }
    expect: { track: { pay50_expense: +1 } }
  - no: 2
    api: PUT /api/v1/pay/expenses/mine-status
    body: { ids: [<expenseId>], request: true }
  - no: 3
    actor: { company: kalpa, user: "301", password: "1111" }
    api: GET /api/v1/pay/expenses/confirms?startDate=2026-11-01&closeDate=2026-11-30
    expect: { rows: 1 }
  - no: 4
    api: PUT /api/v1/pay/expenses/confirms
    body: { ids: [<expenseId>], confirmStatusCode: "20", confirmReason: 승인합니다 }
    expect: { pay50_confirm_status_cd: "20" }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Pay50_Tab_ExpenseRequest`(#1383 retrieve L237, deleteRow L253, requestChk L309-398), `Pay50_Lookup_ExpenseRequestInsert`(등록창), `Pay50_Tab_ExpenseConfirm`(#1384), 서버 `pay.Pay50_Expense`(selectByDate·selectByDateConfirm·modelUpdate·updateConfirmStatusCode·updateConfirmReason L487-504·confirmSendMessage L701-812), DB 함수 `f_get_confirmer_parent`.
- TOBE: `PayExpenseController`(`/api/v1/pay/expenses/mine`·`/mine/{id}`·`/mine-status`·`/next-id`·`/confirmer`·`/confirms`·`/confirm-notices`), `PayExpenseService` L150-279, `PayExpenseMapper.xml`.
</details>
