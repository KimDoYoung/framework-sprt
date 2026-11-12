# EMP-BZ-0016 회사가 모두 쉬는 날(공동연차)을 정한다

> **한 줄 요약** — 연말·연휴 사이처럼 회사 전체가 쉬는 날을 경영관리팀이 #1233에서 등록하고 결재(품의서)를 받는다. **결재가 완료(30)되면 입사일이 시작일보다 앞선 모든 직원의 연차 사용일수가 그날수만큼 늘고**(휴가 신청 없이), 제외사원으로 올린 직원만 빠진다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리팀(과장 `kalpa/301/Kalpa1234!`) → 결재자(부장 `kalpa/201`) |
| 언제 | 해마다 연말·연휴 전 |
| 먼저 있어야 하는 것 | EMP-BZ-0001(직원), SYS-BZ-0009(결산월), 문서분류(`A24` 공동연차 품의서 — kalpa는 `dcr30_link` A24 분류가 비어 있어 **휴가신청서** 분류로 대신 씀) |
| 다음 이벤트 | 연차 사용촉진(EMP-BZ-0015)의 사용일수·#1035 연월차휴가 현황·직원 잔여일에 반영 |
| 실제 실행 | kalpa, 2026-11-12, API(T3600 DB). 12/24 하루 공동연차 → 최사원 제외 → 상신·승인 → 사용일수 확인 → 삭제 |
| 메뉴 | #1233 경영관리 > 02. 휴가/출장 관리 > 공동연차관리 (kalpa는 메뉴 있음, 화면 눈 확인은 `대기`) |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 과장 | **#1233** | 기준연도 `2026` → [조회] | 그해 공동연차 목록(시작일·종료일·사유·상신상태·상세보기) |
| 2 | 〃 | 〃 | [등록] → 시작일 `2026-12-24`·종료일 `2026-12-24`·사유 `연말 공동연차` → [저장] | 행 생김, 상신상태 빈칸 |
| 3 | 〃 | 〃 | 행 선택 → 아래 제외사원 표 [등록] → 사원 조회창에서 `최사원` → 제외사유 `외부 파견 근무` → [저장] | 제외사원 표에 조직·사원명·사유 |
| 4 | 〃 | 〃 | [문서분류지정]에서 분류 선택 → 행 체크 → [승인신청] | 결재문서 창 "공동연차 품의서"(본문에 기간·사유 표). 분류 없이 누르면 "[문서분류지정]에서 먼저 문서분류를 선택해주세요", 결재 중·완료 행이면 "결재 중인 문서이거나, 완료된 문서가 포함되어있습니다" |
| 5 | 〃 | 결재문서 창 | 결재: 부장 → [결재요청] | 상신상태 `상신` |
| 6 | 부장 | 결재할 문서함 | [승인] | 상신상태 `완료` |
| 7 | 직원 | #1035 / 휴가 잔여 | — | 제외 안 한 직원은 **사용일수 +1·잔여 −1**, 제외한 직원은 그대로 |
| 8 | 과장 | #1233 | 행 체크 → [삭제] → "결재완료된 문서도 같이 삭제됩니다. 1건의 정보를 삭제하시겠습니까?" → 예 | 행 사라짐, 결재문서는 폐기문서로 옮겨짐, 사용일수가 원래대로. 결재 중(10·20)이면 "결재진행 중인 문서가 존재합니다" |

## DB에 남는 것

