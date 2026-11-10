# EMP-BZ-0007 특정직위와 알림 대상을 정한다

> **한 줄 요약** — 준법감시인·경영본부장 같은 **특정직위**와, 내부통제(법규) 알림·상신문서 알림을 받을 사람을 고객사 관리자가 #1029 [특정직위 및 알림설정] 창에서 한꺼번에 정한다. 특정직위는 직위 코드 하나당 **1명만** 지정할 수 있다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 고객사 관리자 — `kalpa/admin/1111` |
| 언제 | 도입 때, 담당자가 바뀔 때 |
| 먼저 있어야 하는 것 | EMP-BZ-0001. 특정직위 코드(`EmpGradeCode`)는 SYS-BZ-0007 코드복사로 회사에 있어야 한다 |
| 다음 이벤트 | 내부통제(ICS)·전자결재(APR) 알림이 이 대상에게 간다 |
| 실제 실행 | kalpa, 2026-11-10 — `202 정부장`에게 `110 경영본부장` + 알림 둘 다 켰다가 되돌림 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 고객사 관리자 | **#1029** 사원정보 관리 → 일반발령 탭 | [특정직위 및 알림설정] | "특정직위 및 알림설정" 창. 기준일 오늘 기준 재직자 전원(7명) |
| 2 | 〃 | 〃 | `정부장` 행의 특정직위 칸 → `경영본부장`, 법규 알림·상신문서 알림 체크 → [저장] | 저장 뒤 다시 조회되어 값이 그대로 나온다 |
| 3 | 〃 | 〃 | 같은 특정직위를 두 사람에게 주고 [저장] | "특정직위는 1명만 지정가능합니다" (110·120·121만 해당, 130 위험관리인 등은 여러 명 가능) |

- 특정직위 코드(kalpa): `00` 없음 · `110` 경영본부장 · `120` 준법감시인 · `121` 준법감시참조 · `130` 위험관리인 …
- 원본 소스에는 사원 선택 돋보기(`personName`, E1)가 정의돼 있지만 그리드 열에 붙어 있지 않아 화면에서는 쓰이지 않는다(TOBE도 없음).
- 알림설정은 **사원당 한 줄**(`emp25_mypage_notice`)이라 저장할 때 없으면 만들고 있으면 고친다. 마이페이지 "설정"(MySetting 화면)에서 본인도 고칠 수 있다.

## DB에 남는 것

| 테이블 | 무엇 | 변화 |
|:---|:---|---|
| `emp03_trans` | 그 사원의 **그 기준일 발령 행**의 `emp03_grade_cd` | 행 수 그대로(값만 바뀜) |
| `emp25_mypage_notice` | 법규 알림(`ics_yn`)·상신문서 알림(`appr_yn`) | 처음이면 +1, 이미 있으면 고침 |

- 특정직위는 사람이 아니라 **발령 한 줄**에 붙는다. 그래서 다음 발령(이동·승진)을 새로 넣으면 앞 발령에서 이어 갈지는 [등록] 때 복사 규칙에 달려 있다(EMP-BZ-0002의 ⚠ 2: TOBE는 특정직위를 복사하지 않는다).

## 결과를 볼 수 있는 화면

- 이 창, #1029 일반발령 탭의 "특정직위" 칸, 마이페이지 설정의 알림 값.

## 업무 규칙 · 주의

- 대상 목록: 기준일의 **가장 늦은 발령**이 퇴직(900)이 아닌 사람, 겸직용 사원은 제외(원본 `emp03_trans.selectByGrade`). TOBE 목록이 원본 SQL과 행 수·열이 같다(`yunhee compare`: 7 = 7, 열 7개 포함).
- "1명만" 검사는 **화면에서만** 한다(원본과 같음). 서버(TOBE `EmpTransService.updateTransGrades` L117-135)는 두 사람에게 같은 특정직위가 가는 것을 막지 않는다 — API로 직접 부르면 가능하다. 원본도 같다.
- 없는 발령 ID로 저장하면 "데이터를 찾을 수 없습니다. 다시 조회해 주세요."(404).
- 실행 뒤 kalpa에 `emp25_mypage_notice` 행 1줄이 남았다(`정부장`, 둘 다 false). 이 테이블은 원본·TOBE 어디에도 삭제가 없다. 특정직위는 비웠다(NULL).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: EMP-BZ-0007
needs: [EMP-BZ-0001, SYS-BZ-0007]
actor: { company: kalpa, user: admin, password: "1111" }
steps:
  - no: 2
    api: PUT /api/v1/emp/trans/grades
    body: [{ transId: "<정부장 발령>", personId: "<정부장>", gradeCode: "110", icsYn: true, apprYn: true }]
    expect: [{ table: emp03_trans, delta: 0 }, { table: emp25_mypage_notice, delta: "+1(처음이면)" }]
  - no: 2
    api: GET /api/v1/emp/trans/grades?baseDate=2026-11-10
    expect: { row: { empNo: "202", gradeCode: "110", icsYn: true, apprYn: true } }
  - api: PUT /api/v1/emp/trans/grades
    body: [{ transId: 1, personId: "<정부장>", gradeCode: "110" }]
    expect: { http: 404 }
cleanup: PUT gradeCode null, icsYn false, apprYn false
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Emp03_Lookup_Grade`([특정직위 및 알림설정], E3 조회·E4 저장 `update` L169-245·E2 특정직위 콤보), 열기 `Emp03_TabPage_Trans` E1 `lookupGradeCode` L182-190
- AS-IS 서버: `emp.Emp03_Trans.selectByGrade`(SQL `emp03_trans.selectByGrade`), `emp.Emp03_Trans.update`, `emp.Emp25_MypageNotice.updateList`
- TOBE: `GET·PUT /api/v1/emp/trans/grades`(`EmpTransService.searchTransGrades`·`updateTransGrades`)
- TOBE 상태(2026-11-10): **실행** — 저장·조회·404, 목록은 원본 SQL과 같음. "1명만" 문구는 `Emp03_Lookup_Grade.tsx` L66에 있음(화면에서 실행해 보지는 않음). 화면 눈 확인은 `대기`.
</details>
