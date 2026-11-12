# EMP-BZ-0018 직원이 외출(기업설명회·교육 등)을 등록한다

> **한 줄 요약** — 직원이 #1358에서 외출 일자·시각·사유·장소를 적어 저장한다(여러 날이면 [반복등록]). 공개 여부·공유 대상을 정하고, "이익수령 제외 신청서"가 필요하면 결재를 올린다. 경영관리팀은 #1465에서 회사 전체 외출을 조회만 한다. 외출은 **기록·공유용**이라 결재가 끝나도 휴가 일수 같은 다른 계산에는 쓰이지 않는다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원(`kalpa/401/Kalpa1234!`) → (결재 올릴 때) 팀장 `kalpa/301` → 조회: 경영관리팀 |
| 언제 | 수시(외부 일정이 생길 때) |
| 먼저 있어야 하는 것 | EMP-BZ-0001(직원), 외출구분 공통코드(`ErrandCode`, 회사 0 공용 — 기업설명회 `1` 등), 결재를 올리려면 문서분류에 `A45`(이익수령 제외 신청서)가 지정돼 있어야 한다 |
| 다음 이벤트 | 없음(조회·공유용). 결재 문서는 전자결재 문서함에서 본다 |
| 실제 실행 | kalpa, 2026-11-12, API(T3600 DB). 등록·공개·공유·반복등록·결재(상신→완료)·수정/삭제 막기·삭제 |
| 메뉴 | #1358 신청 > 01. 외출/출장/휴가 > 외출등록, #1465 경영관리 > 02. 휴가/출장 관리 > 외출관리 (둘 다 kalpa 열림, 화면 눈 확인 `대기(일괄)`) |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | **#1358** | 조회기간 → [조회] | 내 외출 목록(일자·요일·구분·외출/복귀시각·사유·장소·주최자·비고·결재상태·공개·공유지정) |
| 2 | 〃 | 〃 | [등록] → 새 행에 일자·구분(`기업설명회`)·시각·사유·장소·주최자 입력 → [저장] | 행 저장. 요일이 채워진다 |
| 3 | 〃 | 〃 | 행의 **공개** 칸 체크 | 공유지정 칸이 `전체공개` |
| 4 | 〃 | 〃 | 행의 **공유지정** 칸 → 공유 창에서 [행 추가]로 직원·부서 고르고 [저장] | 공유지정 칸 `운용본부 외 1` (여러 명이면 "첫 대상 외 N") |
| 5 | 〃 | 〃 | [반복등록] → 일자·구분·시각·사유 입력, 반복(매일/매주/매월/매년)·간격·종료일·"휴일 제외" 지정 → 저장 | 종료일까지 날짜마다 같은 내용 행이 생긴다 |
| 6 | 〃 | 〃 | (이익수령이 있을 때) 행의 **이익수령 제외신청** 셀 → 문서분류 선택 → 결재문서 창 → 결재: 팀장 → [결재요청] | 결재상태 `상신` |
| 7 | 팀장 | 결재할 문서함 | [승인] | 결재상태 `완료` |
| 8 | 직원 | #1358 | 상신 전 행을 체크 → [삭제] | 행이 지워진다. 상신된 행은 "상신문서가 존재하는 내역은 삭제가 불가능합니다" |
| 9 | 경영관리 | **#1465** | 조회기간·검색어(외출자/구분/사유/주최자) → [조회] | 회사 전체 직원의 외출 목록(외출자 `김사원(경영지원본부)`). 결재완료 행의 셀을 누르면 결재문서 |

## DB에 남는 것

