# EMP-BZ-0017 회사가 직원에게 포상휴가를 준다

> **한 줄 요약** — 우수사원 포상으로 경영관리팀이 #1234에서 "일수·사용기간·대상 직원"을 정해 결재(품의서)를 받는다. **결재가 완료(30)되면 대상 직원에게 포상휴가 잔여일이 생기고**, 직원은 #1032에서 휴가구분 `포상휴가`를 골라 그 포상으로 휴가를 신청한다. 포상휴가는 연차(발생·사용)와 따로 센다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리팀(과장 `kalpa/301/Kalpa1234!`) → 결재자(부장 `kalpa/201`) → 대상 직원(`kalpa/401`·`402`) |
| 언제 | 수시(포상할 때) |
| 먼저 있어야 하는 것 | EMP-BZ-0001(직원), 문서분류(`A25` 포상휴가 품의서 — kalpa는 분류 미지정이라 **휴가신청서** 분류로 대신 씀), 직원이 쓰려면 EMP-BZ-0014(휴가 신청·결재)와 신청서 분류(`A01`) |
| 다음 이벤트 | 직원이 포상휴가를 신청해 쓴다(EMP-BZ-0014). 포상 잔여는 직원 휴가 화면의 "포상휴가" 칸으로 본다 |
| 실제 실행 | kalpa, 2026-11-12, API(T3600 DB). 일수 2·12/1~12/31·대상 김사원 최사원 → 상신·승인 → 직원 401 1일 사용 → 수정·삭제 검사 |
| 메뉴 | #1234 경영관리 > 02. 휴가/출장 관리 > 포상휴가관리 (kalpa 있음, 화면 눈 확인 `대기`) |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 과장 | **#1234** | 조회기간(올해 1/1~오늘) → [조회] | 포상휴가 목록(사유·포상일수·사용시작일·사용만료일·결재상태·결재요청·비고) |
| 2 | 〃 | 〃 | [등록] → 사유 `연간 우수사원 포상`, 포상일수 `2`, 사용시작일 `2026-12-01`, 사용만료일 `2026-12-31` → [저장] | 행이 저장됨(결재상태 빈칸). 필수 입력이 비면 "사용시작일은 필수선택 항목입니다." 등 |
| 3 | 〃 | 〃 | 행 선택 → 오른쪽 대상자 표 [등록] → 사원 조회창에서 `김사원`·`최사원` → [저장] | 조직·성명이 표에 나옴. 상신 중인 문서면 "상신 중인 문서의 정보는 수정이 불가능합니다" |
| 4 | 〃 | 〃 | [문서분류지정]에서 분류 선택 → 행의 [결재요청] 셀 | 결재문서 창 `포상휴가 품의서 (2026.12.01 ~ 2026.12.31 / 2일)`(본문에 대상자·일수). 분류 없이 누르면 "[문서분류지정]에서 먼저 문서분류를 선택해주세요" |
| 5 | 〃 | 결재문서 창 | 결재: 부장 → [결재요청] | 결재상태 `상신` |
| 6 | 부장 | 결재할 문서함 | [승인] | 결재상태 `완료` |
| 7 | 직원 | #1032 휴가신청 | [등록] → 휴가구분 `포상휴가` → 포상휴가 내역 창에서 고름 → 기간·일수 입력 → [저장] → 결재 상신 | "포상휴가 사용가능 기간은 […]입니다." / "포상사용횟수 초과입니다"(화면 검사). 통과하면 신청서 `포상휴가 신청서` |
| 8 | 팀장 | 결재할 문서함 | [승인] | 직원의 포상 잔여가 줄어든다 |

## DB에 남는 것

| 테이블 | 무엇 | 단계 |
|:---|:---|:---|
| `emp22_etc_leave` | 포상휴가(구분 `05`·사유·일수·사용기간·결재문서) | 2 +1, 4 appr_id |
| `emp23_etc_leave_person` | 대상 직원 | 3 +직원 수 |
| `apr01_appr`·`apr04_appr_step` | 품의서(상신→완료)·결재선 2줄 | 4~6 +1 |
| `emp20_leave` | 직원이 쓴 포상휴가(`emp20_etc_leave_id`로 연결) | 7 +1 |

## 결과를 볼 수 있는 화면

- #1234(결재상태·상세보기), 결재 문서함, 직원 본인의 휴가 잔여(포상휴가 칸 — `GET /api/v1/emp/leaves/days`의 `etcTotalDays·etcUseDays·etcRemainDays`), #1033·#1035.

## 업무 규칙 · 주의

