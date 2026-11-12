# PAY-BZ-0005 경영관리팀이 급여대장을 보고, 직원이 본인 급여명세서를 본다

> **한 줄 요약** — 결재가 끝난 급여(PAY-BZ-0004)를 **#1271 급여대장**에서 구분·지급일로 골라 대장(RD `Pay10_Rd_List`)·은행이체명세서(`Pay10_Rd_Trans`)로 본다. 직원은 **#1272 급여명세서**에서 연도를 고르면 **본인 급여만**(지급일이 지났거나 결재 완료된 것) 나오고, 줄을 누르면 명세서(RD `Pay10_Rd_PersonList`)가 열린다. 경영관리팀은 **#1273 급여명세서(경영관리팀)**에서 사원을 골라 같은 명세서를 본다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리팀(kalpa 과장 301) · 직원(401) |
| 언제 | 매월 지급일 뒤 |
| 먼저 있어야 하는 것 | PAY-BZ-0004(급여 생성·급여대장 결재 완료) |
| 다음 이벤트 | PAY-BZ-0007(4대보험), 0008(원천징수) |
| 실제 실행 | kalpa, 2026-11-12, API: 401 #1272 → 2026-11-25 급여 1줄(지급 3,700,000·차감 3,560,060), 명세서 항목 수 4. 301 #1273 → 402 1줄. #1271 상신상태 `완료`. AS-IS와 행 수 일치(1 = 1, 1 = 1). 보고서 내용은 RD 서버라 눈 확인 `대기` |
| 메뉴 | #1271 경영관리 > 04. 급여관리 > 급여대장, #1272 같은 곳 > 급여명세서, #1273 같은 곳 > 급여명세서(경영관리팀). kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 경영관리 | #1271 | 해당 연도 → 구분 고르기(`2026-11-25 급여`) → [조회] | 급여대장 보고서, 상신상태 `완료`, [문서보기]로 결재문서 |
| 2 | 〃 | 〃 | [은행이체명세서] | 출금계좌(`pay03_account`)·사원 계좌별 이체 목록 보고서 |
| 3 | 직원 | #1272 | 화면 열기(올해) → 줄 클릭 | 본인 급여 줄 → 명세서(지급·공제 항목, 항목 수 큰 쪽 기준) |
| 4 | 경영관리 | #1273 | 연도 · 사원명 고르기 → [조회] → 줄 클릭 | 그 사원의 급여 줄 → 명세서 |

## DB에 남는 것

조회만 한다. 없음(#1271 상신 행·PDF는 PAY-BZ-0004).

## 업무 규칙 · 주의

- #1272는 서버가 로그인 사원으로 정한다(`/mine`). 남의 급여 ID로 항목 수를 물으면 404.
- 급여명세서에 나오는 급여는 지급일이 오늘 이전이거나 결재 완료(30)인 것만이다(`selectByYearPerson`).
- ⚠ #1273 API(`/by-person`)는 권한을 보지 않아 사원 401이 402의 급여를 받는다. 보고서 주소도 남의 `monthId`로 만들 수 있다 → [의심 #81](../../보안_및_버그_의심.md)(상, #77과 같은 계열).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: PAY-BZ-0005
needs: [PAY-BZ-0004]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: GET /api/v1/pay/relate-apprs?payCode=01&payDate=2026-11-25
    expect: { statusCode: "30" }
  - no: 3
    actor: { company: kalpa, user: "401", password: "1111" }
    api: [GET /api/v1/pay/months/mine?year=2026, GET /api/v1/pay/months/mine/{monthId}/item-count]
    expect: { rows: 1, first: { paySum: 3700000, deductionSum: 3560060 }, itemCount: 4 }
  - no: 4
    actor: { company: kalpa, user: "301", password: "1111" }
    api: GET /api/v1/pay/months/by-person?personId=<402>&year=2026
    expect: { rows: 1 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Pay10_Tab_List`(#1271 retrieve L376-435, bankRd L352-374), `Pay10_Tab_PersonList`(#1272 E0~E3, retrieveEditPage L110-153), `Pay10_Tab_PersonListManager`(#1273 E0~E4), `Pay10_Rd_PersonList`, 서버 `pay.Pay10_Month.selectByYearPersonId` L105·`selectByMonthIdCount` L137.
- TOBE: `PayMonthController`(`/mine`·`/by-person`·`/mine/{id}/item-count`·`/{id}/item-count`), `PayMonthService` L48-69, `PayRelateApprController GET`, `RdController POST /api/v1/rd/urls`.
</details>
