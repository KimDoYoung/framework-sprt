# BBS-BZ-0005 직원이 기타신청서를 내고 경영관리가 처리한다

> **한 줄 요약** — 직원이 #1331 기타신청서 작성에서 [등록] → 신청구분(`ApplicationType`: 재직·경력증명서·징계내역확인서·경조화환)·비고·내용(구분별 양식이 채워짐)을 [저장]하고 **[신청]**하면 상태가 `신청(10)`이 된다(`bbs11_application`). 경영관리는 #1332 기타신청서 확인에서 신청상태를 `접수(20)` → `발급완료(91)`·`발송완료(92)`·`반려(95)`로 바꾸고 완료일·비고를 [저장]한다. **회사에 신청서 양식(`bbs12_application_form`)이 있어야** 목록에 나온다 — #1332 [양식관리] 창을 열면 없는 구분의 양식을 만든다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원 → 경영관리(301) |
| 언제 | 수시 |
| 먼저 있어야 하는 것 | 코드 `ApplicationType`·`ApplicationStatusCode`, 신청서 양식 |
| 다음 이벤트 | EMP-BZ-0013 증명서 발급(#1115) |
| 실제 실행 | 2026-11-14, kalpa API. 401 재직증명서 신청 `bbs11` +1 → [신청](`type P`) → **#1331 목록 0행** — AS-IS `bbs11_application.selectByPersonId`도 0 = 0(양식 INNER JOIN, kalpa 양식 0). 301 `GET /bbs/application-forms` → `bbs12` +4 → 401 목록 1행. 301 접수(20) → 발급완료(91). **401이 같은 관리 API로 자기 신청을 91로 바꿈 → 200**(⚠#259) → 301이 다시 처리 |
| 메뉴 | #1331 (5곳)·#1332 (5곳). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 0 | 경영관리 | #1332 | [양식관리] 창 열기 (`GET /bbs/application-forms` — 없는 구분 양식 생성) → 공개·내용 [저장] | 구분별 양식 |
| 1 | 직원 | #1331 | [등록] → 구분·비고·내용 → [저장] (`PUT /bbs/applications/mine`) → [신청] (`PUT /mine/{id}/status {type:"P"}`) | 신청 |
| 2 | 경영관리 | #1332 | 기간 → [조회] (`GET /bbs/applications/mng`) → 신청상태 `접수`·`발급완료`·완료일 → [저장] (`PUT /bbs/applications/mng`) | 상태 |
| 3 | 직원 | #1331 | [조회] (`GET /bbs/applications/mine`) | 발급완료 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `bbs12_application_form` | 회사별 신청서 양식 | +4 |
| `bbs11_application` | 신청서(상태·완료일·비고) | +1 |

## 업무 규칙 · 주의

- 양식이 없으면 저장은 되는데 목록에 안 나온다(원본 그대로). 회사 개설 때 KFS가 회사 0 양식을 복사하는 길(`SysCompanyMapper` 13번)도 있다 — kalpa는 그때 회사 0 양식이 없어 비었던 것으로 보임(미확인).
- 진행된 신청서는 삭제할 수 없다(화면).
- **사원이 경영관리용 API로 자기 신청을 완료 처리한다** → [#259](../../보안_및_버그_의심.md).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: BBS-BZ-0005
company: kalpa
steps:
  - {no: 0, user: 301, api: GET /api/v1/bbs/application-forms, expect: "bbs12 +4 (처음 한 번)"}
  - {no: 1, user: 401, api: PUT /api/v1/bbs/applications/mine, body: {appDate: 2026-11-14, appType: "10", note: "은행 제출용", content: "재직증명서 1부"}, expect: "bbs11 +1"}
  - {no: 2, user: 401, api: "PUT /api/v1/bbs/applications/mine/{id}/status", body: {type: P}}
  - {no: 3, user: 301, api: PUT /api/v1/bbs/applications/mng, body: [{applicationId: "{id}", appStatus: "91", closeDate: 2026-11-14, note: "발급 완료"}]}
  - {no: 4, user: 401, api: GET /api/v1/bbs/applications/mine?startDate=2026-11-01&closeDate=2026-11-30, expect: "rows 1, 발급완료"}
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Bbs11_Tab_Application.retrieve`(`selectByPersonId` — `bbs12_application_form` INNER JOIN), `Bbs11_Edit_Application`, `Bbs11_Tab_ApplicationMng`(`selectByResultCheck`), `Bbs12_Lookup_ApplicationMng.open → formCheck`.
- TOBE: `BbsApplicationController` L47·L57, `BbsApplicationFormService.search` L26-31.
</details>
