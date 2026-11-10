# EMP-BZ-0014 휴가를 신청하고 결재받는다

> **한 줄 요약** — 직원이 #1032 휴가신청에서 휴가구분·기간을 넣고 [계산] → [임시저장] → [상신하기]를 누르면 전자결재(링크코드 `A01`) 창이 열린다. 결재자가 승인하면 그 휴가가 `완료`가 되고, 경영관리팀은 #1033에서 직원별 휴가·잔여일수를, 모든 직원은 #1034에서 회사 전체 휴가 일정을 본다. 처음 한 번은 경영관리팀이 #1033 [문서분류지정]에서 휴가신청서(`A01`)의 문서분류를 정해 둬야 상신이 된다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 신청: 직원 — 이번엔 사원 `kalpa/401/Kalpa1234!`(김사원) · 결재: 상신자가 고른 결재자, 이번엔 팀장 `kalpa/301`(김과장) · 관리: 경영관리팀 — kalpa는 과장 `kalpa/301`(`경영 관리자`) |
| 언제 | 휴가를 쓰기 전 |
| 먼저 있어야 하는 것 | EMP-BZ-0001(사원·입사일 — 연차 발생), SYS-BZ-0008(영업일 달력 — 기간 계산), SYS-BZ-0009(휴가 결산기준·휴가기준 `sys31_leave_company`), **휴가신청서 문서분류 지정**(아래 1단계, `dcr30_link` A01). 본문 양식(`com10_form_mapping` A01 — SYS-BZ-0022 양식복사)이 있으면 본문이 채워져 나온다(kalpa는 상신 뒤 2026-11-10에 복사) |
| 다음 이벤트 | EMP-BZ-0015(연차 사용 지정통보·촉진), EMP-BZ-0016(공동연차), EMP-BZ-0017(포상휴가 — 포상휴가 신청의 근거), PAY 연차수당 |
| 실제 실행 | kalpa, 2026-11-10 — 과장이 A01 문서분류를 `휴가/휴가신청`으로 지정 → 김사원 연차 2026-11-16~17(2일) 임시저장 → 결재문서 상신(결재 김과장) → 연결 → 과장 승인 → **결재 완료**. 이 기록은 시나리오 데이터로 남겨 뒀다. 이어서 같은 날 특별휴가(최사원 → 박과장 승인, 남겨 둠)·대결자 지정·초과사용·출력을 따로 돌렸다(아래 "더 돌려 본 것") |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 과장 (처음 한 번) | **#1033** 경영관리 > 02. 휴가/출장 관리 > 휴가관리(경영관리팀) | [문서분류지정] → "문서분류지정" 창의 `A01 휴가신청서` 행에 문서분류 `휴가/휴가신청` → [저장] | 창을 열기만 해도 회사에 없는 링크 행이 모두 만들어진다(kalpa +93). 지정하지 않으면 6단계에서 "문서분류가 미지정 상태입니다. 관리자에게 문의해주세요" |
| 2 | 사원 | **#1032** 신청 > 01. 외출/출장/휴가 > 휴가신청 | 기준연도 `2026` → [조회] | 내 휴가 목록(시작일·종료일·휴가구분·기간·대직자·비고·문서상태·취소여부·초과휴가 승인) + 아래 요약(총 17 · 사용 0 · 잔여 17, 기간 2026-01-01 ~ 2026-12-31) |
| 3 | 〃 | 〃 | [등록] → 아래 폼: 휴가구분 `연차휴가`, 휴가시작일 `2026-11-16`, 휴가종료일 `2026-11-17`, 사유 `개인 사유`, 대직자 `최사원`, 비상망(휴대폰이 자동으로 들어옴) | 반차·반반차를 고르면 종료일 = 시작일로 묶인다. 특별휴가(04)면 특별휴가 사유 콤보, 포상휴가(05)면 포상휴가 내역 창이 열린다 |
| 4 | 〃 | 〃 | [계산] | 기간 `2`(영업일 기준 — 휴가기준의 계산방식). 빠지면 "휴가시작일을 입력하세요"·"휴가종료일을 입력하세요" |
| 5 | 〃 | 〃 | [임시저장] | 목록에 행이 생기고 문서상태 빈칸. 빠지면 "휴가구분은 필수선택 항목입니다"·"휴가종료일은 필수선택 항목입니다"·"대직자는 필수입력 항목입니다"·"비상망은 필수입력 항목입니다"·"기간 값이 없습니다. 계산 후 저장해주세요" |
| 6 | 〃 | 〃 | [상신하기] | 다시 저장한 뒤 잔여일수를 검사하고(아래 "초과사용") 결재문서 창이 열린다: 제목 `연차휴가 신청서 / 김사원 사원 (2026-11-16~2026-11-17)`(고정), 시행일 = 휴가시작일, 본문은 회사 A01 양식에 휴가 값이 채워져 나온다 |
| 7 | 〃 | 결재문서 창 | (양식이 없으면 본문을 적는다) → 결재선에 **결재: 김과장** → [결재요청] | 창이 닫히고 #1032 행의 문서상태 `상신`, 요약의 사용 2 · 잔여 15. 상신된 행은 폼 단추가 숨고 [삭제]는 "해당 문서는 삭제가 불가능합니다" |
| 8 | 과장 | 결재할 문서함 → 그 문서 | [승인] → `승인합니다` | #1032·#1033 문서상태 `완료` |
| 9 | 과장 | #1033 | 기준연도 `2026`, 사원명 `김사원`(돋보기) → [조회] | 김사원 휴가 1건(완료) + 요약 유급휴가 총 17 · 사용 2 · 잔여 15 |
| 10 | 아무 직원 | **#1034** 신청 > 01. 외출/출장/휴가 > 휴가신청조회 | 조회기간 `2026-11-01 ~ 2026-11-30` → [조회] | 회사 전체 휴가 일정: 휴가시작일·종료일·성명 `김사원`·기간 2·휴가구분·대직자·비상망. [출력/다운로드]는 RD |

