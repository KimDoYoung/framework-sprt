# ATT-BZ-0001 회사가 근태관리를 켜고 근태정책(출퇴근 기준)을 정한다

> **한 줄 요약** — 근태는 회사 설정 두 개로 켠다. KFS 관리자가 #1075 경영·회계 탭에서 **근태팝업사용**(로그인 때 출퇴근 창)과 **근태잠금사용**을 켜고, 경영관리팀이 #1485 [근태정책설정]에서 **적용시작일별 출근·퇴근 시각·휴게·연장허용·지각/조기퇴근 유예·오후근무 시각**을 등록한다. 이 정책이 출퇴근 상태(지각·조기퇴근·연장근무), 일괄생성 시각, 연장근무 시간 표시의 기준이다.

| 항목 | 내용 |
|:---|:---|
| 누가 | ① KFS 관리자(`admin/admin/1111`) — 회사 근태 설정 ② 경영관리팀(kalpa 과장 301) — 근태정책 |
| 언제 | 도입 때, 근무시간 규정이 바뀔 때(새 적용시작일 행을 더한다) |
| 먼저 있어야 하는 것 | SYS-BZ-0001(회사), SYS-BZ-0008(영업일·휴일 달력 — 일괄생성·현황의 근무일/휴일 판단) |
| 다음 이벤트 | ATT-BZ-0002(출퇴근), 0003·0004(연장·오후근무), 0005(관리자 근태관리) |
| 실제 실행 | kalpa, 2026-11-12, API. 정책 `2026-11-01` 09:00~18:00·휴게 60·연장허용 120·지각 10·조기 0·초과인정 15·오후근무 13:00~22:00 |
| 메뉴 | #1075 관리자 > 01. 고객관리 > 고객별 시스템정보 관리 → 경영·회계 탭, #1485 경영관리 > 06. 근태관리 > 근태관리(관리자) → [근태정책설정]. **kalpa 회사 메뉴에는 근태관리(#1485~#1487·#1492)가 없다**(S1 상품). 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS 관리자 | #1075 | 회사 선택 → 경영·회계 탭 → `근태 팝업사용` 체크(필요하면 `근태 잠금사용`) → [저장] | 그 회사 직원이 로그인하면 출퇴근 창이 뜬다(ATT-BZ-0002) |
| 2 | 경영관리 | #1485 | [근태정책설정] → 근태정책 창 [등록] | 빈 줄 |
| 3 | 〃 | 근태정책 창 | 적용시작일·출근시간·퇴근시간·휴게시간(분)·사용·연장허용시간(분)·지각 허용·조기 허용·초과인정 유예·오후근무 출근/퇴근 → [저장] | 줄이 저장된다. 빈 칸이 있으면 "○○은 필수입력 항목입니다"(화면 검사) |
| 4 | 〃 | 〃 | 줄 고르고 [삭제] → [예] | 줄이 지워진다 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `sys01_company` | `sys01_commute_popup_yn`·`sys01_commute_lock_yn` | kalpa 팝업 `true`(잠금 false) |
| `att01_work_policy` | 적용시작일별 정책 1줄 | kalpa +1 (`202611129140059`) |

## 결과를 볼 수 있는 화면

- 로그인 직후 출퇴근 창(정책의 출근·퇴근 시각이 기준으로 보인다), #1485 근무형태·상태 열, 연장근무 신청 창의 근무시간(`18:00 ~ 20:00`).

## 업무 규칙 · 주의

- 정책은 **그 날짜 이전의 가장 최근 적용시작일** 행을 쓴다(`att01_start_date <= 근무일 ORDER BY DESC LIMIT 1`, 사용=true). 연장근무 창은 정책이 **정확히 1건**일 때만 정책을 쓴다(AS-IS `defaultInfo` — `selectPolicies` 결과가 1건이 아니면 "정책 없음").
- 필수값 검사(출근·퇴근·휴게·연장허용·유예 3개)는 **화면에만 있다**. 원본 서버(`Att01_WorkPolicy.update` — UpdateDataModel)도 TOBE 서버(`AttWorkPolicyService.save` L37-49)도 값을 보지 않는다. 실행: **사원 401**이 `PUT /api/v1/att/work-policies [{startDate:"2026-12-01", useYn:true}]` → 200, 출근·퇴근 시각이 빈 정책이 저장됐다(바로 지움) → [의심 #62](../../보안_및_버그_의심.md)(권한)·#64(필수값).
- 이 API에 메뉴 권한 검사가 없다(회사만 본다) — 사원이 회사 정책을 바꾸거나 지울 수 있다 → [의심 #62].
- `근태 잠금사용`은 원본에서 동작하지 않는다(상태코드 열이 없어 분기가 늘 거짓) → [이상한점 #224](../../../원본-이상한점.md). 정책이 없는 회사에서 출근 기록이 있으면 원본 출퇴근 창이 NPE(TOBE는 건너뜀) → [이상한점 #225].
- 출퇴근 미사용 사원 테이블(`att05_excluded_person`)은 쓰는 화면이 없다(원본·TOBE 모두).
- 지움: `DELETE /api/v1/att/work-policies` 본문 `[id,…]`(쿼리 `ids=`로 보내면 500 — 화면은 본문으로 보낸다).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ATT-BZ-0001
needs: [SYS-BZ-0001, SYS-BZ-0008]
steps:
  - no: 1
    actor: { company: admin, user: admin, password: "1111" }
    api: PUT /api/v1/sys/companies/{kalpaId}/account   # GET …/account 값 그대로 + commutePopupYn "true"
    expect: { commutePopupYn: "true" }
  - no: 3
    actor: { company: kalpa, user: "301", password: "1111" }
    api: PUT /api/v1/att/work-policies
    body: [{ startDate: "2026-11-01", workStartTime: "09:00", workEndTime: "18:00", breakMinutes: 60, useYn: true, overtimeMinutes: 120,
             startGraceAfterMinutes: 10, endGraceBeforeMinutes: 0, endGraceAfterMinutes: 15, pmWorkStartTime: "13:00", pmWorkEndTime: "22:00" }]
    expect: { rows: 1, track: { att01_work_policy: +1 } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Sys01_TabPage_Info04`(근태 잠금·팝업 열), `MainFrame.checkCommute` L336-374(팝업사용일 때만), `Att01_Lookup_WorkPolicy`(E0~E6, `update` L143-235 화면 검사), 서버 `att.Att01_WorkPolicy.update`·`delete`(UpdateDataModel)·`selectByCompanyId`·`notWorkPolicyIdList`·`getModel`.
- TOBE: `PUT /api/v1/sys/companies/{id}/account`, `AttWorkPolicyController`(`GET`·`GET /active`·`PUT`·`DELETE`), `AttWorkPolicyService`, `Att01_Lookup_WorkPolicy.tsx`, `Sys01_TabPage_Info04.tsx`.
</details>
