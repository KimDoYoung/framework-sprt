# AST-BZ-0003 자금관리가 지급한 미지급을 결제등록(반제)한다

> **한 줄 요약** — 사업비 전표(PAY-BZ-0012)는 대변에 **미지급비용**을 남긴다. 자금집행결의서(A64, PAY-BZ-0011)가 끝나고 **출금계좌**가 붙은 지출은 #1390 미지급반제처리 목록에 나온다. 자금관리 담당이 줄을 골라 **[결제등록]**(결제일·결제금액·결제계좌, 거래유형 9003 미지급금 결제)하면 결제(`ast07_settle`)와 함께 **차변 미지급비용 / 대변 보통예금** 전표가 생기고 미지급액이 0이 되어 목록에서 빠진다. 결제일이 지나면 예금잔고(0004)에 출금으로 잡힌다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 자금관리(kalpa 과장 301) |
| 언제 | 지급일(자금집행일) |
| 먼저 있어야 하는 것 | PAY-BZ-0012(사업비 전표), PAY-BZ-0011(자금집행 결재 완료), AST-BZ-0002(회사 계좌), 그 계좌의 담당 부서 |
| 다음 이벤트 | AST-BZ-0004(예금잔고), ACT(전표승인·마감) |
| 실제 실행 | kalpa, 2026-11-12, API: PAY-BZ-0011에서 출금계좌 없이 결재가 끝난 집행 줄 2개(다과 55,000·급여(김사원))에 [일괄저장]으로 출금계좌 `우리은행 1002-555-000111` · 집행일 2026-11-25 → #1390 목록 1행(다과, 미지급 55,000 — 급여는 사업비 전표가 없어 대상 아님). AS-IS SQL 1 = 1 → [결제등록] 9003 55,000 → `ast07_settle` +1(`202611129141717`), 전표 `202611129141718`(임시분개 2줄: 2201 미지급비용 D 55,000 · 8888 보통예금 C 55,000 결제계좌, 분개 1줄 차 `5406000000` 미지급비용 / 대 `3101030000` 보통예금) → 목록 0행 |
| 메뉴 | #1390 자금관리 > 20. 사업비관리 > 미지급반제처리. 거래 기준 미수/미지급은 #1092(0007). kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 자금관리 | #1386 | (결재 완료 줄) 체크 → [일괄저장] → 집행일·출금계좌 | 결재 완료여도 지급 전이면 고칠 수 있다(원본 `checkApprStatus` 주석) |
| 2 | 〃 | #1390 | 거래처·검색 → [조회] | 일자·거래처·적요·거래금액·미지급액 |
| 3 | 〃 | 〃 | 줄 체크 → [결제등록] → 결제일·금액·결제계좌·적요 → [저장] | 미지급액이 0이면 목록에서 빠짐. 아래 결제 내역 그리드(Ast07_Grid_History)에 결제 |
| 4 | 〃 | 〃 | 여러 줄 → [일괄 결제등록] | 줄마다 전액 결제 |
| 5 | 〃 | 아래 내역 | [전표변경]·[삭제] | 승인된 전표면 거절 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `pay50_expense` | `pay50_deposit_id`·`pay50_settle_date` | 2줄 갱신 |
| `ast07_settle` | 결제(지출 ID, 거래 ID 0, 결제계좌, 9003) | +1 |
| `act02_journal`·`act06_journal_tmp`·`act03_journal_dtl` | 결제 전표(`act02_tr_id` = 결제 ID) | +1·+2·+1 |
| `ast09_book` | 예금잔고 — 결제일(11-25)이 오늘(11-12)보다 뒤라 [예금잔고정리]에도 아직 없음 | 0 |

## 업무 규칙 · 주의

- 미지급 목록의 사업비 줄 조건: 자금집행 결재 `30` + 출금계좌 있음 + 그 지출 전표에 미지급(22)·미수(12) 대표계정. 거래(`ast06_tr`) 줄은 담당자·담당 부서(`ast10_manager`)만 본다.
- 결제금액이 미지급액보다 크면 "미수/미지급금액을 확인하여 주십시오. 실제발생분보다 많습니다."
- 예금잔고 장부(`f_create_depositBook`)는 기준일부터 **오늘까지**만 만든다 — 미래 결제일의 출금은 그날이 되어야 보인다.
- PAY-BZ-0011의 출금계좌 없는 집행([의심 #104](../../보안_및_버그_의심.md))은 [일괄저장]으로 계좌를 넣어 풀렸다. 원본도 결재 완료 뒤 지급 전이면 집행일·계좌 수정을 허용한다 — [의심 #100](../../보안_및_버그_의심.md)은 "누가"(권한) 문제로 읽는다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: AST-BZ-0003
needs: [PAY-BZ-0012, AST-BZ-0002]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: PUT /api/v1/pay/expenses/settle-deposit
    body: { ids: [<다과>, <급여(김사원)>], settleDate: "2026-11-25", depositId: <우리은행> }
  - no: 2
    api: GET /api/v1/ast/settles/accrueds
    expect: { rows: 1, first: { trCode: "9100", note: 고객 미팅 다과, accruedAmt: 55000 } }
  - no: 3
    api: POST /api/v1/ast/settles
    body: { expenseId: <다과>, settleDate: "2026-11-25", note: 고객 미팅 다과 지급, depositId: <우리은행>, trCode: "9003", amt: 55000, settleAmt: 55000 }
    expect: { track: { ast07_settle: +1, act02_journal: +1, act03_journal_dtl: +1, act06_journal_tmp: +2 } }
  - no: 4
    api: GET /api/v1/ast/settles/accrueds
    expect: { rows: 0 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Pay50_Tab_ExpenseSettle`(#1390 E0~E5, retrieve L174-201, insert L203-225, multiInsert L227-241), `Ast07_Lookup_Settle`(setTrCode L399-413 — 지급 9003), `Ast07_Lookup_SettleMulti`, `Ast07_Grid_History`, 서버 `Ast07_Settle.update`, SQL `ast06_tr.selectByAccrued`(사업비 UNION), `Pay50_Tab_ExpensePayWrite.checkApprStatus` L764-782, DB 함수 `f_create_depositBook`·`f_create_depositBook_run`(오늘까지).
- TOBE: `AstSettleController`(`/api/v1/ast/settles` · `/accrueds` · `/multi` · `/delete` · `/histories`), `AstSettleService.createSettle` L94-125·`finishSettle` L131-151, `PayExpenseService.updateDeposit` L349-356, `AstBookController`(`/deposits/period` · `/deposits/clean`).
</details>
