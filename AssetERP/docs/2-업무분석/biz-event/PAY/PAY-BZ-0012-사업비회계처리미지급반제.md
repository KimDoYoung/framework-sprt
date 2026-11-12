# PAY-BZ-0012 자금관리가 사업비를 회계처리(전표생성)하고 미지급을 반제한다

> **한 줄 요약** — 자금관리 담당이 #1387 사업비 회계처리에서 **[회계처리대상 확인 및 전표생성하기]** 창을 열어, 지출결의서 결재가 끝난 사업비(PAY-BZ-0010)에 **계정과목**을 넣고 **[전표생성]**한다. DB 함수 `f_create_journalExpense`가 회사의 "사업비 발생(9100)" 분개맵핑대로 **차변 비용·부가세 / 대변 미지급비용** 전표를 만든다. 지급이 끝나면 #1390 미지급반제처리에서 미지급 줄에 [결제등록]해 미지급비용을 지운다. #1399 사업비발생현황은 계정과목별 월 합계를 본다. 급여·퇴직정산은 이 화면의 회계처리 대상이 아니다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 자금관리(kalpa 과장 301) |
| 언제 | 월말(회계 마감 전) |
| 먼저 있어야 하는 것 | PAY-BZ-0010(지출결의서 완료), 회사의 **회계 기초**(대표계정 `act10`·실계정맵 `act13`·거래유형별 분개맵핑 `act11`/`act12` — KFS 관리자 [기초데이터생성]), 미지급반제는 PAY-BZ-0011(자금집행 완료) + **지급계좌**(회사 계좌 `ast01`, AST 고유자산 등록) |
| 다음 이벤트 | (ACT 회계 — 전표승인·마감) |
| 실제 실행 | kalpa, 2026-11-12, API. ① 회계 기초가 없어 첫 [전표생성]은 **분개 0줄 빈 전표**가 됐다(의심 #103) → KFS 관리자 `admin/admin/1111`로 회사 0 기준을 kalpa에 복사(대표계정 65·실계정맵 214·분개맵핑 82/181줄) → 빈 전표 [삭제] → 다과(55,000)에 계정과목 회의비 `0407190000` 저장 → [전표생성] → 전표 `261112001`(차변 회의비 50,000·선급부가가치세 5,000 / 대변 미지급비용 55,000, 임시분개 3줄·분개 2줄, 연관문서 1). #1387 목록 1 = AS-IS 1, 대상 0 = 0. #1399 3줄(급여 6,550,000·퇴직정산 4,009,559·회의비 55,000) = AS-IS 3. ② #1390 미지급반제 목록은 **0행**(AS-IS SQL도 0) — PAY-BZ-0011을 지급계좌 없이 진행했고 kalpa에 회사 계좌가 없다. 결제등록은 `대기`(AST 도메인 선행) |
| 메뉴 | #1387 자금관리 > 20. 사업비관리 > 사업비 회계처리, #1390 같은 곳 > 미지급반제처리, #1399 같은 곳 > 사업비발생현황. kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 0 | KFS 관리자 | 대표계정·실계정맵·#1162 거래유형별 분개맵핑 | 회사 선택 → [기초데이터생성] (회사마다 한 번) | 회사 0 기준이 고객사로 복사 |
| 1 | 자금관리 | #1387 | 위 링크 "회계처리대상 확인 및 전표생성하기"(건수) → 창 | 지출결의서 완료·전표 없는 사업비(복리후생·여비교통 포함, 법인카드 제외) |
| 2 | 〃 | 창 | 계정과목 칸(즐겨찾는 계정 조회창) → [저장] / 줄 체크 → [일괄저장](계정 하나) | 계정과목 저장. 아직 지출 행이 없는 예정내역은 이때 새 행 |
| 3 | 〃 | 창 | 줄 체크 → (하나의 전표로 생성하기) → [전표생성] → 확인 | "전표가 생성되었습니다". 아래 그리드에 전표번호·연관문서 |
| 4 | 〃 | #1387 | 줄 선택 → 아래 분개 / [전표수정] 셀 / [삭제] | 승인된 전표·회계마감은 삭제 거절. 사업비(10)·화환(20)·기타출금 지출은 전표만 풀고 그 밖은 지출 행도 지움 |
| 5 | 〃 | #1390 | 거래처·검색 → [조회] → 줄 체크 → [결제등록]/[일괄 결제등록] | 미지급액이 줄어 0이면 목록에서 빠짐 (이번엔 0행) |
| 6 | 〃 | #1399 | 기준년도 → [조회] / [엑셀다운로드](RD) | 계정과목 × 1~12월 합계 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `act10_repr_account`·`act13_real_account_map`·`act11_tr_map`·`act12_journal_map` | kalpa 회계 기초(0단계) | +65·+214·+82·+181 |
| `pay50_expense` | `pay50_account_cd`(회의비)·`pay50_journal_id` | 1줄 갱신 |
| `act02_journal` | 전표(전표번호 `f_create_journal_no`) | +1 |
| `act06_journal_tmp`·`act03_journal_dtl` | 임시분개(맵 3줄)·분개(차·대 2줄) | +3·+2 |
| `com01_relate_appr` | 전표 ↔ 지출결의서(A63) 연관문서 | +1 |
| `ast07_settle` | 미지급반제 결제 | (대기) |

## 업무 규칙 · 주의

- 분개는 거래유형 `9100 사업비 발생` 맵대로다: `9999`(사용자지정 = 지출의 계정과목) 차변 `amt`, `1902` 부가세 차변 `tax`, `2201` 미지급비용 대변 `settle_amt`. 계정과목이 비면 "계정과목이 존재하지 않습니다".
- 회계마감(`act05_gen_ledger_close`)이 발생일 이후로 있으면 생성·삭제 모두 거절.
- 급여·퇴직정산은 회계처리 대상 목록(`targetType JOURNAL`)에 없다 — #1399에는 계정과목(급여·퇴직정산)으로 나온다.
- #1390 사업비 줄은 **자금집행결의서(A64) 완료 + 지급계좌(`pay50_deposit_id`) 있음 + 전표에 미지급(22)/미수(12) 계정**일 때만 나온다.
- ⚠ 사원이 전표를 지우고 만든다 → [의심 #101](../../보안_및_버그_의심.md)(상).
- ⚠ 이미 전표가 있는 지출을 다시 [전표생성]하면 이중 전표 → [의심 #102](../../보안_및_버그_의심.md).
- ⚠ 분개맵핑이 없으면 빈 전표가 '성공'으로 생긴다 → [의심 #103](../../보안_및_버그_의심.md).
- ⚠ 서버가 지급계좌 없는 자금집행을 받아 미지급반제에 영영 안 나온다 → [의심 #104](../../보안_및_버그_의심.md).
- TOBE는 회사를 로그인 정보로 정한다(AS-IS `createJournal`은 화면 행의 `companyId`를 썼다). 새 예정내역 행은 새로 넣은 ID로 함수를 부른다(AS-IS는 임시 ID — 서비스 주석).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: PAY-BZ-0012
needs: [PAY-BZ-0010, PAY-BZ-0011]
steps:
  - no: 0
    actor: { company: admin, user: admin, password: "1111" }
    api: [POST /api/v1/act/repr-accounts/init-data, POST /api/v1/act/real-account-maps/init-data, POST /api/v1/act/tr-maps/init-data]
    body: { companyIds: [<kalpa>], <회사 0의 reprAccountCodes / items(reprAccountCode, accountMap) / items(trCode, journalGroup) 전부> }
    expect: { track: { act10_repr_account: +65, act13_real_account_map: +214, act11_tr_map: +82, act12_journal_map: +181 } }
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: GET /api/v1/pay/expenses/new-journals
    expect: { rows: 1, first: { desc: 고객 미팅 다과, settleAmt: 55000 } }
  - no: 2
    api: PUT /api/v1/pay/expenses/account-codes
    body: { accountCode: null, rows: [<1의 줄, accountCode: "0407190000">] }
  - no: 3
    api: POST /api/v1/pay/expenses/journals
    body: { oneJournalYn: false, rows: [<2의 줄>] }
    expect: { track: { act02_journal: +1, act06_journal_tmp: +3, act03_journal_dtl: +2, com01_relate_appr: +1 } }
  - no: 4
    api: GET /api/v1/pay/expenses/journals?startDate=2026-11-01&closeDate=2026-11-30
    expect: { rows: 1, first: { journalNo: "261112001", journalFixYn: false } }
  - no: 5
    api: GET /api/v1/pay/expenses/account-sums?year=2026
    expect: { rows: 3 }
  - no: 6
    api: GET /api/v1/ast/settles/accrueds
    expect: { rows: 0 }   # 지급계좌 없음 — 결제등록(POST /api/v1/ast/settles)은 대기
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Pay50_Tab_ExpenseJournal`(#1387 E0~E9, setAnchorText L259-287, retrieve L335-357, delete L366-398), `Pay50_Lookup_ExpenseUnJournal`(updateAccount L266-275, preCreateJournal L277-343, createJournal L345-372), `Pay52_Lookup_AccountCode`, 서버 `pay.Pay50_Expense`(selectNewExpenseAppr L80·updateAccountCode L389·createJournal L539-647·deleteJournal L649), DB 함수 `f_create_journalExpense`·`f_create_journalExpense_sub`, `Pay50_Tab_ExpenseSettle`(#1390, `ast.Ast06_Tr.selectByAccrued` L174), `Pay50_Tab_AccountSumList`(#1399, selectExpenseAccountSum L104), 회계 기초 `Act11_Tab_TrJournalMap`(#1162 insertInitData).
- TOBE: `PayExpenseController`(`/journals` GET·POST, `/new-journals`, `/account-codes`, `/delete-journals`, `/account-sums`, `/rd-account-sum-print`), `PayExpenseService` L444-550, `AstSettleController`(`/api/v1/ast/settles/accrueds`·POST·`/multi`), `ActReprAccountController`·`ActRealAccountMapController`·`ActTrMapController` `/init-data`.
</details>
