# ICS-BZ-0014 법규·대외활동 현황을 조회한다

> **한 줄 요약** — 이벤트가 만들어 둔 자료를 보는 **조회 화면 3개**다. ① #1336 법규조회: 분류·법규·조문 검색으로 법규(상세내용·제출처·관련조문·개정이력 수·주기·서식파일 수)를 본다 — 회사가 제외한 법규는 빠진다. ② #1255 월별 법규조회: 조회 월의 **처리기한이 있는 법규**를 대분류·중분류·주기·공개구분으로 걸러 본다(일일 주기 제외 선택). ③ #1432 대외활동 신청내역: 회사 전체의 대외활동 신청과 결재 상태·결과보고 상태를 보고, [조회기간 없이 결과보고 누락건만] 으로 결과보고를 안 한 건을 찾는다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 임직원(#1336·#1255), 준법감시 담당(#1432) |
| 언제 | 수시, 월초 처리기한 점검 |
| 먼저 있어야 하는 것 | 법규 마스터(0011), 회사의 법규 관리(0002), 대외활동 신청(0005) |
| 다음 이벤트 | — (읽기 전용) |
| 실제 실행 | kalpa, 2026-11-13. #1336 `GET /ics/laws/view` 총 185건(301). #1255 `GET /ics/laws/period` 2026-11 → `exceptDailyYn` 생략·true 166건, false 292건 — **AS-IS 쿼리와 292 = 292 일치**(기본값이 "일일 제외"). #1432 `GET /ics/extr-activities/company` 2026-01~12 → 1건(401의 한국금융연수원, 사례금 300,000, 결재 완료·결과보고 없음), AS-IS 대조 1 = 1(그리드 열 모두 포함). `unknown=true`(결과보고 누락건)도 1건. ⚠ 다른 부서 사원(402)도 #1432 전체를 본다 |
| 메뉴 | #1336 법규조회, #1255 월별 법규조회, #1432 준법감시 > 12. 대외활동 > 대외활동 신청내역. kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 임직원 | #1336 | 분류·법규검색·조문검색 → [조회] | 법규 목록, 줄의 개정이력·서식파일 셀 |
| 2 | 〃 | #1255 | 연·월 → 대분류·중분류·주기 → [조회] | 처리기한 순 법규 |
| 3 | 준법감시 담당 | #1432 | 기간 → [조회] | 신청 줄(신청자·활동처·기간·결재 상태) |
| 4 | 〃 | #1432 | [조회기간 없이 결과보고 누락건만 조회] 체크 | 결과보고 안 한 건 |

## DB에 남는 것

없음(읽기만).

## 업무 규칙 · 주의

- #1336은 회사가 제외한 법규를 빼고 관리그룹 정보를 함께 본다(`searchView`). 페이징 `total` 포함.
- #1255는 법규의 주기·처리기한(`sch03_deadline`·영업일 계산 `f_get_biz_date`)과 결재 마감일(`f_get_appr_close_date`)을 쓴다. 일일 주기는 기본으로 제외한다.
- #1432는 임시저장을 뺀 회사 전체 목록이다(원본 `selectByCompanyId`).
- ⚠ 메뉴 권한 말고는 막는 것이 없다 — 다른 부서 사원도 전 직원의 대외활동·사례금을 본다 → [의심 #146](../../보안_및_버그_의심.md).
- `yunhee compare`의 #1336(`selectByTypeCodePaging`)은 필수 파라미터가 많아 행 수 대조를 못 했다(API 185건·필드 확인만).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICS-BZ-0014
needs: [ICS-BZ-0002, ICS-BZ-0005]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: GET /api/v1/ics/laws/period?startDate=2026-11-01&closeDate=2026-11-30&exceptDailyYn=false
    expect: { rows: 292 }
  - no: 2
    actor: { company: kalpa, user: "402", password: "1111" }
    api: GET /api/v1/ics/extr-activities/company?startDate=2026-01-01&closeDate=2026-12-31
    expect: { rows: 1 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ics01_Tab_ClassTreeUserView`(#1336)·`Ics01_Tab_PeriodList`(#1255)·`Ics35_Tab_ExtrActivityList`(#1432) — 서버 `Ics01_ClassTree.selectByTypeCodePaging·selectByPeriod`, `Ics35_ExtrActivity.selectByCompanyId`.
- TOBE: `IcsLawController`(`/laws/view`·`/laws/period`)·`IcsExtrActivityController`(`/extr-activities/company`).
</details>
