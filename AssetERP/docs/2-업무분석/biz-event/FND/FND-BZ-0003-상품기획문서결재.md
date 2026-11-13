# FND-BZ-0003 상품기획문서를 작성해 결재받는다

> **한 줄 요약** — 기획일정(FND-BZ-0002)마다 **[결재요청]**을 누르면 그 일정의 문서분류로 **임시저장(99) 결재 문서**가 만들어지고(기안자=일정 담당자, 연관펀드=기획펀드, 기본 결재선), 일정에 문서 ID가 기록된다. 담당자가 본문을 쓰고 상신하면 결재선(부장 → 대표이사)이 승인해 **결재 완료(30)**가 된다. 일정 화면은 문서 완료 여부로 진행 상태를 보인다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 일정 담당자(김사원 401) → 결재자(박부장 201 → 김사장 100) |
| 언제 | 기획일정 마감 전 |
| 먼저 있어야 하는 것 | FND-BZ-0002(기획펀드·일정), 문서분류(상품전략/상품개발/…), APR 결재 |
| 다음 이벤트 | FND-BZ-0004(펀드 등록) |
| 실제 실행 | kalpa, 2026-11-13, API. 일정 `상품분석 및 검토`에서 결재요청 → 문서 1건(제목 "상품분석 및 검토 - 칼파 신규기획 1호") 401 상신 → 201 승인 → 100 승인 = **30 완료**. 연관펀드 `apr03_relate_fund` +1. 결재요청을 한 번 더 눌러도 같은 문서 ID를 돌려준다. 화면 눈 확인 `대기(일괄)` |
| 메뉴 | #1106 상품기획문서 등록(일정 목록 + 문서 탭). kalpa 메뉴 없음 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 담당자 | #1106 | 일정 선택 → [결재요청] (`POST /fnd/plans/{planId}/appr`) | 임시저장 문서가 열림(제목 " ", 기본 서식·결재선) |
| 2 | 담당자 | 결재 문서창 | 제목·본문·시행일 → [결재요청] (`PUT /apr/apprs/{id}` mode request) | 상태 10(진행) |
| 3 | 결재자 | 결재함 | [승인] 박부장 → 김사장 (`POST …/confirm`) | 상태 30(완료), 일정에 완료 표시 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `apr01_appr` | 상품기획 결재 문서 | +1 (99→10→30) |
| `apr04_appr_step` | 기본 결재선 3줄(기안·부장·대표이사) | +3 |
| `apr03_relate_fund` | 연관펀드(기획펀드) | +1 |
| `fnd20_plan` | 일정의 `appr_id` 기록 | 1줄 갱신 |

## 업무 규칙 · 주의

- 상신 때 **시행일(effectDate)이 필수**다(없으면 "시행일은 필수입력 항목입니다"). 결재요청 단계의 임시 문서는 제목이 공백 `" "`이다.
- 일정 담당자가 아닌 다른 사원(402, 다른 부서)이 남의 일정에서 [결재요청]을 눌러도 문서가 **기안자=담당자(401)** 로 만들어진다 → [의심 #160](../../보안_및_버그_의심.md). kalpa에 시험 문서 1건(99, 일정 `상품개발위원회`)이 남아 있다.
- 결재 상태 변경(`confirm` 등)은 APR 규칙을 그대로 따른다(APR-BZ-0001·0002).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: FND-BZ-0003
needs: [FND-BZ-0002, APR-BZ-0001]
steps:
  - no: 1
    actor: { company: kalpa, user: "401", password: "1111" }
    api: POST /api/v1/fnd/plans/{planId}/appr
    expect: { track: { apr01_appr: +1, apr03_relate_fund: +1, apr04_appr_step: +3 } }
  - no: 2
    api: PUT /api/v1/apr/apprs/{apprId}   # mode request, effectDate 필수
    expect: { statusCode: "10" }
  - no: 3
    actor: { user: "201" }
    api: POST /api/v1/apr/apprs/{apprId}/confirm
  - no: 4
    actor: { user: "100" }
    api: POST /api/v1/apr/apprs/{apprId}/confirm
    expect: { doc: 30 }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Fnd20_Tab_PlanEmp`(#1106)·`Fnd20_Plan.insertAppr` L93, 결재 문서 `Apr01_Edit_ApprDoc`.
- TOBE: `FndPlanController` `POST /{planId}/appr`·`FndPlanService.requestAppr` L46-72, `AprApprWriteController`.
</details>
