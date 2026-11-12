# EMP-BZ-0020 직원이 여비교통비를 신청하고, 경영관리팀이 달 단위로 마감해 지출결의를 올린다

> **한 줄 요약** — 직원이 #1349에서 그 달에 쓴 교통비(일자·출발지·도착지·시각·금액·교통수단·영수증)를 적고 **월 신청서**를 결재받는다. 달이 끝나면 경영관리팀이 #1348에서 그 달의 모든 직원 신청서가 **완료됐는지 보고 [마감]**한 뒤, 회사 전체를 합친 **직원경비 지출결의**(`26년도 12월분 직원경비 내역`)를 [상신]한다. 마감된 달·상신된 신청서는 직원이 고치지 못한다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원(`kalpa/401`·`402`/`Kalpa1234!`) → 팀장(`301`·`302`) 결재 → 경영관리팀(과장 `301`)이 마감·지출결의 상신 → 부장(`201`) 결재 |
| 언제 | 해마다 12번(매월 신청, 월말~다음 달 초 마감) |
| 먼저 있어야 하는 것 | EMP-BZ-0001(직원), 교통수단 코드(`TransportCode` 01 택시·02 버스·03 지하철·90 기타, 회사 0 공용), 문서분류 `A42`(여비교통비 신청서)·`A43`(직원경비 지출결의) — kalpa는 둘 다 지정됨 |
| 다음 이벤트 | 지출결의가 완료되면 자금 쪽(계좌 지급)으로 넘어간다(이 이벤트 밖) |
| 실제 실행 | kalpa, 2026-11-12, API(T3600 DB). `2026.12`분: 직원 2명 등록 → 월 신청서 상신·승인 → 마감 → 직원경비 지출결의 상신·승인 → 마감 취소. 이미 마감·완료돼 있던 `2026.11`분으로 수정·삭제 막기 확인 |
| 메뉴 | #1349 신청 > 80. 사업비 신청 > 여비교통비 신청, #1348 자금관리 > 20. 사업비관리 > 여비교통비 관리 (kalpa 열림, 화면 눈 확인 `대기(일괄)`) |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | **#1349** | 기준년월(`2026` + 월 콤보) → [조회] | 그 달 내 교통비 목록(일자·출발지·도착지·출발/도착 시각·금액·교통수단·영수증 여부·비고). 문서분류 칸은 `A42` 분류 |
| 2 | 〃 | 〃 | [등록] → 새 행 입력(출발지·도착지·시각·금액 모두 필수) → [저장] | 저장. 빈 칸이면 "출발지는 필수 입력항목입니다." 등. 당월이 아닌 일자가 섞이면 "당월이 아닌 일자가 포함되어 있습니다. 저장하시겠습니까?" |
| 3 | 〃 | 〃 | (자주 쓰는 구간) 행 선택 → [등록(복사)] | 같은 내용 행이 다음 날짜로 복사 |
| 4 | 〃 | 〃 | 행의 영수증 [등록] 셀 → 파일 올리기 | `여부` 칸에 영수증 표시 |
| 5 | 〃 | 〃 | [상신] | 월 신청서가 새로 만들어지고(신청번호 `001`) 결재문서 `여비교통비 신청서 (2026.12) - 김사원#001`(표로 정리된 본문)이 뜬다 → 결재: 팀장 → [결재요청] → 문서 상태 `상신` |
| 6 | 팀장 | 결재할 문서함 | [승인] | `완료`. 그 뒤로 직원은 #1349의 [등록]·[저장]·[삭제]가 "이미 상신된 문서입니다."로 막힌다 |
| 7 | 경영관리 | **#1348** | 기준년월 → [조회] | 직원별 신청서 목록(마감여부·신청일·신청번호·부서·직위·성명·문서명·금액·결재상태). 행의 [문서보기]로 결재문서 |
| 8 | 〃 | 〃 | 모든 행이 `완료`가 된 뒤 [마감] | 그 달 전체가 마감. 완료 아닌 문서가 있으면 "완료되지 않은 문서가 포함되어 있습니다.", 이미 마감이면 "이미 마감되었습니다." |
| 9 | 〃 | 〃 | [상신] (마감 뒤에만) | 결재문서 `26년도 12월분 직원경비 내역 (여비교통비)` — 신청서 목록·합계·계정명·기간이 본문에 들어간다. 결재: 팀장 → 부장 → [결재요청] |
| 10 | 부장 | 결재할 문서함 | [승인] | 지출결의 `완료` |
| 11 | 경영관리 | #1348 | 잘못 마감했으면 [취소] | 마감 해제(지출결의 상신 중이면 "상신 중입니다"로 막힘, 화면 검사) |

