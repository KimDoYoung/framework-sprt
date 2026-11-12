# EMP-BZ-0019 직원이 출장을 품의하고 다녀온 뒤 결과를 보고한다

> **한 줄 요약** — 직원이 #1359에서 출장 기간·출장지·목적을 등록하고 **출장신청서**(품의)를 결재받는다. 출장을 다녀오면 **신청서가 완료된 뒤에만** **결과보고서**를 따로 결재받는다. 경영관리팀은 #1381에서 회사 전체 출장과 두 결재의 진행을 보고, 결과보고가 필요 없는 출장은 "면제"로 표시한다. 국내출장은 B11·B12, 해외출장은 B13·B14 문서 양식을 쓴다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원(`kalpa/401/Kalpa1234!`) → 결재자(팀장 `kalpa/301`) → 경영관리팀(#1381) |
| 언제 | 수시(출장 전 품의, 출장 후 결과보고) |
| 먼저 있어야 하는 것 | EMP-BZ-0001(직원), 출장구분 코드(`BizTripCode` 1 국내·2 해외, 회사 0 공용), 문서분류 `B11`~`B14`(kalpa는 B11·B12=국내출장 분류, B13·B14=해외출장 분류가 지정돼 있음) |
| 다음 이벤트 | 출장비 정산은 EMP-BZ-0020(여비교통비)·자금 쪽에서 따로 |
| 실제 실행 | kalpa, 2026-11-12, API(T3600 DB). 국내출장 등록→품의 상신·승인→결과보고 상신·승인→#1381 조회·면제→공유·삭제 막기 |
| 메뉴 | #1359 신청 > 01. 외출/출장/휴가 > 출장품의 및 결과보고, #1381 경영관리 > 02. 휴가/출장 관리 > 출장관리 (kalpa 열림, 화면 눈 확인 `대기(일괄)`) |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | **#1359** | 조회기간·검색어(출장지/출장목적) → [조회] | 내 출장 목록(시작·종료일·구분·출장지·목적·인원·동반인, **신청서 결재상태**·**결과보고서 결재상태**, 공유) |
| 2 | 〃 | 〃 | [등록] → 창에서 출장기간·구분(`국내출장`)·출장지·출장목적·인원·동반인 입력 → [저장] | 행 추가. 빈 항목은 "출장기간은 필수작성 항목입니다"·"출장구분은 필수선택…"·"출장지는 필수작성…"·"출장목적은 필수작성…" |
| 3 | 〃 | 〃 | 행의 신청서 [결재요청] 셀 → (문서분류 확인) → 결재문서 창 `국내출장 승인 요청의 건 - 부산` → 결재: 팀장 → [결재요청] | 신청서 결재상태 `상신` |
| 4 | 팀장 | 결재할 문서함 | [승인] | 신청서 `완료` |
| 5 | 직원 | #1359 | (다녀온 뒤) 결과보고서 [결재요청] 셀 → 결재문서 창 `국내출장 결과 보고 - 부산` → [결재요청] | 결과보고 `상신`. 신청서가 완료 전이면 "출장신청서가 완료된 후에 문서작성이 가능합니다." |
| 6 | 팀장 | 결재할 문서함 | [승인] | 결과보고 `완료` |
| 7 | 직원 | #1359 | 행의 공유 칸 → 전체공개 체크 또는 공유 대상(직원·부서) 지정 → [저장] | 공유 칸 `전체공개` / `운용본부 외 N` |
| 8 | 경영관리 | **#1381** | 조회기간·검색어(출장자/출장지/목적), 체크 **완료건 제외** → [조회] | 회사 전체 출장 목록. 신청서·결과보고서 [상세보기]로 결재문서를 연다 |
| 9 | 〃 | 〃 | 결과보고가 필요 없는 출장의 **면제 여부** 체크·사유 입력 → [저장] | 면제 여부·사유가 저장된다 |
| 10 | 직원 | #1359 | 상신 전 행 체크 → [삭제] | 지워진다. 신청서가 상신된 행이 하나라도 섞이면 "진행 및 완료된 문서가 포함 되어있습니다. 삭제 불가합니다." |

반려된 문서는 셀을 다시 누르면 "새로운 결재요청을 진행하시겠습니까?"로 새 결재를 올린다(원본, 이번 실행에서는 반려 안 해 봄).

## DB에 남는 것

| 테이블 | 무엇 | 단계 |
|:---|:---|:---|
| `emp53_biz_trip` | 출장 한 건(기간·구분·출장지·목적·인원·동반인·**신청서 결재 ID**·**결과보고서 결재 ID**·공개·면제 여부·사유) | 2 +1, 3 appr_id, 5 result_appr_id, 9 면제 |
| `apr01_appr`·`apr04_appr_step` | 출장신청서·결과보고서(각각 상신→완료)·결재선 2줄 | 3~6 +2 |
| `emp56_share` | 공유 대상(상위 ID = 출장 ID, 외출과 같은 테이블) | 7 |

## 결과를 볼 수 있는 화면

- #1359(내 목록), #1381(전체·면제), 결재 문서함. 공유한 출장이 다른 직원에게 보이는 달력 등은 확인하지 않았다.

## 업무 규칙 · 주의

