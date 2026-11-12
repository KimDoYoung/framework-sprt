# EMP-BZ-0022 복리후생비를 신청하고 지급한다

> **한 줄 요약** — 직원이 #1221에서 복리후생비(통신비·건강검진비·기타)를 신청서로 상신하고 팀장이 승인하면, 경영관리팀이 #1222에서 **신청 건을 모아 월별 지출결의서를 상신**(대표이사 결재)하고 **지급확인**을 한다. 신청 → 승인 → 지출결의 묶음 → 지급 순서이고, 지급 처리가 끝난 건은 신청 목록에서 사라진다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원(401·402) → 팀장(과장 `kalpa/301`)이 신청서 결재 → 경영관리(301)가 지출결의서 상신 → 대표이사(100) 결재 |
| 언제 | 수시(신청), 매월(지출결의·지급) |
| 먼저 있어야 하는 것 | EMP-BZ-0021(복리후생비 코드), 신청서·지출결의서 문서분류(`A21·A22·A37` / `A46·A47·A51`가 문서분류에 연결, kalpa 있음), 결재 기본(EMP-BZ-0014와 같은 상신·결재) |
| 다음 이벤트 | 지출결의서 승인 뒤 자금 지급(회계는 다른 도메인) |
| 실제 실행 | kalpa, 2026-11-12, API. 이전 실행(06:45~06:51 UTC)이 남긴 자료(401 통신비·건강검진비 신청, 402 기타복리후생, 건강검진비 신청서 승인 완료, 11월 통신비 지출결의서 결재 완료·지급확인)를 이어서 확인하고, 직원 권한·검사 시험을 더했다 |
| 메뉴 | #1221 신청 > 80. 사업비 신청 > 복리후생비 신청, #1222 자금관리 > 20. 사업비관리 > 복리후생비 관리 (kalpa 메뉴 열림 확인 못 함 — 직원·과장 API는 열림, 화면 눈 확인 `대기`) |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 401 | **#1221** | 조회기간 → [조회] | 본인 신청 목록(신청일·신청구분·문서명·신청금액·발생일자·내용·결재상태·문서보기·지급여부·알림) |
| 2 | 〃 | 〃 | [등록] → 신청 창: 신청구분(통신비 등) 선택 → 신청금액·발생일자·내용(기타복리후생은 필수) | 구분을 고르면 설정된 신청코드의 문서분류를 찾아 채움. 코드·문서분류가 없으면 안내 |
| 3 | 〃 | 신청 창 | [상신] → 결재선(팀장 301) → 상신 | 신청서 `건강검진비 지원신청서 (2026-11-05)_김사원`, 결재상태 `상신` |
| 4 | 팀장 301 | 결재할 문서함 | [승인] | 결재상태 `완료`(30) |
| 5 | 경영관리 301 | **#1222** 위 표 | 조회기간·신청구분 → [조회] | 상신·결재중·완료 신청 중 **지출결의 전·미지급** 건만 보임 |
| 6 | 〃 | 〃 | 행 체크 → 기준년월 확인 → [지출결의등록] | "2026년 11월 통신비 지출결의서가 이미 생성되어 있습니다. 확인 후 진행바랍니다."(이미 있을 때) / 통과하면 아래 표로 옮겨짐(기준년월 기록) |
| 7 | 〃 | 아래 표 | 기준년월·신청구분 → [조회] → [상신] | 지출결의서 `2026년 11월 직원 통신비 지급결의서` 결재 창 → 결재: 사장 100 |
| 8 | 사장 | 결재할 문서함 | [승인] | 지출결의서 `완료`(30) |
| 9 | 경영관리 | 아래 표 | 행 체크 → [지급확인] | 지급여부 `true`(취소는 [지급취소]) |
| 10 | 〃 | 위 표 | 행의 [알림] 셀 → 알림 내용 → [저장]/[문자발송] | 신청 직원에게 알림(비고에 저장) |
| 11 | 〃·직원 | 〃 | [문서폐기] 셀(완료 문서만) / 직원 [삭제] | 결재문서는 삭제 이력(`apr99`)으로 옮겨지고 신청의 상신 ID가 비워짐 / 상신 중이면 "결재 중인 문서가 존재하여 삭제할 수 없습니다." |

## DB에 남는 것

| 테이블 | 무엇 | 단계 |
|:---|:---|:---|
| `emp17_benefit` | 신청(구분·금액·발생일·문서분류·`appr_id`·`pay_request_yyyymm`·`pay_request_appr_id`·지급여부·비고) | 2 +1(지급여부 `false`), 3 `appr_id`, 6 기준년월, 7 지출결의 상신ID, 9 지급여부 |
| `apr01_appr`·`apr04_appr_step` | 신청서(401 상신 → 301 결재)·지출결의서(301 상신 → 사장 결재) | 3~4, 7~8 |
| `apr99_appr_del` | 폐기한 결재문서 | 11 +1 |
| `sms02_history` 등 | 알림·문자 이력 | 10 |

## 결과를 볼 수 있는 화면

- #1221·#1222 두 표, 결재 문서함, #1222 아래 표의 [신청문서보기]·[지급확인].

## 업무 규칙 · 주의

