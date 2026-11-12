# PAY-BZ-0004 경영관리팀이 월 급여를 만들고 고친 뒤, 급여대장을 결재받아 확정한다

> **한 줄 요약** — 경영관리팀이 #1270 급여관리에서 구분(급여 01·상여 02·퇴직정산 03·특별수당 04)과 지급일을 정해 **[생성]**하면, 사원마다 급여 줄(`pay10_month`)과 항목(`pay11_month_item`)이 생긴다. 항목은 **결재 완료된 연봉계약**(PAY-BZ-0003)에서 오거나(연봉정보), 전월 급여를 복사한다(전월급여). 4대보험은 취득신고(PAY-BZ-0007)에서, 소득세·지방세는 세액표로 계산된다. 오른쪽 탭에서 근로시간·항목(연장근로수당 등)을 고치면 소득세가 다시 계산된다. #1281은 항목별로 전 직원을 한 번에, #1285는 기간으로 조회한다. 끝으로 #1271 급여대장 **[상신]**(링크 A02)으로 결재를 받는다. 상신부터는 그 구분·지급일의 급여를 고치거나 지울 수 없다("결재진행중인 급여구분입니다").

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리팀(kalpa 과장 301) → 결재자(대표 100) |
| 언제 | 매월 지급일 전(상여·특별수당은 지급 때, 퇴직정산은 퇴사 때 — PAY-BZ-0006) |
| 먼저 있어야 하는 것 | PAY-BZ-0003(결재 완료 연봉계약 — 없으면 빈 급여), PAY-BZ-0002(항목·세액표), #1271 [급여출금계좌](`pay03_account`, 없으면 "급여출금계좌를 먼저 지정해주세요"), #1280·#1271 [문서분류지정] A02 → 급여 문서분류. 4대보험 공제는 PAY-BZ-0007 취득신고(`pay31_insure_apply`)가 있어야 0이 아니다 |
| 다음 이벤트 | PAY-BZ-0005(대장·명세서), 0007(4대보험 정산), 0008(원천징수) |
| 실제 실행 | kalpa, 2026-11-12, API: 301이 급여(01) 지급일 `2026-11-25`로 401·402 생성 → 401 근로시간·연장근로수당 15만 → #1281 기타수당 일괄 추가·금액 → A02 → `급여 > 급여`, 출금계좌 등록 → 급여대장 상신 → (반려 — 아래 #80) → 재상신 `202611129140153` → 100 승인 **완료**. 401 지급 3,700,000·공제 139,940, 402 지급 2,850,000·공제 67,180. 목록 AS-IS와 행 수 일치(#1270 2 = 2, #1281 14 = 14, #1285 14 = 14) |
| 메뉴 | #1270 경영관리 > 04. 급여관리 > 급여관리, #1281 같은 곳 > 급여관리(항목별), #1285 같은 곳 > 급여항목조회, #1271 같은 곳 > 급여대장. kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 경영관리 | #1270 | [생성] → 지급구분 `급여`·지급일 `2026-11-25`·기준월 `2026.11`·라디오 `연봉정보`/`전월급여` → 대상 사원 고르기(발령 확인 창) → 확인 | 구분 칸에 `2026-11-25 급여`, 사원마다 지급액계·공제액계·차감지급액. 연봉 결재가 안 된 402는 0원 줄 |
| 2 | 〃 | 〃 | 사원 줄 클릭 → 오른쪽 탭 [근로시간] → 근로일수 21·연장 4 → [저장] | 총근로시간 = 근로일수×8 + 연장 + 야간 + 휴일(172) |
| 3 | 〃 | 〃 | 지급 그리드 [행 추가] → `연장근로수당`·150,000 → [저장] (공제는 [소득세 재계산]) | 소득세 102,770 → 119,880, 지방세 10%로 다시 계산 |
| 4 | 〃 | #1281 | 구분 고르기 → [항목추가] `기타수당` → 금액 입력 → [저장] | 모든 사원에 0원 줄이 생기고 금액을 한 번에 저장. ⚠ 두 번 누르면 2줄(#79) |
| 5 | 〃 | #1285 | 기간 `2026-11-01~11-30` → [조회] | 지급일·구분·사원·항목·금액 14줄 |
| 6 | 〃 | #1271 | [문서분류지정](A02) · [급여출금계좌] 등록 → 구분 고르기 → [상신] → 결재문서 창(시행일·상신일·내용 필수) → 결재요청 | 상신상태 `진행`. 이후 #1270·#1281 수정·삭제는 "결재진행중인 급여구분입니다" |
| 7 | 결재자 | 결재문서 창 | [승인] | 상태 `완료`(30). 반려(40)되면 다시 [상신]할 수 있다(같은 상신 행에 새 문서) |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `pay10_month` | 사원·구분·지급일마다 1줄(근로일수·근로시간·기준월) | kalpa +2 (`202611129140124` 401, `202611129140133` 402) |
| `pay11_month_item` | 지급(1)·공제(2) 항목. 공제 210~240 4대보험, 250 소득세, 260 지방세, 221·231·241 연말정산 | +14 |
| `pay05_relate_appr` | 구분·지급일의 상신 행(결재 ID·출금계좌) | +1 (`202611129140146`) |
| `pay03_account` | 급여출금계좌(시작일 2026-01-01, 신한) | +1 |
| `apr01_appr`·`apr04_appr_step` | 급여대장(A02) — 반려 1, 완료 1 | +2 |
| `dcr30_link` | kalpa A02 → `급여 > 급여` | 1줄 갱신 |

