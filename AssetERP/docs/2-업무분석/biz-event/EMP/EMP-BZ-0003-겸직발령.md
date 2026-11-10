# EMP-BZ-0003 직원에게 겸직을 발령한다

> **한 줄 요약** — 한 직원이 다른 조직 일도 맡으면 #1029 **겸직 탭**에서 겸직을 등록한다. 그러면 **겸직용 사원이 하나 더 생긴다**(사번 `499-PT1`, 발령구분 `800 겸직`). 직원은 로그인한 뒤 겸직으로 바꿔 그 조직의 결재 등을 한다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 고객사 관리자 — `kalpa/admin/1111` |
| 언제 | 겸직 발령 때 |
| 먼저 있어야 하는 것 | EMP-BZ-0001(본래 사원), ORG-BZ-0001(겸직 조직) |
| 다음 이벤트 | 직원의 겸직 전환(로그인 뒤 겸직 선택), 겸직이 끝나면 삭제 |
| 실제 실행 | kalpa, 2026-11-10 — `499 시험사원`에게 2026-11-12자 경영지원본부 겸직 → 삭제 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 고객사 관리자 | **#1029** 사원정보 관리 | `499` 선택 → **겸직** 탭 → [등록] | 겸직 등록 창 |
| 2 | 〃 | 〃 | 시작일 `2026-11-12`, 조직 `경영지원본부`, 직책 `팀원`, 직위 `과장`, 사유 `겸직` → 저장 | 겸직 목록에 한 줄. 사번 `499-PT1` |
| 3 | 〃 | 〃 | 그 행 → [삭제] → [예] | 줄이 없어진다. 결재 기록이 있는 겸직이면 "해당 겸직은 삭제할 수 없습니다. 관리자에게 문의해주세요" |

## DB에 남는 것

| 테이블 | 무엇 | 등록 | 삭제(TOBE) | 삭제(원본) |
|:---|:---|---:|---:|---:|
| `emp01_person` | 겸직용 사원(사번 `{사번}-PT{n}`, 이름 같음) | +1 | -1 | -1 |
| `emp02_others` | 기타정보(본래 사원에서 복사) | +1 | -1 | 그대로 남음 |
| `emp03_trans` | 겸직 발령(`800`) | +1 | -1 | 그대로 남음 |
| `emp04_add_title` | 겸직(본래 사원 · 겸직용 사원 `emp04_add_person_id` · 조직 · 시작/종료일) | +1 | -1 | -1 |
| `emp99_person_del` | 사원 삭제 이력 | 0 | **0** | **+1** |

## 결과를 볼 수 있는 화면

- #1029 겸직 탭, #1029 목록 필터 `겸직`, #1030 조직별 사원조회, 로그인 뒤 겸직 전환 목록(`GET /api/v1/emp/add-titles/login-list`).

## 업무 규칙 · 주의

- 겸직 사번은 본래 사번 + `-PT` + (그 사원 겸직 번호 중 가장 큰 것 + 1)(원본 `Emp04_AddTitle.updateList` L46-118).
- 겸직용 사원으로 결재(`apr01_appr`·`apr04_appr_step`)를 한 적이 있으면 삭제할 수 없다.
- 차이 — **삭제 때 TOBE는 삭제 이력(`emp99_person_del`)을 남기지 않는다.** 원본 `deleteList` L120-143은 이력을 넣고 `emp01_person`만 지운다(기타정보·발령 삭제는 주석 처리라 행이 남는다). TOBE `EmpAddTitleService.deleteAddTitle` L80-92는 셋 다 지우고 이력은 넣지 않는다. 남는 행을 지우는 것은 개선이지만, 삭제 이력이 빠진 것은 원본과 다르다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: EMP-BZ-0003
needs: [EMP-BZ-0002]
actor: { company: kalpa, user: admin, password: "1111" }
steps:
  - no: 2
    api: POST /api/v1/emp/add-titles
    body: { personId: "<499>", startDate: "2026-11-12", orgCodeId: "<경영지원본부>", orgHeadYn: "false",
            titleCd: "250", posCd: "500", transReason: "겸직" }
    expect: [{ table: emp01_person, delta: +1 }, { table: emp02_others, delta: +1 },
             { table: emp03_trans, delta: +1 }, { table: emp04_add_title, delta: +1 }]
  - no: 3
    api: DELETE /api/v1/emp/add-titles/{addTitleId}
    expect: [{ table: emp04_add_title, delta: -1 }, { table: emp99_person_del, delta: 0 }]   # 원본은 +1
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Emp04_TabPage_AddTitle` [등록] E2 `insertRow` L122-139(`Emp04_Edit_AddTitle`) · [삭제] E3 → E5 `delete` L162-181(`deleteList` → `delete`)
- AS-IS 서버: `emp.Emp04_AddTitle.updateList` L46-118, `deleteList` L120-143
- TOBE: `POST·PUT /api/v1/emp/add-titles`, `DELETE /api/v1/emp/add-titles/{addTitleId}`(`EmpAddTitleService`)
- TOBE 상태(2026-11-10): **실행** — 등록 4개 테이블 +1 · 사번 `499-PT1`, 삭제. 화면 눈 확인은 `대기`.
</details>
