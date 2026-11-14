# TDM-BZ-0008 책무 대시보드로 점검 진행·미완료·미흡 조치 현황을 본다

> **한 줄 요약** — 책무 담당·임원이 점검월을 골라 #1495 **책무점검 현황**(진행률·적정/미흡/개선 건수, 임원별·부서별 진행률, 미완료 항목, 미흡·개선 조치 현황)과 #1496 책무진행 상태·#1497 책무마감 검증을 **읽기만** 한다. 값은 TDM-BZ-0007이 남긴 `tdm51~54` 점검 데이터를 집계한 것이며, 이 이벤트는 쓰는 것이 없다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 책무 담당·책무임원 (kalpa는 사원 누구나 읽힘 — 의심 #133·#135) |
| 언제 | 수시 (점검 기간 중 진행 확인, 마감 뒤 결과 확인) |
| 먼저 있어야 하는 것 | TDM-BZ-0007(점검 작업·항목) |
| 다음 이벤트 | 다음 달 TDM-BZ-0007 |
| 실제 실행 | kalpa, 2026-11-13, API 조회(302 — 책무 직책이 없는 사원으로 읽음). 점검월 2026.11: `check-end` → 마감(2026-11-30) · `progress` → 진행률 100%, 건수 `1 / 0 / 1 / 0`(전체/적정/미흡/개선 줄 모양) · `exct-progress`·`org-progress` → 정부장·운용본부 각 1건(진행 100%, 미흡 1) · `undone` → 항목 1건(상태 `승인완료`) · `insuff` → 미흡조치 1건 · `is-manager` → false · `my-org` → 운용본부. 쓰기 없음. AS-IS 대조·화면 눈 확인은 하지 않았다 |
| 메뉴 | #1495 책무점검 현황 · #1496 책무진행 상태 · #1497 책무마감 검증 (기초자료 아래 #1511 책무진행 상태·#1512 책무마감 검증 관리자판도 있다 — 이번엔 안 봄). #1466 조치대상조회(변화관리) · #1467 책무조회 · #1468 매뉴얼 규정/양식 연결 · #1481 이행점검 연관양식 등록 · #1469 책무관리 시스템설정은 **이번엔 보지 않았다** |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 책무 담당·임원 | #1495 | 점검월 선택(기본은 진행 중인 달, 없으면 현재 월) | 진행률·건수, 임원별·부서별 진행, 미완료 목록, 미흡 조치 목록 |
| 2 | 〃 | #1496·#1497 | 점검월·기준일 | 책무 진행 상태 · 마감 검증(마감 여부 `check-end`) |

## DB에 남는 것

없음(조회만).

## 업무 규칙 · 주의

- `recent-check-ym`(진행 중인 점검월)은 점검이 **마감되면 `null`**이 된다 — 마감 뒤에는 화면이 점검월을 현재 월로 되돌리므로 지난달 결과를 보려면 점검월을 직접 골라야 한다.
- 집계가 `exct-progress`·`org-progress`에서 `chckOrgId`를 **행 순번(1)**으로 돌려준다(진짜 ID가 아님) — AS-IS 쿼리가 그렇게 만든다고 추정(대조 안 함). 화면이 이 값을 키로 쓰는지는 눈 확인에서 본다.
- 미흡 조치를 [조치완료](상태 19)로 해도 대시보드 `insuff`의 `statusName`은 **`발생`**으로 나온다(DB는 19). 라벨 매핑이 19를 모르는 것으로 보이며 원본 대조가 필요하다 → [의심 #136](../../보안_및_버그_의심.md).
- 승인이 끝난 항목(25 승인완료)이 `undone`(미완료) 목록에 계속 나온다 — "점검 완료" 기준이 점검완료(19)·승인(25) 중 무엇인지 원본 대조가 필요하다(진행률은 100%로 계산됨) → 같은 의심.
- 조회 API 10개 모두 로그인 회사만 본다. 책무 직책이 없는 사원(302)도 점검 결과 전체(점검자 이름·미흡 내용)를 읽는다 → 의심 #133 범위.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: TDM-BZ-0008
needs: [TDM-BZ-0007]
steps:
  - no: 1
    actor: { company: kalpa, user: "302", password: "1111" }
    api: GET /api/v1/tdm/dashboard/progress?checkYm=2026.11&stdDate=2026-11-13&statusType=A
    expect: { progRate: 100.0 }
  - no: 2
    api: [GET /api/v1/tdm/dashboard/exct-progress?checkYm=2026.11&statusType=A, GET /api/v1/tdm/dashboard/org-progress?checkYm=2026.11&statusType=A]
    expect: { rows: 1 }
  - no: 3
    api: [GET /api/v1/tdm/dashboard/undone?checkYm=2026.11, GET /api/v1/tdm/dashboard/insuff?checkYm=2026.11]
    expect: { rows: 1 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Tdm50_Tab_TotalDashboard`(#1495, 탭 `Tdm50_Tab_Dashboard`·`Tdm50_Tab_DashboardExct`·`Tdm50_Tab_DashboardOrg`)·`Tdm50_Tab_DutyProgress`(#1496)·`Tdm50_Tab_DutyRecon`(#1497). 서버 SQL은 대조하지 않았다.
- TOBE: `TdmDashboardController`(`/api/v1/tdm/dashboard` — 조회 10개), `TdmDashboardService`, `TdmDashboardMapper.xml`.
</details>
