# FND-BZ-0002 신규기획펀드와 기획일정을 등록한다

> **한 줄 요약** — 새 펀드를 설정하기 전에 **임시(기획) 펀드**를 만들고(#1046), 그 펀드에 문서분류별 **기획일정**(시작일·마감예정일·담당자)을 붙인다(#1105). 기획일정마다 결재 문서(상품기획문서, FND-BZ-0003)가 이어진다. 임시 펀드는 `closeYn=false`(임시펀드)로 저장되고, 나중에 FND-BZ-0004에서 실제 펀드와 연결된다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 상품기획 담당(kalpa는 관리자가 대행), 일정 담당자(직원) |
| 언제 | 신상품을 기획할 때 |
| 먼저 있어야 하는 것 | FND-BZ-0001, 문서분류(kalpa는 A01·상품전략/상품개발 분류가 있음) |
| 다음 이벤트 | FND-BZ-0003(기획문서 결재), 0004(펀드 등록) |
| 실제 실행 | kalpa, 2026-11-13, API. 기획펀드 `KP001 칼파 신규기획 1호`(주식형, 시작 2026-12-01) 1건, 기획일정 2건(상품분석 및 검토 11-16~11-30 · 상품개발위원회 12-01~12-10, 담당 김사원). 화면 눈 확인 `대기(일괄)` |
| 메뉴 | #1046 신규기획펀드 등록, #1047 신규기획펀드 권한설정, #1105 상품기획일정 등록. kalpa 메뉴 없음 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 상품기획 담당 | #1046 | 펀드코드·임시펀드명·유형·시작일·작업일 → [저장] (`PUT /fnd/fund-codes/plans`; 코드 겹침은 `GET …/plans/overlap`) | 임시펀드 줄 |
| 2 | 상품기획 담당 | #1105 | 펀드 선택 → 문서분류·담당자·시작일·마감예정일 → [저장] (`PUT /fnd/plans`) | 기획일정 줄 |
| 3 | 담당자 | #1105 | 본인 일정 확인(`GET /fnd/plans/todo`) → 다음 이벤트 | |

## DB에 남는 것

| 테이블 | 무엇 | kalpa 실행 |
|:---|:---|:---|
| `fnd01_fund_code` | 펀드 코드 | +1 |
| `fnd02_fund_info` | 펀드 정보(이름·유형·시작일·작업일 — 작업일 필수) | +1 |
| `fnd20_plan` | 기획일정 | +2 |

## 업무 규칙 · 주의

- 작업일(`workDate`)을 빼면 `fnd02_work_date` NOT NULL 위반으로 **500(서버 내부 오류)** 이 난다. 입력 검사 없이 DB 오류가 그대로 나온다(낮음, 의심 #159).
- 기획일정 삭제는 **그 일정을 만든 사람만** 할 수 있다("해당 내용을 생성한 자만 삭제가능"). 관리자도 남이 만든 일정은 못 지운다.
- 기획일정의 문서분류는 회사별 분류(`dcr01_class_tree`)이며 결재 기본 결재선(`approvalTypeName`)이 분류에서 따라 나온다.
- 메뉴 권한이 없는 사원 401이 임시펀드 저장·이름 변경, 기획일정 등록을 할 수 있다 → [의심 #158](../../보안_및_버그_의심.md).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: FND-BZ-0002
needs: [FND-BZ-0001]
steps:
  - no: 1
    actor: { company: kalpa, user: admin, password: "1111" }
    api: PUT /api/v1/fnd/fund-codes/plans
    body: { fundCode: "KP001", fundName: "칼파 신규기획 1호", kofiaFundTypeCode: "21", startDate: "2026-12-01", workDate: "2026-11-13", closeYn: "false" }
    expect: { track: { fnd01_fund_code: +1, fnd02_fund_info: +1 } }
  - no: 2
    actor: { company: kalpa, user: admin, password: "1111" }
    api: PUT /api/v1/fnd/plans
    body: [{ fundId: "{fundCodeId}", classTreeId: "{상품분석 및 검토}", personId: "{401}", startDate: "2026-11-16", dueDate: "2026-11-30" }, …]
    expect: { track: { fnd20_plan: +2 } }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Fnd01_Tab_FundPlan`(#1046 — `Fnd01_FundCode.update`·`selectByFundPlan`·`selectByOverlap`), `Fnd20_Tab_Plan`(#1105).
- TOBE: `FndFundCodeController`(`/fnd/fund-codes/plans`), `FndPlanController`(`/fnd/plans`)·`FndPlanService`.
</details>