### 초과사용

잔여일수가 모자라면 6단계에서 회사 설정(`sys01_company` 휴가 초과사용 `leave_yn`·초과사용 승인 `leave_confirm_yn`)에 따라 갈린다.

| 회사 설정 | 결과 |
|:---|:---|
| 초과사용 안 됨 (kalpa) | "휴가사용횟수 초과입니다" — 상신 안 됨 |
| 초과사용 됨 · 승인 없음 | 그냥 상신 |
| 초과사용 됨 · 승인 있음 | 특별·포상휴가이거나 초과사용이 이미 `20 승인`이면 상신, 아니면 "사용가능일수를 초과하였습니다. 초과사용 승인완료 후 상신하세요" → 직원이 [초과사용 승인요청]으로 승인자를 골라 문자를 보내고(상태 `10 신청`), 경영관리팀이 #1033 초과휴가 [승인]·[반려]·[취소] |

두 설정은 KFS가 **#1075 고객사 등록 → 경영·회계 탭**(`Sys01_TabPage_Info04`)의 `휴가 초과사용허용`·`초과사용 상신전 승인요청`에서 정한다. 이 검사는 원본·TOBE 모두 **화면에서만** 한다(서버는 잔여일수를 보지 않는다).

## 더 돌려 본 것 (2026-11-10, API)

| 무엇 | 누가 | 결과 |
|:---|:---|:---|
| 특별휴가 | 최사원 `402` → 박과장 `302` 승인 | 경조휴가 - 본인결혼 2026-12-07~11(5일) 저장 → 상신(복사한 양식 본문 그대로, 제목 `특별휴가 신청서 / 최사원 사원 (…)`, 본문 사유 `경조휴가 - 본인결혼<br>결혼`) → **완료**. 연차는 그대로 총 17 · 사용 0 · 잔여 17(특별휴가는 연차에서 빼지 않는다). kalpa 휴가기준은 특별휴가 일수가 비어 있어 일수 한도 검사는 돌지 않는다. 기록은 남겨 둠 |
| 대결자 지정 | 박과장 `302` | 연차 11-23~24 임시저장 → [대결자 지정]으로 정부장 `202`(대결사유 `가족 여행`) 저장 → 목록 대결자 `정부장 부장`. 회사 0 양식에 대결자 칸이 없어 본문엔 안 나온다. [삭제] → "대결자 지정 내역도 함께 삭제하시겠습니까?" 예 = 휴가·대결자 둘 다 지움(아니오 = 휴가만, 원본 `deleteChk` L488-523과 같음). 결재가 대결자에게 가는지는 기간이 미래라 보지 못했다 |
| 초과사용 | 김사원 `401` → 김과장 `301` | 16일(12-01~22) 임시저장 → 잔여 −1 → [초과사용 승인요청](승인자 김과장) → **⚠ 거절** "SMS 발송 연동이 아직 없어 문자를 발송하지 않았습니다", 상태 그대로. #1033 [승인] API(`PUT /api/v1/emp/leaves/{id}/over-confirm` `20`)는 동작(승인·김과장·시각 기록). 시험 휴가는 지움 |
| 출력 | 직원 · 과장 | #1034 [출력/다운로드] → `sys99_print` +2(김사원·최사원) → RD 주소 `Emp20_Rd_LeaveList`, 옵션·넘기는 값이 원본과 같다. #1033 [엑셀다운로드] → `sys99_print` +1 → `Emp20_Rd_LeaveManager`. RD 화면 그리기는 브라우저가 필요해 보지 못했다(RD 시뮬레이터) |