마감 뒤에 다음 달부터는 직원이 "이미 마감된 달입니다. 다음달에 신청해주세요"로 그 달을 더 쓸 수 없다.

## DB에 남는 것

| 테이블 | 무엇 | 단계 |
|:---|:---|:---|
| `emp50_transport_expense` | 교통비 한 줄(년월·일자·출발/도착지·시각·금액·교통수단·비고) | 2 +N |
| `emp51_relate_appr` | 직원별 월 신청서(신청번호·금액·**결재문서**·**마감 여부**) | 5 +1(상신 때마다 지우고 새로 만든다) |
| `emp52_relate_appr` | 월 전체 지출결의 문서 연결(회사·년월·결재문서) | 9 +1 |
| `apr01_appr`·`apr04_appr_step` | 직원 신청서 문서(A42)·지출결의 문서(A43) | 5~10 |
| `sys11_relate_file` | 영수증 첨부(이번 실행에서 안 함) | 4 |

## 결과를 볼 수 있는 화면

- #1349(내 교통비, 상신 후 잠김), #1348(전체 신청서·마감 여부·지출결의 상태), 결재 문서함.

## 업무 규칙 · 주의

- **순서가 있다**: 직원 신청서 모두 `완료` → [마감] → 지출결의 [상신]. 원본 화면은 [마감]에서 "완료되지 않은 문서가 포함되어 있습니다."와(지출결의가 이미 상신 중이면) "상신 중입니다"를, [상신]에서 "마감후 상신을 진행해주시길 바랍니다."를 막는다.
- **이 세 가지 순서 검사는 화면에만 있다**(원본·TOBE 같음). 서버 `PUT /relate-apprs/close`는 완료되지 않은 신청서가 있어도·지출결의가 상신 중이어도 마감·마감취소를 한다. 이번 실행에서 지출결의 상신 중에 [마감]이 성공했고, 지출결의가 **완료된 뒤에도 [취소]가 성공**했다 → [보안_및_버그_의심](../../보안_및_버그_의심.md) 후보. `POST /relate-apprs/status`(지출결의 연결)도 마감 여부·권한을 보지 않는다.
- 직원 쪽 막기는 서버도 한다: 신청서가 `상신(10)·결재중(20)·완료(30)`이면 "이미 상신된 문서입니다.", 마감된 달이면 "이미 마감된 달입니다. 다음달에 신청해주세요"(상신 확인 → 마감 확인 순서). 필수 칸 검사 문구도 서버가 같이 돌려준다. 단 **마감된 달인데 신청서를 안 올린 직원**은 마감 검사가 "그 달에 마감된 신청서가 하나라도 있으면" 기준이라 회사 전체가 막힌다(원본 `selectByCloseYn` 동일).
- 신청번호(`regNo`)는 그 달 회사 안에서 `001`·`002`… 순으로 붙는다. [상신]을 다시 누르면 **기존 월 신청서 행을 지우고 새 ID·번호로 다시 만든다**(원본 `Emp51_RelateAppr.insert` 동일).
- **#1348 API(`GET /api/v1/emp/relate-apprs`·`/status`, `PUT /close`, `POST /status`)는 메뉴 권한이 없는 직원(사원 402)도** 호출하면 회사 전체 직원의 여비교통비 신청서(성명·금액·결재제목)를 돌려준다. 마감·마감취소 같은 쓰기 API에 메뉴 권한 검사가 없는지는 이번에 시험하지 않았다(읽기만 확인).
- 결재 ID 붙이기(`PUT /my-transport-expenses/appr/{relateApprId}/appr-id`)는 내 월 신청서인지만 본다(회사·본인 조건). 결재문서가 실제로 있는지·내 문서인지는 보지 않는다(EMP-BZ-0018·0019와 같은 문제).
- 2026.11분(`kalpa` 직원 3명, 월 신청서 완료·마감)은 이번 세션 앞서 만들어져 있던 시험 자료라 건드리지 않았다. 그 달에 쓰기를 시도하면 "이미 상신된 문서입니다."로 막힌다.
- 안 한 것: 화면 눈 확인, 영수증 올리기·지우기(`FileUpload`·`FileDelete`, 결재 첨부 자동 연결 `PUT /emp/transport-expenses/appr-files`), 등록(복사) 화면 동작, 반려 뒤 재상신, 계정명(`act13_real_account_map`)이 지출결의 본문에 맞게 들어가는지, 지출결의 완료 뒤 자금 처리.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: EMP-BZ-0020
needs: [EMP-BZ-0001]
steps:
  - no: 2
    actor: { company: kalpa, user: "401", password: "Kalpa1234!" }
    api: PUT /api/v1/emp/my-transport-expenses
    body: [{ transportExpenseId: 0, yyyymm: "2026.12", date: "2026-12-02", startPoint: "본사", closePoint: "여의도", startTime: "09:00", closeTime: "09:40", amt: 18500, transportCode: "01", note: "IR 방문" },
           { transportExpenseId: 0, yyyymm: "2026.12", date: "2026-12-02", startPoint: "여의도", closePoint: "본사", startTime: "18:00", closeTime: "18:50", amt: 1450, transportCode: "03" }]
    expect: { table: emp50_transport_expense, delta: +2 }
  - no: 5~6
    api:
      - POST /api/v1/emp/my-transport-expenses/appr   # { yyyymm: "2026.12", regAmt: 19950 } → { relateApprId, regNo: "001" }
      - GET /api/v1/apr/apprs/new?classTreeId=<A42 분류>
      - GET /api/v1/apr/apprs/link-seed?classTreeId=…&linkCode=A42&refId=0&ids=<교통비ID,…>&regNo=001&regDate=2026.12   # 제목 "여비교통비 신청서 (2026.12) - 김사원#001"
      - PUT /api/v1/apr/apprs/{apprId}   # mode request, linkCode A42, effectDate·regDate 필수, steps 001 상신 401 + 002 결재(10) 301
      - PUT /api/v1/emp/my-transport-expenses/appr/{relateApprId}/appr-id   # { apprId }
      - POST /api/v1/apr/apprs/{apprId}/confirm   # 301, { action: confirm }
    expect: { api: "GET /api/v1/emp/my-transport-expenses/appr?yyyymm=2026.12", field: statusName, value: "완료" }
  - no: 2~6 (402 도 같게)
    actor: { user: "402" }
    note: 결재자 302. 신청번호 "002"
  - no: 7
    actor: { user: "301" }
    api: GET /api/v1/emp/relate-apprs?yyyymm=2026.12   # 직원 2행 완료
  - no: 8
    api: PUT /api/v1/emp/relate-apprs/close   # { yyyymm: "2026.12", closeYn: true } → 2
  - no: 9~10
    api:
      - POST /api/v1/emp/relate-apprs/status?yyyymm=2026.12   # → relateApprId
      - GET /api/v1/apr/apprs/link-seed?classTreeId=<A43 분류>&linkCode=A43&refId=0&yyyymm=2026.12   # "26년도 12월분 직원경비 내역 (여비교통비)"
      - PUT /api/v1/apr/apprs/{apprId}   # linkCode A43, steps 상신 301 + 결재 201
      - PUT /api/v1/emp/relate-apprs/{relateApprId}/appr-id
      - POST /api/v1/apr/apprs/{apprId}/confirm   # 201
    expect: { api: "GET /api/v1/emp/relate-apprs/status?yyyymm=2026.12", field: statusName, value: "완료" }
  - no: 6 이후 직원 수정
    api: PUT /api/v1/emp/my-transport-expenses   # 같은 달 → INVALID_INPUT "이미 상신된 문서입니다."
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Emp50_Tab_TransportExpense`(#1349) — [조회]·[등록]·[등록(복사)]·[저장]·[삭제]·[상신]·[문서보기]·영수증 셀, 이벤트 E0~E19, `preCheck` L471-519, `update` L521-587, `insertLinkApproval` L710-813(A42). `Emp50_Tab_TransportExpenseMng`(#1348) — [조회]·[상신]·[문서보기]·[마감]·[취소], `closeYn` L500-551, `insertLinkApproval` L388-483(A43).
- AS-IS 서버: `emp.Emp50_TransportExpense`(`selectByYearMonth` L26, `copyUpdate` L42, `update` L55, `delete` L60), `emp.Emp51_RelateAppr`(`selectByCompanyId` L42, `selectByCloseYn` L56, `selectByPersonId` L26, `selectApprId` L70, `insert` L86, `updateCloseYn` L130, `updateApprId` L140), `emp.Emp52_RelateAppr`(`selectByCompanyId` L25, `selectApprId` L39, `insert` L53, `updateApprId` L86), `sys.Sys11_RelateFile.checkFileDelete`, `act.Act13_RealAccountMap.getAccountName`.
- TOBE: `/api/v1/emp/my-transport-expenses`(`GET`·`PUT`·`DELETE`·`/appr`·`/appr-id`·`/closed`·`POST /appr`·`PUT /appr/{id}/appr-id`), `/api/v1/emp/relate-apprs`(`GET`·`/status`·`/appr-id`·`POST /status`·`PUT /{id}/appr-id`·`PUT /close`), `/api/v1/emp/transport-expenses/appr-files`, `TransportLinkSeedProvider`(A42)·`TransportMngLinkSeedProvider`(A43).
- TOBE 상태(2026-11-12): 실행(API). 화면 눈 확인 `대기(일괄)`.
</details>
