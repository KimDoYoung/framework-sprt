# ATT-BZ-0003 직원이 연장·야간근무를 신청하고 결재받는다

> **한 줄 요약** — 출퇴근 창의 [연장근무 신청]으로 신청 창을 열어 근무일자·구분(연장/야간)·연장시간(분)·사유·보상구분(연장근로수당/보상휴가)을 저장하고, 줄의 상신 아이콘으로 **연장근무 신청서(링크 A74)**를 결재 올린다. 결재가 완료(30)되면 #1486 연장근무관리 목록에 올라 경영관리가 확정한다(ATT-BZ-0006). 같은 날 같은 구분은 1건, 한 주(월~일) 합계는 근로시간 기준(`pay34`, 기본 12시간)을 넘을 수 없다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원(401) → 결재자(팀장 301) |
| 언제 | 연장근무 할 때(수시) |
| 먼저 있어야 하는 것 | ATT-BZ-0001(정책), 문서분류지정 #1280에서 A74(·A73) 분류 — kalpa는 회사 관리자가 둘 다 `인사/인사관리/근태관리`로 지정(`PUT /api/v1/dcr/links`), APR-BZ-0001·0002 |
| 다음 이벤트 | ATT-BZ-0006(#1486 확정) |
| 실제 실행 | kalpa, 2026-11-12, API: 401 `2026-11-12` 연장 120분(18:00~20:00)·연장근로수당 → 신청서 `202611129140071` 상신 → 301 승인(완료 30). 상신 중 수정 거절 확인 |
| 메뉴 | 메뉴 없음 — 출퇴근 창 단추로 여는 `Att03_Lookup_OvertimeReq`. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | 출퇴근 창 | [연장근무 신청] | 신청 창: 위에 "퇴근시간 18:00 / 주 최대 12시간 / 야간근로 가능시간 22:00 ~ 06:00", 아래 내 신청 목록 |
| 2 | 〃 | 신청 창 | [등록] → 근무일자·구분·연장시간(분)·사유·보상구분 → [저장] | 줄 저장, 근무시간 `18:00 ~ 20:00`(오후근무 결재된 날이면 22:00부터, 야간은 22:00부터) |
| 3 | 〃 | 〃 | 줄의 상신 아이콘 | 결재문서 창: 제목 `연장근무 신청서 / 김사원 사원 (2026-11-12)`, 시행일 = 근무일자, 본문은 회사 양식(A74 양식이 없으면 빈칸) |
| 4 | 〃 | 결재문서 창 | 결재선(결재자 301) → [결재요청] | 줄의 상태 `상신`. 이후 수정·삭제는 "결재진행/완료된 연장근무내역은 수정할 수 없습니다." |
| 5 | 결재자 | 결재문서 창 | [승인] | 상태 `완료` → #1486 목록에 나온다 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `att03_overtime_req` | 신청 1줄, 상신 뒤 `att03_appr_id` | kalpa +1(정상) +1(위조 시험 — 아래) |
| `apr01_appr`·`apr04_appr_step` | 연장근무 신청서(링크 A74)·결재선 2줄 | +1 문서(완료) |
| `dcr30_link` | kalpa A73·A74 → 근태관리 분류 | 2줄 갱신 |

## 결과를 볼 수 있는 화면

- 신청 창의 상태, #1486 연장근무관리(완료 건만), #1485·#1492의 상태(`연장근무(미신청)` → 결재된 날은 연장근무로 인정).

## 업무 규칙 · 주의

- 서버 검사(TOBE `AttMyOvertimeReqService.save` L82-149 = 원본 `updateChk01`→`updateChk02`→`checkWeekMaxTime` 화면 흐름을 서버로 옮김): 결재 중·완료 줄 수정 불가, 필수 5개, 같은 날 같은 구분 1건, 주간 합계.
- ⚠ **주간 합계는 화면이 보내는 기준일(`baseDate`)의 주만 센다.** `baseDate`를 빼면 검사를 건너뛴다. 실행: 401이 `baseDate` 없이 11-09~11 각 300분(합 15시간 + 기존 2시간 = 17시간, 한도 12시간) → 200 저장(바로 지움). 같은 내용을 `baseDate 2026-11-12`로 보내면 거절 → [의심 #65](../../보안_및_버그_의심.md). 연장허용시간(정책 120분)을 넘는 300분도 막지 않는다.
- ⚠ **결재 ID 연결(`PUT /me/{id}/appr?apprId=`)이 문서를 검사하지 않는다**(원본도 클라이언트가 보낸 값을 저장). 실행: 401이 새 신청(11-13, 180분)에 이미 완료된 문서 `202611129140071`을 붙이자 그 신청이 `완료`가 되고 #1486 확정 대상 목록에 올라왔다 → [의심 #66](상). 이 줄은 잠겨 API로 지울 수 없어 시험 뒤 SQL로 지웠다.
- 원본은 연장근무 신청서의 문서분류를 **A73(오후근무) 링크**로 찾고 링크코드 A74로 상신한다(`Att03_Lookup_OvertimeReq` L230-232 vs L337). 두 분류가 다르면 연장근무 문서가 오후근무 분류로 간다. TOBE는 A74로 찾는다(원본과 다름) → [의심 #70]. 회사 28000·kalpa는 A73·A74가 같은 분류라 차이가 안 보인다.
- 보상구분 공통코드 `WorkRewardTypeCode` 10의 이름이 `연장근로수장`(오타, 회사 0 코드) → [의심 #72].

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ATT-BZ-0003
needs: [ATT-BZ-0001, APR-BZ-0001]
steps:
  - no: 0
    actor: { company: kalpa, user: admin, password: "1111" }
    api: PUT /api/v1/dcr/links
    body: [{ linkId: <A74>, classTreeId: <근태관리> }, { linkId: <A73>, classTreeId: <근태관리> }]
  - no: 2
    actor: { company: kalpa, user: "401", password: "1111" }
    api: PUT /api/v1/att/overtime-reqs/me
    body: { baseDate: "2026-11-12", rows: [{ workDate: "2026-11-12", workTypeCode: "10", overtimeMin: 120, reason: "월말 결산 자료 정리", workRewardTypeCode: "10", changed: true }], deleteIds: [] }
    expect: { track: { att03_overtime_req: +1 }, overTimeStr: "18:00 ~ 20:00" }
  - no: 3
    api:
      - GET /api/v1/apr/apprs/new?classTreeId=<근태관리>
      - GET /api/v1/apr/apprs/link-seed?classTreeId=…&linkCode=A74&refId=<overtimeReqId>   # 제목 "연장근무 신청서 / 김사원 사원 (2026-11-12)"
      - PUT /api/v1/apr/apprs/{apprId}   # mode request, linkCode A74, steps 001 상신 401 + 002 결재 301
      - PUT /api/v1/att/overtime-reqs/me/{overtimeReqId}/appr?apprId={apprId}
    expect: { statusName: 상신 }
  - no: 5
    actor: { company: kalpa, user: "301", password: "1111" }
    api: POST /api/v1/apr/apprs/{apprId}/confirm
    body: { action: confirm }
    expect: { statusName: 완료 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Att03_Lookup_OvertimeReq`(defaultInfo L182·L230 Dcr30_Link A73, 상신 L270-311·insertLinkApproval L328-345, updateChk01 L595·updateChk02 L655·checkWeekMaxTime L709·update L730·deleteRow L829), `Apr01_Edit_ApprDoc` L1593-1631(A74 제목·본문), 서버 `att.Att03_OvertimeReq.update`·`notInOvertimeReqIdList`·`checkWeekMaxTime`, `Att05_PmWork.getWorkDateInfo`.
- TOBE: `AttMyOvertimeReqController`(`/api/v1/att/overtime-reqs/me` GET·`/work-dates`·`/info`·`/settings`·PUT·DELETE·`/{id}/appr`), `AttMyOvertimeReqService`, `Att03_Lookup_OvertimeReq.tsx`(LINK_CODE A74 L28·L155).
</details>