## DB에 남는 것

| 테이블 | 무엇 | 단계 |
|:---|:---|:---|
| `dcr30_link` | 회사의 링크 행(창을 열 때 없는 것 모두 +93), A01의 문서분류 ID | 1 |
| `emp20_leave` | 휴가(휴가구분·시작일·종료일·기간·사유·대직자·비상망·문서분류, 결재문서 ID) | 5 +1, 7 뒤 결재문서 ID 채움 |
| `apr01_appr` | 결재문서(링크코드 A01, 상태 10 상신 → 완료) | 7 +1, 8 |
| `apr04_appr_step` | 결재선 001 상신 김사원 · 002 결재 김과장 | 7 +2, 8 승인 |
| `apr07_alt_appr` | 대결자 지정(폼의 [대결자 지정] — 대결자·기간·사유·비상망·휴가 ID) | 더 돌려 본 것 (지움) |
| `emp20_leave` 초과사용 열 | 초과사용 승인상태(10 신청 · 20 승인 · 30 반려)·승인자·승인시각 | 승인요청 · #1033 [승인] |
| `sys99_print` | 출력할 휴가 목록(그룹 ID별) | 출력 |

## 결과를 볼 수 있는 화면

- #1032 내 휴가 목록·요약, #1033 직원별 휴가·요약(결재 완료만 셈), #1034 회사 전체 휴가 일정, 결재 문서함, #1035 연월차휴가 현황.

## 업무 규칙 · 주의

