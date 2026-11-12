# PAY-BZ-0003 경영관리팀이 직원과 연봉계약을 맺고(결재), 직원이 본인 연봉을 본다

> **한 줄 요약** — 경영관리팀이 #1037 연봉계약관리에서 직원마다 **적용기간·시업/종업 시각·기본연봉·퇴직금·기본급여·중식대·차량유지비·연장근로·기타급여·기타약정**을 등록하고(엑셀 일괄 가능), 행의 [상신]으로 **연봉계약서(링크 D01)**를 결재 올린다. 결재가 완료되면 행이 잠기고, 직원은 #1104 연봉조회에서 **결재 완료된 본인 계약만** 본다. #1082 연봉계약현황은 회사 전체 목록·출력이다. 월 급여 계산(PAY-BZ-0004)의 기준 금액이다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리팀(kalpa 과장 301) → 결재자(대표 100) → 직원(401) |
| 언제 | 해마다 연봉 협상 뒤, 입사 때 |
| 먼저 있어야 하는 것 | EMP-BZ-0001(직원), 문서분류지정 #1280 D01 → kalpa `연봉계약서` 분류(회사 관리자가 지정), [계약서 양식작성](`pay06_act_mapping`, 없으면 본문 빈칸) |
| 다음 이벤트 | PAY-BZ-0004(월 급여) |
| 실제 실행 | kalpa, 2026-11-12, API: 301이 401(연봉 4,200만)·402(3,900만) `2026-01-01~12-31` 등록 → 401 계약 연봉계약서 `202611129140116` 상신 → 100 승인 → 401 #1104에서 1건. #1037·#1104 목록 AS-IS와 행 수 일치(2 = 2, 1 = 1) |
| 메뉴 | #1037 경영관리 > 03. 연봉관리 > 연봉계약관리, #1082 같은 곳 > 연봉계약현황, #1104 같은 곳 > 연봉조회. kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 0 | 경영관리 | #1037 | [계약서 양식작성] → 사원구분별 양식 줄 → [문서분류지정] → [저장] | 상신 때 쓸 계약서 본문 양식 |
| 1 | 〃 | 〃 | 사원명(비우면 전체)·최근등록/년도별/전체·퇴직자포함 → [조회] | 계약 줄(결재 상태 포함) |
| 2 | 〃 | 〃 | [등록] → 사원·적용시작/종료일·금액 → [저장] (또는 [템플릿]·[엑셀업로드]) | 줄 저장. 필수(성명·기간)·기간 순서 검사, 엑셀은 같은 사번·기간 줄을 지우고 다시 넣음 |
| 3 | 〃 | 〃 | 줄의 [상신] → 결재문서 창 | 제목 `연봉계약_(2026-01-01~2026-12-31)_김사원`, 양식이 둘 이상이면 고르는 창 |
| 4 | 결재자 | 결재문서 창 | [승인] | 상태 `완료`. 이후 그 줄 수정·삭제는 "상신중인 문서가 포함되어있습니다…" |
| 5 | 직원 | #1104 | 화면 열기 | 결재 완료된 본인 계약만 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `pay01_annual` | 계약 줄, 상신 뒤 `pay01_appr_id` | kalpa +2 |
| `apr01_appr`·`apr04_appr_step` | 연봉계약서(D01) | +1(완료) |
| `dcr30_link` | kalpa D01 → 연봉계약서 | 1줄 갱신 |

## 업무 규칙 · 주의

- #1104는 서버가 로그인 사원으로 정한다(`searchMine`) — 본인 것만.
- ⚠ **#1037 API는 권한 검사가 없다**(회사만 본다, 원본도 메뉴 권한뿐). 실행(kalpa 사원 401):
  - `GET /api/v1/pay/annuals` → **회사 전 직원의 연봉·기본급** 2줄
  - `PUT /api/v1/pay/annuals [{annualId:<402 계약>, annualPay:1, basicPay:1}]` → 200, **남의 연봉을 1원으로** 바꿈(보내지 않은 금액 칸은 비워짐)
  - `DELETE /api/v1/pay/annuals [<402 계약>]` → 지워짐
  - 결재 ID를 붙이기 전(상신 직후 연결 전)에는 본인 계약 연봉을 9,900만으로 고칠 수 있었다
  - 모두 301로 되돌렸다(402 계약은 새 ID `202611129140120`) → [의심 #75](../../보안_및_버그_의심.md)(상).
- 결재 ID 연결(`PUT /{annualId}/appr-id`, 본문 `{apprId}`)은 문서를 검사하지 않는다 — 연장근무 [의심 #66]과 같은 모양.
- kalpa에는 계약서 양식(`pay06_act_mapping`)이 없어 `link-contents`가 빈 목록이고 본문이 빈칸이다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: PAY-BZ-0003
needs: [EMP-BZ-0001]
steps:
  - no: 0
    actor: { company: kalpa, user: admin, password: "1111" }
    api: PUT /api/v1/dcr/links
    body: [{ linkId: <D01>, classTreeId: <연봉계약서> }]
  - no: 2
    actor: { company: kalpa, user: "301", password: "1111" }
    api: PUT /api/v1/pay/annuals
    body: [{ personId: <401>, startDate: "2026-01-01", closeDate: "2026-12-31", startTime: "09:00", closeTime: "18:00", annualPay: 42000000, retirePay: 3500000, basicPay: 3000000, mealPay: 200000, overPay: 300000 }]
    expect: { track: { pay01_annual: +1 } }
  - no: 3
    api: [GET /api/v1/apr/apprs/new, GET /api/v1/apr/apprs/link-seed?linkCode=D01&refId=<annualId>, PUT /api/v1/apr/apprs/{apprId}, PUT /api/v1/pay/annuals/{annualId}/appr-id]   # appr-id는 본문 { apprId }
  - no: 4
    actor: { company: kalpa, user: "100", password: "1111" }
    api: POST /api/v1/apr/apprs/{apprId}/confirm
  - no: 5
    actor: { company: kalpa, user: "401", password: "1111" }
    api: GET /api/v1/pay/annuals/mine
    expect: { rows: 1, first: { annualPay: 42000000, apprStatusName: 완료 } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Pay01_Tab_Annual`(E0~E19, retrieve L565, update L601, delete L635, 상신 L326), `Pay06_Lookup_ActList`·`Pay06_Lookup_ActMapping`, `Pay01_Tab_AnnualList`(#1082), `Pay01_Tab_AnnualPerson`(#1104 retrieve L130), 서버 `pay.Pay01_Annual`(selectByAll·selectByPersonId·updateApprId·excel).
- TOBE: `PayAnnualController`(`/api/v1/pay/annuals` GET·PUT·DELETE·`/mine`·`/rd-print`·`/{id}/link-contents`·`/{id}/appr-id`·`/template`·`/excel`), `PayAnnualService` L39-181, `PayActMappingController`.
</details>