- 실행 결과(kalpa): 401 통신비 55,000(10/31 발생)·건강검진비 180,000(11/5 발생), 402 기타복리후생 30,000. 건강검진비 신청서는 301이 승인(`완료`). 통신비는 `2026.11`로 지출결의에 묶여 `지출결의서 완료`·`지급여부 true`. 기타복리후생은 미지급이고 알림 `증빙(영수증)을 추가 제출해 주세요.`가 비고에 있다.
- 지출결의 중복 막기는 **서버가 한다**: `POST /emp/benefits/pay-requests/check`가 같은 기준년월·신청구분의 지출결의서가 있으면 "…이미 생성되어 있습니다"(상신·결재중·완료) 또는 "반려/임시저장 문서를 삭제 후 등록이 가능합니다"를 돌려준다(확인함).
- 직원 삭제는 서버가 본인 건만·상신 중(상태 없음·반려 40·임시저장 99가 아닐 때)이면 막는다. 남의 건(301이 401 신청 삭제 시도)은 `DATA_NOT_FOUND`로 안 지워진다(확인함).
- **지급확인·지출결의 묶기·알림 등 관리 기능이 메뉴 권한 없이 직원에게 열려 있다**: 직원 401이 `PUT /emp/benefits/benefit-yn`으로 직원 402의 신청을 지급완료로 바꾸는 것이 `200`(되돌려 둠), 402 신청의 알림 문구도 401이 바꿀 수 있다 → 보고 후보 C. (원본 서버도 같은 검사가 없다고 보이나 확인 못 함.)
- **지출결의 묶기(`pay-requests/ym`)는 결재가 없는 신청도 받는다**: 화면 목록은 `상신·결재중·완료`만 보여 주지만(`selectByText`) 서버는 고른 ID에 기준년월을 쓰기만 한다. 결재문서가 없는 402의 기타복리후생에 기준년월 `2026.12`를 써지는 것이 `200`(되돌려 둠). 지금 kalpa의 통신비 신청(401, `appr_id` 없음)이 결재 없이 지출결의·지급된 상태인 것도 이 길이다 → 보고 후보 D.
- 신청 때 문서분류(`dcrClassTreeId`)·결재문서 ID(`apprId`)는 클라이언트 값을 그대로 쓴다(같은 회사 여부·내 문서 여부 검사 없음, `create`·`updateApprId`) — 코드로 확인했고 다른 회사 값을 넣는 재현은 안 했다(후보 D에 함께 적음).
- 경조금·학자금은 kalpa 설정에서 미사용(EMP-BZ-0021)이라 신청구분에 안 나온다.
- 안 한 것: 화면 눈 확인, 신청 창 UI·필수 검사(기타복리후생 내용), [알림] [문자발송] 실제 발송, 지출결의서 상신 화면의 본문 표, 반려·재상신, 문서분류 없는 구분으로 신청.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: EMP-BZ-0022
needs: [EMP-BZ-0021, EMP-BZ-0014]
steps:
  - no: 2
    actor: { company: kalpa, user: "401", password: "Kalpa1234!" }
    api: POST /api/v1/emp/benefits
    body: { benefitCode: "020AN", issueAmt: 180000, occDate: "2026-11-05", benefitDetail: null, dcrClassTreeId: "<신청서분류>" }
    expect: { table: emp17_benefit, delta: +1, benefitYn: "false" }
  - no: 3
    api:
      - GET /api/v1/apr/apprs/link-seed?classTreeId=<분류>&linkCode=A22&refId=<benefitId>
      - PUT /api/v1/apr/apprs/{apprId}      # 401 상신 + 301 결재
      - PUT /api/v1/emp/benefits/{benefitId}/appr-id
  - no: 4
    actor: { user: "301" }
    api: POST /api/v1/apr/apprs/{apprId}/confirm   # { action: confirm }
  - no: 5~6
    api:
      - GET /api/v1/emp/benefits?startDate=2026-01-01&closeDate=2026-12-31
      - POST /api/v1/emp/benefits/pay-requests/check   # { year, month, benefitIds } → null 또는 안내문
      - PUT /api/v1/emp/benefits/pay-requests/ym       # { benefitIds, payRequestYyyymm: "2026.11" }
  - no: 7~8
    api:
      - GET /api/v1/apr/apprs/link-seed?linkCode=A46&...   # 제목 "2026년 11월 직원 통신비 지급결의서"
      - PUT /api/v1/emp/benefits/pay-requests/appr-id      # { benefitIds, apprId }
    actor: { user: "100" }
    api: POST /api/v1/apr/apprs/{apprId}/confirm
  - no: 9
    actor: { user: "301" }
    api: PUT /api/v1/emp/benefits/benefit-yn   # { benefitIds, benefitYn: true }
  - no: C
    actor: { user: "401" }
    api: PUT /api/v1/emp/benefits/benefit-yn   # 남의 신청 → 200 (후보 C)
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Emp17_Tab_Benefit`(#1221) + `Emp17_Lookup_Benefit`(신청 창, `update` L190-300, `searchDcr` L317-354) / `Emp17_Tab_BenefitManager`(#1222, E0~E25, `payRequestInsert` L703-782, `apprChk2` L939-966, `updateBenefitYn` L630-701, `insertLinkApproval` L968-1048) + `Emp17_Edit_Note`·`Emp55_Lookup_account`.
- AS-IS 서버: `emp.Emp17_Benefit`(`selectByText` L43, `selectByBenefitCode` L57, `selectByPersonId` L71, `selectByYyyymm` L85, `payRequestApprCheck` L113, `deleteApprId` L147, `modelUpdate` L182, `updatePayRequestYm` L217), SQL `emp17_benefit.selectByText`.
- TOBE: `/api/v1/emp/benefits`(`GET`·`/mine`·`/pay-requests`(`/check`·`/ym`·`/appr-id`·`/appr`)·`/benefit-yn`·`/{id}/discard-appr`·`/{id}/note`·`/{id}/send-message`·`/types`·`POST`·`PUT /{id}/appr-id`·`DELETE /{id}`), `EmpBenefitService`, `BenefitLinkSeedProvider`(A21 등), `BenefitPayLinkSeedProvider`(A46 등).
- TOBE 상태(2026-11-12): 실행(API). 화면 눈 확인 `대기`.
</details>