- 목록·요약은 원본 SQL과 같다(`yunhee compare`): #1032 `emp20_leave.selectByPersonId` 1 = 1(열 17개 포함), 요약 `emp20_leave.selectByDays` 1 = 1, #1033 `selectByPersonId`(managerYn) 1 = 1(열 10개), #1034 `selectByPersonName` 1 = 1(열 7개).
- **사용일수를 세는 기준이 화면마다 다르다(원본과 같음).** #1032 직원 화면은 `apprCheckYn=false`로 상신 중인 휴가까지 사용으로 센다(7단계에서 이미 사용 2). #1033 경영관리팀 화면은 `apprCheckYn=true`로 결재가 끝난 휴가만 센다.
- **#1034는 회사 전체 직원의 휴가를 보인다**(원본 SQL이 회사로만 거른다). 사원명으로 좁힐 수 있다.
- 상신된·완료된 휴가는 수정·삭제가 막힌다. 원본은 화면에서만 막지만 TOBE는 서버도 막는다(`PUT /api/v1/emp/my-leaves` → "상신문서가 존재하는 내역은 수정이 불가능합니다", `DELETE` → "해당 문서는 삭제가 불가능합니다" — 2026-11-10 직접 불러 확인).
- [문서분류지정] 창은 **여는 것만으로 쓰기가 일어난다**(`Dcr30_Link.insertCheck` — 회사에 없는 링크 행을 만든다). 원본과 같다.
- **본문 양식이 회사마다 필요하다.** TOBE는 서버(`HrLinkSeedProvider` A01)가 원본 `Emp20_Edit_Leave.createMapping` L858-884와 같은 값(회사명·부서명·성명·직위·휴가구분·시작일·종료일·기간·사유·대결자·대직자·비상망·상신일)을 양식에 채운다. 이번 상신 때 kalpa에는 A01 양식이 없어 **원본에서도 본문이 빈 채로 열리고**, 결재 저장이 "내용은 필수입력 항목입니다"로 막혀 본문을 직접 적었다. 그 뒤 [SYS-BZ-0022](../SYS/SYS-BZ-0022-문서양식복사.md)로 양식을 복사하자 같은 휴가의 본문이 채워져 나왔다(`link-seed` 확인). 단 회사 0 양식의 `#{직무대행자}` 칸은 원본·TOBE 모두 채우지 않는다(키가 `대직자`) — 0022 "주의".
- ⚠ **TOBE 부족 — #1033 [휴가취소]가 되지 않는다.** 원본 `Emp20_Tab_LeaveManager.cancelMessage` L369-405 → 서버 `emp.Emp20_Leave.cancelUpdate` L124-239는 결재가 끝난 휴가의 결재문서를 지우고(`apr01_appr.insertApprDel`로 `apr99_appr_del`에 남긴 뒤 `deleteAppr`), 휴가를 취소로 표시하고, 직원에게 알림톡·메일·SMS를 보낸다. TOBE `Emp20_Tab_LeaveManager.tsx` L156은 확인창 뒤 "결재문서 삭제와 알림 발송(emp.Emp20_Leave.cancelUpdate)은 아직 변환 전입니다."만 띄운다(2026-10-28 사용자 결정: 1단계는 검사·확인창까지). 그래서 **결재가 끝난 휴가를 취소할 방법이 없고, 쓰지 않은 휴가도 사용일수에서 빠지지 않는다.**
- 결재 저장 API는 실패도 HTTP 200에 `ok: false`와 문구로 돌려준다(EMP-BZ-0013과 같다).
- **초과사용 승인요청 — 2026-11-10에 고쳤다(배포 뒤 확인 대기).** 처음 실행 때는 TOBE가 문자를 보내지 않기로 한 결정(2026-10-15, `DisabledSmsSender`)으로 늘 거절돼 "초과사용 승인 있음" 회사는 잔여일수를 넘는 휴가를 상신할 수 없었다. 같은 날 사용자 결정으로 문자 발송을 알림 시뮬레이터에 연결했다(`NoticeSmsSender` — `SmsSender`를 쓰는 11곳 모두). 원본 `sms.Sms02_History.sendMessage` L100-131처럼 회사가 문자발신 서비스를 신청하지 않았으면(`SMSok` = `asseterp.notice.sms-companies`) "문자발신 서비스를 미신청한 고객사입니다"로 끝나고, 보내면 `sms02_history`에 남는다. kalpa는 신청 회사로 넣었다. 배포·시뮬레이터 확인은 [배포 후 확인 대장](../../../5-테스트/배포후-확인대장.md) 1번.
- ⚠ **TOBE 부족 — #1075 경영·회계 탭에 열 3개가 없다.** 원본 `Sys01_TabPage_Info04`(2026-09-14 커밋 이후 15열, 2단 헤더 `휴가`·`고유자산`)에 있는 `초과사용 상신전 승인요청`(`leaveConfirmYn`)·`근태 잠금사용`(`commuteLockYn`)·`근태 팝업사용`(`commutePopupYn`)이 TOBE `Sys01_TabPage_Info04.tsx`(12열)에 없다. TOBE 주석 줄 번호가 옛 원본 기준이라, 열이 늘기 전 소스로 변환한 것으로 보인다(`yunhee drift`: 기준선 뒤 이 파일은 바뀌지 않음). → TOBE에서는 초과사용 승인을 켜고 끌 수 없다.
- 작은 차이 — 경영관리팀 API(`GET /api/v1/emp/leaves`·`/days`·`POST /rd-download`)는 메뉴 권한을 보지 않아, 일반 직원 `401`도 같은 회사 다른 직원(`402`)의 휴가·사유를 읽을 수 있다(회사 소속만 검사). 원본도 사원 ID를 화면이 보내는 대로 쓴다. API가 메뉴 권한을 보지 않는 것은 EMP 공통이다([흐름도](EMP-업무흐름.md)).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: EMP-BZ-0014
needs: [EMP-BZ-0001, SYS-BZ-0008, SYS-BZ-0009]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "Kalpa1234!" }
    api:
      - POST /api/v1/dcr/links/check-company                 # 없는 링크 행 생성 (kalpa +93)
      - GET /api/v1/dcr/links/lookup?linkCodeList=A01        # linkId
      - PUT /api/v1/dcr/links                                # [{ linkId, classTreeId: <휴가/휴가신청> }]
    expect: { api: "GET /api/v1/dcr/links/class-tree-by-code?linkCode=A01", rows: 1 }
  - no: 4
    actor: { company: kalpa, user: "401", password: "Kalpa1234!" }
    api: GET /api/v1/emp/my-leaves/count?startDate=2026-11-16&closeDate=2026-11-17&leaveCode=01&calcCode=2
    expect: { value: 2.0 }
  - no: 5
    actor: { user: "401" }
    api: PUT /api/v1/emp/my-leaves
    body: { leaveId: 0, leaveCode: "01", regDate: "2026-11-10", startDate: "2026-11-16", closeDate: "2026-11-17", leaveCount: 2, reason: "개인 사유", managerName: "최사원", emergencyTelno: "010-1000-401", classTreeId: "<휴가/휴가신청>" }
    expect: { table: emp20_leave, delta: +1 }
  - no: 7
    actor: { user: "401" }
    api:
      - GET /api/v1/apr/apprs/new?classTreeId=<휴가/휴가신청>                         # apprId, 001 상신 김사원
      - GET /api/v1/apr/apprs/link-seed?classTreeId=…&linkCode=A01&refId=<leaveId>   # 제목 "연차휴가 신청서 / 김사원 사원 (2026-11-16~2026-11-17)", 시행일 2026-11-16
      - PUT /api/v1/apr/apprs/{apprId}   # mode=request, linkCode=A01, content 필수(양식 없으면 직접), steps: 001 상신(00) 김사원 + 002 결재(10) 김과장
      - PUT /api/v1/emp/my-leaves/{leaveId}/appr-id   # { apprId }
    expect: [{ table: apr01_appr, delta: +1 }, { table: apr04_appr_step, delta: +2 }, { field: "apprStatusName", value: "상신" }, { api: "GET /api/v1/emp/my-leaves/days", field: useDays, value: 2.0 }]
  - no: 8
    actor: { company: kalpa, user: "301", password: "Kalpa1234!" }
    api: POST /api/v1/apr/apprs/{apprId}/confirm
    body: { action: confirm, message: "승인합니다" }
    expect: { field: "apprStatusName", value: "완료" }
  - no: 9
    actor: { user: "301" }
    api: GET /api/v1/emp/leaves/days?personId=<401>&stdYear=2026
    expect: { field: remainDays, value: 15.0 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Emp20_Tab_Leave`(#1032, E0~E9 — [삭제] `deleteRow` L460-486·`deleteChk` L488-523, 요약 `selectByDays` L341 `apprCheckYn=false`), `Emp20_Edit_Leave`(편집 폼 — [임시저장]·[상신하기] `updateRow` L438-492 → `chkReward` L795 → `checkA` L494-513 → `checkExcess` L516-587 → `insertLinkApproval` L649-696 → `updateApprId` L699-716, [계산] `preCalculate` L719·`calculate` L737-793, [초과사용 승인요청] `lookupEmpTransInfo` L589 → `sendMessage` L601 → `updateOverConfirm` L631, 본문 `createMapping` L858-884), `Emp20_Tab_LeaveManager`(#1033 — [휴가취소] `cancel` L353-367·`cancelMessage` L369-405, 요약 L430 `apprCheckYn=true`, [문서분류지정] L310), `Emp20_Tab_LeaveList`(#1034)
- AS-IS 서버: `emp.Emp20_Leave.selectByPersonId`·`selectByDays`·`count`·`update`·`delete`·`updateOverConfirm`·`cancelUpdate` L124-239·`selectByPersonName`, `dcr.Dcr30_Link.selectByLinkCode`·`insertCheck`, `sms.Sms02_History.sendMessage`
- TOBE: `/api/v1/emp/my-leaves`(`GET`·`/days`·`/codes`·`/count`·`PUT`·`PUT /{id}/appr-id`·`DELETE`·`PUT /{id}/over-confirm-request`) `EmpMyLeaveService`, `/api/v1/emp/leaves`(`GET`·`/days`·`PUT /{id}/over-confirm`) `EmpLeaveService`, `/api/v1/emp/leave-list`, 결재 `/api/v1/apr/apprs`(`/new`·`/link-seed`(`HrLinkSeedProvider` A01)·`PUT /{id}`·`POST /{id}/confirm`), 문서분류 `/api/v1/dcr/links`(`check-company`·`lookup`·`PUT`)
- `yunhee trace-crud --screen '#1032,#1033,#1034'`(0.8.5): `emp20_leave` #1032 CRUD/CRUD · #1033 RU/RU · #1034 R/R 일치. #1033 `apr01_appr ASIS RD / TOBE R`·`apr99_appr_del ASIS CR / TOBE -`가 위 [휴가취소] 부족이다. #1032 `sys01_company ASIS RU`·`sms02_history ASIS C / TOBE -`는 오탐(`05b` 0.8.5).
- TOBE 상태(2026-11-10): **실행(API, 과장 301 문서분류 → 사원 401 신청·상신 → 과장 301 승인)** — 저장·계산·상신·연결·승인·세 화면 목록 비교·수정/삭제 거절. 이어서 특별휴가(완료)·대결자(저장·삭제)·초과사용(⚠ 승인요청 거절, 승인 API는 동작)·출력(자료·RD 주소)을 확인했다. 포상휴가(EMP-BZ-0017 먼저)·RD 화면 그리기·대결 결재 이동은 미확인. 화면 눈 확인은 `대기`.
</details>
