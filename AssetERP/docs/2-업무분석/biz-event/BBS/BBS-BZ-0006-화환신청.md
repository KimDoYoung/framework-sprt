# BBS-BZ-0006 직원이 화환을 신청하고 경영관리가 처리한다

> **한 줄 요약** — 직원이 #1363 화환 신청에서 [등록](`POST /bbs/floral-requests/new` — 번호·보내는 회사·대표이사 기본값) → 경조사 구분(`OccasionsCode`)·문구·받는 곳(회사·이름·직위·부서·전화·주소)·배송 요청일시·사유를 [저장](`bbs20_floral_request`, 상태 `신청 10`). 증빙 파일·거래처 공유자(`bbs21`)도 붙인다. 경영관리는 #1362 화환신청 확인에서 `접수 20` → `발송완료 92`(완료일) 또는 `반려 95`(사유)로 바꾼다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원 → 경영관리(301) |
| 언제 | 거래처 경조사 때 |
| 먼저 있어야 하는 것 | 코드 `OccasionsCode`(10 결혼 … 90 기타)·`ApplicationStatusCode001` |
| 다음 이벤트 | — |
| 실제 실행 | 2026-11-14, kalpa API. 401 승진 화환(받는 곳 `(주)A사` 홍길동 전무, 11-18 10:00) `bbs20` +1 → 301 목록 1행. **401이 관리 API로 자기 신청을 발송완료(92) → 200**(⚠#259) → 301이 접수 → 발송완료(완료일 11-18). 신청자 목록(`confirmYn=false`) — AS-IS `bbs20_floral_request.selectByText` 1 = 1. 402도 같은 목록에 401 신청이 보임(원본 SQL에 신청자 조건 없음 — 회사 공용) |
| 메뉴 | #1363 (6곳)·#1362 (4곳). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | #1363 | [등록] (`POST /bbs/floral-requests/new`) → 칸 입력 → [저장] (`PUT /bbs/floral-requests/save`) | 신청 |
| 2 | 경영관리 | #1362 | 기간·미완료만 → [조회] (`GET /bbs/floral-requests`) → 상태 `접수`·`발송완료`·완료일 → [저장] (`PUT /bbs/floral-requests`) | 상태 |
| 3 | 직원 | #1363 | [조회] (`GET /bbs/floral-requests/mine?confirmYn=false`) | 발송완료 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `bbs20_floral_request` | 화환 신청(상태·완료일) | +1 |

## 업무 규칙 · 주의

- 미완료만(`confirmYn` true)이면 91·92 행을 뺀다 — 기본값이라 발송완료 뒤엔 안 보인다.
- 수정은 신청자·`신청` 상태일 때만(화면).
- **사원이 관리 API로 자기 화환을 발송완료로 바꾼다** → [#259](../../보안_및_버그_의심.md).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: BBS-BZ-0006
company: kalpa
steps:
  - {no: 1, user: 401, api: POST /api/v1/bbs/floral-requests/new}
  - {no: 2, user: 401, api: PUT /api/v1/bbs/floral-requests/save, body: {floralRequestId: "{id}", regDate: 2026-11-14, occasionsCode: "30", message: "승진을 축하드립니다", rcvCompany: "(주)A사", rcvEmp: 홍길동, sendRequestDate: 2026-11-18, sendRequestTime: "10:00", privateYn: false}, expect: "bbs20 +1"}
  - {no: 3, user: 301, api: PUT /api/v1/bbs/floral-requests, body: [{floralRequestId: "{id}", statusCode: "92", endDate: 2026-11-18}]}
  - {no: 4, user: 401, api: GET /api/v1/bbs/floral-requests/mine?startDate=2026-11-01&closeDate=2026-11-30&confirmYn=false, expect: "rows 1, 발송완료"}
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Bbs20_Tab_FloralRequest.retrieve`(`selectByText`), `Bbs20_Edit_FloralRequest.insert` L107-161, `Bbs20_Tab_FloralRequestMng`.
- TOBE: `BbsFloralRequestService.search` L40·`searchMine` L45, 화면 `pages/bbs/Bbs20_Tab_FloralRequestMng.tsx`.
</details>
