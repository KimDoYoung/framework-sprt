# PAY-BZ-0006 직원이 퇴직하면 경영관리팀이 퇴직정산(마지막 급여)을 만들고 결재받는다

> **한 줄 요약** — 퇴직 발령(EMP-BZ-0004, 발령코드 900)이 나면 경영관리팀이 #1270 급여관리에서 지급구분 **퇴직정산(03)**·지급일 = 퇴직일로 급여를 만든다(연봉정보의 기본급·수당을 **일할**). 그다음 #1274 퇴직정산에서 사원을 골라 **[생성]**하면 DB 함수 3개가 **연차수당(123)**·**4대보험 퇴직정산(222·232·242)**·**소득세 퇴직정산(252·262)**을 그 급여에 넣고 계산 상세(`pay15`·`pay12`·`pay13`·`pay14`)를 남긴다. 탭(퇴직정산서·4대보험·소득세·연차휴가)에서 확인·수정한 뒤 **[상신]**(링크 A05)으로 결재를 받는다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리팀(kalpa 과장 301) → 결재자(대표 100) |
| 언제 | 직원 퇴사 때 |
| 먼저 있어야 하는 것 | EMP-BZ-0004(퇴직 발령), PAY-BZ-0003(결재 완료 연봉 — 없으면 일할 항목·일당이 0), PAY-BZ-0004 방식의 #1270 [생성](구분 03), #1274 [문서분류지정] A05 → `퇴직정산`. 4대보험 정산은 PAY-BZ-0007 취득신고가 있어야 제대로 나온다 |
| 다음 이벤트 | PAY-BZ-0007(4대보험 상실), PAY-BZ-0008(원천징수) |
| 실제 실행 | kalpa, 2026-11-12, API: 시험 직원 `403 이퇴직`(입사 2024-03-04) 등록 → 연봉 3,600만(기본 260만·연장 20만·중식 20만) D01 결재 완료 → 퇴직 발령 2026-11-20 → #1270 퇴직정산 급여(기본급 1,866,666·중식 133,333 = 20/30 일할) → #1274 [생성] → 연차수당 2,009,560·고용보험 정산 34,880·소득세 116,320·지방세 11,630 → A05 상신 `202611129140205` → 100 승인 **완료**. 탭 목록 AS-IS SQL과 일치(연차 1 = 1, 4대보험 1 = 1, 소득세 항목 2 = 2) |
| 메뉴 | #1274 경영관리 > 04. 급여관리 > 퇴직정산 (#1270 급여관리에서 구분 03 생성). kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 경영관리 | #1270 | [생성] → 지급구분 `퇴직정산`·지급일 = 퇴직일 `2026-11-20` → 퇴직자 고르기 | 퇴직자 급여 줄. 기본급 = (기본급여+연장) × 퇴직일/월일수, 중식·차량·양육도 일할. 근로일수는 퇴직일까지 |
| 2 | 〃 | #1274 | 성명 고르기 → [생성] → "퇴직정산서가 존재할 경우 삭제 후 재생성됩니다…" [예] → 4대보험·소득세 체크 → [생성] | 탭이 채워진다. 퇴직정산서가 없으면 "퇴직정산내역이 존재하지 않습니다. 급여관리에서 지급구분을 "퇴직정산"으로 생성한 후 진행하세요" |
| 3 | 〃 | 〃 연차휴가 탭 | (보기) · [퇴직연차일수 계산] 링크 | 입사일기준·회계일기준 연차 상세, 잔여일수·일당(연봉/12/209×8 = 114,832). ⚠ 탭 금액과 지급 항목이 다를 수 있다(#83) |
| 4 | 〃 | 〃 4대보험 탭 | 건강·장기요양·고용 줄 [행 추가]·[저장], [4대보험 정산 재생성] | 정산액 → 급여 항목 222·232·242 |
| 5 | 〃 | 〃 소득세 탭 | 1. 총소득액 ~ 10. 차감징수세액 단계별 [저장], 공제표 보기 | 근로소득공제 2,000,000 → 과세표준 1,876,226 → 산출세액 116,326 → 차감징수 116,320 |
| 6 | 〃 | 〃 퇴직정산서 탭 | [상신] → 결재문서 창(A05, 시행일·상신일·내용 필수) → 결재요청 | 상신상태 `상신`. #1270에서 이 급여 항목 저장은 "결재진행중인 급여구분입니다" |
| 7 | 결재자 | 결재문서 창 | [승인] | 상태 `완료`(30) |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `pay10_month` | 퇴직정산(03) 급여 1줄 | +1 (`202611129140183`) |
| `pay11_month_item` | 일할 110·111 + 123 연차수당 + 222·232·242 4대보험 정산 + 252·262 소득세 정산 | +8 |
| `pay15_retire_leave` | 연차 계산 상세(입사일기준 1 / 회계일기준 2, 연차별) | +6 |
| `pay12_retire_insure` | 4대보험 정산(건강 2·장기요양 3·고용 4) | +3 |
| `pay13_retire_tax`·`pay14_retire_tax_item` | 퇴직 소득세 정산·총소득 항목 | +1·+2 |
| `pay05_relate_appr` | 퇴직정산 상신 행(`retire_id` = 급여 ID) | +1 |
| `apr01_appr` | 연봉계약서(D01) 1 · 퇴직정산(A05) 1, 모두 완료 | +2 |
| `emp01_person`·`emp03_trans`·`pay01_annual` | 시험 직원 403 입사·퇴직 발령·연봉 | +1·+2·+1 |
| `dcr30_link` | kalpa A05 → `퇴직정산` | 1줄 갱신 |

## 업무 규칙 · 주의

- #1274 [생성]은 DB 함수 세 개를 차례로 부른다: `f_calc_leave_pay_retire`(P) → `f_calc_4insure_retire`(체크, P) → `f_calc_income_tax_retire`(체크). 하나라도 'Y'가 아니면 그 문구로 실패하고 전부 되돌린다. 셋 다 사원의 **가장 최근 퇴직정산(03) 급여**를 찾는다.
- [삭제]는 같은 함수를 C로 부르고 상신 연결(`pay05`)을 지운다. 퇴직정산 급여 줄(`pay10`)은 남는다(#1270에서 지운다).
- ⚠ 결재 진행·완료 여부를 보지 않는다. 완료된 퇴직정산도 [생성](재계산)·[삭제]가 되고, 삭제하면 결재 연결이 없어진다 → [의심 #82](../../보안_및_버그_의심.md)(상). 시험 뒤 [생성]·상신 행·결재 ID로 되돌렸다.
- ⚠ 연차휴가 탭은 전년도 미사용 월차 2일을 더해 19.5일·2,239,224로 보여 주지만 지급 항목은 17.5일·2,009,560이다(원본 그대로) → [의심 #83](../../보안_및_버그_의심.md).
- ⚠ 취득신고가 없으면 건강·장기요양 정산 항목이 금액 NULL로 들어간다 → [의심 #84](../../보안_및_버그_의심.md).
- ⚠ 퇴직정산 API도 권한 검사가 없다(사원 401이 조회·재계산) → [의심 #85](../../보안_및_버그_의심.md)(상, #77 계열).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: PAY-BZ-0006
needs: [PAY-BZ-0003, EMP-BZ-0004]
steps:
  - no: 0
    actor: { company: kalpa, user: admin, password: "1111" }
    api: [POST /api/v1/emp/trans-infos, PUT /api/v1/emp/trans]
    body: [{ empNo: "403", korNm: 이퇴직, kindCd: "10", hireDate: "2024-03-04", hireCd: "10", titleCd: "250", posCd: "650", orgCodeId: <경영지원본부> },
           [{ personId: <403>, transDate: "2026-11-20", transCd: "900", kindCd: "10", orgCodeId: <경영지원본부>, titleCd: "250", posCd: "650", transReason: 개인사유 }]]
    note: 사이에 301 연봉계약(PUT /pay/annuals 3,600만) → D01 상신 → 100 승인 (PAY-BZ-0003 방식)
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: POST /api/v1/pay/months
    body: { payCode: "03", payDate: "2026-11-20", annualYn: true, stdMonth: "2026.11",
            targets: [{ personId: <403>, transCode: "900", hireDate: "2024-03-04", transDate: "2026-11-20" }] }
    expect: { items: { "110": 1866666, "111": 133333 } }
  - no: 2
    api: POST /api/v1/pay/retires
    body: { personId: <403>, insureCheckYn: true, taxCheckYn: true }
    expect: { items: { "123": 2009560, "242": 34880, "252": 116320, "262": 11630 }, track: { pay15_retire_leave: +6, pay12_retire_insure: +3 } }
  - no: 3
    api: [GET /api/v1/pay/retires/month?personId=<403>, GET /api/v1/pay/retire-leaves?personId=<403>, GET /api/v1/pay/retire-insures?personId=<403>&insureCode=4, GET /api/v1/pay/retire-taxes/{monthId}]
  - no: 6
    api: [PUT /api/v1/dcr/links (admin, A05 → 퇴직정산), POST /api/v1/pay/relate-apprs/retire { monthId }, GET /api/v1/apr/apprs/new-id,
          PUT /api/v1/apr/apprs/{apprId} (mode request, linkCode A05), PUT /api/v1/pay/relate-apprs/{relateApprId}/appr-id]
  - no: 7
    actor: { company: kalpa, user: "100", password: "1111" }
    api: POST /api/v1/apr/apprs/{apprId}/confirm
    body: { action: confirm, message: 승인 }
    expect: { statusCode: "30" }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Pay10_Tab_Retire`(E0~E9, checkRetire L287-321, delete L323-365), `Pay12_Lookup_RetireCreate.create` L85-104, `Pay10_TabPage_Retire`(상신 A05 L288-313), `Pay12_TabPage_RetireInsure`, `Pay13_TabPage_RetireTax`, `Pay15_TabPage_RetireLeave`, `Pay10_Lookup_RemLeaveDays`, 서버 `pay.Pay12_RetireInsure.getInsureRetire` L47-103, `pay.Pay05_RelateAppr.insertRetire` L88, DB 함수 `f_calc_leave_pay_retire`·`f_calc_4insure_retire`·`f_calc_income_tax_retire`(+`…C`).
- TOBE: `PayRetireController`(`/api/v1/pay/retires` POST·DELETE·`/month`·`/rd-count`), `PayRetireService` L29-78, `PayRetireLeaveController`·`PayRetireInsureController`·`PayRetireTaxController`, `PayRelateApprController`(`/retire`), `PayRetireMapper.xml`.
</details>