- **포상 잔여가 생기는 조건**(`f_get_leave_days2` 유형 7·8·9): 결재 완료(30) + 구분 `05` + **대상 직원으로 지정된 사람만**. 상신 중이거나 지정 안 된 직원은 `null`.
- 실행 결과(2026-11-12): 승인 전 김사원 포상 칸 `null` → 승인 뒤 김사원·최사원 **2일**, 지정 안 한 김사장은 `null`. 김사원이 12/10 1일을 쓰고 팀장이 승인하니 포상 잔여 **2 → 1**, **연차 사용은 그대로 2**(포상휴가는 연차를 깎지 않는다).
- 포상 사용일은 `apprCheckYn=false`로 센다 — **상신하지 않은 임시 저장 신청도 포상 사용일에 잡힌다**(원본 같음). 한도 초과로 저장된 3일 임시 신청이 있으면 포상 잔여가 −3으로 보였고 지우니 1로 돌아왔다.
- **한도 초과·사용 기간 검사와 수정·삭제 막기는 화면에만 있다**(원본·TOBE 같음): 신청 때 `Emp20_Edit_Leave` L796-835, 수정·삭제는 `preUpdate`·`deleteCheck`(완료 문서 "결재완료된 문서가 존재합니다", 진행 중 "결재진행 중인 문서가 존재합니다"). 서버는 모두 통과시킨다 → [보안_및_버그_의심 #5·#6](../../보안_및_버그_의심.md).
- 서버가 막는 것: 대상자 [저장]은 상신된 포상휴가면 "상신 중인 문서의 정보는 수정이 불가능합니다"(`INVALID_INPUT`).
- 삭제하면 결재문서는 폐기문서로 옮겨지지만(`apr99_appr_del` +1) 대상자(`emp23`) 행과 이미 쓴 휴가(`emp20`)는 그대로 남는다(원본도 `delete`가 `emp22`만 지움).
- 안 한 것: 화면 눈 확인, 사용 기간이 이미 끝난 포상(`9` 미사용 기간종료 차감) 계산, 월말 등 기간 경계.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: EMP-BZ-0017
needs: [EMP-BZ-0001, EMP-BZ-0014]
steps:
  - no: 2
    actor: { company: kalpa, user: "301", password: "Kalpa1234!" }
    api: PUT /api/v1/emp/etc-leaves
    body: [{ etcLeaveId: 0, reason: "연간 우수사원 포상", days: 2, startDate: "2026-12-01", closeDate: "2026-12-31", note: "업무분석 시험" }]
    expect: { table: emp22_etc_leave, delta: +1 }
  - no: 3
    api: PUT /api/v1/emp/etc-leave-persons
    body: [{ etcLeavePersonId: 0, etcLeaveId: "<2>", personId: "<401>" }, { etcLeavePersonId: 0, etcLeaveId: "<2>", personId: "<402>" }]
    expect: { table: emp23_etc_leave_person, delta: +2 }
  - no: 4~5
    api:
      - GET /api/v1/apr/apprs/new?classTreeId=<휴가신청서>
      - GET /api/v1/apr/apprs/link-seed?classTreeId=…&linkCode=A25&refId=<etcLeaveId>   # 제목 "포상휴가 품의서 (2026.12.01 ~ 2026.12.31 / 2일)"
      - PUT /api/v1/apr/apprs/{apprId}   # mode request, linkCode A25, effectDate 필수, steps 001 상신 301 + 002 결재(10) 201
      - PUT /api/v1/emp/etc-leaves/{etcLeaveId}/appr-id   # { apprId }
  - no: 6
    actor: { user: "201" }
    api: POST /api/v1/apr/apprs/{apprId}/confirm   # { action: confirm, message }
    expect: { api: "GET /api/v1/emp/leaves/days?personId=<401>&stdYear=2026", fields: { etcTotalDays: 2.0, etcUseDays: 0.0, etcRemainDays: 2.0 }, notAssigned: { personId: "<100>", etcTotalDays: null } }
  - no: 7~8
    actor: { user: "401" }
    api:
      - PUT /api/v1/emp/my-leaves   # 본문은 배열이 아니라 객체. leaveCode "05", etcLeaveId, 12/10 1일
      - GET /api/v1/apr/apprs/link-seed?classTreeId=<휴가신청서>&linkCode=A01&refId=<leaveId>   # "포상휴가 신청서 / 김사원 사원 (2026-12-10~2026-12-10)"
      - PUT /api/v1/apr/apprs/{apprId}  → PUT /api/v1/emp/my-leaves/{leaveId}/appr-id
    expect: { after: 301 confirm, etcUseDays: 1.0, etcRemainDays: 1.0, useDays: 2.0 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Emp22_Tab_EtcLeave`(#1234) — [조회]·[등록]·[삭제]·[저장]·[문서분류지정]·[결재요청] 셀 + `Emp23_Page_EtcLeavePerson`(대상자 [등록]·[저장]·[삭제]). 이벤트 E0~E10, `preUpdate` L393-453, `deleteCheck` L323-360, `insertLinkApproval` L238-261.
- AS-IS 서버: `emp.Emp22_EtcLeave`(`selectByDate` L57, `updateApprId` L89, `deleteApprId` L101, `update` L111, `delete` L133), `emp.Emp23_EtcLeavePerson`, 신청 때 `emp.Emp22_EtcLeave.selectByEtcLeaveId`(`Emp20_Edit_Leave` L807), DB 함수 `f_get_leave_days2`(유형 7·8·9).
- TOBE: `/api/v1/emp/etc-leaves`(`GET /search`·`PUT`·`PUT /{id}/appr-id`·`DELETE`), `/api/v1/emp/etc-leave-persons`, `GET /api/v1/emp/my-leaves/etc-leaves/{id}`(신청 때 한도 조회), `EtcLeaveLinkSeedProvider`(A25).
- TOBE 상태(2026-11-12): 실행(API). 화면 눈 확인 `대기`.
</details>