- 결재 양식: 국내(`1`) 신청 B11·결과 B12, 해외(`2`) 신청 B13·결과 B14. 제목은 서버가 `국내출장 승인 요청의 건 - 부산` / `국내출장 결과 보고 - 부산`으로 채운다(양식 본문은 kalpa에 양식이 없어 비어 있었다).
- **결과보고서는 신청서 완료 뒤에만** 올릴 수 있다는 규칙은 **화면만** 검사한다. 시드 API(`link-seed` B12)는 신청서가 없어도 제목을 돌려주고, 결재 ID 붙이기(`PUT /biz-trips/{id}/appr-id`, `result:true`)도 신청서 상태를 보지 않는다.
- 상신된 출장은 서버가 고치지 못하게 막는다(`PUT /biz-trips/{id}` → "진행 및 완료된 문서가 있습니다. 수정이 불가합니다."). 삭제도 신청서 상태만 보고 막는다 — **결과보고서만 진행 중인 행**(신청서 상태 없음)은 걸러지지 않는다(원본 L307-329도 신청서 기준, 같음).
- 출장 기간의 시작일이 종료일보다 늦어도 저장된다(실행: 12/12~12/11). 원본 입력 검사에도 순서 검사가 없다.
- 결재 ID 붙이기는 결재문서가 있는지 확인하지 않는다(존재하지 않는 ID `999`가 붙었다). 외출(EMP-BZ-0018)과 같은 문제.
- **#1381 API(`GET /api/v1/emp/biz-trips`·`PUT /biz-trips`)는 메뉴 권한이 없는 직원(사원 402)도** 회사 전체 출장을 읽고 **결과보고서 면제 여부·사유를 바꿀 수 있다**(실행: 402가 김사원 출장의 면제를 바꿈) → [보안_및_버그_의심](../../보안_및_버그_의심.md) 후보.
- 출장을 지워도 **공유 대상(`emp56_share`) 행은 남는다**(원본 `Emp53_BizTrip.delete` 동일).
- "완료건 제외"(`resultSkipYn=true`)는 결과보고까지 끝났거나 면제된 출장을 목록에서 뺀다. 실행: 결과보고 완료된 김사원 출장이 사라짐.
- 안 한 것: 화면 눈 확인, 해외출장(B13·B14) 흐름, 반려 후 재상신, 결재 양식 본문 치환(kalpa에 양식 없음), 결재 문서에서 본 첨부, 공유 출장이 다른 직원 화면에 보이는지.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: EMP-BZ-0019
needs: [EMP-BZ-0001]
steps:
  - no: 2
    actor: { company: kalpa, user: "401", password: "Kalpa1234!" }
    api: POST /api/v1/emp/biz-trips
    body: { startDate: "2026-12-10", closeDate: "2026-12-11", bizTripCode: "1", destination: "부산", purpose: "고객사 방문", num: "2", companion: "박사원", publicYn: false }
    expect: { table: emp53_biz_trip, delta: +1 }
  - no: 3~4
    api:
      - GET /api/v1/apr/apprs/new?classTreeId=<국내출장 분류>
      - GET /api/v1/apr/apprs/link-seed?classTreeId=…&linkCode=B11&refId=<bizTripId>   # 제목 "국내출장 승인 요청의 건 - 부산"
      - PUT /api/v1/apr/apprs/{apprId}   # mode request, linkCode B11, effectDate·regDate 필수, steps 001 상신 401 + 002 결재(10) 301
      - PUT /api/v1/emp/biz-trips/{bizTripId}/appr-id   # { apprId, result: false }
      - POST /api/v1/apr/apprs/{apprId}/confirm   # 301, { action: confirm }
    expect: { field: apprStatusName, value: "완료" }
  - no: 5~6
    api:
      - GET /api/v1/apr/apprs/link-seed?classTreeId=…&linkCode=B12&refId=<bizTripId>   # "국내출장 결과 보고 - 부산"
      - PUT /api/v1/apr/apprs/{apprId2}   # linkCode B12
      - PUT /api/v1/emp/biz-trips/{bizTripId}/appr-id   # { apprId: apprId2, result: true }
      - POST /api/v1/apr/apprs/{apprId2}/confirm   # 301
    expect: { field: resultApprStatusName, value: "완료" }
  - no: 7
    api: PUT /api/v1/emp/biz-trips/{bizTripId}/share   # { publicYn: true } 또는 PUT /api/v1/emp/shares/{bizTripId}
  - no: 8~9
    actor: { user: "301" }
    api:
      - GET /api/v1/emp/biz-trips?startDate=2026-12-01&closeDate=2026-12-31&resultSkipYn=false&searchText=
      - PUT /api/v1/emp/biz-trips   # [{ bizTripId, resultSkipYn: true, skipReason: "결과보고 면제" }]
  - no: 10
    actor: { user: "401" }
    api: DELETE /api/v1/emp/biz-trips?ids=<완료된 행>   # INVALID_INPUT "진행 및 완료된 문서가 포함 되어있습니다. 삭제 불가합니다."
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Emp53_Tab_BizTrip`(#1359) — [조회]·[등록]·[삭제]·[문서분류지정], 그리드 16열(신청서·결과보고서 결재요청·상세보기 셀, 공유), 이벤트 E0~E8, `checkAppr` L331-428(B11/B13·B12/B14), 창 `Emp53_Lookup_BizTrip`(등록)·`Emp53_Lookup_BizTripShare`·`Emp56_Lookup_Share`. `Emp53_Tab_BizTripManager`(#1381) — [조회]·[저장]·완료건 제외, 그리드 14열.
- AS-IS 서버: `emp.Emp53_BizTrip`(`selectByPersonId` L41, `updateShareInfo` L61, `modelUpdate` L68, `update` L81, `delete` L86), `selectByCompanyId`, `emp.Emp56_Share`.
- TOBE: `/api/v1/emp/biz-trips`(`GET`·`PUT`=#1381, `GET /mine`·`POST`·`PUT /{id}`·`PUT /{id}/appr-id`·`PUT /{id}/share`·`DELETE`=#1359), `/api/v1/emp/shares`, `GET /api/v1/apr/apprs/link-seed`(linkCode B11~B14, 제목 규칙).
- TOBE 상태(2026-11-12): 실행(API). 화면 눈 확인 `대기(일괄)`.
</details>