## 업무 규칙 · 주의

- 같은 사원·구분·지급일의 급여가 이미 있으면 [생성]은 건너뛴다. 연봉정보로 만들 때 기본급(110) = 기본급여 + 연장근로(약정), 중식대 111·차량 112·양육 113·기타 190(기타1+기타2), 공제 210~260. 상여(02)·특별수당(04)은 0원 항목만 만든다. 급여(01)이면 마지막에 4대보험 연말정산 납부(221·231·241)를 시도한다.
- 근태(ATT-BZ-0006) 연장근무 확정은 급여 쪽 SQL이 읽지 않는다 — 연장근로수당(120)은 사람이 넣는다. 흐름도의 화살표는 "업무상 참고"다.
- kalpa에는 4대보험 취득신고(`pay31_insure_apply`)가 없어 공제 210~240이 0원이다(PAY-BZ-0007).
- 소득세는 `f_calc_income_tax`(세액표 — PAY-BZ-0002 #74 메모처럼 2023년까지)로 계산된다.
- ⚠ 근로일수가 늘 0 — TOBE가 회사 1 달력으로 센다(원본은 로그인 회사) → [의심 #76](../../보안_및_버그_의심.md)(중).
- ⚠ 급여 API는 권한 검사가 없다. 사원 401이 전 직원 급여를 보고, 본인 특별수당 급여를 만들어 990만을 넣고 지웠다 → [의심 #77](../../보안_및_버그_의심.md)(상, #75와 같은 계열).
- ⚠ 결재 완료 뒤에도 상신 행의 결재 ID를 다른 문서로 바꾸면 잠금이 풀린다(검사가 화면뿐) → [의심 #78](../../보안_및_버그_의심.md)(상). 시험 뒤 완료 문서로 되돌렸다.
- ⚠ 승인 API에 `action`을 빼면 반려가 된다 → [의심 #80](../../보안_및_버그_의심.md). 이번 실행의 첫 문서 `202611129140148`이 그렇게 반려됐다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: PAY-BZ-0004
needs: [PAY-BZ-0003]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: POST /api/v1/pay/months
    body: { payCode: "01", payDate: "2026-11-25", annualYn: true, stdMonth: "2026.11",
            targets: [{ personId: <401>, transCode: "100", hireDate: "2020-03-02", transDate: "2020-03-02" },
                      { personId: <402>, transCode: "100", hireDate: "2020-03-02", transDate: "2020-03-02" }] }
    expect: { track: { pay10_month: +2 }, rows401: { paySum: 3500000, taxDdcSum: 113040 } }
  - no: 2
    api: PUT /api/v1/pay/months/{monthId}/work-time
    body: { workDay: 21, extendWorkTime: 4, nightWorkTime: 0, holidayWorkTime: 0 }
    expect: { pay10_total_work_time: 172 }
  - no: 3
    api: PUT /api/v1/pay/month-items
    body: { monthId: <401 급여>, itemType: "1", updateList: [{ itemCd: "120", itemAmt: 150000 }], deleteIds: [] }
    expect: { item250: 119880, item260: 11980 }
  - no: 4
    api: [POST /api/v1/pay/month-items/bulk, PUT /api/v1/pay/month-items/amounts]
    body: { payCode: "01", payDate: "2026-11-25", itemType: "1", itemCode: "190" }
  - no: 5
    api: GET /api/v1/pay/month-items/by-date?startDate=2026-11-01&closeDate=2026-11-30
    expect: { rows: 14 }
  - no: 6
    api: [PUT /api/v1/dcr/links (admin, A02), PUT /api/v1/pay/accounts, POST /api/v1/pay/relate-apprs/month,
          GET /api/v1/apr/apprs/new-id, PUT /api/v1/apr/apprs/{apprId} (mode request, linkCode A02, effectDate·regDate·content 필수),
          PUT /api/v1/pay/relate-apprs/{relateApprId}/appr-id]
    expect: { checkAppr: { ok: false, message: 결재진행중인 급여구분입니다 } }
  - no: 7
    actor: { company: kalpa, user: "100", password: "1111" }
    api: POST /api/v1/apr/apprs/{apprId}/confirm
    body: { action: confirm, message: 확인했습니다 }
    expect: { statusCode: "30" }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Pay10_Tab_Month`(E0~E6, retrieve L212, checkAppr L242, delete L321), `Pay10_Lookup_Insert`, `Pay11_TabPage_MonthItem`(E0~E11), `Pay10_Lookup_Work`, `Pay10_Tab_MonthItem`(#1281), `Pay10_Tab_MonthSearch`(#1285), `Pay10_Tab_List`(#1271 insertPayRelateAppr L495-532·updateApprId L586-612), 서버 `pay.Pay10_Month`(insert L243-682·checkAppr L211·deleteAll L628), `pay.Pay11_MonthItem`(updateList L116·recalculationTax L340), `pay.Pay05_RelateAppr`(insert L60-86).
- TOBE: `PayMonthController`(`/api/v1/pay/months` GET·POST·DELETE·`/check-appr`·`/{id}/work-time`), `PayMonthService` L39-251, `PayMonthItemController`(`/api/v1/pay/month-items` GET·PUT·`/by-text`·`/amounts`·`/bulk`·`/by-date`·`/recalculate-tax`), `PayMonthItemService` L50-212, `PayRelateApprController`(`/month`·`/{id}/appr-id`), `PayAccountController`.
</details>