| 테이블 | 무엇 | 단계 |
|:---|:---|:---|
| `emp54_errand` | 외출 한 건(구분 코드·일자·시각·사유·주최자·장소·비고·결재문서·공개 여부) | 2 +1, 5 +날짜 수 |
| `emp56_share` | 공유 대상(구분 1 직원/2 부서, 상위 ID = 외출 ID) — 출장(#1359)과 같은 테이블 | 4 +대상 수 |
| `apr01_appr`·`apr04_appr_step` | 이익수령 제외 신청서·결재선 2줄 | 6~7 +1 |

## 결과를 볼 수 있는 화면

- #1358(내 목록), #1465(전체 조회), 결재 문서함. 공유·공개한 외출이 다른 직원의 캘린더 등에 보이는지는 이 이벤트에서 확인하지 않았다(안 한 것).

## 업무 규칙 · 주의

- **상신 뒤 수정·삭제 막기**는 서버도 한다(TOBE): 결재 ID가 있고 반려가 아니면 [저장]은 "상신문서가 존재하는 내역은 수정이 불가능합니다", [삭제]는 고른 행이 모두 상신된 행일 때만 "…삭제가 불가능합니다".(고른 행 중 하나라도 지울 수 있으면 상신된 행까지 함께 지운다 — 원본 이상한점 #101, 같은 동작)
- 반복등록의 검사 문구: 구분 없음 "구분은 필수선택 항목입니다", 반복 조건 없음 "반복조건값이 비어있습니다", 매주·매월에 요일/주기 미선택 "반복주기 선택을 해주세요". 실행: 12/7 매일 ~12/9 → 3행.
- 다른 직원의 외출에는 공유 창 조회가 `DATA_NOT_FOUND`(내 것만 연다).
- 외출을 지워도 **공유 대상(`emp56_share`) 행은 남는다**(원본 `Emp54_Errand.delete`가 외출 행만 지움, TOBE 같음) → [보안_및_버그_의심](../../보안_및_버그_의심.md)에 올릴 후보.
- 서버는 `A45` 문서분류가 없어도 결재 본문(제목·내용)을 비워 둔 채 돌려준다(kalpa는 A45 양식 매핑이 없어 시험에서 직접 적었다). 결재요청 때 `regDate` 같은 필수 값이 빠지면 `ok:false` 로 "상신일은 필수입력 항목입니다"가 200 응답으로 온다.
- 결재 ID 붙이기(`PUT /my-errands/{id}/appr-id`)는 **결재문서가 실제로 있는지·내 것인지 보지 않는다**: 상신이 실패했는데도 존재하지 않는 ID가 붙었다(결재상태 빈칸으로 보임, 다시 붙이면 정상).
- #1465 조회 API(`GET /api/v1/emp/errands`)는 **메뉴 권한 없는 직원(사원 402)도 호출하면** 회사 전체의 비공개 외출까지 돌려준다.
- 안 한 것: 화면 눈 확인, 달력·MyPage에 공유 외출이 보이는지, 매월·매주 반복 경계, 휴일 제외 옵션, 이익수령 제외 신청서 본문 양식(kalpa에 A45 매핑 없음).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: EMP-BZ-0018
needs: [EMP-BZ-0001]
steps:
  - no: 2
    actor: { company: kalpa, user: "401", password: "Kalpa1234!" }
    api: PUT /api/v1/emp/my-errands
    body: [{ errandId: 0, errandCode: "1", date: "2026-12-03", departTime: "14:00", returnTime: "17:00", reason: "IR 설명회 참석", venue: "여의도 컨퍼런스홀", host: "한국IR협의회", publicYn: false }]
    expect: { table: emp54_errand, delta: +1 }
  - no: 3
    api: PUT /api/v1/emp/my-errands/{errandId}/public   # { publicYn: true } → shareInfo "전체공개"
  - no: 4
    api: PUT /api/v1/emp/shares/{errandId}
    body: { deleteIds: [], adds: [{ shareCode: "1", personId: "<402>", orgId: "<운용본부>" }, { shareCode: "2", personId: null, orgId: "<운용본부>" }] }
    expect: { table: emp56_share, delta: +2, returns: "운용본부 외 1" }
  - no: 5
    api: POST /api/v1/emp/my-errands/cycle
    body: { errandCode: "2", date: "2026-12-07", cycleName: "D", cycleNum: 1, cycleDate: "2026-12-09", holidayYn: false, cycleOption: 9999 }
    expect: { returns: 3, table: emp54_errand, delta: +3 }
  - no: 6~7
    api:
      - GET /api/v1/apr/apprs/new?classTreeId=<휴가신청서>
      - PUT /api/v1/apr/apprs/{apprId}   # mode request, linkCode A45, title·content 직접, effectDate·regDate 필수, steps 001 상신 401 + 002 결재(10) 301
      - PUT /api/v1/emp/my-errands/{errandId}/appr-id   # { apprId }
      - POST /api/v1/apr/apprs/{apprId}/confirm   # 301, { action: confirm }
    expect: { field: aprStatusName, value: "완료" }
  - no: 8
    api: DELETE /api/v1/emp/my-errands?ids=<상신된 행>   # INVALID_INPUT "상신문서가 존재하는 내역은 삭제가 불가능합니다"
  - no: 9
    actor: { user: "301" }
    api: GET /api/v1/emp/errands?startDate=2026-12-01&closeDate=2026-12-31&searchText=%
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Emp54_Tab_Errand`(#1358) — 버튼 [조회]·[등록]·[반복등록]·[저장]·[삭제], 그리드 14열(이익수령제외신청 셀·공개·공유지정), 이벤트 E0~E8, 공유 창 `Emp56_Lookup_Share`, 반복 창 `Emp54_Edit_Errand`. `Emp54_Tab_ErrandManager`(#1465) — [조회]·검색어, 그리드 12열.
- AS-IS 서버: `emp.Emp54_Errand`(`selectByDate` L39, `selectByManager` L51, `modelUpdate` L57, `updatePublicYn` L195, `update` L202, `delete` L207), `emp.Emp56_Share`, 결재 `dcr.Dcr30_Link.selectByLinkCode` 링크코드 `A45`, DB 함수 `f_cdnm('ErrandCode')`.
- TOBE: `/api/v1/emp/my-errands`(`GET`·`PUT`·`POST /cycle`·`PUT /{id}/appr-id`·`PUT /{id}/public`·`DELETE`), `/api/v1/emp/errands`(#1465), `/api/v1/emp/shares`, `HrLinkSeedProvider`(A45).
- TOBE 상태(2026-11-12): 실행(API). 화면 눈 확인 `대기(일괄)`.
</details>