| 테이블 | 무엇 | 단계 |
|:---|:---|:---|
| `emp24_joint_leave` | 시작일·종료일·사유·결재문서 ID(`emp24_appr_id`) | 2 +1, 4 appr_id, 8 −1 |
| `emp28_joint_leave_except` | 제외 사원·사유 | 3 +1, 8 **지워지지 않음**(원본도 같음 → 의심 #3) |
| `apr01_appr`·`apr04_appr_step` | 품의서(상신 → 완료)·결재선 2줄 | 4~6 +1, 8 −1 |
| `apr99_appr_del` | 폐기 문서 | 8 +1 |

## 결과를 볼 수 있는 화면

- #1233(상신상태·상세보기), 결재 문서함, #1035 연월차휴가 현황, 직원 본인의 잔여연차(`f_get_leave_days`).

## 업무 규칙 · 주의

- **사용일수에 들어가는 조건**(DB 함수 `f_get_leave_days`): 결재상태 `30`(완료)이고, 직원 **입사일 < 공동연차 시작일**이고, 제외사원이 아닐 때만 `01 연차`로 센다. 상신·진행 중이면 아직 아니다. 시작~종료일이 여러 날이면 그 기간이 사용일에 들어간다.
- 실행 결과(2026-11-12): 12/24 하루 공동연차, 부장 승인 뒤 김사원 사용 2→**3**(잔여 15→14), 김사장 0→**1**, 제외한 최사원 0 그대로(잔여 17). 삭제하니 김사원 2로 돌아옴.
- 결재선은 상신자(과장 본인)+결재(부장)이다. 직원은 이 화면의 결재를 받지 않는다 — **공동연차는 직원 동의 없이 연차를 깎는다**.
- 문서분류 `A24`는 kalpa에 지정돼 있지 않았다(asseterpdb 전 회사 `dcr30_link` 분류 비어 있음, EMP-BZ-0015와 같음). 화면에서는 [문서분류지정]으로 고르고, 그 분류에 양식이 없어도 본문은 `공동연차 품의서`로 만들어진다(`JointLeaveLinkSeedProvider`).
- 상신 본문 시드는 `link-seed`의 `ids`(공동연차 ID 쉼표목록)로 받는다 — `refId`로 보내면 "공동연차 정보를 찾을 수 없습니다"(API 문서·시험은 `ids`).
- 시드의 시행일은 오늘로 들어온다. 결재 저장은 시행일이 필수라 비어 있으면 `ok:false`.
- 확인: 원본 변경(IDMS-IC)과 TOBE 동작이 같다. 안 한 것: 화면 눈 확인, 메뉴 권한 없는 직원의 접근(API는 메뉴를 보지 않음).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: EMP-BZ-0016
needs: [EMP-BZ-0001, SYS-BZ-0009]
steps:
  - no: 2
    actor: { company: kalpa, user: "301", password: "Kalpa1234!" }
    api: PUT /api/v1/emp/joint-leaves
    body: [{ jointLeaveId: 0, startDate: "2026-12-24", closeDate: "2026-12-24", reason: "연말 공동연차" }]
    expect: { table: emp24_joint_leave, delta: +1 }
  - no: 3
    api: PUT /api/v1/emp/joint-leave-excepts
    body: [{ jointLeaveExceptId: 0, jointLeaveId: "<2에서 받은 id>", personId: "<402>", reason: "외부 파견 근무" }]
    expect: { table: emp28_joint_leave_except, delta: +1 }
  - no: 4~5
    api:
      - GET /api/v1/apr/apprs/new?classTreeId=<휴가신청서>
      - GET /api/v1/apr/apprs/link-seed?classTreeId=…&linkCode=A24&refId=0&ids=<jointLeaveId>   # 제목 "공동연차 품의서"
      - PUT /api/v1/apr/apprs/{apprId}   # mode request, linkCode A24, effectDate 필수, steps 001 상신 301 + 002 결재(10) 201
      - PUT /api/v1/emp/joint-leaves/appr-id   # { ids: [jointLeaveId], apprId }
    expect: { field: apprStatusName, value: "상신" }
  - no: 6
    actor: { user: "201" }
    api: POST /api/v1/apr/apprs/{apprId}/confirm   # { action: confirm, message }
  - no: 7
    api: GET /api/v1/emp/leaves/days?personId=<401>&stdYear=2026
    expect: { field: useDays, value: "+1", except402: "그대로" }
  - no: 8
    api: DELETE /api/v1/emp/joint-leaves   # [jointLeaveId]
    expect: [{ table: emp24_joint_leave, delta: -1 }, { table: apr99_appr_del, delta: +1 }, { table: emp28_joint_leave_except, delta: 0 }]
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Emp24_Tab_JointLeave`(#1233) — 버튼 [조회]·[등록]·[저장]·[삭제]·[승인신청]·[문서분류지정], 제외사원 [등록]·[저장]·[삭제]. 이벤트 E0~E13(`insertLinkApprovals` L270-306, `deleteCheck` L392-428, `delete` L518-543).
- AS-IS 서버: `emp.Emp24_JointLeave`(`selectByYear` L38, `updateApprId` L49, `deleteApprId` L64, `update` L76, `delete` L81), `emp.Emp28_JointLeaveExcept`, DB 함수 `f_get_leave_days`.
- TOBE: `/api/v1/emp/joint-leaves`(`GET`·`PUT`·`DELETE`·`PUT /appr-id`), `/api/v1/emp/joint-leave-excepts`, `JointLeaveLinkSeedProvider`(A24), 화면 `Emp24_Tab_JointLeave.tsx`. 짝: 서비스 9/10(원본 `delete`는 `deleteApprId`가 대신), 테이블 11 같음.
- TOBE 상태(2026-11-12): 실행(API). 화면 눈 확인 `대기`.
</details>
